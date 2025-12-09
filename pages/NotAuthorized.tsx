import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button, Card } from '../components/UI';

export const NotAuthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-[60vh] px-4">
      <Card className="max-w-md w-full text-center p-8 border-t-4 border-red-500">
        <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShieldAlert size={40} />
        </div>
        
        <h2 className="text-2xl font-bold text-darkGray mb-2">Access Denied</h2>
        <p className="text-gray-500 mb-8 leading-relaxed">
          You do not have permission to view this page. This area is restricted to administrators only.
        </p>

        <div className="flex flex-col gap-3">
          <Link to="/dashboard">
            <Button className="w-full">
              Go to User Dashboard
            </Button>
          </Link>
          <Link to="/">
            <Button variant="secondary" className="w-full">
              <ArrowLeft size={18} /> Back to Home
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
};