import { Phone, Mail, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.jpg"
                alt="Srishakthi Clinic Logo"
                className="h-12 w-12 object-contain"
              />
              <h3 className="text-2xl font-bold">SS Clinic</h3>
            </div>
            <p className="text-gray-400 leading-relaxed mb-4">
              Healthcare is more than just treatment — it is compassion, trust, and healing that embraces the whole person.
            </p>
          </div>

          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><a href="#home" className="text-gray-400 hover:text-blue-400 transition-colors">Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-blue-400 transition-colors">About Us</a></li>
              <li><a href="#doctors" className="text-gray-400 hover:text-blue-400 transition-colors">Our Doctors</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-blue-400 transition-colors">Services</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-blue-400 transition-colors">Contact</a></li>
            </ul>
          </div>

         <div>
  <h4 className="text-lg font-bold mb-4">Contact Info</h4>
  <ul className="space-y-3">
    {/* Location */}
    <li className="flex items-start gap-2">
      <MapPin size={18} className="text-blue-400 mt-1 flex-shrink-0" />
      <a
        href="https://www.google.com/maps?q=SS+Clinic+Kudlu+Bangalore+Karnataka+560068"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-400 text-sm hover:text-blue-500 transition-colors duration-300"
      >
        SS Clinic Kudlu, Bangalore, Karnataka 560068
      </a>
    </li>

    {/* Phone */}
    <li className="flex items-center gap-2">
      <Phone size={18} className="text-blue-400 flex-shrink-0" />
      <a
        href="tel:+919620154222"
        className="text-gray-400 text-sm hover:text-blue-500 transition-colors duration-300"
      >
        +91 9620154222
      </a>
    </li>

    {/* Email */}
    <li className="flex items-center gap-2">
      <Mail size={18} className="text-blue-400 flex-shrink-0" />
      <a
        href="mailto:ssclinicbangalore@gmail.com"
        className="text-gray-400 text-sm hover:text-blue-500 transition-colors duration-300"
      >
        ssclinicbangalore@gmail.com
      </a>
    </li>
  </ul>
</div>

        </div>

        <div className="border-t border-gray-800 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            &copy; {new Date().getFullYear()} SS Clinic. All rights reserved. Built with care for better health.
          </p>
        </div>
      </div>
    </footer>
  );
}
