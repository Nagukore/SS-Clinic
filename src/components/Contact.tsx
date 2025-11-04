import { MapPin, Phone, Mail, Clock } from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { db } from "../firebase";
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
 * EmailJS config
 */
const SERVICE_ID = "service_lryd73h";
const OTP_TEMPLATE_ID = "template_ohmoncy"; // Template to send OTP
const APPT_TEMPLATE_ID = "template_r26t8ov"; // Template for appointment confirmation
const EMAILJS_PUBLIC_KEY = "MGrfNH-8tMwQkb0fp";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  doctor: string;
  date: string;
  time: string;
  message: string;
};

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

  // OTP state
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [otpExpiresAt, setOtpExpiresAt] = useState<number | null>(null);
  const [isVerified, setIsVerified] = useState(false);
  const [otpCountdown, setOtpCountdown] = useState<number>(0);
  const timerRef = useRef<number | null>(null);

  // Initialize EmailJS once
  useEffect(() => {
    emailjs.init(EMAILJS_PUBLIC_KEY);
  }, []);

  // When doctor/date changes, generate slots + fetch booked slots
  useEffect(() => {
    if (formData.doctor && formData.date) {
      const generatedSlots = generateDoctorSlots(formData.doctor);
      setSlots(generatedSlots);
      fetchBookedSlots(formData.doctor, formData.date);
      // Reset chosen time when doctor/date change
      setFormData((p) => ({ ...p, time: "" }));
    }
  }, [formData.doctor, formData.date]);

  // OTP countdown tick
  useEffect(() => {
    if (!otpExpiresAt) {
      setOtpCountdown(0);
      return;
    }
    const tick = () => {
      const remain = Math.max(0, Math.ceil((otpExpiresAt - Date.now()) / 1000));
      setOtpCountdown(remain);
      if (remain <= 0) {
        setGeneratedOtp(null);
        setOtpSent(false);
        setOtpExpiresAt(null);
        window.clearInterval(timerRef.current ?? 0);
        timerRef.current = null;
      }
    };
    tick();
    timerRef.current = window.setInterval(tick, 1000);
    return () => {
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [otpExpiresAt]);

  // Auto-clear general status messages
  useEffect(() => {
    if (!status) return;
    const t = setTimeout(() => setStatus(""), 6000);
    return () => clearTimeout(t);
  }, [status]);

  // --- Helper: doctor-specific slots (15-min interval) ---
  const generateDoctorSlots = (doctor: string) => {
    if (doctor === "Dr. Ashwini B S") {
      return generateSlots("17:45", "19:45", 15); // 5:45 PM to 7:45 PM
    } else if (doctor === "Dr. Sujith M S") {
      return generateSlots("18:00", "21:00", 15); // 6:00 PM to 9:00 PM
    }
    return generateSlots("09:00", "20:00", 15); // Default fallback
  };

  // --- Generate slots (24h strings -> formatted to 12h with AM/PM) ---
  const generateSlots = (start: string, end: string, interval: number) => {
    const result: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    while (h < eh || (h === eh && m < em)) {
      result.push(formatTo12Hour(h, m));
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
      setGeneratedOtp(null);
      setOtpSent(false);
      setOtpExpiresAt(null);
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // --- Generate random 6-digit OTP ---
  const createOtp = () => {
    return String(Math.floor(100000 + Math.random() * 900000));
  };

  // --- Send OTP via EmailJS ---
  const handleSendOtp = async () => {
    if (!formData.email) {
      setStatus("Please enter an email to receive the OTP.");
      return;
    }
    // Create OTP and expiration (2 minutes)
    const otp = createOtp();
    setGeneratedOtp(otp);
    setOtpSent(true);
    setIsVerified(false);
    const expiresAt = Date.now() + 2 * 60 * 1000; // 2 minutes
    setOtpExpiresAt(expiresAt);

    const templateParams = {
      to_email: formData.email,
      otp,
      clinic_name: "SS Clinic", // Standardized name
      expiry_minutes: 2,
    };

    try {
      await emailjs.send(
        SERVICE_ID,
        OTP_TEMPLATE_ID,
        templateParams,
        EMAILJS_PUBLIC_KEY
      );
      setStatus("OTP sent to your email. It will expire in 2 minutes.");
    } catch (err) {
      console.error("EmailJS OTP send error:", err);
      setStatus("Failed to send OTP. Please check EmailJS setup or try again.");
      // Clear OTP state on fail
      setGeneratedOtp(null);
      setOtpSent(false);
      setOtpExpiresAt(null);
    }
  };

  // --- Verify OTP input ---
  const handleVerifyOtp = () => {
    if (!generatedOtp) {
      setStatus("No OTP to verify. Please request an OTP.");
      return;
    }
    if (!otpValue) {
      setStatus("Enter the 6-digit verification code sent to your email.");
      return;
    }
    if (Date.now() > (otpExpiresAt ?? 0)) {
      setStatus("OTP expired. Please request a new one.");
      setGeneratedOtp(null);
      setOtpSent(false);
      setOtpExpiresAt(null);
      return;
    }
    if (otpValue.trim() === generatedOtp) {
      setIsVerified(true);
      setStatus("Email verified ✅. You can now book an appointment.");
      // Clear OTP from client memory
      setGeneratedOtp(null);
      setOtpSent(false);
      setOtpExpiresAt(null);
      setOtpValue("");
      if (timerRef.current) {
        window.clearInterval(timerRef.current);
        timerRef.current = null;
      }
    } else {
      setStatus("Incorrect code. Please check and try again.");
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
      const existing = patientSnap.docs[0].data() as any;
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

    if (!isVerified) {
      setStatus("Please verify your email with the OTP before booking.");
      return;
    }

    if (
      !formData.fullName ||
      !formData.email ||
      !formData.doctor ||
      !formData.date ||
      !formData.time ||
      !formData.message
    ) {
      setStatus("Please fill all required fields.");
      return;
    }

    setIsSubmitting(true);
    setStatus("Booking appointment...");

    try {
      // --- Race Condition Check ---
      // Ensure slot wasn't *just* booked by someone else
      const q = query(
        collection(db, "appointments"),
        where("doctor", "==", formData.doctor),
        where("date", "==", formData.date),
        where("time", "==", formData.time)
      );
      const existing = await getDocs(q);
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

      // Create appointment ID (e.g., "SS01", "SS02")
      // Note: This sequential ID method can have race conditions at high volume
      const snapshot = await getDocs(collection(db, "appointments"));
      const total = snapshot.size;
      const appointmentId = `SS${String(total + 1).padStart(2, "0")}`;

      // Save appointment to Firestore
      await addDoc(collection(db, "appointments"), {
        appointmentId,
        patientId,
        ...formData,
        createdAt: serverTimestamp(),
        status: "booked",
      });

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
      } catch (err) {
        console.warn("EmailJS confirmation error:", err);
        // Don't fail the whole booking if email fails
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
    } catch (err) {
      console.error("Booking error:", err);
      setStatus("❌ Booking failed. Try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need to schedule an appointment? We're here to help
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-start">
          {/* Left: Contact Info */}
          <div className="space-y-8">
            <a
              href="https://maps.google.com/?q=SS+Clinic,Kudlu,Bangalore,Karnataka,560068"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-6 items-center group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                <p className="text-gray-600">
                  SS Clinic
                  <br />
                  Kudlu, Bangalore, Karnataka 560068
                </p>
              </div>
            </a>

            <a
              href="tel:+919602154222"
              className="flex gap-6 items-center group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                <Phone className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                <p className="text-gray-600 leading-relaxed">+91 9602154222</p>
              </div>
            </a>

            <a
              href="mailto:ssclinicbangalore@gmail.com"
              className="flex gap-6 items-center group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                <Mail className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                <p className="text-gray-600">ssclinicbangalore@gmail.com</p>
              </div>
            </a>

            <div className="flex gap-6 items-center p-4">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Working Hours
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Monday - Saturday: 4:00 PM - 12:00 AM
                  <br />
                  Sunday: Closed
                  <br />
                  Emergency: 24/7 Available
                </p>
              </div>
            </div>
          </div>

          {/* Right: Appointment Form */}
          <div
            id="appointment"
            className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Book an Appointment
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg"
              />

              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* Email + OTP column */}
              <div className="flex gap-3">
                <input
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="Email address"
                  className="flex-1 px-4 py-3 border rounded-lg"
                />

                {/* Send OTP button */}
                <button
                  type="button"
                  onClick={handleSendOtp}
                  className="px-4 py-3 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                  disabled={!formData.email || isVerified}
                >
                  {isVerified ? "Verified" : otpSent ? "Resend" : "Send OTP"}
                </button>
              </div>

              {/* OTP input + verify */}
              {otpSent && (
                <div className="flex items-center gap-3">
                  <input
                    value={otpValue}
                    onChange={(e) => setOtpValue(e.target.value)}
                    placeholder="Enter 6-digit code"
                    className="flex-1 px-4 py-3 border rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={handleVerifyOtp}
                    className="px-4 py-3 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
                  >
                    Verify
                  </button>
                  <div className="text-sm text-gray-600">
                    {otpCountdown > 0 ? `Expires in ${otpCountdown}s` : "Expired"}
                  </div>
                </div>
              )}

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">-- Select Doctor --</option>
                <option value="Dr. Sujith M S">Dr. Sujith M S - Physician</option>
                <option value="Dr. Ashwini B S">
                  Dr. Ashwini B S - Pediatrician
                </option>
              </select>

              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={today}
                className="w-full px-4 py-3 border rounded-lg"
              />

              {/* Time slots (blocked if booked) */}
              {formData.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto">
                    {slots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, time: t }))}
                        disabled={bookedSlots.includes(t)}
                        className={`p-2 rounded-md border text-sm text-left truncate ${
                          bookedSlots.includes(t)
                            ? "bg-gray-300 text-gray-600 cursor-not-allowed"
                            : formData.time === t
                            ? "bg-blue-600 text-white"
                            : "hover:bg-blue-100"
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={3}
                required
                placeholder="Reason for appointment booking"
                className="w-full px-4 py-3 border rounded-lg resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting || !isVerified}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </button>

              {status && (
                <p className="text-center mt-4 font-medium text-gray-700">
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