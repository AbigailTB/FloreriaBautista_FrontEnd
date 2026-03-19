import React, { useState, useEffect } from 'react';
import {
  TrendingUp, TrendingDown, DollarSign, ShoppingBag, UserPlus, Package,
  Download, FileText, Filter, ChevronDown, Minus, RefreshCw, BarChart2
} from 'lucide-react';
import { motion } from 'motion/react';
import { DataService } from '../../services/dataService';
import { FadeIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';

export default function ReportsPage() {
  const [stats, setStats]                     = useState<any>(null);
  const [weeklySales, setWeeklySales]         = useState<any[]>([]);
  const [topCustomers, setTopCustomers]       = useState<any[]>([]);
  const [topProducts, setTopProducts]         = useState<any[]>([]);
  const [inventoryAlerts, setInventoryAlerts] = useState<any[]>([]);
  const [inventoryStats, setInventoryStats]   = useState<any>(null);
  const [loading, setLoading]                 = useState(true);

  useEffect(() => {
    setStats(DataService.getDashboardStats());
    setWeeklySales(DataService.getWeeklySalesData());
    setTopCustomers(DataService.getTopCustomers(3));
    setTopProducts(DataService.getTopProducts(4));
    setInventoryAlerts(DataService.getInventoryAlerts().slice(0, 3));
    setInventoryStats(DataService.getInventoryStats());
    setLoading(false);
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Cargando reportes...</span>
      </div>
    </div>
  );

  const time = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="w-full space-y-7">

      {/* ── HEADER ── */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <BarChart2 className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Análisis de negocio</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Reportes Analíticos</h1>
            <p className="text-slate-400 text-sm mt-0.5">Última actualización: Hoy, {time}</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:shadow-sm transition-all">
              <FileText className="w-4 h-4 text-rose-400" />
              Exportar PDF
            </button>
            <AnimatedButton className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all">
              <Download className="w-4 h-4" />
              Exportar Excel
            </AnimatedButton>
          </div>
        </div>
      </FadeIn>

      {/* ── FILTERS ── */}
      <FadeIn delay={0.1}>
        <div className="flex flex-wrap gap-2">
          {[
            { prefix: 'Periodo:', value: 'Este Mes' },
            { prefix: 'Sucursal:', value: 'Todas' },
          ].map((f, i) => (
            <button key={i} className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:border-slate-300 transition-all shadow-sm">
              <span className="text-slate-400">{f.prefix}</span>
              <span className="text-blue-600 font-semibold">{f.value}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
          ))}
          <button className="flex items-center gap-1.5 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-500 hover:border-slate-300 transition-all shadow-sm">
            <Filter className="w-3.5 h-3.5" />
            Más Filtros
          </button>
        </div>
      </FadeIn>

      {/* ── KPI CARDS ── */}
      <StaggerContainer className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Ventas Totales',     value: `$${(stats?.totalSales || 0).toLocaleString()}`,        icon: DollarSign,  trend: '+12.5%', up: true,  color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100' },
          { label: 'Pedidos',            value: (stats?.orderCount || 0).toString(),                    icon: ShoppingBag, trend: '+5.2%',  up: true,  color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100' },
          { label: 'Nuevos Clientes',    value: (stats?.newCustomers || 0).toString(),                  icon: UserPlus,    trend: '0.0%',   up: null,  color: 'text-purple-600',  bg: 'bg-purple-50',  border: 'border-purple-100' },
          { label: 'Valor Inventario',   value: `$${(inventoryStats?.totalValue || 0).toLocaleString()}`, icon: Package,   trend: '-2.1%',  up: false, color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100' },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`bg-white border ${s.border} rounded-2xl p-5 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-4">
              <div className={`size-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
                <s.icon className="w-[18px] h-[18px]" />
              </div>
              <span className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg ${
                s.up === true  ? 'bg-emerald-50 text-emerald-600' :
                s.up === false ? 'bg-rose-50 text-rose-500' :
                                 'bg-slate-100 text-slate-400'
              }`}>
                {s.up === true ? <TrendingUp className="w-3 h-3" /> : s.up === false ? <TrendingDown className="w-3 h-3" /> : <Minus className="w-3 h-3" />}
                {s.trend}
              </span>
            </div>
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
            <p className={`text-2xl font-black mt-1 ${s.color}`}>{s.value}</p>
          </motion.div>
        ))}
      </StaggerContainer>

      {/* ── SALES TREND + CHANNELS ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Sales Trend Chart */}
        <FadeIn delay={0.3} className="lg:col-span-2">
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm h-full">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h4 className="text-base font-black text-slate-900">Tendencias de Venta</h4>
                <p className="text-xs text-slate-400 mt-0.5">Últimos 7 días</p>
              </div>
              <div className="flex items-center gap-4">
                {[{ color: 'bg-blue-600', label: 'Ventas' }, { color: 'bg-amber-400', label: 'Gastos' }].map(l => (
                  <div key={l.label} className="flex items-center gap-1.5">
                    <span className={`size-2 rounded-full ${l.color}`} />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{l.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative h-[240px] w-full">
              {/* Y-axis grid lines */}
              {[0, 1, 2, 3, 4].map(i => (
                <div key={i} className="absolute left-0 right-0 border-t border-slate-50"
                  style={{ bottom: `${i * 25}%` }} />
              ))}
              <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
                {/* Gradient fill */}
                <defs>
                  <linearGradient id="blueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#2563eb" stopOpacity="0.12" />
                    <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
                  </linearGradient>
                </defs>
                <motion.path
                  d="M0 35 Q 10 32, 20 25 T 40 15 T 60 10 T 80 20 T 100 5"
                  fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut" }}
                />
                <motion.path
                  d="M0 35 Q 10 32, 20 25 T 40 15 T 60 10 T 80 20 T 100 5 L 100 40 L 0 40 Z"
                  fill="url(#blueGrad)"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                />
                <motion.path
                  d="M0 38 Q 20 35, 40 30 T 70 25 T 100 28"
                  fill="none" stroke="#fbbf24" strokeDasharray="3 3" strokeWidth="2" strokeLinecap="round"
                  initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }}
                  transition={{ duration: 1.8, ease: "easeInOut", delay: 0.4 }}
                />
              </svg>

              {/* X-axis labels */}
              <div className="absolute -bottom-6 w-full flex justify-between px-1">
                {weeklySales.map(d => (
                  <span key={d.day} className="text-[9px] text-slate-400 font-bold uppercase tracking-wider">{d.day}</span>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>

        {/* Channel Distribution */}
        <FadeIn delay={0.4}>
          <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm flex flex-col h-full">
            <h4 className="text-base font-black text-slate-900 mb-6">Canales de Venta</h4>

            {/* Donut */}
            <div className="flex flex-col items-center flex-1 justify-center gap-6">
              <div className="relative size-44 flex items-center justify-center">
                <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
                  {/* track */}
                  <circle cx="50" cy="50" r="38" fill="none" stroke="#f1f5f9" strokeWidth="14" />
                  {/* whatsapp 10% */}
                  <motion.circle cx="50" cy="50" r="38" fill="none" stroke="#e2e8f0" strokeWidth="14"
                    strokeDasharray="23.9 214.9" strokeDashoffset="0"
                    initial={{ strokeDasharray: "0 238.8" }}
                    animate={{ strokeDasharray: "23.9 214.9" }}
                    transition={{ delay: 0.6, duration: 1, ease: "easeOut" }} />
                  {/* ecommerce 25% */}
                  <motion.circle cx="50" cy="50" r="38" fill="none" stroke="#fbbf24" strokeWidth="14"
                    strokeDasharray="59.7 179.1" strokeDashoffset="-23.9"
                    initial={{ strokeDasharray: "0 238.8" }}
                    animate={{ strokeDasharray: "59.7 179.1" }}
                    transition={{ delay: 0.3, duration: 1, ease: "easeOut" }} />
                  {/* física 65% */}
                  <motion.circle cx="50" cy="50" r="38" fill="none" stroke="#2563eb" strokeWidth="14"
                    strokeDasharray="155.2 83.6" strokeDashoffset="-83.6"
                    initial={{ strokeDasharray: "0 238.8" }}
                    animate={{ strokeDasharray: "155.2 83.6" }}
                    transition={{ delay: 0, duration: 1, ease: "easeOut" }} />
                </svg>
                <div className="text-center z-10">
                  <motion.p className="text-3xl font-black text-slate-900"
                    initial={{ scale: 0.6, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 1 }}>
                    {(stats?.orderCount || 0)}
                  </motion.p>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">pedidos</p>
                </div>
              </div>

              <div className="w-full space-y-3">
                {[
                  { label: 'Tienda Física', pct: '65%', color: 'bg-blue-600' },
                  { label: 'E-commerce',    pct: '25%', color: 'bg-amber-400' },
                  { label: 'WhatsApp',      pct: '10%', color: 'bg-slate-200' },
                ].map((c, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className={`size-2.5 rounded-md ${c.color}`} />
                      <span className="text-xs font-semibold text-slate-600">{c.label}</span>
                    </div>
                    <span className="text-xs font-black text-slate-800">{c.pct}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </FadeIn>
      </div>

      {/* ── TOP PRODUCTS ── */}
      <FadeIn delay={0.5}>
        <div className="bg-white border border-slate-100 rounded-2xl p-6 shadow-sm">
          <h4 className="text-base font-black text-slate-900 mb-6">Productos Más Vendidos</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
            {topProducts.map((item, idx) => {
              const maxSales = Math.max(...topProducts.map(p => p.sales));
              const pct = `${(item.sales / maxSales) * 100}%`;
              const isBlue = idx % 2 === 0;
              return (
                <div key={item.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-slate-700 truncate">{item.name}</span>
                    <span className={`text-xs font-black ml-3 shrink-0 ${isBlue ? 'text-blue-600' : 'text-amber-500'}`}>
                      {item.sales} ventas
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <motion.div
                      className={`${isBlue ? 'bg-blue-600' : 'bg-amber-400'} h-full rounded-full`}
                      initial={{ width: 0 }} animate={{ width: pct }}
                      transition={{ duration: 1.2, ease: "easeOut", delay: 0.4 + idx * 0.1 }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </FadeIn>

      {/* ── TABLES ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top Clients */}
        <FadeIn delay={0.6}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h4 className="text-base font-black text-slate-900">Top Clientes</h4>
              <button className="text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors">Ver todos</button>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Cliente', 'Última Compra', 'Total', 'Status'].map(h => (
                    <th key={h} className="px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {topCustomers.map((client) => (
                  <tr key={client.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {client.avatar
                          ? <img src={client.avatar} alt={client.name} className="size-8 rounded-xl object-cover" />
                          : <div className="size-8 rounded-xl bg-slate-100 flex items-center justify-center text-sm font-bold text-slate-500">{client.name.charAt(0)}</div>
                        }
                        <div>
                          <p className="text-sm font-bold text-slate-800">{client.name}</p>
                          <p className="text-[10px] text-slate-400 truncate max-w-[100px]">{client.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-500">
                      {new Date(client.lastOrder).toLocaleDateString(undefined, { day: 'numeric', month: 'short' })}
                    </td>
                    <td className="px-6 py-4 text-sm font-black text-slate-800">${(client.total || 0).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${
                        client.status === 'VIP'  ? 'bg-emerald-50 text-emerald-600 border-emerald-100' :
                        client.status === 'Fiel' ? 'bg-blue-50 text-blue-600 border-blue-100' :
                                                   'bg-slate-50 text-slate-400 border-slate-100'
                      }`}>{client.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </FadeIn>

        {/* Critical Inventory */}
        <FadeIn delay={0.7}>
          <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden flex flex-col h-full">
            <div className="px-6 py-4 border-b border-slate-100">
              <h4 className="text-base font-black text-slate-900">Inventario Crítico</h4>
              <p className="text-xs text-slate-400 mt-0.5">Artículos que requieren reabastecimiento</p>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Insumo / Flor', 'Actual', 'Mínimo', 'Status', ''].map((h, i) => (
                    <th key={i} className={`px-6 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${i === 4 ? 'text-right' : ''}`}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {inventoryAlerts.map((item) => {
                  const isEmpty = item.stock === 0;
                  return (
                    <tr key={item.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                      <td className="px-6 py-4 text-sm font-bold text-slate-800">{item.name}</td>
                      <td className="px-6 py-4 text-sm font-bold text-slate-700">{item.stock}</td>
                      <td className="px-6 py-4 text-sm text-slate-400">{item.stock_minimo}</td>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold ${isEmpty ? 'text-rose-600' : 'text-rose-500'}`}>
                          <span className={`size-1.5 rounded-full ${isEmpty ? 'bg-rose-500 animate-pulse' : 'bg-rose-400'}`} />
                          {isEmpty ? 'Sin Stock' : 'Crítico'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button className="text-[10px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg hover:bg-blue-600 hover:text-white transition-all">
                          Reabastecer
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </FadeIn>
      </div>

    </div>
  );
}