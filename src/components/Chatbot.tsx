import { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Srishakthi Clinic's assistant. I can help you with information about our doctors, services, medicines, and how to navigate our website. How can I assist you today?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const getAIResponse = (userMessage: string): string => {
    const lowerMessage = userMessage.toLowerCase();

    if (lowerMessage.includes('doctor') || lowerMessage.includes('physician') || lowerMessage.includes('sujith')) {
      return "We have two specialist doctors at Srishakthi Clinic:\n\n1. Dr. Sujith M S - Consultant Physician & Diabetologist (MBBS, DNB, PGDCED)\nSpecializes in: Diabetes Management, Hypertension, Infectious Diseases, and Respiratory Conditions\n\n2. Dr. Ashwini B S - Consultant Paediatrician (MBBS, DCH, DNB)\nSpecializes in: Neonatal Care, Growth & Development, Immunization, Infections, Allergies, and Asthma\n\nYou can book an appointment by clicking 'Book Appointment' button or scrolling to the contact section.";
    }

    if (lowerMessage.includes('pediatric') || lowerMessage.includes('paediatric') || lowerMessage.includes('child') || lowerMessage.includes('ashwini') || lowerMessage.includes('kids')) {
      return "For pediatric care, please consult Dr. Ashwini B S, our Consultant Paediatrician. She specializes in:\n- Neonatal Care\n- Growth & Development monitoring\n- Immunization programs\n- Treatment of Infections, Allergies, and Asthma\n\nDr. Ashwini has impressive credentials (MBBS, DCH - State Topper, DNB). You can book an appointment in the Contact section.";
    }

    if (lowerMessage.includes('diabetes') || lowerMessage.includes('diabetic') || lowerMessage.includes('sugar') || lowerMessage.includes('blood sugar')) {
      return "For diabetes management, Dr. Sujith M S is our specialist Diabetologist. He provides:\n- Comprehensive diabetes care\n- Blood sugar monitoring\n- Personalized treatment plans\n- Lifestyle and dietary guidance\n- Management of diabetes complications\n\nPlease book an appointment to discuss your specific needs. Our clinic also handles hypertension and other related conditions.";
    }

    if (lowerMessage.includes('hypertension') || lowerMessage.includes('blood pressure') || lowerMessage.includes('bp')) {
      return "Dr. Sujith M S specializes in hypertension management. He provides:\n- Blood pressure monitoring\n- Medication management\n- Lifestyle modifications\n- Treatment of cardiovascular conditions\n\nRegular check-ups are important for managing hypertension effectively. Please book an appointment for a consultation.";
    }

    if (lowerMessage.includes('vaccination') || lowerMessage.includes('immunization') || lowerMessage.includes('vaccine')) {
      return "We provide comprehensive immunization services for both children and adults. Dr. Ashwini B S handles pediatric vaccinations including:\n- Routine childhood immunizations\n- Growth & development vaccines\n- Special vaccination programs\n\nPlease book an appointment to discuss your vaccination needs or schedule.";
    }

    if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
      return "To book an appointment:\n1. Click the 'Book Appointment' button in the navigation menu\n2. Or scroll down to the Contact section\n3. Fill in your details (name, phone, email)\n4. Select your preferred doctor\n5. Choose your preferred date\n6. Submit the form\n\nYou can also call us directly for immediate appointments. Our contact details are in the footer section.";
    }

    if (lowerMessage.includes('service') || lowerMessage.includes('treatment') || lowerMessage.includes('what do you')) {
      return "Srishakthi Clinic offers comprehensive healthcare services:\n\n🩸 Diabetes Management\n❤️ Hypertension Care\n👶 Pediatric Care (Neonatal to Adolescent)\n💉 Immunization Programs\n🦠 Infectious Disease Treatment\n🩺 General Medicine & Consultations\n\nScroll to the 'Services' section on our website to learn more about each service.";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
      return "You can reach us at:\n\n📞 Phone: +91 9876543210\n📧 Email: info@srishakthiclinic.com\n📧 Appointments: appointments@srishakthiclinic.com\n\n⏰ Working Hours:\nMonday - Saturday: 9:00 AM - 8:00 PM\nSunday: 9:00 AM - 2:00 PM\nEmergency: 24/7 Available\n\nScroll to the Contact section for more details and location information.";
    }

    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
      return "You can find us at:\n\n📍 123 Healthcare Avenue\nMedical District\nCity, State 560001\n\nPlease scroll to the Contact section for complete location details and to see our address on the map.";
    }

    if (lowerMessage.includes('hours') || lowerMessage.includes('timing') || lowerMessage.includes('open') || lowerMessage.includes('time')) {
      return "Our clinic timings:\n\n⏰ Monday - Saturday: 9:00 AM - 8:00 PM\n⏰ Sunday: 9:00 AM - 2:00 PM\n🚨 Emergency Services: Available 24/7\n\nFor appointments outside regular hours, please contact us in advance.";
    }

    if (lowerMessage.includes('medicine') || lowerMessage.includes('medication') || lowerMessage.includes('prescription') || lowerMessage.includes('drug')) {
      return "For medicine-related queries:\n\n⚠️ Please consult with our doctors for specific medication advice. I cannot provide medical prescriptions or specific medicine recommendations.\n\nOur doctors can help with:\n- Prescription services\n- Medication management\n- Drug interactions\n- Dosage adjustments\n\nPlease book an appointment to discuss your medication needs with Dr. Sujith M S or Dr. Ashwini B S.";
    }

    if (lowerMessage.includes('emergency') || lowerMessage.includes('urgent')) {
      return "🚨 For medical emergencies:\n\n📞 Call: +91 9876543211 (Emergency Line)\n\nWe provide 24/7 emergency services. If this is a life-threatening emergency, please also call local emergency services (108/102) immediately.";
    }

    if (lowerMessage.includes('navigation') || lowerMessage.includes('navigate') || lowerMessage.includes('website') || lowerMessage.includes('section')) {
      return "Here's how to navigate our website:\n\n🏠 Home - Top of the page (hero section)\n📖 About - Information about our clinic\n👨‍⚕️ Doctors - Meet our specialists\n🏥 Services - Our medical services\n📞 Contact - Location, phone, email, and appointment form\n\nYou can use the navigation menu at the top or scroll through the sections. Click any menu item to jump directly to that section!";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to Srishakthi Clinic. I'm here to help you with:\n- Information about our doctors\n- Our medical services\n- Booking appointments\n- Website navigation\n- General healthcare queries\n\nWhat would you like to know?";
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! If you have any other questions about our clinic, doctors, services, or need help navigating the website, feel free to ask. Take care!";
    }

    return "I can help you with information about:\n\n👨‍⚕️ Our Doctors (Dr. Sujith M S & Dr. Ashwini B S)\n🏥 Medical Services\n📅 Booking Appointments\n📞 Contact Information\n🗺️ Website Navigation\n⏰ Clinic Timings\n💉 Vaccination Services\n🩺 Diabetes & Hypertension Care\n👶 Pediatric Care\n\nPlease ask me a specific question and I'll be happy to help!";
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages([...messages, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: messages.length + 2,
        text: getAIResponse(inputMessage),
        sender: 'bot',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold animate-pulse">
            1
          </span>
        </button>
      )}

      {isOpen && (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold">Srishakthi Assistant</h3>
                <p className="text-xs text-blue-100">Online - Ready to help</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="hover:bg-white/20 p-2 rounded-lg transition-colors"
              aria-label="Close chat"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[75%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-200'
                  }`}
                >
                  <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                </div>
                {message.sender === 'user' && (
                  <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center flex-shrink-0">
                    <User size={18} className="text-gray-600" />
                  </div>
                )}
              </div>
            ))}
            {isTyping && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="bg-white p-3 rounded-2xl rounded-bl-none shadow-md border border-gray-200">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim()}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
                aria-label="Send message"
              >
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
