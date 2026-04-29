"""
Signal Boss — Stripe Webhook & Signal Server
Runs alongside the engine on the same machine / VPS.
Port: 4242

Endpoints:
  POST /create-checkout-session   Called by frontend when user selects a plan
  POST /webhook                   Stripe sends payment events here
  POST /manual-signal             Admin posts a manual signal card (auth: X-Admin-Key)
  POST /update-signal             Admin marks a signal outcome
  GET  /history                   Returns merged signal history
  GET  /health                    Health check
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import stripe
import requests
import json
import os
import urllib.request
import urllib.parse
from datetime import datetime, timezone
from zoneinfo import ZoneInfo

app = Flask(__name__)
CORS(app, origins=[
    "http://localhost:5173", "http://localhost:5174",
    "http://localhost:5175", "http://localhost:5176",
    "https://signalboss.net", "https://www.signalboss.net",
])

STRIPE_SECRET_KEY     = os.environ.get("STRIPE_SECRET_KEY",     "")
STRIPE_WEBHOOK_SECRET = os.environ.get("STRIPE_WEBHOOK_SECRET", "")
CLERK_SECRET_KEY      = os.environ.get("CLERK_SECRET_KEY",      "")
ADMIN_API_KEY         = os.environ.get("ADMIN_API_KEY",          "sb_admin_2026_jr")
DOMAIN                = os.environ.get("DOMAIN", "https://signalboss.net")

stripe.api_key = STRIPE_SECRET_KEY

PRICE_IDS = {
    "starter": os.environ.get("STRIPE_PRICE_STARTER", ""),
    "pro":     os.environ.get("STRIPE_PRICE_PRO",     ""),
    "elite":   os.environ.get("STRIPE_PRICE_ELITE",   ""),
    "major":   os.environ.get("STRIPE_PRICE_MAJOR",   ""),
    "full":    os.environ.get("STRIPE_PRICE_FULL",    ""),
}

_INST_META = {
    "ES":  {"name": "E-mini S&P 500",      "tick_size": 0.25,    "tick_value": 12.50, "stop_ticks": 14},
    "NQ":  {"name": "E-mini Nasdaq 100",   "tick_size": 0.25,    "tick_value":  5.00, "stop_ticks": 37},
    "CL":  {"name": "Crude Oil",           "tick_size": 0.01,    "tick_value": 10.00, "stop_ticks": 24},
    "GC":  {"name": "Gold",                "tick_size": 0.10,    "tick_value": 10.00, "stop_ticks": 14},
    "RTY": {"name": "E-mini Russell 2000", "tick_size": 0.10,    "tick_value":  5.00, "stop_ticks": 18},
    "ZN":  {"name": "10-Year T-Note",      "tick_size": 0.015625,"tick_value": 15.625,"stop_ticks": 10},
    "6E":  {"name": "Euro FX",             "tick_size": 0.00005, "tick_value":  6.25, "stop_ticks": 10},
}

ET = ZoneInfo("America/New_York")
HISTORY_FILE           = "/root/signalboss/signal_history.json"
PERMANENT_HISTORY_FILE = "/root/signalboss/history_permanent.json"
_TV = {"ES": 12.5, "NQ": 5.0, "YM": 5.0, "RTY": 5.0, "CL": 10.0, "GC": 10.0, "ZN": 15.625}


# ── WhatsApp ──────────────────────────────────────────────────────────────────

def _whatsapp_send(card):
    """Fire-and-forget POST to Vercel WhatsApp endpoint."""
    try:
        payload = json.dumps({"token": ADMIN_API_KEY, "signal": card}).encode()
        req = urllib.request.Request(
            f"{DOMAIN}/api/notify-whatsapp",
            data=payload,
            method="POST",
            headers={"Content-Type": "application/json"},
        )
        urllib.request.urlopen(req, timeout=10)
        print("  ✅ WhatsApp sent")
    except Exception as e:
        print(f"  ⚠️  WhatsApp send error: {e}")


# ── Signal History helpers ────────────────────────────────────────────────────

def _history_read():
    if not os.path.exists(HISTORY_FILE):
        return []
    try:
        with open(HISTORY_FILE, "r") as f:
            return json.load(f)
    except Exception:
        return []


def _history_write(records):
    with open(HISTORY_FILE, "w") as f:
        json.dump(records, f, indent=2)


def _make_history_record(card):
    risk     = card.get("risk", {})
    inst     = card["instrument"]
    tick_val = _INST_META.get(inst, {}).get("tick_value", 5.0)
    tp = risk.get("tp2_0Price") or risk.get("tp2_5Price") or 0
    return {
        "id":            card["id"],
        "instrument":    inst,
        "name":          card.get("name", inst),
        "direction":     card["direction"],
        "type":          card.get("type", "UNKNOWN"),
        "triggerDetail": card.get("triggerDetail", card.get("trigger", "")),
        "entry":         card.get("price", 0),
        "stop":          risk.get("stopPrice", 0),
        "tp":            tp,
        "stop_ticks":    risk.get("stopTicks", 0),
        "tick_value":    tick_val,
        "rr":            risk.get("suggestedRR", 2.0),
        "date":          card.get("date", ""),
        "time":          card.get("time", ""),
        "status":        "ACTIVE",
        "outcome_ts":    None,
    }


def _history_append(record):
    records = _history_read()
    if not any(r["id"] == record["id"] for r in records):
        records.insert(0, record)
        _history_write(records)


def _history_update_outcome(sig_id, status):
    records = _history_read()
    for r in records:
        if r["id"] == sig_id:
            r["status"] = status
            r["outcome_ts"] = datetime.now(ET).strftime("%Y-%m-%d %H:%M")
            break
    _history_write(records)


# ── Gist helpers ──────────────────────────────────────────────────────────────

def _gist_fetch_signals():
    try:
        import sys
        sys.path.insert(0, "/root/signalboss")
        from config import GITHUB_TOKEN, GIST_ID
        req = urllib.request.Request(
            f"https://api.github.com/gists/{GIST_ID}",
            headers={
                "Authorization": f"token {GITHUB_TOKEN}",
                "Accept": "application/vnd.github.v3+json",
            },
        )
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read())
        raw = data["files"].get("signals.json", {}).get("content", "{}")
        return json.loads(raw).get("signals", [])
    except Exception as e:
        print(f"  ⚠️  Gist fetch error: {e}")
        return []


def _gist_push_signals(signals):
    try:
        import sys
        sys.path.insert(0, "/root/signalboss")
        from config import GITHUB_TOKEN, GIST_ID
        payload = json.dumps({
            "files": {
                "signals.json": {
                    "content": json.dumps({"signals": signals}, indent=2)
                }
            }
        }).encode()
        req = urllib.request.Request(
            f"https://api.github.com/gists/{GIST_ID}",
            data=payload, method="PATCH",
            headers={
                "Authorization": f"token {GITHUB_TOKEN}",
                "Content-Type":  "application/json",
                "Accept":        "application/vnd.github.v3+json",
            },
        )
        urllib.request.urlopen(req, timeout=10)
        print("  ✅ Gist updated")
    except Exception as e:
        print(f"  ⚠️  Gist push error: {e}")


# ── Checkout session ──────────────────────────────────────────────────────────

@app.route("/create-checkout-session", methods=["POST"])
def create_checkout_session():
    try:
        data          = request.json
        clerk_user_id = data.get("userId")
        email         = data.get("email", "")
        plan          = data.get("plan", "pro")

        if plan not in PRICE_IDS:
            return jsonify({"error": f"Unknown plan: {plan}"}), 400

        session = stripe.checkout.Session.create(
            mode="subscription",
            customer_email=email,
            client_reference_id=clerk_user_id,
            line_items=[{"price": PRICE_IDS[plan], "quantity": 1}],
            payment_method_types=["card"],
            subscription_data={"metadata": {"plan": plan, "clerk_user_id": clerk_user_id}},
            success_url=f"{DOMAIN}/?subscribed=true",
            cancel_url=f"{DOMAIN}/?cancelled=true",
        )
        return jsonify({"url": session.url})

    except stripe.StripeError as e:
        return jsonify({"error": str(e)}), 400
    except Exception:
        return jsonify({"error": "Server error"}), 500


# ── Stripe webhook ────────────────────────────────────────────────────────────

@app.route("/webhook", methods=["POST"])
def stripe_webhook():
    payload = request.get_data()
    sig     = request.headers.get("Stripe-Signature", "")

    try:
        event = stripe.Webhook.construct_event(payload, sig, STRIPE_WEBHOOK_SECRET)
    except stripe.errors.SignatureVerificationError:
        return "Bad signature", 400
    except Exception as e:
        return str(e), 400

    etype = event["type"]
    print(f"  Stripe event: {etype}")

    if etype == "checkout.session.completed":
        session       = event["data"]["object"]
        clerk_user_id = session.get("client_reference_id")
        plan          = (session.get("metadata") or {}).get("plan", "pro")
        stripe_cid    = session.get("customer")
        if clerk_user_id:
            _update_clerk_metadata(clerk_user_id, {
                "subscribed": True, "plan": plan, "stripeCustomerId": stripe_cid,
            })
            print(f"  ✅ Subscribed: {clerk_user_id}  plan={plan}")

    elif etype in ("customer.subscription.deleted",
                   "customer.subscription.paused",
                   "invoice.payment_failed"):
        obj        = event["data"]["object"]
        stripe_cid = obj.get("customer")
        if stripe_cid:
            clerk_user_id = _find_clerk_user_by_stripe_id(stripe_cid)
            if clerk_user_id:
                _update_clerk_metadata(clerk_user_id, {"subscribed": False, "plan": None})
                print(f"  ❌ Unsubscribed: {clerk_user_id}  reason={etype}")

    elif etype == "invoice.payment_succeeded":
        obj        = event["data"]["object"]
        stripe_cid = obj.get("customer")
        if stripe_cid:
            clerk_user_id = _find_clerk_user_by_stripe_id(stripe_cid)
            if clerk_user_id:
                _update_clerk_metadata(clerk_user_id, {"subscribed": True})
                print(f"  🔄 Renewed: {clerk_user_id}")

    return "", 200


# ── Manual Signal ─────────────────────────────────────────────────────────────

@app.route("/manual-signal", methods=["POST"])
def manual_signal():
    if request.headers.get("X-Admin-Key", "") != ADMIN_API_KEY:
        return jsonify({"error": "Unauthorized"}), 401

    try:
        data       = request.json or {}
        instrument = data.get("instrument", "").upper().strip()
        direction  = data.get("direction", "").upper().strip()
        note       = data.get("note", "").strip()

        if not instrument or direction not in ("LONG", "SHORT"):
            return jsonify({"error": "instrument and direction (LONG/SHORT) required"}), 400

        meta       = _INST_META.get(instrument, {"name": instrument, "tick_size": 0.25, "tick_value": 5.00, "stop_ticks": 20})
        tick_size  = meta["tick_size"]
        tick_value = meta["tick_value"]
        stop_ticks = meta["stop_ticks"]
        stop_pts   = stop_ticks * tick_size

        now_et = datetime.now(timezone.utc).astimezone(ET)

        price      = float(data.get("price", 0) or 0)
        stop_price = float(data.get("stop",  0) or 0) or (
            round(price - stop_pts, 4) if direction == "LONG" else round(price + stop_pts, 4)
        )
        tp_price   = float(data.get("tp",    0) or 0) or (
            round(price + stop_pts * 2.5, 4) if direction == "LONG" else round(price - stop_pts * 2.5, 4)
        )

        card = {
            "id":            f"MANUAL-{instrument}-{int(now_et.timestamp())}",
            "instrument":    instrument,
            "name":          meta["name"],
            "direction":     direction,
            "price":         price,
            "time":          now_et.strftime("%I:%M %p").lstrip("0"),
            "date":          now_et.strftime("%Y-%m-%d"),
            "status":        "ACTIVE",
            "trigger":       "SB_CRITERIA",
            "triggerDetail": note or "SB Criteria Met",
            "type":          "SB_CRITERIA",
            "note":          note,
            "session":       "Manual",
            "risk": {
                "stopPrice":   stop_price,
                "stopUsd":     round(stop_ticks * tick_value, 2),
                "stopTicks":   stop_ticks,
                "tp2_5Price":  tp_price,
                "tp2_5Usd":    round(stop_ticks * tick_value * 2.5, 2),
                "suggestedRR": 2.5,
            },
        }

        _history_append(_make_history_record(card))

        current = _gist_fetch_signals()
        for s in current:
            if s.get("instrument") == instrument and s.get("status") == "ACTIVE" and s.get("direction") != direction:
                s["status"] = "CANCELLED"
        current.insert(0, card)
        current = current[:20]
        _gist_push_signals(current)

        _whatsapp_send(card)

        print(f"  ✅ Manual signal: {direction} {instrument}  note='{note}'")
        return jsonify({"status": "ok", "id": card["id"]})

    except Exception as e:
        print(f"  ⚠️  /manual-signal error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Update signal outcome ─────────────────────────────────────────────────────

@app.route("/update-signal", methods=["POST"])
def update_signal():
    if request.headers.get("X-Admin-Key", "") != ADMIN_API_KEY:
        return jsonify({"error": "Unauthorized"}), 401
    try:
        data    = request.json or {}
        sig_id  = data.get("id", "").strip()
        outcome = data.get("outcome", "").upper().strip()
        if not sig_id or outcome not in ("WIN", "LOSS", "CANCELLED", "ACTIVE"):
            return jsonify({"error": "id and outcome (WIN/LOSS/CANCELLED/ACTIVE) required"}), 400
        signals = _gist_fetch_signals()
        updated = False
        for s in signals:
            if s.get("id") == sig_id:
                s["status"] = outcome
                updated = True
                break
        if not updated:
            return jsonify({"error": f"Signal {sig_id} not found"}), 404
        _gist_push_signals(signals)
        _history_update_outcome(sig_id, outcome)
        print(f"  ✅ Signal {sig_id} → {outcome}")
        return jsonify({"status": "ok", "id": sig_id, "outcome": outcome})
    except Exception as e:
        print(f"  ⚠️  /update-signal error: {e}")
        return jsonify({"error": str(e)}), 500


# ── Signal History ────────────────────────────────────────────────────────────

def _engine_history_read():
    try:
        if not os.path.exists(PERMANENT_HISTORY_FILE):
            return []
        with open(PERMANENT_HISTORY_FILE) as f:
            records = json.load(f)
        out = []
        for e in records:
            sym = e.get("symbol", "")
            tv  = _TV.get(sym, 12.5)
            su  = e.get("stop_usd", 0)
            st  = round(su / tv) if tv else 0
            def edt(s):
                try:
                    return datetime.strptime(s, "%Y-%m-%d %H:%M")
                except Exception:
                    return datetime.now()
            ee = edt(e.get("entry_time", ""))
            xe = edt(e.get("exit_time", ""))
            out.append({
                "id":            e.get("id", ""),
                "instrument":    sym,
                "name":          e.get("name", sym),
                "direction":     e.get("direction", ""),
                "type":          "VOLATILITY_ORB",
                "triggerDetail": "Volatility Aligned ORB",
                "entry":         e.get("entry", 0),
                "stop":          e.get("stop", 0),
                "tp":            e.get("first_tp", 0),
                "stop_ticks":    st,
                "tick_value":    tv,
                "rr":            3.0,
                "date":          ee.strftime("%Y-%m-%d"),
                "time":          ee.strftime("%H:%M"),
                "status":        e.get("outcome", "ACTIVE"),
                "exitPrice":     e.get("exit", 0),
                "exitTime":      xe.strftime("%Y-%m-%d %H:%M"),
                "ticks":         e.get("ticks", 0),
                "pnlUsd":        e.get("pnl_usd", 0),
                "outcome_ts":    None,
            })
        return out
    except Exception as ex:
        print(f"Warning: {ex}")
        return []


@app.route("/history", methods=["GET"])
def get_history():
    engine = _engine_history_read()
    manual = _history_read()
    covered = {(r.get("date", ""), r.get("instrument", "")) for r in manual}
    engine_filtered = [
        r for r in engine
        if (r.get("date", ""), r.get("instrument", "")) not in covered
    ]
    seen, merged = set(), []
    for r in engine_filtered + manual:
        rid = r.get("id", "")
        if rid not in seen:
            seen.add(rid)
            merged.append(r)
    merged.sort(key=lambda x: x.get("date", "") + " " + x.get("time", ""), reverse=True)
    return jsonify(merged)


# ── Health check ──────────────────────────────────────────────────────────────

@app.route("/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "service": "SignalBoss Webhook Server"})


if __name__ == "__main__":
    print("Signal Boss — Webhook Server")
    print("Listening on port 4242\n")
    app.run(host="0.0.0.0", port=4242, debug=False)
