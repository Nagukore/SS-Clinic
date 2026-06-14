// Shared helpers for the Vercel serverless API functions.
// Files/folders prefixed with "_" are NOT turned into routes by Vercel.
import crypto from "crypto";

// ------------ TIMINGS ------------
export const OTP_TTL_MS = 5 * 60 * 1000; // OTP valid for 5 minutes
export const RESEND_COOLDOWN_MS = 60 * 1000; // client-side resend cooldown hint
export const TOKEN_TTL_MS = 30 * 60 * 1000; // booking-verification token valid 30 min

// Secret used to sign OTP challenge tokens and verification tokens.
// IMPORTANT: set OTP_SECRET in the Vercel env so signatures survive across
// deployments/instances. Without it a random per-instance secret is used and
// tokens issued by one instance won't validate on another.
const OTP_SECRET =
  process.env.OTP_SECRET || crypto.randomBytes(32).toString("hex");

// ------------ CORS ------------
const ALLOWED_ORIGINS = (
  process.env.ALLOWED_ORIGINS ||
  "http://localhost:5173,https://ssclinickudlu.com,https://www.ssclinickudlu.com"
)
  .split(",")
  .map((o) => o.trim())
  .filter(Boolean);

export function applyCors(req, res) {
  const origin = req.headers.origin;
  // Same-origin requests (frontend + API on the same Vercel domain) don't send
  // an Origin we need to echo; only cross-origin callers (e.g. localhost dev) do.
  if (origin && ALLOWED_ORIGINS.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

// ------------ EMAIL / VALIDATION ------------
export const normalizeEmail = (e) => String(e || "").trim().toLowerCase();
export const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);

const hmac = (data) =>
  crypto.createHmac("sha256", OTP_SECRET).update(data).digest("hex");

const timingSafeEqualHex = (a, b) => {
  try {
    const ba = Buffer.from(String(a), "hex");
    const bb = Buffer.from(String(b), "hex");
    if (ba.length === 0 || ba.length !== bb.length) return false;
    return crypto.timingSafeEqual(ba, bb);
  } catch {
    return false;
  }
};

// ------------ STATELESS OTP CHALLENGE TOKEN ------------
// The OTP never reaches the browser. /send-otp returns a signed token that
// commits to (email, otp, expiry); /verify-otp recomputes the signature from
// the user-entered code. No server-side storage required.
export const issueOtpToken = (email, otp) => {
  const exp = Date.now() + OTP_TTL_MS;
  const sig = hmac(`otp:${email}:${otp}:${exp}`);
  return Buffer.from(JSON.stringify({ email, exp, sig })).toString("base64url");
};

export const verifyOtpToken = (token, email, otp) => {
  let obj;
  try {
    obj = JSON.parse(Buffer.from(String(token), "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "bad_token" };
  }
  if (!obj || obj.email !== email) return { ok: false, reason: "mismatch" };
  if (!obj.exp || Date.now() > obj.exp) return { ok: false, reason: "expired" };
  const expected = hmac(`otp:${email}:${otp}:${obj.exp}`);
  if (!timingSafeEqualHex(obj.sig, expected)) return { ok: false, reason: "incorrect" };
  return { ok: true };
};

// ------------ BOOKING VERIFICATION TOKEN ------------
// Returned on successful verification; stored with the booking as proof the
// email was verified server-side.
export const issueVerificationToken = (email) => {
  const exp = Date.now() + TOKEN_TTL_MS;
  const sig = hmac(`verified:${email}:${exp}`);
  return Buffer.from(JSON.stringify({ email, exp, sig })).toString("base64url");
};

// ------------ SEND OTP EMAIL (EmailJS REST API) ------------
export async function sendOtpEmail(email, otp) {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_OTP_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !privateKey) {
    throw new Error(
      "EmailJS server credentials missing. Set EMAILJS_SERVICE_ID, EMAILJS_OTP_TEMPLATE_ID, EMAILJS_PUBLIC_KEY and EMAILJS_PRIVATE_KEY."
    );
  }

  const resp = await fetch("https://api.emailjs.com/api/v1.0/email/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
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
    }),
  });

  if (!resp.ok) {
    const body = await resp.text().catch(() => "");
    throw new Error(`EmailJS send failed (${resp.status}): ${body}`);
  }
}

// Vercel parses JSON bodies automatically, but guard against string/undefined.
export function readBody(req) {
  if (!req.body) return {};
  if (typeof req.body === "string") {
    try {
      return JSON.parse(req.body);
    } catch {
      return {};
    }
  }
  return req.body;
}
