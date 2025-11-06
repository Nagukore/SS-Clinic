import { Award, Users, Clock, Shield } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Award,
      title: 'Expert Medical Team',
      description:
        'Highly qualified doctors with extensive experience in their specializations',
    },
    {
      icon: Users,
      title: 'Patient-Centered Care',
      description:
        'Personalized treatment plans tailored to your unique health needs',
    },
    {
      icon: Clock,
      title: 'Quick Response Time',
      description:
        '24/7 emergency services with rapid response and efficient care delivery',
    },
    {
      icon: Shield,
      title: 'Advanced Facilities',
      description:
        'State-of-the-art medical equipment and modern healthcare infrastructure',
    },
  ];

  return (
    <section id="about" className="py-24 bg-white">
      {/* ✅ Central Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ✅ Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
            About Our Hospital
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Dedicated to providing exceptional healthcare services with compassion, expertise,
            and cutting-edge medical technology.
          </p>
        </div>

        {/* ✅ Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border border-blue-100 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 group min-h-[240px]"
            >
              <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md">
                <feature.icon className="text-white" size={30} />
              </div>

              <h3 className="text-xl font-bold text-gray-900 mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
