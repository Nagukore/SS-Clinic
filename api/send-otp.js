import crypto from "crypto";
import {
  applyCors,
  readBody,
  normalizeEmail,
  isValidEmail,
  issueOtpToken,
  sendOtpEmail,
  OTP_TTL_MS,
  RESEND_COOLDOWN_MS,
} from "./_utils.js";

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email: rawEmail } = readBody(req);
    const email = normalizeEmail(rawEmail);
    if (!isValidEmail(email)) {
      return res
        .status(400)
        .json({ error: "Please provide a valid email address." });
    }

    const otp = String(crypto.randomInt(100000, 1000000)); // always 6 digits

    // Send the email first; only hand back a challenge token if it goes out.
    await sendOtpEmail(email, otp);

    return res.status(200).json({
      success: true,
      otpToken: issueOtpToken(email, otp),
      expiresInSeconds: Math.round(OTP_TTL_MS / 1000),
      resendInSeconds: Math.round(RESEND_COOLDOWN_MS / 1000),
    });
  } catch (err) {
    console.error("send-otp error:", err);
    return res.status(500).json({ error: "Failed to send OTP. Please try again." });
  }
}
