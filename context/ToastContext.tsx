import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  }, []);

  const removeToast = (id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-3 pointer-events-none">
        {toasts.map(toast => (
          <div 
            key={toast.id}
            className={`
              pointer-events-auto flex items-center gap-3 px-5 py-4 rounded-xl shadow-2xl shadow-black/10 min-w-[300px] max-w-sm animate-in slide-in-from-right duration-300
              ${toast.type === 'success' ? 'bg-white border-l-4 border-green-500 text-darkGray' : ''}
              ${toast.type === 'error' ? 'bg-white border-l-4 border-red-500 text-darkGray' : ''}
              ${toast.type === 'info' ? 'bg-white border-l-4 border-blue-500 text-darkGray' : ''}
            `}
          >
            {toast.type === 'success' && <CheckCircle className="text-green-500 shrink-0" size={24} />}
            {toast.type === 'error' && <AlertCircle className="text-red-500 shrink-0" size={24} />}
            {toast.type === 'info' && <Info className="text-blue-500 shrink-0" size={24} />}
            
            <p className="text-sm font-semibold flex-grow">{toast.message}</p>
            
            <button onClick={() => removeToast(toast.id)} className="text-gray-400 hover:text-gray-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within a ToastProvider');
  return context;
};