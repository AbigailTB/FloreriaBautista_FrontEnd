import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  UserPlus, 
  Package,
  Download,
  FileText,
  Filter,
  ChevronDown,
  Minus,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { DataService } from '../../services/dataService';
import { FadeIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';

export default function ReportsPage() {
  const [stats, setStats] = useState<any>(null);
  const [weeklySales, setWeeklySales] = useState<any[]>([]);
  const [topCustomers, setTopCustomers] = useState<any[]>([]);
  const [topProducts, setTopProducts] = useState<any[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [inventoryStats, setInventoryStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const dashboardStats = DataService.getDashboardStats();
      const weeklyData = DataService.getWeeklySalesData();
      const customers = DataService.getTopCustomers(3);
      const products = DataService.getTopProducts(4);
      const alerts = DataService.getInventoryAlerts();
      const invStats = DataService.getInventoryStats();

      setStats(dashboardStats);
      setWeeklySales(weeklyData);
      setTopCustomers(customers);
      setTopProducts(products);
      setInventoryAlerts(alerts.slice(0, 3));
      setInventoryStats(invStats);
      setLoading(false);
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-8">
      {/* Header Section */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Reportes Analíticos</h1>
            <p className="text-sm text-slate-500 font-medium">Última actualización: Hoy, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="flex items-center gap-4">
            <AnimatedButton className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-black hover:bg-slate-50 transition-all shadow-sm">
              <FileText className="w-4 h-4 text-rose-500" />
              Exportar PDF
            </AnimatedButton>
            <AnimatedButton className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all">
              <Download className="w-4 h-4" />
              Exportar Excel
            </AnimatedButton>
          </div>
        </div>
      </FadeIn>

      {/* Filters */}
      <FadeIn delay={0.2}>
        <div className="flex flex-wrap gap-4">
          <AnimatedButton className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-100 text-sm font-black shadow-sm">
            <span className="text-slate-400">Periodo: </span>
            <span className="text-blue-600">Este Mes</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </AnimatedButton>
          <AnimatedButton className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-100 text-sm font-black shadow-sm">
            <span className="text-slate-400">Sucursal: </span>
            <span className="text-blue-600">Todas</span>
            <ChevronDown className="w-4 h-4 text-slate-400" />
          </AnimatedButton>
          <AnimatedButton className="flex items-center gap-2 px-5 py-3 bg-white rounded-2xl border border-slate-100 text-sm font-black shadow-sm">
            <Filter className="w-4 h-4 text-slate-400" />
            Más Filtros
          </AnimatedButton>
        </div>
      </FadeIn>

      {/* Summary Cards */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ventas Totales', value: `$${(stats?.totalSales || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, trend: '+12.5%', trendIcon: <TrendingUp className="w-3 h-3" />, trendColor: 'text-emerald-500', bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Pedidos', value: (stats?.orderCount || 0).toString(), icon: <ShoppingBag className="w-5 h-5" />, trend: '+5.2%', trendIcon: <TrendingUp className="w-3 h-3" />, trendColor: 'text-emerald-500', bg: 'bg-amber-50', color: 'text-amber-600' },
          { label: 'Nuevos Clientes', value: (stats?.newCustomers || 0).toString(), icon: <UserPlus className="w-5 h-5" />, trend: '0.0%', trendIcon: <Minus className="w-3 h-3" />, trendColor: 'text-slate-500', bg: 'bg-purple-50', color: 'text-purple-600' },
          { label: 'Valor de Inventario', value: `$${(inventoryStats?.totalValue || 0).toLocaleString()}`, icon: <Package className="w-5 h-5" />, trend: '-2.1%', trendIcon: <TrendingDown className="w-3 h-3" />, trendColor: 'text-rose-500', bg: 'bg-rose-50', color: 'text-rose-600' },
        ].map((stat, idx) => (
          <GlassCard 
            key={idx} 
            className="p-6 border-none"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 ${stat.bg} rounded-2xl ${stat.color} shadow-sm`}>
                {stat.icon}
              </div>
              <span className={`${stat.trendColor} text-[10px] font-black flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-full`}>
                {stat.trend} {stat.trendIcon}
              </span>
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black mt-1 text-slate-900">{stat.value}</h3>
          </GlassCard>
        ))}
      </StaggerContainer>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trends */}
        <FadeIn delay={0.4} className="lg:col-span-2">
          <GlassCard className="p-8 border-none h-full">
            <div className="flex justify-between items-center mb-8">
              <h4 className="text-xl font-black text-slate-900">Tendencias de Venta</h4>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-blue-600 shadow-[0_0_8px_rgba(37,99,235,0.5)]"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Ventas</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="size-2.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.5)]"></span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Gastos</span>
                </div>
              </div>
            </div>
            <div className="relative h-[300px] w-full border-b border-l border-slate-100">
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                <motion.path 
                  d="M0 35 Q 10 32, 20 25 T 40 15 T 60 10 T 80 20 T 100 5" 
                  fill="none" 
                  stroke="#2563eb" 
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut" }}
                />
                <motion.path 
                  className="fill-blue-600/5" 
                  d="M0 35 Q 10 32, 20 25 T 40 15 T 60 10 T 80 20 T 100 5 L 100 40 L 0 40 Z"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                />
                <motion.path 
                  d="M0 38 Q 20 35, 40 30 T 70 25 T 100 28" 
                  fill="none" 
                  stroke="#FFD700" 
                  strokeDasharray="4 4" 
                  strokeWidth="2"
                  strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
                />
              </svg>
              <div className="absolute bottom-[-32px] w-full flex justify-between px-2 text-[10px] text-slate-400 font-black uppercase tracking-widest">
                {weeklySales.map(d => <span key={d.day}>{d.day}</span>)}
              </div>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Channel Distribution */}
        <FadeIn delay={0.5}>
          <GlassCard className="p-8 border-none flex flex-col h-full">
            <h4 className="text-xl font-black text-slate-900 mb-8">Canales de Venta</h4>
            <div className="flex-1 flex flex-col items-center justify-center">
              <div className="relative size-56 rounded-full border-[20px] border-slate-50 flex items-center justify-center shadow-inner">
                <motion.div 
                  className="absolute inset-0 rounded-full border-[20px] border-blue-600 border-r-transparent border-b-transparent shadow-[0_0_15px_rgba(37,99,235,0.2)]"
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
                <motion.div 
                  className="absolute inset-0 rounded-full border-[20px] border-amber-400 border-t-transparent border-l-transparent shadow-[0_0_15px_rgba(251,191,36,0.2)]"
                  initial={{ rotate: -45, opacity: 0 }}
                  animate={{ rotate: 45, opacity: 1 }}
                  transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
                />
                <div className="text-center">
                  <motion.p 
                    className="text-4xl font-black text-slate-900"
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {(stats?.orderCount || 0).toLocaleString()}
                  </motion.p>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mt-1">Total Pedidos</p>
                </div>
              </div>
              <div className="mt-10 space-y-4 w-full">
                {[
                  { label: 'Tienda Física', value: '65%', color: 'bg-blue-600' },
                  { label: 'E-commerce', value: '25%', color: 'bg-amber-400' },
                  { label: 'WhatsApp', value: '10%', color: 'bg-slate-200' },
                ].map((channel, idx) => (
                  <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className={`size-3 rounded-lg ${channel.color}`}></span>
                      <span className="text-xs font-black text-slate-600 uppercase tracking-wider">{channel.label}</span>
                    </div>
                    <span className="text-xs font-black text-slate-900">{channel.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </GlassCard>
        </FadeIn>
      </div>

      {/* Top Performers */}
      <FadeIn delay={0.6}>
        <GlassCard className="p-8 border-none">
          <h4 className="text-xl font-black text-slate-900 mb-8">Productos Más Vendidos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
            {topProducts.map((item, idx) => {
              const maxWidth = Math.max(...topProducts.map(p => p.sales));
              const width = `${(item.sales / maxWidth) * 100}%`;
              return (
                <div key={item.id} className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-black text-slate-700 uppercase tracking-wider text-xs">{item.name}</span>
                    <span className="font-black text-blue-600">{item.sales} ventas</span>
                  </div>
                  <div className="w-full bg-slate-50 h-3 rounded-full overflow-hidden shadow-inner">
                    <motion.div 
                      className={`${idx % 2 === 0 ? 'bg-blue-600' : 'bg-amber-400'} h-full rounded-full shadow-lg`} 
                      initial={{ width: 0 }}
                      animate={{ width }}
                      transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (idx * 0.1) }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </GlassCard>
      </FadeIn>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Analysis Table */}
        <FadeIn delay={0.7}>
          <GlassCard className="border-none overflow-hidden h-full">
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
              <h4 className="text-xl font-black text-slate-900">Top Clientes</h4>
              <AnimatedButton className="text-blue-600 text-[10px] font-black uppercase tracking-widest hover:underline">Ver todos</AnimatedButton>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-4">Cliente</th>
                    <th className="px-8 py-4">Última Compra</th>
                    <th className="px-8 py-4">Monto Total</th>
                    <th className="px-8 py-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {topCustomers.map((client) => (
                    <tr key={client.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5 flex items-center gap-4">
                        {client.avatar ? (
                          <img src={client.avatar} alt={client.name} className="size-10 rounded-2xl object-cover border-2 border-white shadow-sm" />
                        ) : (
                          <div className="size-10 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                            {client.name.charAt(0)}
                          </div>
                        )}
                        <div>
                          <p className="text-sm font-black text-slate-900">{client.name}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{client.email}</p>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-xs font-bold text-slate-600">
                        {new Date(client.lastOrder).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-8 py-5 text-sm font-black text-slate-900">${(client.total || 0).toLocaleString()}</td>
                      <td className="px-8 py-5">
                        <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                          client.status === 'VIP' ? 'bg-emerald-50 text-emerald-600' : 
                          client.status === 'Fiel' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-500'
                        } shadow-sm`}>{client.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </FadeIn>

        {/* Operational / Inventory Table */}
        <FadeIn delay={0.8}>
          <GlassCard className="border-none overflow-hidden h-full">
            <div className="px-8 py-6 border-b border-slate-50 bg-slate-50/30">
              <h4 className="text-xl font-black text-slate-900">Status de Inventario Crítico</h4>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                    <th className="px-8 py-4">Insumo / Flor</th>
                    <th className="px-8 py-4">Stock Actual</th>
                    <th className="px-8 py-4">Stock Mínimo</th>
                    <th className="px-8 py-4">Status</th>
                    <th className="px-8 py-4 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {inventoryAlerts.map((item) => (
                    <tr key={item.id} className="hover:bg-slate-50/30 transition-colors group">
                      <td className="px-8 py-5 text-sm font-black text-slate-900">{item.name}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-600">{item.stock}</td>
                      <td className="px-8 py-5 text-sm font-bold text-slate-400">{item.stock_minimo}</td>
                      <td className="px-8 py-5">
                        <span className={`flex items-center gap-2 ${item.stock === 0 ? 'text-rose-600' : 'text-rose-500'} text-[10px] font-black uppercase tracking-widest`}>
                          <span className={`size-2 rounded-full ${item.stock === 0 ? 'bg-rose-600 animate-pulse' : 'bg-rose-500'} shadow-[0_0_8px_rgba(244,63,94,0.4)]`}></span>
                          {item.stock === 0 ? 'Sin Stock' : 'Crítico'}
                        </span>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <AnimatedButton className="text-blue-600 text-[10px] font-black uppercase tracking-widest bg-blue-600/5 px-4 py-2 rounded-xl border border-blue-600/10 hover:bg-blue-600 hover:text-white transition-all shadow-sm">
                          Reabastecer
                        </AnimatedButton>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}
