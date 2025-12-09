import React, { useState } from 'react';
import { Loader2, X, UtensilsCrossed } from 'lucide-react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', className = '', isLoading, disabled, ...props 
}) => {
  const baseStyle = "px-6 py-2.5 rounded-full font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-primary text-white shadow-lg shadow-primary/30",
    secondary: "bg-white text-darkGray border border-gray-200 shadow-sm",
    outline: "border-2 border-primary text-primary",
    danger: "bg-red-500 text-white shadow-lg shadow-red-500/30"
  };

  return (
    <motion.button 
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.95 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      className={`${baseStyle} ${variants[variant]} ${className}`}
      disabled={isLoading || disabled}
      {...props as any}
    >
      {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </motion.button>
  );
};

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export const Input: React.FC<InputProps> = ({ label, className = '', ...props }) => (
  <div className="w-full">
    {label && <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">{label}</label>}
    <input 
      className={`w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/80 backdrop-blur-sm ${className}`}
      {...props}
    />
  </div>
);

export const Card: React.FC<{ children: React.ReactNode, className?: string, onClick?: () => void }> = ({ children, className = '', onClick }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-white rounded-3xl shadow-xl shadow-gray-200/50 p-6 ${className}`}
    onClick={onClick}
  >
    {children}
  </motion.div>
);

export const Badge: React.FC<{ children: React.ReactNode, color?: string }> = ({ children, color = "bg-primary" }) => (
  <span className={`${color} text-white text-xs font-bold px-2 py-1 rounded-md`}>
    {children}
  </span>
);

export const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-softGray">
    <motion.div
      animate={{ 
        scale: [1, 1.2, 1],
        rotate: [0, 0, 360]
      }}
      transition={{ 
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.5, 1],
        repeat: Infinity
      }}
    >
      <Loader2 className="w-12 h-12 text-primary" />
    </motion.div>
  </div>
);

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-3xl shadow-2xl w-full max-w-md overflow-hidden"
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h3 className="text-xl font-bold text-darkGray">{title}</h3>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        <div className="p-6">
          {children}
        </div>
      </motion.div>
    </div>
  );
};

export const ImageWithFallback: React.FC<React.ImgHTMLAttributes<HTMLImageElement>> = ({ src, alt, className, ...props }) => {
  const [error, setError] = useState(false);

  if (error || !src) {
    return (
      <div className={`bg-gray-100 flex items-center justify-center text-gray-400 ${className}`}>
        <UtensilsCrossed size={24} className="opacity-50" />
      </div>
    );
  }

  return (
    <motion.img 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      src={src} 
      alt={alt} 
      onError={() => setError(true)} 
      className={className} 
      {...props as any} 
    />
  );
};