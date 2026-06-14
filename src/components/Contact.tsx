import { MapPin, Phone, Mail, Clock } from "lucide-react";
import React, { useEffect, useState } from "react";
import { db } from "../firebase"; // Make sure this path is correct
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import emailjs from "@emailjs/browser";

/**
 * EmailJS config (from Vite env vars)
 */
const SERVICE_ID = import.meta.env.VITE_EMAILJS_SERVICE_ID as string;
const APPT_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_APPT_TEMPLATE_ID as string; // Template for appointment confirmation
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY as string;

// OTP generation + verification run on the Vercel serverless API (the code never
// reaches the browser). Empty default = same-origin /api/* on the deployed site.
// Set VITE_BACKEND_URL only when the API lives on a different origin (e.g. local
// dev pointing at the deployed Vercel URL).
const BACKEND_URL = (import.meta.env.VITE_BACKEND_URL as string)?.replace(/\/$/, "") || "";

// Development-time safety checks — warn if required env vars are missing
if (!SERVICE_ID || !APPT_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY) {
  console.warn("EmailJS environment variables are not fully configured.\nPlease add VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_APPT_TEMPLATE_ID and VITE_EMAILJS_PUBLIC_KEY to your .env.local or .env file (see .env.example).\nAppointment confirmation emails will not work without them.");
}

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  doctor: string;
  date: string;
  time: string;
  message: string;
};

// --- MAIN COMPONENT ---
export default function Contact() {
  // Form state
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    doctor: "",
    date: "",
    time: "",
    message: "",
  });

  // Booking / UI state
  const [status, setStatus] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // OTP state (the actual code lives only on the server)
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [resendUntil, setResendUntil] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [otpToken, setOtpToken] = useState<string | null>(null); // stateless OTP challenge token
  const [verificationToken, setVerificationToken] = useState<string | null>(null);
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState<number>(0); // OTP expiry countdown
  const [resendCountdown, setResendCountdown] = useState<number>(0); // resend cooldown

  // Initialize EmailJS once
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  // When doctor/date changes, generate slots + fetch booked slots
  useEffect(() => {
    if (formData.doctor && formData.date) {
      const generatedSlots = generateDoctorSlots(formData.doctor, formData.date);
      setSlots(generatedSlots);
      fetchBookedSlots(formData.doctor, formData.date);
      // Reset chosen time when doctor/date change
      setFormData((p) => ({ ...p, time: "" }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formData.doctor, formData.date]);

  // OTP expiry + resend-cooldown countdown tick
  useEffect(() => {
    const tick = () => {
      const now = Date.now();
      const expRemain = otpExpiresAt ? Math.max(0, Math.ceil((otpExpiresAt - now) / 1000)) : 0;
      const resendRemain = resendUntil ? Math.max(0, Math.ceil((resendUntil - now) / 1000)) : 0;
      setOtpCountdown(expRemain);
      setResendCountdown(resendRemain);
      // Hide the OTP box once the code has expired
      if (otpExpiresAt && expRemain <= 0) {
        setOtpSent(false);
        setOtpExpiresAt(null);
      }
    };
    tick();
    const id = window.setInterval(tick, 1000);
    return () => window.clearInterval(id);
  }, [otpExpiresAt, resendUntil]);

  // Auto-clear general status messages
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(""), 120);
    return () => clearTimeout(t);
  }, [status]);

  // --- Helper: doctor-specific slots (15-min interval) ---
  const generateDoctorSlots = (doctor: string, selectedDate: string) => {
    if (doctor === "Dr. Ashwini B S") {
      return generateSlots("17:45", "19:45", 15, selectedDate); // 5:45 PM to 7:45 PM
    } else if (doctor === "Dr. Sujith M S") {
      return generateSlots("19:30", "21:30", 15, selectedDate); // 7:30 PM to 9:30 PM
    }
    return generateSlots("09:00", "20:00", 15, selectedDate); // Default fallback
  };

  // --- Generate slots (24h strings -> formatted to 12h with AM/PM) ---
  const generateSlots = (start: string, end: string, interval: number, selectedDate: string) => {
    const result: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    const d = new Date();
    const todayStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    const isToday = selectedDate === todayStr;
    const currentMins = d.getHours() * 60 + d.getMinutes();

    while (h < eh || (h === eh && m < em)) {
      const slotMins = h * 60 + m;
      // Skip past slots for today
      if (!isToday || slotMins > currentMins) {
        result.push(formatTo12Hour(h, m));
      }
      m += interval;
      if (m >= 60) {
        h++;
        m -= 60;
      }
    }
    return result;
  };

  const formatTo12Hour = (hour: number, minute: number) => {
    const period = hour >= 12 ? "PM" : "AM";
    const hour12 = hour % 12 || 12;
    const formattedMinute = String(minute).padStart(2, "0");
    return `${hour12}:${formattedMinute} ${period}`;
  };

  // --- Fetch booked slots for the doctor/date from Firestore ---
  const fetchBookedSlots = async (doctor: string, date: string) => {
    try {
      const q = query(
        collection(db, "appointments"),
        where("doctor", "==", doctor),
        where("date", "==", date)
      );
      const snap = await getDocs(q);
      const times = snap.docs.map((d) => d.data().time as string);
      setBookedSlots(times || []);
    } catch (e) {
      console.error("Error fetching booked slots:", e);
    }
  };

  // --- Form change handler ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    // Editing email should reset verification
    if (name === "email") {
      setIsVerified(false);
      setVerificationToken(null);
      setOtpToken(null);
      setOtpSent(false);
      setOtpExpiresAt(null);
      setResendUntil(null);
      setOtpValue("");
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Request an OTP from the backend (code is generated + emailed server-side) ---
  const handleSendOtp = async () => {
    if (!formData.email) {
      setStatus("Please enter an email to receive the OTP.");
      return;
    }
    setIsSendingOtp(true);
    setStatus("Sending OTP...");
    try {
      const res = await fetch(`${BACKEND_URL}/api/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        setStatus(data.error || "Failed to send OTP. Please try again.");
        return;
      }

      const expiresInSeconds = Number(data.expiresInSeconds) || 300;
      const resendInSeconds = Number(data.resendInSeconds) || 60;
      setOtpToken(data.otpToken || null);
      setOtpSent(true);
      setIsVerified(false);
      setVerificationToken(null);
      setOtpValue("");
      setOtpExpiresAt(Date.now() + expiresInSeconds * 1000);
      setResendUntil(Date.now() + resendInSeconds * 1000);
      setStatus(
        `OTP sent to your email. It will expire in ${Math.round(expiresInSeconds / 60)} minute(s).`
      );
    } catch (err) {
      console.error("send-otp error:", err);
      setStatus("Could not reach the server to send OTP. Please try again.");
    } finally {
      setIsSendingOtp(false);
    }
  };

  // --- Verify the entered code against the backend ---
  const handleVerifyOtp = async () => {
    if (!otpValue.trim()) {
      setStatus("Enter the 6-digit verification code sent to your email.");
      return;
    }
    if (!otpToken) {
      setStatus("No active code. Please request a new OTP.");
      return;
    }
    setIsVerifyingOtp(true);
    setStatus("Verifying...");
    try {
      const res = await fetch(`${BACKEND_URL}/api/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otpValue.trim(), otpToken }),
      });
      const data = await res.json().catch(() => ({}));

      if (!res.ok || !data.success) {
        setStatus(data.error || "Incorrect code. Please try again.");
        return;
      }

      setIsVerified(true);
      setVerificationToken(data.token || null);
      setStatus("Email verified ✅. You can now book an appointment.");
      // Tear down OTP UI state
      setOtpToken(null);
      setOtpSent(false);
      setOtpExpiresAt(null);
      setResendUntil(null);
      setOtpValue("");
    } catch (err) {
      console.error("verify-otp error:", err);
      setStatus("Could not reach the server to verify OTP. Please try again.");
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  // --- Find or create patient ---
  const getOrCreatePatient = async (
    email: string,
    fullName: string,
    phone: string
  ) => {
    const patientsRef = collection(db, "patients");
    const q = query(patientsRef, where("email", "==", email.toLowerCase()));
    const patientSnap = await getDocs(q);

    if (patientSnap.empty) {
      // New patient
      const allPatientsSnap = await getDocs(patientsRef);
      const newPatientNum = allPatientsSnap.size + 1;
      const newPatientId = `P${String(newPatientNum).padStart(4, "0")}`;

      const newPatientData = {
        patientId: newPatientId,
        email: email.toLowerCase(),
        fullName,
        phone,
        createdAt: serverTimestamp(),
      };
      await addDoc(patientsRef, newPatientData);
      return newPatientId;
    } else {
      // Existing patient
      const existing = patientSnap.docs[0].data() as { fullName?: string; patientId: string };
      if (existing.fullName?.toLowerCase() !== fullName.toLowerCase()) {
        // Same email, different name -> create new patient record
        const allPatientsSnap = await getDocs(patientsRef);
        const newPatientNum = allPatientsSnap.size + 1;
        const newPatientId = `P${String(newPatientNum).padStart(4, "0")}`;

        const newPatientData = {
          patientId: newPatientId,
          email: email.toLowerCase(),
          fullName,
          phone,
          createdAt: serverTimestamp(),
        };
        await addDoc(patientsRef, newPatientData);
        return newPatientId;
      }
      return existing.patientId; // Return existing patient ID
    }
  };

  // --- Submit booking (requires isVerified true) ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    console.log("Booking attempt", { isVerified, formData });

    if (!isVerified) {
      setStatus("Please verify your email with the OTP before booking.");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.doctor ||
      !formData.date ||
      !formData.time
    ) {
      setStatus("Please fill all required fields (Name, Email, Doctor, Date, Time).");
      return;
    }

    setIsSubmitting(true);
    setStatus("Booking appointment...");

    try {
      // --- Race Condition Check ---
      const q = query(
        collection(db, "appointments"),
        where("doctor", "==", formData.doctor),
        where("date", "==", formData.date),
        where("time", "==", formData.time)
      );
      const existing = await getDocs(q);
      console.log("Existing check", existing.size);
      if (!existing.empty) {
        setStatus("⚠ This time slot was just booked. Please choose another.");
        setIsSubmitting(false);
        fetchBookedSlots(formData.doctor, formData.date); // Refresh slots
        return;
      }

      // Get or create patient record
      const patientId = await getOrCreatePatient(
        formData.email,
        formData.fullName,
        formData.phone
      );
      console.log("Patient ID:", patientId);

      // Create appointment ID (e.g., "SS01", "SS02")
      const snapshot = await getDocs(collection(db, "appointments"));
      const total = snapshot.size;
      const appointmentId = `SS${String(total + 1).padStart(2, "0")}`;

      // Save appointment to Firestore
      const docRef = await addDoc(collection(db, "appointments"), {
        appointmentId,
        patientId,
        ...formData,
        verificationToken, // proof the email was verified server-side
        createdAt: serverTimestamp(),
        status: "booked", // Default status
      });
      console.log("Appointment added, docRef id:", docRef.id);

      // Send confirmation email
      const templateParams = {
        appointment_id: appointmentId,
        patient_id: patientId,
        patient_name: formData.fullName,
        doctor_name: formData.doctor,
        appointment_date: formData.date,
        appointment_time: formData.time,
        to_email: formData.email,
      };

      try {
        await emailjs.send(
          SERVICE_ID,
          APPT_TEMPLATE_ID,
          templateParams,
          EMAILJS_PUBLIC_KEY
        );
      } catch (err: unknown) {
        console.warn("EmailJS confirmation error:", err);
        // Don't fail the whole booking if email fails
        const errorMsg = err instanceof Error ? err.message : 'unknown error';
        setStatus(
          `✅ Appt ${appointmentId} booked! (But confirmation email failed to send: ${errorMsg})`
        );
        setIsSubmitting(false); // Manually set here
        return; // Exit
      }

      setStatus(
        `✅ Appointment confirmed (ID: ${appointmentId}). Confirmation sent to email.`
      );
      // Clear form and reset state
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        doctor: "",
        date: "",
        time: "",
        message: "",
      });
      setBookedSlots([]);
      setIsVerified(false);
      setVerificationToken(null);
      setOtpToken(null);
    } catch (err: unknown) {
      console.error("Booking error:", err);
      const errorMsg = err instanceof Error ? err.message : 'Try again later.';
      setStatus(`❌ Booking failed: ${errorMsg}`);
    } finally {
      // Only set if not already set by email error
      if (isSubmitting) {
        setIsSubmitting(false);
      }
    }
  };

  // --- STYLING ---
  const getLocalTodayStr = () => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  };
  const todayDateStr = getLocalTodayStr();

  const floatingInputClass =
    "block w-full px-4 py-3.5 bg-transparent rounded-lg border border-slate-300 text-slate-900 appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 peer transition-shadow disabled:bg-slate-50 disabled:text-slate-500 disabled:border-slate-200 disabled:shadow-none";

  const floatingLabelClass =
    "absolute text-slate-500 duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 px-1 bg-white peer-placeholder-shown:bg-transparent peer-focus:bg-white peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 cursor-text pointer-events-none";

  const floatingTextareaLabelClass =
    "absolute text-slate-500 duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 px-1 bg-white peer-placeholder-shown:bg-transparent peer-focus:bg-white peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:top-3.5 peer-focus:top-0 peer-focus:scale-75 peer-focus:-translate-y-1/2 cursor-text pointer-events-none";

  const alwaysFloatedLabelClass =
    "absolute text-slate-500 duration-300 transform -translate-y-1/2 scale-75 top-0 z-10 origin-[0] left-3 px-1 bg-white pointer-events-none peer-focus:text-blue-600";

  const buttonPrimaryClass =
    "w-full bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed";

  return (
    <section id="contact" className="py-20 md:py-24 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* ✅ HEADER */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Have questions or need to book an appointment? We're here to help.
          </p>
        </div>

        {/* ✅ GRID (This is the responsive part) */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">
          
          {/* LEFT: Contact Info (Restored layout) */}
          <div className="space-y-6">
            {[
              {
                icon: MapPin,
                title: "Visit Us",
                lines: ["SS Clinic", "Kudlu, Bangalore, Karnataka 560068"],
                href: "https://maps.google.com/?q=SS+Clinic,Kudlu,Bangalore,Karnataka,560068",
              },
              {
                icon: Phone,
                title: "Call Us",
                lines: ["+91 9602154222"],
                href: "tel:+919602154222",
              },
              {
                icon: Mail,
                title: "Email Us",
                lines: ["ssclinicbangalore@gmail.com"],
                href: "mailto:ssclinicbangalore@gmail.com",
              },
              {
                icon: Clock,
                title: "Working Hours",
                lines: [
                  "Mon – Sat: 4:00 PM – 12:00 AM",
                  "Sunday: Closed",
                  "Emergency:  Available",
                ],
                href: null,
              },
            ].map((item) => (
              <a
                key={item.title}
                href={item.href ?? undefined}
                target={item.href ? "_blank" : undefined}
                rel="noopener noreferrer"
                className={`
                  grid grid-cols-[56px_1fr] items-start gap-4 p-6 rounded-2xl
                  bg-white shadow-lg border border-slate-100
                  transition-all duration-300 ease-in-out
                  ${item.href ? "hover:shadow-xl hover:-translate-y-1 hover:border-blue-200" : "cursor-default"}
                `}
              >
                {/* Fixed-size icon cell (56px width) */}
                <div className="flex-shrink-0 w-14 h-14 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center">
                  <item.icon size={28} />
                </div>

                {/* Text cell (takes remaining space) */}
                <div className="min-w-0">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <div className="mt-1 text-base text-slate-700 break-words">
                      {item.lines.map((l) => (
                        <span key={l} className="block">{l}</span>
                      ))}
                  </div>
                </div>
              </a>
            ))}
          </div>

          {/* Right: Appointment Form (Restored layout) */}
          <div
            id="appointment"
            className="bg-white p-8 md:p-10 rounded-2xl shadow-xl border border-slate-200"
          >
            <h3 className="text-3xl font-bold text-slate-900 mb-8">
              Book an Appointment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-5">
              
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className={floatingInputClass}
                  />
                  <label htmlFor="fullName" className={floatingLabelClass}>
                    Full Name
                  </label>
                </div>
                <div className="relative">
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className={floatingInputClass}
                  />
                  <label htmlFor="phone" className={floatingLabelClass}>
                    Phone Number
                  </label>
                </div>
              </div>

              {/* Email + OTP column */}
              <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    placeholder=" "
                    className={floatingInputClass}
                    disabled={isVerified}
                  />
                  <label htmlFor="email" className={floatingLabelClass}>
                    Email address
                  </label>
                </div>

                {/* Send OTP button */}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className={`px-5 py-3 rounded-lg font-semibold transition whitespace-nowrap ${
                    isVerified
                      ? "bg-green-100 text-green-700 cursor-default"
                      : "bg-blue-100 text-blue-700 hover:bg-blue-200"
                  } disabled:bg-slate-100 disabled:text-slate-400 disabled:cursor-not-allowed`}
                  disabled={!formData.email || isVerified || isSendingOtp || resendCountdown > 0}
                >
                  {isVerified
                    ? "Verified ✅"
                    : isSendingOtp
                    ? "Sending..."
                    : resendCountdown > 0
                    ? `Resend in ${resendCountdown}s`
                    : otpSent
                    ? "Resend OTP"
                    : "Send OTP"}
                </button>
              </div>

              {/* OTP input + verify */}
              {otpSent && (
                <div className="bg-slate-50 p-4 rounded-lg space-y-3 border border-slate-200">
                  <div className="flex flex-col sm:flex-row items-center gap-3">
                    <div className="relative flex-1 w-full">
                      <input
                        type="text"
                        id="otpValue"
                        value={otpValue}
                        onChange={(e) => setOtpValue(e.target.value)}
                        placeholder=" "
                        className={floatingInputClass}
                      />
                      <label htmlFor="otpValue" className={floatingLabelClass}>
                        Enter 6-digit code
                      </label>
                    </div>
                    <button
                      type="button"
                      onClick={handleVerifyOtp}
                      disabled={isVerifyingOtp || !otpValue.trim()}
                      className="w-full sm:w-auto px-5 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                      {isVerifyingOtp ? "Verifying..." : "Verify"}
                    </button>
                  </div>
                  {otpCountdown > 0 && (
                    <p className="text-sm text-slate-600 text-center">
                      Expires in {otpCountdown}s
                    </p>
                  )}
                </div>
              )}

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="relative">
                  <select
                    id="doctor"
                    name="doctor"
                    value={formData.doctor}
                    onChange={handleChange}
                    required
                    className={floatingInputClass}
                  >
                    <option value="" disabled hidden>-- Select Doctor --</option>
                    <option value="Dr. Sujith M S">Dr. Sujith M S - Physician</option>
                    <option value="Dr. Ashwini B S">Dr. Ashwini B S - Pediatrician</option>
                  </select>
                  <label htmlFor="doctor" className={alwaysFloatedLabelClass}>
                    Doctor
                  </label>
                </div>

                <div className="relative">
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    min={todayDateStr}
                    className={floatingInputClass}
                  />
                  <label htmlFor="date" className={alwaysFloatedLabelClass}>
                    Appointment Date
                  </label>
                </div>
              </div>

              {/* Time slots (blocked if booked) */}
              {formData.date && (
                <div>
                  <label className="block text-sm font-semibold text-slate-800 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto p-3 bg-slate-100 rounded-lg border border-slate-200">
                    {slots.length > 0 ? slots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, time: t }))}
                        disabled={bookedSlots.includes(t)}
                        className={`p-2 rounded-md text-sm font-medium transition-all ${
                          bookedSlots.includes(t)
                            ? "bg-slate-200 text-slate-500 cursor-not-allowed line-through"
                            : formData.time === t
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 hover:border-slate-400"
                        }`}
                      >
                        {t}
                      </button>
                    )) : (
                      <p className="col-span-full text-center text-slate-500 py-2">
                        {formData.doctor && formData.date ? "No slots available for this date." : "Select a doctor and date to see slots."}
                      </p>
                    )}
                  </div>
                </div>
              )}

              <div className="relative">
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder=" "
                  className={`${floatingInputClass} resize-none`}
                />
                <label htmlFor="message" className={floatingTextareaLabelClass}>
                  Reason for appointment booking
                </label>
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !isVerified || !formData.fullName || !formData.phone || !formData.email || !formData.doctor || !formData.date || !formData.time || !formData.message.trim()}
                className={buttonPrimaryClass}
                title={!isVerified ? 'Verify your email using OTP to enable booking' : (!formData.fullName || !formData.phone || !formData.email || !formData.doctor || !formData.date || !formData.time || !formData.message.trim()) ? 'Fill all required fields to book' : undefined}
              >
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </button>

              {status && (
                <p className={`text-center mt-4 p-3 rounded-lg border text-sm font-medium
                  ${status.includes('✅') ? 'text-green-700 bg-green-50 border-green-300' : ''}
                  ${status.includes('❌') || status.includes('⚠') || status.includes('Failed') ? 'text-red-700 bg-red-50 border-red-300' : ''}
                  ${status.includes('...') || status.includes('sent') ? 'text-blue-700 bg-blue-50 border-blue-300' : ''}
                `}>
                  {status}
                </p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}