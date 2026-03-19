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
  RefreshCw,
  UploadCloud,
  DownloadCloud,
  TrendingUp,
  ChevronRight,
  Boxes
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService, Product } from '../../services/dataService';
import { FadeIn, ScaleIn, StaggerContainer, AnimatedButton, GlassCard } from '../../components/Animations';
import ImportModal from '../../components/ImportModal';
import ExportModal from '../../components/ExportModal';
import { useToast } from '../../hooks/useToast';

export default function AdminInventoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [inventory, setInventory] = useState<Product[]>([]);
  const [stats, setStats] = useState({ totalValue: 0, criticalItems: 0, entriesMonth: 0, exitsMonth: 0 });
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { showToast } = useToast();

  const [newItem, setNewItem] = useState<Partial<Product>>({
    name: '', category: 'Insumos', price: 0, stock: 0,
    stock_minimo: 5, status: 'Activo', image: '', description: '', isInventoryOnly: true
  });

  useEffect(() => {
    const items = DataService.getInventoryItems();
    const inventoryStats = DataService.getInventoryStats();
    setInventory(items);
    setStats(inventoryStats);
    setLoading(false);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleImportConfirm = async (data: any[]) => {
    setLoading(true);
    try {
      await DataService.importProducts(data.map(item => ({ ...item, isInventoryOnly: item.isInventoryOnly !== undefined ? item.isInventoryOnly : true })));
      setInventory(DataService.getInventoryItems());
      setStats(DataService.getInventoryStats());
      showToast(`Se importaron ${data.length} registros exitosamente.`, 'success');
    } catch { showToast("Hubo un error al importar los datos.", 'error'); }
    finally { setLoading(false); setIsImportModalOpen(false); }
  };

  const handleAddItem = async () => {
    if (!newItem.name || newItem.price === undefined) { showToast('Completa los campos obligatorios.', 'error'); return; }
    try {
      const productToAdd: Product = {
        id: `inv-${Date.now()}`, sku: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: newItem.name!, category: newItem.category || 'Insumos', price: newItem.price!,
        stock: newItem.stock || 0, stock_minimo: newItem.stock_minimo || 5, status: (newItem.status as any) || 'Activo',
        images: newItem.image ? [newItem.image] : ['https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=200'],
        description: newItem.description || '', isInventoryOnly: true, createdAt: new Date().toISOString()
      };
      await DataService.saveProducts([productToAdd, ...DataService.getProducts(true)]);
      setInventory(DataService.getInventoryItems());
      setStats(DataService.getInventoryStats());
      showToast('Insumo añadido exitosamente', 'success');
      setIsAddModalOpen(false);
      setNewItem({ name: '', category: 'Insumos', price: 0, stock: 0, stock_minimo: 5, status: 'Activo', image: '', description: '', isInventoryOnly: true });
    } catch { showToast('Error al añadir insumo', 'error'); }
  };

  const handleSync = () => {
    setLoading(true);
    setTimeout(() => { setLoading(false); showToast('Inventario sincronizado correctamente', 'success'); }, 800);
  };

  const handleAction = (action: string, itemId: string) => {
    setActiveDropdown(null);
    showToast(`Acción "${action}" ejecutada`, 'success');
  };

  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) || item.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || item.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusInfo = (item: Product) => {
    if (item.stock <= 0) return { label: 'Sin Stock', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-400', bar: 0 };
    if (item.stock <= item.stock_minimo) return { label: 'Crítico', color: 'text-rose-600', bg: 'bg-rose-50', border: 'border-rose-100', dot: 'bg-rose-400', bar: 20 };
    if (item.stock <= item.stock_minimo * 1.5) return { label: 'Bajo', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100', dot: 'bg-amber-400', bar: 50 };
    return { label: 'Óptimo', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-400', bar: 90 };
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
        <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Cargando inventario...</span>
      </div>
    </div>
  );

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all text-sm font-medium text-slate-700 outline-none";
  const labelClass = "block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1.5";

  return (
    <div className="space-y-6">

      {/* ── HEADER ── */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Boxes className="w-4 h-4 text-blue-500" />
              <span className="text-[10px] font-bold text-blue-500 uppercase tracking-widest">Control de Stock</span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Gestión de Inventario</h1>
            <p className="text-slate-400 text-sm mt-0.5">Flores, insumos y accesorios</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {[
              { label: 'Importar',    icon: UploadCloud,   action: () => setIsImportModalOpen(true) },
              { label: 'Exportar',    icon: DownloadCloud, action: () => setIsExportModalOpen(true) },
              { label: 'Movimientos', icon: History,       action: () => setIsMovementsModalOpen(true) },
            ].map(btn => (
              <AnimatedButton key={btn.label} onClick={btn.action}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:shadow-sm transition-all">
                <btn.icon className="w-4 h-4" />
                {btn.label}
              </AnimatedButton>
            ))}
            <AnimatedButton onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all">
              <Plus className="w-4 h-4" />
              Añadir Insumo
            </AnimatedButton>
          </div>
        </div>
      </FadeIn>

      {/* ── STATS ── */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Valor Total',     value: `$${(stats?.totalValue || 0).toLocaleString()}`, icon: TrendingUp,     color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    sub: 'en inventario' },
          { label: 'Items Críticos',  value: stats.criticalItems.toString(),                  icon: AlertTriangle,  color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    sub: 'requieren atención' },
          { label: 'Entradas (Mes)',  value: `+${stats.entriesMonth}`,                        icon: ArrowUpRight,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', sub: 'unidades ingresadas' },
          { label: 'Salidas (Mes)',   value: `-${stats.exitsMonth}`,                          icon: ArrowDownRight, color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   sub: 'unidades despachadas' },
        ].map((s, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
            className={`bg-white border ${s.border} rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}>
            <div className={`size-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>
              <s.icon className="w-[18px] h-[18px]" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
              <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
              <p className="text-[11px] text-slate-400 mt-0.5">{s.sub}</p>
            </div>
          </motion.div>
        ))}
      </StaggerContainer>

      {/* ── FILTERS ── */}
      <FadeIn delay={0.2}>
        <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
          <div className="flex-1 min-w-[220px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar por nombre o SKU..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="Todas">Todas las categorías</option>
            {['Flores de Corte','Insumos','Accesorios','Ramos','Plantas'].map(c => <option key={c}>{c}</option>)}
          </select>
          <button onClick={handleSync}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-100 transition-all">
            <RefreshCw className="w-4 h-4" />
            Sincronizar
          </button>
          <span className="ml-auto text-xs font-medium text-slate-400">
            {filteredInventory.length} <span className="text-slate-300">/ {inventory.length}</span> artículos
          </span>
        </div>
      </FadeIn>

      {/* ── TABLE ── */}
      <FadeIn delay={0.3}>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Artículo', 'SKU', 'Categoría', 'Stock', 'Nivel', 'Estado', ''].map((h, i) => (
                    <th key={i} className={`px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${i === 6 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filteredInventory.map((item, idx) => {
                    const s = getStatusInfo(item);
                    return (
                      <motion.tr key={item.id} layout
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                        transition={{ delay: idx * 0.025 }}
                        className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors group">

                        {/* Artículo */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden flex-shrink-0 group-hover:ring-2 group-hover:ring-blue-200 transition-all">
                              {item.image
                                ? <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                : <Package className="w-5 h-5 text-slate-400" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{item.name}</p>
                              <p className="text-[11px] text-slate-400">${item.price?.toLocaleString()} / ud.</p>
                            </div>
                          </div>
                        </td>

                        {/* SKU */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">{item.sku}</span>
                        </td>

                        {/* Categoría */}
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{item.category}</span>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <p className="text-lg font-black text-slate-900 leading-none">{item.stock} <span className="text-[10px] text-slate-400 font-normal">uds</span></p>
                          <p className="text-[10px] text-slate-400 mt-0.5">mín. {item.stock_minimo}</p>
                        </td>

                        {/* Nivel barra */}
                        <td className="px-6 py-4">
                          <div className="w-20">
                            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div className={`h-full rounded-full ${s.dot}`}
                                initial={{ width: 0 }} animate={{ width: `${s.bar}%` }}
                                transition={{ delay: idx * 0.025 + 0.2, duration: 0.5, ease: 'easeOut' }} />
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">{s.bar}%</p>
                          </div>
                        </td>

                        {/* Estado */}
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold border ${s.bg} ${s.color} ${s.border}`}>
                            <span className={`size-1.5 rounded-full ${s.dot} ${s.label === 'Crítico' ? 'animate-pulse' : ''}`} />
                            {s.label}
                          </span>
                        </td>

                        {/* Acciones */}
                        <td className="px-6 py-4 text-right relative dropdown-container">
                          <button onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                            className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                            <MoreVertical className="w-4 h-4" />
                          </button>
                          <AnimatePresence>
                            {activeDropdown === item.id && (
                              <motion.div initial={{ opacity: 0, scale: 0.95, y: 6 }} animate={{ opacity: 1, scale: 1, y: 0 }}
                                exit={{ opacity: 0, scale: 0.95, y: 6 }} transition={{ duration: 0.13 }}
                                className="absolute right-6 top-12 w-44 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20">
                                <div className="p-1.5 flex flex-col gap-0.5">
                                  {['Editar Insumo', 'Ajustar Stock'].map(action => (
                                    <button key={action} onClick={() => handleAction(action, item.id)}
                                      className="px-3 py-2 text-left text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                      {action}
                                    </button>
                                  ))}
                                  <div className="h-px bg-slate-100 my-0.5" />
                                  <button onClick={() => handleAction('Eliminar', item.id)}
                                    className="px-3 py-2 text-left text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                    Eliminar
                                  </button>
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filteredInventory.length === 0 && (
            <div className="py-16 text-center">
              <Package className="w-10 h-10 text-slate-200 mx-auto mb-3" />
              <p className="text-sm font-medium text-slate-400">No se encontraron artículos</p>
            </div>
          )}

          <div className="px-6 py-3.5 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between">
            <span className="text-xs text-slate-400">{filteredInventory.length} artículos mostrados</span>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors">
              Generar reporte para auditoría <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </FadeIn>

      {/* Modals externos */}
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onConfirm={handleImportConfirm} title="Importar Inventario" />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} data={filteredInventory} title="Reporte de Inventario" filename="inventario" />

      {/* ── ADD MODAL ── */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
            <ScaleIn className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-100 px-7 py-5 flex items-center justify-between z-10 rounded-t-2xl">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Nuevo Insumo</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Completa los campos para añadir al inventario</p>
                </div>
                <button onClick={() => setIsAddModalOpen(false)} className="size-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Nombre del Insumo *</label>
                  <input type="text" value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})}
                    className={inputClass} placeholder="Ej. Cinta decorativa roja" />
                </div>
                <div>
                  <label className={labelClass}>Categoría</label>
                  <select value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} className={inputClass}>
                    {['Flores de Corte','Insumos','Accesorios','Ramos','Plantas'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Estado</label>
                  <select value={newItem.status} onChange={e => setNewItem({...newItem, status: e.target.value})} className={inputClass}>
                    <option>Activo</option><option>Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Costo Unitario (MXN) *</label>
                  <input type="number" value={newItem.price} onChange={e => setNewItem({...newItem, price: Number(e.target.value)})}
                    className={inputClass} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelClass}>Stock Inicial</label>
                  <input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: Number(e.target.value)})}
                    className={inputClass} placeholder="0" />
                </div>
                <div>
                  <label className={labelClass}>Stock Mínimo</label>
                  <input type="number" value={newItem.stock_minimo} onChange={e => setNewItem({...newItem, stock_minimo: Number(e.target.value)})}
                    className={inputClass} placeholder="5" />
                </div>
                <div>
                  <label className={labelClass}>URL de Imagen</label>
                  <input type="text" value={newItem.image} onChange={e => setNewItem({...newItem, image: e.target.value})}
                    className={inputClass} placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Descripción</label>
                  <textarea value={newItem.description} onChange={e => setNewItem({...newItem, description: e.target.value})}
                    className={`${inputClass} resize-none h-24`} placeholder="Descripción del insumo..." />
                </div>
              </div>
              <div className="border-t border-slate-100 px-7 py-5 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setIsAddModalOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <AnimatedButton onClick={handleAddItem}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                  Guardar Insumo
                </AnimatedButton>
              </div>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>

      {/* ── MOVEMENTS MODAL ── */}
      <AnimatePresence>
        {isMovementsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsMovementsModalOpen(false)} />
            <ScaleIn className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-100 px-7 py-5 flex items-center justify-between z-10 rounded-t-2xl">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Historial de Movimientos</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Últimas entradas y salidas de inventario</p>
                </div>
                <button onClick={() => setIsMovementsModalOpen(false)} className="size-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="p-6">
                <div className="rounded-xl border border-slate-100 overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['Fecha', 'Tipo', 'Insumo', 'Cantidad', 'Responsable'].map(h => (
                          <th key={h} className="px-5 py-3.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { date: '27 Oct · 14:30', type: 'Entrada', item: 'Rosas Rojas (Docena)',    qty: '+50',  user: 'Admin',      typeColor: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                        { date: '27 Oct · 11:15', type: 'Salida',  item: 'Cinta Decorativa Dorada', qty: '-5',   user: 'Empleado 1', typeColor: 'text-amber-600 bg-amber-50 border-amber-100' },
                        { date: '26 Oct · 09:45', type: 'Ajuste',  item: 'Base de Cerámica Blanca', qty: '-2',   user: 'Admin',      typeColor: 'text-rose-600 bg-rose-50 border-rose-100' },
                        { date: '25 Oct · 16:20', type: 'Entrada', item: 'Girasoles',               qty: '+100', user: 'Admin',      typeColor: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                        { date: '25 Oct · 10:05', type: 'Salida',  item: 'Papel Kraft Envoltura',   qty: '-20',  user: 'Empleado 2', typeColor: 'text-amber-600 bg-amber-50 border-amber-100' },
                      ].map((mov, i) => (
                        <tr key={i} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                          <td className="px-5 py-4 text-sm font-medium text-slate-500">{mov.date}</td>
                          <td className="px-5 py-4">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold border ${mov.typeColor}`}>{mov.type}</span>
                          </td>
                          <td className="px-5 py-4 text-sm font-semibold text-slate-700">{mov.item}</td>
                          <td className={`px-5 py-4 text-sm font-black ${mov.qty.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>{mov.qty}</td>
                          <td className="px-5 py-4 text-sm text-slate-400">{mov.user}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}