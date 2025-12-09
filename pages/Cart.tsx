import React from 'react';
import { useCart } from '../context/CartContext';
import { Button, Card, ImageWithFallback } from '../components/UI';
import { Minus, Plus, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export const Cart = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-400">
          <ShoppingBag size={48} />
        </div>
        <h2 className="text-2xl font-bold text-darkGray mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <Link to="/">
          <Button>Browse Menu</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold text-darkGray">Shopping Cart</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="md:col-span-2 space-y-4">
          {cart.map((item) => (
            <div key={item.id}>
              <Card className="flex gap-4 p-4 items-center">
                <ImageWithFallback 
                  src={item.imageUrl} 
                  alt={item.name} 
                  className="w-24 h-24 rounded-xl object-cover" 
                />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-bold text-lg">{item.name}</h3>
                    <p className="font-bold text-primary">PKR {item.price * item.quantity}</p>
                  </div>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-1">{item.description}</p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                      <button onClick={() => updateQuantity(item.id, -1)} className="p-1 hover:bg-white rounded-md transition-colors"><Minus size={16} /></button>
                      <span className="font-bold w-6 text-center text-sm">{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.id, 1)} className="p-1 hover:bg-white rounded-md transition-colors"><Plus size={16} /></button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              </Card>
            </div>
          ))}
          <div className="flex justify-end">
            <button onClick={clearCart} className="text-sm text-red-500 hover:underline">Clear Cart</button>
          </div>
        </div>

        {/* Summary */}
        <div className="md:col-span-1">
          <Card className="sticky top-24">
            <h3 className="font-bold text-lg mb-4">Order Summary</h3>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>PKR {cartTotal}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span>PKR 0</span>
              </div>
              <div className="border-t border-gray-100 pt-3 flex justify-between font-bold text-lg text-darkGray">
                <span>Total</span>
                <span>PKR {cartTotal}</span>
              </div>
            </div>
            <Button onClick={() => navigate('/checkout')} className="w-full">
              Proceed to Checkout <ArrowRight size={18} />
            </Button>
            <Link to="/" className="block text-center mt-4 text-sm text-gray-500 hover:text-primary">
              Continue Shopping
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
};