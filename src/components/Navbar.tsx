import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

// ✅ Reusable NavLink component (simplified)
const NavLink = ({
  href,
  id,
  onClick,
  children,
}: {
  href: string;
  id: string;
  onClick: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, id: string) => void;
  children: React.ReactNode;
}) => (
  <a
    href={href}
    onClick={(e) => onClick(e, id)}
    // ✅ Always uses dark text, SLOWED ANIMATION
    className="font-medium relative group text-gray-700 hover:text-blue-600 transition-colors duration-500"
  >
    {children}
    {/* ✅ Always uses blue underline, SLOWED ANIMATION */}
    <span
      className="absolute bottom-[-4px] left-0 h-[2px] w-0 group-hover:w-full
        transition-all duration-500 ease-out bg-blue-600"
    ></span>
  </a>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const handleSectionScroll = (
    e: React.MouseEvent<HTMLAnchorElement, MouseEvent>,
    id: string
  ) => {
    e.preventDefault();
    setIsOpen(false); // Close mobile menu on click

    if (location.pathname !== '/') {
      navigate(`/#${id}`);
      return;
    }

    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav
      // ✅ Set to always be white, shadowed, and blurred
      className="fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white/95 backdrop-blur-sm shadow-lg"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* --- Logo --- */}
        <a
          href="#home"
          onClick={(e) => handleSectionScroll(e, 'home')}
          className="flex items-center space-x-2 py-1"
        >
          <img
            src="/images/logo.jpg"
            alt="SS Clinic Logo"
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          {/* ✅ Always uses dark logo text */}
          <span
            className="text-lg sm:text-xl font-semibold transition-colors duration-500 text-gray-800"
          >
            SS Clinic
          </span>
        </a>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex items-center md:space-x-6 lg:space-x-8">
          <NavLink href="#home" id="home" onClick={handleSectionScroll}>
            Home
          </NavLink>
          <NavLink href="#about" id="about" onClick={handleSectionScroll}>
            About
          </NavLink>
          <NavLink href="#doctors" id="doctors" onClick={handleSectionScroll}>
            Doctors
          </NavLink>
          <NavLink href="#services" id="services" onClick={handleSectionScroll}>
            Services
          </NavLink>
          <NavLink href="#contact" id="contact" onClick={handleSectionScroll}>
            Contact
          </NavLink>
          
          <Link
            to="/admin"
            // ✅ Always uses dark text and blue underline, SLOWED ANIMATION
            className="font-medium relative group hidden sm:inline-block text-gray-700 hover:text-blue-600 transition-colors duration-500"
          >
            Admin Login
            <span
              className="absolute bottom-[-4px] left-0 h-[2px] w-0 group-hover:w-full
                transition-all duration-500 ease-out bg-blue-600"
            ></span>
          </Link>
          
          <a
            href="#appointment"
            onClick={(e) => handleSectionScroll(e, 'appointment')}
            // ✅ SLOWED ANIMATION
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-all duration-500 hover:scale-105 hover:shadow-md"
          >
            Book Appointment
          </a>
        </div>

        {/* --- Mobile Menu Button (Animated) --- */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          // ✅ Always uses dark icon color
          className="md:hidden focus:outline-none relative h-10 w-10 flex items-center justify-center transition-colors duration-500 text-gray-800"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          {/* --- Menu Icon --- */}
          <Menu
            size={24}
            // ✅ SLOWED ANIMATION
            className={`absolute transition-all duration-500 ease-in-out
              ${
                isOpen
                  ? 'opacity-0 -rotate-90 scale-50'
                  : 'opacity-100 rotate-0 scale-100'
              }`}
          />
          {/* --- Close (X) Icon --- */}
          <X
            size={24}
            // ✅ SLOWED ANIMATION
            className={`absolute transition-all duration-500 ease-in-out
              ${
                isOpen
                  ? 'opacity-100 rotate-0 scale-100'
                  : 'opacity-0 rotate-90 scale-50'
              }`}
          />
        </button>
      </div>

      {/* --- Mobile Menu (Animated Dropdown) --- */}
      <div
        id="mobile-menu"
        // ✅ SLOWED ANIMATION
        className={`md:hidden bg-white shadow-xl border-t border-gray-200
          transition-all duration-500 ease-in-out overflow-hidden
          ${
            isOpen
              ? 'max-h-[500px] opacity-100' // Kept increased height
              : 'max-h-0 opacity-0'
          }`}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          <a
            href="#home"
            onClick={(e) => handleSectionScroll(e, 'home')}
            // ✅ SLOWED ANIMATION
            className="w-full text-center py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-500"
          >
            Home
          </a>
          <a
            href="#about"
            onClick={(e) => handleSectionScroll(e, 'about')}
            // ✅ SLOWED ANIMATION
            className="w-full text-center py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-500"
          >
            About
          </a>
          <a
            href="#doctors"
            onClick={(e) => handleSectionScroll(e, 'doctors')}
            // ✅ SLOWED ANIMATION
            className="w-full text-center py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-500"
          >
            Doctors
          </a>
          <a
            href="#services"
            onClick={(e) => handleSectionScroll(e, 'services')}
            // ✅ SLOWED ANIMATION
            className="w-full text-center py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-500"
          >
            Services
          </a>
          <a
            href="#contact"
            onClick={(e) => handleSectionScroll(e, 'contact')}
            // ✅ SLOWED ANIMATION
            className="w-full text-center py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-500"
          >
            Contact
          </a>
          <Link
            to="/admin"
            onClick={() => setIsOpen(false)}
            // ✅ SLOWED ANIMATION
            className="w-full text-center py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-500"
          >
            Admin Login
          </Link>
          <a
            href="#appointment"
            onClick={(e) => handleSectionScroll(e, 'appointment')}
            // ✅ SLOWED ANIMATION
            className="w-[90%] mx-auto text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-500 font-medium"
          >
            Book Appointment
          </a>
        </div>
      </div>
    </nav>
  );
}