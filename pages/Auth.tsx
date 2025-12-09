
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Card, Input, Button } from '../components/UI';

export const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

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
    <div className="flex items-center justify-center py-10">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-primary">{isLogin ? 'Welcome Back!' : 'Join RJ Foods'}</h2>
          <p className="text-gray-500 text-sm mt-1">{isLogin ? 'Login to continue your craving' : 'Create an account to order'}</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm mb-4 border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <Input 
                placeholder="Full Name" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                required 
              />
              <Input 
                placeholder="Phone Number" 
                value={phone} 
                onChange={e => setPhone(e.target.value)} 
                required 
              />
              <Input 
                placeholder="Delivery Address" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                required 
              />
            </>
          )}
          <Input 
            type="email" 
            placeholder={!isLogin ? "Email Address" : "Email Address"}
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <div className="space-y-1">
            <Input 
              type="password" 
              placeholder="Password" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
            {isLogin && (
              <div className="text-right">
                <Link to="/forgot-password" className="text-xs text-primary hover:underline">Forgot Password?</Link>
              </div>
            )}
          </div>
          
          <Button type="submit" className="w-full" isLoading={loading}>
            {isLogin ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-500">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-primary font-bold hover:underline"
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </button>
        </div>
      </Card>
    </div>
  );
};
