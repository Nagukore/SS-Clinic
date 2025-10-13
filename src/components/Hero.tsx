import { ArrowRight, Heart } from 'lucide-react';

export default function Hero() {
  return (
    <section id="home" className="pt-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium">
              <Heart size={16} className="fill-current" />
              <span>Your Health, Our Priority</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
              Healthcare Beyond Treatment
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed">
              Healthcare is more than just treatment — it is compassion, trust, and healing that embraces the whole person. Experience expert medical care with our specialist doctors.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#appointment"
                className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
              >
                Book Appointment
                <ArrowRight size={20} />
              </a>
              <a
                href="#doctors"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border-2 border-blue-600 font-medium"
              >
                Meet Our Doctors
              </a>
            </div>

            <div className="grid grid-cols-3 gap-6 pt-8 border-t border-gray-200">
              <div>
                <p className="text-3xl font-bold text-blue-600">15+</p>
                <p className="text-sm text-gray-600">Years Experience</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">5000+</p>
                <p className="text-sm text-gray-600">Happy Patients</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-blue-600">24/7</p>
                <p className="text-sm text-gray-600">Emergency Care</p>
              </div>
            </div>
          </div>

          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                <div className="text-center text-white p-8">
                  <Heart size={120} className="mx-auto mb-6 opacity-20" />
                  <p className="text-2xl font-semibold">Your Trusted Healthcare Partner</p>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-xl shadow-xl border-2 border-blue-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                  <Heart className="text-green-600 fill-current" size={24} />
                </div>
                <div>
                  <p className="font-bold text-gray-900">Available 24/7</p>
                  <p className="text-sm text-gray-600">Emergency Services</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
