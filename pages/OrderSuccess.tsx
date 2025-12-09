import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
import { Button } from '../components/UI';

export const OrderSuccess = () => {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div>
        <CheckCircle className="w-24 h-24 text-green-500 mb-6" />
      </div>
      <h1 className="text-4xl font-bold text-darkGray mb-4">Order Placed!</h1>
      <p className="text-gray-500 max-w-md mb-8">
        Your order has been successfully placed. You can track its status in your dashboard.
      </p>
      <div className="flex gap-4">
        <Link to="/dashboard">
          <Button>Go to Dashboard</Button>
        </Link>
        <Link to="/">
          <Button variant="secondary">Order More</Button>
        </Link>
      </div>
    </div>
  );
};