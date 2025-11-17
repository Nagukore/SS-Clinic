import { useState, useEffect, useRef } from "react";
import { MessageCircle, X, Send, Bot, User, Zap, Brain } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Message {
  id: number;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

export default function Chatbot() {
  // -------------------- STATES --------------------
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: `
      👋 <b>Welcome to SS Clinic!</b><br><br>
      I can assist you with the following:
      <ul class="list-disc ml-6 mt-2 text-gray-700">
        <li>📅 Booking appointments</li>
        <li>👨‍⚕️ Doctor details & timings</li>
        <li>📍 Clinic location & directions</li>
        <li>📞 Contact information</li>
        <li>💊 Available services</li>
      </ul>
      <br>
      Try asking about <b>"appointments"</b> or <b>"clinic hours"</b> to get started!
      `,
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [mode, setMode] = useState<"fast" | "gemini">("fast");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isSending, setIsSending] = useState(false);

  // -------------------- GEMINI CONFIG --------------------
  const GEMINI_API_KEY = "AIzaSyDzrJhfycYhtQInCtSTY6jRc9WrM9FSuuE";
  const GEMINI_MODEL = "gemini-2.5-flash";

  // -------------------- BACKEND URL --------------------
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;





  // -------------------- SCROLL CONTROL --------------------
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(() => scrollToBottom(), [messages]);

  // Prevent body height issue while chat modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflowY = "scroll";
    } else {
      document.body.style.overflowY = "";
    }
  }, [isOpen]);

  // -------------------- ENRICHED FAST PRESET RESPONSES --------------------
  const getFastResponse = (msg: string): string | null => {
    const text = msg.toLowerCase().trim();

    // greetings variations
    const greetings = ["hi", "hello", "hlo","helo", "hey", "hiya"];
    if (greetings.some(g => text === g || text.startsWith(`${g} `))) {
      return "👋 Hello! I'm SS Assistant. How can I help you today?";
    }

    if (text.includes("good morning") || text.includes("gm")) {
      return "🌅 Good morning! Wishing you a healthy day. How can I assist you?";
    }

    if (text.includes("good night") || text.includes("gn")) {
      return "🌙 Good night! Take care — let me know if you want to book an appointment for tomorrow.";
    }

    if (text.includes("how are you") || text.includes("how r you")) {
      return "🙂 I'm a virtual assistant — ready to help! How are you today?";
    }

    if (text === "thank you" || text.includes("thank")) {
      return "😊 You're welcome! If you need anything else, ask away.";
    }

    if (text.includes("bye") || text.includes("goodbye") || text.includes("see ya")) {
      return "👋 Goodbye! If you need anything later, I'll be here.";
    }

    if (text.includes("appointment") || text.includes("book")) {
      return `📅 You can book an appointment here → <a href="#appointment" class="text-blue-700 font-bold underline">Book Appointment</a>`;
    }

    if (text.includes("contact") || text.includes("call") || text.includes("phone")) {
      return `📞 <b>Contact Us:</b><br>
      Main: +91 9602154222<br>
      Appointments: +91 9602154222<br>
      Email: <a href="mailto:ssclinicbangalore@gmail.com" class="text-blue-700 font-bold underline">ssclinicbangalore@gmail.com</a>`;
    }

    if (text.includes("location") || text.includes("where")) {
      return `📍 <b>Location:</b> SS Clinic, Kudlu, Bangalore, Karnataka - 560068<br>
      <a href="#contact" class="text-blue-700 font-bold underline">📍 View Map</a>`;
    }

    if (text.includes("timing") || text.includes("hours")) {
      return `🕒 <b>Clinic Timings:</b><br>
      Monday – Saturday: 9:00 AM – 8:00 PM<br>
      Sunday: <span class="text-red-500 font-semibold">Closed</span>`;
    }

    if (text.includes("doctor") || text.includes("sujith") || text.includes("ashwini")) {
      return `👨‍⚕️ <b>Dr. Sujith M S</b> — Physician<br>
      ⏰ 6:00 PM – 9:00 PM<br><br>
      👩‍⚕️ <b>Dr. Ashwini B S</b> — Pediatrician<br>
      ⏰ 5:45 PM – 7:45 PM<br>
      <a href="#appointment" class="text-blue-700 font-bold underline">Book Now</a>`;
    }

    if (text.includes("service") || text.includes("treatment")) {
      return `💊 <b>Our Services:</b><br>
      • Psychiatry & Counseling<br>
      • Pediatric Care<br>
      • Immunization<br>
      • Chronic Disease Management<br>
      • Health Checkups`;
    }

    if (text.includes("open hours") || text.includes("open")) {
      return `🕒 We're open Monday – Saturday: 9:00 AM – 8:00 PM. Sunday Closed.`;
    }

    // small talk
    if (text.includes("weather") || text.includes("temp")) {
      return `🌤 I don't have live weather here, but you can check local weather for Kudlu in any weather app.`;
    }

    return null;
  };

 // -------------------- GEMINI BACKEND CALL (via your Render backend) --------------------
const getGeminiResponse = async (query: string): Promise<string> => {
  try {
    const cleanUrl = BACKEND_URL.replace(/\/$/, ""); // Remove trailing slash
    const res = await axios.post(`${cleanUrl}/chat`, { prompt: query }, { timeout: 30000 });

    // API returns { text } or { raw }
    const text =
      res.data?.text ||
      (typeof res.data?.raw === "string" ? res.data.raw : null);

    return text || "I'm not sure, but I can help you find out!";
  } catch (error: any) {
    console.error("Backend error:", error?.response?.data || error?.message);
    return "⚠️ Gemini service unavailable. Try again later or switch to Fast mode.";
  }
};

  // -------------------- SEND MESSAGE --------------------
  const handleSendMessage = async () => {
    const trimmed = inputMessage.trim();
    if (!trimmed) return;
    if (isSending) return;

    const userMsg: Message = {
      id: Date.now(),
      text: trimmed,
      sender: "user",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputMessage("");
    setIsTyping(true);
    setIsSending(true);

    let botReply: string | null = null;

    try {
      if (mode === "fast") {
        botReply = getFastResponse(trimmed);
        if (!botReply) botReply = "🤔 Hmm... I couldn’t find that. Try switching to Gemini mode!";
      } else {
        botReply = await getGeminiResponse(trimmed);
      }

      const botMsg: Message = {
        id: Date.now() + 1,
        text: botReply ?? "⚠️ No response available.",
        sender: "bot",
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 2,
          text: "⚠️ Something went wrong. Try again later.",
          sender: "bot",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsTyping(false);
      setIsSending(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // -------------------- UI RENDERING --------------------
  return (
    <>
      {!isOpen && (
        <motion.button
          onClick={() => setIsOpen(true)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="fixed bottom-6 right-6 bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all z-[9999]"
        >
          <MessageCircle size={28} />
        </motion.button>
      )}

      {isOpen && (
        <div className="fixed bottom-0 right-0 sm:bottom-6 sm:right-6 w-[95%] sm:w-96 h-[85vh] sm:h-[600px] mx-auto bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl flex flex-col border border-gray-200 z-[9999] overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-t-2xl flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/25 rounded-full flex items-center justify-center">
                <Bot size={22} />
              </div>
              <div>
                <h3 className="font-semibold text-sm">Srishakthi Assistant</h3>
                <p className="text-xs text-blue-100">
                  {mode === "fast" ? "⚡ Fast Mode" : "🧠 Gemini Mode"}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="hover:bg-white/20 p-2 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="flex justify-center gap-3 p-2 bg-blue-50 border-b">
            <button
              onClick={() => setMode("fast")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${mode === "fast" ? "bg-blue-600 text-white" : "bg-white text-blue-700"}`}
            >
              <Zap size={14} /> Fast
            </button>
            <button
              onClick={() => setMode("gemini")}
              className={`flex items-center gap-1 px-3 py-1 rounded-lg text-sm ${mode === "gemini" ? "bg-blue-600 text-white" : "bg-white text-blue-700"}`}
            >
              <Brain size={14} /> Gemini
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            <AnimatePresence>
              {messages.map((m) => (
                <motion.div
                  key={m.id}
                  initial={{ opacity: 0, y: 20, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {m.sender === "bot" && (
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mr-2">
                      <Bot size={18} className="text-white" />
                    </div>
                  )}
                  <div className={`max-w-[80%] p-3 rounded-2xl ${m.sender === "user" ? "bg-blue-600 text-white rounded-br-none" : "bg-white text-gray-800 shadow border border-gray-200 rounded-bl-none"}`} dangerouslySetInnerHTML={{ __html: m.text }} />
                  {m.sender === "user" && (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center ml-2">
                      <User size={18} className="text-gray-600" />
                    </div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <Bot size={18} className="text-white" />
                </div>
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-300"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-3 border-t bg-white rounded-b-2xl">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Ask about doctors, appointments..."
                className="flex-1 border border-gray-300 rounded-xl px-4 py-2 focus:ring-2 focus:ring-blue-500 text-sm outline-none"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
              />
              <button
                onClick={handleSendMessage}
                className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
                disabled={isSending}
              >
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
