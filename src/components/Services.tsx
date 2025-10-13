import { Stethoscope, Heart, Activity, Baby, Droplet, Shield } from 'lucide-react';

export default function Services() {
  const services = [
    {
      icon: Droplet,
      title: 'Diabetes Management',
      description: 'Comprehensive diabetes care with personalized treatment plans and continuous monitoring'
    },
    {
      icon: Heart,
      title: 'Hypertension Care',
      description: 'Expert management of high blood pressure and cardiovascular health'
    },
    {
      icon: Baby,
      title: 'Pediatric Care',
      description: 'Complete child healthcare including neonatal care, growth monitoring, and development assessments'
    },
    {
      icon: Shield,
      title: 'Immunization',
      description: 'Comprehensive vaccination programs for infants, children, and adults'
    },
    {
      icon: Activity,
      title: 'Infectious Diseases',
      description: 'Diagnosis and treatment of various infectious conditions with expert care'
    },
    {
      icon: Stethoscope,
      title: 'General Medicine',
      description: 'Complete healthcare services for common illnesses, respiratory conditions, and preventive care'
    }
  ];

  return (
    <section id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            Our Medical Services
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Comprehensive healthcare services tailored to meet your medical needs with excellence and compassion
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-white to-blue-50 p-8 rounded-xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300">
                <service.icon className="text-white" size={32} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">{service.title}</h3>
              <p className="text-gray-600 leading-relaxed">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
