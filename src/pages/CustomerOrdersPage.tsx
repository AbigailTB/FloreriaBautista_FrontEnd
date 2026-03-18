import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Package, Clock, CheckCircle, XCircle, ChevronRight, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataService } from '../services/dataService';

export default function CustomerOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      // In a real app, we would fetch orders for this specific user
      // For now, we'll just get all orders and filter if needed, or just show some mock orders
      const allOrders = DataService.getOrders();
      // Mock filtering for the current user (assuming some orders belong to them)
      // If no orders match, we just show a subset for demonstration
      const userOrders = allOrders.filter(o => o.customerId === parsedUser.id);
      setOrders(userOrders.length > 0 ? userOrders : allOrders.slice(0, 3));
    }
    setLoading(false);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregado': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'Pendiente': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'En Ruta': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Cancelado': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'En Preparación': return 'bg-indigo-100 text-indigo-700 border-indigo-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Entregado': return <CheckCircle className="w-4 h-4" />;
      case 'Cancelado': return <XCircle className="w-4 h-4" />;
      default: return <Clock className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3b5b]"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <Package className="w-16 h-16 text-slate-300 mb-4" />
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Inicia sesión para ver tus pedidos</h2>
        <p className="text-slate-500 mb-6">Necesitas acceder a tu cuenta para ver el historial de tus compras.</p>
        <Link to="/login" className="px-6 py-3 bg-[#1a3b5b] text-white font-bold rounded-xl hover:bg-[#1a3b5b]/90 transition-colors">
          Iniciar Sesión
        </Link>
      </div>
    );
  }

  return (
    <div className="font-display bg-[#f8f6f6] dark:bg-[#1a1c1e] text-slate-900 dark:text-slate-100 min-h-screen py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-black text-[#1a3b5b] dark:text-white mb-2">Mis Pedidos</h1>
          <p className="text-slate-600 dark:text-slate-400">Revisa el estado de tus compras y tu historial.</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-12 text-center shadow-sm border border-slate-100 dark:border-slate-700">
            <Package className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Aún no tienes pedidos</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">Explora nuestro catálogo y encuentra el arreglo perfecto.</p>
            <Link to="/catalogo" className="inline-block px-6 py-3 bg-[#1a3b5b] text-white font-bold rounded-xl hover:bg-[#1a3b5b]/90 transition-colors">
              Ir al Catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order, index) => (
              <motion.div 
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden group"
              >
                <div className="p-6 sm:p-8">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="text-lg font-bold text-slate-900 dark:text-white">Pedido #{order.id}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1 ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 dark:text-slate-400">
                        Realizado el {new Date(order.createdAt).toLocaleDateString('es-MX', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Total del pedido</p>
                      <p className="text-2xl font-black text-[#1a3b5b] dark:text-white">${(order.total || 0).toLocaleString()}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100 dark:border-slate-700 pt-6">
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-4 uppercase tracking-wider">Artículos</h4>
                    <div className="space-y-4">
                      {order.items.map((item: any, i: number) => (
                        <div key={i} className="flex items-center gap-4">
                          <div className="w-16 h-16 rounded-xl bg-slate-100 dark:bg-slate-700 overflow-hidden flex-shrink-0">
                            {/* Placeholder for product image if available, else a generic icon */}
                            <div className="w-full h-full flex items-center justify-center text-slate-400">
                              <Package className="w-8 h-8" />
                            </div>
                          </div>
                          <div className="flex-1">
                            <h5 className="font-bold text-slate-900 dark:text-white">{item.productName}</h5>
                            <p className="text-sm text-slate-500 dark:text-slate-400">Cantidad: {item.quantity}</p>
                          </div>
                          <div className="text-right font-bold text-slate-900 dark:text-white">
                            ${(item.price * item.quantity).toLocaleString()}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="bg-slate-50 dark:bg-slate-800/50 px-6 py-4 sm:px-8 border-t border-slate-100 dark:border-slate-700 flex justify-between items-center">
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Método de pago: <span className="font-semibold capitalize text-slate-700 dark:text-slate-300">{order.paymentMethod}</span>
                  </p>
                  <button className="text-[#1a3b5b] dark:text-[#facc15] font-bold text-sm flex items-center gap-1 hover:underline">
                    <Eye className="w-4 h-4" /> Ver detalles
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
