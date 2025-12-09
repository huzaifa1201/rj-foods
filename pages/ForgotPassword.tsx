import React, { useState } from 'react';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../firebase';
import { Card, Input, Button } from '../components/UI';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft } from 'lucide-react';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{type: 'success' | 'error', text: string} | null>(null);

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center py-20">
      <Card className="w-full max-w-md">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primaryLight text-primary rounded-full flex items-center justify-center mx-auto mb-4">
            <Mail size={32} />
          </div>
          <h2 className="text-2xl font-bold text-primary">Forgot Password?</h2>
          <p className="text-gray-500 text-sm mt-1">Enter your email to reset your password.</p>
        </div>

        {message && (
          <div className={`p-3 rounded-lg text-sm mb-4 border ${message.type === 'success' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-red-50 text-red-500 border-red-200'}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleReset} className="space-y-4">
          <Input 
            type="email" 
            placeholder="Enter your email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          
          <Button type="submit" className="w-full" isLoading={loading}>
            Send Reset Link
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link to="/login" className="text-gray-500 hover:text-primary flex items-center justify-center gap-2 transition-colors">
            <ArrowLeft size={16} /> Back to Login
          </Link>
        </div>
      </Card>
    </div>
  );
};