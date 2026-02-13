import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Banknote, CheckCircle, Loader, MapPin, Smartphone, AlertTriangle, MessageCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutForm({ onBack, cartItems, total, onPlaceOrder, isDarkMode, onGoToChat }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  const [paymentMethod, setPaymentMethod] = useState('momo');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    // --- FIX IS HERE: We define newId BEFORE the timeout ---
    const newId = Date.now().toString().slice(-4); 
    setOrderId(newId); 
    // -----------------------------------------------------

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const newOrder = {
        id: newId, // Now the computer knows what newId is! ✅
        customer: formData,
        items: cartItems,
        total: total,
        status: 'Pending',
        paymentMethod: paymentMethod,
        date: new Date().toLocaleDateString()
      };
      
      onPlaceOrder(newOrder); 
    }, 4500); 
  };

  // --- DYNAMIC STYLES ---
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const headerBg = isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-sm';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const textSub = isDarkMode ? 'text-gray-400' : 'text-gray-500';
  const cardBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const inputBg = isDarkMode ? 'bg-gray-700 text-white border-gray-600 focus:ring-glow-primary' : 'bg-gray-50 text-gray-900 border-gray-200 focus:ring-yellow-400';

  // --- SUCCESS SCREEN ---
  if (isSuccess) {
    return (
      <div className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${bgMain}`}>
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6">
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        
        <h2 className={`text-2xl font-bold mb-2 ${textMain}`}>Order Placed!</h2>
        <p className={`mb-8 ${textSub}`}>Order #{orderId}</p>

        {paymentMethod === 'momo' ? (
          <div className="w-full max-w-sm space-y-3">
             <p className={`text-sm mb-2 ${textMain}`}>To speed up your delivery, please send a screenshot of your payment to our Support team.</p>
             <button 
               onClick={onGoToChat}
               className="w-full py-4 bg-black text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-glow-primary hover:text-black transition-all"
             >
               <MessageCircle className="w-5 h-5" />
               Send Proof in Chat
             </button>
             <button onClick={onBack} className="text-sm font-bold text-gray-400 mt-4">Skip</button>
          </div>
        ) : (
          <div className="w-full max-w-sm space-y-3">
             <p className={`text-sm mb-4 ${textMain}`}>We will call you shortly to confirm your order. Please keep your phone on.</p>
             <button onClick={onBack} className="w-full py-4 bg-gray-200 text-gray-900 rounded-full font-bold">Back to Shop</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`min-h-screen w-full relative pb-10 transition-colors duration-300 ${bgMain}`}>
      
      {/* HEADER */}
      <div className={`flex items-center gap-4 p-6 sticky top-0 z-10 transition-colors ${headerBg}`}>
        <button onClick={onBack} className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-bold ${textMain}`}>Checkout</h1>
      </div>

      <form onSubmit={handleSubmit} className="p-6 space-y-6">
        
        {/* DELIVERY FORM */}
        <div className={`p-5 rounded-3xl border shadow-sm space-y-4 transition-colors ${cardBg}`}>
          <h3 className={`font-bold flex items-center gap-2 ${textMain}`}>
            <MapPin className="w-4 h-4 text-glow-primary" /> Delivery Details
          </h3>
          <div className="space-y-3">
            <input required type="text" placeholder="Full Name" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className={`w-full p-4 rounded-xl border outline-none focus:ring-2 transition-all ${inputBg}`} />
            <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className={`w-full p-4 rounded-xl border outline-none focus:ring-2 transition-all ${inputBg}`} />
            <input required type="text" placeholder="Address / Location" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className={`w-full p-4 rounded-xl border outline-none focus:ring-2 transition-all ${inputBg}`} />
          </div>
        </div>

        {/* PAYMENT METHOD */}
        <div className={`p-5 rounded-3xl border shadow-sm space-y-4 transition-colors ${cardBg}`}>
          <h3 className={`font-bold flex items-center gap-2 ${textMain}`}>
            <CreditCard className="w-4 h-4 text-glow-primary" /> Payment Method
          </h3>
          
          <div className="space-y-3">
            {/* MoMo Option */}
            <div onClick={() => setPaymentMethod('momo')} className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'momo' ? 'border-yellow-400 bg-yellow-400/10' : `${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-yellow-100 text-yellow-600'}`}><Smartphone className="w-5 h-5" /></div>
                <div><p className={`font-bold text-sm ${textMain}`}>Mobile Money</p><p className="text-xs text-gray-400">Send to 055-xxx-xxxx</p></div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'momo' ? 'border-yellow-400' : 'border-gray-300'}`}>{paymentMethod === 'momo' && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}</div>
            </div>

            {/* MOMO INSTRUCTIONS */}
            {paymentMethod === 'momo' && (
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-xl">
                <p className={`text-xs ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>
                  <strong>Instruction:</strong> Send <strong>{total}</strong> to <strong>055-000-0000 (Beauty)</strong>. Use your name as Reference.
                </p>
              </motion.div>
            )}

            {/* Cash Option */}
            <div onClick={() => setPaymentMethod('cash')} className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${paymentMethod === 'cash' ? 'border-yellow-400 bg-yellow-400/10' : `${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-600'}`}><Banknote className="w-5 h-5" /></div>
                <div><p className={`font-bold text-sm ${textMain}`}>Cash on Delivery</p><p className="text-xs text-gray-400">Pay when it arrives</p></div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentMethod === 'cash' ? 'border-yellow-400' : 'border-gray-300'}`}>{paymentMethod === 'cash' && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}</div>
            </div>

            {/* COD WARNING */}
            {paymentMethod === 'cash' && (
               <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="bg-red-500/10 border border-red-500/20 p-4 rounded-xl flex gap-3 items-start">
                  <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                  <p className={`text-xs ${isDarkMode ? 'text-red-300' : 'text-red-700'}`}>
                    <strong>Verification Required:</strong> We will call you to confirm before shipping. Unanswered calls will be cancelled.
                  </p>
               </motion.div>
            )}

          </div>
        </div>

        {/* FOOTER */}
        <div className="flex items-center justify-between pt-4">
          <span className={`text-gray-400 text-sm`}>Total to Pay</span>
          <span className={`text-2xl font-bold ${isDarkMode ? 'text-yellow-400' : 'text-gray-900'}`}>{total}</span>
        </div>

        <button 
          disabled={isProcessing}
          className="w-full py-5 bg-black text-white rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-3 hover:bg-glow-primary hover:text-black transition-all disabled:opacity-50"
        >
          {isProcessing ? <Loader className="w-5 h-5 animate-spin" /> : "Confirm Order"}
        </button>

      </form>
    </div>
  );
}