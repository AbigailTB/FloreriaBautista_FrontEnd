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
import { DataService } from '../services/dataService';

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
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-[#1e3a5f] animate-spin" />
      </div>
    );
  }

  return (
    <motion.div 
      className="space-y-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Header Section */}
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Reportes Analíticos</h1>
          <p className="text-sm text-slate-500">Última actualización: Hoy, {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            <FileText className="w-4 h-4 text-red-500" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#607AFB] text-white rounded-xl text-sm font-bold hover:bg-[#607AFB]/90 shadow-lg shadow-[#607AFB]/20 transition-all">
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants} className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium">
          <span>Periodo: </span>
          <span className="font-bold">Este Mes</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium">
          <span>Sucursal: </span>
          <span className="font-bold">Todas</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium">
          <Filter className="w-4 h-4" />
          Más Filtros
        </button>
      </motion.div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Ventas Totales', value: `$${(stats?.totalSales || 0).toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, trend: '+12.5%', trendIcon: <TrendingUp className="w-3 h-3" />, trendColor: 'text-emerald-500', bg: 'bg-blue-50', color: 'text-blue-600' },
          { label: 'Pedidos', value: (stats?.orderCount || 0).toString(), icon: <ShoppingBag className="w-5 h-5" />, trend: '+5.2%', trendIcon: <TrendingUp className="w-3 h-3" />, trendColor: 'text-emerald-500', bg: 'bg-amber-50', color: 'text-amber-600' },
          { label: 'Nuevos Clientes', value: (stats?.newCustomers || 0).toString(), icon: <UserPlus className="w-5 h-5" />, trend: '0.0%', trendIcon: <Minus className="w-3 h-3" />, trendColor: 'text-slate-500', bg: 'bg-purple-50', color: 'text-purple-600' },
          { label: 'Valor de Inventario', value: `$${(inventoryStats?.totalValue || 0).toLocaleString()}`, icon: <Package className="w-5 h-5" />, trend: '-2.1%', trendIcon: <TrendingDown className="w-3 h-3" />, trendColor: 'text-rose-500', bg: 'bg-rose-50', color: 'text-rose-600' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            variants={itemVariants}
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2 ${stat.bg} rounded-lg ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`${stat.trendColor} text-xs font-bold flex items-center gap-1`}>
                {stat.trend} {stat.trendIcon}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-bold mt-1">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trends */}
        <motion.div variants={itemVariants} className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold">Tendencias de Venta</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#607AFB]"></span>
                <span className="text-xs font-medium text-slate-500">Ventas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-400"></span>
                <span className="text-xs font-medium text-slate-500">Gastos</span>
              </div>
            </div>
          </div>
          <div className="relative h-[280px] w-full border-b border-l border-slate-100">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <motion.path 
                d="M0 35 Q 10 32, 20 25 T 40 15 T 60 10 T 80 20 T 100 5" 
                fill="none" 
                stroke="#607AFB" 
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
              />
              <motion.path 
                className="fill-[#607AFB]/5" 
                d="M0 35 Q 10 32, 20 25 T 40 15 T 60 10 T 80 20 T 100 5 L 100 40 L 0 40 Z"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1, duration: 1 }}
              />
              <motion.path 
                d="M0 38 Q 20 35, 40 30 T 70 25 T 100 28" 
                fill="none" 
                stroke="#FFD700" 
                strokeDasharray="2" 
                strokeWidth="2"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, ease: "easeInOut", delay: 0.5 }}
              />
            </svg>
            <div className="absolute bottom-[-24px] w-full flex justify-between text-[10px] text-slate-400 font-bold uppercase">
              {weeklySales.map(d => <span key={d.day}>{d.day}</span>)}
            </div>
          </div>
        </motion.div>

        {/* Channel Distribution */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
          <h4 className="text-lg font-bold mb-6">Canales de Venta</h4>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative size-48 rounded-full border-[16px] border-slate-100 flex items-center justify-center">
              <motion.div 
                className="absolute inset-0 rounded-full border-[16px] border-[#607AFB] border-r-transparent border-b-transparent"
                initial={{ rotate: -90, opacity: 0 }}
                animate={{ rotate: 0, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border-[16px] border-amber-400 border-t-transparent border-l-transparent"
                initial={{ rotate: -45, opacity: 0 }}
                animate={{ rotate: 45, opacity: 1 }}
                transition={{ duration: 1.5, ease: "easeOut", delay: 0.3 }}
              />
              <div className="text-center">
                <motion.p 
                  className="text-2xl font-black"
                  initial={{ scale: 0.5, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: 1 }}
                >
                  {(stats?.orderCount || 0).toLocaleString()}
                </motion.p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              {[
                { label: 'Tienda Física (65%)', color: 'bg-[#607AFB]' },
                { label: 'E-commerce (25%)', color: 'bg-amber-400' },
                { label: 'WhatsApp (10%)', color: 'bg-slate-300' },
              ].map((channel, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className={`size-3 rounded ${channel.color}`}></span>
                  <span className="text-xs font-medium">{channel.label}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>

      {/* Top Performers */}
      <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold mb-6">Productos Más Vendidos</h4>
        <div className="space-y-6">
          {topProducts.map((item, idx) => {
            const maxWidth = Math.max(...topProducts.map(p => p.sales));
            const width = `${(item.sales / maxWidth) * 100}%`;
            return (
              <div key={item.id} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{item.name}</span>
                  <span className="font-bold">{item.sales} ventas</span>
                </div>
                <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                  <motion.div 
                    className={`${idx % 2 === 0 ? 'bg-[#607AFB]' : 'bg-amber-400'} h-full rounded-full`} 
                    initial={{ width: 0 }}
                    animate={{ width }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.5 + (idx * 0.1) }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Analysis Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="text-lg font-bold">Top Clientes</h4>
            <button className="text-[#607AFB] text-sm font-bold hover:underline">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Última Compra</th>
                  <th className="px-6 py-3">Monto Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {topCustomers.map((client) => (
                  <tr key={client.id}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={client.avatar} alt={client.name} className="size-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold">{client.name}</p>
                        <p className="text-[11px] text-slate-500">{client.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">
                      {new Date(client.lastOrder).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-black">${(client.total || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-[10px] font-bold ${
                        client.status === 'VIP' ? 'bg-emerald-100 text-emerald-600' : 
                        client.status === 'Fiel' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                      }`}>{client.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Operational / Inventory Table */}
        <motion.div variants={itemVariants} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h4 className="text-lg font-bold">Status de Inventario Crítico</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Insumo / Flor</th>
                  <th className="px-6 py-3">Stock Actual</th>
                  <th className="px-6 py-3">Stock Mínimo</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {inventoryAlerts.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-sm font-bold">{item.name}</td>
                    <td className="px-6 py-4 text-sm">{item.stock}</td>
                    <td className="px-6 py-4 text-sm">{item.stock_minimo}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 ${item.stock === 0 ? 'text-rose-600' : 'text-rose-500'} text-xs font-bold`}>
                        <span className={`size-2 rounded-full ${item.stock === 0 ? 'bg-rose-600 animate-pulse' : 'bg-rose-500'}`}></span>
                        {item.stock === 0 ? 'Sin Stock' : 'Crítico'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-[#607AFB] text-xs font-bold bg-[#607AFB]/5 px-3 py-1 rounded-lg border border-[#607AFB]/20">Reabastecer</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
