import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';

interface Appointment {
  id: string;
  appointmentID: string; // SS01, SS02...
  fullName: string;
  doctor: string;
  date: string;
  time: string;
  phone: string;
  message: string;
  status: string;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsQuery = query(collection(db, 'appointments'), orderBy('date', 'desc'));
        const querySnapshot = await getDocs(appointmentsQuery);

        const appointmentsData = querySnapshot.docs.map((doc, index) => {
          const data = doc.data();
          return {
            id: doc.id,
            appointmentID: data.appointmentID || `SS${String(index + 1).padStart(2, '0')}`,
            fullName: data.fullName || 'N/A',
            doctor: data.doctor || 'N/A',
            date: data.date || 'N/A',
            time: data.time || 'N/A',
            phone: data.phone || 'N/A',
            message: data.message || '—',
            status: data.status || 'Booked',
          } as Appointment;
        });

        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error fetching appointments: ", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'booked':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="text-center p-8">Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return <div className="text-center p-8 text-gray-500">No appointments found.</div>;
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">App ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Doctor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Time</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Phone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reason</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {appointments.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{app.appointmentID}</td>
                <td className="px-6 py-4 text-sm font-medium text-gray-900">{app.fullName}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.doctor}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.date}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.time}</td>
                <td className="px-6 py-4 text-sm text-gray-600">{app.phone}</td>
                <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{app.message}</td>
                <td className="px-6 py-4 text-sm">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(app.status)}`}>
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
