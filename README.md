# 🏥 **SS Clinic – Smart Appointment Booking System**

<div align="center">

![SS Clinic Banner](./docs/banner.png)  
*Replace with your project banner image*

</div>

A **secure, user-friendly, and real-time** appointment booking web application for **SS Clinic**.  
The platform enables patients to verify their email via **OTP**, view available time slots in real time, and receive automated confirmation emails after successful booking.

---

## 🌐 Live Demo

| Environment | URL |
|-------------|-----|
| Production  | https://your-domain.com |
| Staging     | https://your-vercel-preview-url.vercel.app |

> 🔹 *Replace these links with your actual deployed URLs.*

---

## 🎯 Project Objectives

This project was built to solve:

- Long waiting times for manual appointment booking  
- Duplicate or conflicting appointments  
- Lack of email confirmation  
- No proper patient record management  
- Poor user experience on mobile devices  

---

## ✨ Key Features

### 👩‍⚕️ **For Patients**
| Feature | Description |
|--------|-------------|
| Email OTP Verification | Users must verify email before booking |
| Real-time Slot Display | Shows only available slots |
| Slot Auto-Blocking | Booked slots are disabled instantly |
| Responsive UI | Works on mobile, tablet, and desktop |
| Appointment Confirmation | Automatic email with details |

### 🏥 **For Clinic (Admin/Backend)**
| Feature | Description |
|--------|-------------|
| Firestore Database | Stores appointments & patients |
| Unique Appointment ID | Auto-generated (SS01, SS02, ...) |
| Unique Patient ID | Auto-generated (P0001, P0002, ...) |
| Race Condition Handling | Prevents double-booking |
| Timestamped Records | Uses `serverTimestamp()` |

---

## 🏗️ Tech Stack

| Layer | Technology | Purpose |
|------|------------|---------|
| Frontend | React + Vite + TypeScript | Fast UI |
| Styling | Tailwind CSS | Modern responsive design |
| Database | Firebase Firestore | Cloud database |
| Email Service | EmailJS | OTP + Confirmation emails |
| Hosting | Vercel | Frontend deployment |
| Domain | Hostinger | Custom domain |

---

## 🧠 System Architecture

