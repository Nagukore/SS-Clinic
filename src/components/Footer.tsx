import { Phone, Mail, MapPin } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white pt-16 pb-10">
      {/* ✅ Same container system as all sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ✅ Grid Layout (responsive & clean) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">

          {/* -------- 1. Logo & Description -------- */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <img
                src="/images/logo.jpg"
                alt="SS Clinic Logo"
                className="h-12 w-12 object-contain rounded-md"
              />
              <h3 className="text-2xl font-bold tracking-wide">SS Clinic</h3>
            </div>

            <p className="text-gray-400 leading-relaxed">
              Healthcare is more than treatment — it's compassion, trust, and a
              commitment to healing the whole person.
            </p>
          </div>

          {/* -------- 2. Quick Links -------- */}
          <div>
            <h4 className="text-lg font-bold mb-4">Quick Links</h4>
            <ul className="space-y-3 text-gray-400">
              <li><a href="#home" className="hover:text-blue-400 transition">Home</a></li>
              <li><a href="#about" className="hover:text-blue-400 transition">About Us</a></li>
              <li><a href="#doctors" className="hover:text-blue-400 transition">Our Doctors</a></li>
              <li><a href="#services" className="hover:text-blue-400 transition">Services</a></li>
              <li><a href="#contact" className="hover:text-blue-400 transition">Contact</a></li>
            </ul>
          </div>

          {/* -------- 3. Contact Info -------- */}
          <div>
            <h4 className="text-lg font-bold mb-4">Contact Info</h4>

            <ul className="space-y-4 text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin className="text-blue-400 mt-1 flex-shrink-0" size={18} />
                <a
                  href="https://maps.google.com/?q=SS+Clinic+Kudlu+Bangalore+560068"
                  className="hover:text-blue-400 transition block break-words text-sm"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  SS Clinic, Kudlu<br />
                  Bangalore, Karnataka 560068
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Phone className="text-blue-400 flex-shrink-0" size={18} />
                <a href="tel:+919620154222" className="hover:text-blue-400 transition text-sm">
                  +91 9620154222
                </a>
              </li>

              <li className="flex items-center gap-3">
                <Mail className="text-blue-400 flex-shrink-0" size={18} />
                <a
                  href="mailto:ssclinicbangalore@gmail.com"
                  className="hover:text-blue-400 transition block break-words text-sm"
                >
                  ssclinicbangalore@gmail.com
                </a>
              </li>
            </ul>
          </div>

          {/* -------- 4. Hours (New) -------- */}
          <div>
            <h4 className="text-lg font-bold mb-4">Working Hours</h4>

            <ul className="text-gray-400 space-y-2 text-sm">
              <li>Mon – Sat: 4:00 PM – 12:00 AM</li>
              <li>Sunday: Closed</li>
             <li className="pt-2 text-blue-400 font-medium">Emergency: Call clinic for guidance</li>
            </ul>
          </div>

        </div>

        {/* ✅ Bottom Bar */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} SS Clinic — All rights reserved.
            <br />Built with care for better health.
          </p>
        </div>

      </div>
    </footer>
  );
}
