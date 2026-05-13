
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, addDoc, serverTimestamp, doc, getDoc, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Button, Input, Card, PageLoader } from '../components/UI';
import { ShoppingBag, MapPin, Phone, User, CreditCard, ChevronRight, Truck, Info, Camera, Hash, Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { PaymentMethod, AppSettings } from '../types';

export const Checkout = () => {
  const { currentUser, userProfile } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [settings, setSettings] = useState<AppSettings | null>(null);

  const [formData, setFormData] = useState({
    name: userProfile?.name || '',
    phone: userProfile?.phone || '',
    address: userProfile?.address || '',
    city: 'Multan',
    postalCode: '',
    floorApartment: '',
    deliveryNotes: '',
    paymentMethod: 'Cash on Delivery',
    transactionId: '',
    screenshotUrl: ''
  });

  useEffect(() => {
    if (cart.length === 0) {
      navigate('/cart');
    }
    fetchData();
  }, [cart, navigate]);

  const fetchData = async () => {
    try {
      const paySnap = await getDocs(collection(db, 'paymentMethods'));
      setPaymentMethods(paySnap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentMethod)));

      const settingsSnap = await getDoc(doc(db, 'settings', 'app_settings'));
      if (settingsSnap.exists()) {
        setSettings(settingsSnap.data() as AppSettings);
      } else {
        setSettings({ deliveryFee: 150, minOrderAmount: 0, contactEmail: '', contactPhone: '', address: '' });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const selectedMethod = paymentMethods.find(m => m.name === formData.paymentMethod);
  const isDigital = selectedMethod?.isDigital;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return showToast('Please login to place order', 'error');

    if (isDigital && (!formData.transactionId || !formData.screenshotUrl)) {
      return showToast('Please provide Transaction ID and Screenshot URL for digital payment', 'error');
    }

    setLoading(true);
    try {
      const deliveryFee = settings?.deliveryFee || 0;
      const orderData = {
        userId: currentUser.uid,
        customerName: formData.name,
        customerPhone: formData.phone,
        customerAddress: formData.address,
        customerCity: formData.city,
        customerPostalCode: formData.postalCode,
        floorApartment: formData.floorApartment,
        deliveryNotes: formData.deliveryNotes,
        items: cart,
        total: cartTotal + deliveryFee,
        deliveryFee: deliveryFee,
        status: 'Pending',
        paymentMethod: formData.paymentMethod,
        transactionId: isDigital ? formData.transactionId : null,
        screenshotUrl: isDigital ? formData.screenshotUrl : null,
        createdAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(db, 'orders'), orderData);
      clearCart();
      showToast('Order placed successfully!', 'success');
      navigate(`/order-success/${docRef.id}`);
    } catch (error) {
      console.error("Error placing order:", error);
      showToast('Failed to place order', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <h1 className="text-5xl font-black text-darkGray mb-2 tracking-tight">Checkout Details</h1>
            <p className="text-gray-400 font-medium mb-12 italic">Almost there! Your delicious meal is one step away.</p>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Personal Info */}
              <Card className="p-10 border-none shadow-sm bg-white rounded-[3rem]">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-primaryLight text-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5"><User size={24} /></div>
                   <h3 className="text-2xl font-black text-darkGray">Personal Information</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input 
                    label="Full Name" 
                    value={formData.name} 
                    onChange={e => setFormData({ ...formData, name: e.target.value })} 
                    required 
                    placeholder="Enter your name"
                  />
                  <Input 
                    label="Phone Number" 
                    value={formData.phone} 
                    onChange={e => setFormData({ ...formData, phone: e.target.value })} 
                    required 
                    placeholder="03xx xxxxxxx"
                  />
                </div>
              </Card>

              {/* Address */}
              <Card className="p-10 border-none shadow-sm bg-white rounded-[3rem]">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-primaryLight text-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5"><MapPin size={24} /></div>
                   <h3 className="text-2xl font-black text-darkGray">Delivery Address</h3>
                </div>
                <div className="space-y-6">
                  <Input 
                    label="Full Street Address" 
                    value={formData.address} 
                    onChange={e => setFormData({ ...formData, address: e.target.value })} 
                    required 
                    placeholder="House #, Street #, Area Name"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="City" value={formData.city} onChange={e => setFormData({ ...formData, city: e.target.value })} required />
                    <Input label="Postal Code" value={formData.postalCode} onChange={e => setFormData({ ...formData, postalCode: e.target.value })} />
                  </div>
                  <Input label="Floor / Apartment / Suite (Optional)" value={formData.floorApartment} onChange={e => setFormData({ ...formData, floorApartment: e.target.value })} />
                  <div className="flex flex-col gap-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-2">Delivery Notes</label>
                    <textarea 
                      className="w-full px-8 py-6 rounded-[2rem] border border-gray-50 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all min-h-[120px] font-medium"
                      placeholder="Any specific instructions for the rider?"
                      value={formData.deliveryNotes}
                      onChange={e => setFormData({ ...formData, deliveryNotes: e.target.value })}
                    />
                  </div>
                </div>
              </Card>

              {/* Payment */}
              <Card className="p-10 border-none shadow-sm bg-white rounded-[3rem]">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-14 h-14 bg-primaryLight text-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5"><CreditCard size={24} /></div>
                   <h3 className="text-2xl font-black text-darkGray">Payment Method</h3>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, paymentMethod: 'Cash on Delivery' })}
                    className={`p-8 rounded-[2.5rem] border-4 transition-all flex flex-col gap-3 relative overflow-hidden ${formData.paymentMethod === 'Cash on Delivery' ? 'border-primary bg-primaryLight/10' : 'border-gray-50 bg-gray-50 hover:border-gray-100'}`}
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-primary"><Truck size={24} /></div>
                    <span className="font-black text-darkGray text-lg text-left">Cash on Delivery</span>
                    {formData.paymentMethod === 'Cash on Delivery' && <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center"><ChevronRight size={14} /></div>}
                  </button>

                  {paymentMethods.map(method => (
                    <button
                      key={method.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, paymentMethod: method.name })}
                      className={`p-8 rounded-[2.5rem] border-4 transition-all flex flex-col gap-3 relative overflow-hidden ${formData.paymentMethod === method.name ? 'border-primary bg-primaryLight/10' : 'border-gray-50 bg-gray-50 hover:border-gray-100'}`}
                    >
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-primary"><CreditCard size={24} /></div>
                      <div className="text-left">
                        <span className="font-black text-darkGray text-lg block">{method.name}</span>
                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">{method.number}</span>
                      </div>
                      {formData.paymentMethod === method.name && <div className="absolute top-4 right-4 w-6 h-6 bg-primary text-white rounded-full flex items-center justify-center"><ChevronRight size={14} /></div>}
                    </button>
                  ))}
                </div>

                <AnimatePresence>
                   {isDigital && (
                     <motion.div 
                       initial={{ opacity: 0, height: 0 }}
                       animate={{ opacity: 1, height: 'auto' }}
                       exit={{ opacity: 0, height: 0 }}
                       className="bg-primaryLight/20 p-8 rounded-[2.5rem] space-y-6 border-2 border-primary/10"
                     >
                        <div className="flex items-center gap-3 text-primary mb-2">
                           <Info size={20} />
                           <p className="font-bold text-sm">Please transfer the amount to the {selectedMethod.name} number above and provide details below.</p>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                           <Input 
                             label="Transaction ID (Required)" 
                             placeholder="e.g. 123456789" 
                             value={formData.transactionId}
                             onChange={e => setFormData({ ...formData, transactionId: e.target.value })}
                             required
                           />
                           <Input 
                             label="Screenshot URL / Reference (Required)" 
                             placeholder="Paste image link here" 
                             value={formData.screenshotUrl}
                             onChange={e => setFormData({ ...formData, screenshotUrl: e.target.value })}
                             required
                           />
                        </div>
                     </motion.div>
                   )}
                </AnimatePresence>
              </Card>

              <Button type="submit" className="w-full py-6 text-2xl font-black shadow-2xl shadow-primary/30 rounded-[2.5rem] hover:scale-[1.02]">
                Place Order <ChevronRight className="ml-2" />
              </Button>
            </form>
          </motion.div>
        </div>

        {/* Order Summary */}
        <div className="space-y-8">
           <Card className="p-10 border-none shadow-2xl bg-darkGray text-white rounded-[3.5rem] sticky top-32 overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
              <h3 className="text-3xl font-black mb-10 flex items-center gap-4 relative z-10">
                 <ShoppingBag size={28} className="text-primary" /> My Order
              </h3>
              
              <div className="space-y-4 mb-10 max-h-80 overflow-y-auto no-scrollbar relative z-10">
                 {cart.map((item, idx) => (
                   <div key={idx} className="flex justify-between items-center bg-white/5 p-5 rounded-3xl border border-white/5 group hover:bg-white/10 transition-all">
                      <div className="flex items-center gap-4">
                         <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-black shadow-lg shadow-primary/20 group-hover:scale-110 transition-transform">{item.quantity}x</div>
                         <span className="font-bold text-gray-200 line-clamp-1">{item.name}</span>
                      </div>
                      <span className="font-black text-primary">PKR {item.price * item.quantity}</span>
                   </div>
                 ))}
              </div>

              <div className="space-y-5 pt-8 border-t border-white/10 relative z-10">
                 <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                    <span>Subtotal</span>
                    <span className="text-white">PKR {cartTotal}</span>
                 </div>
                 <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                    <span>Delivery Fee</span>
                    <span className="text-white">PKR {settings?.deliveryFee || 0}</span>
                 </div>
                 <div className="flex justify-between text-4xl font-black text-white pt-6 border-t border-white/5">
                    <span>Total</span>
                    <span className="text-primary">PKR {cartTotal + (settings?.deliveryFee || 0)}</span>
                 </div>
              </div>

              <div className="mt-10 p-6 bg-white/5 rounded-3xl flex items-start gap-4 relative z-10 border border-white/5">
                 <div className="w-10 h-10 bg-primary/20 rounded-2xl flex items-center justify-center shrink-0 text-primary"><Clock size={20} /></div>
                 <p className="text-[11px] text-gray-400 leading-relaxed font-bold uppercase tracking-widest">
                    Avg Delivery Time: <span className="text-white">35 Mins</span><br />
                    Secure payment guaranteed.
                 </p>
              </div>
           </Card>
        </div>
      </div>
    </div>
  );
};