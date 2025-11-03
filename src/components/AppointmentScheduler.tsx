import { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { RecaptchaVerifier, signInWithPhoneNumber } from 'firebase/auth';
import { collection, query, where, getDocs, Timestamp, addDoc } from "firebase/firestore";

// Generate time slots (every 7 minutes)
function generateTimeSlots(startTime: Date, endTime: Date, interval: number): Date[] {
  const slots: Date[] = [];
  let current = new Date(startTime);
  while (current < endTime) {
    slots.push(new Date(current));
    current.setMinutes(current.getMinutes() + interval);
  }
  return slots;
}

export default function AppointmentScheduler() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [availableSlots, setAvailableSlots] = useState<Date[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // For OTP
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);
  const [verified, setVerified] = useState(false);

  // Generate and filter slots
  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);

      const start = new Date(selectedDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(20, 0, 0, 0);

      const allSlots = generateTimeSlots(start, end, 7);

      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("appointmentTime", ">=", Timestamp.fromDate(start)),
        where("appointmentTime", "<=", Timestamp.fromDate(end))
      );

      const snapshot = await getDocs(q);
      const booked = snapshot.docs.map(doc => (doc.data().appointmentTime as Timestamp).toDate());
      const bookedTimes = booked.map(date => date.getTime());
      const available = allSlots.filter(slot => !bookedTimes.includes(slot.getTime()));

      setAvailableSlots(available);
      setIsLoading(false);
    };

    fetchSlots();
  }, [selectedDate]);

  // -------------------------------
  // OTP Verification Logic
  // -------------------------------

  const sendOtp = async () => {
    if (!phone.startsWith("+91")) {
      alert("⚠️ Please include country code (e.g., +91XXXXXXXXXX)");
      return;
    }

    try {
      (window as any).recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
        size: "invisible",
      });

      const appVerifier = (window as any).recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(result);
      alert("📩 OTP sent successfully!");
    } catch (error) {
      console.error("OTP error:", error);
      alert("❌ Failed to send OTP. Try again.");
    }
  };

  const verifyOtp = async () => {
    if (!confirmationResult) {
      alert("No OTP request found. Please request OTP first.");
      return;
    }

    try {
      await confirmationResult.confirm(otp);
      setVerified(true);
      alert("✅ Phone number verified!");
    } catch {
      alert("❌ Invalid OTP. Try again.");
    }
  };

  // -------------------------------
  // Booking Logic
  // -------------------------------
  const handleBook = async (slot: Date) => {
    if (!verified) {
      alert("⚠️ Please verify your phone number before booking.");
      return;
    }

    try {
      const slotStart = Timestamp.fromDate(slot);
      const q = query(collection(db, "appointments"), where("appointmentTime", "==", slotStart));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("This slot was just booked by another patient. Please choose a different time.");
        return;
      }

      await addDoc(collection(db, "appointments"), {
        fullName: "Verified Patient",
        phone,
        doctor: "Dr. Sujith M S",
        appointmentTime: slotStart,
        createdAt: Timestamp.now(),
        status: "booked",
      });

      alert(`✅ Appointment booked at ${slot.toLocaleTimeString()}`);
      setSelectedDate(new Date(selectedDate));
    } catch (err) {
      console.error("Error booking:", err);
      alert("Something went wrong while booking.");
    }
  };

  // -------------------------------
  // Render UI
  // -------------------------------
  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>

      {/* Phone verification section */}
      <div className="bg-gray-100 p-4 rounded mb-6">
        <h3 className="text-lg font-semibold mb-2">📱 Verify your phone number</h3>

        <input
          type="tel"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="border p-2 rounded w-full mb-3"
        />

        {!verified ? (
          <>
            <button
              onClick={sendOtp}
              className="bg-blue-500 text-white py-2 px-4 rounded w-full mb-3"
            >
              Send OTP
            </button>
            <div id="recaptcha-container"></div>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="border p-2 rounded w-full mb-3"
            />
            <button
              onClick={verifyOtp}
              className="bg-green-500 text-white py-2 px-4 rounded w-full"
            >
              Verify OTP
            </button>
          </>
        ) : (
          <p className="text-green-600 font-semibold">✅ Number Verified</p>
        )}
      </div>

      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        className="p-2 border rounded mb-4 w-full"
      />

      <div className="grid grid-cols-3 gap-3">
        {isLoading ? (
          <p>Loading available slots...</p>
        ) : availableSlots.length === 0 ? (
          <p>No available slots today.</p>
        ) : (
          availableSlots.map((slot, i) => (
            <button
              key={i}
              onClick={() => handleBook(slot)}
              className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
            >
              {slot.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </button>
          ))
        )}
      </div>
    </div>
  );
}
