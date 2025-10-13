import { MapPin, Phone, Mail, Clock } from "lucide-react";

export default function Contact() {
  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Get In Touch
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Have questions or need to schedule an appointment? We're here to
            help you
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Left Section */}
          <div className="space-y-8">
            {/* Visit Us */}
            <a
              href="https://www.google.com/maps?q=S+S+Clinic+Kudlu+Bangalore+560068"
              target="_blank"
              rel="noopener noreferrer"
              className="flex gap-6 items-start group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <MapPin className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Visit Us
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  S S Clinic
                  <br />
                  Kudlu
                  <br />
                  Bangalore, Karnataka 560068
                </p>
              </div>
            </a>

            {/* Call Us */}
            <a
              href="tel:+919602154222"
              className="flex gap-6 items-start group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Phone className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Call Us
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Main: +91 9602154222
                  <br />
                  Appointments: +91 9602154222
                </p>
              </div>
            </a>

            {/* Email Us */}
            <a
              href="mailto:info@shakthiclinic.com"
              className="flex gap-6 items-start group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Mail className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Email Us
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  info@shakthiclinic.com
                </p>
              </div>
            </a>

            {/* Working Hours */}
            <div className="flex gap-6 items-start group">
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                <Clock className="text-white" size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">
                  Working Hours
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  Monday - Saturday: 9:00 AM - 8:00 PM
                  <br />
                  Sunday: 9:00 AM - 2:00 PM
                  <br />
                  Emergency: 24/7 Available
                </p>
              </div>
            </div>
          </div>

          {/* Right Section - Appointment Form */}
          <div
            id="appointment"
            className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100"
          >
            <h3 className="text-2xl font-bold text-gray-900 mb-6">
              Book an Appointment
            </h3>

            <form className="space-y-4">
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Phone Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your phone number"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter your email"
                />
              </div>

              {/* Select Doctor */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Doctor
                </label>
                <select
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="">-- Select Doctor --</option>
                  <option>Dr. Sujith M S - Psychiatrist</option>
                  <option>Dr. Ashwini B S - Pediatrician</option>
                </select>
              </div>

              {/* Preferred Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Date
                </label>
                <input
                  type="date"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Preferred Time */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time
                </label>
                <input
                  type="time"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Any specific concerns or requirements"
                ></textarea>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl"
              >
                Book Appointment
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}
