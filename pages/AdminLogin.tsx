import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../firebase';
import { Card, Input, Button } from '../components/UI';
import { ShieldCheck, AlertCircle } from 'lucide-react';

export const AdminLogin = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check role
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists() && docSnap.data().role === 'admin') {
        navigate('/admin');
      } else {
        await auth.signOut();
        setError('Access Denied: You do not have administrator privileges.');
      }
    } catch (err: any) {
      setError('Invalid credentials or system error.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-10">
      <Card className="w-full max-w-md border-t-4 border-darkGray">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
             <div className="p-3 bg-darkGray text-white rounded-xl shadow-lg">
                <ShieldCheck size={32} />
             </div>
          </div>
          <h2 className="text-2xl font-bold text-darkGray">Admin Portal</h2>
          <p className="text-gray-500 text-sm mt-1">Authorized Personnel Only</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl text-sm mb-6 flex items-start gap-3 border border-red-100">
            <AlertCircle size={18} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Admin Email</label>
            <Input 
              type="email" 
              placeholder="admin@rjfoods.com" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">Password</label>
            <Input 
              type="password" 
              placeholder="••••••••" 
              value={password} 
              onChange={e => setPassword(e.target.value)} 
              required 
            />
          </div>
          
          <Button type="submit" className="w-full bg-darkGray hover:bg-black" isLoading={loading}>
            Access Dashboard
          </Button>
        </form>
      </Card>
    </div>
  );
};