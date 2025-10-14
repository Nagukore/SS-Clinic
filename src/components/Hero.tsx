import { useState, useEffect } from 'react';
import { ArrowRight, Heart } from 'lucide-react';

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
          Shrishakthi Clinic
        </h1>
        <p className="mt-2 text-lg text-blue-600">
          Holistic Healing & Wellness
        </p>
      </div>
    </div>
  );
}


// --- Main Hero Component ---
const sliderContent = [
  {
    src: '/images/clinic.jpg',
    alt: 'Modern and welcoming clinic reception',
    title: 'Shrishakthi Clinic',
    subtitle: 'Modern & Welcoming Care',
    description: 'Experience compassionate and personalized care in a comfortable environment.'
  },
  {
    src: '/images/laboratory.jpg',
    alt: 'Advanced medical laboratory for testing',
    title: 'Advanced Lab & Research',
    subtitle: 'Accurate and Timely Diagnostics',
    description: 'Utilizing state-of-the-art technology for precise health insights.'
  },
  {
    src: '/images/diagnosis.jpg',
    alt: 'Doctor and patient discussing diagnosis',
    title: 'Precise Diagnosis & Consultation',
    subtitle: 'Expert Medical Guidance',
    description: 'Partner with our specialists for a clear understanding of your health.'
  },
  {
    src: '/images/hospital.jpg',
    alt: 'Comfortable and clean hospital room for inpatient care',
    title: 'Comprehensive Inpatient Care',
    subtitle: 'Dedicated to Your Recovery',
    description: 'Comfort and dedicated medical attention for your well-being.'
  },
];

export default function Hero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isFading, setIsFading] = useState(false);

  // Effect to manage the welcome loader visibility (Updated to 1 second)
  useEffect(() => {
    const fadeTimer = setTimeout(() => setIsFading(true), 500); // Start fading after 0.5s
    const loadTimer = setTimeout(() => setIsLoading(false), 1000); // Remove after 1s total
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(loadTimer);
    };
  }, []);
  
  // Effect to manage the image slider's automatic progression
  useEffect(() => {
    if (!isLoading) {
      const intervalId = setInterval(() => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % sliderContent.length);
      }, 4000);
      return () => clearInterval(intervalId);
    }
  }, [isLoading]);

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  if (isLoading) {
    return <WelcomeLoader isFading={isFading} />;
  }

  return (
    <section id="home" className="pt-20 bg-gradient-to-br from-blue-50 via-white to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Left Side - Image Slider & Text */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl aspect-[4/3]">
              {sliderContent.map((content, index) => (
                <img
                  key={index}
                  src={content.src}
                  alt={content.alt}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ease-in-out ${
                    currentIndex === index ? 'opacity-100' : 'opacity-0'
                  }`}
                />
              ))}
            </div>
            <div className="flex justify-center pt-4 space-x-2">
              {sliderContent.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentIndex === index ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                ></button>
              ))}
            </div>
            <div className="pt-6 text-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {sliderContent[currentIndex].title}
              </h3>
              <p className="text-lg font-semibold text-blue-600">
                {sliderContent[currentIndex].subtitle}
              </p>
              <p className="mt-2 text-gray-600 h-12">
                {sliderContent[currentIndex].description}
              </p>
            </div>
          </div>

          {/* Right Side Content */}
          <div className="relative space-y-8">
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
              <a href="#appointment" className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl font-medium">
                Book Appointment
                <ArrowRight size={20} />
              </a>
              <a href="#doctors" className="inline-flex items-center justify-center gap-2 bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-50 transition-all duration-300 border-2 border-blue-600 font-medium">
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
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-xl shadow-xl border-2 border-blue-100 hidden lg:block">
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