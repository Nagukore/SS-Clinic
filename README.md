# 🏥 **SS Clinic – Smart Appointment Booking System**

A modern, secure, and real-time appointment booking platform for **SS Clinic** that enables patients to verify their email via OTP, view available time slots, and receive automated confirmation emails — all backed by Firebase Firestore.

---

## 🌐 Live Website

| Environment | URL |
|-------------|-----|
| Production  | https://ssclinickudlu.com |
| Vercel Preview | https://ssclinic.vercel.app |

---

## 🎯 Project Overview

The **SS Clinic Appointment System** was built to:

- Reduce manual appointment errors  
- Prevent double bookings  
- Automate patient record management  
- Improve user experience across devices  
- Provide instant email confirmations  

---

## ✨ Key Features

### 👩‍⚕️ **For Patients**

| Feature | Description |
|--------|-------------|
| Email OTP Verification | Users must verify email before booking |
| Real-time Slot Availability | Shows only unbooked time slots |
| Automatic Slot Blocking | Prevents double booking |
| Responsive UI | Works on mobile, tablet, and desktop |
| Email Confirmation | Appointment details sent automatically |

### 🏥 **For Clinic (Backend & Admin)**

| Feature | Description |
|--------|-------------|
| Firestore Database | Stores appointments and patient records |
| Unique Appointment ID | Auto-generated (SS01, SS02, ...) |
| Unique Patient ID | Auto-generated (P0001, P0002, ...) |
| Race Condition Handling | Prevents simultaneous bookings |
| Timestamped Records | Uses `serverTimestamp()` |

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|------|------------|---------|
| Frontend | React + Vite + TypeScript | High-performance UI |
| Styling | Tailwind CSS | Modern responsive design |
| Database | Firebase Firestore | Cloud database |
| Email Service | EmailJS | OTP + Confirmation emails |
| Hosting | Vercel | Frontend deployment |
| Domain | Hostinger | Custom domain management |

---

## 🧠 System Architecture

```

User
│
▼
React Frontend (Vite)
│
├── EmailJS → Sends OTP & Confirmation Email
│
└── Firebase Firestore
├── appointments (bookings)
└── patients (patient records)

```

---

## 📁 Project Structure (ASCII Tree)

```

SS CLINIC
│
├── node_modules/                # Root dependencies
│
├── project/
│   │
│   ├── bolt/                    # UI/Design related assets (if used)
│   │
│   └── backend/                 # Node.js Backend
│       ├── node_modules/
│       ├── .env                 # Backend environment variables
│       ├── .env.example
│       ├── index.js             # Main server file
│       ├── package-lock.json
│       └── package.json
│
├── public/                      # Static assets
│
├── src/                         # React Frontend
│   └── components/
│       ├── About.tsx            # About section
│       ├── AdminLayout.tsx      # Admin panel layout
│       ├── AppointmentList.tsx  # List of appointments
│       ├── AppointmentScheduler.tsx
│       ├── Chatbot.tsx          # AI chatbot UI
│       ├── ChatbotGemini.tsx    # Gemini-based chatbot
│       ├── Contact.tsx          # Booking + OTP + Firestore
│       ├── DashboardPage.tsx    # Admin dashboard
│       ├── Doctors.tsx          # Doctors list
│       ├── Footer.tsx           # Site footer
│       ├── Hero.tsx             # Landing hero section
│       ├── HomePage.tsx         # Main homepage
│       ├── LoginPage.tsx        # Admin login
│       ├── Navbar.tsx           # Navigation bar
│       └── ProtectedRoute.tsx   # Route protection
│
└── OUTLINE                      # Project notes / outline

````

---

## 📧 Email Workflow

### **1) OTP Verification Flow**

| Step | Action |
|------|--------|
| 1 | User enters email |
| 2 | System generates 6-digit OTP |
| 3 | OTP sent via EmailJS |
| 4 | User enters OTP |
| 5 | System verifies OTP |
| 6 | Booking is enabled |

### **2) Appointment Confirmation Flow**

| Step | Action |
|------|--------|
| 1 | User selects doctor, date, time |
| 2 | System checks slot availability |
| 3 | Creates patient record if new |
| 4 | Creates appointment in Firestore |
| 5 | Sends confirmation email |

---

## 🔐 Environment Variables

Create a `.env` file in the project root:

```env
# ======= FRONTEND (VITE) =======
VITE_BACKEND_URL=https://your-backend-url.com

# EmailJS (Required for OTP & Confirmation)
VITE_EMAILJS_SERVICE_ID=your_service_id
VITE_EMAILJS_OTP_TEMPLATE_ID=your_otp_template_id
VITE_EMAILJS_APPT_TEMPLATE_ID=your_appt_template_id
VITE_EMAILJS_PUBLIC_KEY=your_public_key

# Firebase (Required for Firestore)
VITE_FIREBASE_API_KEY=your_firebase_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_MEASUREMENT_ID=your_measurement_id
````

> ⚠️ **Important:**
> Add all of the above variables to
> **Vercel → Settings → Environment Variables (Production)** and redeploy.

---

## 🔥 Firebase Firestore Rules (Current)

```rules
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {

    match /appointments/{docId} {
      allow read: if true;
      allow create: if true;
      allow update, delete: if request.auth != null;
    }

    match /patients/{docId} {
      allow create, read: if true;
      allow update, delete: if request.auth != null;
    }

    match /admins/{docId} {
      allow read, write: if request.auth != null;
    }

    match /{document=**} {
      allow read, write: if false;
    }
  }
}
```

---

## 🛠️ Installation (Local Development)

```bash
git clone https://github.com/your-username/ss-clinic.git
cd ss-clinic
npm install
npm run dev
```

Open:
👉 [http://localhost:5173](http://localhost:5173)

---

## 🚀 Deployment (Vercel)

### Step 1 — Push to GitHub

```bash
git add .
git commit -m "Deploy SS Clinic"
git push origin main
```

### Step 2 — Deploy on Vercel

1. Go to Vercel Dashboard
2. Import GitHub repo
3. Add environment variables
4. Click Deploy

---

## 🧪 Testing Checklist (Before Production)

| Test Case                    | Status |
| ---------------------------- | ------ |
| OTP sent successfully        | ✅      |
| OTP verification works       | ✅      |
| Duplicate slots blocked      | ✅      |
| Firestore saves appointments | ✅      |
| Confirmation email sent      | ✅      |
| Mobile responsiveness        | ✅      |

---

## 👨‍💻 Developed By

**Nagesh**  
Frontend Developer | AI/ML Enthusiast  

📧 Email: nages.amcec@gmail.com  
🔗 LinkedIn: https://www.linkedin.com/in/nageshkore

---

## 📜 License

This project is licensed under the **MIT License**.

---

## 🤝 Contributions

Contributions, issues, and feature requests are welcome!  
Feel free to open a pull request.

---

## ⭐ Acknowledgments

- Firebase Firestore  
- EmailJS  
- Vercel  
- Hostinger  
