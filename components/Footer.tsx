
import React from 'react';
import { Facebook, Instagram, Twitter, MapPin, Mail, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer = () => {
  return (
    <footer className="bg-white border-t border-gray-200 pt-16 pb-8 text-gray-600">
      <div className="max-w-7xl mx-auto px-4 md:px-6 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        
        {/* Brand Section */}
        <div className="space-y-4">
          <h3 className="text-2xl font-bold text-primary">RJ Foods</h3>
          <p className="text-sm leading-relaxed text-gray-500">
            Delivering the best cuisines to your doorstep with love and speed. Experience the taste of quality.
          </p>
          <div className="flex gap-4">
            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Facebook size={18} /></a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Instagram size={18} /></a>
            <a href="#" className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-primary hover:text-white transition-colors"><Twitter size={18} /></a>
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="font-bold text-darkGray mb-4">Quick Links</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            <li><Link to="/#menu" className="hover:text-primary transition-colors">Menu</Link></li>
            <li><Link to="/cart" className="hover:text-primary transition-colors">My Cart</Link></li>
            <li><Link to="/dashboard" className="hover:text-primary transition-colors">Order Tracking</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div>
          <h4 className="font-bold text-darkGray mb-4">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/pages/terms-conditions" className="hover:text-primary transition-colors">Terms & Conditions</Link></li>
            <li><Link to="/pages/privacy-policy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
            <li><Link to="/pages/refund-policy" className="hover:text-primary transition-colors">Refund Policy</Link></li>
            <li><Link to="/pages/cookie-policy" className="hover:text-primary transition-colors">Cookie Policy</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="font-bold text-darkGray mb-4">Contact Us</h4>
          <ul className="space-y-4 text-sm">
            <li className="flex items-start gap-3">
              <MapPin className="text-primary shrink-0" size={18} />
              <span>123 Food Street, Flavor Town, Lahore, Pakistan</span>
            </li>
            <li className="flex items-center gap-3">
              <Phone className="text-primary shrink-0" size={18} />
              <span>+92 300 1234567</span>
            </li>
            <li className="flex items-center gap-3">
              <Mail className="text-primary shrink-0" size={18} />
              <span>support@rjfoods.com</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-6 pt-8 border-t border-gray-100 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} RJ Foods. All rights reserved.</p>
      </div>
    </footer>
  );
};
