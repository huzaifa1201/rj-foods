
import React from 'react';
import { useWishlist } from '../context/WishlistContext';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { Card, Button, ImageWithFallback } from '../components/UI';
import { Trash2, ShoppingCart, Heart, ArrowLeft, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const handleMoveToCart = (product: any) => {
    addToCart(product);
    removeFromWishlist(product.id);
    showToast(`${product.name} moved to cart`, 'success');
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex items-center justify-between mb-12">
         <div>
            <h1 className="text-4xl font-black text-darkGray mb-2 flex items-center gap-4">
               My Wishlist <Heart className="text-primary fill-primary" />
            </h1>
            <p className="text-gray-400 font-medium italic">Items you've saved for later</p>
         </div>
         <Button variant="outline" onClick={() => navigate('/')} className="flex gap-2">
            <ArrowLeft size={18} /> Back to Menu
         </Button>
      </div>

      <AnimatePresence mode="popLayout">
        {wishlist.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-32 bg-white rounded-[3rem] shadow-sm border border-gray-50 flex flex-col items-center"
          >
            <div className="w-24 h-24 bg-gray-50 text-gray-200 rounded-full flex items-center justify-center mb-6">
               <Heart size={48} />
            </div>
            <h2 className="text-2xl font-bold text-darkGray mb-2">Your wishlist is empty</h2>
            <p className="text-gray-400 mb-8">Start adding your favorite meals to your wishlist!</p>
            <Button onClick={() => navigate('/')} className="px-10 py-4">Explore Menu</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {wishlist.map((product) => (
              <motion.div
                key={product.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="p-4 flex flex-col h-full hover:shadow-2xl transition-all duration-500 border-none group bg-white relative">
                  <div className="relative aspect-square mb-5 rounded-[2rem] overflow-hidden">
                    <ImageWithFallback
                      src={product.imageUrl}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <button 
                       onClick={() => removeFromWishlist(product.id)}
                       className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm text-red-500 rounded-2xl shadow-lg hover:bg-red-500 hover:text-white transition-all"
                    >
                       <Trash2 size={18} />
                    </button>
                  </div>
                  
                  <div className="flex-grow px-2">
                    <div className="flex justify-between items-start mb-2">
                       <h3 className="font-bold text-xl text-darkGray">{product.name}</h3>
                       <span className="bg-primaryLight text-primary font-black px-3 py-1 rounded-xl text-sm">PKR {product.price}</span>
                    </div>
                    <p className="text-gray-400 text-sm line-clamp-2 mb-6">{product.description}</p>
                  </div>

                  <div className="flex gap-2">
                     <Button 
                        onClick={() => handleMoveToCart(product)}
                        className="flex-grow py-4 rounded-2xl font-black shadow-lg shadow-primary/10"
                     >
                        <Plus size={18} className="mr-2" /> Add to Cart
                     </Button>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
