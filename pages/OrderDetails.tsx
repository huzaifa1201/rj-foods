
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { Card, PageLoader, Badge } from '../components/UI';
import { Check, Clock, Package, Truck, Home, ArrowLeft, Hash, Camera, Info } from 'lucide-react';
import { motion } from 'framer-motion';

const steps = [
  { status: 'Pending', icon: Clock, label: 'Order Placed' },
  { status: 'Preparing', icon: Package, label: 'Preparing' },
  { status: 'Out for Delivery', icon: Truck, label: 'On the Way' },
  { status: 'Delivered', icon: Home, label: 'Delivered' },
];

export const OrderDetails = () => {
  const { id } = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'orders', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setOrder({ id: docSnap.id, ...docSnap.data() } as Order);
        }
      } catch (error) {
        console.error("Error fetching order:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <PageLoader />;
  if (!order) return (
    <div className="text-center py-40">
       <h2 className="text-3xl font-black text-darkGray mb-4">Order Not Found</h2>
       <Link to="/" className="text-primary font-bold hover:underline">Go back Home</Link>
    </div>
  );

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-5xl mx-auto space-y-12 py-10 px-4">
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
        <Link to="/dashboard" className="inline-flex items-center gap-3 text-gray-400 font-bold hover:text-primary transition-all group">
          <div className="w-10 h-10 bg-white border border-gray-100 rounded-xl flex items-center justify-center group-hover:bg-primary group-hover:text-white group-hover:border-primary transition-all">
            <ArrowLeft size={20} />
          </div>
          Back to My Dashboard
        </Link>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-gray-100 pb-10">
        <div>
          <span className="text-primary font-black uppercase tracking-[0.2em] text-xs">Track your deliciousness</span>
          <h1 className="text-5xl font-black text-darkGray mt-2 tracking-tight">Order Details</h1>
          <p className="text-gray-400 font-bold mt-2">ID: <span className="text-primary">#{order.id}</span></p>
        </div>
        <div className="flex items-center gap-4">
           <div className="text-right hidden md:block">
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mb-1">Status</p>
              <p className="font-black text-darkGray text-xl">{order.status}</p>
           </div>
           {isCancelled ? (
             <div className="bg-red-500 text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl shadow-red-500/20">Cancelled</div>
           ) : (
             <div className="bg-primary text-white px-8 py-4 rounded-[1.5rem] font-black shadow-xl shadow-primary/20">Active Order</div>
           )}
        </div>
      </div>

      {/* Progress Stepper */}
      {!isCancelled && (
        <Card className="p-12 border-none shadow-sm bg-white rounded-[3rem]">
          <div className="relative flex justify-between">
            {/* Progress Bar Line */}
            <div className="absolute top-1/2 left-0 w-full h-2 bg-gray-50 -translate-y-1/2 z-0 rounded-full"></div>
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="absolute top-1/2 left-0 h-2 bg-primary -translate-y-1/2 z-0 rounded-full shadow-lg shadow-primary/20"
            ></motion.div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="relative z-10 flex flex-col items-center gap-4">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: isCurrent ? 1.3 : 1, opacity: 1 }}
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center border-4 transition-all duration-500 shadow-xl ${isCompleted ? 'bg-primary border-primary text-white shadow-primary/20' : 'bg-white border-gray-100 text-gray-300 shadow-gray-100'}`}
                  >
                    {index < currentStepIndex ? <Check size={24} strokeWidth={3} /> : <Icon size={24} strokeWidth={3} />}
                  </motion.div>
                  <span className={`text-xs font-black uppercase tracking-widest ${isCompleted ? 'text-darkGray' : 'text-gray-300'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Items */}
        <Card className="p-10 border-none shadow-sm bg-white rounded-[3rem]">
          <h3 className="text-2xl font-black text-darkGray mb-8 flex items-center gap-3">
             <div className="w-10 h-10 bg-primaryLight text-primary rounded-xl flex items-center justify-center"><Package size={20} /></div>
             Order Summary
          </h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center bg-gray-50 p-4 rounded-2xl border border-gray-50 hover:bg-white hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center text-sm font-black group-hover:scale-110 transition-transform">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-black text-darkGray">{item.name}</p>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{item.category}</p>
                  </div>
                </div>
                <span className="font-black text-darkGray">PKR {item.price * item.quantity}</span>
              </div>
            ))}
            
            <div className="pt-8 mt-4 border-t-2 border-dashed border-gray-100 space-y-4">
               <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                  <span>Subtotal</span>
                  <span className="text-darkGray">PKR {order.total - (order.deliveryFee || 0)}</span>
               </div>
               <div className="flex justify-between text-gray-400 font-bold uppercase tracking-widest text-xs">
                  <span>Delivery Fee</span>
                  <span className="text-darkGray">PKR {order.deliveryFee || 0}</span>
               </div>
               <div className="flex justify-between text-3xl font-black text-primary pt-4">
                  <span>Total Paid</span>
                  <span>PKR {order.total}</span>
               </div>
            </div>
          </div>
        </Card>

        {/* Info */}
        <div className="space-y-8">
           <Card className="p-10 border-none shadow-sm bg-white rounded-[3rem]">
             <h3 className="text-2xl font-black text-darkGray mb-8 flex items-center gap-3">
                <div className="w-10 h-10 bg-primaryLight text-primary rounded-xl flex items-center justify-center"><Truck size={20} /></div>
                Delivery Details
             </h3>
             <div className="space-y-6">
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0"><Home size={20} /></div>
                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Address</label>
                    <p className="font-black text-darkGray leading-tight">{order.customerAddress}, {order.customerCity}</p>
                  </div>
               </div>
               <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 shrink-0"><Check size={20} /></div>
                  <div>
                    <label className="text-gray-400 text-[10px] uppercase font-black tracking-widest">Payment Method</label>
                    <p className="font-black text-darkGray text-lg">{order.paymentMethod}</p>
                  </div>
               </div>
             </div>
           </Card>

           {/* Payment Verification Card */}
           {(order.transactionId || order.screenshotUrl) && (
              <Card className="p-10 border-none shadow-xl bg-darkGray text-white rounded-[3rem] relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -mr-16 -mt-16 blur-3xl"></div>
                 <h3 className="text-2xl font-black mb-8 flex items-center gap-3 relative z-10">
                    <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center"><Hash size={20} /></div>
                    Payment Proof
                 </h3>
                 <div className="space-y-6 relative z-10">
                    {order.transactionId && (
                       <div>
                          <label className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-1 block">Transaction ID</label>
                          <div className="bg-white/5 p-4 rounded-2xl border border-white/10 font-black text-xl text-primary tracking-widest">
                             {order.transactionId}
                          </div>
                       </div>
                    )}
                    {order.screenshotUrl && (
                       <div>
                          <label className="text-gray-400 text-[10px] uppercase font-black tracking-widest mb-2 block">Screenshot Reference</label>
                          <a href={order.screenshotUrl} target="_blank" rel="noreferrer" className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all group">
                             <div className="w-10 h-10 bg-primary/20 text-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform"><Camera size={18} /></div>
                             <span className="font-bold text-gray-200">View Submitted Proof</span>
                          </a>
                       </div>
                    )}
                    <div className="p-4 bg-primary/10 rounded-2xl flex items-start gap-3 border border-primary/10">
                       <Info size={16} className="text-primary shrink-0 mt-1" />
                       <p className="text-[10px] text-gray-400 font-bold leading-relaxed uppercase tracking-widest">
                          Our team is verifying your payment. Once confirmed, your order will be prepared immediately.
                       </p>
                    </div>
                 </div>
              </Card>
           )}
        </div>
      </div>
    </div>
  );
};