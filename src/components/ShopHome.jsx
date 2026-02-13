import React, { useState } from 'react';
import { Search, ShoppingBag, AlignLeft, Filter, Star, Plus, MessageCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ShopHome({ onProductClick, onCartClick, cartCount, onAddToCart, onChatClick, onMenuClick, isDarkMode, products = [] }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const categories = ["All", "Skincare", "Makeup", "Hair", "Perfume", "Eye", "Accessories"];

  const filteredProducts = activeCategory === "All" 
    ? products 
    : products.filter(product => product.category === activeCategory);

  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const bgCard = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-yellow-400';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const headerBg = isDarkMode ? 'bg-gray-900 shadow-gray-800' : 'bg-white';
  const inputBg = isDarkMode ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' : 'bg-gray-50 border-gray-200 text-black';

  return (
    <div className={`min-h-screen w-full pb-24 transition-colors duration-300 ${bgMain}`}>
      
      {/* HEADER */}
      <div className={`p-6 pb-4 sticky top-0 z-20 shadow-sm transition-colors duration-300 ${headerBg}`}>
        <div className="flex justify-between items-center mb-6">
          <motion.button 
            whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.90 }} 
            onClick={onMenuClick}
            className={`p-3 rounded-2xl shadow-sm border transition-colors ${isDarkMode ? 'bg-gray-800 border-gray-700 text-white hover:bg-black' : 'bg-gray-50 border-gray-100 text-gray-900 hover:bg-black hover:text-white'}`}
          >
            <AlignLeft className="w-6 h-6" />
          </motion.button>
          
          <div className="flex items-center gap-4">
            <span className={`text-sm font-semibold ${textMain}`}>Hi, Beauty</span>
            <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={onChatClick} className="p-2 rounded-full relative">
              <MessageCircle className={`w-6 h-6 ${textMain}`} />
            </motion.button>
            <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} className="relative cursor-pointer p-1" onClick={onCartClick}>
              <ShoppingBag className={`w-6 h-6 ${textMain}`} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-glow-primary text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full animate-bounce shadow-sm text-black">
                  {cartCount}
                </span>
              )}
            </motion.div>
          </div>
        </div>

        <h2 className={`text-2xl font-bold mb-6 ${textMain}`}>
          Find your favorite <br />
          <span className="text-gray-400">Products</span>
        </h2>

        <div className="flex items-center gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-1/2 transform -translate-y-1/2" />
            <input type="text" placeholder="Search..." className={`w-full pl-12 pr-4 py-4 border rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400 transition-all ${inputBg}`} />
          </div>
          <button className="p-4 bg-black text-white rounded-2xl shadow-md active:scale-95 transition-transform">
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="pl-6 pt-4 pb-2">
        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide pr-6">
          {categories.map((cat, index) => (
            <button key={index} onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-black text-white shadow-lg scale-105' : `${isDarkMode ? 'bg-gray-800 text-gray-400 border-gray-700' : 'bg-white text-gray-500 border-gray-200'} border shadow-sm`}`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCT GRID */}
      <div className="p-6 pt-2">
        <div className="flex justify-between items-end mb-6">
          <h3 className={`text-xl font-bold ${textMain}`}>{activeCategory === "All" ? "Popular Now" : activeCategory}</h3>
          <span className="text-sm text-glow-primary font-bold cursor-pointer hover:underline">View All</span>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-10 text-gray-400"><p>No products found in {activeCategory}</p></div>
        ) : (
          <div className="grid grid-cols-2 gap-5">
            {filteredProducts.map((product) => (
              <motion.div 
                key={product.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} onClick={() => onProductClick(product)}
                className={`p-4 rounded-3xl shadow-sm hover:shadow-xl transition-all relative border cursor-pointer group ${bgCard}`}
              >
                <div className="h-28 flex items-center justify-center mb-3 relative overflow-hidden rounded-xl p-2">
                  <img src={product.image} alt={product.name} className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300" />
                  
                  {/* 👇 NEW: STOCK BADGE */}
                  {product.stock > 0 ? (
                    <span className={`absolute top-0 right-0 px-2 py-1 text-[9px] font-bold rounded-bl-xl shadow-sm backdrop-blur-md ${
                        product.stock <= 5 
                        ? 'bg-red-500 text-white' // Low stock = Red
                        : isDarkMode ? 'bg-gray-700/80 text-white' : 'bg-gray-200/80 text-black' // Normal stock
                    }`}>
                        {product.stock} left
                    </span>
                  ) : (
                    <span className="absolute inset-0 bg-black/60 flex items-center justify-center text-white font-bold text-sm uppercase tracking-widest backdrop-blur-[2px]">
                        Sold Out
                    </span>
                  )}
                </div>
                
                <div className="space-y-1">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span className="text-xs text-gray-400 font-medium">{product.rating || '4.5'}</span>
                  </div>
                  <h4 className={`font-bold text-sm leading-tight line-clamp-2 ${textMain}`}>{product.name}</h4>
                  <p className={`text-xs ${textSub}`}>{product.category}</p>
                  
                  <div className="flex justify-between items-center pt-2">
                    <span className={`font-bold text-lg ${textMain}`}>{product.price}</span>
                    <motion.button whileTap={{ scale: 0.8 }} 
                      disabled={product.stock === 0}
                      onClick={(e) => { e.stopPropagation(); if(product.stock > 0) onAddToCart(product, 1); }}
                      className={`p-2 rounded-full transition-colors shadow-md z-10 ${
                          product.stock === 0 
                          ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                          : 'bg-black text-white hover:bg-glow-primary hover:text-black'
                      }`}
                    >
                      <Plus className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}