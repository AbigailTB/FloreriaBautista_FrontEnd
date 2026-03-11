import React, { useState, useEffect } from 'react';
import { 
  Package, 
  AlertTriangle, 
  Search, 
  Plus, 
  ArrowUpRight, 
  ArrowDownRight,
  MoreVertical,
  History,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService, Product } from '../services/dataService';

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [inventory, setInventory] = useState<Product[]>([]);
  const [stats, setStats] = useState({
    totalValue: 0,
    criticalItems: 0,
    entriesMonth: 0,
    exitsMonth: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      const items = DataService.getInventoryItems();
      const inventoryStats = DataService.getInventoryStats();
      setInventory(items);
      setStats(inventoryStats);
      setLoading(false);
    };

    loadData();
  }, []);

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusInfo = (item: Product) => {
    if (item.stock <= 0) return { label: 'Sin Stock', color: 'text-rose-600', bg: 'bg-rose-100', dot: 'bg-rose-500' };
    if (item.stock <= item.stock_minimo) return { label: 'Crítico', color: 'text-rose-600', bg: 'bg-rose-100', dot: 'bg-rose-500' };
    if (item.stock <= item.stock_minimo * 1.5) return { label: 'Bajo', color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-500' };
    return { label: 'Óptimo', color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-[#1e3a5f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Gestión de Inventario</h1>
          <p className="text-sm text-slate-500">Control de stock de flores, insumos y accesorios</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <History className="w-4 h-4" />
            Movimientos
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold hover:bg-opacity-90 shadow-lg shadow-[#1e3a5f]/20 transition-all">
            <Plus className="w-4 h-4" />
            Añadir Insumo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Valor Total', value: `$${(stats?.totalValue || 0).toLocaleString()}`, icon: <Package className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Items Críticos', value: stats.criticalItems.toString(), icon: <AlertTriangle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Entradas (Mes)', value: stats.entriesMonth.toString(), icon: <ArrowUpRight className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Salidas (Mes)', value: stats.exitsMonth.toString(), icon: <ArrowDownRight className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
          >
            <div className={`p-2 w-fit rounded-lg ${stat.bg} ${stat.color} mb-3`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1 text-slate-900">{stat.value}</h3>
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por nombre de insumo o SKU..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-0"
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
          >
            <option value="Todas">Todas las categorías</option>
            <option value="Flores de Corte">Flores de Corte</option>
            <option value="Insumos">Insumos</option>
            <option value="Accesorios">Accesorios</option>
            <option value="Ramos">Ramos</option>
            <option value="Plantas">Plantas</option>
          </select>
          <button 
            onClick={() => setLoading(true) || setTimeout(() => setLoading(false), 500)}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Sincronizar
          </button>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Insumo / Artículo</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">SKU</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Categoría</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Stock Actual</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Mínimo</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {filteredInventory.map((item) => {
                  const statusInfo = getStatusInfo(item);
                  return (
                    <motion.tr 
                      key={item.id} 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden">
                            {item.image ? (
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <Package className="w-5 h-5" />
                            )}
                          </div>
                          <p className="text-sm font-bold text-slate-900">{item.name}</p>
                        </div>
                      </td>
                      <td className="p-4 text-xs font-mono text-slate-500">{item.sku}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-lg bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wider">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-black text-slate-900">{item.stock}</span>
                          <span className="text-[10px] text-slate-400 font-medium">unidades</span>
                        </div>
                      </td>
                      <td className="p-4 text-sm text-slate-500 font-medium">{item.stock_minimo}</td>
                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusInfo.bg} ${statusInfo.color}`}>
                          <span className={`size-1.5 rounded-full ${statusInfo.dot} ${statusInfo.label === 'Crítico' ? 'animate-pulse' : ''}`}></span>
                          {statusInfo.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-[#1e3a5f] transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
          <button className="text-xs font-bold text-slate-500 hover:text-[#1e3a5f] transition-colors">Generar reporte de inventario para auditoría</button>
        </div>
      </div>
    </div>
  );
}
