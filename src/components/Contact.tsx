// src/components/Contact.tsx
import { MapPin, Phone, Mail, Clock } from "lucide-react";
import { useState, useEffect } from "react"; // 1. Import useEffect
import { db } from "../firebase"; // Firebase config
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

type FormData = {
  fullName: string;
  phone: string;
  email: string;
  doctor: string;
  date: string;
  time: string;
  message: string;
};

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    doctor: "",
    date: "",
    time: "",
    message: "",
  });

  const [status, setStatus] = useState("");
  // 2. New state to track submission status
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Clear the status message after 5 seconds
  useEffect(() => {
    if (status) {
      const timer = setTimeout(() => {
        setStatus("");
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true); // Disable the button
    setStatus("Booking appointment...");

    try {
      await addDoc(collection(db, "appointments"), {
        ...formData,
        createdAt: serverTimestamp(),
      });

      setStatus("Appointment booked successfully!");
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        doctor: "",
        date: "",
        time: "",
        message: "",
      });
    } catch (error) {
      console.error("Error booking appointment:", error);
      setStatus("Failed to book. Please try again.");
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };
  
  // 4. Get today's date in YYYY-MM-DD format for the min attribute
  const today = new Date().toISOString().split("T")[0];

  return (
    <section
      id="contact"
      className="py-20 bg-gradient-to-br from-blue-50 to-white"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* ... your header and contact info sections remain the same ... */}
        <div className="text-center mb-16">
           <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
             Get In Touch
           </h2>
           <p className="text-lg text-gray-600 max-w-2xl mx-auto">
             Have questions or need to schedule an appointment? We're here to
             help you.
           </p>
         </div>

         <div className="grid lg:grid-cols-2 gap-12">
           {/* Left Section - Contact Info */}
           <div className="space-y-8">
             {/* Visit Us */}
             <a
               href="https://maps.google.com/?q=SS+Clinic,Kudlu,Bangalore,Karnataka,560068"
               target="_blank"
               rel="noopener noreferrer"
               className="flex gap-6 items-center group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
             >
               <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                 <MapPin className="text-white" size={24} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Visit Us</h3>
                 <p className="text-gray-600 leading-relaxed">
                   S S Clinic
                   <br />
                   Kudlu, Bangalore, Karnataka 560068
                 </p>
               </div>
             </a>

             {/* Call Us */}
             <a
               href="tel:+919602154222"
               className="flex gap-6 items-center group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
             >
               <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                 <Phone className="text-white" size={24} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Call Us</h3>
                 <p className="text-gray-600 leading-relaxed">
                   Main: +91 9602154222
                   <br />
                   Appointments: +91 9602154222
                 </p>
               </div>
             </a>

             {/* Email Us */}
             <a
               href="mailto:ssclinicbangalore@gmail.com"
               className="flex gap-6 items-center group hover:bg-gray-50 p-4 rounded-xl transition-all duration-300"
             >
               <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                 <Mail className="text-white" size={24} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Email Us</h3>
                 <p className="text-gray-600 leading-relaxed">
                   ssclinicbangalore@gmail.com
                 </p>
               </div>
             </a>

             {/* Working Hours */}
             <div className="flex gap-6 items-center group p-4">
               <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                 <Clock className="text-white" size={24} />
               </div>
               <div>
                 <h3 className="text-xl font-bold text-gray-900 mb-2">Working Hours</h3>
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

        <div
          id="appointment"
          className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100"
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-6">
            Book an Appointment
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name, Phone, Email, Doctor select... */}
            {/* ... these inputs remain the same ... */}
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                 <input
                   type="text"
                   name="fullName"
                   value={formData.fullName}
                   onChange={handleChange}
                   required
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                   placeholder="Enter your full name"
                 />
               </div>

               {/* Phone Number */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                 <input
                   type="tel"
                   name="phone"
                   value={formData.phone}
                   onChange={handleChange}
                   required
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                   placeholder="Enter your phone number"
                 />
               </div>

               {/* Email */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                 <input
                   type="email"
                   name="email"
                   value={formData.email}
                   onChange={handleChange}
                   required
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                   placeholder="Enter your email"
                 />
               </div>

               {/* Select Doctor */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Select Doctor</label>
                 <select
                   name="doctor"
                   value={formData.doctor}
                   onChange={handleChange}
                   required
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                 >
                   <option value="">-- Select Doctor --</option>
                   <option value="Dr. Sujith M S">
                     Dr. Sujith M S - Physician & Diabetologist
                   </option>
                   <option value="Dr. Ashwini B S">
                     Dr. Ashwini B S - Paediatrician
                   </option>
                 </select>
               </div>
            {/* Preferred Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                // 5. Set min date to prevent booking in the past
                min={today}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Preferred Time, Message... */}
            {/* ... these inputs remain the same ... */}
            <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Time</label>
                 <input
                   type="time"
                   name="time"
                   value={formData.time}
                   onChange={handleChange}
                   required
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                 />
               </div>

               {/* Message */}
               <div>
                 <label className="block text-sm font-medium text-gray-700 mb-2">Message (Optional)</label>
                 <textarea
                   name="message"
                   value={formData.message}
                   onChange={handleChange}
                   rows={3}
                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                   placeholder="Any specific concerns or requirements"
                 ></textarea>
               </div>
            {/* Submit Button */}
            <button
              type="submit"
              // 6. Disable button while submitting
              disabled={isSubmitting}
              className="w-full bg-blue-600 text-white px-6 py-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium shadow-lg hover:shadow-xl disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Booking..." : "Book Appointment"}
            </button>

            {status && (
              <p className="text-center mt-4 font-medium text-gray-700">
                {status}
              </p>
            )}
          </form>
        </div>
      </div>
     </div>
    </section>
  );
}