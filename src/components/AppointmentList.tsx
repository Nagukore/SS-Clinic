import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

interface Appointment {
  id: string;
  appointmentID: string;
  patientId: string; // ✅ --- Add patientId ---
  fullName: string;
  doctor: string;
  date: string;
  time: string;
  phone: string;
  message: string;
  status: string;
  createdAt: unknown;
}

export default function AppointmentList() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState<string>(''); // "YYYY-MM-DD" or "" for all

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsCollection = collection(db, 'appointments');
        const q = query(appointmentsCollection, orderBy('createdAt', 'asc'));
        
        const querySnapshot = await getDocs(q);

        const appointmentsData = querySnapshot.docs.map((doc, index) => {
          const data = doc.data();

          let dateValue = data.date;
          if (dateValue && typeof dateValue === 'object' && dateValue.toDate) {
            dateValue = dateValue.toDate().toISOString().split('T')[0];
          }
          
          const realAppointmentId = data.appointmentId || null;

          return {
            id: doc.id,
            appointmentID: realAppointmentId || `SS${String(index + 1).padStart(2, '0')}`,
            patientId: data.patientId || 'N/A', // ✅ --- Read patientId from data ---
            fullName: data.fullName || 'N/A',
            doctor: data.doctor || 'N/A',
            date: dateValue || 'N/A',
            time: data.time || 'N/A',
            phone: data.phone || 'N/A',
            message: data.message || '—',
            status: data.status || 'Booked',
            createdAt: data.createdAt,
          } as Appointment;
        });

        setAppointments(appointmentsData);

      } catch (error) {
        console.error('Error fetching appointments: ', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAppointments();
  }, []);

  const getStatusColor = (status: string) => {
    // ... (This function is unchanged)
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

  const filteredAppointments = dateFilter
    ? appointments.filter((app) => app.date === dateFilter)
    : appointments;

  if (isLoading) {
    return <div className="text-center p-8 text-gray-500 animate-pulse">Loading appointments...</div>;
  }

  if (appointments.length === 0) {
    return <div className="text-center p-8 text-gray-500">No appointments found.</div>;
  }

  return (
    <div>
      {/* Date filter toolbar */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        <label htmlFor="appointment-date-filter" className="text-sm font-medium text-gray-700">
          Filter by date:
        </label>
        <input
          id="appointment-date-filter"
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        {dateFilter && (
          <button
            onClick={() => setDateFilter('')}
            className="text-sm font-medium text-blue-600 hover:text-blue-800"
          >
            Clear
          </button>
        )}
        <span className="text-sm text-gray-500 ml-auto">
          Showing {filteredAppointments.length} of {appointments.length}
        </span>
      </div>

      {filteredAppointments.length === 0 ? (
        <div className="text-center p-8 text-gray-500 bg-white rounded-2xl shadow-lg border border-gray-200">
          No appointments found for {dateFilter}.
        </div>
      ) : (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">App ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Patient ID</th> {/* ✅ New Column */}
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
            {filteredAppointments.map((app) => (
              <tr key={app.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-sm font-semibold text-gray-800">{app.appointmentID}</td>
                <td className="px-6 py-4 text-sm font-semibold text-gray-500">{app.patientId}</td> {/* ✅ New Data Cell */}
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
      )}
    </div>
  );
}