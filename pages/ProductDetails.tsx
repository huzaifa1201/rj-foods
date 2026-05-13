
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, addDoc, query, where, orderBy, onSnapshot, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Review } from '../types';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { Button, PageLoader, Badge, ImageWithFallback, Input, Card } from '../components/UI';
import { Plus, Minus, ShoppingBag, ArrowLeft, Heart, Share2, Clock, ShieldCheck, Utensils, Star, MessageSquare, Send, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, userProfile } = useAuth();
  const [product, setProduct] = useState<Product | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        const docRef = doc(db, 'products', id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          setProduct({ id: docSnap.id, ...docSnap.data() } as Product);
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();

    // Real-time reviews - Removed orderBy temporarily to ensure it works without complex indices
    if (id) {
      const q = query(
        collection(db, 'reviews'), 
        where('productId', '==', id)
      );
      
      const unsub = onSnapshot(q, (snap) => {
        const fetchedReviews = snap.docs.map(d => ({ id: d.id, ...d.data() } as Review));
        // Manual sort in JS to avoid index requirement
        fetchedReviews.sort((a, b) => {
          const dateA = a.createdAt?.seconds || 0;
          const dateB = b.createdAt?.seconds || 0;
          return dateB - dateA;
        });
        setReviews(fetchedReviews);
      }, (error) => {
        console.error("Reviews snapshot error:", error);
      });
      return () => unsub();
    }
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      for (let i = 0; i < quantity; i++) {
        addToCart(product);
      }
      showToast(`Added ${quantity} ${product.name} to cart`, 'success');
      navigate('/cart');
    }
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showToast('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showToast('Added to wishlist', 'success');
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return showToast('Please login to leave a review', 'error');
    if (!id || !product) return;
    if (!reviewForm.comment.trim()) return showToast('Please write a comment', 'error');

    setSubmittingReview(true);
    try {
      const reviewData = {
        productId: id,
        userId: currentUser.uid,
        userName: userProfile?.name || 'Anonymous User',
        rating: reviewForm.rating,
        comment: reviewForm.comment,
        createdAt: serverTimestamp()
      };

      await addDoc(collection(db, 'reviews'), reviewData);
      
      // Calculate new rating
      const newNumReviews = (product.numReviews || 0) + 1;
      const currentTotalRating = (product.rating || 0) * (product.numReviews || 0);
      const newRating = (currentTotalRating + reviewForm.rating) / newNumReviews;
      
      await updateDoc(doc(db, 'products', id), {
        rating: Number(newRating.toFixed(1)),
        numReviews: newNumReviews
      });

      setReviewForm({ rating: 5, comment: '' });
      showToast('Review submitted! Thank you.', 'success');
    } catch (e) {
      console.error(e);
      showToast('Error submitting review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <PageLoader />;
  
  if (!product) return (
    <div className="text-center py-20 bg-white rounded-[3rem] shadow-sm">
      <h2 className="text-3xl font-extrabold text-darkGray mb-4">Oops! Product not found</h2>
      <p className="text-gray-400 mb-8">The item you're looking for might have been removed.</p>
      <Button onClick={() => navigate('/')} className="px-10 py-4">Back to Menu</Button>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto pb-40 px-4">
      <button 
        onClick={() => navigate(-1)} 
        className="group flex items-center gap-3 text-gray-400 hover:text-primary mb-12 transition-all font-bold text-sm uppercase tracking-widest"
      >
        <div className="w-12 h-12 rounded-[1rem] bg-white shadow-sm border border-gray-100 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
          <ArrowLeft size={20} /> 
        </div>
        Back to delicious menu
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start mb-32">
        {/* Left: Product Image */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative group"
        >
          <div className="aspect-square rounded-[4rem] overflow-hidden shadow-3xl shadow-gray-200/50 bg-white border-8 border-white relative z-10">
             <ImageWithFallback 
               src={product.imageUrl} 
               alt={product.name} 
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
             />
          </div>
          
          <div className="absolute top-12 left-12 flex flex-col gap-3 z-20">
             <Badge color="bg-white/90 backdrop-blur-xl text-primary font-black px-6 py-2.5 rounded-2xl shadow-2xl uppercase tracking-[0.2em] text-[10px] border border-white">
               {product.category}
             </Badge>
          </div>
          <div className="absolute top-12 right-12 flex flex-col gap-4 z-20">
             <button 
                onClick={toggleWishlist}
                className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-2xl border border-white backdrop-blur-xl ${isInWishlist(product.id) ? 'bg-primary text-white scale-110' : 'bg-white/90 text-gray-400 hover:text-primary hover:scale-110'}`}
             >
                <Heart size={24} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
             </button>
             <button className="w-14 h-14 bg-white/90 backdrop-blur-xl rounded-2xl flex items-center justify-center text-gray-400 hover:text-primary transition-all shadow-2xl border border-white hover:scale-110">
                <Share2 size={24} />
             </button>
          </div>
        </motion.div>
        
        {/* Right: Product Info */}
        <motion.div 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex flex-col h-full pt-4"
        >
          <div className="flex-grow">
            <div className="flex items-center gap-3 mb-6">
               <div className="flex items-center gap-1 text-orange-400">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={18} className={i <= (product.rating || 0) ? "fill-orange-400" : "text-gray-200"} />
                  ))}
               </div>
               <span className="text-gray-400 font-bold text-sm">({product.numReviews || 0} Customer Reviews)</span>
            </div>

            <h1 className="text-6xl md:text-7xl font-black text-darkGray mb-8 leading-[0.9] tracking-tighter">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-8 mb-10">
               <div className="bg-primaryLight/50 px-8 py-4 rounded-[1.5rem] border border-primary/10">
                  <p className="text-5xl font-black text-primary">PKR {product.price}</p>
               </div>
               <div className="flex items-center gap-3 text-gray-400 bg-white border border-gray-100 px-6 py-4 rounded-[1.5rem] shadow-sm">
                  <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center text-primary"><Clock size={20} /></div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest leading-none">Prepare Time</p>
                    <p className="font-black text-darkGray">15-20 Min</p>
                  </div>
               </div>
            </div>

            <p className="text-gray-400 text-xl leading-relaxed mb-12 font-medium italic">"{product.description}"</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
               <div className="p-6 bg-white rounded-[2.5rem] border border-gray-50 flex items-center gap-5 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                     <ShieldCheck size={28} />
                  </div>
                  <div>
                     <p className="font-black text-darkGray">Quality Guaranteed</p>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Fresh & Hot Delivery</p>
                  </div>
               </div>
               <div className="p-6 bg-white rounded-[2.5rem] border border-gray-50 flex items-center gap-5 shadow-sm hover:shadow-xl transition-all group">
                  <div className="w-14 h-14 bg-primaryLight text-primary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                     <Utensils size={28} />
                  </div>
                  <div>
                     <p className="font-black text-darkGray">Authentic Recipe</p>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Original Taste</p>
                  </div>
               </div>
            </div>
          </div>
          
          <Card className="p-10 border-none shadow-[0_30px_60px_rgba(0,0,0,0.05)] bg-white rounded-[3.5rem] space-y-10 border border-gray-50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-3xl"></div>
            
            <div className="flex items-center justify-between relative z-10">
              <div>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em] mb-2 block">Selection</span>
                <h4 className="text-xl font-black text-darkGray">Quantity</h4>
              </div>
              <div className="flex items-center gap-8 bg-gray-50 rounded-[2rem] p-2 border border-gray-100">
                <button 
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 rounded-[1.2rem] bg-white shadow-xl flex items-center justify-center text-darkGray hover:bg-primary hover:text-white transition-all disabled:opacity-50"
                  disabled={quantity <= 1}
                >
                  <Minus size={20} strokeWidth={3} />
                </button>
                <span className="font-black text-2xl w-8 text-center text-darkGray">{quantity}</span>
                <button 
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 rounded-[1.2rem] bg-white shadow-xl flex items-center justify-center text-darkGray hover:bg-primary hover:text-white transition-all"
                >
                  <Plus size={20} strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6 relative z-10">
               <div className="flex-grow bg-darkGray px-8 py-5 rounded-[2rem] flex flex-col justify-center">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em] mb-1">Total Payable</span>
                  <span className="text-3xl font-black text-primary">PKR {product.price * quantity}</span>
               </div>
               <Button onClick={handleAddToCart} className="flex-[2] py-6 text-xl font-black shadow-3xl shadow-primary/40 rounded-[2rem] hover:scale-[1.02]">
                 <ShoppingBag className="mr-3" size={24} /> Add to Cart
               </Button>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* --- REVIEWS SECTION --- */}
      <section className="mt-40 grid grid-cols-1 lg:grid-cols-3 gap-20">
         <div className="lg:col-span-1 space-y-10">
            <div>
               <span className="text-primary font-black uppercase tracking-[0.3em] text-[10px]">Real Feedback</span>
               <h2 className="text-5xl font-black text-darkGray mt-4 tracking-tighter">Ratings & <br /> <span className="text-primary">Reviews</span></h2>
               <div className="w-20 h-2 bg-primary rounded-full mt-6"></div>
            </div>

            <Card className="p-10 border-none shadow-sm bg-white rounded-[3rem] text-center">
               <p className="text-gray-400 font-bold uppercase tracking-widest text-xs mb-4">Average Rating</p>
               <h3 className="text-7xl font-black text-darkGray mb-4">{product.rating || '0.0'}</h3>
               <div className="flex justify-center gap-1 mb-4">
                  {[1,2,3,4,5].map(i => (
                    <Star key={i} size={20} className={i <= (product.rating || 0) ? "fill-orange-400 text-orange-400" : "text-gray-200"} />
                  ))}
               </div>
               <p className="text-gray-400 font-bold">Based on {product.numReviews || 0} reviews</p>
            </Card>

            {currentUser && (
               <Card className="p-10 border-none shadow-sm bg-primary text-white rounded-[3rem] relative overflow-hidden">
                  <div className="relative z-10">
                    <h4 className="text-2xl font-black mb-6">Leave a Review</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                       <div>
                          <label className="text-[10px] font-black uppercase tracking-widest mb-3 block opacity-80">Select Rating</label>
                          <div className="flex gap-3">
                             {[1,2,3,4,5].map(i => (
                                <button 
                                  key={i} 
                                  type="button"
                                  onClick={() => setReviewForm({ ...reviewForm, rating: i })}
                                  className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${reviewForm.rating >= i ? 'bg-white text-primary scale-110 shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                                >
                                   <Star size={24} fill={reviewForm.rating >= i ? "currentColor" : "none"} />
                                </button>
                             ))}
                          </div>
                       </div>
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black uppercase tracking-widest opacity-80">Your Comment</label>
                          <textarea 
                             className="w-full bg-white rounded-[1.5rem] p-6 text-darkGray placeholder:text-gray-400 outline-none transition-all min-h-[150px] font-bold text-lg shadow-inner border-none focus:ring-4 focus:ring-white/20"
                             placeholder="Share your honest experience..."
                             style={{ color: '#1a1a1a' }}
                             value={reviewForm.comment}
                             onChange={e => setReviewForm({ ...reviewForm, comment: e.target.value })}
                          />
                       </div>
                       <Button type="submit" variant="secondary" className="w-full py-4 font-black shadow-xl" isLoading={submittingReview}>
                          Post Review <Send size={18} className="ml-2" />
                       </Button>
                    </form>
                  </div>
               </Card>
            )}
         </div>

         <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-12">
               <h3 className="text-2xl font-black text-darkGray flex items-center gap-3">
                  <MessageSquare className="text-primary" /> Latest Reviews
               </h3>
               <Badge color="bg-gray-100 text-gray-500 font-black px-4">{reviews.length}</Badge>
            </div>

            <div className="space-y-6">
               <AnimatePresence>
                  {reviews.length > 0 ? (
                    reviews.map((r, i) => (
                      <motion.div 
                        key={r.id} 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.1 }}
                      >
                         <Card className="p-8 border-none shadow-sm bg-white rounded-[2.5rem] hover:shadow-xl transition-all duration-500">
                            <div className="flex justify-between items-start mb-6">
                               <div className="flex items-center gap-4">
                                  <div className="w-14 h-14 bg-primaryLight text-primary rounded-2xl flex items-center justify-center font-black text-xl border-2 border-white shadow-lg">
                                     {r.userName?.charAt(0) || 'U'}
                                  </div>
                                  <div>
                                     <h4 className="font-black text-darkGray">{r.userName || 'Anonymous'}</h4>
                                     <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{r.createdAt ? new Date(r.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}</p>
                                  </div>
                               </div>
                               <div className="flex gap-1">
                                  {[1,2,3,4,5].map(star => (
                                    <Star key={star} size={14} className={star <= r.rating ? "fill-orange-400 text-orange-400" : "text-gray-200"} />
                                  ))}
                               </div>
                            </div>
                            <p className="text-gray-500 font-medium leading-relaxed italic text-lg">"{r.comment}"</p>
                         </Card>
                      </motion.div>
                    ))
                  ) : (
                    <div className="text-center py-20 bg-gray-50 rounded-[3rem] border border-dashed border-gray-200">
                       <MessageSquare size={48} className="mx-auto text-gray-200 mb-4" />
                       <p className="text-gray-400 font-bold italic">No reviews found for this product yet.</p>
                       <p className="text-xs text-gray-400 mt-2">(Index might be building or productId mismatch)</p>
                    </div>
                  )}
               </AnimatePresence>
            </div>
         </div>
      </section>
    </div>
  );
};