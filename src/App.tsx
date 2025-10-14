import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Doctors from './components/Doctors';
import Services from './components/Services';
import Contact from './components/Contact';
import Footer from './components/Footer';
 import Chatbot from './components/Chatbot';

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
       <Chatbot />
    </div>
  );
}

export default App;
