// Required Vercel env vars:
//   TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM (e.g. whatsapp:+14155238886)
//   WHATSAPP_RECIPIENTS  — comma-separated E.164 numbers, e.g. +14196319908,+15551234567
//   ADMIN_TOKEN          — matches the token sent by the admin panel and the VPS

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, signal } = req.body || {};

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const accountSid    = process.env.TWILIO_ACCOUNT_SID;
  const authToken     = process.env.TWILIO_AUTH_TOKEN;
  const from          = process.env.TWILIO_WHATSAPP_FROM;
  const recipientsRaw = process.env.WHATSAPP_RECIPIENTS || "+14196319908";

  if (!accountSid || !authToken || !from) {
    return res.status(503).json({ error: "WhatsApp not configured — set TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_WHATSAPP_FROM in Vercel" });
  }

  if (!signal || !signal.instrument || !signal.direction) {
    return res.status(400).json({ error: "Missing signal fields (instrument, direction required)" });
  }

  const recipients = recipientsRaw.split(",").map(r => r.trim()).filter(Boolean);

  const dir     = signal.direction === "LONG" ? "▲ LONG" : "▼ SHORT";
  const entry   = signal.price != null ? Number(signal.price).toLocaleString("en-US") : "–";
  const stop    = signal.risk?.stopPrice != null ? Number(signal.risk.stopPrice).toLocaleString("en-US") : (signal.stop != null ? String(signal.stop) : "–");
  const tp      = signal.risk?.firstTpPrice != null ? Number(signal.risk.firstTpPrice).toLocaleString("en-US") : (signal.tp != null ? String(signal.tp) : "–");
  const stopUsd = signal.risk?.stopUsd   ? ` (-$${signal.risk.stopUsd})`   : "";
  const tpUsd   = signal.risk?.firstTpUsd ? ` (+$${signal.risk.firstTpUsd})` : "";
  const rr      = signal.risk?.rr ? `R:R ${signal.risk.rr}:1` : "";
  const time    = signal.time || new Date().toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", timeZone: "America/New_York" }) + " ET";

  const lines = [
    "🔔 SIGNAL BOSS",
    "",
    `${dir} ${signal.instrument}`,
    signal.name || "",
    "",
    `Entry:  ${entry}`,
    `Stop:   ${stop}${stopUsd}`,
    `Target: ${tp}${tpUsd}`,
    rr,
    "",
    `⏰ ${time}`,
    "signalboss.net",
  ].filter((l, i, a) => !(l === "" && (i === 0 || a[i - 1] === "")));

  const body        = lines.join("\n");
  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const url         = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const results = await Promise.allSettled(
    recipients.map(async (to) => {
      const params = new URLSearchParams();
      params.set("From", from.startsWith("whatsapp:") ? from : `whatsapp:${from}`);
      params.set("To",   `whatsapp:${to}`);
      params.set("Body", body);

      const resp = await fetch(url, {
        method:  "POST",
        headers: { "Authorization": `Basic ${credentials}`, "Content-Type": "application/x-www-form-urlencoded" },
        body:    params.toString(),
      });

      if (!resp.ok) {
        const err = await resp.json().catch(() => ({}));
        throw new Error(err.message || `HTTP ${resp.status}`);
      }
      return { to, ok: true };
    })
  );

  const sent   = results.filter(r => r.status === "fulfilled").length;
  const errors = results.filter(r => r.status === "rejected").map(r => r.reason?.message);

  console.log(`WhatsApp: sent ${sent}/${recipients.length}`, errors.length ? errors : "");
  return res.status(200).json({ sent, total: recipients.length, errors });
}
