import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Order } from '../types';
import { Card, PageLoader, Badge } from '../components/UI';
import { Check, Clock, Package, Truck, Home, ArrowLeft } from 'lucide-react';

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
  if (!order) return <div className="text-center py-20">Order not found</div>;

  const currentStepIndex = steps.findIndex(s => s.status === order.status);
  const isCancelled = order.status === 'Cancelled';

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-darkGray">Order Tracking</h1>
          <p className="text-gray-500">Order ID: #{order.id}</p>
        </div>
        {isCancelled ? (
          <Badge color="bg-red-500">Cancelled</Badge>
        ) : (
          <Badge color="bg-primary">In Progress</Badge>
        )}
      </div>

      {/* Progress Stepper */}
      {!isCancelled && (
        <Card className="p-8">
          <div className="relative flex justify-between">
            {/* Progress Bar Line */}
            <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 z-0"></div>
            <div 
              className="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 z-0 transition-all duration-500"
              style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
            ></div>

            {steps.map((step, index) => {
              const Icon = step.icon;
              const isCompleted = index <= currentStepIndex;
              const isCurrent = index === currentStepIndex;

              return (
                <div key={step.status} className="relative z-10 flex flex-col items-center gap-2">
                  <div 
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-4 transition-colors duration-300 ${isCompleted ? 'bg-primary border-primary text-white' : 'bg-white border-gray-200 text-gray-400'}`}
                    style={{ transform: isCurrent ? 'scale(1.2)' : 'scale(1)' }}
                  >
                    {index < currentStepIndex ? <Check size={18} /> : <Icon size={18} />}
                  </div>
                  <span className={`text-xs font-bold ${isCompleted ? 'text-primary' : 'text-gray-400'}`}>{step.label}</span>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card>
          <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Order Items</h3>
          <div className="space-y-4">
            {order.items.map((item, i) => (
              <div key={i} className="flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center text-xs font-bold text-gray-500">
                    {item.quantity}x
                  </div>
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.category}</p>
                  </div>
                </div>
                <span className="font-bold text-gray-600">PKR {item.price * item.quantity}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-primary">
              <span>Total Amount</span>
              <span>PKR {order.total}</span>
            </div>
          </div>
        </Card>

        <Card>
          <h3 className="font-bold text-lg mb-4 border-b border-gray-100 pb-2">Delivery Details</h3>
          <div className="space-y-4 text-sm">
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold">Customer Name</label>
              <p className="font-medium">{order.customerName}</p>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold">Address</label>
              <p className="font-medium">{order.customerAddress}</p>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold">Phone</label>
              <p className="font-medium">{order.customerPhone}</p>
            </div>
            <div>
              <label className="text-gray-400 text-xs uppercase font-bold">Payment Method</label>
              <p className="font-medium">{order.paymentMethod}</p>
              {order.transactionId && <p className="text-xs text-gray-500">TxID: {order.transactionId}</p>}
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};