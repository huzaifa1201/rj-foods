import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Card, Input, Button, PageLoader } from '../components/UI';
import { ArrowLeft, Save } from 'lucide-react';

export const EditProfile = () => {
  const { currentUser, userProfile, loading } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (userProfile) {
      setName(userProfile.name);
      setPhone(userProfile.phone);
      setAddress(userProfile.address);
    }
  }, [userProfile]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;
    setSubmitting(true);
    try {
      await updateDoc(doc(db, 'users', currentUser.uid), {
        name,
        phone,
        address
      });
      showToast('Profile updated successfully', 'success');
      navigate('/profile');
    } catch (error) {
      console.error("Error updating profile:", error);
      showToast("Failed to update profile", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-xl mx-auto py-8">
      <Link to="/profile" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Profile
      </Link>

      <Card className="p-8">
        <h1 className="text-2xl font-bold text-darkGray mb-6">Edit Profile</h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Full Name"
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
          />
          <Input 
            label="Phone Number"
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            required 
          />
          <Input 
            label="Delivery Address"
            value={address} 
            onChange={e => setAddress(e.target.value)} 
            required 
          />
          
          <div className="flex gap-4 mt-8 pt-4 border-t border-gray-100">
            <Link to="/profile" className="w-full">
               <Button type="button" variant="secondary" className="w-full">Cancel</Button>
            </Link>
            <Button type="submit" className="w-full" isLoading={submitting}>
              <Save size={18} /> Save Changes
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};