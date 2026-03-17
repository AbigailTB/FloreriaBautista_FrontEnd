import React from 'react';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';

export default function PublicLayout({ children, hideNavAndFooter }: { children: React.ReactNode, hideNavAndFooter?: boolean }) {
  return (
    <div className="bg-brand-light font-sans text-brand-deep overflow-x-hidden min-h-screen flex flex-col">
      {!hideNavAndFooter && <Navigation />}
      <div className="flex-grow">
        {children}
      </div>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}
