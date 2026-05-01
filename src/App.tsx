// src/pages/HomePage.tsx (previously App.tsx)

import Hero from './components/Hero';
import About from './components/About';
import Doctors from './components/Doctors';
import Services from './components/Services';
import Contact from './components/Contact';
import Chatbot from './components/Chatbot';
import LatestBlogs from './components/LatestBlogs';

// Notice there is NO Navbar here!
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Doctors />
      <Services />
      <LatestBlogs />
      <Contact />
      <Chatbot />
    </>
  );
}