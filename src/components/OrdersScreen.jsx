import React, { useState } from 'react';
import { ChevronLeft, CheckCircle, Clock, XCircle, Package, Receipt, X, Printer, User, Phone, MapPin } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function OrdersScreen({ onBack, orders, isDarkMode }) {
  
  const [selectedReceipt, setSelectedReceipt] = useState(null);

  const handleOpenReceipt = (order) => {
    setSelectedReceipt(order);
  };

  const handleCloseReceipt = () => {
    setSelectedReceipt(null);
  };

  // --- DYNAMIC STYLES ---
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const headerBg = isDarkMode ? 'bg-gray-800 shadow-gray-900' : 'bg-white shadow-sm';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const itemText = isDarkMode ? 'text-gray-300' : 'text-gray-700';

  return (
    <div className={`min-h-screen w-full relative transition-colors duration-300 ${bgMain}`}>
      
      {/* HEADER */}
      <div className={`p-6 flex items-center gap-4 sticky top-0 z-10 transition-colors ${headerBg} print:hidden`}>
        <button 
          onClick={onBack} 
          className={`p-2 rounded-full transition-colors ${isDarkMode ? 'hover:bg-gray-700 text-white' : 'hover:bg-gray-100 text-gray-800'}`}
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className={`text-xl font-bold ${textMain}`}>My Orders</h1>
      </div>

      {/* ORDERS LIST */}
      <div className="p-6 space-y-4 pb-24 print:hidden">
        {orders.length === 0 ? (
          <div className="text-center mt-20 flex flex-col items-center">
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 ${isDarkMode ? 'bg-gray-800 text-gray-600' : 'bg-gray-200 text-gray-400'}`}>
               <Package className="w-8 h-8" />
            </div>
            <p className="text-gray-400 font-medium">No orders placed yet.</p>
          </div>
        ) : (
          orders.map((order, index) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-5 rounded-3xl shadow-sm border transition-colors ${cardBg}`}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs font-bold text-gray-400">Order #{order.id}</span>
                <div className="flex items-center gap-2">
                   {order.status === 'Pending' && <Clock className="w-4 h-4 text-yellow-500" />}
                   {order.status === 'Approved' && <CheckCircle className="w-4 h-4 text-green-500" />}
                   {order.status === 'Rejected' && <XCircle className="w-4 h-4 text-red-500" />}
                   <span className={`text-xs font-bold ${
                     order.status === 'Approved' ? 'text-green-500' : 
                     order.status === 'Rejected' ? 'text-red-500' : 
                     'text-yellow-500'
                   }`}>
                     {order.status}
                   </span>
                </div>
              </div>

              <div className="space-y-2 mb-4">
                {order.items.map((item, i) => (
                   <div key={i} className={`flex justify-between text-sm ${itemText}`}>
                      <span>{item.name} <span className="text-xs opacity-50">x{item.quantity}</span></span>
                   </div>
                ))}
              </div>

              <div className={`flex justify-between items-center pt-3 border-t ${isDarkMode ? 'border-gray-700' : 'border-gray-100'}`}>
                <span className={`font-bold text-lg ${textMain}`}>{order.total}</span>
                {order.status === 'Approved' ? (
                  <button onClick={() => handleOpenReceipt(order)} className="flex items-center gap-2 px-4 py-2 bg-black text-white text-xs font-bold rounded-full hover:bg-glow-primary hover:text-black transition-colors shadow-md">
                    <Receipt className="w-3 h-3" /> Receipt
                  </button>
                ) : (
                  <span className="text-xs text-gray-400 italic">
                    {order.status === 'Rejected' ? 'Order Cancelled' : 'Waiting for approval...'}
                  </span>
                )}
              </div>
            </motion.div>
          ))
        )}
      </div>

      {/* --- RECEIPT MODAL --- */}
      <AnimatePresence>
        {selectedReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 print:bg-white print:p-0 print:static print:h-screen print:w-screen print:flex print:items-start print:justify-center">
            
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-white w-full max-w-sm rounded-t-xl overflow-hidden shadow-2xl relative print:shadow-none print:max-w-none print:w-[350px] print:rounded-none"
            >
              {/* Header */}
              <div className="bg-gray-900 text-white p-6 text-center relative print:bg-white print:text-black print:border-b print:border-black">
                {/* ADDED print:hidden to Close Button */}
                <button onClick={handleCloseReceipt} className="absolute top-4 right-4 p-1 hover:bg-gray-700 rounded-full print:hidden">
                  <X className="w-5 h-5" />
                </button>
                <h2 className="text-xl font-bold tracking-widest">GLOW EMPIRE</h2>
                <p className="text-xs text-gray-400 mt-1 print:text-gray-600">Official Receipt</p>
              </div>

              {/* Body */}
              <div className="p-8 bg-white text-gray-900">
                
                {/* Date & ID */}
                <div className="flex justify-between text-xs text-gray-500 mb-6 border-b border-dashed border-gray-300 pb-4">
                  <span>Date: {selectedReceipt.date}</span>
                  <span>Order #{selectedReceipt.id}</span>
                </div>

                {/* Customer Details */}
                <div className="mb-6 bg-gray-50 p-4 rounded-lg border border-gray-100 print:bg-white print:border-black print:border">
                   <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 print:text-black">Billed To</p>
                   <div className="space-y-1">
                      <div className="flex items-center gap-2 text-sm font-bold text-gray-800 print:text-black">
                         <User className="w-3 h-3 text-gray-400 print:hidden" /> {selectedReceipt.customer.name}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 print:text-black">
                         <Phone className="w-3 h-3 text-gray-400 print:hidden" /> {selectedReceipt.customer.phone}
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-600 print:text-black">
                         <MapPin className="w-3 h-3 text-gray-400 print:hidden" /> {selectedReceipt.customer.address}
                      </div>
                   </div>
                </div>

                {/* Items List */}
                <div className="space-y-3 mb-6">
                  {selectedReceipt.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between text-sm">
                      <span className="font-medium text-gray-800">{item.name} <span className="text-xs text-gray-400">x{item.quantity}</span></span>
                      <span className="font-bold">{item.price}</span>
                    </div>
                  ))}
                </div>

                {/* Total */}
                <div className="flex justify-between items-center pt-4 border-t-2 border-black">
                  <span className="font-bold text-lg">TOTAL</span>
                  <span className="font-bold text-xl">{selectedReceipt.total}</span>
                </div>

                {/* Barcode */}
                <div className="mt-8 flex flex-col items-center gap-2 opacity-50">
                  <div className="h-8 w-full bg-repeat-x" style={{ backgroundImage: 'linear-gradient(to right, black 0%, black 2%, transparent 2%, transparent 4%, black 4%, black 6%)', backgroundSize: '10px 100%' }}></div>
                  <span className="text-[10px] tracking-[0.2em]">{selectedReceipt.id} - APPROVED</span>
                </div>
              </div>

              {/* Jagged Edge (Hide on print for cleaner look, or keep it) */}
              <div className="w-full h-4 bg-white relative print:hidden" style={{ backgroundImage: 'linear-gradient(45deg, transparent 75%, #f3f4f6 75%), linear-gradient(-45deg, transparent 75%, #f3f4f6 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 10px' }}></div>
              
              <div className="bg-gray-100 p-4 print:hidden">
                 {/* ADDED print:hidden to Print Button */}
                 <button onClick={() => window.print()} className="w-full py-3 bg-black text-white rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-gray-800">
                    <Printer className="w-4 h-4" /> Print / Save PDF
                 </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}