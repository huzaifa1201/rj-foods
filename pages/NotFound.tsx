import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Home } from 'lucide-react';
import { Button } from '../components/UI';

export const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
      <div className="w-24 h-24 bg-softGray rounded-full flex items-center justify-center mb-6 text-gray-400">
        <AlertTriangle size={48} />
      </div>
      <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
      <h2 className="text-2xl font-bold text-darkGray mb-4">Page Not Found</h2>
      <p className="text-gray-500 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <Link to="/">
        <Button>
          <Home size={18} /> Back to Home
        </Button>
      </Link>
    </div>
  );
};