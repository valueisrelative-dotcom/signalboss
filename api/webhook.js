import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const config = { api: { bodyParser: false } };

async function getRawBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", chunk => chunks.push(chunk));
    req.on("end", () => resolve(Buffer.concat(chunks)));
    req.on("error", reject);
  });
}

async function grantDashboardAccess(userId, plan, customerId) {
  const resp = await fetch(`https://api.clerk.com/v1/users/${userId}/metadata`, {
    method: "PATCH",
    headers: {
      "Authorization": `Bearer ${process.env.CLERK_SECRET_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      public_metadata: {
        subscribed:   true,
        plan:         plan || "pro",
        customerId:   customerId || null,
        subscribedAt: new Date().toISOString(),
      },
    }),
  });
  if (!resp.ok) {
    const err = await resp.json();
    throw new Error(`Clerk metadata update failed: ${JSON.stringify(err)}`);
  }
  return resp.json();
}

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const sig     = req.headers["stripe-signature"];
  const rawBody = await getRawBody(req);

  let event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Webhook signature failed:", err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  // ── Payment confirmed → unlock dashboard ──
  if (event.type === "checkout.session.completed") {
    const session    = event.data.object;
    const userId     = session.metadata?.userId;
    const plan       = session.metadata?.plan;
    const ref        = session.metadata?.ref || "";
    const customerId = session.customer;
    const email      = session.customer_details?.email;

    console.log("✅ Payment confirmed:", { userId, plan, customerId, email, ref });

    if (userId) {
      try {
        await grantDashboardAccess(userId, plan, customerId);
        console.log(`✅ Clerk access granted — user ${userId} plan ${plan}`);
      } catch (err) {
        console.error("❌ Failed to grant Clerk access:", err.message);
        // Still return 200 so Stripe doesn't retry; log for manual follow-up
      }
    } else {
      console.warn("⚠️  No userId in session metadata — cannot grant access automatically");
    }

    // ── Affiliate notification ──
    if (ref === "latimax") {
      try {
        await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Authorization": `Bearer ${process.env.RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "Signal Boss <onboarding@resend.dev>",
            to:   ["alberto13777@gmail.com"],
            subject: "💰 New Signal Boss referral — you earned a commission",
            text: [
              "Alberto,",
              "",
              "Someone subscribed to Signal Boss using your referral link.",
              "",
              `Plan  : ${plan || "unknown"}`,
              `Email : ${email || "(not shared)"}`,
              "",
              "Your commission will be settled at the end of the month.",
              "",
              "— Signal Boss",
            ].join("\n"),
          }),
        });
      } catch (err) {
        console.error("Affiliate email failed:", err.message);
      }
    }
  }

  // ── Subscription cancelled → revoke dashboard ──
  if (event.type === "customer.subscription.deleted") {
    const sub    = event.data.object;
    const custId = sub.customer;
    console.log("🚫 Subscription cancelled for customer:", custId);
    // Clerk doesn't store customerId yet on first run; will add lookup on next iteration
  }

  return res.status(200).json({ received: true });
}
