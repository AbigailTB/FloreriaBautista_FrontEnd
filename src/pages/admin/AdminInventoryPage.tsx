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
  DownloadCloud
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
  const [stats, setStats] = useState({
    totalValue: 0,
    criticalItems: 0,
    entriesMonth: 0,
    exitsMonth: 0
  });
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const { showToast } = useToast();

  const [newItem, setNewItem] = useState<Partial<Product>>({
    name: '',
    category: 'Insumos',
    price: 0,
    stock: 0,
    stock_minimo: 5,
    status: 'Activo',
    image: '',
    description: '',
    isInventoryOnly: true
  });

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

  const handleImportConfirm = async (data: any[]) => {
    setLoading(true);
    try {
      // Ensure imported items are marked for inventory if needed, or just import them
      const itemsToImport = data.map(item => ({
        ...item,
        isInventoryOnly: item.isInventoryOnly !== undefined ? item.isInventoryOnly : true
      }));
      await DataService.importProducts(itemsToImport);
      
      // Reload data
      const items = DataService.getInventoryItems();
      const inventoryStats = DataService.getInventoryStats();
      setInventory(items);
      setStats(inventoryStats);
      
      showToast(`Se importaron ${data.length} registros exitosamente.`, 'success');
    } catch (error) {
      console.error("Error al importar:", error);
      showToast("Hubo un error al importar los datos.", 'error');
    } finally {
      setLoading(false);
      setIsImportModalOpen(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name || newItem.price === undefined) {
      showToast('Por favor, completa los campos obligatorios.', 'error');
      return;
    }

    try {
      const productToAdd: Product = {
        id: `inv-${Date.now()}`,
        sku: `INV-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
        name: newItem.name,
        category: newItem.category || 'Insumos',
        price: newItem.price,
        stock: newItem.stock || 0,
        stock_minimo: newItem.stock_minimo || 5,
        status: newItem.status as any || 'Activo',
        image: newItem.image || 'https://images.unsplash.com/photo-1584483766114-2cea6facdf57?auto=format&fit=crop&q=80&w=200',
        description: newItem.description || '',
        isInventoryOnly: true,
        createdAt: new Date().toISOString()
      };

      const currentProducts = DataService.getProducts(true);
      await DataService.saveProducts([productToAdd, ...currentProducts]);
      
      // Reload data
      const items = DataService.getInventoryItems();
      const inventoryStats = DataService.getInventoryStats();
      setInventory(items);
      setStats(inventoryStats);
      
      showToast('Insumo añadido exitosamente', 'success');
      setIsAddModalOpen(false);
      setNewItem({
        name: '',
        category: 'Insumos',
        price: 0,
        stock: 0,
        stock_minimo: 5,
        status: 'Activo',
        image: '',
        description: '',
        isInventoryOnly: true
      });
    } catch (error) {
      console.error("Error adding item:", error);
      showToast('Error al añadir insumo', 'error');
    }
  };

  const handleSync = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      showToast('Inventario sincronizado correctamente', 'success');
    }, 800);
  };

  const handleAction = (action: string, itemId: string) => {
    setActiveDropdown(null);
    showToast(`Acción "${action}" ejecutada para el insumo`, 'success');
    // Here you would implement the actual logic for edit, adjust stock, delete
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

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
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Gestión de Inventario</h1>
            <p className="text-slate-500 font-medium">Control de stock de flores, insumos y accesorios</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <AnimatedButton 
              onClick={() => setIsImportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <UploadCloud className="w-4 h-4" />
              Importar
            </AnimatedButton>
            <AnimatedButton 
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <DownloadCloud className="w-4 h-4" />
              Exportar
            </AnimatedButton>
            <AnimatedButton 
              onClick={() => setIsMovementsModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm"
            >
              <History className="w-4 h-4" />
              Movimientos
            </AnimatedButton>
            <AnimatedButton 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              Añadir Insumo
            </AnimatedButton>
          </div>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Valor Total', value: `$${(stats?.totalValue || 0).toLocaleString()}`, icon: <Package className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Items Críticos', value: stats.criticalItems.toString(), icon: <AlertTriangle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50' },
          { label: 'Entradas (Mes)', value: stats.entriesMonth.toString(), icon: <ArrowUpRight className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Salidas (Mes)', value: stats.exitsMonth.toString(), icon: <ArrowDownRight className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, idx) => (
          <GlassCard 
            key={idx} 
            className="p-6 flex flex-col group"
          >
            <div className={`p-3 w-fit rounded-xl ${stat.bg} ${stat.color} mb-4 group-hover:scale-110 transition-transform`}>
              {stat.icon}
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mb-1">{stat.label}</p>
            <h3 className="text-3xl font-black text-slate-900">{stat.value}</h3>
          </GlassCard>
        ))}
      </StaggerContainer>

      {/* Filters */}
      <FadeIn delay={0.2}>
        <GlassCard className="flex flex-wrap items-center gap-4 p-6 rounded-[2rem]">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre de insumo o SKU..." 
              className="w-full pl-12 pr-4 py-3.5 rounded-2xl border-none bg-white/50 text-sm focus:ring-2 focus:ring-blue-600/20 shadow-inner transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <select 
              className="px-6 py-3.5 bg-white/50 border-none rounded-2xl text-sm font-black text-slate-600 focus:ring-2 focus:ring-blue-600/20 shadow-sm"
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
            <AnimatedButton 
              onClick={handleSync}
              className="flex items-center gap-2 px-6 py-3.5 bg-white/50 border border-slate-200 rounded-2xl text-sm font-black text-slate-600 hover:bg-white transition-all shadow-sm"
            >
              <RefreshCw className="w-4 h-4" />
              Sincronizar
            </AnimatedButton>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Inventory Table */}
      <FadeIn delay={0.3}>
        <GlassCard className="rounded-[2.5rem] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Insumo / Artículo</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">SKU</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Categoría</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Stock Actual</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Mínimo</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Estado</th>
                  <th className="px-8 py-6 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
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
                        className="hover:bg-white/40 transition-colors group"
                      >
                        <td className="px-8 py-5">
                          <div className="flex items-center gap-4">
                            <div className="size-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 overflow-hidden border-2 border-slate-50 group-hover:border-blue-500/30 transition-all shadow-sm">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                              ) : (
                                <Package className="w-6 h-6" />
                              )}
                            </div>
                            <p className="text-base font-black text-slate-900">{item.name}</p>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-xs font-mono font-bold text-slate-400">{item.sku}</td>
                        <td className="px-8 py-5">
                          <span className="px-3 py-1 rounded-lg bg-slate-100/50 text-slate-500 text-[10px] font-black uppercase tracking-widest backdrop-blur-sm">
                            {item.category}
                          </span>
                        </td>
                        <td className="px-8 py-5">
                          <div className="flex items-baseline gap-1">
                            <span className="text-lg font-black text-slate-900">{item.stock}</span>
                            <span className="text-[10px] text-slate-400 font-black uppercase tracking-tighter">unidades</span>
                          </div>
                        </td>
                        <td className="px-8 py-5 text-sm text-slate-500 font-bold">{item.stock_minimo}</td>
                        <td className="px-8 py-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${statusInfo.bg} ${statusInfo.color} shadow-sm backdrop-blur-sm`}>
                            <span className={`size-2 rounded-full ${statusInfo.dot} ${statusInfo.label === 'Crítico' ? 'animate-pulse' : ''}`}></span>
                            {statusInfo.label}
                          </span>
                        </td>
                        <td className="px-8 py-5 text-right relative dropdown-container">
                          <AnimatedButton 
                            onClick={() => setActiveDropdown(activeDropdown === item.id ? null : item.id)}
                            className="p-2.5 text-slate-300 hover:text-blue-600 hover:bg-white/50 rounded-xl transition-all"
                          >
                            <MoreVertical className="w-5 h-5" />
                          </AnimatedButton>
                          
                          <AnimatePresence>
                            {activeDropdown === item.id && (
                              <motion.div 
                                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                className="absolute right-8 top-12 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 overflow-hidden z-10"
                              >
                                <div className="p-2 flex flex-col">
                                  <button 
                                    onClick={() => handleAction('Editar', item.id)}
                                    className="px-4 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
                                  >
                                    Editar Insumo
                                  </button>
                                  <button 
                                    onClick={() => handleAction('Ajustar Stock', item.id)}
                                    className="px-4 py-2 text-left text-sm font-bold text-slate-600 hover:bg-slate-50 hover:text-blue-600 rounded-xl transition-colors"
                                  >
                                    Ajustar Stock
                                  </button>
                                  <div className="h-px bg-slate-100 my-1"></div>
                                  <button 
                                    onClick={() => handleAction('Eliminar', item.id)}
                                    className="px-4 py-2 text-left text-sm font-bold text-rose-600 hover:bg-rose-50 rounded-xl transition-colors"
                                  >
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
          <div className="p-6 border-t border-slate-50 bg-slate-50/30 text-center">
            <AnimatedButton className="text-xs font-black text-slate-400 hover:text-blue-600 uppercase tracking-widest transition-all">
              Generar reporte de inventario para auditoría
            </AnimatedButton>
          </div>
        </GlassCard>
      </FadeIn>

      <ImportModal 
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onConfirm={handleImportConfirm}
        title="Importar Inventario"
      />
      
      <ExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
        data={filteredInventory}
        title="Reporte de Inventario"
        filename="inventario"
      />

      {/* Add Item Modal */}
      <AnimatePresence>
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsAddModalOpen(false)}
            ></motion.div>
            <ScaleIn className="relative bg-white p-8 rounded-[2rem] shadow-2xl max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900">Añadir Nuevo Insumo</h3>
                <button onClick={() => setIsAddModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nombre del Insumo *</label>
                  <input 
                    type="text" 
                    value={newItem.name}
                    onChange={(e) => setNewItem({...newItem, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="Ej. Cinta decorativa roja"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Categoría</label>
                  <select 
                    value={newItem.category}
                    onChange={(e) => setNewItem({...newItem, category: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                  >
                    <option value="Flores de Corte">Flores de Corte</option>
                    <option value="Insumos">Insumos</option>
                    <option value="Accesorios">Accesorios</option>
                    <option value="Ramos">Ramos</option>
                    <option value="Plantas">Plantas</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Costo Unitario (MXN) *</label>
                  <input 
                    type="number" 
                    value={newItem.price}
                    onChange={(e) => setNewItem({...newItem, price: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Stock Inicial</label>
                  <input 
                    type="number" 
                    value={newItem.stock}
                    onChange={(e) => setNewItem({...newItem, stock: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="0"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Stock Mínimo</label>
                  <input 
                    type="number" 
                    value={newItem.stock_minimo}
                    onChange={(e) => setNewItem({...newItem, stock_minimo: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="5"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Estado</label>
                  <select 
                    value={newItem.status}
                    onChange={(e) => setNewItem({...newItem, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">URL de la Imagen</label>
                  <input 
                    type="text" 
                    value={newItem.image}
                    onChange={(e) => setNewItem({...newItem, image: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="https://ejemplo.com/imagen.jpg"
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Descripción</label>
                  <textarea 
                    value={newItem.description}
                    onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold resize-none h-24"
                    placeholder="Descripción detallada del insumo..."
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <AnimatedButton 
                  onClick={handleAddItem}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                >
                  Guardar Insumo
                </AnimatedButton>
              </div>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>

      {/* Movements Modal */}
      <AnimatePresence>
        {isMovementsModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsMovementsModalOpen(false)}
            ></motion.div>
            <ScaleIn className="relative bg-white p-8 rounded-[2rem] shadow-2xl max-w-4xl w-full border border-white/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-2xl font-black text-slate-900">Historial de Movimientos</h3>
                  <p className="text-sm text-slate-500 font-medium">Últimos registros de entradas y salidas de inventario</p>
                </div>
                <button onClick={() => setIsMovementsModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <div className="bg-slate-50/50 rounded-[2rem] overflow-hidden border border-slate-100">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100/50 border-b border-slate-200">
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Fecha</th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Tipo</th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Insumo</th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Cantidad</th>
                      <th className="px-6 py-4 text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Responsable</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      { date: '2023-10-27 14:30', type: 'Entrada', item: 'Rosas Rojas (Docena)', qty: '+50', user: 'Admin', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { date: '2023-10-27 11:15', type: 'Salida', item: 'Cinta Decorativa Dorada', qty: '-5', user: 'Empleado 1', color: 'text-amber-600', bg: 'bg-amber-50' },
                      { date: '2023-10-26 09:45', type: 'Ajuste', item: 'Base de Cerámica Blanca', qty: '-2', user: 'Admin', color: 'text-rose-600', bg: 'bg-rose-50' },
                      { date: '2023-10-25 16:20', type: 'Entrada', item: 'Girasoles', qty: '+100', user: 'Admin', color: 'text-emerald-600', bg: 'bg-emerald-50' },
                      { date: '2023-10-25 10:05', type: 'Salida', item: 'Papel Kraft Envoltura', qty: '-20', user: 'Empleado 2', color: 'text-amber-600', bg: 'bg-amber-50' },
                    ].map((mov, i) => (
                      <tr key={i} className="hover:bg-white transition-colors">
                        <td className="px-6 py-4 text-sm font-bold text-slate-500">{mov.date}</td>
                        <td className="px-6 py-4">
                          <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${mov.bg} ${mov.color}`}>
                            {mov.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-900">{mov.item}</td>
                        <td className={`px-6 py-4 text-sm font-black ${mov.type === 'Entrada' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {mov.qty}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-slate-500">{mov.user}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
