import express from "express";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({
  origin: process.env.ALLOWED_ORIGIN || "*" // restrict to your site in production
}));
app.use(express.json());

const GEMINI_MODEL = "gemini-2.5-flash";
const API_BASE = "https://generativelanguage.googleapis.com/v1beta/models";

app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;
    if (!prompt) return res.status(400).json({ error: "Missing prompt" });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return res.status(500).json({ error: "Server missing API key" });

    const url = `${API_BASE}/${GEMINI_MODEL}:generateContent?key=${apiKey}`;

    const response = await axios.post(url, {
      contents: [{ parts: [{ text: prompt }] }]
    }, {
      timeout: 30000
    });

    // send the Gemini text back (simple shape)
    const candidateText =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      null;

    return res.json({ raw: response.data, text: candidateText });
  } catch (err) {
    console.error("Backend Gemini Error:", err.response?.data || err.message);
    // Send limited information to client
    return res.status(500).json({ error: "Gemini API failed", detail: err.message });
  }
});

// simple health check
app.get("/", (req, res) => res.send("SS Clinic backend is running"));

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Backend running on port ${port}`));
