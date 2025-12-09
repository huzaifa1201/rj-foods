import React, { useEffect, useState } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Order } from '../types';
import { Card, PageLoader, Badge, Button } from '../components/UI';
import { Package, MapPin, Phone, User as UserIcon, ArrowRight, ArrowUpRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const UserDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentUser) return;

    // Query without orderBy to avoid "Index Required" error
    const q = query(
      collection(db, 'orders'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const ords: Order[] = [];
      snapshot.forEach(doc => ords.push({ id: doc.id, ...doc.data() } as Order));
      
      // Sort orders client-side (Newest first)
      ords.sort((a, b) => {
        const timeA = a.createdAt?.seconds || 0;
        const timeB = b.createdAt?.seconds || 0;
        return timeB - timeA;
      });

      setOrders(ords);
      setLoading(false);
    }, (error) => {
      console.error("Error fetching orders:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered': return 'bg-green-500';
      case 'Cancelled': return 'bg-red-500';
      case 'Out for Delivery': return 'bg-blue-500';
      case 'Preparing': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, x: -20 },
    show: { opacity: 1, x: 0 }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Profile Summary Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="lg:col-span-1"
      >
        <Card className="sticky top-24">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <UserIcon className="text-primary" /> Profile
            </h2>
            <Link to="/profile" className="text-primary hover:text-primaryDark">
              <ArrowUpRight size={20} />
            </Link>
          </div>
          
          <div className="space-y-4 mb-6">
            <div className="text-center py-4">
               <div className="w-20 h-20 bg-primaryLight text-primary rounded-full flex items-center justify-center mx-auto mb-3 font-bold text-2xl">
                 {userProfile?.name?.charAt(0) || 'U'}
               </div>
               <h3 className="font-bold text-lg">{userProfile?.name}</h3>
               <p className="text-gray-500 text-sm">{userProfile?.email}</p>
            </div>
            
            <div className="border-t border-gray-100 pt-4 space-y-3">
              <div className="flex items-center gap-3 text-gray-600">
                <Phone size={16} className="text-primary" />
                <span className="text-sm">{userProfile?.phone || 'No phone added'}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-600">
                <MapPin size={16} className="text-primary" />
                <span className="text-sm line-clamp-1">{userProfile?.address || 'No address added'}</span>
              </div>
            </div>
          </div>

          <Link to="/profile">
            <Button variant="secondary" className="w-full">View Full Profile</Button>
          </Link>
        </Card>
      </motion.div>

      {/* Orders Section */}
      <div className="lg:col-span-2 space-y-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Package className="text-primary" /> My Orders
        </h2>
        {orders.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl text-center text-gray-500">
            <Package size={48} className="mx-auto mb-4 text-gray-300" />
            <p className="mb-4">You haven't placed any orders yet.</p>
            <Link to="/">
              <Button>Browse Menu</Button>
            </Link>
          </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {orders.map((order) => (
              <motion.div 
                key={order.id} 
                variants={item}
                className="cursor-pointer group"
                onClick={() => navigate(`/order/${order.id}`)}
              >
                <Card className="border-l-4 border-primary hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
                    <div>
                      <span className="text-xs text-gray-400">Order ID: #{order.id.slice(0, 8)}</span>
                      <p className="text-sm text-gray-500">{new Date(order.createdAt?.seconds * 1000).toLocaleString()}</p>
                    </div>
                    <Badge color={getStatusColor(order.status)}>{order.status}</Badge>
                  </div>
                  
                  <div className="space-y-2 mb-4 border-t border-b border-gray-100 py-3">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span className="font-medium">PKR {item.price * item.quantity}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="font-bold text-lg text-primaryDark">
                      <span>Total: PKR {order.total}</span>
                    </div>
                    <span className="text-primary text-sm flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                      Track Order <ArrowRight size={16} />
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
};