import { useState } from 'react';
// 1. Import useNavigate
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate(); // 2. Initialize the hook

  // Smooth scroll handler
  const handleScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    setIsOpen(false); // Close mobile menu on click

    // 3. Updated logic to use navigate
    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      // The browser will handle the smooth scroll to the hash
      // because of your `scroll-behavior: smooth` in index.css
      return;
    }

    // If already on the home page, scroll manually
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full bg-white shadow-md z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Logo */}
        <a
          href="#home"
          onClick={(e) => handleScroll(e, 'home')}
          className="flex items-center space-x-2"
        >
          <img
            src="/images/logo.jpg"
            alt="SS Clinic Logo"
            className="h-10 w-10"
          />
          <span className="text-xl font-semibold text-gray-800">
            SS Clinic
          </span>
        </a>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center space-x-8">
          <a
            href="#home"
            onClick={(e) => handleScroll(e, 'home')}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => handleScroll(e, 'about')}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            About
          </a>
          <a
            href="#doctors"
            onClick={(e) => handleScroll(e, 'doctors')}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Doctors
          </a>
          <a
            href="#services"
            onClick={(e) => handleScroll(e, 'services')}
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            Services
          </a>
          <a
            href="#contact"
            onClick={(e) => handleScroll(e, 'contact')}
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
            onClick={(e) => handleScroll(e, 'appointment')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Book Appointment
          </a>
        </div>

        {/* --- Mobile Menu Button (Accessibility Fix) --- */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-gray-800 focus:outline-none"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {isOpen ? <X size={26} /> : <Menu size={26} />}
        </button>
      </div>

      {/* --- Mobile Menu (Accessibility Fix) --- */}
      {isOpen && (
        <div
          id="mobile-menu" // ID matches aria-controls
          className="md:hidden bg-white shadow-md border-t border-gray-200"
        >
          <div className="flex flex-col items-center space-y-4 py-4">
            <a
              href="#home"
              onClick={(e) => handleScroll(e, 'home')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Home
            </a>
            <a
              href="#about"
              onClick={(e) => handleScroll(e, 'about')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              About
            </a>
            <a
              href="#doctors"
              onClick={(e) => handleScroll(e, 'doctors')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Doctors
            </a>
            <a
              href="#services"
              onClick={(e) => handleScroll(e, 'services')}
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Services
            </a>
            <a
              href="#contact"
              onClick={(e) => handleScroll(e, 'contact')}
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
              onClick={(e) => handleScroll(e, 'appointment')}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Book Appointment
            </a>
          </div>
        </div>
      )}
    </nav>
  );
}