import React, { useState, useEffect, useMemo } from 'react';
import { 
  ShoppingBasket, 
  Truck, 
  MapPin,
  Clock, 
  TrendingUp, 
  ChevronRight, 
  PlusCircle, 
  ClipboardList, 
  RefreshCw,
  Lightbulb,
  Scan,
  Bolt,
  Package,
  Calendar,
  Users,
  DollarSign,
  ArrowUpRight,
  Bell,
  Search,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/dataService';

export default function EmployeeDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    try {
      const allOrders = DataService.getOrders();
      const allProducts = DataService.getProducts();
      setOrders(allOrders);
      setProducts(allProducts);
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayOrders = orders.filter(o => (o.date || '').includes(today));
    const lowStock = products.filter(p => p.stock < 10).length;
    
    return {
      todayCount: todayOrders.length,
      todayRevenue: todayOrders.reduce((sum, o) => sum + (o.total || 0), 0),
      pendingCount: orders.filter(o => o.status === 'pending').length,
      lowStockCount: lowStock
    };
  }, [orders, products]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <motion.main 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8"
    >
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-blue-600 font-bold text-sm uppercase tracking-widest">
            <Calendar className="w-4 h-4" />
            <span>{new Date().toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' })}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 tracking-tight">
            ¡Hola, <span className="text-blue-600">Equipo!</span>
          </h1>
          <p className="text-slate-500 text-lg max-w-2xl">
            Bienvenido al centro de operaciones de Florería Bautista. Aquí tienes el pulso de la tienda hoy.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={loadData}
            className="p-3 bg-white border border-slate-200 rounded-2xl text-slate-600 hover:bg-slate-50 transition-all shadow-sm group"
          >
            <RefreshCw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-500" />
          </button>
          <button className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-all shadow-lg shadow-slate-200">
            <Bell className="w-5 h-5" />
            Notificaciones
          </button>
        </div>
      </header>

      {/* Bento Grid Stats */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-blue-50 opacity-50 group-hover:scale-110 transition-transform">
            <ShoppingBasket size={120} />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <ShoppingBasket className="w-6 h-6" />
            </div>
            <span className="text-xs font-black text-blue-600 bg-blue-50 px-2 py-1 rounded-lg">+12%</span>
          </div>
          <div className="mt-6 relative z-10">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ventas Hoy</p>
            <p className="text-4xl font-black text-slate-900 mt-1">{stats.todayCount}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-blue-50 opacity-50 group-hover:scale-110 transition-transform">
            <DollarSign size={120} />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="p-3 bg-blue-50 text-blue-600 rounded-2xl">
              <DollarSign className="w-6 h-6" />
            </div>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="mt-6 relative z-10">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Ingresos Hoy</p>
            <p className="text-4xl font-black text-slate-900 mt-1">${stats.todayRevenue.toFixed(0)}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-amber-50 opacity-50 group-hover:scale-110 transition-transform">
            <Clock size={120} />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
              <Clock className="w-6 h-6" />
            </div>
            <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
          </div>
          <div className="mt-6 relative z-10">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Pendientes</p>
            <p className="text-4xl font-black text-slate-900 mt-1">{stats.pendingCount}</p>
          </div>
        </motion.div>

        <motion.div variants={itemVariants} className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-xl transition-all group relative overflow-hidden">
          <div className="absolute -right-6 -bottom-6 text-rose-50 opacity-50 group-hover:scale-110 transition-transform">
            <Package size={120} />
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="p-3 bg-rose-50 text-rose-600 rounded-2xl">
              <Package className="w-6 h-6" />
            </div>
            {stats.lowStockCount > 0 && (
              <AlertCircle className="w-5 h-5 text-rose-500 animate-bounce" />
            )}
          </div>
          <div className="mt-6 relative z-10">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Stock Bajo</p>
            <p className="text-4xl font-black text-slate-900 mt-1">{stats.lowStockCount}</p>
          </div>
        </motion.div>
      </section>

      {/* Main Content: Bento Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Priority Orders */}
        <section className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between px-2">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Pedidos Prioritarios</h2>
            </div>
            <Link to="/empleado/pedidos" className="group flex items-center gap-2 text-blue-600 font-bold text-sm hover:text-blue-700 transition-colors">
              Ver todos
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </Link>
          </div>
          
          <div className="grid gap-4">
            <AnimatePresence mode="popLayout">
              {orders.slice(0, 4).map((order, idx) => (
                <motion.div 
                  key={order.id}
                  variants={itemVariants}
                  className="bg-white p-4 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-4 items-center hover:shadow-lg hover:border-emerald-200 transition-all group"
                >
                  <div className="w-24 h-24 rounded-2xl bg-slate-100 shrink-0 overflow-hidden relative">
                    <img 
                      src={order.items[0]?.image || `https://picsum.photos/seed/${order.id}/200/200`} 
                      alt="Order Item" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="flex-grow space-y-2 w-full text-center sm:text-left">
                    <div className="flex flex-wrap items-center justify-center sm:justify-between gap-2">
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">#{order.id}</span>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1.5 ${
                        order.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                      }`}>
                        <div className={`w-1.5 h-1.5 rounded-full ${order.status === 'pending' ? 'bg-amber-500' : 'bg-blue-500'}`}></div>
                        {order.status === 'pending' ? 'Pendiente' : 'En Ruta'}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors">Pedido de Cliente</h3>
                      <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-0.5">Total: <span className="text-blue-600">${order.total.toFixed(2)}</span></p>
                    </div>
                    <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs font-bold text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>10:30 AM</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        <span>Zona Centro</span>
                      </div>
                    </div>
                  </div>
                  <div className="shrink-0 w-full sm:w-auto">
                    <Link to={`/empleado/pedidos/${order.id}`} className="w-full sm:w-12 h-12 bg-slate-50 text-slate-400 group-hover:bg-blue-600 group-hover:text-white rounded-2xl transition-all flex items-center justify-center">
                      <ChevronRight className="w-6 h-6" />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* Right Column: Quick Actions & Tips */}
        <section className="lg:col-span-4 space-y-8">
          <div className="space-y-6">
            <div className="flex items-center gap-3 px-2">
              <div className="w-1.5 h-8 bg-blue-600 rounded-full"></div>
              <h2 className="text-2xl font-display font-bold text-slate-900">Acciones</h2>
            </div>
            
            <div className="grid grid-cols-1 gap-4">
              <Link to="/empleado/venta-rapida" className="bg-slate-900 p-6 rounded-[2rem] text-white flex items-center justify-between group hover:scale-[1.02] transition-all shadow-xl shadow-slate-200">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                    <PlusCircle className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-lg leading-none">Venta Rápida</p>
                    <p className="text-white/50 text-xs mt-1">Nueva orden de mostrador</p>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-white/30 group-hover:text-white transition-colors" />
              </Link>
              
              <div className="grid grid-cols-2 gap-4">
                <Link to="/empleado/inventario" className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 text-center hover:border-emerald-500 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-all">
                    <Package className="w-6 h-6" />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-emerald-600">Inventario</span>
                </Link>
                
                <Link to="/empleado/pedidos" className="bg-white p-6 rounded-[2rem] border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-3 text-center hover:border-emerald-500 hover:shadow-lg transition-all group">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:bg-blue-600 group-hover:text-white transition-all">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <span className="font-black text-[10px] uppercase tracking-widest text-slate-400 group-hover:text-blue-600">Logística</span>
                </Link>
              </div>

              <button className="w-full bg-blue-50 p-6 rounded-[2rem] border border-blue-100 flex items-center justify-between group hover:bg-blue-100 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-blue-600 shadow-sm">
                    <Scan className="w-6 h-6" />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 leading-none">Escanear Ticket</p>
                    <p className="text-blue-700/60 text-xs mt-1">Check-in de entrega</p>
                  </div>
                </div>
                <ChevronRight className="w-5 h-5 text-blue-300 group-hover:text-blue-600 transition-colors" />
              </button>
            </div>
          </div>

          {/* Smart Tip */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 bg-slate-900 rounded-[2.5rem] text-white relative overflow-hidden shadow-2xl shadow-slate-300"
          >
            <div className="absolute -right-4 -top-4 text-white/5">
              <Lightbulb size={120} />
            </div>
            <div className="relative z-10 space-y-4">
              <div className="flex items-center gap-2 text-blue-400 font-black text-[10px] uppercase tracking-[0.2em]">
                <Lightbulb className="w-4 h-4" />
                <span>Tip del día</span>
              </div>
              <p className="text-lg font-medium leading-relaxed">
                Revisa el stock de <span className="text-blue-400 font-bold">Girasoles</span>. Quedan pocas unidades para los pedidos programados de esta tarde.
              </p>
              <button className="text-xs font-black uppercase tracking-widest text-white/50 hover:text-white transition-colors flex items-center gap-2">
                Entendido
                <CheckCircle2 className="w-3 h-3" />
              </button>
            </div>
          </motion.div>
        </section>
      </div>

      {/* Footer Info */}
      <footer className="flex flex-col md:flex-row items-center justify-between pt-8 border-t border-slate-200 text-slate-400 text-[10px] font-black uppercase tracking-[0.2em] gap-4">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
            <span>Servidor Online</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span>{orders.length} Pedidos Totales</span>
          </div>
        </div>
        <p>© 2024 Florería Bautista • Panel de Control</p>
      </footer>
    </motion.main>
  );
}
