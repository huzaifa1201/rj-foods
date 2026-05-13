
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { Button, Card, PageLoader, ImageWithFallback } from '../components/UI';
import { Plus, ArrowRight, Heart, Search, Filter } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Menu = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for category in navigation state
    if (location.state && (location.state as any).category) {
      setSelectedCategory((location.state as any).category);
    }
  }, [location]);

  useEffect(() => {
    // Listen for Categories
    const qCats = query(collection(db, 'categories'), orderBy('name', 'asc'));
    const unsubCats = onSnapshot(qCats, (snap) => {
      setCategories(snap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));
    });

    // Fetch Products
    const fetchProducts = async () => {
      try {
        const q = query(collection(db, 'products'), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(q);
        const prods: Product[] = [];
        querySnapshot.forEach((doc) => {
          prods.push({ id: doc.id, ...doc.data() } as Product);
        });
        setProducts(prods);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
    return () => unsubCats();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.description.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`Added ${product.name} to cart`, 'success');
  };

  const toggleWishlist = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist', 'success');
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-12 pb-20">
      {/* Search & Header */}
      <section className="bg-white p-10 rounded-[3rem] shadow-sm border border-gray-50">
         <div className="max-w-4xl mx-auto text-center space-y-8">
            <h1 className="text-5xl font-black text-darkGray tracking-tight">Discover Our <span className="text-primary">Delicious Menu</span></h1>
            <div className="relative group">
               <Search className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={24} />
               <input 
                 type="text" 
                 placeholder="Search for your favorite food..." 
                 className="w-full pl-16 pr-8 py-6 rounded-full bg-gray-50 border-none focus:ring-4 focus:ring-primary/10 outline-none font-bold text-lg text-darkGray transition-all shadow-inner"
                 value={searchTerm}
                 onChange={(e) => setSearchTerm(e.target.value)}
               />
            </div>
         </div>
      </section>

      {/* Categories Slider */}
      <section id="categories" className="scroll-mt-24">
        <div className="flex items-center gap-4 mb-8 overflow-x-auto no-scrollbar pb-4">
           <button 
             onClick={() => setSelectedCategory('All')}
             className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black transition-all ${selectedCategory === 'All' ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white text-gray-400 hover:bg-primaryLight hover:text-primary'}`}
           >
             All Items
           </button>
           {categories.map((cat) => (
             <button
               key={cat.id}
               onClick={() => setSelectedCategory(cat.name)}
               className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black flex items-center gap-3 transition-all ${selectedCategory === cat.name ? 'bg-primary text-white shadow-xl shadow-primary/20 scale-105' : 'bg-white text-gray-400 hover:bg-primaryLight hover:text-primary'}`}
             >
               <div className="w-8 h-8 rounded-full overflow-hidden border-2 border-white/20">
                  <img src={cat.imageUrl} className="w-full h-full object-cover" alt="" />
               </div>
               {cat.name}
             </button>
           ))}
        </div>
      </section>

      {/* Product Grid */}
      <section id="menu">
        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-100 flex flex-col items-center"
            >
              <div className="w-20 h-20 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
                 <Filter size={40} />
              </div>
              <p className="text-gray-400 text-xl font-bold mb-6">No results found for your search.</p>
              <Button variant="outline" onClick={() => { setSearchTerm(''); setSelectedCategory('All'); }}>Clear All Filters</Button>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory + searchTerm}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-4 flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-none group bg-white relative rounded-[2.5rem]">
                  <div
                    className="relative aspect-square mb-5 rounded-[2rem] overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                       <button 
                         onClick={(e) => toggleWishlist(e, product)}
                         className={`p-3 rounded-2xl backdrop-blur-md shadow-lg transition-all ${isInWishlist(product.id) ? 'bg-primary text-white' : 'bg-white/80 text-gray-400 hover:text-primary'}`}
                       >
                         <Heart size={20} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                       </button>
                    </div>
                    <div className="absolute bottom-4 right-4">
                       <span className="bg-white/90 backdrop-blur-sm text-darkGray font-black text-sm px-4 py-2 rounded-2xl shadow-xl border border-white/20">
                         PKR {product.price}
                       </span>
                    </div>
                  </div>
                  <div className="flex-grow px-2">
                    <h3
                      className="font-black text-2xl text-darkGray mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-1"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-8 leading-relaxed font-medium">{product.description}</p>
                  </div>
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full py-5 rounded-[1.5rem] font-black shadow-xl shadow-primary/10 group-hover:shadow-primary/30"
                  >
                    <Plus size={24} className="mr-2" /> Add to Cart
                  </Button>
                </Card>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
};
