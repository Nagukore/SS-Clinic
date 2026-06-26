import { useState, useEffect } from 'react';
import { NavLink as RouterNavLink, Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/about', label: 'About' },
  { to: '/doctors', label: 'Doctors' },
  { to: '/services', label: 'Services' },
  { to: '/blogs', label: 'Blogs' },
  { to: '/contact', label: 'Contact' },
];

// Desktop nav link with animated underline + active state.
const DesktopLink = ({
  to,
  label,
  end,
}: {
  to: string;
  label: string;
  end?: boolean;
}) => (
  <RouterNavLink
    to={to}
    end={end}
    className={({ isActive }) =>
      `font-medium relative group transition-colors duration-500 ${
        isActive ? 'text-blue-600' : 'text-gray-700 hover:text-blue-600'
      }`
    }
  >
    {({ isActive }) => (
      <>
        {label}
        <span
          className={`absolute bottom-[-4px] left-0 h-[2px] transition-all duration-500 ease-out bg-blue-600 ${
            isActive ? 'w-full' : 'w-0 group-hover:w-full'
          }`}
        ></span>
      </>
    )}
  </RouterNavLink>
);

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  // Close the mobile menu whenever the route changes.
  useEffect(() => {
    setIsOpen(false);
  }, [location]);

  return (
    <nav className="fixed top-0 left-0 w-full z-50 transition-all duration-500 bg-white/95 backdrop-blur-sm shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2 sm:py-3 flex items-center justify-between">
        {/* --- Logo --- */}
        <Link to="/" className="flex items-center space-x-2 py-1">
          <img
            src="/images/logo.jpg"
            alt="SS Clinic Logo"
            className="h-8 w-8 sm:h-10 sm:w-10"
          />
          <span className="text-lg sm:text-xl font-semibold transition-colors duration-500 text-gray-800">
            SS Clinic
          </span>
        </Link>

        {/* --- Desktop Menu --- */}
        <div className="hidden md:flex items-center md:space-x-6 lg:space-x-8">
          {navItems.map((item) => (
            <DesktopLink key={item.to} to={item.to} label={item.label} end={item.end} />
          ))}

          <Link
            to="/admin"
            className="font-medium relative group hidden sm:inline-block text-gray-700 hover:text-blue-600 transition-colors duration-500"
          >
            Admin Login
            <span className="absolute bottom-[-4px] left-0 h-[2px] w-0 group-hover:w-full transition-all duration-500 ease-out bg-blue-600"></span>
          </Link>

          <Link
            to="/contact#appointment"
            className="bg-blue-600 text-white px-4 sm:px-5 py-2 text-sm sm:text-base rounded-lg hover:bg-blue-700 transition-all duration-500 hover:scale-105 hover:shadow-md"
          >
            Book Appointment
          </Link>
        </div>

        {/* --- Mobile Menu Button (Animated) --- */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden focus:outline-none relative h-10 w-10 flex items-center justify-center transition-colors duration-500 text-gray-800"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
          aria-controls="mobile-menu"
        >
          <Menu
            size={24}
            className={`absolute transition-all duration-500 ease-in-out ${
              isOpen ? 'opacity-0 -rotate-90 scale-50' : 'opacity-100 rotate-0 scale-100'
            }`}
          />
          <X
            size={24}
            className={`absolute transition-all duration-500 ease-in-out ${
              isOpen ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-50'
            }`}
          />
        </button>
      </div>

      {/* --- Mobile Menu (Animated Dropdown) --- */}
      <div
        id="mobile-menu"
        className={`md:hidden bg-white shadow-xl border-t border-gray-200 transition-all duration-500 ease-in-out overflow-hidden ${
          isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex flex-col items-center space-y-4 py-4">
          {navItems.map((item) => (
            <RouterNavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `w-full text-center py-2 font-medium transition-colors duration-500 ${
                  isActive
                    ? 'text-blue-600 bg-blue-50'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-blue-50'
                }`
              }
            >
              {item.label}
            </RouterNavLink>
          ))}
          <Link
            to="/admin"
            className="w-full text-center py-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 font-medium transition-colors duration-500"
          >
            Admin Login
          </Link>
          <Link
            to="/contact#appointment"
            className="w-[90%] mx-auto text-center bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-500 font-medium"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </nav>
  );
}
