import React, { useState, useEffect } from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import Navigation from './Navigation';
import Footer from './Footer';
import AnimatedRoutes from './AnimatedRoutes';
import AdminLayout from './AdminLayout';
import { NavbarCliente } from './NavbarCliente';

export default function Layout() {
  const location = useLocation();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const hideNavAndFooter = ['/login', '/registro'].includes(location.pathname);
  const isAdminOrEmployee = user?.role === 'administrador' || user?.role === 'empleado' || user?.role === 'staff';
  const isClient = user?.role === 'cliente' || user?.role === 'customer';

  if (isAdminOrEmployee && !hideNavAndFooter) {
    if (location.pathname === '/') {
      return <Navigate to="/dashboard" replace />;
    }
    return (
      <AdminLayout user={user}>
        <AnimatedRoutes />
      </AdminLayout>
    );
  }

  return (
    <div className="bg-brand-light font-sans text-brand-deep overflow-x-hidden min-h-screen flex flex-col">
      {!hideNavAndFooter && (isClient ? <NavbarCliente /> : <Navigation />)}
      <div className="flex-grow">
        <AnimatedRoutes />
      </div>
      {!hideNavAndFooter && <Footer />}
    </div>
  );
}