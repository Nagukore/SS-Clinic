# 🏥 **SS Clinic – Smart Appointment Booking System**

<div align="center">

[![Live Site](https://img.shields.io/badge/Live_Site-ssclinickudlu.com-success?style=for-the-badge&logo=googlechrome&logoColor=white)](https://ssclinickudlu.com)
[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![Firebase](https://img.shields.io/badge/firebase-%23039BE5.svg?style=for-the-badge&logo=firebase)](https://firebase.google.com/)
[![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)

*A modern, secure, and real-time appointment booking platform for SS Clinic.*

</div>

---

## 🌐 Live Deployment

| Environment | URL |
|:--- |:--- |
| **Production** | [https://ssclinickudlu.com](https://ssclinickudlu.com) |
| **Backend API** | [https://ss-clinic-1.onrender.com](https://ss-clinic-1.onrender.com) |

---

## 🎯 Project Overview

**SS Clinic Appointment System** is a full-stack platform designed to automate patient scheduling and record management. This system eliminates manual booking errors and ensures a seamless experience through real-time data synchronization.

### **The Patient Journey:**
1.  **Verification**: Secure 6-digit OTP verification via **EmailJS**.
2.  **Scheduling**: Real-time view of available doctor slots to prevent conflicts.
3.  **Confirmation**: Instant automated email confirmations and record creation in **Firestore**.

---

## ✨ Key Features

### 👩‍⚕️ **Patient Experience**
* **Secure OTP Auth**: Ensures valid contact information before booking is enabled.
* **Dynamic Slot Management**: Automatically hides booked slots to prevent double-bookings.
* **Responsive UI**: Optimized for mobile, tablet, and desktop using **Tailwind CSS**.

### 🏥 **Clinic Administration**
* **Automated ID Generation**: Unique identifiers for Appointments (SS01...) and Patients (P0001...).
* **Race Condition Protection**: Prevents simultaneous bookings of the same time slot.
* **Audit-Ready Records**: Every entry is timestamped using Firebase `serverTimestamp()`.

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|:--- |:--- |:--- |
| **Frontend** | React + Vite + TypeScript | High-performance, type-safe UI |
| **Styling** | Tailwind CSS | Modern, utility-first responsive design |
| **Database** | Firebase Firestore | Real-time cloud NoSQL database |
| **Email Service**| EmailJS | OTP delivery & appointment confirmations |
| **Backend** | Node.js + Express | Gemini AI proxy and secure logic |
| **AI** | Google Gemini API | Intelligent workspace automation |

---

## 🧠 System Architecture



---

## 🔐 Environment Variables

Create a `.env` file in the project root. For production, add these to your Vercel/Render dashboard.

```env
# ======= FRONTEND (VITE) =======
VITE_BACKEND_URL=[https://ss-clinic-1.onrender.com](https://ss-clinic-1.onrender.com)

# EmailJS Configuration
VITE_EMAILJS_SERVICE_ID=service_lryd73h
VITE_EMAILJS_OTP_TEMPLATE_ID=template_ohmoncy
VITE_EMAILJS_APPT_TEMPLATE_ID=template_r26t8ov
VITE_EMAILJS_PUBLIC_KEY=MGrfNH-8tMwQkb0fp

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSyArLWKJJAX6F5yKxbz8QV4oLNcH3wLfSUg
VITE_FIREBASE_AUTH_DOMAIN=ss-clinic-e07db.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=ss-clinic-e07db
VITE_FIREBASE_STORAGE_BUCKET=ss-clinic-e07db.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=429785345061
VITE_FIREBASE_APP_ID=1:429785345061:web:6abe3ae9ebef6ccf7563cc
VITE_FIREBASE_MEASUREMENT_ID=G-HMCQ62G56K

# ======= BACKEND (RENDER/SERVER) =======
GEMINI_API_KEY=your_gemini_key_here
PORT=5000
