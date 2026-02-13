import React from 'react';
import { ChevronLeft, ShoppingBag, Trash2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';

export default function FavoritesScreen({ onBack, favorites, onToggleFavorite, onAddToCart, isDarkMode }) {
  
  // Dynamic Styles
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';

  return (
    <div className={`min-h-screen w-full relative pb-20 transition-colors duration-300 ${bgMain}`}>
      
      {/* HEADER */}
      <div className={`p-6 shadow-sm sticky top-0 z-10 flex items-center gap-4 transition-colors ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-bold ${textMain}`}>My Wishlist</h1>
        <span className="ml-auto text-sm font-bold text-gray-400">{favorites.length} items</span>
      </div>

      {/* FAVORITES LIST */}
      <div className="p-6 space-y-4">
        {favorites.length === 0 ? (
          <div className="text-center mt-20 flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-6 ${isDarkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-100 text-gray-300'}`}>
               <Heart className="w-10 h-10 fill-current" />
            </div>
            <p className="text-gray-400 font-medium">No favorites yet.</p>
            <button onClick={onBack} className="mt-4 text-sm font-bold text-glow-primary underline">
              Start Exploring
            </button>
          </div>
        ) : (
          favorites.map((product, index) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-4 p-4 rounded-3xl shadow-sm border ${cardBg}`}
            >
              {/* Image */}
              <div className="w-24 h-24 bg-gray-50 rounded-2xl flex items-center justify-center p-2">
                <img src={product.image} alt={product.name} className="w-full h-full object-contain drop-shadow-md" />
              </div>

              {/* Details */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-sm ${textMain}`}>{product.name}</h3>
                    <button 
                      onClick={() => onToggleFavorite(product)} 
                      className="text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Heart className="w-5 h-5 fill-current" />
                    </button>
                  </div>
                  <p className="text-xs text-gray-400">{product.category}</p>
                </div>

                <div className="flex justify-between items-end">
                  <span className={`font-bold text-lg ${textMain}`}>{product.price}</span>
                  
                  {/* Add to Cart Button */}
                  <button 
                    onClick={() => onAddToCart(product, 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-glow-primary hover:text-black transition-all shadow-md"
                  >
                    <ShoppingBag className="w-3 h-3" /> Add
                  </button>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

    </div>
  );
}