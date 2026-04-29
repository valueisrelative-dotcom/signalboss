const GIST_ID = "336ce62861f67be83d1fdbd34576f4c5";

const NAMES = {
  ES:  "E-mini S&P 500",
  NQ:  "E-mini Nasdaq 100",
  YM:  "E-mini Dow Jones",
  RTY: "E-mini Russell 2000",
  CL:  "Crude Oil",
  GC:  "Gold",
  ZN:  "10-Year T-Note",
  ZF:  "5-Year T-Note",
  ZT:  "2-Year T-Note",
};

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, instrument, date, time, direction, entry, stop, exitPrice, status, pnlUsd, notes } = req.body || {};

  if (token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  if (!instrument || !date || !direction || !status) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const githubToken = process.env.GITHUB_TOKEN;

  try {
    // Fetch current history.json from Gist
    const gistRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      headers: {
        Authorization: `token ${githubToken}`,
        Accept: "application/vnd.github.v3+json",
      },
    });

    if (!gistRes.ok) {
      return res.status(502).json({ error: "Failed to fetch Gist" });
    }

    const gistData = await gistRes.json();
    const rawContent = gistData?.files?.["history.json"]?.content || "{}";
    let historyPayload;
    try {
      historyPayload = JSON.parse(rawContent);
    } catch {
      historyPayload = {};
    }

    const existingHistory = Array.isArray(historyPayload.history) ? historyPayload.history : [];

    const newRecord = {
      id:         `${instrument}-${date}-manual`,
      instrument,
      name:       NAMES[instrument] || instrument,
      type:       "VOLATILITY_ORB",
      date,
      time:       time || "N/A",
      direction,
      entry:      typeof entry === "number" ? entry : parseFloat(entry) || 0,
      stop:       typeof stop  === "number" ? stop  : parseFloat(stop)  || 0,
      exitPrice:  typeof exitPrice === "number" ? exitPrice : parseFloat(exitPrice) || 0,
      status,
      pnlUsd:     typeof pnlUsd === "number" ? pnlUsd : parseFloat(pnlUsd) || 0,
      ...(notes ? { notes } : {}),
    };

    const updatedHistory = [newRecord, ...existingHistory];

    // PATCH the Gist
    const patchRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        files: {
          "history.json": {
            content: JSON.stringify({ history: updatedHistory }, null, 2),
          },
        },
      }),
    });

    if (!patchRes.ok) {
      const errData = await patchRes.json().catch(() => ({}));
      return res.status(502).json({ error: "Failed to update Gist", detail: errData });
    }

    return res.status(200).json({ ok: true, id: newRecord.id });
  } catch (err) {
    console.error("admin-history error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
