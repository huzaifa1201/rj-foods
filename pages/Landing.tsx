
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { Button, Card, PageLoader, ImageWithFallback } from '../components/UI';
import { Plus, ArrowRight, Heart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Landing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { showToast } = useToast();
  const navigate = useNavigate();

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

  const filteredProducts = selectedCategory === 'All'
    ? products
    : products.filter(p => p.category === selectedCategory);

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
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-[2rem] overflow-hidden bg-[#111] text-white p-8 md:p-20 shadow-2xl min-h-[500px] flex items-center"
      >
        <div className="absolute inset-0 z-0">
           <img 
             src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1600" 
             className="w-full h-full object-cover opacity-40" 
             alt="Hero Background"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-2xl">
          <motion.span 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block bg-primary px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-6"
          >
            Fastest Delivery in Town
          </motion.span>
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl font-extrabold mb-6 leading-[1.1]"
          >
            Savor Every <br /> <span className="text-primary">Delicious</span> Bite
          </motion.h1>
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl text-gray-300 mb-10 leading-relaxed"
          >
            Experience the finest culinary delights from FoodieFlow. 
            Fresh ingredients, master chefs, and lightning-fast delivery.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="flex flex-wrap gap-4"
          >
            <Button
              onClick={() => document.getElementById('categories')?.scrollIntoView({ behavior: 'smooth' })}
              className="px-10 py-4 text-lg font-bold shadow-xl shadow-primary/20"
            >
              Explore Menu
            </Button>
            <Button
              variant="outline"
              className="px-10 py-4 text-lg font-bold border-white/20 text-white hover:bg-white/10"
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </motion.section>

      {/* Categories Section */}
      <section id="categories" className="scroll-mt-24">
        <div className="flex justify-between items-end mb-8 px-2">
          <div>
            <h2 className="text-3xl font-extrabold text-darkGray mb-1">Browse Categories</h2>
            <p className="text-gray-400 text-sm">Delicious options for every taste</p>
          </div>
          <button onClick={() => setSelectedCategory('All')} className="text-primary font-bold text-sm hover:underline">View All</button>
        </div>

        <div className="relative group">
          <div className="flex overflow-x-auto gap-5 pb-8 no-scrollbar scroll-smooth snap-x snap-mandatory">
            {categories.length > 0 ? (
              categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -8 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`flex-shrink-0 w-48 md:w-56 cursor-pointer group relative h-36 md:h-44 rounded-[2rem] overflow-hidden shadow-sm transition-all snap-start ${selectedCategory === cat.name ? 'ring-4 ring-primary ring-offset-4 scale-[1.02]' : 'hover:shadow-xl hover:shadow-primary/10'}`}
                >
                  <ImageWithFallback src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className={`absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent flex flex-col justify-end p-5 transition-all ${selectedCategory === cat.name ? 'bg-primary/30' : ''}`}>
                    <h3 className="text-white font-bold text-lg md:text-xl transform group-hover:translate-x-1 transition-transform">{cat.name}</h3>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="w-full py-10 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                 <p className="text-gray-400">No categories added yet.</p>
              </div>
            )}
          </div>
          {/* Scroll Fade Effects */}
          <div className="absolute right-0 top-0 bottom-8 w-20 bg-gradient-to-l from-gray-50 to-transparent pointer-events-none"></div>
          <div className="absolute left-0 top-0 bottom-8 w-20 bg-gradient-to-r from-gray-50 to-transparent pointer-events-none"></div>
        </div>
      </section>

      {/* Product Grid */}
      <section id="menu" className="scroll-mt-24">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-3xl font-bold text-darkGray">
             {selectedCategory === 'All' ? 'Our Menu' : selectedCategory}
           </h2>
           {selectedCategory !== 'All' && (
             <button onClick={() => setSelectedCategory('All')} className="text-primary font-bold text-sm hover:underline">Clear Filter</button>
           )}
        </div>

        <AnimatePresence mode="wait">
          {filteredProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-white rounded-[2rem] shadow-sm border border-gray-100"
            >
              <p className="text-gray-400 text-lg mb-4">No products found in this category.</p>
              <Button variant="outline" onClick={() => setSelectedCategory('All')}>Browse All Items</Button>
            </motion.div>
          ) : (
            <motion.div
              key={selectedCategory}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
            >
              {filteredProducts.map((product) => (
                <Card key={product.id} className="p-4 flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-none group bg-white relative">
                  <div
                    className="relative aspect-square mb-5 rounded-[1.5rem] overflow-hidden cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-3 left-3">
                       <button 
                         onClick={(e) => toggleWishlist(e, product)}
                         className={`p-2.5 rounded-xl backdrop-blur-md shadow-lg transition-all ${isInWishlist(product.id) ? 'bg-primary text-white' : 'bg-white/80 text-gray-400 hover:text-primary'}`}
                       >
                         <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
                       </button>
                    </div>
                    <div className="absolute top-3 right-3">
                       <span className="bg-white/90 backdrop-blur-sm text-darkGray font-extrabold text-sm px-3 py-1.5 rounded-xl shadow-lg">
                         PKR {product.price}
                       </span>
                    </div>
                  </div>
                  <div className="flex-grow px-2">
                    <h3
                      className="font-bold text-xl text-darkGray mb-2 cursor-pointer hover:text-primary transition-colors line-clamp-1"
                      onClick={() => navigate(`/product/${product.id}`)}
                    >
                      {product.name}
                    </h3>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6 leading-relaxed">{product.description}</p>
                  </div>
                  <Button
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full py-4 rounded-2xl font-bold shadow-lg shadow-primary/10 group-hover:shadow-primary/30"
                  >
                    <Plus size={20} className="mr-2" /> Add to Cart
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