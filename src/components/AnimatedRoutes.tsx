import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'motion/react';
import HomePage from '../pages/HomePage';
import CatalogPage from '../pages/CatalogPage';
import AboutPage from '../pages/AboutPage';
import ProductPage from '../pages/ProductPage';
import TestimonialsPage from '../pages/TestimonialsPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ReportsPage from '../pages/ReportsPage';
import ProductManagementPage from '../pages/ProductManagementPage';
import OrdersPage from '../pages/OrdersPage';
import OrderDetailPage from '../pages/OrderDetailPage';
import BackupsPage from '../pages/BackupsPage';
import PageTransition from './PageTransition';

export default function AnimatedRoutes() {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      {/* @ts-ignore - React Router v6 Routes component doesn't explicitly type the key prop but it's required for AnimatePresence */}
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
        <Route path="/admin/reportes" element={<PageTransition><ReportsPage /></PageTransition>} />
        <Route path="/admin/productos/nuevo" element={<PageTransition><ProductManagementPage /></PageTransition>} />
        <Route path="/admin/productos/editar/:id" element={<PageTransition><ProductManagementPage /></PageTransition>} />
        <Route path="/admin/pedidos" element={<PageTransition><OrdersPage /></PageTransition>} />
        <Route path="/admin/pedidos/:id" element={<PageTransition><OrderDetailPage /></PageTransition>} />
        <Route path="/admin/respaldos" element={<PageTransition><BackupsPage /></PageTransition>} />
        <Route path="/catalogo" element={<PageTransition><CatalogPage /></PageTransition>} />
        <Route path="/producto/:id" element={<PageTransition><ProductPage /></PageTransition>} />
        <Route path="/testimonios" element={<PageTransition><TestimonialsPage /></PageTransition>} />
        <Route path="/nosotros" element={<PageTransition><AboutPage /></PageTransition>} />
        <Route path="/login" element={<PageTransition><LoginPage /></PageTransition>} />
        <Route path="/registro" element={<PageTransition><RegisterPage /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}
