import { useState, useEffect } from 'react';
import { ArrowRight, Heart, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

// --- Welcome Loader Component ---
function WelcomeLoader({ isFading }: { isFading: boolean }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-white transition-opacity duration-500 ease-out ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div className="text-center animate-fade-in-pulse">
        <img
          src="/images/logo.jpg"
          alt="Shrishakthi Clinic Logo"
          className="w-32 h-32 mx-auto"
        />
        <h1 className="mt-4 text-3xl font-bold text-gray-800 tracking-wider">
          SS Clinic
        </h1>
        <p className="mt-2 text-lg text-blue-600">
          Holistic Healing & Wellness
        </p>
      </div>
    </div>
  );
}

// --- Slider Content ---
const sliderContent = [
  {
    src: '/images/clinic.jpg',
    alt: 'Modern and welcoming clinic reception',
    title: 'SS Clinic',
    subtitle: 'Modern & Welcoming Care',
    description:
      'Experience compassionate and personalized care in a comfortable environment.',
  },
  {
    src: '/images/laboratory.jpg',
    alt: 'Advanced medical laboratory for testing',
    title: 'Advanced Lab & Research',
    subtitle: 'Accurate and Timely Diagnostics',
    description:
      'Utilizing state-of-the-art technology for precise health insights.',
  },
  {
    src: '/images/diagnosis.jpg',
    alt: 'Doctor and patient discussing diagnosis',
    title: 'Precise Diagnosis & Consultation',
    subtitle: 'Expert Medical Guidance',
    description:
      'Partner with our specialists for a clear understanding of your health.',
  },
  {
    src: '/images/pharmacy.jpg',
    alt: 'Pharmacy with pharmacist assisting',
    title: 'Trusted Medicines',
    subtitle: 'SS Clinic Pharmacy',
    description:
      'Your one-stop destination for genuine medicines and expert guidance.',
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  // Loader
  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 500);
    const loadTimer = setTimeout(() => setIsLoading(false), 1000);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(loadTimer);
    };
  }, []);

  // Auto slider
  useEffect(() => {
    if (!isLoading) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % sliderContent.length);
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);


  const nextSlide = () => setCurrentIndex((prev) => (prev + 1) % sliderContent.length);
  const prevSlide = () => setCurrentIndex((prev) => (prev - 1 + sliderContent.length) % sliderContent.length);

  if (isLoading) return <WelcomeLoader isFading={isFading} />;

  return (
    <section
      id="home"
      className="pt-16 bg-gradient-to-br from-blue-50/80 via-white to-indigo-50/80 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">

          {/* ✅ RIGHT — Content */}
          <div className="relative space-y-8 lg:pl-6 order-2 lg:order-2">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
              <Activity size={18} className="text-blue-600 animate-pulse" />
              <span>Healthy you, Healthier tomorrow</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-[1.15] tracking-tight">
              Healthcare <br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Beyond Treatment
              </span>
            </h1>

            <p className="text-lg text-gray-600 leading-relaxed max-w-xl">
              Healthcare is more than just treatment — it is compassion, trust, and healing that embraces the whole person. Experience expert medical care with our highly specialized doctors.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-2">
              <a
                href="#appointment"
                className="group relative inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl hover:bg-blue-700 transition-all duration-300 shadow-[0_8px_30px_rgb(37,99,235,0.25)] hover:shadow-[0_8px_30px_rgb(37,99,235,0.4)] font-semibold overflow-hidden"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
                <span className="relative z-10 flex items-center gap-2">
                  Book Appointment
                  <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                </span>
              </a>

              <a
                href="#doctors"
                className="inline-flex items-center justify-center gap-2 bg-white text-blue-700 px-8 py-4 rounded-xl hover:bg-blue-50 transition-all duration-300 border-2 border-blue-100 hover:border-blue-200 font-semibold shadow-sm hover:shadow"
              >
                Meet Our Doctors
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-10 border-t border-gray-100">
              <div className="space-y-1">
                <p className="text-3xl lg:text-4xl font-black text-gray-900">15<span className="text-blue-600">+</span></p>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Years Experience</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl lg:text-4xl font-black text-gray-900">5k<span className="text-blue-600">+</span></p>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Happy Patients</p>
              </div>
              <div className="space-y-1">
                <p className="text-3xl lg:text-4xl font-black text-gray-900">24<span className="text-blue-600">/7</span></p>
                <p className="text-xs sm:text-sm font-semibold text-gray-500 uppercase tracking-wide">Emergency Care</p>
              </div>
            </div>
            
            {/* Floating Card (Desktop only) */}
            <div className="absolute -bottom-6 -right-4 lg:-right-8 xl:-right-16 bg-white p-5 rounded-2xl shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] border border-gray-100 hidden lg:block animate-bounce" style={{ animationDuration: '3s', zIndex: 10 }}>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gradient-to-br from-green-400 to-green-500 rounded-full flex items-center justify-center shadow-lg shadow-green-200">
                  <Heart className="text-white fill-current" size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-green-600 uppercase tracking-wider mb-0.5">Available Now</p>
                  <p className="font-extrabold text-gray-900">Emergency Services</p>
                </div>
              </div>
            </div>

          </div>

          {/* ✅ LEFT — Slider */}
          <div className="order-1 lg:order-1 relative bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(8,_112,_184,_0.1)] ring-1 ring-gray-100/50 p-3 sm:p-5 flex flex-col group/slider">
            
            {/* Image Container */}
            <div className="relative rounded-[2rem] overflow-hidden aspect-[4/3] sm:aspect-[4/5] lg:aspect-[4/4] bg-gray-50">
              {sliderContent.map((content, index) => (
                <div
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                    currentIndex === index ? 'opacity-100 z-10' : 'opacity-0 z-0'
                  }`}
                >
                  <img
                    src={content.src}
                    alt={content.alt}
                    className="w-full h-full object-cover transition-transform duration-[3000ms] ease-out hover:scale-[1.03]"
                  />
                </div>
              ))}
            </div>

            {/* Content & Arrows below the image */}
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6 pt-6 px-3 sm:px-4 pb-3">
              <div className="space-y-4 flex-1 w-full">
                
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[11px] font-bold tracking-widest text-blue-700 uppercase bg-blue-50 border border-blue-100 rounded-full">
                  <Activity size={12} className="text-blue-600" />
                  {sliderContent[currentIndex].subtitle}
                </span>

                <div className="relative h-36 sm:h-32 overflow-hidden">
                  {sliderContent.map((content, index) => (
                    <div 
                      key={index}
                      className={`absolute inset-0 transition-all duration-700 ease-out ${
                        currentIndex === index 
                          ? 'opacity-100 translate-y-0 z-10' 
                          : 'opacity-0 translate-y-8 z-0 pointer-events-none'
                      }`}
                    >
                      <h3 className="text-2xl sm:text-[26px] font-black text-gray-900 tracking-tight mb-2.5">
                        {content.title}
                      </h3>
                      <p className="text-gray-500 text-sm sm:text-base leading-relaxed line-clamp-2 sm:line-clamp-3 pr-4 sm:pr-0">
                        {content.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation Arrows */}
              <div className="flex items-center gap-3 shrink-0 self-end sm:pb-2">
                <button
                  onClick={prevSlide}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-blue-600 text-gray-700 hover:text-white transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-blue-600/30 border border-gray-100 group/btn"
                  aria-label="Previous slide"
                >
                  <ChevronLeft size={22} className="stroke-[2.5] group-hover/btn:-translate-x-0.5 transition-transform" />
                </button>
                <button
                  onClick={nextSlide}
                  className="flex items-center justify-center w-12 h-12 rounded-full bg-white hover:bg-blue-600 text-gray-700 hover:text-white transition-all duration-300 shadow-[0_8px_20px_rgba(0,0,0,0.06)] hover:shadow-blue-600/30 border border-gray-100 group/btn"
                  aria-label="Next slide"
                >
                  <ChevronRight size={22} className="stroke-[2.5] group-hover/btn:translate-x-0.5 transition-transform" />
                </button>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
