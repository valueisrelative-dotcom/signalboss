const GIST_ID = "336ce62861f67be83d1fdbd34576f4c5";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { token, message, clear } = req.body || {};

  if (!token || token !== process.env.ADMIN_TOKEN) {
    return res.status(403).json({ error: "Unauthorized" });
  }

  const githubToken = process.env.GITHUB_TOKEN;

  const broadcastContent = clear
    ? { message: "", active: false }
    : { message: message || "", active: true };

  try {
    const patchRes = await fetch(`https://api.github.com/gists/${GIST_ID}`, {
      method: "PATCH",
      headers: {
        Authorization: `token ${githubToken}`,
        "Content-Type": "application/json",
        Accept: "application/vnd.github.v3+json",
      },
      body: JSON.stringify({
        files: {
          "broadcast.json": {
            content: JSON.stringify(broadcastContent, null, 2),
          },
        },
      }),
    });

    if (!patchRes.ok) {
      const errData = await patchRes.json().catch(() => ({}));
      return res.status(502).json({ error: "Failed to update Gist", detail: errData });
    }

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("admin-broadcast error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
