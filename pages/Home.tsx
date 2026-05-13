
import React, { useEffect, useState } from 'react';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../firebase';
import { Product, Category } from '../types';
import { Button, Card, ImageWithFallback } from '../components/UI';
import { 
  ArrowRight, Star, Clock, ShieldCheck, Heart, ShoppingBag, 
  ChevronRight, Play, CheckCircle2, MapPin, Phone, MessageSquare,
  Users, Award, Zap, CreditCard, Utensils as UtensilsIcon
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';

export const Home = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catSnap = await getDocs(query(collection(db, 'categories'), limit(6)));
        setCategories(catSnap.docs.map(d => ({ id: d.id, ...d.data() } as Category)));

        const prodSnap = await getDocs(query(collection(db, 'products'), limit(4)));
        setFeaturedProducts(prodSnap.docs.map(d => ({ id: d.id, ...d.data() } as Product)));
      } catch (e) {
        console.error(e);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-40 pb-40 overflow-hidden">
      {/* --- HERO SECTION --- */}
      <section className="relative min-h-[90vh] flex items-center pt-20">
         <div className="absolute top-0 right-0 w-1/2 h-full bg-primaryLight/30 rounded-bl-[20rem] -z-10 blur-3xl opacity-50"></div>
         <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-primary/5 rounded-tr-[15rem] -z-10 blur-2xl"></div>

         <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
            <motion.div
               initial={{ opacity: 0, x: -50 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ duration: 0.8 }}
            >
               <div className="inline-flex items-center gap-3 bg-white border border-gray-100 px-6 py-3 rounded-full shadow-xl shadow-gray-200/50 mb-10">
                  <span className="flex h-3 w-3 rounded-full bg-primary animate-pulse"></span>
                  <span className="text-xs font-black text-darkGray uppercase tracking-[0.2em]">Pakistan's #1 Food App</span>
               </div>
               
               <h1 className="text-7xl md:text-9xl font-black text-darkGray mb-10 leading-[0.9] tracking-tight">
                  Fastest <br /> <span className="text-primary italic">Delivery</span> <br /> In Town.
               </h1>
               
               <p className="text-xl text-gray-400 font-medium mb-12 max-w-lg leading-relaxed">
                  Craving something delicious? We bring the best restaurants of Pakistan directly to your doorstep with ultra-fast delivery.
               </p>

               <div className="flex flex-wrap gap-6">
                  <Button onClick={() => navigate('/menu')} className="px-12 py-6 text-xl font-black shadow-2xl shadow-primary/40 rounded-[2.5rem] group">
                     Order Now 
                     <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center ml-4 group-hover:translate-x-2 transition-transform">
                        <ArrowRight size={18} />
                     </div>
                  </Button>
                  <button className="flex items-center gap-4 group">
                     <div className="w-16 h-16 bg-white border border-gray-100 rounded-full flex items-center justify-center shadow-xl group-hover:scale-110 transition-all">
                        <Play size={20} className="text-primary fill-primary ml-1" />
                     </div>
                     <span className="font-black text-darkGray text-lg border-b-2 border-primary/20 pb-1 group-hover:border-primary transition-all">How it works?</span>
                  </button>
               </div>

               <div className="mt-16 flex items-center gap-8">
                  <div className="flex -space-x-4">
                     {[1,2,3,4].map(i => (
                        <div key={i} className="w-14 h-14 rounded-full border-4 border-white overflow-hidden shadow-lg">
                           <img src={`https://i.pravatar.cc/150?u=${i}`} alt="" />
                        </div>
                     ))}
                  </div>
                  <div>
                     <p className="text-2xl font-black text-darkGray">50k+</p>
                     <p className="text-sm text-gray-400 font-bold uppercase tracking-widest">Happy Foodies</p>
                  </div>
               </div>
            </motion.div>

            <motion.div 
               style={{ y: y1 }}
               className="relative hidden lg:block"
            >
               <div className="relative z-10 w-full h-[600px] bg-primary rounded-[5rem] rotate-3 overflow-hidden shadow-3xl shadow-primary/20">
                  <img 
                    src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800" 
                    className="w-full h-full object-cover -rotate-3 scale-110" 
                    alt="Delicious Food"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-primary/60 to-transparent"></div>
               </div>
               
               <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1 }}
                  className="absolute -top-10 -left-10 bg-white p-6 rounded-[2rem] shadow-2xl flex items-center gap-4 z-20"
               >
                  <div className="w-12 h-12 bg-green-500 text-white rounded-xl flex items-center justify-center"><Zap size={24} /></div>
                  <div>
                     <p className="font-black text-darkGray">30 Mins</p>
                     <p className="text-[10px] text-gray-400 font-bold uppercase">Fast Delivery</p>
                  </div>
               </motion.div>

               <motion.div 
                  initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 1.2 }}
                  className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[3rem] shadow-2xl z-20 text-center"
               >
                  <div className="flex justify-center gap-1 mb-2">
                     {[1,2,3,4,5].map(i => <Star key={i} size={14} className="fill-orange-400 text-orange-400" />)}
                  </div>
                  <p className="font-black text-2xl text-darkGray">4.9/5</p>
                  <p className="text-xs text-gray-400 font-bold uppercase">Customer Rating</p>
               </motion.div>
            </motion.div>
         </div>
      </section>

      {/* --- CATEGORIES --- */}
      <section className="max-w-7xl mx-auto px-4">
         <div className="text-center mb-20">
            <h2 className="text-5xl font-black text-darkGray mb-4 tracking-tight">Explore <span className="text-primary">Categories</span></h2>
            <div className="w-24 h-2 bg-primary mx-auto rounded-full"></div>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8">
            {categories.map((cat, i) => (
               <motion.div
                  key={cat.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  onClick={() => navigate('/menu', { state: { category: cat.name } })}
                  className="group cursor-pointer"
               >
                  <div className="aspect-square bg-white rounded-[3rem] p-6 shadow-xl shadow-gray-200/50 group-hover:bg-primary group-hover:shadow-primary/20 transition-all duration-500 mb-6 flex items-center justify-center border border-gray-50">
                     <div className="w-full h-full rounded-[2rem] overflow-hidden">
                        <ImageWithFallback src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover group-hover:scale-125 transition-transform duration-700" />
                     </div>
                  </div>
                  <h3 className="text-center font-black text-darkGray group-hover:text-primary transition-colors text-lg">{cat.name}</h3>
               </motion.div>
            ))}
         </div>
      </section>

      {/* --- HOW IT WORKS (FIXED VISUALS) --- */}
      <section className="relative py-40 overflow-hidden">
         <div className="absolute inset-0 bg-darkGray -z-10">
            <div className="absolute inset-0 opacity-[0.05] bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:30px_30px]"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-[150px]"></div>
         </div>
         
         <div className="max-w-7xl mx-auto px-6 relative z-10">
            <div className="text-center mb-32">
               <motion.span 
                 initial={{ opacity: 0 }}
                 whileInView={{ opacity: 1 }}
                 className="text-primary font-black uppercase tracking-[0.5em] text-xs"
               >
                 Seamless Experience
               </motion.span>
               <h2 className="text-6xl md:text-8xl font-black text-white mt-8 tracking-tighter">
                 How It <span className="text-primary italic">Works</span>
               </h2>
               <div className="w-24 h-1.5 bg-primary mx-auto mt-8 rounded-full"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-20 relative">
               <WorkStep 
                  number="01" 
                  title="Choose Your Meal" 
                  desc="Browse through 1000+ dishes from top restaurants in Pakistan." 
                  icon={ShoppingBag}
                  delay={0.1}
               />
               <WorkStep 
                  number="02" 
                  title="Place Your Order" 
                  desc="Pay securely via EasyPaisa, JazzCash or Cash on Delivery." 
                  icon={CreditCard}
                  delay={0.2}
               />
               <WorkStep 
                  number="03" 
                  title="Enjoy Your Food" 
                  desc="Sit back and relax. Your hot meal will be at your door in 30 mins." 
                  icon={UtensilsIcon}
                  delay={0.3}
               />
            </div>
         </div>
      </section>

      {/* --- WHY CHOOSE US --- */}
      <section className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-32 items-center">
         <div className="relative">
            <div className="relative z-10 grid grid-cols-2 gap-6">
               <div className="space-y-6 pt-12">
                  <div className="h-64 bg-primary rounded-[3rem] overflow-hidden shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1513104890138-7c749659a591?w=400" className="w-full h-full object-cover" alt="" />
                  </div>
                  <div className="h-48 bg-white border border-gray-100 rounded-[3rem] p-8 flex flex-col justify-center shadow-xl">
                     <p className="text-4xl font-black text-primary">99%</p>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Customer Satisfaction</p>
                  </div>
               </div>
               <div className="space-y-6">
                  <div className="h-48 bg-white border border-gray-100 rounded-[3rem] p-8 flex flex-col justify-center shadow-xl">
                     <p className="text-4xl font-black text-primary">500+</p>
                     <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1">Partner Restaurants</p>
                  </div>
                  <div className="h-64 bg-darkGray rounded-[3rem] overflow-hidden shadow-2xl">
                     <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=400" className="w-full h-full object-cover" alt="" />
                  </div>
               </div>
            </div>
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-primaryLight rounded-full blur-3xl opacity-50 -z-10"></div>
         </div>

         <div>
            <span className="text-primary font-black uppercase tracking-[0.3em] text-xs">Premium Quality</span>
            <h2 className="text-6xl font-black text-darkGray mb-10 mt-4 leading-tight tracking-tight">Why We Are The <br /> <span className="text-primary italic">Best In Business.</span></h2>
            
            <div className="space-y-10">
               <Point icon={Zap} title="Lightning Fast Delivery" desc="We use AI-powered routing to ensure your food arrives hot and on time." />
               <Point icon={Award} title="Premium Restaurants" desc="We only partner with highly-rated and hygiene-certified kitchens." />
               <Point icon={Users} title="Dedicated Support" desc="Our customer care team is available 24/7 to assist with your orders." />
            </div>

            <Button onClick={() => navigate('/menu')} className="mt-16 px-12 py-5 font-black text-lg rounded-[2rem]">
               Explore More <ChevronRight className="ml-2" />
            </Button>
         </div>
      </section>

      {/* --- FEATURED ITEMS --- */}
      <section className="bg-gray-50 py-40 -mx-10 px-10 rounded-[10rem]">
         <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
               <div>
                  <h2 className="text-5xl font-black text-darkGray mb-4 tracking-tight">Chef's <span className="text-primary">Masterpieces</span></h2>
                  <p className="text-gray-400 font-medium italic">Handpicked deliciousness waiting for you.</p>
               </div>
               <Link to="/menu" className="flex items-center gap-3 text-primary font-black uppercase tracking-widest text-sm hover:gap-5 transition-all">
                  View Full Menu <ArrowRight size={18} />
               </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
               {featuredProducts.map((p, i) => (
                  <motion.div
                     key={p.id}
                     initial={{ opacity: 0, scale: 0.9 }}
                     whileInView={{ opacity: 1, scale: 1 }}
                     transition={{ delay: i * 0.1 }}
                  >
                     <Card className="p-5 border-none shadow-sm hover:shadow-3xl transition-all duration-700 group bg-white rounded-[3rem] relative overflow-hidden">
                        <div className="aspect-square rounded-[2.5rem] overflow-hidden mb-6 relative">
                           <ImageWithFallback src={p.imageUrl} alt={p.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
                           <button className="absolute top-4 right-4 w-12 h-12 bg-white/80 backdrop-blur-md rounded-2xl flex items-center justify-center text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-xl">
                              <Heart size={20} />
                           </button>
                        </div>
                        <div className="px-3 pb-3">
                           <div className="flex justify-between items-start mb-3">
                              <h4 className="font-black text-2xl text-darkGray group-hover:text-primary transition-colors">{p.name}</h4>
                              <div className="flex items-center gap-1 text-orange-400 font-black">
                                 <Star size={14} className="fill-orange-400" />
                                 <span className="text-xs">4.8</span>
                              </div>
                           </div>
                           <p className="text-gray-400 text-sm font-medium mb-8 line-clamp-2 leading-relaxed">{p.description}</p>
                           <div className="flex justify-between items-center bg-gray-50 p-2 rounded-[1.5rem]">
                              <span className="text-primary font-black text-xl ml-4">PKR {p.price}</span>
                              <Button onClick={() => navigate(`/product/${p.id}`)} className="w-12 h-12 p-0 rounded-2xl shadow-lg">
                                 <ShoppingBag size={20} />
                              </Button>
                           </div>
                        </div>
                     </Card>
                  </motion.div>
               ))}
            </div>
         </div>
      </section>

      {/* --- CALL TO ACTION (REDESIGNED) --- */}
      <section className="max-w-7xl mx-auto px-4 mb-20">
         <motion.div 
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="relative bg-primary rounded-[5rem] p-16 md:p-24 text-center overflow-hidden shadow-[0_50px_100px_rgba(255,75,110,0.3)]"
         >
            {/* Background Decorative Circles */}
            <div className="absolute -top-24 -right-24 w-80 h-80 bg-white/10 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-24 -left-24 w-80 h-80 bg-darkGray/10 rounded-full blur-3xl"></div>
            
            <div className="relative z-10 max-w-3xl mx-auto">
               <motion.h2 
                 initial={{ opacity: 0, scale: 0.9 }}
                 whileInView={{ opacity: 1, scale: 1 }}
                 className="text-5xl md:text-7xl font-black text-white mb-10 leading-[1.1] tracking-tighter"
               >
                 Ready to taste the <br /> <span className="text-darkGray">best food</span> in Pakistan?
               </motion.h2>
               
               <p className="text-white/80 font-bold mb-14 text-lg md:text-xl max-w-xl mx-auto leading-relaxed italic">
                 "Join 50,000+ happy foodies who enjoy fresh and hot delivery every single day with FoodieFlow."
               </p>
               
               <div className="flex flex-wrap justify-center gap-6">
                  <Button 
                    onClick={() => navigate('/menu')} 
                    variant="secondary" 
                    className="px-12 py-6 text-xl font-black rounded-[2rem] hover:scale-110 transition-all shadow-2xl shadow-black/10"
                  >
                    Get Started Now
                  </Button>
                  <Button 
                    variant="outline" 
                    className="px-12 py-6 text-xl font-black rounded-[2rem] border-2 border-white/30 text-white hover:bg-white hover:text-primary transition-all backdrop-blur-sm"
                  >
                    Contact Support
                  </Button>
               </div>
            </div>
            
            {/* Abstract Floating Shapes */}
            <motion.div 
               animate={{ y: [0, 20, 0] }}
               transition={{ duration: 4, repeat: Infinity }}
               className="absolute top-10 right-10 hidden lg:block"
            >
               <div className="w-20 h-20 bg-white/5 rounded-3xl rotate-12 backdrop-blur-md border border-white/10"></div>
            </motion.div>
         </motion.div>
      </section>
    </div>
  );
};

const WorkStep = ({ number, title, desc, icon: Icon, delay }: any) => (
  <motion.div 
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="text-center group relative z-10"
  >
     <div className="relative inline-block mb-10">
        <div className="w-32 h-32 bg-white/10 border border-white/20 rounded-[3rem] flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all duration-700 group-hover:scale-110 group-hover:shadow-[0_20px_60px_rgba(255,75,110,0.5)]">
           <Icon size={48} strokeWidth={1.5} />
        </div>
        <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center font-black text-xl shadow-2xl border-4 border-darkGray">
           {number}
        </div>
     </div>
     <h3 className="text-3xl font-black text-white mb-6 group-hover:text-primary transition-colors tracking-tight">{title}</h3>
     <p className="text-gray-400 font-bold leading-relaxed max-w-[280px] mx-auto text-sm opacity-80 group-hover:opacity-100 transition-opacity">{desc}</p>
  </motion.div>
);

const Point = ({ icon: Icon, title, desc }: any) => (
  <div className="flex gap-8 group">
     <div className="w-16 h-16 bg-primaryLight text-primary rounded-[1.8rem] flex items-center justify-center shrink-0 shadow-lg shadow-primary/5 group-hover:bg-primary group-hover:text-white transition-all duration-500">
        <Icon size={28} />
     </div>
     <div>
        <h4 className="text-2xl font-black text-darkGray mb-2">{title}</h4>
        <p className="text-gray-400 font-medium leading-relaxed">{desc}</p>
     </div>
  </div>
);
