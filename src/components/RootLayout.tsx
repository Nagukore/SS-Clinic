import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import Chatbot from './Chatbot';
import ScrollManager from './ScrollManager';

export default function RootLayout() {
  return (
    <div className="min-h-screen flex flex-col">
      <ScrollManager />
      <Navbar />
      <main className="flex-grow pt-20">
        <Outlet />
      </main>
      <Footer />
      <Chatbot />
    </div>
  );
}
