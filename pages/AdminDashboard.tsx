
import React, { useState, useEffect, useMemo } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy, onSnapshot, setDoc, writeBatch, getDoc, where } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { updateEmail, updatePassword } from 'firebase/auth';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Product, Order, PaymentMethod, UserProfile, PageContent, Category, AppSettings, Review } from '../types';
import { Button, Input, Card, Badge, PageLoader, Modal, ImageWithFallback } from '../components/UI';
import { 
  Trash2, Edit, Check, X, Plus, BarChart3, User, LogOut, 
  Package, CreditCard, Users, Search, Filter, Database, 
  FileText, Save, LayoutDashboard, ChevronRight, TrendingUp, 
  ShoppingBag, Clock, DollarSign, List, Settings, PieChart, 
  ArrowUpRight, ArrowDownRight, Activity, Phone, MapPin, Hash, Camera, Star, MessageSquare
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { seedProducts, seedCategories } from '../utils/seedData';
import { defaultPages } from '../utils/dummyData';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area, BarChart, Bar } from 'recharts';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'analytics' | 'orders' | 'products' | 'categories' | 'payments' | 'settings' | 'content' | 'users' | 'profile' | 'reviews'>('overview');
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pages, setPages] = useState<PageContent[]>([]);
  const [appSettings, setAppSettings] = useState<AppSettings | null>(null);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Confirmation Modal State
  const [modalConfig, setModalConfig] = useState<{ isOpen: boolean, title: string, content: React.ReactNode, onConfirm: () => void } | null>(null);

  // Form States
  const [prodForm, setProdForm] = useState({ name: '', price: '', description: '', imageUrl: '', category: '' });
  const [editingProdId, setEditingProdId] = useState<string | null>(null);
  const [catForm, setCatForm] = useState({ name: '', imageUrl: '' });
  const [editingCatId, setEditingCatId] = useState<string | null>(null);
  const [payForm, setPayForm] = useState({ name: '', number: '', isDigital: false });
  const [editingPayId, setEditingPayId] = useState<string | null>(null);
  const [settingsForm, setSettingsForm] = useState({ deliveryFee: 0, minOrderAmount: 0, contactEmail: '', contactPhone: '', address: '' });
  const [adminProfileForm, setAdminProfileForm] = useState({ name: '', phone: '', email: '' });
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);

  // Initial Fetch & Real-time Listeners
  useEffect(() => {
    const qOrders = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
    const unsubOrders = onSnapshot(qOrders, (snap) => {
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() } as Order)));
    });

    const qProducts = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
    const unsubProducts = onSnapshot(qProducts, (snap) => {
      setProducts(snap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
    });

    const qCategories = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubCategories = onSnapshot(qCategories, (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    });

    const qPayments = query(collection(db, 'paymentMethods'), orderBy('name', 'asc'));
    const unsubPayments = onSnapshot(qPayments, (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentMethod)));
    });

    const qUsers = query(collection(db, 'users'), orderBy('name', 'asc'));
    const unsubUsers = onSnapshot(qUsers, (snap) => {
      setUsers(snap.docs.map(d => ({ ...d.data() } as UserProfile)));
    });

    const qReviews = query(collection(db, 'reviews'), orderBy('createdAt', 'desc'));
    const unsubReviews = onSnapshot(qReviews, (snap) => {
      setReviews(snap.docs.map(d => ({ id: d.id, ...d.data() } as Review)));
    });

    fetchStaticData();
    return () => {
      unsubOrders(); unsubProducts(); unsubCategories(); unsubPayments(); unsubUsers(); unsubReviews();
    };
  }, []);

  const fetchStaticData = async () => {
    try {
      const settingsSnap = await getDoc(doc(db, 'settings', 'app_settings'));
      if (settingsSnap.exists()) {
        const data = settingsSnap.data() as AppSettings;
        setAppSettings(data);
        setSettingsForm(data);
      }

      const pSnap = await getDocs(collection(db, 'content_pages'));
      setPages(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as PageContent)));
    } catch (e) { console.error(e); }
  };

  useEffect(() => {
    if (userProfile) {
      setAdminProfileForm({
        name: userProfile.name || '',
        phone: userProfile.phone || '',
        email: userProfile.email || ''
      });
    }
  }, [userProfile]);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    return (order.id.toLowerCase().includes(searchLower) || order.customerName.toLowerCase().includes(searchLower)) && (statusFilter === 'All' || order.status === statusFilter);
  });

  const closeModal = () => setModalConfig(null);
  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({ isOpen: true, title, content: <p className="text-gray-600">{message}</p>, onConfirm: async () => { await onConfirm(); closeModal(); } });
  };

  // --- Analytics Logic ---
  const chartData = useMemo(() => {
    const days: any = {};
    orders.forEach(o => {
      if (o.createdAt) {
        const d = new Date(o.createdAt.seconds * 1000).toLocaleDateString();
        days[d] = (days[d] || 0) + o.total;
      }
    });
    return Object.keys(days).map(date => ({ date, revenue: days[date] })).reverse().slice(0, 7);
  }, [orders]);

  // --- Actions ---
  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await setDoc(doc(db, 'settings', 'app_settings'), settingsForm);
      showToast('Settings updated successfully', 'success');
    } catch (e) { showToast('Error saving settings', 'error'); }
    finally { setLoading(false); }
  };

  const handleSavePayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const data = { ...payForm, status: 'active' };
      if (editingPayId) {
        await updateDoc(doc(db, 'paymentMethods', editingPayId), data);
        showToast('Payment method updated', 'success');
      } else {
        await addDoc(collection(db, 'paymentMethods'), data);
        showToast('Payment method added', 'success');
      }
      setPayForm({ name: '', number: '', isDigital: false });
      setEditingPayId(null);
    } catch (e) { showToast('Error saving payment method', 'error'); }
  };

  const handleUpdateAdminProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;
    setLoading(true);
    try {
      await updateDoc(doc(db, 'users', auth.currentUser.uid), {
        name: adminProfileForm.name,
        phone: adminProfileForm.phone
      });
      showToast('Profile updated', 'success');
    } catch (e) { showToast('Error updating profile', 'error'); }
    finally { setLoading(false); }
  };

  const handleSavePage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage) return;
    try {
      await updateDoc(doc(db, 'content_pages', editingPage.id), {
        title: editingPage.title,
        content: editingPage.content,
        updatedAt: serverTimestamp()
      });
      setEditingPage(null);
      fetchStaticData();
      showToast('Page content updated', 'success');
    } catch (e) { showToast('Error saving page', 'error'); }
  };

  const handleSeedEverything = async () => {
    showConfirm("Seed All Data", `This will add 100 products and 20 categories. Continue?`, async () => {
      setLoading(true);
      try {
        const batch = writeBatch(db);
        seedCategories.forEach(c => { const dr = doc(collection(db, 'categories')); batch.set(dr, { ...c, createdAt: serverTimestamp() }); });
        seedProducts.forEach(p => { const dr = doc(collection(db, 'products')); batch.set(dr, { ...p, createdAt: serverTimestamp() }); });
        await batch.commit();
        showToast(`Successfully seeded everything!`, 'success');
      } catch (e) { showToast('Error seeding data', 'error'); }
      finally { setLoading(false); }
    });
  };

  const handleOrderStatus = async (id: string, status: any) => {
    try { await updateDoc(doc(db, 'orders', id), { status }); showToast('Status updated', 'success'); } catch (e) { showToast('Error', 'error'); }
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const p = { ...prodForm, price: Number(prodForm.price), createdAt: serverTimestamp() };
      if (editingProdId) { await updateDoc(doc(db, 'products', editingProdId), p); }
      else { await addDoc(collection(db, 'products'), p); }
      setProdForm({ name: '', price: '', description: '', imageUrl: '', category: '' });
      setEditingProdId(null);
      showToast('Product saved', 'success');
    } catch (e) { showToast('Error', 'error'); }
  };

  const handleSaveCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingCatId) { await updateDoc(doc(db, 'categories', editingCatId), catForm); }
      else { await addDoc(collection(db, 'categories'), catForm); }
      setCatForm({ name: '', imageUrl: '' });
      setEditingCatId(null);
      showToast('Category saved', 'success');
    } catch (e) { showToast('Error', 'error'); }
  };

  const handleDeleteReview = async (id: string) => {
    showConfirm("Delete Review", "Are you sure you want to delete this review?", async () => {
      try {
        await deleteDoc(doc(db, 'reviews', id));
        showToast('Review deleted', 'success');
      } catch (e) { showToast('Error deleting review', 'error'); }
    });
  };

  const menuItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'categories', label: 'Categories', icon: List },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'reviews', label: 'Reviews', icon: MessageSquare },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="flex flex-col lg:flex-row min-h-screen -m-6 bg-[#f8f9fc]">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white border-r border-gray-100 lg:fixed lg:h-screen z-20">
        <div className="p-8 border-b border-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-primary/30">F</div>
            <span className="font-black text-2xl text-darkGray tracking-tighter">FoodieFlow</span>
          </div>
        </div>
        <nav className="p-4 space-y-1 mt-4">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as any)}
              className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all duration-300 ${activeTab === item.id ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-[1.02]' : 'text-gray-400 hover:text-primary hover:bg-primaryLight'}`}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </button>
          ))}
          <button onClick={async () => { await auth.signOut(); navigate('/admin/login'); }} className="w-full flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-red-400 hover:bg-red-50 mt-8 transition-all">
            <LogOut size={20} />
            <span>Sign Out</span>
          </button>
        </nav>
      </div>

      {/* Main */}
      <div className="flex-grow lg:ml-64 p-8 lg:p-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-darkGray capitalize tracking-tight mb-2">{activeTab}</h1>
          <p className="text-gray-400 font-medium">Administrator Dashboard / {activeTab}</p>
        </header>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
            
            {activeTab === 'overview' && (
              <div className="space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <StatCard label="Total Revenue" value={`PKR ${orders.reduce((s,o)=>s+o.total,0).toLocaleString()}`} icon={DollarSign} color="text-green-500" bg="bg-green-50" />
                  <StatCard label="Total Orders" value={orders.length} icon={ShoppingBag} color="text-primary" bg="bg-primaryLight" />
                  <StatCard label="Active Users" value={users.length} icon={Users} color="text-blue-500" bg="bg-blue-50" />
                  <StatCard label="Categories" value={categories.length} icon={List} color="text-orange-500" bg="bg-orange-50" />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                   <Card className="p-8 border-none shadow-sm">
                      <h3 className="text-xl font-bold mb-6">Revenue Trend</h3>
                      <div className="h-64">
                         <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={chartData}>
                               <defs>
                                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                                     <stop offset="5%" stopColor="#ff4b6e" stopOpacity={0.1}/>
                                     <stop offset="95%" stopColor="#ff4b6e" stopOpacity={0}/>
                                  </linearGradient>
                               </defs>
                               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                               <XAxis dataKey="date" hide />
                               <Tooltip />
                               <Area type="monotone" dataKey="revenue" stroke="#ff4b6e" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                            </AreaChart>
                         </ResponsiveContainer>
                      </div>
                   </Card>
                   <Card className="p-8 border-none shadow-sm flex flex-col justify-center gap-6">
                      <h3 className="text-xl font-bold">Quick Management</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                         <Button variant="outline" onClick={handleSeedEverything} className="h-auto py-6 flex flex-col gap-2 items-start" isLoading={loading}>
                            <div className="flex items-center gap-2 font-bold"><Database size={20} /> Seed All Products</div>
                            <p className="text-[10px] text-gray-400">Add 100+ items instantly</p>
                         </Button>
                         <Button variant="outline" onClick={() => setActiveTab('settings')} className="h-auto py-6 flex flex-col gap-2 items-start">
                            <div className="flex items-center gap-2 font-bold"><Settings size={20} /> App Settings</div>
                            <p className="text-[10px] text-gray-400">Configure delivery fees</p>
                         </Button>
                      </div>
                   </Card>
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
               <div className="space-y-8">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <Card className="p-8 col-span-2">
                        <h3 className="text-xl font-bold mb-8">Daily Sales Revenue</h3>
                        <div className="h-96">
                           <ResponsiveContainer width="100%" height="100%">
                              <BarChart data={chartData}>
                                 <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                 <XAxis dataKey="date" />
                                 <YAxis />
                                 <Tooltip />
                                 <Bar dataKey="revenue" fill="#ff4b6e" radius={[10, 10, 0, 0]} />
                              </BarChart>
                           </ResponsiveContainer>
                        </div>
                     </Card>
                     <Card className="p-8 flex flex-col items-center justify-center text-center gap-4">
                        <div className="w-20 h-20 bg-primaryLight text-primary rounded-full flex items-center justify-center mb-4">
                           <Activity size={40} />
                        </div>
                        <h3 className="text-3xl font-black">PKR {orders.reduce((s,o)=>s+o.total,0).toLocaleString()}</h3>
                        <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">Lifetime Business Volume</p>
                     </Card>
                  </div>
               </div>
            )}

            {activeTab === 'settings' && (
              <Card className="max-w-2xl p-10 border-none shadow-sm">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3"><Settings className="text-primary" /> General Settings</h3>
                <form onSubmit={handleSaveSettings} className="space-y-6">
                  <Input label="Delivery Fee (PKR)" type="number" value={settingsForm.deliveryFee} onChange={e => setSettingsForm({ ...settingsForm, deliveryFee: Number(e.target.value) })} />
                  <Input label="Minimum Order Amount" type="number" value={settingsForm.minOrderAmount} onChange={e => setSettingsForm({ ...settingsForm, minOrderAmount: Number(e.target.value) })} />
                  <Input label="Support Email" value={settingsForm.contactEmail} onChange={e => setSettingsForm({ ...settingsForm, contactEmail: e.target.value })} />
                  <Input label="Support Phone" value={settingsForm.contactPhone} onChange={e => setSettingsForm({ ...settingsForm, contactPhone: e.target.value })} />
                  <Button type="submit" className="w-full py-4 font-bold" isLoading={loading}>Save All Settings</Button>
                </form>
              </Card>
            )}

            {activeTab === 'payments' && (
              <div className="space-y-8">
                <Card className="p-8 max-w-2xl border-none shadow-sm rounded-[2.5rem]">
                  <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
                     <CreditCard className="text-primary" /> {editingPayId ? 'Edit' : 'Add'} Payment Method
                  </h3>
                  <form onSubmit={handleSavePayment} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Input label="Bank / Wallet Name" value={payForm.name} onChange={e => setPayForm({ ...payForm, name: e.target.value })} required placeholder="e.g. EasyPaisa, JazzCash" />
                    <Input label="Account / Wallet Number" value={payForm.number} onChange={e => setPayForm({ ...payForm, number: e.target.value })} required placeholder="03xx xxxxxxx" />
                    <div className="md:col-span-2 flex items-center gap-4 bg-gray-50 p-4 rounded-2xl">
                       <input 
                         type="checkbox" 
                         id="isDigital" 
                         checked={payForm.isDigital} 
                         onChange={e => setPayForm({ ...payForm, isDigital: e.target.checked })}
                         className="w-5 h-5 accent-primary"
                       />
                       <label htmlFor="isDigital" className="font-bold text-gray-600">Digital Payment? (Require Trx ID & Screenshot)</label>
                    </div>
                    <div className="md:col-span-2">
                       <Button type="submit" className="w-full py-4 font-black" isLoading={loading}>Save Payment Method</Button>
                    </div>
                  </form>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                   {payments.map(p => (
                     <Card key={p.id} className="p-8 flex flex-col gap-4 relative group border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white">
                        <div className="flex justify-between items-start">
                           <div className="w-14 h-14 bg-primaryLight text-primary rounded-2xl flex items-center justify-center shadow-lg shadow-primary/5"><CreditCard size={28} /></div>
                           <Badge color={p.isDigital ? 'bg-primary' : 'bg-gray-400'}>{p.isDigital ? 'DIGITAL' : 'CASH'}</Badge>
                        </div>
                        <div>
                           <p className="font-black text-xl text-darkGray mb-1">{p.name}</p>
                           <p className="text-gray-400 font-bold tracking-tight">{p.number}</p>
                        </div>
                        <div className="flex gap-2 absolute top-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => { setEditingPayId(p.id); setPayForm({ name: p.name, number: p.number, isDigital: p.isDigital || false }); }} className="p-3 bg-white shadow-xl rounded-xl text-blue-500 hover:bg-blue-500 hover:text-white transition-all"><Edit size={18} /></button>
                           <button onClick={async () => { if(confirm('Are you sure you want to delete this payment method?')) await deleteDoc(doc(db, 'paymentMethods', p.id)); }} className="p-3 bg-white shadow-xl rounded-xl text-red-500 hover:bg-red-500 hover:text-white transition-all"><Trash2 size={18} /></button>
                        </div>
                     </Card>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
               <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {reviews.map(r => (
                        <Card key={r.id} className="p-8 border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[2.5rem] bg-white relative group">
                           <div className="flex justify-between items-start mb-6">
                              <div className="flex items-center gap-4">
                                 <div className="w-12 h-12 bg-primaryLight text-primary rounded-xl flex items-center justify-center font-black text-lg">
                                    {r.userName.charAt(0)}
                                 </div>
                                 <div>
                                    <h4 className="font-bold text-darkGray leading-tight">{r.userName}</h4>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</p>
                                 </div>
                              </div>
                              <div className="flex gap-0.5">
                                 {[1,2,3,4,5].map(s => (
                                    <Star key={s} size={12} className={s <= r.rating ? "fill-orange-400 text-orange-400" : "text-gray-200"} />
                                 ))}
                              </div>
                           </div>
                           <p className="text-gray-500 font-medium italic text-sm mb-4">"{r.comment}"</p>
                           <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                              <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Rating: {r.rating}/5</span>
                              <button onClick={() => handleDeleteReview(r.id)} className="p-2 text-red-400 hover:bg-red-50 rounded-lg transition-colors"><Trash2 size={16} /></button>
                           </div>
                        </Card>
                     ))}
                     {reviews.length === 0 && (
                        <div className="col-span-full py-20 text-center bg-white rounded-[3rem] border border-dashed border-gray-100">
                           <MessageSquare className="mx-auto text-gray-100 mb-4" size={48} />
                           <p className="text-gray-400 font-bold italic">No reviews found in the system.</p>
                        </div>
                     )}
                  </div>
               </div>
            )}

            {activeTab === 'users' && (
              <Card className="overflow-hidden border-none shadow-sm rounded-[2rem]">
                <div className="p-8 border-b border-gray-50 flex justify-between items-center bg-white">
                   <h3 className="text-xl font-bold">Manage Platform Users</h3>
                   <span className="text-sm text-gray-400 font-bold uppercase tracking-widest">{users.length} Users</span>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-gray-50">
                         <tr>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">User Details</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Role</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Phone</th>
                            <th className="px-8 py-5 text-xs font-bold text-gray-400 uppercase tracking-widest">Action</th>
                         </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-50">
                         {users.map(u => (
                            <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors">
                               <td className="px-8 py-6">
                                  <div className="flex items-center gap-4">
                                     <div className="w-12 h-12 bg-primaryLight text-primary rounded-2xl flex items-center justify-center font-black text-xl">{u.name?.charAt(0)}</div>
                                     <div>
                                        <p className="font-bold text-darkGray">{u.name}</p>
                                        <p className="text-sm text-gray-400">{u.email}</p>
                                     </div>
                                  </div>
                               </td>
                               <td className="px-8 py-6">
                                  <Badge color={u.role === 'admin' ? 'bg-darkGray' : 'bg-gray-200 text-gray-500'}>{u.role}</Badge>
                               </td>
                               <td className="px-8 py-6 text-sm font-bold text-gray-500">{u.phone || 'N/A'}</td>
                               <td className="px-8 py-6">
                                  <button className="text-primary font-bold text-sm hover:underline">Manage Role</button>
                                </td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
              </Card>
            )}

            {activeTab === 'profile' && (
               <div className="max-w-4xl grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <Card className="p-10 text-center flex flex-col items-center">
                     <div className="w-24 h-24 bg-primary text-white rounded-[2rem] flex items-center justify-center text-4xl font-black mb-6 shadow-2xl shadow-primary/30">
                        {userProfile?.name?.charAt(0)}
                     </div>
                     <h2 className="text-2xl font-black text-darkGray mb-2">{userProfile?.name}</h2>
                     <p className="text-gray-400 font-bold mb-6 italic">{userProfile?.email}</p>
                     <Badge color="bg-darkGray px-6 py-2 rounded-full uppercase tracking-widest text-[10px]">Super Admin</Badge>
                  </Card>
                  <Card className="lg:col-span-2 p-10">
                     <h3 className="text-xl font-bold mb-8">Profile Settings</h3>
                     <form onSubmit={handleUpdateAdminProfile} className="space-y-6">
                        <Input label="Display Name" value={adminProfileForm.name} onChange={e => setAdminProfileForm({ ...adminProfileForm, name: e.target.value })} />
                        <Input label="Phone Number" value={adminProfileForm.phone} onChange={e => setAdminProfileForm({ ...adminProfileForm, phone: e.target.value })} />
                        <Input label="Email (Read-only)" value={adminProfileForm.email} disabled />
                        <Button type="submit" className="w-full py-4 font-black" isLoading={loading}>Update My Profile</Button>
                     </form>
                  </Card>
               </div>
            )}

            {activeTab === 'content' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                   {pages.map(p => (
                     <Card key={p.id} className="p-6 hover:border-primary transition-all cursor-pointer group" onClick={() => setEditingPage(p)}>
                        <FileText className="text-primary mb-4 group-hover:scale-110 transition-transform" size={32} />
                        <h4 className="font-bold text-lg mb-1">{p.title}</h4>
                        <p className="text-xs text-gray-400 uppercase tracking-widest font-bold">Click to Edit</p>
                     </Card>
                   ))}
                </div>
                {editingPage && (
                   <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                      <Card className="p-10 border-none shadow-xl bg-white rounded-[3rem]">
                         <div className="flex justify-between items-center mb-8">
                            <h3 className="text-2xl font-black">Edit: {editingPage.title}</h3>
                            <button onClick={() => setEditingPage(null)}><X /></button>
                         </div>
                         <form onSubmit={handleSavePage} className="space-y-6">
                            <Input label="Page Title" value={editingPage.title} onChange={e => setEditingPage({ ...editingPage, title: e.target.value })} />
                            <div className="flex flex-col gap-2">
                               <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Page Content (Markdown / Text)</label>
                               <textarea 
                                  className="w-full px-8 py-6 rounded-[2rem] border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all min-h-[400px] font-medium text-gray-600"
                                  value={editingPage.content}
                                  onChange={e => setEditingPage({ ...editingPage, content: e.target.value })}
                               />
                            </div>
                            <Button type="submit" className="w-full py-5 font-black">Save Content Changes</Button>
                         </form>
                      </Card>
                   </motion.div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
               <div className="space-y-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-8">
                     <div className="relative flex-grow">
                        <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input type="text" placeholder="Search orders..." className="w-full pl-14 pr-6 py-5 rounded-[2rem] border-none shadow-sm focus:ring-2 focus:ring-primary/20 outline-none" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
                     </div>
                     <select className="px-8 py-5 rounded-[2rem] border-none shadow-sm font-bold text-gray-600 outline-none" value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
                        <option value="All">All Statuses</option>
                        {['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => <option key={s} value={s}>{s}</option>)}
                     </select>
                  </div>
                  {filteredOrders.map(o => (
                     <Card key={o.id} className="p-10 border-none shadow-sm hover:shadow-xl transition-all duration-500 rounded-[3rem] group bg-white">
                        <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
                           <div className="lg:col-span-2 space-y-4">
                              <div className="flex items-center gap-3">
                                 <Badge color={o.status === 'Delivered' ? 'bg-green-500' : 'bg-primary'}>{o.status}</Badge>
                                 <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Order ID: #{o.id.slice(0,8)}</span>
                              </div>
                              <h3 className="text-3xl font-black text-darkGray">{o.customerName}</h3>
                              <p className="text-gray-500 font-medium leading-relaxed">{o.customerAddress}, {o.customerCity}</p>
                               <div className="flex gap-6 text-sm font-bold text-gray-400">
                                 <span className="flex items-center gap-2"><Phone size={14} className="text-primary" /> {o.customerPhone}</span>
                                 <span className="flex items-center gap-2"><Clock size={14} className="text-primary" /> {o.createdAt ? new Date(o.createdAt.seconds * 1000).toLocaleString() : ''}</span>
                              </div>

                              {o.transactionId && (
                                 <div className="mt-6 p-6 bg-primaryLight/20 rounded-[2rem] border border-primary/10 space-y-3">
                                    <p className="text-xs font-black text-primary uppercase tracking-widest flex items-center gap-2"><Hash size={14} /> Payment Verification</p>
                                    <div className="flex flex-wrap gap-6">
                                       <div>
                                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Trx ID</p>
                                          <p className="font-black text-darkGray">{o.transactionId}</p>
                                       </div>
                                       <div>
                                          <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Proof Screenshot</p>
                                          <a href={o.screenshotUrl} target="_blank" rel="noreferrer" className="text-primary font-black flex items-center gap-1 hover:underline text-sm"><Camera size={14} /> View Image</a>
                                       </div>
                                    </div>
                                 </div>
                              )}
                           </div>
                           <div className="space-y-4">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Items Detail</p>
                              <div className="space-y-3">
                                 {o.items.map((i, idx) => (
                                    <div key={idx} className="flex justify-between items-center text-sm bg-gray-50 p-3 rounded-2xl">
                                       <span className="font-bold">{i.quantity}x {i.name}</span>
                                       <span className="text-gray-400">PKR {i.price * i.quantity}</span>
                                    </div>
                                 ))}
                                 <div className="pt-4 border-t border-gray-100 flex justify-between font-black text-primary text-xl">
                                    <span>Total</span>
                                    <span>PKR {o.total}</span>
                                 </div>
                              </div>
                           </div>
                           <div className="space-y-4">
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Control Center</p>
                              <div className="grid grid-cols-1 gap-2">
                                 {['Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map(s => (
                                    <button key={s} onClick={() => handleOrderStatus(o.id, s)} className={`py-3 rounded-2xl text-xs font-bold transition-all border ${o.status === s ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20' : 'bg-white text-gray-400 border-gray-100 hover:border-primary hover:text-primary'}`}>{s}</button>
                                 ))}
                              </div>
                           </div>
                        </div>
                     </Card>
                  ))}
               </div>
            )}

            {activeTab === 'products' && (
              <div className="space-y-10">
                <Card className="p-10 border-none shadow-sm rounded-[3rem] bg-white">
                  <h3 className="text-2xl font-black mb-8">Inventory Manager</h3>
                  <form onSubmit={handleSaveProduct} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Input label="Item Name" value={prodForm.name} onChange={e => setProdForm({ ...prodForm, name: e.target.value })} required />
                    <Input label="Price (PKR)" type="number" value={prodForm.price} onChange={e => setProdForm({ ...prodForm, price: e.target.value })} required />
                    <div className="flex flex-col gap-1">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Category Selection</label>
                      <select className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all font-bold text-gray-600" value={prodForm.category} onChange={e => setProdForm({ ...prodForm, category: e.target.value })} required>
                        <option value="">Select a category</option>
                        {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                      </select>
                    </div>
                    <div className="lg:col-span-3">
                      <Input label="Image URL" value={prodForm.imageUrl} onChange={e => setProdForm({ ...prodForm, imageUrl: e.target.value })} required />
                    </div>
                    <div className="lg:col-span-3">
                       <textarea placeholder="Product Description" className="w-full px-6 py-4 rounded-[1.5rem] border border-gray-100 bg-gray-50 focus:bg-white focus:border-primary outline-none transition-all font-medium text-gray-600 min-h-[120px]" value={prodForm.description} onChange={e => setProdForm({ ...prodForm, description: e.target.value })} />
                    </div>
                    <div className="lg:col-span-3">
                      <Button type="submit" className="w-full py-5 text-lg font-black shadow-xl shadow-primary/20">{editingProdId ? 'Update Inventory' : 'Add to Inventory'}</Button>
                    </div>
                  </form>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8">
                   {products.map(p => (
                     <Card key={p.id} className="p-4 group relative overflow-hidden bg-white border-none shadow-sm hover:shadow-2xl transition-all duration-500 rounded-[2.5rem]">
                        <div className="aspect-video rounded-[1.5rem] overflow-hidden mb-5">
                           <ImageWithFallback src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        </div>
                        <div className="px-2 pb-2">
                           <Badge color="bg-primaryLight text-primary text-[10px] mb-2">{p.category}</Badge>
                           <h4 className="font-black text-darkGray text-lg mb-1">{p.name}</h4>
                           <p className="text-primary font-black">PKR {p.price}</p>
                        </div>
                        <div className="absolute top-6 right-6 flex gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300">
                           <button onClick={() => { setEditingProdId(p.id); setProdForm({...p, price: p.price.toString()}); }} className="w-10 h-10 bg-white rounded-xl shadow-xl text-blue-500 hover:bg-blue-500 hover:text-white transition-all flex items-center justify-center"><Edit size={18} /></button>
                           <button onClick={async () => { if(confirm('Delete?')) await deleteDoc(doc(db, 'products', p.id)); }} className="w-10 h-10 bg-white rounded-xl shadow-xl text-red-500 hover:bg-red-500 hover:text-white transition-all flex items-center justify-center"><Trash2 size={18} /></button>
                        </div>
                     </Card>
                   ))}
                </div>
              </div>
            )}

            {activeTab === 'categories' && (
              <div className="space-y-10">
                <Card className="p-10 border-none shadow-sm rounded-[3rem] bg-white max-w-2xl">
                  <h3 className="text-2xl font-black mb-8">Category Manager</h3>
                  <form onSubmit={handleSaveCategory} className="space-y-6">
                    <Input label="Category Name" value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
                    <Input label="Image URL" value={catForm.imageUrl} onChange={e => setCatForm({ ...catForm, imageUrl: e.target.value })} required />
                    <Button type="submit" className="w-full py-4 font-black shadow-lg shadow-primary/20">{editingCatId ? 'Update Category' : 'Create Category'}</Button>
                  </form>
                </Card>
                <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-5 gap-6">
                   {categories.map(c => (
                     <Card key={c.id} className="p-0 overflow-hidden group relative rounded-[2rem] shadow-sm border-none bg-white h-40">
                        <ImageWithFallback src={c.imageUrl} alt={c.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                           <h4 className="text-white font-black text-xl">{c.name}</h4>
                        </div>
                        <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                           <button onClick={() => { setEditingCatId(c.id); setCatForm({ name: c.name, imageUrl: c.imageUrl }); }} className="p-2 bg-white rounded-xl text-blue-500 shadow-xl"><Edit size={16} /></button>
                           <button onClick={async () => { if(confirm('Delete?')) await deleteDoc(doc(db, 'categories', c.id)); }} className="p-2 bg-white rounded-xl text-red-500 shadow-xl"><Trash2 size={16} /></button>
                        </div>
                     </Card>
                   ))}
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {modalConfig && (
        <Modal isOpen={modalConfig.isOpen} title={modalConfig.title} onClose={closeModal}>
          <div className="mb-8">{modalConfig.content}</div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={closeModal} className="w-full py-4">Cancel</Button>
            <Button onClick={modalConfig.onConfirm} className="w-full py-4 shadow-lg shadow-primary/20">Confirm</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};

const StatCard = ({ label, value, icon: Icon, color, bg }: any) => (
  <Card className="p-8 border-none shadow-sm group hover:scale-[1.05] transition-all duration-500 bg-white rounded-[2.5rem]">
    <div className="flex justify-between items-start mb-6">
      <div className={`p-4 rounded-2xl ${bg} ${color} group-hover:rotate-12 transition-transform duration-500`}>
        <Icon size={28} />
      </div>
      <div className="p-1.5 bg-green-50 text-green-500 rounded-lg"><ArrowUpRight size={16} /></div>
    </div>
    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mb-1">{label}</p>
    <h3 className="text-2xl font-black text-darkGray">{value}</h3>
  </Card>
);
