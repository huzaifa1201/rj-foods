import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingBag, User, LogOut, LayoutDashboard, Menu, X, UtensilsCrossed } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { auth } from '../firebase';
import { Footer } from './Footer';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentUser, isAdmin } = useAuth();
  const { cartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

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
        className={`flex items-center gap-2 px-4 py-2 rounded-full transition-colors ${isActive ? 'bg-primaryLight text-primary font-semibold' : 'text-gray-600 hover:text-primary'}`}
      >
        <Icon size={18} />
        <span>{label}</span>
      </Link>
    );
  };

  return (
    <div className="min-h-screen flex flex-col font-sans">
      <nav className="sticky top-0 z-50 glass border-b border-white/20 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/40">
              <UtensilsCrossed size={24} />
            </div>
            <span className="text-xl font-bold text-primary">RJ Foods</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <NavLink to="/" icon={UtensilsCrossed} label="Menu" />
            {currentUser && (
              <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" />
            )}
            {isAdmin && (
              <NavLink to="/admin/dashboard" icon={User} label="Admin" />
            )}
          </div>

          <div className="flex items-center gap-4">
            <Link to="/cart" className="relative p-2 text-gray-600 hover:text-primary transition-colors">
              <ShoppingBag size={24} />
              {cartCount > 0 && (
                <span
                  className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full"
                >
                  {cartCount}
                </span>
              )}
            </Link>

            {currentUser ? (
              <button onClick={handleLogout} className="hidden md:flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-red-500 transition-colors">
                <LogOut size={18} />
                Logout
              </button>
            ) : (
              <Link to="/login" className="hidden md:block bg-primary text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-primaryDark transition-all shadow-md hover:shadow-lg">
                Login
              </Link>
            )}

            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden bg-white border-b border-gray-100 overflow-hidden"
        >
          <div className="p-4 flex flex-col gap-4">
            <NavLink to="/" icon={UtensilsCrossed} label="Menu" onClick={() => setIsMobileMenuOpen(false)} />
            {currentUser && <NavLink to="/dashboard" icon={LayoutDashboard} label="Dashboard" onClick={() => setIsMobileMenuOpen(false)} />}
            {isAdmin && <NavLink to="/admin/dashboard" icon={User} label="Admin" onClick={() => setIsMobileMenuOpen(false)} />}
            {currentUser ? (
              <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-red-500">
                <LogOut size={18} /> Logout
              </button>
            ) : (
              <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="bg-primary text-white px-4 py-2 rounded-lg text-center">Login</Link>
            )}
          </div>
        </div>
      )}

      <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-6">
        {children}
      </main>

      <Footer />
    </div>
  );
};