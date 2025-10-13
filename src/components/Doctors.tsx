import { GraduationCap, Award, ChevronDown } from "lucide-react";
import { useState } from "react";

// Define a type for the doctor object for better type safety
type Doctor = {
  name: string;
  specialization: string;
  registration: string;
  qualifications: string;
  bio: string[];
  expertise: string[];
  gradient: string;
  achievements?: string; // Optional property
  photo: string; // Added photo property
};

export default function Doctors() {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const doctors: Doctor[] = [
    {
      name: "Dr. Sujith M S",
      specialization: "Consultant Physician & Diabetologist",
      registration: "KMC Reg. No: 105870",
      qualifications: "MBBS, DNB, PGDCED",
      bio: [
        "Dr. Sujith M. S is a highly respected Consultant Physician & Diabetologist with qualifications in MBBS, DNB (Internal Medicine), and PGDCED. He completed his MBBS from Shimoga Institute of Medical Science and Research Centre and pursued his DNB in Internal Medicine from Narayana Hrudayalaya.",
        "Currently, he serves as a consultant at Narayana Multispeciality Hospital, HSR Layout. With a strong foundation in Internal Medicine, Dr. Sujith specializes in the management of Diabetes, Hypertension, Infectious Diseases, and Respiratory Conditions.",
        "Known for his patience, diagnostic excellence, and empathetic approach, Dr. Sujith goes beyond conventional treatment by building trust and comfort through compassionate communication.",
      ],
      expertise: [
        "Diabetes Management",
        "Hypertension",
        "Infectious Diseases",
        "Respiratory Conditions",
      ],
      gradient: "from-blue-500 to-blue-700",
      photo: "/images/sujith.jpg", // Replace with actual path
    },
    {
      name: "Dr. Ashwini B S",
      specialization: "Consultant Paediatrician (Child Specialist)",
      registration: "KMC Reg. No: 114445",
      qualifications: "MBBS, DCH, DNB",
      achievements: "DCH State Topper, AOCN 2020, IPSO 2020",
      bio: [
        "Dr. Ashwini B. S is a highly skilled Consultant Pediatrician and Child Specialist, dedicated to the health and well-being of infants, children, and adolescents.",
        "She completed her MBBS from Shimoga Institute of Medical Sciences (SIMS), followed by DCH from Bangalore Medical College (State Topper of RGUHS), and DNB Pediatrics from Narayana Hrudayalaya.",
        "With experience at Cloudnine Hospital and academic achievements like being a DCH State Topper, AOCN 2020, and IPSO 2020, her expertise includes neonatal care, growth & development, immunization, infections, allergies, and asthma.",
        "Known for empathy and child-centered care, she creates a supportive environment for both children and parents, ensuring holistic growth and well-being.",
      ],
      expertise: [
        "Neonatal Care",
        "Growth & Development",
        "Immunization",
        "Infections",
        "Allergies",
        "Asthma",
      ],
      gradient: "from-teal-500 to-teal-700",
      photo: "/images/ashwini.jpg", // Replace with actual path
    },
  ];

  const handleReadMore = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <section
      id="doctors"
      className="py-20 bg-gradient-to-br from-gray-50 to-blue-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Meet Our Expert Doctors
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Our dedicated medical professionals are committed to providing you
            with the highest quality healthcare
          </p>
        </div>

        {/* Doctor Cards */}
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {doctors.map((doctor: Doctor, index: number) => {
            const isExpanded = expandedIndex === index;
            return (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-xl overflow-hidden hover:shadow-2xl transition-all duration-300 group"
              >
                {/* Header Gradient */}
                <div
                  className={`bg-gradient-to-br ${doctor.gradient} h-64 flex flex-col items-center justify-center relative overflow-hidden`}
                >
                  <div className="absolute inset-0 bg-black/20"></div>
                  <div className="relative z-10 text-center text-white p-6">
                    {/* Adjusted image container size to w-48 h-48 */}
                    <div className="w-52 h-52 rounded-full overflow-hidden mx-auto mb-4 border-4 border-white/30 shadow-lg">
                      <img
                        src={doctor.photo}
                        alt={`Dr. ${doctor.name}`}
                        className="w-full h-full object-cover object-center"
                      />
                    </div>
                    <h3 className="text-2xl font-bold">{doctor.name}</h3>
                  </div>
                </div>

                {/* Doctor Details */}
                <div className="p-8">
                  <div className="mb-6">
                    <h4 className="text-xl font-bold text-gray-900 mb-2">
                      {doctor.specialization}
                    </h4>

                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <GraduationCap size={18} className="text-blue-600" />
                      <span className="text-sm">{doctor.qualifications}</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 mb-2">
                      <Award size={18} className="text-blue-600" />
                      <span className="text-sm">{doctor.registration}</span>
                    </div>
                    
                    {doctor.achievements && (
                      <div className="flex items-center gap-2 text-gray-600 mb-2">
                          <Award size={18} className="text-yellow-500" />
                          <span className="text-sm font-medium">{doctor.achievements}</span>
                      </div>
                    )}

                    {/* Expandable Bio Section */}
                    <div
                      className={`overflow-hidden transition-[max-height] duration-700 ease-in-out ${
                        isExpanded ? "max-h-[1000px]" : "max-h-0"
                      }`}
                    >
                      <div className="pt-4 text-gray-600 text-sm space-y-3">
                        {doctor.bio.map((paragraph, pIndex) => (
                          <p key={pIndex}>{paragraph}</p>
                        ))}
                      </div>
                    </div>

                    <button
                      onClick={() => handleReadMore(index)}
                      className="flex items-center gap-1 text-blue-600 hover:text-blue-800 font-semibold text-sm mt-4 transition-colors"
                    >
                      <span>{isExpanded ? "Read Less" : "Read More"}</span>
                      <ChevronDown
                        size={16}
                        className={`transition-transform duration-300 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>
                  </div>

                  {/* Expertise Tags */}
                  <div className="mb-6">
                    <h5 className="font-semibold text-gray-900 mb-3">
                      Areas of Expertise:
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {doctor.expertise.map((skill, idx) => (
                        <span
                          key={idx}
                          className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm font-medium border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Book Appointment */}
                  <a
                    href="#appointment"
                    className="block w-full bg-blue-600 text-white text-center px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium"
                  >
                    Book Appointment
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}