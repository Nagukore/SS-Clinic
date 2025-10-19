import { LayoutDashboard, LogOut } from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { getAuth, signOut } from 'firebase/auth';

export default function Sidebar() {
  const auth = getAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut(auth).then(() => navigate('/login'));
  };

  return (
    <div className="w-64 h-screen bg-gray-800 text-white flex flex-col flex-shrink-0">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-xl font-bold">SS Clinic Admin</h2>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        <NavLink
          to="/dashboard"
          end // This is for exact matching of the URL
          className={({ isActive }) =>
            `flex items-center gap-3 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'bg-blue-600 text-white' : 'hover:bg-gray-700'
            }`
          }
        >
          <LayoutDashboard size={20} />
          <span>Appointments</span>
        </NavLink>
        {/* You can add more links here later, e.g., for 'Patients' or 'Settings' */}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-2 rounded-md text-sm font-medium text-left hover:bg-red-600 transition-colors"
        >
          <LogOut size={20} />
          <span>Log Out</span>
        </button>
      </div>
    </div>
  );
}