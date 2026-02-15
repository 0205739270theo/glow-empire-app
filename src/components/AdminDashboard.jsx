import React, { useState, useRef } from 'react';
import { ChevronLeft, CheckCircle, Clock, TrendingUp, Package, Phone, CreditCard, Banknote, ChevronDown, ChevronUp, MapPin, Plus, Tag, Image as ImageIcon, Truck, Upload, Star, Trash2, LogOut } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../supabaseClient'; 
import defaultPlaceholder from '../assets/products/Skincream.png'; 

export default function AdminDashboard({ onBack, orders, onUpdateStatus, isDarkMode, products = [], onAddProduct, onDeleteProduct }) {
  
  const [activeTab, setActiveTab] = useState('orders');
  const [showAll, setShowAll] = useState(false);
  const fileInputRef = useRef(null); 
  const [uploading, setUploading] = useState(false); // ⏳ TRACK UPLOAD STATUS

  // 🚪 LOGOUT LOGIC
  const handleLogout = async () => {
    await supabase.auth.signOut();
    onBack(); 
  };

  // INVENTORY FORM STATE
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '', category: 'Skincare', price: '', stock: '10', 
    description: '', image: null, // Now stores the FILE object
    preview: '', // Local preview URL
    shipping: '20', rating: '5.0' 
  });

  const totalRevenue = orders
    .filter(o => o.status === 'Approved')
    .reduce((sum, o) => sum + parseFloat(o.total.replace(/[^\d.]/g, '')), 0);

  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-50';
  const textMain = isDarkMode ? 'text-white' : 'text-gray-900';
  const cardBg = isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100';
  const inputBg = isDarkMode ? 'bg-gray-700 text-white border-gray-600' : 'bg-gray-50 text-black border-gray-200';

  const LIMIT = 2; 
  const displayOrders = showAll ? orders : orders.slice(0, LIMIT);

  // 📸 NEW: Handles File Selection & Preview
  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create a local preview so you see it instantly
      const previewUrl = URL.createObjectURL(file);
      setNewProduct({ ...newProduct, image: file, preview: previewUrl }); 
    }
  };

  // 💾 NEW: Uploads to Cloud then Saves to DB
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    if (!onAddProduct) return;
    
    setUploading(true); // Start loading spinner

    let finalImageUrl = defaultPlaceholder;

    // 1. 🌩️ UPLOAD TO SUPABASE STORAGE
    if (newProduct.image && typeof newProduct.image !== 'string') {
      const fileName = `${Date.now()}_${newProduct.image.name.replace(/\s/g, '_')}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, newProduct.image);

      if (error) {
        console.error("Upload Error:", error);
        alert("Failed to upload image!");
        setUploading(false);
        return;
      }

      // 2. 🔗 GET PUBLIC URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);
        
      finalImageUrl = publicUrl;
    }

    // 3. 💾 SAVE TO DATABASE
    await onAddProduct({ 
        ...newProduct, 
        image: finalImageUrl, // Use the real cloud link
        id: Date.now(), 
        price: `₵${newProduct.price}` 
    });

    setUploading(false); // Stop loading
    setIsAdding(false);
    // Reset form
    setNewProduct({ name: '', category: 'Skincare', price: '', stock: '10', description: '', image: null, preview: '', shipping: '20', rating: '5.0' });
  };

  return (
    <div className={`min-h-screen w-full relative pb-20 transition-colors duration-300 ${bgMain}`}>
      
      {/* HEADER */}
      <div className={`p-6 pb-8 rounded-b-[40px] shadow-lg relative overflow-hidden ${isDarkMode ? 'bg-gray-800' : 'bg-black'}`}>
        <div className="absolute top-0 right-0 w-64 h-64 bg-glow-primary rounded-full mix-blend-overlay filter blur-3xl opacity-20 -mr-16 -mt-16"></div>

        <div className="flex items-center gap-4 mb-6 relative z-10">
          <button onClick={onBack} className="p-2 bg-white/10 rounded-full text-white hover:bg-white/20 backdrop-blur-md">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div className="flex-1">
             <h1 className="text-xl font-bold text-white">CEO Dashboard</h1>
             <p className="text-xs text-white/50">Welcome back, Boss</p>
          </div>
          
          <button onClick={handleLogout} className="p-2 bg-red-500/20 rounded-full text-red-400 hover:bg-red-500 hover:text-white transition-all border border-red-500/30 backdrop-blur-md">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
        
        {/* REVENUE */}
        <div className="relative z-10 flex justify-between items-end">
          <div>
            <p className="text-white/60 text-sm font-medium mb-1">Total Revenue</p>
            <h2 className="text-4xl font-bold text-white">₵{totalRevenue.toFixed(2)}</h2>
          </div>
          <div className="flex bg-white/10 p-1 rounded-xl backdrop-blur-md">
             <button onClick={() => setActiveTab('orders')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'orders' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/10'}`}>Orders</button>
             <button onClick={() => setActiveTab('inventory')} className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${activeTab === 'inventory' ? 'bg-white text-black shadow-lg' : 'text-white hover:bg-white/10'}`}>Stock</button>
          </div>
        </div>
      </div>

      {/* --- TAB: ORDERS --- */}
      {activeTab === 'orders' && (
        <>
          <div className="px-6 mt-6 flex justify-between items-end">
            <h3 className={`text-lg font-bold ${textMain}`}>Incoming Orders</h3>
            {orders.length > LIMIT && (
              <button onClick={() => setShowAll(!showAll)} className="text-xs text-glow-primary font-bold flex items-center gap-1 hover:underline bg-yellow-500/10 px-3 py-1 rounded-full transition-colors">
                {showAll ? 'Show Less' : `View All (${orders.length})`} 
                {showAll ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            )}
          </div>

          <div className="px-6 space-y-4 mt-4">
            <AnimatePresence>
              {orders.length === 0 ? (
                <div className={`text-center mt-10 p-8 border-2 border-dashed rounded-3xl ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}><p className="text-gray-400">No orders yet, Boss.</p></div>
              ) : (
                displayOrders.map((order) => (
                  <motion.div key={order.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`${cardBg} p-5 rounded-3xl shadow-sm border transition-all`}>
                    
                    <div className="flex justify-between items-start mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-100 text-gray-900'}`}>
                          {order.customer.name.charAt(0)}
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${textMain}`}>{order.customer.name}</h3>
                          <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                             <MapPin className="w-3 h-3 text-glow-primary" /> {order.customer.address}
                          </div>
                          <a href={`tel:${order.customer.phone}`} className="flex items-center gap-1 text-xs text-blue-400 hover:text-blue-300 font-medium">
                             <Phone className="w-3 h-3" /> {order.customer.phone}
                          </a>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold ${order.status === 'Approved' ? 'bg-green-100 text-green-600' : order.status === 'Rejected' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-600'}`}>{order.status}</span>
                    </div>

                    <div className={`p-3 rounded-xl mb-4 space-y-2 ${isDarkMode ? 'bg-gray-900/50' : 'bg-gray-50'}`}>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between text-xs text-gray-500">
                          <span>{item.name} x{item.quantity}</span>
                          <span className="font-medium">{item.price}</span>
                        </div>
                      ))}
                      <div className={`border-t mt-2 pt-2 flex justify-between font-bold text-sm ${isDarkMode ? 'border-gray-700 text-white' : 'border-gray-200 text-gray-900'}`}>
                        <span>Total</span><span>{order.total}</span>
                      </div>
                      <div className="mt-2 pt-1 flex items-center gap-2 text-[10px] font-bold text-gray-500">
                        <span>Payment:</span>
                        {order.paymentType === 'full' ? (
                           <span className="px-2 py-0.5 rounded bg-green-500/20 text-green-600 flex items-center gap-1 border border-green-500/30"><CheckCircle className="w-3 h-3" /> Paid Full</span>
                        ) : order.paymentType === 'delivery' ? (
                           <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 flex items-center gap-1 border border-blue-500/30"><Truck className="w-3 h-3" /> COD (Paid 20)</span>
                        ) : (
                           <span className="px-2 py-0.5 rounded bg-yellow-400/20 text-yellow-600 flex items-center gap-1 border border-yellow-400/30"><Clock className="w-3 h-3" /> Pending</span>
                        )}
                      </div>
                    </div>

                    {order.status === 'Pending' && (
                      <div className="flex gap-3">
                        <button onClick={() => onUpdateStatus(order.id, 'Rejected')} className="flex-1 py-3 rounded-xl border border-red-500/30 text-red-500 font-bold text-xs hover:bg-red-500/10">Reject</button>
                        <button onClick={() => onUpdateStatus(order.id, 'Approved')} className="flex-1 py-3 rounded-xl bg-green-500 text-white font-bold text-xs hover:bg-green-600 flex items-center justify-center gap-2 shadow-lg"><CheckCircle className="w-4 h-4" /> Approve</button>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </AnimatePresence>
          </div>
        </>
      )}

      {/* --- TAB: INVENTORY --- */}
      {activeTab === 'inventory' && (
        <div className="p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className={`text-lg font-bold ${textMain}`}>Current Stock</h3>
              <button onClick={() => setIsAdding(true)} className="bg-glow-primary text-black px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 shadow-lg hover:scale-105 transition-transform">
                 <Plus className="w-4 h-4" /> Add Item
              </button>
           </div>
           
           <div className="grid grid-cols-2 gap-4">
              {products.map((product) => (
                 <div key={product.id} className={`p-4 rounded-3xl border ${cardBg} relative group`}>
                    <img src={product.image} alt={product.name} className="w-full h-24 object-cover rounded-xl mb-3" />
                    
                    {/* STOCK BADGE */}
                    <span className="absolute top-3 right-3 bg-black/70 text-white px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm">
                       {product.stock} left
                    </span>

                    {/* RATING BADGE */}
                    <span className="absolute top-3 left-3 bg-yellow-400/90 text-black px-2 py-1 rounded-full text-[10px] font-bold backdrop-blur-sm flex items-center gap-1">
                       <Star className="w-3 h-3 fill-black" /> {product.rating || '4.5'}
                    </span>

                    {/* DELETE BUTTON */}
                    <button 
                       onClick={() => {
                          if(window.confirm('Are you sure you want to delete this item?')) {
                             onDeleteProduct(product.id);
                          }
                       }}
                       className="absolute bottom-3 right-3 p-2 bg-red-500/10 text-red-500 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                    >
                       <Trash2 className="w-4 h-4" />
                    </button>

                    <h4 className={`font-bold text-sm mb-1 truncate ${textMain}`}>{product.name}</h4>
                    <p className="text-xs text-gray-400 mb-2">{product.category}</p>
                    <p className="text-glow-primary font-bold text-sm">{product.price}</p>
                 </div>
              ))}
           </div>
        </div>
      )}

      {/* --- ADD PRODUCT MODAL --- */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-sm overflow-y-auto">
             <motion.div initial={{ y: '100%' }} animate={{ y: 0 }} className={`w-full max-w-md ${isDarkMode ? 'bg-gray-900' : 'bg-white'} rounded-t-[40px] p-8 m-auto`}>
                <h2 className={`text-xl font-bold mb-6 ${textMain}`}>Add New Stock</h2>
                <form onSubmit={handleSaveProduct} className="space-y-4">
                   
                   {/* Product Name */}
                   <div>
                      <label className="text-xs font-bold text-gray-500 ml-2">Product Name</label>
                      <input required type="text" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className={`w-full p-4 rounded-xl border outline-none ${inputBg}`} placeholder="e.g. Luxury Face Cream" />
                   </div>

                   {/* UPLOAD IMAGE */}
                   <div>
                      <label className="text-xs font-bold text-gray-500 ml-2">Product Image</label>
                      <input type="file" ref={fileInputRef} accept="image/*" onChange={handleImageSelect} className="hidden" />
                      <div onClick={() => fileInputRef.current.click()} className={`w-full h-32 rounded-xl border-2 border-dashed flex items-center justify-center cursor-pointer overflow-hidden relative transition-all ${isDarkMode ? 'border-gray-600 hover:border-glow-primary hover:bg-gray-800' : 'border-gray-300 hover:border-black hover:bg-gray-50'}`}>
                         {newProduct.preview ? (
                           <>
                             <img src={newProduct.preview} alt="Preview" className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"><span className="text-white text-xs font-bold">Change Image</span></div>
                           </>
                         ) : (
                           <div className="flex flex-col items-center gap-2 text-gray-400"><Upload className="w-6 h-6" /><span className="text-xs">Click to Upload Photo</span></div>
                         )}
                      </div>
                   </div>

                   {/* Price & Stock */}
                   <div className="flex gap-4">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 ml-2">Price (₵)</label>
                        <input required type="number" value={newProduct.price} onChange={e => setNewProduct({...newProduct, price: e.target.value})} className={`w-full p-4 rounded-xl border outline-none ${inputBg}`} placeholder="150" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 ml-2">Stock Qty</label>
                        <input required type="number" value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} className={`w-full p-4 rounded-xl border outline-none ${inputBg}`} placeholder="10" />
                      </div>
                   </div>

                   {/* Shipping & Category & Rating */}
                   <div className="flex gap-3">
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 ml-2">Shipping</label>
                        <input type="number" value={newProduct.shipping} onChange={e => setNewProduct({...newProduct, shipping: e.target.value})} className={`w-full p-4 rounded-xl border outline-none ${inputBg}`} placeholder="20" />
                      </div>
                      <div className="flex-1">
                        <label className="text-xs font-bold text-gray-500 ml-2">Rating</label>
                        <div className={`flex items-center w-full p-4 rounded-xl border ${inputBg}`}>
                           <Star className="w-4 h-4 mr-2 text-yellow-400 fill-yellow-400" />
                           <input type="number" step="0.1" max="5" value={newProduct.rating} onChange={e => setNewProduct({...newProduct, rating: e.target.value})} className="bg-transparent outline-none w-full" placeholder="5.0" />
                        </div>
                      </div>
                   </div>

                   <div>
                      <label className="text-xs font-bold text-gray-500 ml-2">Category</label>
                      <select value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})} className={`w-full p-4 rounded-xl border outline-none ${inputBg} h-[58px]`}>
                           <option>Skincare</option>
                           <option>Makeup</option>
                           <option>Hair</option>
                           <option>Perfume</option>
                           <option>Eye</option>
                           <option>Accessories</option>
                      </select>
                   </div>
                   
                   {/* Description */}
                   <div>
                      <label className="text-xs font-bold text-gray-500 ml-2">Description</label>
                      <textarea required value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} className={`w-full p-4 rounded-xl border outline-none ${inputBg}`} placeholder="Describe the item..." rows={3} />
                   </div>

                   {/* Buttons */}
                   <div className="flex gap-3 pt-4">
                      <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-4 font-bold text-gray-500 bg-gray-100 rounded-2xl hover:bg-gray-200 text-sm">Cancel</button>
                      
                      <button disabled={uploading} type="submit" className="flex-1 py-4 font-bold text-black bg-glow-primary rounded-2xl hover:scale-105 transition-transform shadow-lg text-sm flex justify-center items-center gap-2">
                        {uploading ? 'Uploading...' : 'Save Item'}
                      </button>
                   </div>

                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}