
import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, updateDoc, doc, deleteDoc, serverTimestamp, query, orderBy, where, onSnapshot, setDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Product, Order, PaymentMethod, UserProfile, PageContent } from '../types';
import { Button, Input, Card, Badge, PageLoader, Modal, ImageWithFallback } from '../components/UI';
import { Trash2, Edit, Check, X, Plus, BarChart3, User, LogOut, Package, CreditCard, Users, Search, Filter, Database, FileText, Save } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { dummyProducts, defaultPages } from '../utils/dummyData';

export const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'orders' | 'products' | 'payments' | 'users' | 'reports' | 'profile' | 'content'>('orders');
  const [loading, setLoading] = useState(false);
  const { userProfile } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  // Data States
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [payments, setPayments] = useState<PaymentMethod[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [pages, setPages] = useState<PageContent[]>([]);

  // Filtering & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Confirmation Modal State
  const [modalConfig, setModalConfig] = useState<{isOpen: boolean, title: string, content: React.ReactNode, onConfirm: () => void} | null>(null);

  // Form States (Product)
  const [prodForm, setProdForm] = useState({ name: '', price: '', description: '', imageUrl: '', category: '' });
  const [editingProdId, setEditingProdId] = useState<string | null>(null);

  // Form States (Payment)
  const [payForm, setPayForm] = useState({ name: '', number: '' });

  // Form States (Profile)
  const [adminName, setAdminName] = useState('');
  const [adminPhone, setAdminPhone] = useState('');

  // Form States (Content)
  const [editingPage, setEditingPage] = useState<PageContent | null>(null);
  const [pageContent, setPageContent] = useState('');
  const [pageTitle, setPageTitle] = useState('');

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

    fetchStaticData();
    fetchPages();

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  const fetchStaticData = async () => {
    try {
      const paySnap = await getDocs(collection(db, 'paymentMethods'));
      setPayments(paySnap.docs.map(d => ({ id: d.id, ...d.data() } as PaymentMethod)));

      const uSnap = await getDocs(collection(db, 'users'));
      setUsers(uSnap.docs.map(d => ({ ...d.data() } as UserProfile)));
    } catch (e) {
      console.error(e);
    }
  };

  const fetchPages = async () => {
    try {
      const pSnap = await getDocs(collection(db, 'content_pages'));
      setPages(pSnap.docs.map(d => ({ id: d.id, ...d.data() } as PageContent)));
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (userProfile) {
      setAdminName(userProfile.name);
      setAdminPhone(userProfile.phone);
    }
  }, [userProfile]);

  const filteredOrders = orders.filter(order => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = 
      order.id.toLowerCase().includes(searchLower) || 
      order.customerName.toLowerCase().includes(searchLower) ||
      order.customerPhone.includes(searchLower);
    
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const closeModal = () => setModalConfig(null);
  
  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setModalConfig({
      isOpen: true,
      title,
      content: <p className="text-gray-600">{message}</p>,
      onConfirm: async () => {
        await onConfirm();
        closeModal();
      }
    });
  };

  // --- Seed Data Logic ---
  const handleSeedProducts = async () => {
    showConfirm("Seed Database", "This will add dummy products to your database. Continue?", async () => {
      setLoading(true);
      try {
        const batchPromises = dummyProducts.map(p => 
          addDoc(collection(db, 'products'), {
            ...p,
            createdAt: serverTimestamp()
          })
        );
        await Promise.all(batchPromises);
        showToast(`Added ${dummyProducts.length} dummy products!`, 'success');
      } catch (e) {
        showToast('Error seeding products', 'error');
      } finally {
        setLoading(false);
      }
    });
  };

  const handleSeedPages = async () => {
    showConfirm("Reset Content Pages", "This will create/reset Terms, Privacy, etc. pages. Continue?", async () => {
      setLoading(true);
      try {
        const batchPromises = defaultPages.map(p => 
          setDoc(doc(db, 'content_pages', p.id), {
            title: p.title,
            content: p.content,
            updatedAt: serverTimestamp()
          })
        );
        await Promise.all(batchPromises);
        fetchPages();
        showToast('Content pages created/reset!', 'success');
      } catch (e) {
        showToast('Error creating pages', 'error');
      } finally {
        setLoading(false);
      }
    });
  };

  // --- Content Logic ---
  const handleEditPage = (page: PageContent) => {
    setEditingPage(page);
    setPageTitle(page.title);
    setPageContent(page.content);
  };

  const handleSavePage = async () => {
    if (!editingPage) return;
    try {
      await updateDoc(doc(db, 'content_pages', editingPage.id), {
        title: pageTitle,
        content: pageContent,
        updatedAt: serverTimestamp()
      });
      fetchPages();
      setEditingPage(null);
      showToast('Page updated successfully', 'success');
    } catch (e) {
      showToast('Error updating page', 'error');
    }
  };


  // --- Product Logic ---
  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prodForm.name || !prodForm.price) return;
    
    try {
      const payload = {
        ...prodForm,
        price: Number(prodForm.price),
        createdAt: serverTimestamp()
      };

      if (editingProdId) {
        await updateDoc(doc(db, 'products', editingProdId), payload);
        showToast('Product updated successfully', 'success');
      } else {
        await addDoc(collection(db, 'products'), payload);
        showToast('Product added successfully', 'success');
      }
      setProdForm({ name: '', price: '', description: '', imageUrl: '', category: '' });
      setEditingProdId(null);
    } catch (error) {
      showToast('Error saving product', 'error');
    }
  };

  const handleDeleteProduct = (id: string) => {
    showConfirm("Delete Product", "Are you sure you want to delete this product? This action cannot be undone.", async () => {
      try {
        await deleteDoc(doc(db, 'products', id));
        showToast('Product deleted', 'info');
      } catch (e) {
        showToast('Failed to delete product', 'error');
      }
    });
  };

  const handleEditProduct = (p: Product) => {
    setProdForm({ 
      name: p.name, 
      price: p.price.toString(), 
      description: p.description, 
      imageUrl: p.imageUrl, 
      category: p.category 
    });
    setEditingProdId(p.id);
    setActiveTab('products');
    window.scrollTo(0, 0);
  };

  // --- Order Logic ---
  const handleOrderStatus = async (orderId: string, status: Order['status']) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
      showToast(`Order status updated to ${status}`, 'success');
    } catch (e) {
      showToast('Failed to update status', 'error');
    }
  };

  // --- Payment Logic ---
  const handleAddPayment = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await addDoc(collection(db, 'paymentMethods'), { ...payForm, status: 'active' });
      setPayForm({ name: '', number: '' });
      fetchStaticData();
      showToast('Payment method added', 'success');
    } catch (e) {
      showToast('Error adding payment method', 'error');
    }
  };

  const togglePaymentStatus = async (p: PaymentMethod) => {
    try {
      const newStatus = p.status === 'active' ? 'inactive' : 'active';
      await updateDoc(doc(db, 'paymentMethods', p.id), { status: newStatus });
      fetchStaticData();
      showToast(`Payment method ${newStatus}`, 'info');
    } catch (e) {
      showToast('Error updating status', 'error');
    }
  };

  // --- User Logic ---
  const toggleUserRole = (u: UserProfile) => {
    const newRole = u.role === 'admin' ? 'user' : 'admin';
    showConfirm("Change User Role", `Are you sure you want to change ${u.name}'s role to ${newRole}?`, async () => {
      try {
        await updateDoc(doc(db, 'users', u.uid), { role: newRole });
        fetchStaticData();
        showToast(`User role changed to ${newRole}`, 'success');
      } catch (e) {
        showToast('Error updating role', 'error');
      }
    });
  };

  // --- Profile Logic ---
  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userProfile) return;
    try {
      await updateDoc(doc(db, 'users', userProfile.uid), {
        name: adminName,
        phone: adminPhone
      });
      showToast('Admin profile updated!', 'success');
    } catch(e) {
      showToast('Error updating profile', 'error');
    }
  };

  const getTopProducts = () => {
    const counts: Record<string, number> = {};
    orders.forEach(o => {
      o.items.forEach(i => {
        counts[i.name] = (counts[i.name] || 0) + i.quantity;
      });
    });
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 5);
  };

  const logout = async () => {
    await auth.signOut();
    navigate('/admin/login');
  };

  const tabs = [
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'products', label: 'Products', icon: Plus },
    { id: 'payments', label: 'Payments', icon: CreditCard },
    { id: 'content', label: 'Content', icon: FileText },
    { id: 'users', label: 'Users', icon: Users },
    { id: 'reports', label: 'Reports', icon: BarChart3 },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-darkGray">Admin Dashboard</h1>
        <Button onClick={logout} variant="secondary" className="text-sm">
          <LogOut size={16} /> Logout
        </Button>
      </div>

      <div className="flex flex-wrap gap-2 mb-6 bg-white p-2 rounded-2xl shadow-sm overflow-x-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all ${activeTab === tab.id ? 'bg-darkGray text-white shadow-lg' : 'bg-transparent text-gray-500 hover:bg-gray-100'}`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
             <Card className="text-center py-4">
               <div className="text-3xl font-bold text-primary">{orders.length}</div>
               <div className="text-sm text-gray-500">Total Orders</div>
             </Card>
             <Card className="text-center py-4">
               <div className="text-3xl font-bold text-yellow-500">{orders.filter(o => o.status === 'Pending').length}</div>
               <div className="text-sm text-gray-500">Pending</div>
             </Card>
             <Card className="text-center py-4">
               <div className="text-3xl font-bold text-green-500">{orders.reduce((sum, o) => sum + o.total, 0).toLocaleString()}</div>
               <div className="text-sm text-gray-500">Total Revenue (PKR)</div>
             </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-4 mb-6">
             <div className="relative flex-grow">
               <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               <input 
                 type="text" 
                 placeholder="Search by ID, Name or Phone..." 
                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all bg-white"
                 value={searchQuery}
                 onChange={(e) => setSearchQuery(e.target.value)}
               />
             </div>
             <div className="relative min-w-[200px]">
               <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
               <select 
                 className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-primary bg-white appearance-none cursor-pointer"
                 value={statusFilter}
                 onChange={(e) => setStatusFilter(e.target.value)}
               >
                 <option value="All">All Statuses</option>
                 <option value="Pending">Pending</option>
                 <option value="Preparing">Preparing</option>
                 <option value="Out for Delivery">Out for Delivery</option>
                 <option value="Delivered">Delivered</option>
                 <option value="Cancelled">Cancelled</option>
               </select>
             </div>
          </div>

          {filteredOrders.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-3xl text-gray-500">
              No orders found matching your criteria.
            </div>
          ) : (
            filteredOrders.map(order => (
              <Card key={order.id} className="border-l-4 border-primary animate-fade-in">
                <div className="flex flex-col lg:flex-row justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex justify-between items-start">
                       <h3 className="font-bold text-lg">Order #{order.id.slice(0,6)}</h3>
                       <span className={`px-2 py-1 rounded text-xs font-bold text-white ${order.status === 'Delivered' ? 'bg-green-500' : order.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                         {order.status}
                       </span>
                    </div>
                    <p className="text-sm text-gray-500 mb-1"><span className="font-bold">Customer:</span> {order.customerName} | {order.customerPhone}</p>
                    <p className="text-sm text-gray-500 mb-2"><span className="font-bold">Address:</span> {order.customerAddress}</p>
                    
                    <div className="bg-gray-50 p-2 rounded-lg text-sm mb-2">
                      {order.items.map((item, i) => (
                        <div key={i}>{item.quantity}x {item.name}</div>
                      ))}
                    </div>

                    {order.paymentMethod !== 'COD' && (
                      <div className="text-xs bg-primaryLight text-primary p-2 rounded mb-2">
                         <strong>Online Payment:</strong> {order.paymentMethod} <br/>
                         <strong>TxID:</strong> {order.transactionId} <br/>
                         {order.screenshotUrl && (
                           <a href={order.screenshotUrl} target="_blank" rel="noreferrer" className="underline font-bold">View Screenshot</a>
                         )}
                      </div>
                    )}
                    <p className="font-bold text-primary">Total: PKR {order.total}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(order.createdAt?.seconds * 1000).toLocaleString()}</p>
                  </div>

                  <div className="flex flex-col gap-2 min-w-[150px]">
                    <p className="text-xs font-bold text-gray-400 uppercase">Change Status</p>
                    {['Pending', 'Preparing', 'Out for Delivery', 'Delivered', 'Cancelled'].map((status) => (
                      <button 
                        key={status}
                        disabled={order.status === status}
                        onClick={() => handleOrderStatus(order.id, status as any)}
                        className={`text-xs py-1.5 px-2 rounded border transition-colors ${order.status === status ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'border-gray-300 hover:bg-primary hover:text-white hover:border-primary'}`}
                      >
                        {status}
                      </button>
                    ))}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
             <h3 className="font-bold text-xl">Product Management</h3>
             <Button onClick={handleSeedProducts} variant="outline" className="text-xs py-2" isLoading={loading}>
               <Database size={16} /> Seed Dummy Products
             </Button>
          </div>

          <Card>
            <h3 className="font-bold mb-4">{editingProdId ? 'Edit Product' : 'Add New Product'}</h3>
            <div className="flex flex-col md:flex-row gap-6">
              {/* Image Preview for Admin */}
              <div className="w-full md:w-1/3">
                 <div className="aspect-square bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
                    <ImageWithFallback src={prodForm.imageUrl} alt="Preview" className="w-full h-full object-cover" />
                 </div>
                 <p className="text-xs text-center text-gray-400 mt-2">Image Preview</p>
              </div>

              <form onSubmit={handleSaveProduct} className="w-full md:w-2/3 grid grid-cols-1 md:grid-cols-2 gap-4 h-fit">
                <Input placeholder="Product Name" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} required />
                <Input placeholder="Price (PKR)" type="number" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} required />
                <Input placeholder="Category" value={prodForm.category} onChange={e => setProdForm({...prodForm, category: e.target.value})} />
                <Input placeholder="Image URL (http://...)" value={prodForm.imageUrl} onChange={e => setProdForm({...prodForm, imageUrl: e.target.value})} required />
                <div className="md:col-span-2">
                  <Input placeholder="Description" value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} />
                </div>
                <Button type="submit" className="md:col-span-2">{editingProdId ? 'Update Product' : 'Add Product'}</Button>
                {editingProdId && <Button type="button" variant="secondary" onClick={() => { setEditingProdId(null); setProdForm({ name: '', price: '', description: '', imageUrl: '', category: '' }); }} className="md:col-span-2">Cancel Edit</Button>}
              </form>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map(p => (
              <Card key={p.id} className="relative group">
                <div className="flex gap-4">
                  <ImageWithFallback src={p.imageUrl} alt={p.name} className="w-20 h-20 rounded-lg object-cover" />
                  <div>
                    <h4 className="font-bold">{p.name}</h4>
                    <p className="text-primary font-bold">PKR {p.price}</p>
                    <p className="text-xs text-gray-500">{p.category}</p>
                  </div>
                </div>
                {/* VISIBILITY FIX: Buttons now visible on mobile by default, hover only on desktop */}
                <div className="absolute top-2 right-2 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                  <button onClick={() => handleEditProduct(p)} className="p-2 bg-white rounded-full shadow text-blue-500 hover:scale-110 transition-transform"><Edit size={16} /></button>
                  <button onClick={() => handleDeleteProduct(p.id)} className="p-2 bg-white rounded-full shadow text-red-500 hover:scale-110 transition-transform"><Trash2 size={16} /></button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'content' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="font-bold text-xl">Pages Content Management</h3>
            {pages.length === 0 && (
              <Button onClick={handleSeedPages} variant="outline" className="text-xs py-2" isLoading={loading}>
                <Database size={16} /> Create Default Pages
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Pages List */}
            <div className="col-span-1 space-y-3">
              {pages.map(page => (
                <div 
                  key={page.id} 
                  onClick={() => handleEditPage(page)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${editingPage?.id === page.id ? 'border-primary bg-primaryLight' : 'border-gray-200 bg-white hover:border-primary/50'}`}
                >
                  <h4 className="font-bold text-darkGray">{page.title}</h4>
                  <p className="text-xs text-gray-500 truncate">/{page.id}</p>
                </div>
              ))}
              {pages.length === 0 && <p className="text-gray-500 text-sm">No pages found. Click 'Create Default Pages' to start.</p>}
            </div>

            {/* Editor */}
            <div className="col-span-1 md:col-span-2">
              <Card>
                {editingPage ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-bold">Editing: {editingPage.title}</h3>
                      <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">Slug: {editingPage.id}</span>
                    </div>
                    
                    <Input 
                      label="Page Title"
                      value={pageTitle} 
                      onChange={(e) => setPageTitle(e.target.value)} 
                    />
                    
                    <div>
                      <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Content</label>
                      <textarea 
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all bg-white/80 backdrop-blur-sm h-64"
                        value={pageContent}
                        onChange={(e) => setPageContent(e.target.value)}
                      />
                      <p className="text-xs text-gray-400 mt-1">Basic text formatting is preserved.</p>
                    </div>

                    <div className="flex gap-3 justify-end">
                      <Button variant="secondary" onClick={() => setEditingPage(null)}>Cancel</Button>
                      <Button onClick={handleSavePage}>
                        <Save size={16} /> Save Changes
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="h-64 flex flex-col items-center justify-center text-gray-400">
                    <FileText size={48} className="mb-4 opacity-50" />
                    <p>Select a page from the list to edit its content.</p>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'payments' && (
        <div className="space-y-6">
          <Card>
             <h3 className="font-bold mb-4">Add Payment Method</h3>
             <form onSubmit={handleAddPayment} className="flex flex-col md:flex-row gap-4">
               <Input placeholder="Method Name (e.g., JazzCash)" value={payForm.name} onChange={e => setPayForm({...payForm, name: e.target.value})} required />
               <Input placeholder="Account Number / Info" value={payForm.number} onChange={e => setPayForm({...payForm, number: e.target.value})} required />
               <Button type="submit">Add</Button>
             </form>
          </Card>
          <div className="space-y-2">
            {payments.map(p => (
              <Card key={p.id} className="flex justify-between items-center py-4">
                <div>
                  <h4 className="font-bold">{p.name}</h4>
                  <p className="text-gray-500 text-sm">{p.number}</p>
                </div>
                <div className="flex items-center gap-4">
                  <Badge color={p.status === 'active' ? 'bg-green-500' : 'bg-red-500'}>{p.status}</Badge>
                  <button onClick={() => togglePaymentStatus(p)} className="text-sm underline">Toggle Status</button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'users' && (
        <Card className="overflow-hidden">
          {/* VISIBILITY FIX: Added overflow-x-auto to prevent table breaking layout on mobile */}
          <div className="overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="pb-2 pl-2">Name</th>
                  <th className="pb-2">Email</th>
                  <th className="pb-2">Role</th>
                  <th className="pb-2">Action</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u.uid} className="border-b border-gray-50 last:border-0 hover:bg-gray-50 transition-colors">
                    <td className="py-3 pl-2">{u.name}</td>
                    <td className="py-3 text-sm text-gray-500">{u.email}</td>
                    <td className="py-3">
                      <Badge color={u.role === 'admin' ? 'bg-primary' : 'bg-gray-400'}>{u.role}</Badge>
                    </td>
                    <td className="py-3">
                      <button onClick={() => toggleUserRole(u)} className="text-xs bg-white border border-gray-200 hover:bg-gray-100 px-3 py-1 rounded shadow-sm">
                        Switch Role
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {activeTab === 'reports' && (
        <div className="space-y-6">
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <Card>
               <h3 className="font-bold text-xl mb-6">Sales Overview</h3>
               <div className="space-y-4">
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Orders</span>
                    <span className="font-bold text-xl">{orders.length}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Total Revenue</span>
                    <span className="font-bold text-xl text-primary">PKR {orders.reduce((acc, curr) => acc + curr.total, 0).toLocaleString()}</span>
                 </div>
                 <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                    <span className="text-gray-600">Avg. Order Value</span>
                    <span className="font-bold text-xl">PKR {orders.length > 0 ? Math.round(orders.reduce((acc, curr) => acc + curr.total, 0) / orders.length) : 0}</span>
                 </div>
               </div>
             </Card>

             <Card>
               <h3 className="font-bold text-xl mb-6">Top Selling Products</h3>
               <div className="space-y-3">
                 {getTopProducts().map(([name, count], index) => (
                   <div key={index} className="flex justify-between items-center border-b border-gray-100 pb-2 last:border-0">
                     <div className="flex items-center gap-3">
                       <span className="w-6 h-6 bg-primaryLight text-primary rounded-full flex items-center justify-center text-xs font-bold">{index + 1}</span>
                       <span className="font-medium">{name}</span>
                     </div>
                     <span className="text-sm font-bold text-gray-500">{count} sold</span>
                   </div>
                 ))}
                 {getTopProducts().length === 0 && <p className="text-gray-500">No sales data yet.</p>}
               </div>
             </Card>
           </div>
        </div>
      )}

      {activeTab === 'profile' && (
        <div className="max-w-2xl mx-auto">
          <Card>
            <div className="flex items-center gap-4 mb-8">
               <div className="w-20 h-20 bg-darkGray text-white rounded-full flex items-center justify-center">
                 <User size={40} />
               </div>
               <div>
                 <h2 className="text-2xl font-bold">{userProfile?.name}</h2>
                 <Badge color="bg-darkGray">Administrator</Badge>
               </div>
            </div>

            <form onSubmit={handleUpdateProfile} className="space-y-4">
              <Input 
                label="Full Name" 
                value={adminName} 
                onChange={e => setAdminName(e.target.value)} 
              />
              <Input 
                label="Phone Number" 
                value={adminPhone} 
                onChange={e => setAdminPhone(e.target.value)} 
              />
              <Input 
                label="Email" 
                value={userProfile?.email} 
                disabled 
                className="opacity-50 cursor-not-allowed"
              />
              <Button type="submit" className="w-full bg-darkGray hover:bg-black">
                Update Profile
              </Button>
            </form>
          </Card>
        </div>
      )}

      {modalConfig && (
        <Modal 
          isOpen={modalConfig.isOpen} 
          title={modalConfig.title} 
          onClose={closeModal}
        >
          <div className="mb-6">
            {modalConfig.content}
          </div>
          <div className="flex gap-4">
            <Button variant="secondary" onClick={closeModal} className="w-full">Cancel</Button>
            <Button onClick={modalConfig.onConfirm} className="w-full bg-primary hover:bg-primaryDark">Confirm</Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
