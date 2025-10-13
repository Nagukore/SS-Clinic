import { Award, Users, Clock, Shield } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Award,
      title: 'Expert Medical Team',
      description: 'Highly qualified doctors with extensive experience in their specializations'
    },
    {
      icon: Users,
      title: 'Patient-Centered Care',
      description: 'Personalized treatment plans tailored to your unique health needs'
    },
    {
      icon: Clock,
      title: 'Quick Response Time',
      description: '24/7 emergency services with rapid response and efficient care delivery'
    },
    {
      icon: Shield,
      title: 'Advanced Facilities',
      description: 'State-of-the-art medical equipment and modern healthcare infrastructure'
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
            About Our Hospital
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Dedicated to providing exceptional healthcare services with compassion, expertise, and cutting-edge medical technology
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white p-6 rounded-xl border border-blue-100 hover:shadow-xl transition-all duration-300 group"
            >
              <div className="w-14 h-14 bg-blue-600 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                <feature.icon className="text-white" size={28} />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
