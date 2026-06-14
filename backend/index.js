import express from "express";
import cors from "cors";
import axios from "axios";
import crypto from "crypto";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// ------------ CORS ------------
const allowedOrigins = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173,https://ssclinickudlu.com,https://www.ssclinickudlu.com,https://ss-clinic-1.onrender.com"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      // allow non-browser clients (no origin) and whitelisted origins
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  })
);

// ------------ OTP CONFIG ------------
const OTP_TTL_MS = 5 * 60 * 1000; // code valid for 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // min 60s between sends to one email
const MAX_VERIFY_ATTEMPTS = 5; // wrong tries before code is invalidated
const MAX_SENDS_PER_WINDOW = 5; // sends allowed per email per window
const SEND_WINDOW_MS = 60 * 60 * 1000; // 1 hour
const TOKEN_TTL_MS = 30 * 60 * 1000; // verification token valid 30 min

// Secret used to hash OTPs and sign verification tokens.
// Set OTP_SECRET in env for stability across restarts; otherwise a random
// per-process secret is used (existing OTPs/tokens become invalid on restart).
const OTP_SECRET =
  process.env.OTP_SECRET || crypto.randomBytes(32).toString("hex");

// In-memory OTP store. email -> { hash, expiresAt, attempts, lastSentAt, sendCount, windowStart }
// Note: single-instance only. For multi-instance/persistent use, move this to Redis.
const otpStore = new Map();

const normalizeEmail = (e) => String(e || "").trim().toLowerCase();
const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const hashOtp = (email, otp) =>
  crypto.createHmac("sha256", OTP_SECRET).update(`${email}:${otp}`).digest("hex");

const timingSafeEqualHex = (a, b) => {
  const ba = Buffer.from(a, "hex");
  const bb = Buffer.from(b, "hex");
  if (ba.length !== bb.length) return false;
  return crypto.timingSafeEqual(ba, bb);
};

const issueVerificationToken = (email) => {
  const exp = Date.now() + TOKEN_TTL_MS;
  const payload = `${email}:${exp}`;
  const sig = crypto.createHmac("sha256", OTP_SECRET).update(payload).digest("hex");
  return Buffer.from(`${payload}:${sig}`).toString("base64url");
};

// Periodic cleanup of expired records
setInterval(() => {
  const now = Date.now();
  for (const [email, rec] of otpStore) {
    const expired = !rec.expiresAt || rec.expiresAt < now;
    const windowDone = !rec.windowStart || now - rec.windowStart > SEND_WINDOW_MS;
    if (expired && windowDone) otpStore.delete(email);
  }
}, 10 * 60 * 1000).unref?.();

// Send the OTP email through EmailJS's server-side REST API.
async function sendOtpEmail(email, otp) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_OTP_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error(
      "EmailJS server credentials missing. Set EMAILJS_SERVICE_ID, EMAILJS_OTP_TEMPLATE_ID, EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY."
    );
  }

  await axios.post("https://api.emailjs.com/api/v1.0/email/send", {
    service_id: serviceId,
    template_id: templateId,
    user_id: publicKey,
    accessToken: privateKey, // required for non-browser (server) calls
    template_params: {
      to_email: email,
      otp,
      clinic_name: "SS Clinic",
      expiry_minutes: Math.round(OTP_TTL_MS / 60000),
    },
  });
}

// ------------ HEALTH ROUTE ------------
app.get("/health", (req, res) => {
  res.send("ok");
});

// ------------ SEND OTP ------------
app.post("/send-otp", async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Please provide a valid email address." });
    }

    const now = Date.now();
    const existing = otpStore.get(email) || { sendCount: 0, windowStart: now };

    // Reset the hourly send window if it has elapsed
    if (now - existing.windowStart > SEND_WINDOW_MS) {
      existing.sendCount = 0;
      existing.windowStart = now;
    }

    // Cooldown between consecutive sends
    if (existing.lastSentAt && now - existing.lastSentAt < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - (now - existing.lastSentAt)) / 1000);
      return res
        .status(429)
        .json({ error: `Please wait ${wait}s before requesting another code.` });
    }

    // Hourly cap
    if (existing.sendCount >= MAX_SENDS_PER_WINDOW) {
      return res
        .status(429)
        .json({ error: "Too many OTP requests. Please try again later." });
    }

    const otp = String(crypto.randomInt(100000, 1000000)); // always 6 digits

    // Send email first; only store the code if the email actually goes out.
    await sendOtpEmail(email, otp);

    otpStore.set(email, {
      hash: hashOtp(email, otp),
      expiresAt: now + OTP_TTL_MS,
      attempts: 0,
      lastSentAt: now,
      sendCount: existing.sendCount + 1,
      windowStart: existing.windowStart,
    });

    return res.json({
      success: true,
      expiresInSeconds: Math.round(OTP_TTL_MS / 1000),
      resendInSeconds: Math.round(RESEND_COOLDOWN_MS / 1000),
    });
  } catch (err) {
    console.error("send-otp error:", err.response?.data || err.message);
    return res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
});

// ------------ VERIFY OTP ------------
app.post("/verify-otp", (req, res) => {
  const email = normalizeEmail(req.body.email);
  const otp = String(req.body.otp || "").trim();

  const rec = otpStore.get(email);
  if (!rec) {
    return res.status(400).json({ error: "No active code. Please request a new OTP." });
  }
  if (Date.now() > rec.expiresAt) {
    otpStore.delete(email);
    return res.status(400).json({ error: "OTP expired. Please request a new one." });
  }
  if (rec.attempts >= MAX_VERIFY_ATTEMPTS) {
    otpStore.delete(email);
    return res
      .status(429)
      .json({ error: "Too many incorrect attempts. Please request a new OTP." });
  }

  rec.attempts += 1;

  const matches = otp.length === 6 && timingSafeEqualHex(hashOtp(email, otp), rec.hash);
  if (!matches) {
    const remaining = MAX_VERIFY_ATTEMPTS - rec.attempts;
    return res.status(400).json({
      error: `Incorrect code.${remaining > 0 ? ` ${remaining} attempt(s) left.` : ""}`,
    });
  }

  // Success: invalidate the code (one-time use) and issue a verification token.
  otpStore.delete(email);
  return res.json({ success: true, token: issueVerificationToken(email) });
});

// ------------ GEMINI ROUTE ------------
app.post("/chat", async (req, res) => {
  try {
    const { prompt } = req.body;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const text =
      response.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    res.json({ text });
  } catch (err) {
    console.error("Gemini API error:", err.response?.data || err.message);
    res.status(500).json({ error: "Backend error" });
  }
});

// ------------ START SERVER ------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Backend running on port " + PORT));
