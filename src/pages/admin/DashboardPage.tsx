import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingCart, 
  CreditCard, 
  UserPlus, 
  AlertTriangle,
  MoreVertical,
  ChevronRight,
  Download,
  Briefcase,
  UserCircle,
  User,
  Package,
  MapPin,
  ArrowRight,
  Heart,
  Clock,
  CheckCircle2,
  Bell
} from 'lucide-react';
import { DataService } from '../../services/dataService';
import { FadeIn, ScaleIn, StaggerContainer, AnimatedButton, GlassCard } from '../../components/Animations';
import { AnimatePresence } from 'motion/react';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState(DataService.getDashboardStats());
  const [alerts, setAlerts] = useState(DataService.getInventoryAlerts());
  const [weeklySales, setWeeklySales] = useState(DataService.getWeeklySalesData());
  const [recentOrders, setRecentOrders] = useState(DataService.getOrders().slice(0, 5));
  const [orderFilter, setOrderFilter] = useState<'all' | 'pending' | 'shipped'>('all');
  const [openActionMenu, setOpenActionMenu] = useState<string | null>(null);

  const filteredOrders = recentOrders.filter(order => {
    if (orderFilter === 'all') return true;
    return order.status === orderFilter;
  });

  const handleExportReport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({ stats, weeklySales }, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "reporte_mensual.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleUpdateOrderStatus = async (orderId: string, status: 'pending' | 'shipped' | 'delivered' | 'cancelled') => {
    await DataService.updateOrderStatus(orderId, status);
    setRecentOrders(DataService.getOrders().slice(0, 5));
    setOpenActionMenu(null);
  };

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;
  const totalPages = Math.ceil(alerts.length / pageSize);

  const displayedAlerts = alerts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 italic">Cargando información del usuario...</p>
      </div>
    );
  }

  // If user is admin, show the full dashboard
  if (user.role === 'admin' || user.role === 'administrador') {
    return (
      <div className="w-full h-full space-y-10">
        {/* Header */}
        <FadeIn>
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Panel de Control</h1>
              <p className="text-slate-500 font-medium">Resumen general del rendimiento de tu florería</p>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExportReport}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
              >
                <Download className="w-4 h-4" />
                Reporte Mensual
              </button>
              <Link to="/admin/auditoria">
                <AnimatedButton className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all">
                  <TrendingUp className="w-4 h-4" />
                  Ver Insights
                </AnimatedButton>
              </Link>
            </div>
          </div>
        </FadeIn>

        {/* KPI Section */}
        <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: 'Ventas Totales', value: `$${(stats?.totalSales || 0).toLocaleString()}`, icon: <TrendingUp className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+15.4%' },
            { label: 'Pedidos Totales', value: (stats?.orderCount || 0).toString(), icon: <ShoppingCart className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50', trend: 'Activos' },
            { label: 'Ticket Promedio', value: `$${(stats?.averageTicket || 0).toFixed(2)}`, icon: <CreditCard className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50', trend: 'Optimizado' },
            { label: 'Nuevos Clientes', value: (stats?.newCustomers || 0).toString(), icon: <UserPlus className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+8.2%' },
          ].map((stat, idx) => (
            <GlassCard key={idx} className="p-6 group border-none bg-white shadow-sm hover:shadow-xl transition-all">
              <div className="flex justify-between items-start mb-4">
                <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color} group-hover:scale-110 transition-transform shadow-sm`}>
                  {stat.icon}
                </div>
                <span className={`text-[10px] font-black px-3 py-1 rounded-full ${stat.bg} ${stat.color} border border-current/10`}>
                  {stat.trend}
                </span>
              </div>
              <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
              <h3 className="text-3xl font-black text-slate-900 tracking-tight">{stat.value}</h3>
            </GlassCard>
          ))}
        </StaggerContainer>

        {/* Alerts & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Alert (Important) */}
          <FadeIn delay={0.2} className="lg:col-span-1 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-black flex items-center gap-2 text-slate-900">
                <AlertTriangle className="w-6 h-6 text-orange-500" />
                Alertas de Stock
              </h2>
              <span className="px-3 py-1 bg-rose-100 text-rose-600 text-[10px] font-black rounded-full uppercase tracking-widest">Crítico</span>
            </div>
            
            <div className="space-y-4">
              {alerts.length > 0 ? (
                <>
                  <AnimatePresence mode="popLayout">
                    {displayedAlerts.map((p, idx) => (
                      <motion.div 
                        key={p.id}
                        layout
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className="p-5 bg-white border border-slate-100 rounded-3xl shadow-sm hover:shadow-md transition-all group"
                      >
                        <div className="flex justify-between items-start gap-4">
                          <div className="flex-1">
                            <p className="text-sm font-black text-slate-900 group-hover:text-rose-600 transition-colors">{p.name}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-rose-500 rounded-full" 
                                  style={{ width: `${(p.stock / p.stock_minimo) * 100}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] font-black text-rose-600">{p.stock}/{p.stock_minimo}</span>
                            </div>
                          </div>
                          <AnimatedButton className="bg-rose-600 hover:bg-rose-700 text-white text-[10px] font-black px-4 py-2 rounded-xl shadow-lg shadow-rose-600/20 transition-all shrink-0">
                            REABASTECER
                          </AnimatedButton>
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-6 mt-6">
                      <button onClick={prevPage} className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                        <ChevronRight className="w-5 h-5 rotate-180" />
                      </button>
                      <span className="text-xs font-black text-slate-400 tracking-widest">
                        {currentPage + 1} / {totalPages}
                      </span>
                      <button onClick={nextPage} className="p-3 rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-slate-900 hover:bg-slate-50 transition-all shadow-sm">
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="p-10 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-200">
                  <CheckCircle2 className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
                  <p className="text-sm text-slate-500 font-medium">Todo bajo control. No hay alertas.</p>
                </div>
              )}
            </div>
          </FadeIn>

          {/* Weekly Sales Chart */}
          <FadeIn delay={0.3} className="lg:col-span-2">
            <GlassCard className="p-8 h-full">
              <div className="flex justify-between items-center mb-10">
                <div>
                  <h2 className="text-xl font-black text-slate-900">Ventas Semanales</h2>
                  <p className="text-slate-400 text-xs font-medium mt-1">Rendimiento de los últimos 7 días</p>
                </div>
                <div className="flex gap-3">
                  <button className="text-[10px] font-black uppercase tracking-widest bg-slate-100 text-slate-500 px-4 py-2 rounded-xl hover:bg-slate-200 transition-colors flex items-center gap-2">
                    <Download className="w-3 h-3" />
                    Exportar
                  </button>
                </div>
              </div>
              <div className="flex items-end justify-between h-56 gap-6 pt-4">
                {weeklySales.map((item, idx) => {
                  const maxTotal = Math.max(...weeklySales.map(d => d.total));
                  const height = maxTotal > 0 ? `${(item.total / maxTotal) * 100}%` : '5%';
                  return (
                    <div key={idx} className="flex-1 flex flex-col items-center gap-4 group">
                      <div className="relative w-full flex flex-col items-center">
                        <motion.div 
                          initial={{ height: 0 }}
                          animate={{ height }}
                          className={`w-full max-w-[40px] rounded-t-2xl transition-all relative overflow-hidden ${
                            item.day === 'HOY' 
                              ? 'bg-gradient-to-t from-blue-600 to-blue-400 shadow-lg shadow-blue-600/20' 
                              : 'bg-slate-100 group-hover:bg-slate-200'
                          }`} 
                        >
                          {item.day === 'HOY' && (
                            <div className="absolute inset-0 bg-white/10 animate-pulse"></div>
                          )}
                        </motion.div>
                        <div className="absolute -top-8 opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-[10px] font-black bg-slate-900 text-white px-2 py-1 rounded-md shadow-xl">
                            ${item.total}
                          </span>
                        </div>
                      </div>
                      <span className={`text-[10px] font-black tracking-widest uppercase ${item.day === 'HOY' ? 'text-blue-600' : 'text-slate-400'}`}>
                        {item.day}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </FadeIn>
        </div>

        {/* Recent Orders Table */}
        <FadeIn delay={0.4}>
          <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl overflow-hidden">
            <div className="p-8 border-b border-slate-50 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
              <div>
                <h2 className="text-xl font-black text-slate-900">Pedidos Recientes</h2>
                <p className="text-slate-400 text-xs font-medium mt-1">Últimas transacciones procesadas</p>
              </div>
              <div className="flex p-1.5 bg-slate-50 rounded-2xl">
                <button 
                  onClick={() => setOrderFilter('all')}
                  className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${orderFilter === 'all' ? 'text-white bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Todos
                </button>
                <button 
                  onClick={() => setOrderFilter('pending')}
                  className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${orderFilter === 'pending' ? 'text-white bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Pendientes
                </button>
                <button 
                  onClick={() => setOrderFilter('shipped')}
                  className={`px-6 py-2.5 text-[10px] font-black uppercase tracking-widest rounded-xl transition-colors ${orderFilter === 'shipped' ? 'text-white bg-blue-600 shadow-lg shadow-blue-600/20' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  Enviados
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50">
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">ID Pedido</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Monto Total</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Método Pago</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha Registro</th>
                    <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {filteredOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors group">
                      <td className="px-8 py-5">
                        <span className="text-sm font-black text-slate-900 group-hover:text-blue-600 transition-colors">#{order.id}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-base font-black text-slate-900">${order.total}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm ${
                          order.status === 'pending' ? 'bg-amber-50 text-amber-600' :
                          order.status === 'shipped' ? 'bg-blue-50 text-blue-600' :
                          'bg-emerald-50 text-emerald-600'
                        }`}>
                          <span className={`size-1.5 rounded-full ${
                            order.status === 'pending' ? 'bg-amber-500' :
                            order.status === 'shipped' ? 'bg-blue-500' :
                            'bg-emerald-500'
                          }`}></span>
                          {order.status === 'pending' ? 'Pendiente' : order.status === 'shipped' ? 'Enviado' : order.status === 'delivered' ? 'Entregado' : 'Cancelado'}
                        </span>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-500">
                          <CreditCard className="w-4 h-4" />
                          <span className="text-xs font-bold capitalize">{order.paymentMethod}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-2 text-slate-400">
                          <Clock className="w-4 h-4" />
                          <span className="text-xs font-medium">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right relative">
                        <button 
                          onClick={() => setOpenActionMenu(openActionMenu === order.id ? null : order.id)}
                          className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-white rounded-xl transition-all shadow-sm"
                        >
                          <MoreVertical className="w-5 h-5" />
                        </button>
                        <AnimatePresence>
                          {openActionMenu === order.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 10 }}
                              animate={{ opacity: 1, scale: 1, y: 0 }}
                              exit={{ opacity: 0, scale: 0.95, y: 10 }}
                              className="absolute right-8 top-14 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-20"
                            >
                              <div className="p-2 flex flex-col">
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'shipped')}
                                  className="text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-blue-50 hover:text-blue-600 rounded-xl transition-colors"
                                >
                                  Marcar como Enviado
                                </button>
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'delivered')}
                                  className="text-left px-4 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl transition-colors"
                                >
                                  Marcar como Entregado
                                </button>
                                <button 
                                  onClick={() => handleUpdateOrderStatus(order.id, 'cancelled')}
                                  className="text-left px-4 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                >
                                  Cancelar Pedido
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-6 bg-slate-50/30 flex justify-center border-t border-slate-50">
              <AnimatedButton className="text-[10px] font-black text-blue-600 hover:underline uppercase tracking-[0.2em] flex items-center gap-2">
                Explorar historial completo
                <ChevronRight className="w-4 h-4" />
              </AnimatedButton>
            </div>
          </div>
        </FadeIn>
      </div>
    );
  }

  // Welcome message for other roles
  if (user.role === 'customer' || user.role === 'cliente') {
    return (
      <div className="font-display bg-[#f8f6f6] dark:bg-[#1a1c1e] text-slate-900 dark:text-slate-100 min-h-screen">
        <main className="max-w-7xl mx-auto pb-20 pt-8">
          <FadeIn>
            <section className="p-4 lg:p-10">
              <div className="relative min-h-[520px] rounded-[3rem] overflow-hidden flex items-center justify-start p-8 lg:p-20 shadow-2xl">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-[10s] hover:scale-110" style={{ backgroundImage: "linear-gradient(to right, rgba(26, 59, 91, 0.9) 0%, rgba(26, 59, 91, 0.4) 60%, rgba(26, 59, 91, 0.1) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiqKa-pG2AUir0S_KPqT0wNmI1l7oWuYZHREe1DXshdkDbD3P_UUdpai_hEtg8c0AcHQzBhXp-FXiectMMB6_zq6rNl-9SC_ji0wUyuZC_Y_biJz5CI-Y4rbjYCGMHXqs9PDdi1vJBULg6KR0q6Uf46uUwn3xLuf3YtFAqiaJ4bbmLf-aXcpomLsJEufuPU5Vqct64J1qg-5Jw4OzYiixOw5l5r09HJ9GHjpSFetP-fpaZSrvVLtK4jI6nfrOTuVzzqXZ9-Obk75yj')" }}>
                </div>
                <div className="relative z-10 max-w-xl text-white">
                  <motion.span 
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-block px-4 py-1.5 bg-[#facc15] text-[#1a3b5b] text-[10px] font-black rounded-full mb-6 uppercase tracking-widest"
                  >
                    BIENVENIDO DE VUELTA
                  </motion.span>
                  <h1 className="text-5xl lg:text-7xl font-black mb-8 leading-[1.1] tracking-tight">
                    Tu próximo detalle inolvidable te espera, <span className="text-[#facc15]">{user.name.split(' ')[0]}</span>
                  </h1>
                  <p className="text-xl text-white/80 mb-10 leading-relaxed font-medium">
                    Flores frescas seleccionadas a mano para transformar cualquier momento en un recuerdo eterno. Descubre nuestra colección de temporada.
                  </p>
                  <div className="flex flex-wrap gap-5">
                    <Link to="/catalogo">
                      <AnimatedButton className="px-10 py-5 bg-[#facc15] text-[#1a3b5b] font-black rounded-2xl hover:bg-white transition-all shadow-xl shadow-[#facc15]/20">
                        Ver catálogo
                      </AnimatedButton>
                    </Link>
                    <Link to="/catalogo">
                      <AnimatedButton className="px-10 py-5 bg-white/10 backdrop-blur-xl text-white font-black rounded-2xl hover:bg-white/20 transition-all border border-white/30">
                        Personalizar ramo
                      </AnimatedButton>
                    </Link>
                  </div>
                </div>
              </div>
            </section>
          </FadeIn>
          
          <section className="px-4 lg:px-10 py-12">
            <FadeIn delay={0.2}>
              <h2 className="text-3xl font-black mb-10 flex items-center gap-3 text-slate-900 dark:text-white">
                <Package className="text-[#1a3b5b] dark:text-[#facc15] w-8 h-8" /> Accesos Directos
              </h2>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <Link to="/mis-pedidos" className="group relative h-64 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCawVT-5B_e0L-ouIC8qN1I4mCP8bdbedGw7cKEu8AhzGMRGHciGyxxcI2PAyKo5kNzwYsB85lW8gJeRgOqR1f8VROGvlqpW9YWQE1FK064J4dw9Yq4YWazpuL49sUXRG_MiRu8Nc5qarLEdWo1-U3BdWt9loEulnXw9vIquy0XGITKMILW7pwdKomvhA6l3HgyIxvsCpZTn0wAYgUlyf8jE9pQHITdhyIusiIfPShPSZ0CKIdDJjEAL8QZvfb6fFdUpsyi1tKY-qDk')" }}>
                </div>
                <div className="relative h-full flex flex-col justify-end p-10 text-white">
                  <div className="p-3 bg-[#facc15] rounded-2xl w-fit mb-4 shadow-lg">
                    <Package className="text-[#1a3b5b] w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black mb-2">Historial de pedidos</h3>
                  <p className="text-white/70 text-sm font-medium">Revisa el estado de tus entregas y pedidos pasados</p>
                </div>
              </Link>
              <Link to="/notificaciones" className="group relative h-64 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCawVT-5B_e0L-ouIC8qN1I4mCP8bdbedGw7cKEu8AhzGMRGHciGyxxcI2PAyKo5kNzwYsB85lW8gJeRgOqR1f8VROGvlqpW9YWQE1FK064J4dw9Yq4YWazpuL49sUXRG_MiRu8Nc5qarLEdWo1-U3BdWt9loEulnXw9vIquy0XGITKMILW7pwdKomvhA6l3HgyIxvsCpZTn0wAYgUlyf8jE9pQHITdhyIusiIfPShPSZ0CKIdDJjEAL8QZvfb6fFdUpsyi1tKY-qDk')" }}>
                </div>
                <div className="relative h-full flex flex-col justify-end p-10 text-white">
                  <div className="p-3 bg-[#facc15] rounded-2xl w-fit mb-4 shadow-lg">
                    <Bell className="text-[#1a3b5b] w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black mb-2">Notificaciones</h3>
                  <p className="text-white/70 text-sm font-medium">Mantente al día con tus pedidos y ofertas</p>
                </div>
              </Link>
              <Link to="/mis-direcciones" className="group relative h-64 rounded-[2.5rem] overflow-hidden cursor-pointer shadow-xl">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5SdB5oVCRnajVoX1GjQW73VFK1mXNxnXdkfuByUxnA5eZvySHmcNPiTD1dOXTmX824nJkMkYs1rFfpwqW3AlKXcmXmX6SHw75lxZRLCtSvtfuRhI79252NpqYIm1k-7_eGOjKJFfz5IvRd7NYK0nMTYqRB923Qw3tQK7V80NZ8w_9482fCXUhy7zUoomARrUWyA6xDmK9YBBQKnYAUigaTQJLh0OsO_YJXv3VMGrx1XQahGchsKv4pMELC69NwJ-XFFEGBd30usvi')" }}>
                </div>
                <div className="relative h-full flex flex-col justify-end p-10 text-white">
                  <div className="p-3 bg-[#facc15] rounded-2xl w-fit mb-4 shadow-lg">
                    <MapPin className="text-[#1a3b5b] w-6 h-6" />
                  </div>
                  <h3 className="text-3xl font-black mb-2">Gestión de direcciones</h3>
                  <p className="text-white/70 text-sm font-medium">Administra tus lugares de entrega frecuentes</p>
                </div>
              </Link>
            </StaggerContainer>
          </section>
          
          <section className="px-4 lg:px-10 py-12">
            <FadeIn delay={0.4}>
              <div className="flex items-center justify-between mb-10">
                <h2 className="text-3xl font-black flex items-center gap-3 text-slate-900 dark:text-white">
                  <span className="text-[#1a3b5b] dark:text-[#facc15]">🌿</span> Novedades de temporada
                </h2>
                <Link to="/catalogo">
                  <AnimatedButton className="text-[#1a3b5b] dark:text-[#facc15] font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:underline">
                    Ver todas <ArrowRight className="w-4 h-4" />
                  </AnimatedButton>
                </Link>
              </div>
            </FadeIn>
            <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[
                {
                  title: "Amanecer Primaveral",
                  price: "$45.00",
                  desc: "Mix de tulipanes, lirios y follaje verde intenso.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCuJRj-eKLvW5rq6oR6TuNxGrlar4ppFGyUu1ON5MGuNZCeHhxwumbxBRxa2bQwZzEnApQrRCk-o5W2rHZvzn18TYg2LF8slSqb352y7Psw-5-LAiw1Wd283iuaf0m24zYGVUClj3vEfuC32MutzUC1VwzpfFNJzFegJHgcB6lgQiuzdsRCG8INX6qZ-Agbp1-Nequ2rVYWNkLTxvyT0gczgSl-nWsy9H326JtCM5SF2IePhg3cUG7QRzjThGVuvK72p1IGhD2DDQQt",
                  tag: "NOVEDAD"
                },
                {
                  title: "Elegancia Carmesí",
                  price: "$62.00",
                  desc: "12 Rosas rojas premium con tallo largo.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAy8yMEBwvCMwBWcpEeP4pLJ_QKbgx5rda_S5cA3zyzkaui1FjmNz-Z2y3qBYRxB9bO1NuvgD0Va3Bt__Y46df5fCz4eGuVeGrOdIWa3CQftiCM0hKSdOSMvPKzU7wfcXAXzbzOBknNFk_sX2mx36lH3Prd-PHJd7e4ACHDidI0_NoKA6cC1KsH56BRFwX7_TtQbJ-oORKM6kRycx-uVGhi3T6cgsiPnK_MAOseXpxAEVxGbBjdM2GOidhE3OT_HswHKOkBHOvd0Bht"
                },
                {
                  title: "Rayo de Sol",
                  price: "$38.00",
                  desc: "Girasoles brillantes acompañados de margaritas blancas.",
                  img: "https://lh3.googleusercontent.com/aida-public/AB6AXuA-AYO9Mm4EgzL_xvSOa9Z5ktrYsFSKBLTMYzVM97F-zFTOnOsy2NbHlMryIkcuQFzekrk78Fss50kA-vD19WIcltw38Byxhvs-HyfqHgD9Fs2MuEUuV8RqYEhcNwb4vLWSwww397EY0WrNmn90wnYMTY94qTZKha__G0Sp7EyWGZYIt3IUK94CKxpRY55RD6gxojI1VLJQm8OyvUYakTZYMx5KbKeypDFkUAj5FRMfxXEyxiCVVkqbMADIwAGfbHy1WWQTR0TTRxsa"
                }
              ].map((item, idx) => (
                <GlassCard key={idx} className="overflow-hidden group flex flex-col h-full">
                  <div className="relative h-80 overflow-hidden">
                    <div className="absolute top-4 right-4 z-10">
                      <button className="bg-white/90 p-3 rounded-full text-slate-400 hover:text-rose-500 transition-all shadow-lg hover:scale-110 active:scale-95">
                        <Heart className="w-5 h-5" />
                      </button>
                    </div>
                    <img 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                      src={item.img} 
                      alt={item.title} 
                      referrerPolicy="no-referrer"
                    />
                    {item.tag && (
                      <div className="absolute bottom-0 left-0 bg-[#facc15] text-[#1a3b5b] px-6 py-2 font-black text-[10px] tracking-widest uppercase">
                        {item.tag}
                      </div>
                    )}
                  </div>
                  <div className="p-8 flex flex-col flex-1">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-black text-xl text-slate-900 dark:text-white">{item.title}</h4>
                      <span className="text-[#1a3b5b] dark:text-[#facc15] font-black text-lg">{item.price}</span>
                    </div>
                    <p className="text-slate-500 dark:text-slate-400 text-sm mb-8 font-medium line-clamp-2">{item.desc}</p>
                    <div className="mt-auto">
                      <AnimatedButton className="w-full py-4 bg-slate-50 dark:bg-slate-800 text-[#1a3b5b] dark:text-[#facc15] font-black rounded-2xl group-hover:bg-[#1a3b5b] group-hover:text-white dark:group-hover:bg-[#facc15] dark:group-hover:text-[#1a3b5b] transition-all shadow-sm group-hover:shadow-xl group-hover:shadow-[#1a3b5b]/20">
                        <ShoppingCart className="w-5 h-5" /> Añadir al carrito
                      </AnimatedButton>
                    </div>
                  </div>
                </GlassCard>
              ))}
            </StaggerContainer>
          </section>
        </main>
      </div>
    );
  }

  const getWelcomeMessage = () => {
    switch (user.role) {
      case 'staff':
      case 'empleado':
        return {
          title: "¡Bienvenido Empleado!",
          description: "Gestiona los pedidos y el inventario del día de hoy.",
          icon: <Briefcase className="w-16 h-16 text-emerald-600" />,
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200"
        };
      case 'customer':
      case 'cliente':
        return {
          title: "¡Bienvenido Cliente!",
          description: "Explora nuestro catálogo y encuentra el arreglo perfecto.",
          icon: <UserCircle className="w-16 h-16 text-brand-coral" />,
          bgColor: "bg-brand-light",
          borderColor: "border-brand-coral/20"
        };
      default:
        return {
          title: `¡Bienvenido ${user.name}!`,
          description: "Gracias por visitarnos.",
          icon: <User className="w-16 h-16 text-gray-600" />,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`max-w-2xl w-full ${welcome.bgColor} border ${welcome.borderColor} rounded-3xl p-8 md:p-12 text-center shadow-xl`}
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {welcome.icon}
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-black text-brand-deep mb-4"
        >
          {welcome.title}
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          {welcome.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Usuario</p>
            <p className="font-bold text-brand-deep">{user.name}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Correo</p>
            <p className="font-bold text-brand-deep">{user.email}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Rol de acceso</p>
            <p className="font-bold text-brand-deep capitalize">{user.role}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
