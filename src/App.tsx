// src/App.tsx — Home page (full website on one page)

import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Doctors from './components/Doctors';
import LatestBlogs from './components/LatestBlogs';
import Contact from './components/Contact';

// Home shows every section. The same sections are also reachable as
// standalone pages (/about, /doctors, /services, /contact).
export default function HomePage() {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <Doctors />
      <LatestBlogs />
      <Contact />
    </>
  );
}
