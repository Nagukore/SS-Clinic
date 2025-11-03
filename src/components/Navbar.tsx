import { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const location = useLocation();
  const navigate = useNavigate();
  const auth = getAuth();

  // Monitor login state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, [auth]);

  // Handle logout
  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("✅ You’ve been safely logged out.");
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("⚠️ Error logging out. Please try again.");
    }
  };

  // Smooth scroll handler
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    setIsOpen(false);

    if (location.pathname !== "/") {
      window.location.href = `/#${id}`;
      return;
    }

    const section = document.getElementById(id);
    if (section) section.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleScroll(e, "home")}
          className="flex items-center space-x-2"
        >
          <img src="/images/logo.jpg" alt="SS Clinic Logo" className="h-10 w-10" />
          <span className="text-xl font-semibold text-gray-800">
            SS Clinic
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#home"
            onClick={(e) => handleScroll(e, "home")}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, "about")}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            About
          </a>
          <a
            href="#doctors"
            onClick={(e) => handleScroll(e, "doctors")}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Doctors
          </a>
          <a
            href="#services"
            onClick={(e) => handleScroll(e, "services")}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Services
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScroll(e, "contact")}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Contact
          </a>
          <Link
            to="/admin"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Admin Login
          </Link>
          <a
            href="#appointment"
            onClick={(e) => handleScroll(e, "appointment")}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Book Appointment
          </a>

          {/* ✅ User Safe Logout button */}
          {user && (
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition shadow"
            >
              <LogOut size={16} />
              Logout
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white shadow-md border-t border-gray-200">
          <div className="flex flex-col items-center space-y-4 py-4">
            <a
              href="#home"
              onClick={(e) => handleScroll(e, "home")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => handleScroll(e, "about")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              About
            </a>
            <a
              href="#doctors"
              onClick={(e) => handleScroll(e, "doctors")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Doctors
            </a>
            <a
              href="#services"
              onClick={(e) => handleScroll(e, "services")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Services
            </a>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, "contact")}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Contact
            </a>
            <Link
              to="/admin"
              onClick={() => setIsOpen(false)}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Admin Login
            </Link>
            <a
              href="#appointment"
              onClick={(e) => handleScroll(e, "appointment")}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Book Appointment
            </a>

            {/* ✅ Mobile Logout Button */}
            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
              >
                <LogOut size={16} />
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
