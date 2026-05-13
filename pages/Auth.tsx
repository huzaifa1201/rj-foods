
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  updateProfile, 
  sendEmailVerification,
  signInWithPopup,
  getAdditionalUserInfo
} from 'firebase/auth';
import { doc, setDoc, serverTimestamp, getDoc } from 'firebase/firestore';
import { auth, db, googleProvider } from '../firebase';
import { Card, Input, Button } from '../components/UI';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, Phone, MapPin, Chrome } from 'lucide-react';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      const additionalUserInfo = getAdditionalUserInfo(result);

      // Check if user document already exists
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists() || additionalUserInfo?.isNewUser) {
        // Auto-assign admin role if email matches specific criteria
        const role = (user.email?.toLowerCase().startsWith('admin') || user.email === 'rajahuzaifa015166@gmail.com') ? 'admin' : 'user';

        await setDoc(docRef, {
          uid: user.uid,
          name: user.displayName || 'Google User',
          email: user.email,
          phone: '',
          address: '',
          role: role,
          emailVerified: true,
          createdAt: serverTimestamp()
        });
      }
      
      navigate('/dashboard');
    } catch (err: any) {
      console.error(err);
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;

        await updateProfile(user, { displayName: name });
        
        // Send Verification Email
        await sendEmailVerification(user);

        // Auto-assign admin role if email starts with 'admin' OR is the specific requested email
        const role = (email.toLowerCase().startsWith('admin') || email === 'rajahuzaifa015166@gmail.com') ? 'admin' : 'user';

        // Create user document
        await setDoc(doc(db, 'users', user.uid), {
          uid: user.uid,
          name,
          email,
          phone,
          address,
          role: role, 
          emailVerified: false,
          createdAt: serverTimestamp()
        });
        
        navigate('/email-verification');
      }
    } catch (err: any) {
      setError(err.message.replace('Firebase: ', ''));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <Card className="p-8 shadow-2xl border-white/20 glass">
          <div className="text-center mb-8">
            <motion.div
              key={isLogin ? 'login-title' : 'signup-title'}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-2"
            >
              <h2 className="text-3xl font-bold bg-gradient-to-r from-primary to-primaryDark bg-clip-text text-transparent">
                {isLogin ? 'Welcome Back' : 'Create Account'}
              </h2>
              <p className="text-gray-500 text-sm font-medium">
                {isLogin ? 'Delicious meals are just a login away' : 'Join FoodieFlow and start your food journey'}
              </p>
            </motion.div>
          </div>

          <div className="space-y-4">
            <Button 
              onClick={handleGoogleLogin} 
              variant="outline" 
              className="w-full flex items-center justify-center gap-3 py-6 border-2 hover:bg-gray-50 transition-all group"
              isLoading={googleLoading}
            >
              <svg className="w-5 h-5 group-hover:scale-110 transition-transform" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              <span className="font-semibold text-gray-700">Continue with Google</span>
            </Button>

            <div className="relative flex items-center py-4">
              <div className="flex-grow border-t border-gray-200"></div>
              <span className="flex-shrink mx-4 text-gray-400 text-xs font-bold uppercase tracking-widest">Or with Email</span>
              <div className="flex-grow border-t border-gray-200"></div>
            </div>
          </div>

          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="bg-red-50 text-red-500 p-4 rounded-xl text-sm mb-6 border border-red-100 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-pulse" />
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      className="pl-12 py-6 bg-gray-50/50 focus:bg-white transition-all border-none shadow-sm"
                      placeholder="Full Name" 
                      value={name} 
                      onChange={e => setName(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      className="pl-12 py-6 bg-gray-50/50 focus:bg-white transition-all border-none shadow-sm"
                      placeholder="Phone Number" 
                      value={phone} 
                      onChange={e => setPhone(e.target.value)} 
                      required 
                    />
                  </div>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <Input 
                      className="pl-12 py-6 bg-gray-50/50 focus:bg-white transition-all border-none shadow-sm"
                      placeholder="Delivery Address" 
                      value={address} 
                      onChange={e => setAddress(e.target.value)} 
                      required 
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <Input 
                type="email" 
                className="pl-12 py-6 bg-gray-50/50 focus:bg-white transition-all border-none shadow-sm"
                placeholder="Email Address"
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>

            <div className="space-y-2">
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <Input 
                  type="password" 
                  className="pl-12 py-6 bg-gray-50/50 focus:bg-white transition-all border-none shadow-sm"
                  placeholder="Password" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
              </div>
              {isLogin && (
                <div className="text-right">
                  <Link to="/forgot-password" title="Recover Password" className="text-xs text-primary hover:text-primaryDark font-semibold transition-colors">
                    Forgot Password?
                  </Link>
                </div>
              )}
            </div>
            
            <Button type="submit" className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all rounded-2xl" isLoading={loading}>
              {isLogin ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-8 text-center text-sm">
            <span className="text-gray-500 font-medium">
              {isLogin ? "New to FoodieFlow? " : "Have an account? "}
            </span>
            <button 
              onClick={() => { setIsLogin(!isLogin); setError(''); }}
              className="text-primary font-bold hover:text-primaryDark hover:underline decoration-2 underline-offset-4 transition-all"
            >
              {isLogin ? 'Create Account' : 'Login Now'}
            </button>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};
