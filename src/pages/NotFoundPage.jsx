import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/Button';

export default function NotFoundPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center text-center px-4 py-16 gap-4">
      <div className="w-16 h-16 rounded-full bg-surface-container text-primary flex items-center justify-center font-heading font-extrabold text-2xl">
        404
      </div>
      <h1 className="font-heading font-extrabold text-2xl sm:text-3xl text-primary">
        Page Not Found
      </h1>
      <p className="font-sans text-xs sm:text-sm text-on-surface-variant max-w-sm">
        The student page or listing you are looking for does not exist or has been moved.
      </p>
      <Link to="/" className="mt-2">
        <Button variant="primary" size="md" icon="home">
          Return to Home
        </Button>
      </Link>
    </div>
  );
}
