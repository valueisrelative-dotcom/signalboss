import { Webhook } from "svix";

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const secret = process.env.CLERK_WEBHOOK_SECRET;
  if (!secret) {
    console.error("CLERK_WEBHOOK_SECRET not set");
    return res.status(500).json({ error: "Webhook secret not configured" });
  }

  const rawBody = await getRawBody(req);

  // Verify Clerk signature
  const wh = new Webhook(secret);
  let event;
  try {
    event = wh.verify(rawBody, {
      "svix-id":        req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],
      "svix-signature": req.headers["svix-signature"],
    });
  } catch (err) {
    console.error("Clerk webhook signature failed:", err.message);
    return res.status(400).json({ error: "Invalid signature" });
  }

  // Only handle new user signups
  if (event.type !== "user.created") {
    return res.status(200).json({ ok: true, skipped: true });
  }

  const { id, email_addresses, first_name, last_name, created_at } = event.data;
  const email   = email_addresses?.[0]?.email_address ?? "(no email)";
  const name    = [first_name, last_name].filter(Boolean).join(" ") || "(no name)";
  const ts      = new Date(created_at).toLocaleString("en-US", {
    timeZone: "America/New_York",
    dateStyle: "medium",
    timeStyle: "short",
  });

  // Send notification to info@signalboss.net
  try {
    const resp = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "Signal Boss Alerts <onboarding@resend.dev>",
        to:   ["info@signalboss.net"],
        subject: `🆕 New Signup: ${email}`,
        text: [
          "New user signed up on Signal Boss.",
          "",
          `Name    : ${name}`,
          `Email   : ${email}`,
          `Clerk ID: ${id}`,
          `Time    : ${ts} ET`,
          "",
          "No payment on file yet. Check Clerk dashboard if needed.",
          "https://dashboard.clerk.com",
        ].join("\n"),
      }),
    });

    if (!resp.ok) {
      const err = await resp.json();
      console.error("Resend error:", err);
    }
  } catch (err) {
    console.error("Email send failed:", err.message);
  }

  return res.status(200).json({ ok: true });
}
