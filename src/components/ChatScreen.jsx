import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Send, Paperclip, Image as ImageIcon, Check } from 'lucide-react';

export default function ChatScreen({ onBack, isDarkMode }) {
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! Welcome to Glow Empire Support.", sender: 'bot', type: 'text' },
    { id: 2, text: "If you just placed an order, please upload your payment screenshot here.", sender: 'bot', type: 'text' }
  ]);
  const [inputText, setInputText] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null); // Hidden file input

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  useEffect(scrollToBottom, [messages, isTyping]);

  // --- SEND TEXT ---
  const handleSend = () => {
    if (!inputText.trim()) return;

    const userMsg = { id: Date.now(), text: inputText, sender: 'user', type: 'text' };
    setMessages(prev => [...prev, userMsg]);
    setInputText("");
    
    simulateBotResponse();
  };

  // --- SEND IMAGE (SIMULATION) ---
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    // 1. Add User "Image" Message
    const userMsg = { 
      id: Date.now(), 
      text: "Sent a photo", 
      sender: 'user', 
      type: 'image',
      imageName: file.name 
    };
    setMessages(prev => [...prev, userMsg]);

    // 2. Bot auto-reply for receipts
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = { 
        id: Date.now() + 1, 
        text: "Payment receipt received! 🧾 We are verifying it now. Please wait shortly.", 
        sender: 'bot', 
        type: 'text' 
      };
      setMessages(prev => [...prev, botMsg]);
    }, 2000);
  };

  const simulateBotResponse = () => {
    setIsTyping(true);
    setTimeout(() => {
      setIsTyping(false);
      const botMsg = { id: Date.now() + 1, text: "Thanks! An agent will be with you shortly.", sender: 'bot', type: 'text' };
      setMessages(prev => [...prev, botMsg]);
    }, 1500);
  };

  // --- DYNAMIC STYLES ---
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const headerBg = isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-sm';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const inputAreaBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const inputFieldBg = isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-black';

  return (
    <div className={`min-h-screen w-full flex flex-col relative transition-colors duration-300 ${bgMain}`}>
      
      {/* HEADER */}
      <div className={`p-4 flex items-center gap-4 sticky top-0 z-10 transition-colors ${headerBg}`}>
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <div className="w-10 h-10 bg-black rounded-full flex items-center justify-center border border-gray-700 relative">
            <span className="text-white font-bold text-xs">GE</span>
            <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></span>
        </div>
        <div>
            <h1 className={`font-bold ${textMain}`}>Payment Support</h1>
            <p className="text-xs text-green-500 font-bold">Online</p>
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto pb-24">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
            
            {/* TEXT MESSAGE */}
            {msg.type === 'text' && (
              <div className={`max-w-[80%] p-4 rounded-2xl text-sm shadow-sm ${
                msg.sender === 'user' 
                ? `${isDarkMode ? 'bg-glow-primary text-black' : 'bg-black text-white'} rounded-br-none` 
                : `${isDarkMode ? 'bg-gray-800 text-gray-200' : 'bg-white text-gray-800'} rounded-bl-none`
              }`}>
                {msg.text}
              </div>
            )}

            {/* IMAGE MESSAGE (Simulated) */}
            {msg.type === 'image' && (
              <div className={`max-w-[80%] p-2 rounded-2xl shadow-sm ${
                 isDarkMode ? 'bg-glow-primary' : 'bg-black'
              } rounded-br-none`}>
                 <div className="bg-white/20 p-8 rounded-xl flex flex-col items-center justify-center gap-2">
                    <ImageIcon className={`w-8 h-8 ${isDarkMode ? 'text-black' : 'text-white'}`} />
                    <span className={`text-xs font-bold ${isDarkMode ? 'text-black' : 'text-white'}`}>Screenshot Sent</span>
                 </div>
                 <div className={`px-2 py-1 text-[10px] text-right font-bold flex justify-end items-center gap-1 ${isDarkMode ? 'text-black/60' : 'text-white/60'}`}>
                    {new Date().toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})} <Check className="w-3 h-3" />
                 </div>
              </div>
            )}

          </div>
        ))}
        
        {/* TYPING INDICATOR */}
        {isTyping && (
          <div className="flex justify-start">
             <div className={`px-4 py-3 rounded-2xl rounded-bl-none flex gap-1 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75"></span>
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
             </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* INPUT AREA */}
      <div className={`absolute bottom-0 w-full p-4 border-t flex gap-3 items-center transition-colors ${inputAreaBg}`}>
        
        {/* HIDDEN FILE INPUT */}
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*"
          onChange={handleFileUpload} 
        />
        
        {/* ATTACHMENT BUTTON */}
        <button 
          onClick={() => fileInputRef.current.click()}
          className={`p-3 rounded-full transition-colors ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input 
          type="text" 
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Type a message..." 
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          className={`flex-1 rounded-full px-5 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-colors ${inputFieldBg}`}
        />
        
        <button 
          onClick={handleSend}
          className="p-3 bg-glow-primary text-black rounded-full font-bold shadow-md hover:bg-yellow-500 transition-all active:scale-95"
        >
          <Send className="w-5 h-5" />
        </button>
      </div>

    </div>
  );
}