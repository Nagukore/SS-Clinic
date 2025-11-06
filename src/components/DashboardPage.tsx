import { useEffect, useMemo, useState } from "react";
import AppointmentList from "./AppointmentList";
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  CalendarSearch,
  LogOut,
  UserCircle,
} from "lucide-react";

import {
  collection,
  onSnapshot,
  query,
  where,
  getFirestore,
} from "firebase/firestore";

type AppointmentDoc = {
  appointmentId: string;
  date: string;      // stored as "YYYY-MM-DD" (from your form)
  time: string;
  status?: string;   // "booked" | "cancelled" | etc.
  // ...other fields
};

export default function DashboardPage() {
  const auth = getAuth();
  const navigate = useNavigate();
  const db = getFirestore();

  // ---- KPIs (cards) ----
  const [todayAppointments, setTodayAppointments] = useState<number>(0);
  const [activePatients, setActivePatients] = useState<number>(0);
  const [systemStatus, setSystemStatus] = useState<"Active" | "Offline">(
    "Active"
  );

  // Compute today's date string in the same format your form saves
  const todayStr = useMemo(() => {
    // Local date (YYYY-MM-DD) — matches the Contact form
    const d = new Date();
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const dd = String(d.getDate()).padStart(2, "0");
    return `${yyyy}-${mm}-${dd}`;
  }, []);

  // ---- Realtime: Today's appointments ----
  useEffect(() => {
    try {
      // Query by date === today (no composite index needed)
      const q = query(
        collection(db, "appointments"),
        where("date", "==", todayStr)
      );
      const unsub = onSnapshot(
        q,
        (snap) => {
          // If you only want "booked" ones, filter here
          const booked = snap.docs
            .map((d) => d.data() as AppointmentDoc)
            .filter((a) => (a.status ?? "booked") === "booked");
          setTodayAppointments(booked.length);
          setSystemStatus("Active");
        },
        (err) => {
          console.error("Realtime appointments error:", err);
          setSystemStatus("Offline");
        }
      );
      return () => unsub();
    } catch (e) {
      console.error(e);
      setSystemStatus("Offline");
    }
  }, [db, todayStr]);

  // ---- Realtime: Active patients (count of documents) ----
  useEffect(() => {
    try {
      const unsub = onSnapshot(
        collection(db, "patients"),
        (snap) => {
          setActivePatients(snap.size);
          setSystemStatus("Active");
        },
        (err) => {
          console.error("Realtime patients error:", err);
          setSystemStatus("Offline");
        }
      );
      return () => unsub();
    } catch (e) {
      console.error(e);
      setSystemStatus("Offline");
    }
  }, [db]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/"); // ProtectedRoute will redirect as needed
    } catch (error) {
      console.error("Logout Error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <LayoutDashboard size={26} className="text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-800">
              Admin Dashboard
            </h1>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg shadow-sm transition"
          >
            <LogOut size={18} />
            Log Out
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto w-full px-6 py-8">
        {/* KPI Cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {/* Today's Appointments */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex gap-4 items-center">
            <div className="w-14 h-14 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
              <CalendarSearch size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Today's Appointments</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {todayAppointments}
              </h3>
            </div>
          </div>

          {/* Active Patients */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex gap-4 items-center">
            <div className="w-14 h-14 bg-green-100 text-green-600 rounded-xl flex items-center justify-center">
              <UserCircle size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Patients</p>
              <h3 className="text-2xl font-bold text-gray-800">
                {activePatients}
              </h3>
            </div>
          </div>

          {/* System Status */}
          <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 flex gap-4 items-center">
            <div className="w-14 h-14 bg-purple-100 text-purple-600 rounded-xl flex items-center justify-center">
              <LayoutDashboard size={28} />
            </div>
            <div>
              <p className="text-sm text-gray-600">System Status</p>
              <h3
                className={`text-2xl font-bold ${
                  systemStatus === "Active" ? "text-gray-800" : "text-red-600"
                }`}
              >
                {systemStatus}
              </h3>
            </div>
          </div>
        </div>

        {/* Appointment List */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-3 flex items-center gap-2">
            <CalendarSearch size={26} className="text-blue-600" />
            Appointment Requests
          </h2>
          <p className="text-gray-600 mb-6">
            View and manage patient appointment bookings.
          </p>
          <hr className="mb-6" />
          <AppointmentList />
        </div>
      </main>
    </div>
  );
}
