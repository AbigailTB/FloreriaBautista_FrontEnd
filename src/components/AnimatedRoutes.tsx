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
import AdminInventoryPage from '../pages/AdminInventoryPage';
import AdminPaymentsPage from '../pages/AdminPaymentsPage';
import AdminUsersPage from '../pages/AdminUsersPage';
import AdminOperationPage from '../pages/AdminOperationPage';
import AdminSettingsPage from '../pages/AdminSettingsPage';
import AdminDataManagementPage from '../pages/AdminDataManagementPage';
import AdminSystemMonitoringPage from '../pages/AdminSystemMonitoringPage';
import AdminAuditPage from '../pages/AdminAuditPage';
import CustomerOrdersPage from '../pages/CustomerOrdersPage';
import PageTransition from './PageTransition';
 
export default function AnimatedRoutes() {
  const location = useLocation();
 
  return (
    <AnimatePresence mode="wait">
      <Routes location={location}>
        <Route path="/" element={<PageTransition><HomePage /></PageTransition>} />
        <Route path="/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
        <Route path="/admin/dashboard" element={<PageTransition><DashboardPage /></PageTransition>} />
        <Route path="/admin/reportes" element={<PageTransition><ReportsPage /></PageTransition>} />
        <Route path="/admin/productos/nuevo" element={<PageTransition><ProductManagementPage /></PageTransition>} />
        <Route path="/admin/productos/editar/:id" element={<PageTransition><ProductManagementPage /></PageTransition>} />
        <Route path="/admin/pedidos" element={<PageTransition><OrdersPage /></PageTransition>} />
        <Route path="/admin/pedidos/:id" element={<PageTransition><OrderDetailPage /></PageTransition>} />
        <Route path="/admin/inventario" element={<PageTransition><AdminInventoryPage /></PageTransition>} />
        <Route path="/admin/pagos" element={<PageTransition><AdminPaymentsPage /></PageTransition>} />
        <Route path="/admin/usuarios" element={<PageTransition><AdminUsersPage /></PageTransition>} />
        <Route path="/admin/operacion" element={<PageTransition><AdminOperationPage /></PageTransition>} />
        <Route path="/admin/respaldos" element={<PageTransition><BackupsPage /></PageTransition>} />
        <Route path="/admin/datos" element={<PageTransition><AdminDataManagementPage /></PageTransition>} />
        <Route path="/admin/monitoreo" element={<PageTransition><AdminSystemMonitoringPage /></PageTransition>} />
        <Route path="/admin/auditoria" element={<PageTransition><AdminAuditPage /></PageTransition>} />
        <Route path="/admin/configuracion" element={<PageTransition><AdminSettingsPage /></PageTransition>} />
        <Route path="/mis-pedidos" element={<PageTransition><CustomerOrdersPage /></PageTransition>} />
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
