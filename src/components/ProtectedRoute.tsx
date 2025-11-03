import React from "react";
import { getAuth, onAuthStateChanged, signOut, User } from "firebase/auth";
import { Navigate, useLocation, useNavigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [user, setUser] = React.useState<User | null>(null);
  const [checkingAuth, setCheckingAuth] = React.useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  // ✅ Listen for Firebase authentication changes
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setCheckingAuth(false);
    });
    return () => unsubscribe();
  }, [auth]);

  // ✅ Safe logout (kept internally, not displayed)
  const handleLogout = async () => {
    try {
      await signOut(auth);
      if (location.pathname.startsWith("/dashboard")) {
        navigate("/admin");
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  // ✅ Loader while checking authentication
  if (checkingAuth) {
    return (
      <div className="flex items-center justify-center h-screen bg-white">
        <div className="text-blue-600 text-lg font-medium animate-pulse">
          Checking session...
        </div>
      </div>
    );
  }

  // ✅ Redirect if unauthenticated
  if (!user) {
    return location.pathname.startsWith("/dashboard") ? (
      <Navigate to="/admin" replace />
    ) : (
      <Navigate to="/login" replace />
    );
  }

  // ✅ Authenticated → show protected content (no logout button)
  return <>{children}</>;
}
