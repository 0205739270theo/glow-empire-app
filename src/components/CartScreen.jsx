import React from 'react';
import { ChevronLeft, Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

// NEW: Accept 'isDarkMode' prop
export default function CartScreen({ onBack, cartItems, setCartItems, onCheckout, isDarkMode }) {

  const updateQuantity = (id, change) => {
    setCartItems(items => items.map(item => {
      if (item.id === id) {
        const newQty = item.quantity + change;
        return newQty > 0 ? { ...item, quantity: newQty } : item;
      }
      return item;
    }));
  };

  const removeItem = (id) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const calculateTotal = () => {
    return cartItems.reduce((sum, item) => {
      let priceNumber = 0;
      if (typeof item.price === 'string') {
         priceNumber = parseFloat(item.price.replace(/[^\d.]/g, ''));
      } else {
         priceNumber = item.price;
      }
      return sum + (priceNumber * item.quantity);
    }, 0);
  };

  const subtotal = calculateTotal();
  const shipping = subtotal > 0 ? 20 : 0;
  const total = subtotal + shipping;

  // --- DYNAMIC STYLES ---
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const bgCard = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const headerBg = isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white';
  const footerBg = isDarkMode ? 'bg-gray-800 shadow-[0_-10px_40px_rgba(0,0,0,0.3)]' : 'bg-white shadow-[0_-10px_40px_rgba(0,0,0,0.05)]';

  return (
    <div className={`min-h-screen w-full relative pb-40 transition-colors duration-300 ${bgMain}`}>
      
      {/* HEADER */}
      <div className={`flex items-center gap-4 p-6 sticky top-0 z-10 shadow-sm transition-colors ${headerBg}`}>
        <button 
          onClick={onBack} 
          className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-bold ${textMain}`}>My Bag</h1>
        <span className="ml-auto text-sm font-bold text-gray-400">{cartItems.length} items</span>
      </div>

      {/* ITEMS LIST */}
      <div className="p-6 space-y-4">
        {cartItems.length === 0 ? (
          <div className="text-center mt-20 flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400'}`}>
               <Trash2 className="w-8 h-8" />
            </div>
            <p className="text-gray-400 font-medium">Your bag is empty.</p>
            <button onClick={onBack} className="mt-4 text-sm font-bold text-glow-primary underline">
              Go Shopping
            </button>
          </div>
        ) : (
          cartItems.map((item, index) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`flex gap-4 p-4 rounded-3xl shadow-sm border transition-colors ${bgCard}`}
            >
              <div className={`w-24 h-24 rounded-2xl flex items-center justify-center p-2 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <img src={item.image} alt={item.name} className="w-full h-full object-contain drop-shadow-md" />
              </div>

              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex justify-between items-start">
                    <h3 className={`font-bold text-sm ${textMain}`}>{item.name}</h3>
                    <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500 transition-colors">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <p className={`text-xs ${textSub}`}>{item.category}</p>
                </div>

                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg text-yellow-500">{item.price}</span>
                  
                  <div className={`flex items-center gap-3 rounded-full px-3 py-1 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-50'}`}>
                    <button onClick={() => updateQuantity(item.id, -1)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-white'}`}>
                      <Minus className={`w-3 h-3 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
                    </button>
                    <span className={`text-sm font-bold w-2 text-center ${textMain}`}>{item.quantity}</span>
                    <button onClick={() => updateQuantity(item.id, 1)} className={`p-1 rounded-full ${isDarkMode ? 'hover:bg-gray-600' : 'hover:bg-white'}`}>
                      <Plus className={`w-3 h-3 ${isDarkMode ? 'text-white' : 'text-gray-600'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* FOOTER */}
      {cartItems.length > 0 && (
        <div className={`fixed bottom-0 w-full rounded-t-[40px] p-8 z-20 transition-colors ${footerBg}`}>
          <div className="space-y-3 mb-6">
            <div className={`flex justify-between text-sm ${textSub}`}>
              <span>Subtotal</span>
              <span>₵{subtotal.toFixed(2)}</span>
            </div>
            <div className={`flex justify-between text-sm ${textSub}`}>
              <span>Shipping</span>
              <span>₵{shipping.toFixed(2)}</span>
            </div>
            <div className={`w-full h-px my-2 ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}></div>
            <div className={`flex justify-between text-xl font-bold ${textMain}`}>
              <span>Total</span>
              <span>₵{total.toFixed(2)}</span>
            </div>
          </div>

          <button 
            onClick={onCheckout}
            className="w-full py-5 bg-black text-white rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-3 hover:bg-glow-primary hover:text-black transition-all"
          >
            Checkout
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

    </div>
  );
}