import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const PRICE_IDS = {
  starter: "price_1TCsDRL2fuY9NeKvZYpdvHvC",  // Futures Starter $149
  pro:     "price_1TCsR4L2fuY9NeKv9Gu8PioR",  // Futures Pro     $249
  elite:   "price_1TCsS9L2fuY9NeKvuKNzIwjE",  // Futures Elite   $449
  major:   "price_1TCsT0L2fuY9NeKvD8xpODa6",  // Forex Major     $129
  full:    "price_1TCsTYL2fuY9NeKviIGqlOi4",  // Forex Full      $249
};

async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let data = "";
    req.on("data", chunk => data += chunk);
    req.on("end", () => { try { resolve(JSON.parse(data)); } catch(e) { reject(e); } });
    req.on("error", reject);
  });
}

export default async function handler(req, res) {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "https://signalboss.net");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { userId, email, plan, ref } = await parseBody(req);

  const priceId = PRICE_IDS[plan];
  if (!priceId) {
    return res.status(400).json({ error: `Unknown plan: ${plan}` });
  }

  const meta = { userId, plan, ...(ref ? { ref } : {}) };

  const AFFILIATE_COUPONS = { latimax: "LATIMAX25" };
  const coupon = ref ? AFFILIATE_COUPONS[ref] : null;

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      metadata: meta,
      subscription_data: { metadata: meta },
      ...(coupon ? { discounts: [{ coupon }] } : { allow_promotion_codes: true }),
      success_url: "https://signalboss.net/?payment=success",
      cancel_url:  "https://signalboss.net/?payment=cancelled",
    });

    return res.status(200).json({ url: session.url });
  } catch (err) {
    console.error("Checkout session error:", err.message);
    return res.status(500).json({ error: err.message });
  }
}
