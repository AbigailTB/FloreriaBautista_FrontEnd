import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Package, 
  Plus, 
  Minus, 
  Save, 
  AlertCircle, 
  RefreshCw,
  Edit2,
  CheckCircle2,
  XCircle,
  History,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  MoreVertical,
  ChevronRight,
  PackagePlus,
  PackageMinus,
  Loader2,
  LayoutGrid,
  List,
  ArrowUpDown,
  Download,
  MoreHorizontal
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../../services/dataService';
import { useToast } from '../../hooks/useToast';

export default function QuickInventoryPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const { showToast } = useToast();

  useEffect(() => {
    const loadData = () => {
      setLoading(true);
      try {
        const allProducts = DataService.getProducts(true);
        setProducts(allProducts);
      } catch (error) {
        console.error("Error loading products data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         p.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'Todas' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  const handleAdjust = (productId: string, delta: number) => {
    setProducts(prev => prev.map(p => {
      if (p.id === productId) {
        return { ...p, stock: Math.max(0, p.stock + delta) };
      }
      return p;
    }));
  };

  const handleSave = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    setSaving(productId);
    try {
      const success = await DataService.updateProductStock(productId, product.stock);
      if (success) {
        showToast('Stock actualizado correctamente', 'success');
        // Add audit log
        await DataService.addAuditLog({
          action: 'update_stock',
          details: `Stock de ${product.name} actualizado a ${product.stock}`,
          userId: 'staff-1' // Mock user ID
        });
      } else {
        showToast('Error al actualizar el stock', 'error');
      }
    } catch (error) {
      showToast('Error de conexión', 'error');
    } finally {
      setSaving(null);
    }
  };

  const categories = ['Todas', ...new Set(products.map(p => p.category))];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="w-12 h-12 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafd] font-display p-6 lg:p-10">
      <div className="max-w-[1400px] mx-auto space-y-8">
        {/* Header Section */}
        <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2.5 rounded-2xl">
                <Package className="text-primary w-6 h-6" />
              </div>
              <h1 className="text-3xl font-black tracking-tight text-slate-900">Control de Inventario</h1>
            </div>
            <p className="text-slate-500 font-medium flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Sistema de gestión en tiempo real • {products.length} productos registrados
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-3">
            <button className="flex items-center gap-2 px-6 py-3.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-sm hover:bg-slate-50 active:scale-95 transition-all shadow-sm">
              <Download size={18} />
              Exportar Reporte
            </button>
            <button className="flex items-center gap-2 px-6 py-3.5 bg-primary text-white rounded-2xl font-bold text-sm hover:opacity-90 active:scale-95 transition-all shadow-xl shadow-primary/20">
              <PackagePlus size={18} />
              Nuevo Producto
            </button>
          </div>
        </header>

        {/* Filters & Controls Bar */}
        <section className="bg-white p-4 rounded-[2rem] shadow-sm border border-slate-200 flex flex-col lg:flex-row gap-4 items-center">
          <div className="relative flex-1 group w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
            <input 
              type="text" 
              placeholder="Buscar por nombre, SKU o categoría..." 
              className="w-full pl-12 pr-4 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-3 w-full lg:w-auto">
            <div className="relative flex-1 lg:w-48">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <select 
                className="w-full pl-10 pr-8 py-3.5 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-primary/20 text-sm font-bold appearance-none cursor-pointer"
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
              <ChevronRight className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-300 rotate-90" size={16} />
            </div>

            <div className="h-10 w-[1px] bg-slate-200 mx-1 hidden lg:block"></div>

            <div className="flex bg-slate-100 p-1.5 rounded-2xl">
              <button 
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'grid' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <LayoutGrid size={20} />
              </button>
              <button 
                onClick={() => setViewMode('list')}
                className={`p-2 rounded-xl transition-all ${viewMode === 'list' ? 'bg-white text-primary shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                <List size={20} />
              </button>
            </div>
          </div>
        </section>

        {/* Inventory Grid/List */}
        <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" : "space-y-4"}>
          <AnimatePresence mode="popLayout">
            {filteredProducts.map((product, index) => (
              <motion.div 
                layout
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
                className={`bg-white rounded-[2rem] p-5 border border-slate-200 hover:border-primary/30 hover:shadow-2xl hover:shadow-primary/5 transition-all group flex ${viewMode === 'list' ? 'flex-row items-center gap-6' : 'flex-col gap-5'}`}
              >
                {/* Product Image */}
                <div className={`${viewMode === 'list' ? 'w-24 h-24' : 'w-full aspect-[4/3]'} rounded-3xl bg-slate-100 overflow-hidden relative flex-shrink-0`}>
                  <img 
                    src={product.image || "https://picsum.photos/seed/flower/400/300"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-3 left-3">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase tracking-wider shadow-lg ${product.stock < 10 ? 'bg-red-500 text-white animate-pulse' : 'bg-green-500 text-white'}`}>
                      {product.stock < 10 ? 'Stock Bajo' : 'En Stock'}
                    </span>
                  </div>
                </div>

                {/* Product Info */}
                <div className="flex-1 space-y-4">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <span className="text-[10px] font-black text-primary uppercase tracking-widest">{product.category}</span>
                      <h3 className="text-lg font-bold text-slate-900 leading-tight group-hover:text-primary transition-colors">{product.name}</h3>
                      <p className="text-[10px] font-bold text-slate-400">SKU: {product.id.split('-')[1] || product.id}</p>
                    </div>
                    <button className="p-2 text-slate-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all">
                      <MoreHorizontal size={20} />
                    </button>
                  </div>

                  {/* Stock Controls */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex items-center justify-between">
                    <div className="space-y-0.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Existencias</span>
                      <div className="flex items-baseline gap-1">
                        <span className={`text-3xl font-black tracking-tighter ${product.stock < 10 ? 'text-red-600' : 'text-slate-900'}`}>
                          {product.stock}
                        </span>
                        <span className="text-xs font-bold text-slate-400">uds</span>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleAdjust(product.id, -1)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-red-50 hover:border-red-200 hover:text-red-600 active:scale-90 transition-all shadow-sm"
                      >
                        <Minus size={18} />
                      </button>
                      <button 
                        onClick={() => handleAdjust(product.id, 1)}
                        className="w-10 h-10 flex items-center justify-center bg-white border border-slate-200 text-slate-600 rounded-xl hover:bg-green-50 hover:border-green-200 hover:text-green-600 active:scale-90 transition-all shadow-sm"
                      >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button className="flex-1 h-12 bg-slate-100 text-slate-600 rounded-2xl font-bold text-xs hover:bg-slate-200 active:scale-95 transition-all flex items-center justify-center gap-2">
                      <History size={16} />
                      Historial
                    </button>
                    <button 
                      onClick={() => handleSave(product.id)}
                      disabled={saving === product.id}
                      className={`flex-1 h-12 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 ${saving === product.id ? 'bg-slate-200 text-slate-400' : 'bg-primary text-white shadow-primary/20 hover:opacity-90'}`}
                    >
                      {saving === product.id ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Save size={16} />
                      )}
                      {saving === product.id ? 'GUARDANDO' : 'GUARDAR'}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredProducts.length === 0 && (
          <div className="py-24 flex flex-col items-center justify-center text-center space-y-6 bg-white border border-slate-200 rounded-[3rem] shadow-sm">
            <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
              <Package size={48} strokeWidth={1.5} />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold text-slate-900">No se encontraron productos</h2>
              <p className="text-slate-500 max-w-xs mx-auto font-medium">Prueba ajustando los filtros o el término de búsqueda.</p>
            </div>
            <button 
              onClick={() => { setSearchTerm(''); setCategoryFilter('Todas'); }}
              className="px-8 py-4 bg-primary text-white rounded-2xl font-bold hover:opacity-90 transition-all shadow-xl shadow-primary/20"
            >
              Restablecer Filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
