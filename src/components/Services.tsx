import {
  Stethoscope,
  Heart,
  Activity,
  Baby,
  Droplet,
  Shield,
} from "lucide-react";

export default function Services() {
  const services = [
    {
      icon: Droplet,
      title: "Diabetes Management",
      description:
        "Comprehensive diabetes care with personalized treatment plans and continuous monitoring.",
    },
    {
      icon: Heart,
      title: "Hypertension Care",
      description:
        "Expert management of high blood pressure and cardiovascular health.",
    },
    {
      icon: Baby,
      title: "Pediatric Care",
      description:
        "Complete child healthcare including neonatal care, growth monitoring, and development assessments.",
    },
    {
      icon: Shield,
      title: "Immunization",
      description:
        "Comprehensive vaccination programs for infants, children, and adults.",
    },
    {
      icon: Activity,
      title: "Infectious Diseases",
      description:
        "Diagnosis and treatment of various infectious conditions with expert care.",
    },
    {
      icon: Stethoscope,
      title: "General Medicine",
      description:
        "Complete healthcare services for common illnesses, respiratory conditions, and preventive care.",
    },
  ];

  return (
    <section id="services" className="py-24 bg-white">
      {/* ✅ Central Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ✅ Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            Our Medical Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Comprehensive healthcare services tailored to meet your medical needs
            with excellence and compassion.
          </p>
        </div>

        {/* ✅ Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-10">

          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-2xl border border-blue-100 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 group"
            >
              {/* Icon */}
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                <service.icon className="text-white" size={32} />
              </div>

              {/* Title */}
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed">
                {service.description}
              </p>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
