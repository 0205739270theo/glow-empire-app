import React, { useState } from 'react';
import { ChevronLeft, CreditCard, Banknote, CheckCircle, Loader, MapPin, Smartphone, AlertTriangle, MessageCircle, Wallet } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CheckoutForm({ onBack, cartItems, total, onPlaceOrder, isDarkMode, onGoToChat }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });
  
  // 'full' = Pay Everything Now | 'delivery' = Pay 20 Now, Rest Later
  const [paymentType, setPaymentType] = useState('full'); 
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // --- 1. CALCULATE MATH ---
  // Extract number from string (e.g. "₵150.00" -> 150.00)
  const numericTotal = parseFloat(total.replace(/[^\d.]/g, ''));
  const deliveryFee = 20.00;
  const itemTotal = numericTotal - deliveryFee;

  // What do they pay RIGHT NOW?
  const amountToPayNow = paymentType === 'full' ? numericTotal : deliveryFee;
  
  // What do they pay LATER?
  const balanceDue = paymentType === 'full' ? 0 : itemTotal;

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);

    const newId = Date.now().toString().slice(-4); 
    setOrderId(newId); 

    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);

      const newOrder = {
        id: newId, 
        customer: formData,
        items: cartItems,
        total: total, // The full value of the cart
        
        // 👇 NEW: RECEIPT DATA
        status: 'Pending',
        paymentType: paymentType, // 'full' or 'delivery'
        amountPaid: `₵${amountToPayNow.toFixed(2)}`,
        balanceDue: `₵${balanceDue.toFixed(2)}`, // IMPORTANT: Shows what they still owe
        date: new Date().toLocaleDateString()
      };
      
      onPlaceOrder(newOrder); 
    }, 3000); 
  };

  // --- STYLES ---
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
        <p className={`mb-6 ${textSub}`}>Order #{orderId}</p>

        {/* Dynamic Success Message */}
        <div className={`p-4 rounded-xl mb-6 text-sm ${isDarkMode ? 'bg-gray-800 text-gray-300' : 'bg-gray-100 text-gray-700'}`}>
           {paymentType === 'full' ? (
             <p>You have chosen to pay the <strong>Full Amount (₵{amountToPayNow.toFixed(2)})</strong>.</p>
           ) : (
             <p>
               You have chosen to pay the <strong>Delivery Fee (₵20.00)</strong>. <br/>
               Please prepare <strong>₵{balanceDue.toFixed(2)}</strong> in Cash for the rider.
             </p>
           )}
        </div>

        <div className="w-full max-w-sm space-y-3">
            <p className={`text-sm mb-2 ${textMain}`}>Please send payment proof to speed up processing.</p>
            <button 
              onClick={onGoToChat}
              className="w-full py-4 bg-black text-white rounded-full font-bold shadow-lg flex items-center justify-center gap-2 hover:bg-glow-primary hover:text-black transition-all"
            >
              <MessageCircle className="w-5 h-5" />
              Send Proof in Chat
            </button>
            <button onClick={onBack} className="text-sm font-bold text-gray-400 mt-4">Skip</button>
        </div>
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

        {/* PAYMENT METHOD SELECTION */}
        <div className={`p-5 rounded-3xl border shadow-sm space-y-4 transition-colors ${cardBg}`}>
          <h3 className={`font-bold flex items-center gap-2 ${textMain}`}>
            <Wallet className="w-4 h-4 text-glow-primary" /> Select Payment Plan
          </h3>
          
          <div className="space-y-3">
            
            {/* OPTION 1: FULL PAYMENT */}
            <div onClick={() => setPaymentType('full')} className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${paymentType === 'full' ? 'border-yellow-400 bg-yellow-400/10' : `${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-green-100 text-green-600'}`}><Smartphone className="w-5 h-5" /></div>
                <div>
                  <p className={`font-bold text-sm ${textMain}`}>Pay Full Amount</p>
                  <p className="text-xs text-gray-400">Pay <strong>{total}</strong> via MoMo now</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentType === 'full' ? 'border-yellow-400' : 'border-gray-300'}`}>{paymentType === 'full' && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}</div>
            </div>

            {/* OPTION 2: DELIVERY FEE ONLY */}
            <div onClick={() => setPaymentType('delivery')} className={`p-4 rounded-xl border-2 flex items-center justify-between cursor-pointer transition-all ${paymentType === 'delivery' ? 'border-yellow-400 bg-yellow-400/10' : `${isDarkMode ? 'border-gray-600' : 'border-gray-100'}`}`}>
              <div className="flex items-center gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-blue-100 text-blue-600'}`}><Banknote className="w-5 h-5" /></div>
                <div>
                  <p className={`font-bold text-sm ${textMain}`}>Pay Delivery Fee Only</p>
                  <p className="text-xs text-gray-400">Pay <strong>₵20.00</strong> now, rest on delivery</p>
                </div>
              </div>
              <div className={`w-4 h-4 rounded-full border flex items-center justify-center ${paymentType === 'delivery' ? 'border-yellow-400' : 'border-gray-300'}`}>{paymentType === 'delivery' && <div className="w-2 h-2 bg-yellow-400 rounded-full" />}</div>
            </div>

          </div>
        </div>

        {/* INSTRUCTIONS BOX */}
        <motion.div 
           key={paymentType} // Re-animate when type changes
           initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} 
           className="bg-yellow-500/10 border border-yellow-500/20 p-5 rounded-2xl"
        >
            <h4 className={`text-sm font-bold mb-2 ${isDarkMode ? 'text-yellow-200' : 'text-yellow-800'}`}>Payment Instructions:</h4>
            
            <p className={`text-xs mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>
              Please send <strong>₵{amountToPayNow.toFixed(2)}</strong> to our MoMo Number:
            </p>
            
            <div className={`p-3 rounded-lg flex justify-between items-center mb-3 ${isDarkMode ? 'bg-black/40' : 'bg-white'}`}>
               <span className={`font-mono font-bold text-lg ${textMain}`}>055-000-0000</span>
               <span className="text-xs text-gray-400 uppercase tracking-wider">Beauty</span>
            </div>

            {paymentType === 'delivery' && (
              <div className="flex items-start gap-2 text-xs text-red-400 mt-2">
                 <AlertTriangle className="w-4 h-4 shrink-0" />
                 <span><strong>Note:</strong> You must pay the remaining <strong>₵{balanceDue.toFixed(2)}</strong> in Cash to the rider upon delivery.</span>
              </div>
            )}
        </motion.div>

        {/* BOTTOM ACTION BAR */}
        <div className={`fixed bottom-0 left-0 w-full p-6 pt-4 border-t z-20 ${isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-100'}`}>
           <div className="flex justify-between items-center mb-4">
              <span className="text-gray-400 text-sm">To Pay Now</span>
              <span className={`text-2xl font-bold ${isDarkMode ? 'text-white' : 'text-black'}`}>
                 ₵{amountToPayNow.toFixed(2)}
              </span>
           </div>
           
           <button 
             disabled={isProcessing}
             className="w-full py-5 bg-black text-white rounded-full font-bold text-lg shadow-lg flex items-center justify-center gap-3 hover:bg-glow-primary hover:text-black transition-all disabled:opacity-50"
           >
             {isProcessing ? <Loader className="w-5 h-5 animate-spin" /> : `Confirm & Pay ₵${amountToPayNow.toFixed(2)}`}
           </button>
        </div>

      </form>
      <div className="h-24"></div> {/* Spacer for fixed bottom bar */}
    </div>
  );
}