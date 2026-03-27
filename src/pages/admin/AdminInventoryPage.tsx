import React, { useState, useEffect, useCallback } from 'react';
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
  Boxes,
  Flower2,
  Leaf,
  CheckCircle2,
  XCircle,
  ChevronLeft,
  Pencil,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { AdminService } from '../../services/adminService';
import { Product, ProductBody, ImportProductsResult, Flower, FlowerBody } from '../../types';
import { FadeIn, ScaleIn, StaggerContainer, AnimatedButton, GlassCard } from '../../components/Animations';
import ImportModal from '../../components/ImportModal';
import ExportModal from '../../components/ExportModal';
import { useToast } from '../../hooks/useToast';

const COLOR_DOT: Record<string, string> = {
  Rojo:     'bg-red-500',
  Rosa:     'bg-pink-400',
  Blanco:   'bg-slate-200 border border-slate-300',
  Amarillo: 'bg-yellow-400',
  Morado:   'bg-purple-500',
  Azul:     'bg-blue-500',
  Verde:    'bg-emerald-500',
  Naranja:  'bg-orange-400',
};

const FLORES_PAGE_SIZE = 20;

export default function AdminInventoryPage() {
  const { showToast } = useToast();

  // ── Tab ──────────────────────────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState<'flores' | 'productos'>('flores');

  // ── Productos ────────────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [inventory, setInventory] = useState<Product[]>([]);
  const [stats, setStats] = useState({ totalValue: 0, criticalItems: 0, entriesMonth: 0, exitsMonth: 0 });
  const [loading, setLoading] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [importResult, setImportResult] = useState<ImportProductsResult | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isMovementsModalOpen, setIsMovementsModalOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  // ── Flores ───────────────────────────────────────────────────────────────────
  const [flores, setFlores]               = useState<Flower[]>([]);
  const [floresTotal, setFloresTotal]     = useState(0);
  const [floresTotalPags, setFloresTotalPags] = useState(1);
  const [floresPage, setFloresPage]       = useState(1);
  const [floresLoading, setFloresLoading] = useState(false);
  const [floresBusqueda, setFloresBusqueda] = useState('');
  const [floresColor, setFloresColor]     = useState('');
  const [floresEstado, setFloresEstado]   = useState('');
  const [floresBajoMin, setFloresBajoMin] = useState<boolean | undefined>(undefined);
  const [isFloresImportOpen, setIsFloresImportOpen] = useState(false);
  const [floresExporting, setFloresExporting] = useState(false);
  const [isAddFlorOpen, setIsAddFlorOpen] = useState(false);
  const [newFlor, setNewFlor] = useState<FlowerBody>({
    nombre: '', color: '', precioCosto: 0, unidadMedida: 'pieza', esFlorPrimaria: true, stockMinimo: 0,
  });
  const [editingFlor, setEditingFlor] = useState<Flower | null>(null);
  const [editFlorForm, setEditFlorForm] = useState<FlowerBody>({
    nombre: '', color: '', precioCosto: 0, unidadMedida: 'pieza', esFlorPrimaria: true, stockMinimo: 0,
  });

  const [newItem, setNewItem] = useState<Partial<ProductBody>>({
    nombre: '', tipo: 'Insumos', precioBase: 0, descripcion: '',
    esPersonalizable: false, estado: 'activo', imagenUrl: '',
    categorias: [], colecciones: [],
  });

  const loadInventory = async () => {
    try {
      const res = await AdminService.getAdminProducts({ size: 100 });
      const items = res.data.items;
      setInventory(items);
      const totalValue = items.reduce((sum, p) => sum + p.precioBase * (p.stock ?? 0), 0);
      const criticalItems = items.filter(p => (p.stock ?? 0) <= 5).length;
      setStats({ totalValue, criticalItems, entriesMonth: 0, exitsMonth: 0 });
    } catch {
      showToast('Error al cargar inventario', 'error');
    } finally {
      setLoading(false);
    }
  };

  const loadFlores = useCallback(async () => {
    setFloresLoading(true);
    try {
      const res = await AdminService.getFlowers({
        busqueda:   floresBusqueda || undefined,
        color:      floresColor    || undefined,
        estado:     floresEstado   || undefined,
        bajoMinimo: floresBajoMin,
        page:       floresPage,
        size:       FLORES_PAGE_SIZE,
      });
      setFlores(res.data.items);
      setFloresTotal(res.data.total);
      setFloresTotalPags(res.data.totalPaginas);
    } catch {
      showToast('Error al cargar flores/insumos', 'error');
    } finally {
      setFloresLoading(false);
    }
  }, [floresBusqueda, floresColor, floresEstado, floresBajoMin, floresPage]);

  useEffect(() => {
    if (activeTab === 'flores') loadFlores();
    if (activeTab === 'productos' && inventory.length === 0) loadInventory();
  }, [activeTab, loadFlores]);

  // Reset página al cambiar filtros de flores
  useEffect(() => { setFloresPage(1); }, [floresBusqueda, floresColor, floresEstado, floresBajoMin]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (activeDropdown && !(event.target as Element).closest('.dropdown-container')) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [activeDropdown]);

  const handleImportConfirm = async (_data: any[], file: File) => {
    try {
      const result = await AdminService.importAdminProducts(file);
      setImportResult(result.data);
      const res = await AdminService.getAdminProducts({ size: 100 });
      const newItems = res.data.items;
      setInventory(newItems);
      const totalValue = newItems.reduce((sum, p) => sum + p.precioBase * (p.stock ?? 0), 0);
      const criticalItems = newItems.filter(p => (p.stock ?? 0) <= 5).length;
      setStats({ totalValue, criticalItems, entriesMonth: 0, exitsMonth: 0 });
      showToast(`${result.message}`, 'success');
    } catch (err: any) {
      showToast(`Error al importar: ${err.message ?? 'desconocido'}`, 'error');
    } finally {
      setIsImportModalOpen(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.nombre || newItem.precioBase === undefined) {
      showToast('Completa los campos obligatorios.', 'error');
      return;
    }
    try {
      await AdminService.createAdminProduct(newItem as ProductBody);
      await loadInventory();
      showToast('Insumo añadido exitosamente', 'success');
      setIsAddModalOpen(false);
      setNewItem({ nombre: '', tipo: 'Insumos', precioBase: 0, descripcion: '', esPersonalizable: false, estado: 'activo', imagenUrl: '', categorias: [], colecciones: [] });
    } catch {
      showToast('Error al añadir insumo', 'error');
    }
  };

  const openEditFlor = (flor: Flower) => {
    setEditingFlor(flor);
    setEditFlorForm({
      nombre: flor.nombre,
      color: flor.color ?? '',
      precioCosto: flor.precioCosto,
      unidadMedida: flor.unidadMedida,
      esFlorPrimaria: flor.esFlorPrimaria,
      stockMinimo: flor.stockMinimo,
    });
  };

  const handleEditFlor = async () => {
    if (!editingFlor) return;
    try {
      await AdminService.updateFlower(editingFlor.id, editFlorForm);
      await loadFlores();
      showToast('Flor/insumo actualizado correctamente', 'success');
      setEditingFlor(null);
    } catch (err: any) {
      showToast(`Error al actualizar: ${err.message ?? 'desconocido'}`, 'error');
    }
  };

  const handleAddFlor = async () => {
    if (!newFlor.nombre || newFlor.precioCosto === undefined) {
      showToast('Completa los campos obligatorios.', 'error');
      return;
    }
    try {
      await AdminService.createFlower(newFlor);
      await loadFlores();
      showToast('Flor/insumo añadido exitosamente', 'success');
      setIsAddFlorOpen(false);
      setNewFlor({ nombre: '', color: '', precioCosto: 0, unidadMedida: 'pieza', esFlorPrimaria: true, stockMinimo: 0 });
    } catch (err: any) {
      showToast(`Error al añadir: ${err.message ?? 'desconocido'}`, 'error');
    }
  };

  const handleSync = async () => {
    setLoading(true);
    await loadInventory();
    showToast('Inventario sincronizado correctamente', 'success');
  };

  const handleAction = (action: string, _itemId: string) => {
    setActiveDropdown(null);
    showToast(`Acción "${action}" ejecutada`, 'success');
  };

  const filteredInventory = inventory.filter((item: Product) => {
    const matchesSearch =
      item.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || item.tipo === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const getStatusInfo = (item: Product) => {
    const stock = item.stock ?? 0;
    const minimo = 5;
    if (stock <= 0)         return { label: 'Sin Stock', color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    dot: 'bg-rose-400',    bar: 0  };
    if (stock <= minimo)    return { label: 'Crítico',   color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    dot: 'bg-rose-400',    bar: 20 };
    if (stock <= minimo * 1.5) return { label: 'Bajo',   color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   dot: 'bg-amber-400',   bar: 50 };
    return                       { label: 'Óptimo',      color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', dot: 'bg-emerald-400', bar: 90 };
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
            {activeTab === 'flores' && <>
              {[
                { label: 'Importar', icon: UploadCloud,   action: () => setIsFloresImportOpen(true) },
                { label: floresExporting ? 'Exportando...' : 'Exportar', icon: DownloadCloud, action: async () => {
                    setFloresExporting(true);
                    try {
                      const { blob, filename } = await AdminService.exportFlowers();
                      const url = URL.createObjectURL(blob);
                      const a = document.createElement('a');
                      a.href = url; a.download = filename;
                      document.body.appendChild(a); a.click();
                      a.remove(); URL.revokeObjectURL(url);
                      showToast('Exportación descargada correctamente', 'success');
                    } catch (err: any) {
                      showToast(`Error al exportar: ${err.message ?? 'desconocido'}`, 'error');
                    } finally { setFloresExporting(false); }
                  }},
              ].map(btn => (
                <AnimatedButton key={btn.label} onClick={btn.action}
                  className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:shadow-sm transition-all">
                  <btn.icon className="w-4 h-4" />
                  {btn.label}
                </AnimatedButton>
              ))}
              <AnimatedButton onClick={loadFlores}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:border-slate-300 hover:shadow-sm transition-all">
                <RefreshCw className={`w-4 h-4 ${floresLoading ? 'animate-spin' : ''}`} />
                Actualizar
              </AnimatedButton>
              <AnimatedButton onClick={() => setIsAddFlorOpen(true)}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/25 transition-all">
                <Plus className="w-4 h-4" />
                Agregar Flor
              </AnimatedButton>
            </>}
            {activeTab === 'productos' && <>
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
            </>}
          </div>
        </div>
      </FadeIn>

      {/* ── TABS ── */}
      <FadeIn>
        <div className="flex gap-1 p-1 bg-slate-100 rounded-2xl w-fit">
          {([
            { key: 'flores',    label: 'Flores / Insumos', icon: <Flower2 className="w-4 h-4" /> },
            { key: 'productos', label: 'Productos',         icon: <Package className="w-4 h-4" /> },
          ] as const).map(tab => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-black transition-all ${
                activeTab === tab.key
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-slate-500 hover:text-slate-700'
              }`}>
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      </FadeIn>

      {/* ══ PANEL FLORES ══════════════════════════════════════════════════════════ */}
      {activeTab === 'flores' && (
        <AnimatePresence mode="wait">
          <motion.div key="flores" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">

            {/* Stats flores */}
            <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total registros',   value: floresTotal,                                         icon: <Flower2 className="w-[18px] h-[18px]" />, color: 'text-pink-600',    bg: 'bg-pink-50',    border: 'border-pink-100' },
                { label: 'Flores primarias',  value: flores.filter(f => f.esFlorPrimaria).length,         icon: <Flower2 className="w-[18px] h-[18px]" />, color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100' },
                { label: 'Insumos / follaje', value: flores.filter(f => !f.esFlorPrimaria).length,        icon: <Leaf    className="w-[18px] h-[18px]" />, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                { label: 'Bajo mínimo',       value: flores.filter(f => f.bajoMinimo).length,             icon: <AlertTriangle className="w-[18px] h-[18px]" />, color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-100' },
              ].map((s, i) => (
                <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.07 }}
                  className={`bg-white border ${s.border} rounded-2xl p-5 flex flex-col gap-3 hover:shadow-md transition-shadow`}>
                  <div className={`size-9 rounded-xl ${s.bg} ${s.color} flex items-center justify-center`}>{s.icon}</div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                    <p className={`text-2xl font-black mt-0.5 ${s.color}`}>{s.value}</p>
                  </div>
                </motion.div>
              ))}
            </StaggerContainer>

            {/* Filtros flores */}
            <div className="flex flex-wrap items-center gap-3 p-4 bg-white border border-slate-100 rounded-2xl shadow-sm">
              <div className="flex-1 min-w-[220px] relative">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Buscar por nombre..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all"
                  value={floresBusqueda} onChange={e => setFloresBusqueda(e.target.value)} />
              </div>
              <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all"
                value={floresColor} onChange={e => setFloresColor(e.target.value)}>
                <option value="">Todos los colores</option>
                {['Rojo','Rosa','Blanco','Amarillo','Morado','Azul','Verde','Naranja'].map(c => <option key={c}>{c}</option>)}
              </select>
              <select className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-400 transition-all"
                value={floresEstado} onChange={e => setFloresEstado(e.target.value)}>
                <option value="">Todos los estados</option>
                <option value="ACTIVA">Activa</option>
                <option value="INACTIVA">Inactiva</option>
              </select>
              <button onClick={() => setFloresBajoMin(prev => prev === true ? undefined : true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
                  floresBajoMin ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}>
                <AlertTriangle className="w-4 h-4" /> Bajo mínimo
              </button>
              <span className="ml-auto text-xs font-medium text-slate-400">
                {flores.length} <span className="text-slate-300">/ {floresTotal}</span> flores
              </span>
            </div>

            {/* Tabla flores */}
            <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
              {floresLoading ? (
                <div className="flex items-center justify-center h-52">
                  <RefreshCw className="w-7 h-7 text-pink-500 animate-spin" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100">
                        {['Flor / Insumo', 'Color', 'Tipo', 'Precio costo', 'Stock', 'Estado', ''].map(h => (
                          <th key={h} className="px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      <AnimatePresence mode="popLayout">
                        {flores.map((flor, idx) => (
                          <motion.tr key={flor.id} layout
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                            transition={{ delay: idx * 0.02 }}
                            className="border-b border-slate-50 hover:bg-slate-50/60 transition-colors">
                            <td className="px-6 py-4">
                              <p className="text-sm font-bold text-slate-800">{flor.nombre}</p>
                              <p className="text-[11px] text-slate-400 mt-0.5">{flor.unidadMedida}</p>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <span className={`w-3 h-3 rounded-full shrink-0 ${COLOR_DOT[flor.color ?? ''] ?? 'bg-slate-300'}`} />
                                <span className="text-sm text-slate-600">{flor.color ?? '—'}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {flor.esFlorPrimaria
                                ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-pink-50 text-pink-700 border border-pink-100"><Flower2 className="w-3 h-3" /> Primaria</span>
                                : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100"><Leaf className="w-3 h-3" /> Insumo</span>
                              }
                            </td>
                            <td className="px-6 py-4">
                              <span className="text-sm font-black text-slate-900">$/ {flor.precioCosto.toFixed(2)}</span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-1.5">
                                <span className={`text-lg font-black leading-none ${flor.bajoMinimo ? 'text-amber-600' : 'text-slate-900'}`}>{flor.stockActual}</span>
                                <span className="text-[10px] text-slate-400">/ mín {flor.stockMinimo}</span>
                                {flor.bajoMinimo && <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0" />}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {flor.estado === 'ACTIVA'
                                ? <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 className="w-3 h-3" /> Activa</span>
                                : <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-slate-100 text-slate-500 border border-slate-200"><XCircle className="w-3 h-3" /> Inactiva</span>
                              }
                            </td>
                            <td className="px-4 py-4">
                              <button onClick={() => openEditFlor(flor)}
                                className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-all">
                                <Pencil className="w-4 h-4" />
                              </button>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                      {!floresLoading && flores.length === 0 && (
                        <tr><td colSpan={6} className="py-16 text-center text-sm text-slate-400">No se encontraron flores o insumos</td></tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Footer paginación */}
              <div className="px-6 py-3.5 border-t border-slate-50 bg-slate-50/50 flex items-center justify-between flex-wrap gap-3">
                <span className="text-xs text-slate-400">{flores.length} de {floresTotal} registros</span>
                {floresTotalPags > 1 && (
                  <div className="flex items-center gap-2">
                    <button onClick={() => setFloresPage(p => Math.max(1, p - 1))} disabled={floresPage === 1}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all">
                      <ChevronLeft className="w-4 h-4 text-slate-600" />
                    </button>
                    <span className="text-xs font-black text-slate-700 px-2">{floresPage} / {floresTotalPags}</span>
                    <button onClick={() => setFloresPage(p => Math.min(floresTotalPags, p + 1))} disabled={floresPage === floresTotalPags}
                      className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-40 transition-all">
                      <ChevronRight className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>
                )}
              </div>
            </div>

          </motion.div>
        </AnimatePresence>
      )}

      {/* ══ PANEL PRODUCTOS ═══════════════════════════════════════════════════════ */}
      {activeTab === 'productos' && <>

      {/* ── STATS ── */}
      <StaggerContainer className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Valor Total',    value: `$${(stats?.totalValue || 0).toLocaleString()}`, icon: TrendingUp,     color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100',    sub: 'en inventario' },
          { label: 'Items Críticos', value: stats.criticalItems.toString(),                  icon: AlertTriangle,  color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100',    sub: 'requieren atención' },
          { label: 'Entradas (Mes)', value: `+${stats.entriesMonth}`,                        icon: ArrowUpRight,   color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100', sub: 'unidades ingresadas' },
          { label: 'Salidas (Mes)',  value: `-${stats.exitsMonth}`,                          icon: ArrowDownRight, color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100',   sub: 'unidades despachadas' },
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
            <input type="text" placeholder="Buscar por nombre o ID..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
              value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          </div>
          <select
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-400 transition-all"
            value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="Todas">Todas las categorías</option>
            {['Flores de Corte', 'Insumos', 'Accesorios', 'Ramos', 'Plantas'].map(c => <option key={c}>{c}</option>)}
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

      {/* ── IMPORT RESULT BANNER ── */}
      {importResult !== null && (
        <div className="flex items-center justify-between px-5 py-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-sm gap-4">
          <div className="flex items-center gap-6">
            <span className="font-bold text-emerald-800">{importResult.archivo}</span>
            <span className="text-emerald-700"><span className="font-black">{importResult.totalFilas}</span> filas procesadas</span>
            <span className="text-emerald-700"><span className="font-black text-emerald-600">+{importResult.insertados}</span> insertados</span>
            <span className="text-emerald-700"><span className="font-black text-blue-600">{importResult.actualizados}</span> actualizados</span>
            {importResult.errores > 0 && (
              <span className="text-rose-700"><span className="font-black">{importResult.errores}</span> errores</span>
            )}
          </div>
          <button
            onClick={() => setImportResult(null)}
            className="text-emerald-600 hover:text-emerald-900 font-black text-xs uppercase tracking-widest transition-colors shrink-0"
          >
            Cerrar
          </button>
        </div>
      )}

      {/* ── TABLE ── */}
      <FadeIn delay={0.3}>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100">
                  {['Artículo', 'ID', 'Tipo', 'Stock', 'Nivel', 'Estado', ''].map((h, i) => (
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
                              {item.imagenUrl
                                ? <img src={item.imagenUrl} alt={item.nombre} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                : <Package className="w-5 h-5 text-slate-400" />}
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-800">{item.nombre}</p>
                              <p className="text-[11px] text-slate-400">${item.precioBase?.toLocaleString()} / ud.</p>
                            </div>
                          </div>
                        </td>

                        {/* ID */}
                        <td className="px-6 py-4">
                          <span className="font-mono text-[11px] text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">
                            {item.id.slice(0, 8).toUpperCase()}
                          </span>
                        </td>

                        {/* Tipo */}
                        <td className="px-6 py-4">
                          <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-lg">{item.tipo}</span>
                        </td>

                        {/* Stock */}
                        <td className="px-6 py-4">
                          <p className="text-lg font-black text-slate-900 leading-none">
                            {item.stock ?? '—'} <span className="text-[10px] text-slate-400 font-normal">uds</span>
                          </p>
                          <p className="text-[10px] text-slate-400 mt-0.5">mín. 5</p>
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

      </> /* fin panel productos */}

      {/* Modals Productos */}
      <ImportModal isOpen={isImportModalOpen} onClose={() => setIsImportModalOpen(false)} onConfirm={handleImportConfirm} title="Importar Productos" />
      <ExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} data={filteredInventory} title="Reporte de Productos" filename="inventario_productos" />

      {/* Modals Flores */}
      <ImportModal isOpen={isFloresImportOpen} onClose={() => setIsFloresImportOpen(false)} onConfirm={async (_d, file) => { try { const res = await AdminService.importFlowers(file); await loadFlores(); showToast(res.message, 'success'); } catch (err: any) { showToast(`Error al importar: ${err.message ?? 'desconocido'}`, 'error'); } finally { setIsFloresImportOpen(false); } }} title="Importar Flores / Insumos" />

      {/* ── EDIT FLOR MODAL ── */}
      <AnimatePresence>
        {editingFlor && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setEditingFlor(null)} />
            <ScaleIn className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-100 px-7 py-5 flex items-center justify-between z-10 rounded-t-2xl">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Editar Flor / Insumo</h3>
                  <p className="text-xs text-slate-400 mt-0.5">{editingFlor.nombre}</p>
                </div>
                <button onClick={() => setEditingFlor(null)} className="size-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Nombre *</label>
                  <input type="text" value={editFlorForm.nombre}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFlorForm({ ...editFlorForm, nombre: e.target.value })}
                    className={inputClass} placeholder="Ej. Rosa Roja..." />
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <input type="text" value={editFlorForm.color}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFlorForm({ ...editFlorForm, color: e.target.value })}
                    className={inputClass} placeholder="Ej. Rojo, Rosa..." />
                </div>
                <div>
                  <label className={labelClass}>Unidad de Medida</label>
                  <select value={editFlorForm.unidadMedida}
                    onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setEditFlorForm({ ...editFlorForm, unidadMedida: e.target.value })}
                    className={inputClass}>
                    {['pieza', 'tallo', 'ramo', 'metro', 'kg', 'litro'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Precio Costo (MXN) *</label>
                  <input type="number" value={editFlorForm.precioCosto}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFlorForm({ ...editFlorForm, precioCosto: Number(e.target.value) })}
                    className={inputClass} min={0} />
                </div>
                <div>
                  <label className={labelClass}>Stock Mínimo</label>
                  <input type="number" value={editFlorForm.stockMinimo}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditFlorForm({ ...editFlorForm, stockMinimo: Number(e.target.value) })}
                    className={inputClass} min={0} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Tipo</label>
                  <div className="flex gap-3">
                    {[{ value: true, label: 'Flor Primaria' }, { value: false, label: 'Insumo / Accesorio' }].map(opt => (
                      <button key={String(opt.value)} type="button"
                        onClick={() => setEditFlorForm({ ...editFlorForm, esFlorPrimaria: opt.value })}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${editFlorForm.esFlorPrimaria === opt.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 px-7 py-5 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setEditingFlor(null)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <AnimatedButton onClick={handleEditFlor}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                  Guardar cambios
                </AnimatedButton>
              </div>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>

      {/* ── ADD FLOR MODAL ── */}
      <AnimatePresence>
        {isAddFlorOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm" onClick={() => setIsAddFlorOpen(false)} />
            <ScaleIn className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-white border-b border-slate-100 px-7 py-5 flex items-center justify-between z-10 rounded-t-2xl">
                <div>
                  <h3 className="text-xl font-black text-slate-900">Nueva Flor / Insumo</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Completa los campos para añadir al inventario</p>
                </div>
                <button onClick={() => setIsAddFlorOpen(false)} className="size-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-500 hover:bg-slate-200 transition-colors">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              <div className="p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="md:col-span-2">
                  <label className={labelClass}>Nombre *</label>
                  <input type="text" value={newFlor.nombre} onChange={e => setNewFlor({ ...newFlor, nombre: e.target.value })}
                    className={inputClass} placeholder="Ej. Rosa Roja, Cinta Verde..." />
                </div>
                <div>
                  <label className={labelClass}>Color</label>
                  <input type="text" value={newFlor.color} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFlor({ ...newFlor, color: e.target.value })}
                    className={inputClass} placeholder="Ej. Rojo, Rosa, Blanco..." />
                </div>
                <div>
                  <label className={labelClass}>Unidad de Medida</label>
                  <select value={newFlor.unidadMedida} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setNewFlor({ ...newFlor, unidadMedida: e.target.value })} className={inputClass}>
                    {['pieza', 'tallo', 'ramo', 'metro', 'kg', 'litro'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Precio Costo (MXN) *</label>
                  <input type="number" value={newFlor.precioCosto} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFlor({ ...newFlor, precioCosto: Number(e.target.value) })}
                    className={inputClass} placeholder="0.00" min={0} />
                </div>
                <div>
                  <label className={labelClass}>Stock Mínimo</label>
                  <input type="number" value={newFlor.stockMinimo} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewFlor({ ...newFlor, stockMinimo: Number(e.target.value) })}
                    className={inputClass} placeholder="0" min={0} />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Tipo</label>
                  <div className="flex gap-3">
                    {[{ value: true, label: 'Flor Primaria' }, { value: false, label: 'Insumo / Accesorio' }].map(opt => (
                      <button key={String(opt.value)} type="button" onClick={() => setNewFlor({ ...newFlor, esFlorPrimaria: opt.value })}
                        className={`flex-1 py-3 rounded-xl border-2 text-sm font-bold transition-all ${newFlor.esFlorPrimaria === opt.value ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-slate-200 text-slate-500 hover:border-slate-300'}`}>
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-slate-100 px-7 py-5 flex justify-end gap-3 rounded-b-2xl">
                <button onClick={() => setIsAddFlorOpen(false)} className="px-5 py-2.5 text-sm font-semibold text-slate-500 hover:bg-slate-100 rounded-xl transition-colors">
                  Cancelar
                </button>
                <AnimatedButton onClick={handleAddFlor}
                  className="px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors">
                  Guardar
                </AnimatedButton>
              </div>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>

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
                  <input type="text" value={newItem.nombre} onChange={e => setNewItem({ ...newItem, nombre: e.target.value })}
                    className={inputClass} placeholder="Ej. Cinta decorativa roja" />
                </div>
                <div>
                  <label className={labelClass}>Tipo</label>
                  <select value={newItem.tipo} onChange={e => setNewItem({ ...newItem, tipo: e.target.value })} className={inputClass}>
                    {['Flores de Corte', 'Insumos', 'Accesorios', 'Ramos', 'Plantas'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Estado</label>
                  <select value={newItem.estado} onChange={e => setNewItem({ ...newItem, estado: e.target.value })} className={inputClass}>
                    <option value="activo">Activo</option>
                    <option value="inactivo">Inactivo</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass}>Precio Base (MXN) *</label>
                  <input type="number" value={newItem.precioBase} onChange={e => setNewItem({ ...newItem, precioBase: Number(e.target.value) })}
                    className={inputClass} placeholder="0.00" />
                </div>
                <div>
                  <label className={labelClass}>Personalizable</label>
                  <select
                    value={newItem.esPersonalizable ? 'si' : 'no'}
                    onChange={e => setNewItem({ ...newItem, esPersonalizable: e.target.value === 'si' })}
                    className={inputClass}>
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>URL de Imagen</label>
                  <input type="text" value={newItem.imagenUrl} onChange={e => setNewItem({ ...newItem, imagenUrl: e.target.value })}
                    className={inputClass} placeholder="https://..." />
                </div>
                <div className="md:col-span-2">
                  <label className={labelClass}>Descripción</label>
                  <textarea value={newItem.descripcion} onChange={e => setNewItem({ ...newItem, descripcion: e.target.value })}
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
