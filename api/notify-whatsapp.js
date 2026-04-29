export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, signal } = req.body || {};

  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!signal) {
    return res.status(400).json({ error: "Missing signal" });
  }

  const accountSid = process.env.TWILIO_ACCOUNT_SID;
  const authToken  = process.env.TWILIO_AUTH_TOKEN;
  const from       = process.env.TWILIO_WHATSAPP_FROM;
  const recipients = (process.env.WHATSAPP_RECIPIENTS || "").split(",").map(s => s.trim()).filter(Boolean);

  if (!accountSid || !authToken || !from || recipients.length === 0) {
    return res.status(500).json({ error: "Twilio not configured" });
  }

  const dir   = signal.direction === "LONG" ? "▲ LONG" : "▼ SHORT";
  const entry = signal.risk?.entry ?? signal.entry ?? "—";
  const stop  = signal.risk?.stop  ?? signal.stop  ?? "—";
  const tp    = signal.risk?.firstTpPrice ?? signal.risk?.tp ?? "—";
  const rr    = signal.risk?.rr ?? "—";
  const time  = signal.time ?? "";

  const body = [
    "🔔 SIGNAL BOSS",
    "",
    `${dir} ${signal.instrument}`,
    signal.name || "",
    "",
    `Entry:  ${entry}`,
    `Stop:   ${stop}`,
    tp !== "—" ? `Target: ${tp}` : null,
    rr !== "—" ? `R:R ${rr}` : null,
    time ? `\n⏰ ${time}` : null,
    "\nsignalboss.net",
  ].filter(line => line !== null).join("\n");

  const credentials = Buffer.from(`${accountSid}:${authToken}`).toString("base64");
  const url = `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`;

  const results = await Promise.allSettled(
    recipients.map(to =>
      fetch(url, {
        method: "POST",
        headers: {
          Authorization: `Basic ${credentials}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({ From: from, To: `whatsapp:${to}`, Body: body }),
      }).then(r => r.json())
    )
  );

  const errors = results.filter(r => r.status === "rejected" || r.value?.code).map(r => r.reason || r.value);
  if (errors.length > 0) {
    console.error("WhatsApp send errors:", errors);
    return res.status(502).json({ error: "Some messages failed", details: errors });
  }

  return res.status(200).json({ ok: true, sent: recipients.length });
}
