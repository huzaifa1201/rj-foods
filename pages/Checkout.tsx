import React, { useState, useEffect } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { collection, addDoc, getDocs, serverTimestamp, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigate } from 'react-router-dom';
import { Card, Button, Input, ImageWithFallback } from '../components/UI';
import { PaymentMethod } from '../types';
import { Minus, Plus, Trash2 } from 'lucide-react';

export const Checkout = () => {
  const { cart, cartTotal, updateQuantity, removeFromCart, clearCart } = useCart();
  const { currentUser, userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);

  // Form
  const [name, setName] = useState(userProfile?.name || '');
  const [address, setAddress] = useState(userProfile?.address || '');
  const [phone, setPhone] = useState(userProfile?.phone || '');
  
  // Payment
  const [selectedMethod, setSelectedMethod] = useState('COD');
  const [transactionId, setTransactionId] = useState('');
  const [screenshotUrl, setScreenshotUrl] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setAddress(userProfile.address);
      setPhone(userProfile.phone);
    }
    const fetchMethods = async () => {
      const q = query(collection(db, 'paymentMethods'), where('status', '==', 'active'));
      const snap = await getDocs(q);
      setPaymentMethods(snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentMethod)));
    };
    fetchMethods();
  }, [userProfile]);

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;
    setLoading(true);

    try {
      const orderData = {
        userId: currentUser?.uid,
        items: cart,
        total: cartTotal,
        paymentMethod: selectedMethod,
        transactionId: selectedMethod === 'COD' ? '' : transactionId,
        screenshotUrl: selectedMethod === 'COD' ? '' : screenshotUrl,
        customerName: name,
        customerAddress: address,
        customerPhone: phone,
        status: 'Pending',
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate('/order-success');
    } catch (error) {
      console.error(error);
      showToast('Failed to place order. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (cart.length === 0) {
    return <div className="text-center py-20 text-gray-500">Your cart is empty. Go eat something!</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Cart Summary */}
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-4">Your Order</h2>
        {cart.map(item => (
          <Card key={item.id} className="flex justify-between items-center p-4">
            <div className="flex items-center gap-4">
               <ImageWithFallback src={item.imageUrl} alt={item.name} className="w-16 h-16 rounded-lg object-cover" />
               <div>
                 <h4 className="font-bold">{item.name}</h4>
                 <p className="text-primary text-sm">PKR {item.price}</p>
               </div>
            </div>
            <div className="flex items-center gap-3">
              <button onClick={() => updateQuantity(item.id, -1)} className="p-1 bg-gray-100 rounded-full"><Minus size={14} /></button>
              <span className="font-bold w-4 text-center">{item.quantity}</span>
              <button onClick={() => updateQuantity(item.id, 1)} className="p-1 bg-gray-100 rounded-full"><Plus size={14} /></button>
              <button onClick={() => removeFromCart(item.id)} className="text-red-500 ml-2"><Trash2 size={18} /></button>
            </div>
          </Card>
        ))}
        <Card className="flex justify-between items-center text-xl font-bold bg-primary text-white">
          <span>Total To Pay</span>
          <span>PKR {cartTotal}</span>
        </Card>
      </div>

      {/* Checkout Form */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Checkout Details</h2>
        <Card>
          <form onSubmit={handlePlaceOrder} className="space-y-4">
            <h3 className="font-bold text-gray-500 uppercase text-xs">Delivery Info</h3>
            <Input placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} required />
            <Input placeholder="Phone Number" value={phone} onChange={e => setPhone(e.target.value)} required />
            <Input placeholder="Full Address" value={address} onChange={e => setAddress(e.target.value)} required />

            <h3 className="font-bold text-gray-500 uppercase text-xs mt-6">Payment Method</h3>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setSelectedMethod('COD')}
                className={`p-3 rounded-xl border-2 font-bold ${selectedMethod === 'COD' ? 'border-primary bg-primaryLight text-primary' : 'border-gray-200 text-gray-500'}`}
              >
                Cash On Delivery
              </button>
              {paymentMethods.map(pm => (
                <button
                  key={pm.id}
                  type="button"
                  onClick={() => setSelectedMethod(pm.name)}
                  className={`p-3 rounded-xl border-2 font-bold ${selectedMethod === pm.name ? 'border-primary bg-primaryLight text-primary' : 'border-gray-200 text-gray-500'}`}
                >
                  {pm.name}
                </button>
              ))}
            </div>

            {selectedMethod !== 'COD' && (
               <div className="bg-gray-50 p-4 rounded-xl space-y-3 animate-fade-in">
                 <p className="text-sm text-gray-600">
                   Please transfer <strong>PKR {cartTotal}</strong> to: <br/>
                   <span className="font-mono bg-white p-1 rounded">{paymentMethods.find(p => p.name === selectedMethod)?.number}</span>
                 </p>
                 <Input 
                    placeholder="Transaction ID" 
                    value={transactionId} 
                    onChange={e => setTransactionId(e.target.value)} 
                    required 
                 />
                 <Input 
                    placeholder="Screenshot URL (e.g. imgur link)" 
                    value={screenshotUrl} 
                    onChange={e => setScreenshotUrl(e.target.value)} 
                 />
                 <p className="text-xs text-gray-400">Since we don't store files, please upload your screenshot to a free host (like imgbb) and paste the link.</p>
               </div>
            )}

            <Button type="submit" className="w-full mt-6" isLoading={loading}>
              Place Order
            </Button>
          </form>
        </Card>
      </div>
    </div>
  );
};