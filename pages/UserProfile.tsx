import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Card, Button, PageLoader } from '../components/UI';
import { User, Mail, Phone, MapPin, Edit2, ArrowLeft } from 'lucide-react';

export const UserProfile = () => {
  const { userProfile, loading } = useAuth();

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Link to="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-primary mb-6 transition-colors">
        <ArrowLeft size={20} /> Back to Dashboard
      </Link>

      <Card className="p-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-darkGray">My Profile</h1>
          <Link to="/profile/edit">
            <Button variant="outline" className="flex items-center gap-2">
              <Edit2 size={16} /> Edit
            </Button>
          </Link>
        </div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-24 h-24 bg-primaryLight text-primary rounded-full flex items-center justify-center mb-4">
            <User size={48} />
          </div>
          <h2 className="text-2xl font-bold text-darkGray">{userProfile?.name}</h2>
          <p className="text-gray-500">Member since {userProfile?.createdAt ? new Date(userProfile.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</p>
        </div>

        <div className="space-y-6">
          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <Mail className="text-primary" size={24} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Email Address</p>
              <p className="font-medium text-darkGray">{userProfile?.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <Phone className="text-primary" size={24} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Phone Number</p>
              <p className="font-medium text-darkGray">{userProfile?.phone || 'Not provided'}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl">
            <MapPin className="text-primary" size={24} />
            <div>
              <p className="text-xs text-gray-400 uppercase font-bold">Delivery Address</p>
              <p className="font-medium text-darkGray">{userProfile?.address || 'Not provided'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};