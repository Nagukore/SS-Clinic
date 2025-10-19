import AppointmentList from './AppointmentList';
import { getAuth, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";

export default function DashboardPage() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => {
      // Sign-out successful, navigate to login page.
      navigate('/login');
    }).catch((error) => {
      console.error("Logout Error:", error);
    });
  };

  return (
    // Changed to Tailwind classes and added pt-8 for padding-top
    <div className="p-8"> 
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
        <button 
          onClick={handleLogout} 
          className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-lg transition-colors"
        >
          Log Out
        </button>
      </div>
      <p className="text-gray-600 mb-6">Here are the current appointment requests.</p>
      <hr className="mb-6"/>
      <AppointmentList />
    </div>
  );
}