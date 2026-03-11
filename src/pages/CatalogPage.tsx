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
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../services/dataService';

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
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
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
      const matchesCategory = selectedCategory === 'Todos' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const categories = ['Todos', ...Array.from(new Set(products.map(p => p.category)))];

  // If user is admin, show the management view
  if (user?.role === 'administrador' || user?.role === 'admin') {
    return (
      <div className="bg-[#f8fafc] min-h-full -m-8 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[2rem] p-8 shadow-xl border-[6px] border-slate-100"
          >
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#f8f6f6] p-8 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-blue-500/30 transition-all"
              >
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-2">Total productos</p>
                  <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">{products.length}</h3>
                  <p className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +12% este mes
                  </p>
                </div>
                <div className="bg-blue-500/10 p-5 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                  <Package className="w-10 h-10" />
                </div>
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#f8f6f6] p-8 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-emerald-500/30 transition-all"
              >
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-2">Activos</p>
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
              </motion.div>
              
              <motion.div 
                whileHover={{ y: -5 }}
                className="bg-[#f8f6f6] p-8 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-orange-500/30 transition-all"
              >
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-2">Bajo Stock</p>
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
              </motion.div>
            </div>

            {/* Filters & Catalog Actions */}
            <div className="bg-slate-50 backdrop-blur-md p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-2 md:pb-0">
                {categories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat 
                        ? 'bg-[#1e3a5f] text-white shadow-lg shadow-blue-900/20' 
                        : 'hover:bg-slate-100 text-slate-500 font-medium'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              
              <div className="flex items-center gap-4 w-full md:w-auto">
                <div className="relative flex-1 md:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input 
                    type="text"
                    placeholder="Buscar producto..."
                    value={searchTerm}
                    onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1e3a5f] font-black px-8 py-3 rounded-xl shadow-xl shadow-yellow-500/10 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 whitespace-nowrap">
                  <Plus className="w-6 h-6 stroke-[3px]" />
                  Nuevo producto
                </button>
              </div>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-slate-100 bg-slate-50/50">
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Producto</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Categoría</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Precio</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Stock</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Estado</th>
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    <AnimatePresence mode="popLayout">
                      {paginatedProducts.map((product) => (
                        <motion.tr 
                          layout
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          key={product.id} 
                          className="hover:bg-slate-50 transition-colors group"
                        >
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-5">
                              <div className="size-16 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200 group-hover:border-blue-500/50 transition-colors">
                                <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${product.image}')` }}></div>
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-lg leading-tight mb-1">{product.name}</p>
                                <p className="text-xs font-bold text-slate-400 tracking-wider">ID: {product.id}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-blue-600 text-[10px] font-black tracking-widest uppercase">{product.category}</span>
                          </td>
                          <td className="px-8 py-5 font-black text-slate-900 text-lg">${product.price.toLocaleString()}</td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className={`font-bold ${product.stock <= product.minStock ? 'text-orange-600' : 'text-slate-500'}`}>
                                {product.stock} unidades
                              </span>
                              {product.stock <= product.minStock && (
                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-tighter">Stock Crítico</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <span className={`size-2.5 rounded-full ${product.status === 'Activo' ? 'bg-emerald-500' : 'bg-slate-300'} shadow-sm`}></span>
                              <span className={`text-sm font-bold ${product.status === 'Activo' ? 'text-emerald-600' : 'text-slate-400'}`}>{product.status}</span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-6">
                              <button className="text-sm font-black text-blue-600 hover:text-blue-800 transition-colors">Editar</button>
                              <button className="text-sm font-black text-slate-400 hover:text-red-600 transition-colors">
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
              <div className="px-8 py-6 bg-slate-50 flex flex-col md:flex-row items-center justify-between border-t border-slate-100 gap-4">
                <p className="text-sm font-bold text-slate-500">
                  Mostrando <span className="text-slate-900">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)}</span> de <span className="text-slate-900">{filteredProducts.length}</span> productos
                </p>
                <div className="flex gap-2">
                  <button 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
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
                          : 'hover:bg-slate-100 text-slate-500 font-bold'
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button 
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Customer View
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 min-h-screen">
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-12"
      >
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-5xl font-black text-brand-deep mb-4 tracking-tight">Nuestro Catálogo Floral</h2>
            <p className="text-lg text-slate-600">Diseños exclusivos creados con flores frescas de la mejor calidad para cautivar tus sentidos y expresar tus sentimientos.</p>
          </div>
          <div className="flex items-center gap-2 text-sm font-medium text-slate-500 bg-slate-100 px-4 py-2 rounded-lg">
            <Filter className="w-4 h-4" />
            <span>Mostrando {filteredProducts.length} productos</span>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          {categories.map(cat => (
            <button 
              key={cat}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`flex-none px-6 py-2.5 rounded-full font-semibold transition-all ${
                selectedCategory === cat 
                  ? 'bg-brand-deep text-white shadow-lg' 
                  : 'bg-white text-slate-700 border border-slate-200 hover:border-brand-coral hover:text-brand-coral'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 p-6 bg-white rounded-2xl border border-slate-200">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Buscar por nombre</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text"
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                placeholder="¿Qué flores buscas?"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 text-slate-700 focus:ring-brand-deep focus:border-brand-deep border bg-white"
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Ordenar por</label>
            <select className="rounded-xl border-slate-200 text-slate-700 focus:ring-brand-deep focus:border-brand-deep px-3 py-2 border bg-white">
              <option>Relevancia</option>
              <option>Precio: Menor a Mayor</option>
              <option>Precio: Mayor a Menor</option>
              <option>Novedades</option>
            </select>
          </div>
        </div>
      </motion.section>

      <motion.section 
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="popLayout">
          {paginatedProducts.map((product) => (
            <motion.div 
              key={product.id} 
              variants={itemVariants} 
              layout
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110" 
                  style={{ backgroundImage: `url('${product.image}')` }}
                />
                {product.stock <= product.minStock && (
                  <div className="absolute top-4 right-4 bg-orange-500 px-3 py-1 rounded-full text-[10px] font-black text-white uppercase tracking-wider shadow-lg">
                    Pocas unidades
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-brand-deep group-hover:text-brand-coral transition-colors">{product.name}</h3>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{product.category}</span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{product.description || 'Diseño floral exclusivo con las mejores flores de temporada.'}</p>
                <div className="mt-auto">
                  <div className="text-xl font-bold text-slate-900 mb-4">Desde ${product.price.toLocaleString()} MXN</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Link to={`/producto/${product.id}`} className="flex-1 bg-brand-deep text-white py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all text-center">Ver detalles</Link>
                      <button className="w-12 h-11 flex items-center justify-center bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </button>
                    </div>
                    <button 
                      className="w-full bg-brand-coral text-white py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-sm"
                      onClick={() => setIsLoginModalOpen(true)}
                    >
                      Añadir al pedido
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.section>

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
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsLoginModalOpen(false)}
          ></motion.div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-brand-deep" />
            </div>
            <h3 className="text-2xl font-bold text-brand-deep mb-2">¡Inicia sesión para continuar!</h3>
            <p className="text-slate-500 mb-8">Para añadir productos a tu pedido necesitas tener una cuenta activa.</p>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-brand-deep text-white py-3.5 rounded-2xl font-bold hover:shadow-lg transition-all">Iniciar sesión</button>
              <button className="w-full border-2 border-brand-deep text-brand-deep py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-all">Registrarme</button>
            </div>
            <button 
              className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
              onClick={() => setIsLoginModalOpen(false)}
            >
              Tal vez luego
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}
