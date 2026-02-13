import React, { useState, useEffect } from 'react'; 
import { Plus, MessageCircle, ShoppingBag, Package } from 'lucide-react'; 
import { motion, AnimatePresence } from 'framer-motion'; 

import WelcomeScreen from './components/WelcomeScreen';
import ShopHome from './components/ShopHome';
import ProductDetails from './components/ProductDetails';
import CartScreen from './components/CartScreen';
import CheckoutForm from './components/CheckoutForm';
import ChatScreen from './components/ChatScreen';
import AdminDashboard from './components/AdminDashboard';
import OrdersScreen from './components/OrdersScreen';
import Sidebar from './components/Sidebar';
import FavoritesScreen from './components/FavoritesScreen';

function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // --- 1. INITIALIZE STATE FROM LOCAL STORAGE ---
  const [cartItems, setCartItems] = useState(() => {
    const saved = localStorage.getItem('glow_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [allOrders, setAllOrders] = useState(() => {
    const saved = localStorage.getItem('glow_orders');
    return saved ? JSON.parse(saved) : [];
  });

  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('glow_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('glow_theme');
    return saved ? JSON.parse(saved) : false;
  });

  // --- NEW: PRODUCT MANAGEMENT STATE ---
  const [products, setProducts] = useState(() => {
    const saved = localStorage.getItem('glow_products');
    if (saved) return JSON.parse(saved);
    
    // Default Initial Products
    return [
      { id: 1, name: "Coconut Face Cream", price: "₵85.00", image: "https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=500", category: "Skincare", stock: 12, description: "Hydrating cream for smooth skin." },
      { id: 2, name: "Gold Hair Serum", price: "₵120.00", image: "https://images.unsplash.com/photo-1608248597279-f99d160bfbc8?w=500", category: "Hair", stock: 8, description: "Luxury serum for shiny hair." },
      { id: 3, name: "Matte Lipstick Set", price: "₵150.00", image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=500", category: "Makeup", stock: 20, description: "Long-lasting matte finish." },
      { id: 4, name: "Pearl Necklace", price: "₵200.00", image: "https://images.unsplash.com/photo-1599643478518-17488fbbcd75?w=500", category: "Accessories", stock: 5, description: "Elegant pearls for any occasion." },
    ];
  });

  // --- 2. SAVE DATA AUTOMATICALLY ---
  useEffect(() => { localStorage.setItem('glow_cart', JSON.stringify(cartItems)); }, [cartItems]);
  useEffect(() => { localStorage.setItem('glow_orders', JSON.stringify(allOrders)); }, [allOrders]);
  useEffect(() => { localStorage.setItem('glow_favorites', JSON.stringify(favorites)); }, [favorites]);
  useEffect(() => { localStorage.setItem('glow_theme', JSON.stringify(isDarkMode)); }, [isDarkMode]);
  useEffect(() => { localStorage.setItem('glow_products', JSON.stringify(products)); }, [products]); // Save Products!

  // --- ACTIONS ---
  const addToCart = (product, quantity) => {
    setCartItems(prevItems => {
      const existingItem = prevItems.find(item => item.id === product.id);
      if (existingItem) {
        return prevItems.map(item => item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item);
      } else {
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  const toggleFavorite = (product) => {
    setFavorites(prev => {
      const exists = prev.find(item => item.id === product.id);
      if (exists) {
        return prev.filter(item => item.id !== product.id);
      } else {
        return [...prev, product];
      }
    });
  };

  const handlePlaceOrder = (newOrder) => {
    setAllOrders(prev => [newOrder, ...prev]);
    setCartItems([]);
    // Removed timeout to allow user to choose navigation
  };

  const handleUpdateStatus = (orderId, newStatus) => {
    setAllOrders(prev => prev.map(order => order.id === orderId ? { ...order, status: newStatus } : order));
  };

  // --- NEW: ADD PRODUCT FUNCTION ---
  const handleAddProduct = (newProduct) => {
    setProducts(prev => [newProduct, ...prev]);
  };

  const getCartTotal = () => {
    const total = cartItems.reduce((sum, item) => {
      let priceNumber = typeof item.price === 'string' ? parseFloat(item.price.replace(/[^\d.]/g, '')) : item.price;
      return sum + (priceNumber * item.quantity);
    }, 0);
    return total > 0 ? total + 20 : 0;
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    setIsMenuOpen(false);
  };

  return (
    <div className={`w-full min-h-screen overflow-hidden relative transition-colors duration-300 ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-900'}`}>
      
      <Sidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)}
        onNavigate={setCurrentScreen}
        isDarkMode={isDarkMode}
        onToggleTheme={() => setIsDarkMode(!isDarkMode)}
      />

      {/* --- SCREENS --- */}

      {currentScreen === 'welcome' && (
        <div className="relative">
          <div onClick={() => setCurrentScreen('shop')}> 
            <WelcomeScreen isDarkMode={isDarkMode} /> 
          </div>
          <button onClick={(e) => { e.stopPropagation(); setCurrentScreen('admin'); }} className="absolute bottom-4 right-4 text-xs text-gray-300 hover:text-gray-500 z-50 p-2">Admin Login</button>
        </div>
      )}

      {currentScreen === 'shop' && (
        <ShopHome 
          onProductClick={(product) => { setSelectedProduct(product); setCurrentScreen('details'); }}
          onCartClick={() => setCurrentScreen('cart')}
          cartCount={cartItems.length}
          onAddToCart={addToCart}
          onChatClick={() => setCurrentScreen('chat')}
          onMenuClick={() => setIsSidebarOpen(true)}
          isDarkMode={isDarkMode}
          favorites={favorites} 
          onToggleFavorite={toggleFavorite}
          // PASS DYNAMIC PRODUCTS
          products={products} 
        />
      )}

      {currentScreen === 'details' && selectedProduct && (
        <ProductDetails 
          product={selectedProduct} 
          onBack={() => setCurrentScreen('shop')} 
          onAddToCart={addToCart} 
          isFavorite={favorites.some(item => item.id === selectedProduct.id)}
          onToggleFavorite={() => toggleFavorite(selectedProduct)}
          isDarkMode={isDarkMode}
        />
      )}

      {currentScreen === 'cart' && (
        <CartScreen 
          onBack={() => setCurrentScreen('shop')} 
          cartItems={cartItems} 
          setCartItems={setCartItems} 
          onCheckout={() => setCurrentScreen('checkout')} 
          isDarkMode={isDarkMode} 
        />
      )}

      {currentScreen === 'favorites' && (
        <FavoritesScreen 
          onBack={() => setCurrentScreen('shop')} 
          favorites={favorites} 
          onToggleFavorite={toggleFavorite}
          onAddToCart={addToCart}
          isDarkMode={isDarkMode}
        />
      )}

      {currentScreen === 'checkout' && (
        <CheckoutForm 
          onBack={() => setCurrentScreen('shop')} 
          cartItems={cartItems} 
          total={`₵${getCartTotal().toFixed(2)}`} 
          onPlaceOrder={handlePlaceOrder} 
          isDarkMode={isDarkMode}
          onGoToChat={() => setCurrentScreen('chat')}
        />
      )}

      {currentScreen === 'chat' && (
        <ChatScreen 
          onBack={() => setCurrentScreen('shop')} 
          isDarkMode={isDarkMode} 
        />
      )}

      {currentScreen === 'orders' && (
        <OrdersScreen 
          onBack={() => setCurrentScreen('shop')} 
          orders={allOrders} 
          isDarkMode={isDarkMode} 
        /> 
      )}

      {currentScreen === 'admin' && (
        <AdminDashboard 
          onBack={() => setCurrentScreen('shop')} 
          orders={allOrders} 
          onUpdateStatus={handleUpdateStatus} 
          isDarkMode={isDarkMode} 
          // PASS PRODUCTS & HANDLER
          products={products}
          onAddProduct={handleAddProduct}
        />
      )}

      {/* --- FAB (Floating Action Button) --- */}
      {currentScreen !== 'welcome' && currentScreen !== 'admin' && (
        <div className="fixed bottom-8 right-8 z-[100] flex flex-col items-end gap-4 print:hidden">
          <AnimatePresence>
            {isMenuOpen && (
              <>
                <motion.button initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} transition={{ delay: 0.1, type: "spring", stiffness: 300 }} onClick={() => navigateTo('favorites')} className="flex items-center gap-3 group">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-900'}`}>Wishlist</span>
                  <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-black group-hover:bg-gray-50 border border-gray-100">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5 4.5-2 4.5-2-2 0-3.5 1-4.5 2.5-1-1-2.5-1-4.5 1-4.5 2.5 0 0 0 5.5 5.5c2.5 0 5 2 5.5 5.5 0 0 0 3-1 3-5.5z"></path></svg>
                  </div>
                </motion.button>

                <motion.button initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} transition={{ delay: 0.05, type: "spring", stiffness: 300 }} onClick={() => navigateTo('orders')} className="flex items-center gap-3 group">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-900'}`}>Track Order</span>
                  <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-black group-hover:bg-gray-50 border border-gray-100">
                      <Package className="w-5 h-5" />
                  </div>
                </motion.button>

                <motion.button initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.8 }} transition={{ type: "spring", stiffness: 300 }} onClick={() => navigateTo('chat')} className="flex items-center gap-3 group">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm backdrop-blur-md ${isDarkMode ? 'bg-gray-800/90 text-white' : 'bg-white/90 text-gray-900'}`}>Support</span>
                  <div className="w-12 h-12 bg-white rounded-full shadow-xl flex items-center justify-center text-black group-hover:bg-gray-50 border border-gray-100">
                      <MessageCircle className="w-5 h-5" />
                  </div>
                </motion.button>
              </>
            )}
          </AnimatePresence>

          <div className="relative flex items-center justify-center">
            {!isMenuOpen && (
              <motion.div animate={{ scale: [1, 1.3, 1], opacity: [0.3, 0, 0.3] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} className="absolute inset-0 bg-yellow-400 rounded-full blur-md" />
            )}
            <motion.button whileHover={{ scale: 1.1, boxShadow: "0px 0px 20px rgba(255, 200, 0, 0.6)" }} whileTap={{ scale: 0.9 }} onClick={() => setIsMenuOpen(!isMenuOpen)} className={`relative z-10 w-16 h-16 rounded-full shadow-2xl flex items-center justify-center transition-all duration-300 ${ isMenuOpen ? 'bg-black text-white rotate-0' : 'bg-glow-primary text-black' }`}>
              <motion.div animate={{ rotate: isMenuOpen ? 135 : 0 }} transition={{ type: "spring", stiffness: 200, damping: 15 }}>
                <Plus className="w-8 h-8" strokeWidth={2.5} />
              </motion.div>
            </motion.button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;