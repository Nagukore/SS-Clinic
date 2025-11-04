// src/pages/HomePage.tsx (previously App.tsx)

import Hero from './components/Hero';
import About from './components/About';
import Doctors from './components/Doctors';
import Services from './components/Services';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';

// Notice there is NO Navbar here!
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Doctors />
      <Services />
      <Contact />
      <Chatbot />
    </>
  );
}