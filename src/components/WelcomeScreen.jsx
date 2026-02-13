import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

import serumImg from '../assets/products/Serum.png';
import creamImg from '../assets/products/Skincream.png';
import lipstickImg from '../assets/products/Lipstick.png';

// NEW: Accept 'isDarkMode' prop
export default function WelcomeScreen({ isDarkMode }) {
  
  // --- DYNAMIC STYLES ---
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  
  // Button Styles
  const googleBtn = isDarkMode 
    ? 'bg-gray-800 border-gray-700 text-white hover:bg-gray-700' 
    : 'bg-white border-gray-200 text-gray-800 hover:bg-gray-50';

  const emailBtn = isDarkMode
    ? 'bg-white text-black hover:bg-gray-200' // Inverted for high contrast in dark mode
    : 'bg-black text-white hover:bg-gray-900';

  return (
    <div className={`relative flex flex-col items-center justify-center min-h-screen w-full overflow-hidden p-6 transition-colors duration-300 ${bgMain}`}>
      
      {/* --- 1. THE FADED BLUR BACKGROUND (ADAPTIVE) --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none">
        {/* Top Blob */}
        <div className={`absolute -top-20 -right-20 w-80 h-80 rounded-full filter blur-[80px] transition-all duration-1000 ${
          isDarkMode ? 'bg-purple-600 opacity-20 mix-blend-screen' : 'bg-purple-200 opacity-50 mix-blend-multiply'
        }`}></div>
        
        {/* Bottom Blob */}
        <div className={`absolute -bottom-20 -left-20 w-80 h-80 rounded-full filter blur-[80px] transition-all duration-1000 ${
          isDarkMode ? 'bg-pink-600 opacity-20 mix-blend-screen' : 'bg-pink-200 opacity-50 mix-blend-multiply'
        }`}></div>
        
        {/* Center Blob */}
        <div className={`absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 rounded-full filter blur-[100px] transition-all duration-1000 ${
          isDarkMode ? 'bg-yellow-600 opacity-10 mix-blend-screen' : 'bg-yellow-100 opacity-40 mix-blend-multiply'
        }`}></div>
      </div>

      {/* --- 2. FLOATING PRODUCTS LAYER --- */}
      <div className="absolute inset-0 w-full h-full pointer-events-none z-0">
        
        {/* Product 1 */}
        <motion.img 
          src={serumImg} alt="Serum"
          className="absolute top-24 left-6 w-24 h-auto opacity-90 drop-shadow-xl"
          animate={{ y: [0, -15, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Product 2 */}
        <motion.img 
          src={creamImg} alt="Cream"
          className="absolute top-1/3 right-4 w-28 h-auto opacity-90 drop-shadow-xl"
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />

        {/* Product 3 */}
        <motion.img 
          src={lipstickImg} alt="Lipstick"
          className="absolute bottom-12 left-8 w-32 h-auto opacity-90 drop-shadow-xl"
          animate={{ y: [0, -10, 0], rotate: [0, 10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", delay: 2 }}
        />

      </div>

      {/* --- 3. MAIN CONTENT --- */}
      <div className="relative z-10 flex flex-col items-center w-full max-w-sm">
        
        {/* Brand Header */}
        <div className="text-center mb-16">
          <h1 className={`text-4xl font-bold tracking-tight mb-2 ${textMain}`}>Glow Empire Gh</h1>
          <p className={`${textSub} text-sm tracking-wide`}>Where Beauty Reigns</p>
        </div>

        {/* Action Buttons */}
        <div className="w-full space-y-4">
          
          <button className={`w-full py-4 rounded-full shadow-sm flex items-center justify-center gap-3 font-bold text-sm transition-all border ${googleBtn}`}>
            <img src="https://www.google.com/favicon.ico" className="w-5 h-5" alt="google" />
            Continue with Google
          </button>
          
          <button className={`w-full py-4 rounded-full shadow-lg flex items-center justify-center gap-3 font-bold text-sm transition-all ${emailBtn}`}>
            <Mail className="w-5 h-5" />
            Continue with Email
          </button>

           {/* Replaced 'Generic Button' with a clear CTA */}
           <button className="w-full py-4 bg-glow-primary text-black rounded-full shadow-md flex items-center justify-center gap-3 font-bold text-sm hover:brightness-105 transition-all">
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Footer Link */}
        <div className="mt-8">
          <p className={`${textSub} text-sm`}>
            Already have an account? <span className={`font-bold cursor-pointer hover:underline ${textMain}`}>Log in</span>
          </p>
        </div>

      </div>
    </div>
  );
}