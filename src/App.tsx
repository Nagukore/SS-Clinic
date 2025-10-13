import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Doctors from './components/Doctors';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';

function App() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <Hero />
      <About />
      <Doctors />
      <Services />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;
