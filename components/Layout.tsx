
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu as MenuIcon, X, ShieldCheck, Heart, Home as HomeIcon, Utensils, ChevronDown, Settings } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { auth } from '../firebase';
import { Footer } from './Footer';
import { motion, AnimatePresence } from 'framer-motion';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin, userProfile } = useAuth();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await auth.signOut();
    navigate('/login');
  };

  const NavLink = ({ to, icon: Icon, label, onClick }: any) => {
    const isActive = location.pathname === to;
    return (
      <Link
        to={to}
        onClick={onClick}
        className={`flex items-center gap-2 px-6 py-3 rounded-2xl transition-all duration-300 ${isActive 
          ? 'bg-primary text-white shadow-xl shadow-primary/20 font-bold scale-105' 
          : 'text-gray-500 hover:text-primary hover:bg-primaryLight font-medium'}`}
      >
        <Icon size={20} />
        <span className="tracking-tight">{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-[#fbfbfb]">
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-2xl border-b border-gray-50 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-primary rounded-[1.2rem] flex items-center justify-center text-white shadow-2xl shadow-primary/30 group-hover:rotate-12 transition-all duration-500">
               <span className="text-2xl font-black">F</span>
            </div>
            <span className="text-2xl font-black text-darkGray tracking-tighter group-hover:text-primary transition-colors">Foodie<span className="text-primary">Flow</span></span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-4 bg-gray-50 p-1.5 rounded-[2rem] border border-gray-100">
            <NavLink to="/" icon={HomeIcon} label="Home" />
            <NavLink to="/menu" icon={Utensils} label="Menu" />
          </div>

          <div className="flex items-center gap-3">
            <Link to="/wishlist" className="relative p-3 text-gray-400 hover:text-primary transition-all bg-white rounded-2xl shadow-sm hover:shadow-md">
              <Heart size={22} className={location.pathname === '/wishlist' ? 'text-primary fill-primary' : ''} />
              {wishlistCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                  {wishlistCount}
                </span>
              )}
            </Link>

            <Link to="/cart" className="relative p-3 bg-white rounded-2xl text-gray-600 hover:text-primary transition-all shadow-sm hover:shadow-md">
              <ShoppingBag size={22} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] font-black w-5 h-5 flex items-center justify-center rounded-full border-2 border-white shadow-lg">
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <div className="relative ml-2" ref={dropdownRef}>
                 <button 
                   onClick={() => setIsProfileOpen(!isProfileOpen)}
                   className="flex items-center gap-2 p-1.5 pr-4 bg-white border border-gray-100 rounded-[1.5rem] hover:shadow-xl transition-all group"
                 >
                    <div className="w-10 h-10 bg-primaryLight text-primary rounded-xl flex items-center justify-center font-black text-lg overflow-hidden border-2 border-white group-hover:scale-110 transition-transform">
                       {currentUser.photoURL ? <img src={currentUser.photoURL} alt="" /> : userProfile?.name?.charAt(0) || <User size={20} />}
                    </div>
                    <div className="hidden lg:block text-left">
                       <p className="text-xs font-black text-darkGray leading-none">{userProfile?.name?.split(' ')[0]}</p>
                       <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">My Account</p>
                    </div>
                    <ChevronDown size={14} className={`text-gray-400 transition-transform duration-300 ${isProfileOpen ? 'rotate-180' : ''}`} />
                 </button>

                 <AnimatePresence>
                    {isProfileOpen && (
                       <motion.div 
                         initial={{ opacity: 0, y: 10, scale: 0.95 }}
                         animate={{ opacity: 1, y: 0, scale: 1 }}
                         exit={{ opacity: 0, y: 10, scale: 0.95 }}
                         className="absolute right-0 mt-4 w-64 bg-white rounded-[2rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-gray-50 overflow-hidden py-3"
                       >
                          <div className="px-6 py-4 border-b border-gray-50 mb-2">
                             <p className="font-black text-darkGray">{userProfile?.name}</p>
                             <p className="text-xs text-gray-400 font-medium truncate">{userProfile?.email}</p>
                          </div>
                          
                          <Link to="/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:text-primary hover:bg-primaryLight transition-all font-bold text-sm">
                             <LayoutDashboard size={18} /> My Orders
                          </Link>
                          
                          {isAdmin && (
                            <Link to="/admin/dashboard" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 text-primary bg-primaryLight/30 hover:bg-primaryLight transition-all font-black text-sm">
                               <ShieldCheck size={18} /> Admin Dashboard
                            </Link>
                          )}
                          
                          <Link to="/profile" onClick={() => setIsProfileOpen(false)} className="flex items-center gap-3 px-6 py-3 text-gray-600 hover:text-primary hover:bg-primaryLight transition-all font-bold text-sm">
                             <Settings size={18} /> Account Settings
                          </Link>
                          
                          <div className="mx-6 my-2 border-t border-gray-50"></div>
                          
                          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-6 py-3 text-red-500 hover:bg-red-50 transition-all font-black text-sm">
                             <LogOut size={18} /> Sign Out
                          </button>
                       </motion.div>
                    )}
                 </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="hidden md:block bg-darkGray text-white px-10 py-3.5 rounded-[1.5rem] text-sm font-black hover:bg-primary transition-all shadow-xl shadow-gray-200 hover:shadow-primary/30">
                Login
              </Link>
            )}

            <button className="md:hidden p-3 bg-white rounded-2xl shadow-sm text-gray-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <MenuIcon />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-gray-50 overflow-hidden shadow-2xl"
          >
            <div className="p-8 flex flex-col gap-4">
              <NavLink to="/" icon={HomeIcon} label="Home" onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink to="/menu" icon={Utensils} label="Menu" onClick={() => setIsMobileMenuOpen(false)} />
              <NavLink to="/wishlist" icon={Heart} label="Wishlist" onClick={() => setIsMobileMenuOpen(false)} />
              
              {currentUser && (
                <>
                  <div className="h-px bg-gray-50 my-2"></div>
                  <NavLink to="/dashboard" icon={LayoutDashboard} label="My Orders" onClick={() => setIsMobileMenuOpen(false)} />
                  {isAdmin && <NavLink to="/admin/dashboard" icon={ShieldCheck} label="Admin Panel" onClick={() => setIsMobileMenuOpen(false)} />}
                </>
              )}
              
              <div className="mt-4">
                {currentUser ? (
                  <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 py-5 text-red-500 font-black bg-red-50 rounded-[2rem] shadow-sm">
                    <LogOut size={20} /> Logout Account
                  </button>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="block bg-primary text-white py-5 rounded-[2rem] text-center font-black shadow-xl shadow-primary/20">Login Now</Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="flex-grow">
        <div className="max-w-7xl mx-auto w-full p-6 md:p-10">
          {children}
        </div>
      </main>

      <Footer />
    </div>
  );
};