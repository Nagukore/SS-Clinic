# SS Clinic — Fullstack Web App (Srishakthi Clinic) ✅

**Short description**

A responsive Vite + React + TypeScript frontend with Firebase Firestore for bookings, EmailJS for email confirmations, an Express backend (chat proxy) and an optional Supabase Edge Function (Gemini AI chat). The app powers clinic features such as booking appointments, patient records, and an AI-driven assistant.

---

## 🚀 Features

- Appointment booking flow with email OTP verification (EmailJS) ✅
- Firestore as the primary data store for patients and appointments ✅
- Two chat experiences:
  - Fast local responses (built-in rules) ⚡
  - Gemini AI chat via backend or Supabase function (Generative Language) 🧠
- Admin UI and protected routes for appointment management
- Mobile friendly and built with Tailwind CSS

---

## 🧩 Tech stack

- Frontend: React + TypeScript + Vite
- Styling: Tailwind CSS
- Database: Firebase Firestore
- Email: EmailJS (client) for OTP & confirmations
- Backend: Node.js + Express (chat proxy for Gemini API)
- Serverless: Supabase Functions (alternative host for Gemini chat)
- AI: Google Generative Language (Gemini) via API key

---

## ⚙️ Prerequisites

- Node.js (>= 18 recommended)
- npm or yarn
- Firebase project (Firestore enabled) or use the existing configuration
- Supabase project (if you plan to deploy the Supabase function)
- Google Generative Language API key (GEMINI_API_KEY)

---

## 🔧 Environment variables

Create a `.env` (or `.env.local`) for development in the `project/` folder.

Example `.env` (local development):

```env
# Client (Vite) - used by frontend (exposed to client, must start with VITE_)
VITE_SUPABASE_URL=https://xyz.supabase.co
VITE_SUPABASE_ANON_KEY=your_anon_key_here
VITE_BACKEND_URL=http://localhost:5000

# Server (backend & supabase functions)
# (DO NOT prefix with VITE_ for server-side envs)
GEMINI_API_KEY=sk-xxxxx-your-gemini-key
PORT=5000
```

Important variables used in this repo:

| Variable | Description | Location / Use |
|---|---|---|
| VITE_EMAILJS_SERVICE_ID | EmailJS Service ID | `src/components/Contact.tsx` (Email OTP & confirmations) |
| VITE_EMAILJS_OTP_TEMPLATE_ID | EmailJS Template ID for OTP emails | `src/components/Contact.tsx` |
| VITE_EMAILJS_APPT_TEMPLATE_ID | EmailJS Template ID for appointment confirmations | `src/components/Contact.tsx` |
| VITE_EMAILJS_PUBLIC_KEY | EmailJS public key (client) | `src/components/Contact.tsx` |
| VITE_SUPABASE_URL | Supabase project URL | `src/components/ChatbotGemini.tsx` (client call to function) |
| VITE_SUPABASE_ANON_KEY | Supabase anon/public key | `src/components/ChatbotGemini.tsx` (Authorization header) |
| VITE_BACKEND_URL | Backend URL for Gemini proxy | `src/components/Chatbot.tsx` |
| GEMINI_API_KEY | Google Generative Language API key (server-only) | `backend/index.js`, Supabase function env |
| PORT | Backend server port (optional) | `backend/index.js` |

Notes:
- The repository contains a default Firebase configuration at `src/firebase.ts`. Replace with your own project config if needed.
- Some client keys (EmailJS public key, Email templates, Firebase config) are currently embedded in code; consider moving them to environment variables for production.

---

## 📥 Install & Run (Local)

1. Install dependencies

```bash
cd project
npm install
```

2. Run frontend in dev mode

```bash
npm run dev
# open http://localhost:5173
```

3. Run backend (Express chat proxy)

```bash
cd backend
npm install
# Create a .env in backend/ or root with GEMINI_API_KEY and optional PORT
node index.js
# or with nodemon for dev
# npx nodemon index.js
```

4. (Optional) Deploy Supabase function for Gemini chat

- Use the Supabase CLI or dashboard to add function `gemini-chat` (file exists under `supabase/functions/gemini-chat/index.ts`).
- Set environment variable `GEMINI_API_KEY` in your Supabase project's functions environment.
- Invoke via: `POST https://<your-supabase-url>/functions/v1/gemini-chat` with Authorization Bearer using anon/public key (or use RLS/Service role depending on your configuration).

---

## ⚡ Scripts

From the `project/` folder:

- `npm run dev` — start Vite dev server
- `npm run build` — build frontend
- `npm run preview` — preview built frontend
- `npm run lint` — run eslint
- `npm run typecheck` — TypeScript check (no emit)

---

## 📁 Project structure (high level)

- `src/` — frontend source
  - `components/` — React components (Chatbot, ChatbotGemini, Contact, AppointmentScheduler, AdminLayout, etc.)
  - `firebase.ts` — firebase configuration + exported Firestore `db`
- `backend/` — simple Express server (`index.js`) acting as Gemini proxy
- `supabase/functions/gemini-chat/index.ts` — Supabase Edge Function for Gemini chat
- `public/` — static assets

---

## 🔒 Security & best practices

- **Never commit production secrets**. Move API keys (Gemini, service role keys) to server envs or secrets managers.
- For client secrets (Firebase config is safe as it is public config), keep private keys (service role, GCP keys, etc.) out of the frontend.
- Rate-limit and monitor API usage for Gemini to avoid unexpected charges.

---

## 📦 Deployment tips

- Frontend: Deploy to Vercel / Netlify / Cloudflare Pages — set the `VITE_*` env variables in hosting UI.
- Backend: Deploy Express server to Render/Heroku/Vercel (serverless) and set `GEMINI_API_KEY` as a secret.
- Supabase functions: Deploy using `supabase functions deploy gemini-chat` and set `GEMINI_API_KEY` via `supabase secrets set GEMINI_API_KEY=...` or via the Supabase dashboard.

---

## 🐛 Troubleshooting

- CORS errors: Confirm backend CORS settings include your frontend origin or use `VITE_BACKEND_URL` to point to correct host.
- Gemini errors: If you get 401 or "Gemini API key not configured" — verify `GEMINI_API_KEY` is set in server/Supabase function environment.
- Email not sending: Check EmailJS template IDs / Service ID (`Contact.tsx` has constants). EmailJS uses a public key — verify template names & your EmailJS dashboard settings.

---

## ✅ Notes & Next suggestions

- Move hardcoded keys (EmailJS service/template IDs & the one GEMINI key embedded in `Chatbot.tsx`) into environment variables for safer handling in production.
- Add unit tests and GitHub Actions for CI (typecheck + lint + build) if you plan to productionize the project.

---

## ✍️ Contributing

Contributions are welcome. Please open issues or PRs with clear descriptions. Consider adding a `CONTRIBUTING.md` and `CODE_OF_CONDUCT` for larger projects.

---

## 📄 License

Add a license (e.g., MIT) in `LICENSE` if you plan to open-source.

---

If you'd like, I can:
- extract environment variables into `.env.example`,
- add a `deploy.md` with deployment steps for Render/Vercel/Supabase, or
- replace hard-coded secrets with env usages in the codebase.

Would you like me to add any of those now? 💡