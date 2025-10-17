import { useState, useEffect } from 'react';
import { db } from '../firebase'; // The SAME firebase.ts file
import { collection, getDocs } from 'firebase/firestore';

// Define a type for the appointment data
interface Appointment {
  id: string;
  fullName: string;
  doctor: string;
  date: string;
  time: string;
}

const AppointmentList = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'appointments'));
        const appointmentsData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Appointment[];
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []); // The empty array means this runs once when the component loads

  if (isLoading) {
    return <div>Loading appointments...</div>;
  }

  return (
    <div>
      <h2>Appointment List</h2>
      <ul>
        {appointments.map(app => (
          <li key={app.id}>
            <strong>{app.fullName}</strong> - Dr. {app.doctor} on {app.date} at {app.time}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;