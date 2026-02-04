# SS Clinic – Appointment Booking System

A modern, responsive appointment booking web application for **SS Clinic**, built with React, Vite, Firebase, and EmailJS. The system allows patients to verify their email via OTP and book available time slots with doctors in real time.

---

## 🚀 Live Website

**Deployed URL:**  
https://your-domain.com (replace with your actual domain)

---

## ✨ Features

### ✅ Patient Features
- Responsive, user-friendly UI (Tailwind CSS)
- Email verification using **OTP (EmailJS)**
- Real-time available slot display
- Automatic blocking of already booked slots
- Appointment confirmation via email
- Form validation and error handling

### ✅ Admin / Backend Features
- Appointments stored in **Firebase Firestore**
- Unique appointment IDs (`SS01`, `SS02`, ...)
- Unique patient IDs (`P0001`, `P0002`, ...)
- Duplicate slot prevention (race condition check)
- Timestamped records using `serverTimestamp()`

---

## 🏗 Tech Stack

| Layer | Technology |
|------|------------|
| Frontend | React + Vite + TypeScript |
| Styling | Tailwind CSS |
| Database | Firebase Firestore |
| Email Service | EmailJS |
| Hosting | Vercel |
| Domain | Hostinger |

---

## 📁 Project Structure (High-Level)

