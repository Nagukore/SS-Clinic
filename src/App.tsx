// src/App.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";

import HomePage from "./components/HomePage";
import Contact from "./components/Contact";
import Doctors from "./components/Doctors";
import Services from "./components/Services";
import LoginPage from "./components/LoginPage";
import DashboardPage from "./components/DashboardPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [auth]);

  if (loading) return <div>Loading...</div>;

  return (
    <Routes>
      {/* If not logged in, always go to login page */}
      {!user ? (
        <>
          <Route path="/*" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
        </>
      ) : (
        <>
          {/* Website routes available after login */}
          <Route path="/" element={<HomePage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/doctors" element={<Doctors />} />
          <Route path="/services" element={<Services />} />

          {/* Protected admin dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </>
      )}
    </Routes>
  );
}

export default App;
