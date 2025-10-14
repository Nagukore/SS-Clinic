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
      return "For diabetes management, Dr. Sujith M S is our specialist Diabetologist. He provides:\n- Comprehensive diabetes care\n- Blood sugar monitoring\n- Personalized treatment plans\n- Lifestyle and dietary guidance\n- Management of diabetes complications\n\nPlease book an appointment to discuss your specific needs.";
    }

    // --- MODIFIED: Response now includes a clickable HTML link ---
    if (lowerMessage.includes('appointment') || lowerMessage.includes('book') || lowerMessage.includes('schedule')) {
return `To book an appointment, you can click this link: <a href="#appointment" class="text-blue-600 font-bold underline hover:text-blue-800 transition-colors">Book Appointment Now</a>.\n\nAlternatively, you can:\n1. Scroll down to the Contact section\n2. Fill in your details\n3. Select your preferred doctor and date\n4. Submit the form\n\nYou can also call us directly for immediate appointments.`;    }

    if (lowerMessage.includes('service') || lowerMessage.includes('treatment') || lowerMessage.includes('what do you')) {
      return "Srishakthi Clinic offers:\n\n🩸 Diabetes Management\n❤️ Hypertension Care\n👶 Pediatric Care\n💉 Immunization\n🦠 Infectious Disease Treatment\n🩺 General Medicine\n\nScroll to the 'Services' section to learn more.";
    }

    if (lowerMessage.includes('contact') || lowerMessage.includes('phone') || lowerMessage.includes('call') || lowerMessage.includes('email')) {
      return "You can reach us at:\n📞 +91 9876543210\n📧 info@srishakthiclinic.com\n📧 appointments@srishakthiclinic.com\n\n⏰ Mon–Sat: 9 AM–8 PM | Sun: 9 AM–2 PM | Emergency: 24/7";
    }

    if (lowerMessage.includes('location') || lowerMessage.includes('address') || lowerMessage.includes('where')) {
      return "📍 Srishakthi Clinic\n123 Healthcare Avenue, Medical District\nCity, State 560001\n\nFind us in the Contact section for a map view.";
    }

    if (lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hey')) {
      return "Hello! Welcome to Srishakthi Clinic 👋\nHow can I assist you today?";
    }

    if (lowerMessage.includes('thank') || lowerMessage.includes('thanks')) {
      return "You're welcome! 😊 Let me know if you need more help.";
    }

    return "I can help with:\n👨‍⚕️ Doctors Info\n📅 Appointments\n🏥 Services\n📞 Contact\n🕘 Timings\n💉 Vaccinations\n👶 Pediatric & Diabetes Care\n\nPlease ask your question!";
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
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 bg-blue-600 text-white p-4 rounded-full shadow-2xl hover:bg-blue-700 transition-all duration-300 hover:scale-110 z-50 group"
          aria-label="Open chat"
        >
          <MessageCircle size={28} />
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center font-bold animate-pulse">
            1
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-full sm:w-96 h-[90vh] sm:h-[600px] bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={24} />
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">Srishakthi Assistant</h3>
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

          {/* Chat Body */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-2 items-start ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender === 'bot' && (
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Bot size={18} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] sm:max-w-[75%] p-3 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-blue-600 text-white rounded-br-none'
                      : 'bg-white text-gray-800 rounded-bl-none shadow-md border border-gray-200'
                  }`}
                >
                  {/* --- This part renders the message as HTML to make links clickable --- */}
                  <div 
                    className="text-sm whitespace-pre-line leading-relaxed"
                    dangerouslySetInnerHTML={{ __html: message.text }} 
                  />
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
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask about doctors, services..."
                className="flex-1 px-4 py-2 sm:py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isTyping}
                className="bg-blue-600 text-white p-2 sm:p-3 rounded-xl hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
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