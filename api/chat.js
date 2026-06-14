import { applyCors, readBody } from "./_utils.js";

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { prompt } = readBody(req);
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Server is not configured for chat." });
    }

    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );

    const data = await resp.json();
    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("chat error:", err);
    return res.status(500).json({ error: "Backend error" });
  }
}
