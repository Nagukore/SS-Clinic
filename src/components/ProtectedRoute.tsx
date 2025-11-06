import React from 'react';
import { getAuth, onAuthStateChanged, User } from 'firebase/auth';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [loading, setLoading] = React.useState(true);
  const auth = getAuth();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [auth]);

  if (loading) {
    return <div>Loading...</div>; // Or a spinner component
  }

  if (!user) {
    // If user is not logged in, redirect to the login page
    // FIX: Changed "/login" to "/admin" to match your main.tsx routes
    return <Navigate to="/admin" replace />;
  }

  // If user is logged in, show the protected content (the dashboard)
  return <>{children}</>;
}