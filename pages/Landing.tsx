import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Button, Card, PageLoader, ImageWithFallback } from '../components/UI';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

export const Landing = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
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
  }, []);

  const categories = ['All', ...Array.from(new Set(products.map(p => p.category || 'Other'))).filter(c => c !== 'Other'), 'Other'];

  const filteredProducts = selectedCategory === 'All' 
    ? products 
    : products.filter(p => (p.category || 'Other') === selectedCategory);

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    addToCart(product);
    showToast(`Added ${product.name} to cart`, 'success');
  };

  // Animation Variants
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-primary to-primaryDark text-white p-8 md:p-16 text-center md:text-left shadow-2xl shadow-primary/30"
      >
        <div className="relative z-10 max-w-2xl">
          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-6xl font-bold mb-6 leading-tight"
          >
            Craving Delicious <br /> Food?
          </motion.h1>
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl opacity-90 mb-8"
          >
            Order from RJ Foods and get the best meals delivered to your doorstep instantly.
          </motion.p>
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
          >
            <Button 
              onClick={() => document.getElementById('menu')?.scrollIntoView({ behavior: 'smooth' })}
              className="bg-white text-primary hover:bg-gray-100 border-none px-8 py-3 text-lg"
            >
              Order Now
            </Button>
          </motion.div>
        </div>
        {/* Abstract Floating Shapes */}
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"
        />
        <motion.div 
          animate={{ y: [0, 20, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-0 w-96 h-96 bg-black/10 rounded-full blur-3xl translate-y-1/3 -translate-x-1/3"
        />
      </motion.section>

      {/* Product Grid */}
      <section id="menu">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h2 className="text-3xl font-bold text-darkGray">Our Menu</h2>
          
          <div className="flex flex-wrap gap-2">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                    : 'bg-white text-gray-500 hover:bg-gray-100 hover:text-darkGray border border-gray-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        {filteredProducts.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl">
            <p className="text-gray-500">No products found in this category.</p>
            <Button variant="outline" className="mt-4" onClick={() => setSelectedCategory('All')}>View All</Button>
          </div>
        ) : (
          <motion.div 
            variants={container}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {filteredProducts.map((product) => (
              <motion.div key={product.id} variants={item}>
                <Card className="p-4 flex flex-col h-full hover:shadow-2xl transition-shadow duration-300">
                  <div 
                    className="relative aspect-square mb-4 rounded-2xl overflow-hidden group cursor-pointer"
                    onClick={() => navigate(`/product/${product.id}`)}
                  >
                     <ImageWithFallback 
                       src={product.imageUrl} 
                       alt={product.name}
                       className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                     />
                  </div>
                  <div className="flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 
                        className="font-bold text-lg text-darkGray leading-tight cursor-pointer hover:text-primary transition-colors"
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        {product.name}
                      </h3>
                      <span className="bg-primaryLight text-primary font-bold text-sm px-2 py-1 rounded-md">
                        PKR {product.price}
                      </span>
                    </div>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">{product.description}</p>
                  </div>
                  <Button 
                    onClick={(e) => handleAddToCart(e, product)}
                    className="w-full mt-auto"
                  >
                    <Plus size={18} /> Add to Cart
                  </Button>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>
    </div>
  );
};