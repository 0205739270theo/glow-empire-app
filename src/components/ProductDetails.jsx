import React, { useState } from 'react';
import { ChevronLeft, ShoppingBag, Star, Minus, Plus, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

// NEW: Accept 'isFavorite', 'onToggleFavorite', and 'isDarkMode'
export default function ProductDetails({ onBack, product, onAddToCart, isFavorite, onToggleFavorite, isDarkMode }) {
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    onAddToCart(product, quantity);
    onBack();
  };

  // Dynamic Styles
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const bgCard = isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-400' : 'text-gray-500';

  return (
    <div className={`min-h-screen w-full relative flex flex-col transition-colors duration-300 ${bgMain}`}>
      
      {/* HEADER */}
      <div className="flex justify-between items-center p-6 absolute top-0 w-full z-20">
        <button 
          onClick={onBack} 
          className={`p-3 rounded-full shadow-sm backdrop-blur-md transition-all ${isDarkMode ? 'bg-gray-800/80 text-white hover:bg-gray-700' : 'bg-white/80 text-gray-800 hover:bg-white'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>

        <button 
          // CONNECTED TO REAL WISHLIST
          onClick={onToggleFavorite} 
          className={`p-3 rounded-full shadow-sm backdrop-blur-md transition-all ${
            isFavorite 
            ? 'bg-red-500 text-white' 
            : `${isDarkMode ? 'bg-gray-800/80 text-white hover:bg-gray-700' : 'bg-white/80 text-gray-800 hover:bg-white'}`
          }`}
        >
          <Heart className={`w-6 h-6 ${isFavorite ? 'fill-current' : ''}`} />
        </button>
      </div>

      {/* HERO IMAGE SECTION */}
      <div className={`flex-1 flex items-center justify-center relative overflow-hidden pb-20 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-100'}`}>
        <div className="absolute w-96 h-96 bg-yellow-400 rounded-full mix-blend-multiply filter blur-[80px] opacity-20 animate-pulse"></div>
        
        <motion.img 
          src={product.image} 
          alt={product.name} 
          className="relative z-10 w-64 h-auto drop-shadow-2xl"
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      {/* DETAILS PANEL */}
      <div className={`rounded-t-[40px] shadow-[0_-10px_40px_rgba(0,0,0,0.05)] p-8 -mt-10 z-20 relative transition-colors duration-300 ${bgCard}`}>
        
        <div className="flex justify-between items-start mb-2">
          <div>
            <h1 className={`text-2xl font-bold ${textMain}`}>{product.name}</h1>
            <p className={`${textSub} text-sm`}>{product.category} • 150ml</p>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-2xl font-bold text-yellow-500">{product.price}</span>
             <div className="flex items-center gap-1 mt-1">
               <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
               <span className={`text-xs font-bold ${textSub}`}>{product.rating} (240 reviews)</span>
             </div>
          </div>
        </div>

        <div className="mt-6 mb-8">
          <h3 className={`text-sm font-bold mb-2 ${textMain}`}>Description</h3>
          <p className={`${textSub} text-sm leading-relaxed`}>
            Experience the luxury of {product.name}. This premium formula is designed to give you that signature Glow Empire radiance. Perfect for daily use.
          </p>
        </div>

        {/* Quantity & Cart Buttons */}
        <div className="flex items-center gap-5">
          <div className={`flex items-center gap-4 border rounded-full px-4 py-3 ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
            <button 
              onClick={() => quantity > 1 && setQuantity(q => q - 1)}
              className={`w-8 h-8 flex items-center justify-center rounded-full ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-600'}`}
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className={`text-lg font-bold w-4 text-center ${textMain}`}>{quantity}</span>
            <button 
              onClick={() => setQuantity(q => q + 1)}
              className="w-8 h-8 flex items-center justify-center bg-black text-white rounded-full hover:bg-gray-800"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <button 
            onClick={handleAddToCart}
            className="flex-1 bg-black text-white py-4 rounded-full font-bold shadow-lg flex items-center justify-center gap-3 hover:bg-glow-primary hover:text-black transition-all"
          >
            <ShoppingBag className="w-5 h-5" />
            Add to Cart
          </button>
        </div>

      </div>
    </div>
  );
}