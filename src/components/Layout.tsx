import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import AnimatedRoutes from './AnimatedRoutes';
import AdminLayout from './AdminLayout';

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, [location.pathname]);

  const hideNavAndFooter = ['/login', '/registro'].includes(location.pathname);
  const isAdmin = user?.role === 'administrador';

  if (isAdmin && !hideNavAndFooter) {
    return (
      <AdminLayout user={user}>
        <AnimatedRoutes />
      </AdminLayout>
    );
  }

  return (
    <div className="bg-brand-light font-sans text-brand-deep overflow-x-hidden min-h-screen flex flex-col">
      {!hideNavAndFooter && <Navigation />}
      <div className="flex-grow">
        <AnimatedRoutes />
      </div>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}
