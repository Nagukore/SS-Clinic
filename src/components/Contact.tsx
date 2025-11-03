// src/components/Contact.tsx
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect } from "react";
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
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    doctor: "",
    date: "",
    time: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [slots, setSlots] = useState<string[]>([]);
  const [bookedSlots, setBookedSlots] = useState<string[]>([]);

  // --- generate slots when doctor/date selected ---
  useEffect(() => {
    if (formData.doctor && formData.date) {
      let start = "17:00"; // default 5 PM
      let end = "23:45"; // default midnight

      // ✅ Doctor-specific timings
      if (formData.doctor === "Dr. Sujith M S") {
        start = "17:00";
        end = "23:45";
      } else if (formData.doctor === "Dr. Ashwini B S") {
        start = "17:00";
        end = "22:00";
      }

      const generatedSlots = generateSlots(start, end, 15); // 15-min intervals
      setSlots(generatedSlots);
      fetchBookedSlots(formData.doctor, formData.date);
    }
  }, [formData.doctor, formData.date]);

  // --- auto clear status after a few seconds ---
  useEffect(() => {
    if (status) {
      const t = setTimeout(() => setStatus(""), 5000);
      return () => clearTimeout(t);
    }
  }, [status]);

  // --- slot generator ---
  const generateSlots = (start: string, end: string, interval: number) => {
    const result: string[] = [];
    let [h, m] = start.split(":").map(Number);
    const [eh, em] = end.split(":").map(Number);

    while (h < eh || (h === eh && m <= em)) {
      result.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
      m += interval;
      if (m >= 60) {
        h++;
        m -= 60;
      }
    }
    return result;
  };

  // --- fetch booked slots ---
  const fetchBookedSlots = async (doctor: string, date: string) => {
    try {
      const q = query(
        collection(db, "appointments"),
        where("doctor", "==", doctor),
        where("date", "==", date)
      );
      const snap = await getDocs(q);
      const times = snap.docs.map((d) => d.data().time);
      setBookedSlots(times);
    } catch (e) {
      console.error("Error fetching booked slots:", e);
    }
  };

  // --- handle form field change ---
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ Find or create patient, now checks both email and fullName
  const getOrCreatePatient = async (
    email: string,
    fullName: string,
    phone: string
  ) => {
    const patientsRef = collection(db, "patients");
    const q = query(patientsRef, where("email", "==", email.toLowerCase()));
    const patientSnap = await getDocs(q);

    // Case 1: No existing record
    if (patientSnap.empty) {
      return await createNewPatient(patientsRef, email, fullName, phone);
    }

    // Case 2: Found email, but check if name matches
    const existing = patientSnap.docs[0].data();
    if (existing.fullName.toLowerCase() !== fullName.toLowerCase()) {
      // Different person using same email — create new patient ID
      return await createNewPatient(patientsRef, email, fullName, phone);
    }

    // Case 3: Same person, return existing ID
    return existing.patientId;
  };

  // --- Helper to create a new patient ---
  const createNewPatient = async (
    patientsRef: any,
    email: string,
    fullName: string,
    phone: string
  ) => {
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
  };

  // --- handle form submit ---
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setStatus("Booking appointment...");

    try {
      const patientId = await getOrCreatePatient(
        formData.email,
        formData.fullName,
        formData.phone
      );

      // Prevent double-booking same doctor/time/date
      const q = query(
        collection(db, "appointments"),
        where("doctor", "==", formData.doctor),
        where("date", "==", formData.date),
        where("time", "==", formData.time)
      );
      const existing = await getDocs(q);
      if (!existing.empty) {
        setStatus("⚠️ This time slot is already booked. Please choose another.");
        setIsSubmitting(false);
        return;
      }

      // Generate new appointment ID
      const snapshot = await getDocs(collection(db, "appointments"));
      const total = snapshot.size;
      const newAppointmentId = `SS${String(total + 1).padStart(2, "0")}`;

      await addDoc(collection(db, "appointments"), {
        appointmentId: newAppointmentId,
        patientId,
        ...formData,
        createdAt: serverTimestamp(),
        status: "booked",
      });

      // Send confirmation via EmailJS
      const templateParams = {
        appointment_id: newAppointmentId,
        patient_id: patientId,
        patient_name: formData.fullName,
        doctor_name: formData.doctor,
        appointment_date: formData.date,
        appointment_time: formData.time,
        to_email: formData.email,
      };

      emailjs.send(
        "service_lryd73h",
        "template_r26t8ov",
        templateParams,
        "MGrfNH-8tMwQkb0fp"
      );

      setStatus(
        `✅ Appointment booked successfully! ID: ${newAppointmentId} (Patient: ${patientId})`
      );
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
    } catch (err) {
      console.error("Error booking appointment:", err);
      setStatus("❌ Failed to book. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <section id="contact" className="py-20 bg-gradient-to-br from-blue-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need to schedule an appointment? We're here to help.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Section */}
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
                  S S Clinic <br />
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
                <p className="text-gray-600 leading-relaxed">
                  Main: +91 9602154222 <br />
                  Appointments: +91 9602154222
                </p>
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
                <h3 className="text-xl font-bold text-gray-900 mb-2">Working Hours</h3>
                <p className="text-gray-600 leading-relaxed">
                  Monday - Saturday: 5:00 PM - 12:00 AM
                  <br />
                  Sunday: Closed
                  <br />
                  Emergency: 24/7 Available
                </p>
              </div>
            </div>
          </div>

          {/* Right Section */}
          <div id="appointment" className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Book an Appointment
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                placeholder="Full Name"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Phone Number"
                className="w-full px-4 py-3 border rounded-lg"
              />
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Email"
                className="w-full px-4 py-3 border rounded-lg"
              />

              <select
                name="doctor"
                value={formData.doctor}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border rounded-lg"
              >
                <option value="">-- Select Doctor --</option>
                <option value="Dr. Sujith M S">Dr. Sujith M S - Physician</option>
                <option value="Dr. Ashwini B S">Dr. Ashwini B S - Pediatrician</option>
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

              {formData.date && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Time Slots
                  </label>
                  <div className="grid grid-cols-3 gap-2 max-h-60 overflow-y-auto">
                    {slots.map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setFormData((p) => ({ ...p, time: t }))}
                        disabled={bookedSlots.includes(t)}
                        className={`p-2 rounded-md border text-sm ${
                          bookedSlots.includes(t)
                            ? "bg-gray-200 text-gray-500 cursor-not-allowed"
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

              {/* ✅ Message (Required) */}
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                required
                rows={3}
                placeholder="Reason for visit (required)"
                className="w-full px-4 py-3 border rounded-lg resize-none"
              />

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
              >
                {isSubmitting ? "Booking..." : "Book Appointment"}
              </button>

              {status && (
                <p className="text-center mt-4 font-medium text-gray-700">{status}</p>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
