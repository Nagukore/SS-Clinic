import { applyCors, readBody, getClientIp, rateLimit } from "./_utils.js";

// Per-IP throttle for the (token-costly) Gemini endpoint.
const RATE_LIMIT = 20; // max requests
const RATE_WINDOW_MS = 10 * 60 * 1000; // per 10 minutes

// -------------------- CLINIC KNOWLEDGE BASE --------------------
// Everything the assistant is allowed to know about. Keep this in sync with the
// site content (Doctors.tsx, Services.tsx, Contact.tsx).
const CLINIC_CONTEXT = `
CLINIC: SS Clinic (Srishakthi Clinic) — a multispeciality clinic in Bangalore.

LOCATION: SS Clinic, Kudlu, Bangalore, Karnataka - 560068.
Google Maps: https://maps.google.com/?q=SS+Clinic,Kudlu,Bangalore,Karnataka,560068

CONTACT:
- Phone / Appointments: +91 9602154222
- Email: ssclinicbangalore@gmail.com

CLINIC TIMINGS:
- Monday to Saturday: 4:00 PM – 12:00 AM
- Sunday: Closed
- Emergency services: Available

DOCTORS:
1. Dr. Sujith M S — Consultant Physician & Diabetologist (MBBS, DNB, PGDCED, KMC Reg. 105870).
   Consulting time: 6:00 PM – 9:00 PM.
   Expertise: Diabetes Management, Hypertension, Infectious Diseases, Respiratory Conditions.
2. Dr. Ashwini B S — Consultant Paediatrician / Child Specialist (MBBS, DCH, DNB, KMC Reg. 114445; DCH State Topper).
   Consulting time: 5:45 PM – 7:45 PM.
   Expertise: Neonatal Care, Growth & Development, Immunization, Infections, Allergies, Asthma.

SERVICES:
- Diabetes Management
- Hypertension Care
- Pediatric Care (neonatal care, growth monitoring, development)
- Immunization / Vaccination
- Infectious Diseases
- General Medicine (respiratory & preventive care)

APPOINTMENTS: Patients can book online via the "Book Appointment" button on the website
(the appointment form is on the Contact page) or by calling +91 9602154222.
`;

const SYSTEM_INSTRUCTION = `
You are "Srishakthi Assistant", the friendly virtual assistant for the SS Clinic website.

RULES:
1. ONLY answer questions related to SS Clinic, its doctors, services, appointments,
   timings, location, contact details, or general health/medical guidance a clinic
   assistant would reasonably help with.
2. If a question is NOT related to the clinic or health (e.g. coding, politics, math,
   general trivia, other businesses), politely decline in one short sentence and steer
   the user back, e.g. "I can only help with SS Clinic and your health-related queries.
   Would you like to know about our doctors or book an appointment?"
3. Base all clinic facts ONLY on the information provided below. Never invent doctors,
   prices, timings, phone numbers, or services that are not listed.
4. If you don't have specific information, say so and suggest calling +91 9602154222.
5. NEVER give a definitive medical diagnosis or prescribe medication. For health
   concerns, give general guidance and recommend consulting our doctors.
6. Keep replies short, warm, and easy to read. You may use simple HTML for formatting:
   <b>, <br>, <ul>/<li>, and links like <a href="..." class="text-blue-700 font-bold underline">text</a>.
   Do NOT use markdown.

Use this clinic information as your only source of truth:
${CLINIC_CONTEXT}
`;

export default async function handler(req, res) {
  applyCors(req, res);
  if (req.method === "OPTIONS") return res.status(204).end();
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  try {
    // --- Per-IP rate limit (protects against token-draining abuse) ---
    const ip = getClientIp(req);
    const { allowed, retryAfterMs } = rateLimit(`chat:${ip}`, {
      limit: RATE_LIMIT,
      windowMs: RATE_WINDOW_MS,
    });
    if (!allowed) {
      const retrySec = Math.ceil(retryAfterMs / 1000);
      res.setHeader("Retry-After", String(retrySec));
      return res.status(429).json({
        error: `Too many requests. Please wait about ${Math.ceil(
          retrySec / 60
        )} minute(s) and try again, or call +91 9602154222.`,
      });
    }

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
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: SYSTEM_INSTRUCTION }] },
          contents: [{ role: "user", parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.4,
            maxOutputTokens: 600,
          },
        }),
      }
    );

    const data = await resp.json();

    // Surface upstream errors (expired key, quota, etc.) so they are debuggable.
    if (!resp.ok || data?.error) {
      const message = data?.error?.message || `Gemini request failed (${resp.status})`;
      console.error("Gemini API error:", message);
      return res.status(502).json({ error: message });
    }

    const text =
      data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";

    return res.status(200).json({ text });
  } catch (err) {
    console.error("chat error:", err);
    return res.status(500).json({ error: "Backend error" });
  }
}
