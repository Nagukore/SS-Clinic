import {
  applyCors,
  readBody,
  normalizeEmail,
  verifyOtpToken,
  issueVerificationToken,
} from "./_utils.js";

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const body = readBody(req);
  const email = normalizeEmail(body.email);
  const otp = String(body.otp || "").trim();
  const otpToken = body.otpToken;

  if (!email || !otp || !otpToken) {
    return res
      .status(400)
      .json({ error: "Missing verification details. Please request a new OTP." });
  }
  if (otp.length !== 6) {
    return res.status(400).json({ error: "Incorrect code. Please try again." });
  }

  const result = verifyOtpToken(otpToken, email, otp);
  if (!result.ok) {
    if (result.reason === "expired") {
      return res
        .status(400)
        .json({ error: "OTP expired. Please request a new one." });
    }
    return res.status(400).json({ error: "Incorrect code. Please try again." });
  }

  return res
    .status(200)
    .json({ success: true, token: issueVerificationToken(email) });
}
