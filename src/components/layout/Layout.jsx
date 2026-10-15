import React, { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Footer } from './Footer';

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

export function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-surface text-on-surface">
      <ScrollToTop />
      <Navbar />
      <main className="flex-1 flex flex-col pt-16">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
