import React from 'react';
import { X, Home, ShoppingBag, MessageCircle, Heart, LogOut, ShieldCheck, Moon, Sun, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// NEW: Accept 'isDarkMode' and 'onToggleTheme' props
export default function Sidebar({ isOpen, onClose, onNavigate, isDarkMode, onToggleTheme }) {
  
  const menuItems = [
    { icon: Home, label: "Shop Home", screen: "shop" },
    { icon: ShoppingBag, label: "My Orders", screen: "orders" },
    { icon: Heart, label: "Favorites", screen: "shop" },
    { icon: MessageCircle, label: "Support Chat", screen: "chat" },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* BACKDROP */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
          />

          {/* SIDEBAR PANEL */}
          <motion.div 
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className={`fixed top-0 left-0 h-full w-[85%] max-w-sm z-50 shadow-2xl rounded-r-[40px] overflow-hidden flex flex-col ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}
          >
            
            {/* HEADER */}
            <div className="bg-gradient-to-br from-black to-gray-800 p-8 pt-12 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-10 -mt-10 blur-2xl"></div>
              
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center text-black font-bold text-2xl border-4 border-white/20 shadow-lg">
                  B
                </div>
                <button onClick={onClose} className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <h2 className="text-2xl font-bold relative z-10">Beauty</h2>
              <p className="text-white/60 text-sm relative z-10">beauty@glowempire.com</p>
            </div>

            {/* MENU LINKS */}
            <div className="flex-1 p-6 space-y-2 overflow-y-auto">
              {menuItems.map((item, index) => (
                <button 
                  key={index}
                  onClick={() => { onNavigate(item.screen); onClose(); }}
                  className={`w-full flex items-center justify-between p-4 rounded-2xl transition-all group ${
                    isDarkMode 
                    ? 'hover:bg-gray-800 text-gray-300 hover:text-white' 
                    : 'hover:bg-gray-50 text-gray-600 hover:text-black'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <item.icon className="w-5 h-5 group-hover:scale-110 transition-transform" />
                    <span className="font-semibold">{item.label}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
              ))}

              <div className={`my-4 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}></div>

              {/* CEO DASHBOARD */}
              <button 
                onClick={() => { onNavigate("admin"); onClose(); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-glow-primary bg-yellow-400/10 hover:bg-yellow-400/20 transition-all"
              >
                <ShieldCheck className="w-5 h-5" />
                <span className="font-bold">CEO Dashboard</span>
              </button>
            </div>

            {/* FOOTER: THEME TOGGLE & LOGOUT */}
            <div className={`p-6 border-t ${isDarkMode ? 'border-gray-800' : 'border-gray-100'}`}>
              
              {/* THEME TOGGLE */}
              <div className={`flex items-center justify-between p-4 rounded-2xl mb-4 ${isDarkMode ? 'bg-gray-800' : 'bg-gray-50'}`}>
                <div className="flex items-center gap-3">
                  {isDarkMode ? <Moon className="w-5 h-5 text-purple-400" /> : <Sun className="w-5 h-5 text-orange-400" />}
                  <span className="font-semibold text-sm">Dark Mode</span>
                </div>
                
                {/* SWITCH */}
                <button 
                  onClick={onToggleTheme}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative ${isDarkMode ? 'bg-purple-500' : 'bg-gray-300'}`}
                >
                  <motion.div 
                    animate={{ x: isDarkMode ? 24 : 0 }}
                    className="w-4 h-4 bg-white rounded-full shadow-md"
                  />
                </button>
              </div>

              {/* LOGOUT */}
              <button 
                onClick={() => { onNavigate("welcome"); onClose(); }}
                className="w-full flex items-center gap-4 p-4 rounded-2xl text-red-500 hover:bg-red-50 hover:text-red-600 transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-bold">Log Out</span>
              </button>
            </div>

          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}