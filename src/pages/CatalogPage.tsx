import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Filter, 
  ChevronLeft, 
  ChevronRight, 
  Lock, 
  Plus, 
  TrendingUp, 
  CheckCircle, 
  AlertCircle,
  Package,
  CheckCircle2,
  AlertTriangle,
  Search,
  X,
  ShoppingCart,
  ArrowRight,
  Heart
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../services/dataService';
import { useCart } from '../hooks/useCart';
import { useToast } from '../hooks/useToast';
import { FadeIn, ScaleIn, StaggerContainer, AnimatedButton, GlassCard } from '../components/Animations';

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
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
};

export default function CatalogPage() {
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedType, setSelectedType] = useState('Todos los tipos');
  const [selectedCollection, setSelectedCollection] = useState('Todas las colecciones');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Arreglos Florales',
    price: 0,
    stock: 0,
    stock_minimo: 5,
    status: 'Activo',
    image: '',
    description: '',
    badge: ''
  });

  const handleAddProduct = async () => {
    if (!newProduct.name || newProduct.price <= 0) {
      showToast('Por favor, completa los campos obligatorios.', 'error');
      return;
    }
    
    const productToAdd = {
      ...newProduct,
      id: `PROD-${Date.now()}`,
      sku: `SKU-${Date.now()}`,
      createdAt: new Date().toISOString(),
      isInventoryOnly: false
    };

    const updatedProducts = [productToAdd, ...products];
    await DataService.saveProducts(updatedProducts);
    setProducts(updatedProducts);
    setIsAddProductModalOpen(false);
    showToast('Producto añadido exitosamente', 'success');
    setNewProduct({
      name: '',
      category: 'Arreglos Florales',
      price: 0,
      stock: 0,
      stock_minimo: 5,
      status: 'Activo',
      image: '',
      description: '',
      badge: ''
    });
  };

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    const loadData = async () => {
      setLoading(true);
      try {
        const allProducts = DataService.getProducts();
        const dashboardStats = DataService.getDashboardStats();
        setProducts(allProducts);
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error loading catalog data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Filtered and Paginated Products
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            product.id.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category from top pills
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      
      // Price range
      const matchesPrice = product.price <= priceRange;
      
      // Product type from dropdown
      const matchesType = selectedType === 'Todos los tipos' || product.category === selectedType;
      
      // Collection from dropdown (using badge field)
      const matchesCollection = selectedCollection === 'Todas las colecciones' || product.badge === selectedCollection;

      return matchesSearch && matchesCategory && matchesPrice && matchesType && matchesCollection;
    });
  }, [products, searchTerm, selectedCategory, priceRange, selectedType, selectedCollection]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];
  const productTypes = ['Todos los tipos', ...Array.from(new Set(products.map(p => p.category)))];
  const collections = ['Todas las colecciones', ...Array.from(new Set(products.filter(p => p.badge).map(p => p.badge)))];

  // If user is admin, show the management view
  if (user?.role === 'administrador' || user?.role === 'admin') {
    return (
      <div className="bg-[#f8fafc] min-h-full -m-8 p-8">
        <div className="max-w-[1400px] mx-auto space-y-8">
          <FadeIn>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-2">
              <div>
                <h1 className="text-3xl font-black tracking-tight text-slate-900">Catálogo de Productos</h1>
                <p className="text-slate-500 font-medium">Gestiona la oferta comercial y disponibilidad</p>
              </div>
              <AnimatedButton 
                onClick={() => setIsAddProductModalOpen(true)}
                className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1e3a5f] font-black px-8 py-4 rounded-2xl shadow-xl shadow-yellow-500/20 flex items-center gap-2 transition-all"
              >
                <Plus className="w-6 h-6 stroke-[3px]" />
                Nuevo producto
              </AnimatedButton>
            </div>
          </FadeIn>

          {/* Statistics Cards */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <GlassCard className="p-8 flex justify-between items-center group">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Total productos</p>
                <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">{products.length}</h3>
                <p className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                  <TrendingUp className="w-4 h-4" /> +12% este mes
                </p>
              </div>
              <div className="bg-blue-500/10 p-5 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                <Package className="w-10 h-10" />
              </div>
            </GlassCard>
            
            <GlassCard className="p-8 flex justify-between items-center group">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Activos</p>
                <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
                  {products.filter(p => p.status === 'Activo').length}
                </h3>
                <p className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" /> {Math.round((products.filter(p => p.status === 'Activo').length / products.length) * 100)}% del total
                </p>
              </div>
              <div className="bg-emerald-500/10 p-5 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                <CheckCircle className="w-10 h-10" />
              </div>
            </GlassCard>
            
            <GlassCard className="p-8 flex justify-between items-center group">
              <div>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-2">Bajo Stock</p>
                <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">
                  {DataService.getInventoryAlerts().length}
                </h3>
                <p className="text-orange-600 text-sm font-bold flex items-center gap-1">
                  <AlertTriangle className="w-4 h-4" /> Requiere atención
                </p>
              </div>
              <div className="bg-orange-500/10 p-5 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
                <AlertCircle className="w-10 h-10" />
              </div>
            </GlassCard>
          </StaggerContainer>

          <FadeIn delay={0.2}>
            <div className="bg-white/40 backdrop-blur-md rounded-[2.5rem] p-8 shadow-xl border border-white/40">
              {/* Filters & Catalog Actions */}
              <div className="flex flex-wrap items-center justify-between gap-6 mb-8">
                <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                  {categories.map(cat => (
                    <button 
                      key={cat}
                      onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                      className={`px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                        selectedCategory === cat 
                          ? 'bg-[#1e3a5f] text-white shadow-lg shadow-blue-900/20' 
                          : 'bg-white/50 hover:bg-white text-slate-500 border border-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
                
                <div className="relative flex-1 min-w-[300px]">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Buscar por nombre, ID o descripción..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-12 pr-4 py-3.5 bg-white/80 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20 shadow-inner transition-all"
                  />
                </div>
              </div>

              {/* Products Table */}
              <div className="bg-white rounded-3xl border border-slate-100 overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-50 bg-slate-50/50">
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Producto</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Categoría</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Precio</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Stock</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Estado</th>
                        <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      <AnimatePresence mode="popLayout">
                        {paginatedProducts.map((product) => (
                          <motion.tr 
                            layout
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            key={product.id} 
                            className="hover:bg-slate-50/50 transition-colors group"
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-5">
                                <div className="size-16 rounded-2xl bg-slate-100 overflow-hidden border-2 border-slate-100 group-hover:border-blue-500/30 transition-all shadow-sm">
                                  <img src={product.image} alt={product.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                                </div>
                                <div>
                                  <p className="font-black text-slate-900 text-lg leading-tight mb-1">{product.name}</p>
                                  <p className="text-xs font-bold text-slate-400 tracking-wider">ID: {product.id}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <span className="px-3 py-1 rounded-lg bg-blue-50 text-blue-600 text-[10px] font-black tracking-widest uppercase">
                                {product.category}
                              </span>
                            </td>
                            <td className="px-8 py-5 font-black text-slate-900 text-lg">${product.price.toLocaleString()}</td>
                            <td className="px-8 py-5">
                              <div className="flex flex-col">
                                <span className={`font-bold ${product.stock <= product.minStock ? 'text-rose-600' : 'text-slate-600'}`}>
                                  {product.stock} unidades
                                </span>
                                {product.stock <= product.minStock && (
                                  <span className="text-[10px] font-black text-rose-400 uppercase tracking-tighter animate-pulse">Stock Crítico</span>
                                )}
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                <span className={`size-2.5 rounded-full ${product.status === 'Activo' ? 'bg-emerald-500' : 'bg-slate-300'} shadow-[0_0_8px_rgba(16,185,129,0.4)]`}></span>
                                <span className={`text-sm font-bold ${product.status === 'Activo' ? 'text-emerald-600' : 'text-slate-400'}`}>{product.status}</span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-4">
                                <button className="px-4 py-2 rounded-xl text-sm font-black text-blue-600 hover:bg-blue-50 transition-all">Editar</button>
                                <button className={`px-4 py-2 rounded-xl text-sm font-black transition-all ${
                                  product.status === 'Activo' 
                                    ? 'text-slate-400 hover:text-rose-600 hover:bg-rose-50' 
                                    : 'text-emerald-600 hover:bg-emerald-50'
                                }`}>
                                  {product.status === 'Activo' ? 'Desactivar' : 'Activar'}
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        ))}
                      </AnimatePresence>
                    </tbody>
                  </table>
                </div>
                
                {/* Pagination */}
                <div className="px-8 py-6 bg-slate-50/50 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 gap-4">
                  <p className="text-sm font-bold text-slate-500">
                    Mostrando <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> de <span className="text-slate-900">{filteredProducts.length}</span> productos
                  </p>
                  <div className="flex gap-2">
                    <button 
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                      className="p-3 border border-slate-200 rounded-xl text-slate-500 hover:bg-white disabled:opacity-30 transition-all"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <button 
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        className={`size-11 flex items-center justify-center rounded-xl font-black text-sm transition-all ${
                          currentPage === page 
                            ? 'bg-[#1e3a5f] text-white shadow-xl shadow-blue-900/20' 
                            : 'bg-white border border-slate-200 text-slate-500 hover:border-blue-500 hover:text-blue-500'
                        }`}
                      >
                        {page}
                      </button>
                    ))}

                    <button 
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                      className="p-3 border border-slate-200 rounded-xl text-slate-500 hover:bg-white disabled:opacity-30 transition-all"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </FadeIn>
        </div>

        {/* Add Product Modal */}
        <AnimatePresence>
          {isAddProductModalOpen && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
                onClick={() => setIsAddProductModalOpen(false)}
              ></motion.div>
              <ScaleIn className="relative bg-white p-8 rounded-[2rem] shadow-2xl max-w-2xl w-full border border-white/20 max-h-[90vh] overflow-y-auto custom-scrollbar">
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-2xl font-black text-slate-900">Añadir Nuevo Producto</h3>
                  <button onClick={() => setIsAddProductModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                    <X className="w-5 h-5" />
                  </button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nombre del Producto *</label>
                    <input 
                      type="text" 
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      placeholder="Ej. Ramo de Rosas Rojas"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Categoría</label>
                    <input 
                      type="text" 
                      value={newProduct.category}
                      onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      placeholder="Ej. Arreglos Florales"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Precio (MXN) *</label>
                    <input 
                      type="number" 
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      placeholder="0.00"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Stock Inicial</label>
                    <input 
                      type="number" 
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      placeholder="0"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Stock Mínimo</label>
                    <input 
                      type="number" 
                      value={newProduct.stock_minimo}
                      onChange={(e) => setNewProduct({...newProduct, stock_minimo: Number(e.target.value)})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      placeholder="5"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Estado</label>
                    <select 
                      value={newProduct.status}
                      onChange={(e) => setNewProduct({...newProduct, status: e.target.value})}
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
                      value={newProduct.image}
                      onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      placeholder="https://ejemplo.com/imagen.jpg"
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Descripción</label>
                    <textarea 
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold resize-none h-24"
                      placeholder="Descripción detallada del producto..."
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <label className="text-xs font-black uppercase tracking-widest text-slate-500">Etiqueta (Opcional)</label>
                    <input 
                      type="text" 
                      value={newProduct.badge}
                      onChange={(e) => setNewProduct({...newProduct, badge: e.target.value})}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                      placeholder="Ej. NOVEDAD, MÁS VENDIDO"
                    />
                  </div>
                </div>
                
                <div className="flex justify-end gap-4">
                  <button 
                    onClick={() => setIsAddProductModalOpen(false)}
                    className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-100 transition-colors"
                  >
                    Cancelar
                  </button>
                  <AnimatedButton 
                    onClick={handleAddProduct}
                    className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                  >
                    Guardar Producto
                  </AnimatedButton>
                </div>
              </ScaleIn>
            </div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  // Customer View
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 min-h-screen">
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-12">
          <div className="max-w-2xl">
            <h2 className="text-5xl md:text-6xl font-black text-brand-deep dark:text-white mb-6 tracking-tight leading-tight">
              Nuestro Catálogo <span className="text-brand-coral">Floral</span>
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
              Diseños exclusivos creados con flores frescas de la mejor calidad para cautivar tus sentidos y expresar tus sentimientos más profundos.
            </p>
          </div>
          <div className="flex flex-col items-end gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              <input 
                type="text"
                placeholder="Buscar por nombre o colección..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-3.5 bg-white dark:bg-slate-800 border-none rounded-2xl text-sm focus:ring-2 focus:ring-brand-coral/30 shadow-lg shadow-slate-200/50 dark:shadow-none transition-all"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 bg-slate-100 dark:bg-slate-800/50 px-4 py-2 rounded-full">
              <Filter className="w-3.5 h-3.5" />
              <span>{filteredProducts.length} productos encontrados</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`flex-none px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                selectedCategory === cat 
                  ? 'bg-brand-deep text-white shadow-xl shadow-brand-deep/20 scale-105' 
                  : 'bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700 hover:border-brand-coral hover:text-brand-coral'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <GlassCard className="p-8 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="flex flex-col gap-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Rango de precio: <span className="text-brand-deep font-black">${priceRange.toLocaleString()} MXN</span></label>
              <input 
                className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-coral" 
                max="5000" 
                min="0" 
                step="100" 
                type="range"
                value={priceRange}
                onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-black uppercase tracking-tighter">
                <span>$0 MXN</span>
                <span>$5,000+ MXN</span>
              </div>
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Tipo de producto</label>
              <select 
                className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-brand-coral/30 py-3"
                value={selectedType}
                onChange={(e) => { setSelectedType(e.target.value); setCurrentPage(1); }}
              >
                {productTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-4">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400">Colección</label>
              <select 
                className="w-full rounded-2xl border-none bg-slate-50 dark:bg-slate-700/50 text-slate-700 dark:text-slate-200 font-bold focus:ring-2 focus:ring-brand-coral/30 py-3"
                value={selectedCollection}
                onChange={(e) => { setSelectedCollection(e.target.value); setCurrentPage(1); }}
              >
                {collections.map(col => (
                  <option key={col} value={col}>{col}</option>
                ))}
              </select>
            </div>
          </div>
        </GlassCard>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <GlassCard key={product.id} className="group flex flex-col h-full">
                <Link to={`/producto/${product.id}`} className="block relative aspect-[4/5] overflow-hidden">
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {product.stock <= product.minStock && (
                    <div className="absolute top-4 right-4 bg-rose-500/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                      Pocas unidades
                    </div>
                  )}
                  {product.badge && (
                    <div className="absolute top-4 left-4 bg-brand-coral/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-lg">
                      {product.badge}
                    </div>
                  )}
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-brand-deep dark:text-white group-hover:text-brand-coral transition-colors leading-tight">
                      {product.name}
                    </h3>
                  </div>
                  
                  <p className="text-slate-500 dark:text-slate-400 text-sm line-clamp-2 mb-6 leading-relaxed">
                    {product.description || 'Diseño floral exclusivo con las mejores flores de temporada seleccionadas para ti.'}
                  </p>
                  
                  <div className="mt-auto space-y-4">
                    <div className="flex items-baseline gap-1">
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Desde</span>
                      <span className="text-2xl font-black text-brand-deep dark:text-white">${product.price.toLocaleString()}</span>
                      <span className="text-xs font-bold text-slate-400">MXN</span>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      <Link 
                        to={`/producto/${product.id}`} 
                        className="col-span-4 bg-brand-deep text-white py-3.5 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-brand-deep/90 transition-all text-center shadow-lg shadow-brand-deep/20"
                      >
                        Ver detalles
                      </Link>
                      <AnimatedButton 
                        className="bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 transition-all flex items-center justify-center shadow-lg shadow-emerald-500/20"
                        onClick={() => {
                          if (user) {
                            addToCart(product);
                            showToast(`¡${product.name} añadido al carrito!`, 'success');
                          } else {
                            setIsLoginModalOpen(true);
                          }
                        }}
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </AnimatedButton>
                    </div>
                  </div>
                </div>
              </GlassCard>
            ))
          ) : (
            <FadeIn className="col-span-full py-20 text-center">
              <div className="bg-white/50 backdrop-blur-md rounded-[3rem] p-16 border-2 border-dashed border-slate-200 inline-block">
                <div className="size-24 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-3xl font-black text-slate-900 mb-4">No encontramos lo que buscas</h3>
                <p className="text-slate-500 max-w-md mx-auto mb-10">Intenta ajustar los filtros de precio o categoría para encontrar el arreglo perfecto.</p>
                <AnimatedButton 
                  onClick={() => {
                    setSearchTerm('');
                    setSelectedCategory('Todos');
                    setPriceRange(5000);
                    setSelectedType('Todos los tipos');
                    setSelectedCollection('Todas las colecciones');
                  }}
                  className="bg-brand-deep text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-deep/20"
                >
                  Limpiar filtros
                </AnimatedButton>
              </div>
            </FadeIn>
          )}
        </AnimatePresence>
      </StaggerContainer>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-16 flex justify-center">
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  currentPage === page 
                    ? 'bg-brand-coral text-white ring-4 ring-brand-coral/20' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors disabled:opacity-30"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </nav>
        </div>
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsLoginModalOpen(false)}
            ></motion.div>
            <ScaleIn className="relative bg-white p-10 rounded-[2.5rem] shadow-2xl max-w-sm w-full text-center border border-white/20">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-8">
                <Lock className="w-10 h-10 text-brand-deep" />
              </div>
              <h3 className="text-3xl font-black text-brand-deep mb-4 leading-tight">¡Inicia sesión para continuar!</h3>
              <p className="text-slate-500 mb-10 leading-relaxed">Para añadir productos a tu pedido necesitas tener una cuenta activa en nuestra plataforma.</p>
              <div className="flex flex-col gap-4">
                <AnimatedButton className="w-full bg-brand-deep text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-brand-deep/20">
                  Iniciar sesión
                </AnimatedButton>
                <AnimatedButton className="w-full border-2 border-brand-deep text-brand-deep py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Registrarme
                </AnimatedButton>
              </div>
              <button 
                className="mt-8 text-slate-400 hover:text-slate-600 text-xs font-black uppercase tracking-widest transition-colors"
                onClick={() => setIsLoginModalOpen(false)}
              >
                Tal vez luego
              </button>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
