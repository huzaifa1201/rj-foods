import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, CheckCircle, ArrowRight, RefreshCw, Send } from 'lucide-react';
import { sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { Card, Button } from '../components/UI';

export const EmailVerification = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleResend = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await sendEmailVerification(currentUser);
      setMessage('Verification link resent! Please check your inbox.');
    } catch (e: any) {
      if (e.code === 'auth/too-many-requests') {
        setMessage('Please wait a bit before requesting another email.');
      } else {
        setMessage('Error sending email. Try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCheckVerification = async () => {
    if (!currentUser) return;
    setLoading(true);
    try {
      await currentUser.reload();
      if (currentUser.emailVerified) {
        navigate('/dashboard');
      } else {
        setMessage('Email is not verified yet. Please click the link in your email.');
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="w-full max-w-md text-center p-8 border-t-4 border-primary">
        <div className="w-20 h-20 bg-primaryLight text-primary rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <Mail size={40} />
        </div>
        
        <h2 className="text-2xl font-bold text-darkGray mb-2">Verify Your Email</h2>
        <p className="text-gray-500 mb-6 leading-relaxed text-sm">
          We've sent a verification link to <strong>{currentUser?.email}</strong>.<br/>
          Please check your inbox (and spam folder) and click the link to activate your account.
        </p>

        {message && (
          <div className="bg-blue-50 text-blue-600 text-xs p-3 rounded-lg mb-4 border border-blue-100">
            {message}
          </div>
        )}

        <div className="space-y-3 mb-6">
          <Button onClick={handleCheckVerification} className="w-full" isLoading={loading}>
            <RefreshCw size={18} className={loading ? 'animate-spin' : ''} /> I've Verified My Email
          </Button>
          
          <Button onClick={handleResend} variant="outline" className="w-full" isLoading={loading}>
            <Send size={18} /> Resend Verification Link
          </Button>
        </div>

        <div className="text-xs text-gray-400">
          <Link to="/login" className="hover:text-primary transition-colors">Back to Login</Link>
        </div>
      </Card>
    </div>
  );
};