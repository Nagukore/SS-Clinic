import { useState, useEffect } from 'react';
import { db } from '../firebase';
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

  useEffect(() => {
    const fetchSlots = async () => {
      setIsLoading(true);

      // Create start and end of selected day
      const start = new Date(selectedDate);
      start.setHours(9, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(20, 0, 0, 0); // doctor works till 8PM

      // Generate 7-minute interval slots
      const allSlots = generateTimeSlots(start, end, 7);

      // Fetch booked slots
      const appointmentsRef = collection(db, "appointments");
      const q = query(
        appointmentsRef,
        where("appointmentTime", ">=", Timestamp.fromDate(start)),
        where("appointmentTime", "<=", Timestamp.fromDate(end))
      );

      const snapshot = await getDocs(q);
      const booked = snapshot.docs.map(doc => (doc.data().appointmentTime as Timestamp).toDate());
      const bookedTimes = booked.map(date => date.getTime());

      // Filter out booked slots
      const available = allSlots.filter(slot => !bookedTimes.includes(slot.getTime()));

      setAvailableSlots(available);
      setIsLoading(false);
    };

    fetchSlots();
  }, [selectedDate]);

  const handleBook = async (slot: Date) => {
    try {
      // Double-check if slot still available
      const slotStart = Timestamp.fromDate(slot);
      const q = query(collection(db, "appointments"), where("appointmentTime", "==", slotStart));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        alert("This slot was just booked by another patient. Please choose a different time.");
        return;
      }

      await addDoc(collection(db, "appointments"), {
        fullName: "Test Patient",
        doctor: "Dr. Sujith M S",
        appointmentTime: slotStart,
        createdAt: Timestamp.now(),
        status: "booked",
      });

      alert(`✅ Appointment booked at ${slot.toLocaleTimeString()}`);
      setSelectedDate(new Date(selectedDate)); // refresh
    } catch (err) {
      console.error("Error booking:", err);
      alert("Something went wrong while booking.");
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Book an Appointment</h2>
      
      <input
        type="date"
        value={selectedDate.toISOString().split('T')[0]}
        onChange={(e) => setSelectedDate(new Date(e.target.value))}
        className="p-2 border rounded mb-4"
      />

      <div className="grid grid-cols-4 gap-3">
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