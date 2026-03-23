// Catalogo
import React, { useState, useEffect, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ShoppingCart,
  Eye,
  UploadCloud,
  DownloadCloud,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { AdminService } from "../../services/adminService";
import { Product } from "../../types";
import { useCart } from "../../hooks/useCart";
import CustomDropdown from "../../components/CustomDropdown";
import { useToast } from "../../hooks/useToast";
import {
  FadeIn,
  StaggerContainer,
  AnimatedButton,
} from "../../components/Animations";
import ImportModal from "../../components/ImportModal";

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

export default function CatalogPage() {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { showToast } = useToast();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [priceRange, setPriceRange] = useState(5000);
  const [selectedType, setSelectedType] = useState("Todos los tipos");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    const storedUser =
      localStorage.getItem("usuario") || localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await AdminService.getAdminProducts({ size: 100 });
        setProducts(res.data.items);
      } catch {
        showToast("Error al cargar el catálogo", "error");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const handleImportConfirm = async (_data: any[], file: File) => {
    setLoading(true);
    try {
      await AdminService.importAdminProducts(file);
      const res = await AdminService.getAdminProducts({ size: 100 });
      setProducts(res.data.items);
      showToast(`Importación exitosa`, "success");
    } catch {
      showToast("Error al importar productos.", "error");
    } finally {
      setLoading(false);
      setIsImportModalOpen(false);
    }
  };

  const handleExport = async () => {
    try {
      const blob = await AdminService.exportAdminProducts();
      // Inyectar BOM para que Excel detecte UTF-8 y no corrompa tildes/ñ
      const text = await blob.text();
      const BOM = '\uFEFF';
      const blobWithBom = new Blob([BOM + text], { type: 'text/csv;charset=utf-8;' });
      const url = URL.createObjectURL(blobWithBom);
      const a = document.createElement("a");
      a.href = url;
      a.download = "catalogo_export.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      showToast("Error al exportar productos", "error");
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((product) => {
      const matchesSearch =
        product.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        selectedCategory === "Todos" || product.tipo === selectedCategory;
      const matchesPrice = product.precioBase <= priceRange;
      const matchesType =
        selectedType === "Todos los tipos" || product.tipo === selectedType;
      return matchesSearch && matchesCategory && matchesPrice && matchesType;
    });
  }, [products, searchTerm, selectedCategory, priceRange, selectedType]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const categories = [
    "Todos",
    ...Array.from(new Set(products.map((p) => p.tipo))),
  ];
  const productTypes = [
    "Todos los tipos",
    ...Array.from(new Set(products.map((p) => p.tipo))),
  ] as string[];

  const handleAddToCart = (product: Product) => {
    if (user && (user.role === "cliente" || user.role === "customer")) {
      addToCart(product);
      showToast(`¡${product.nombre} añadido al carrito!`, "success");
    } else {
      setIsLoginModalOpen(true);
    }
  };

  // Admin view
  if (user?.role === "administrador" || user?.role === "admin") {
    return (
      <div className="min-h-full" style={{ zoom: 0.75 }}>
        <div className="w-full space-y-6">
          <div>
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
                    <TrendingUp className="w-4 h-4" /> desde la API
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
                    {products.filter((p) => p.estado === "ACTIVO").length}
                  </h3>
                  <p className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />{" "}
                    {products.length
                      ? Math.round(
                          (products.filter((p) => p.estado === "ACTIVO").length / products.length) * 100,
                        )
                      : 0}
                    % del total
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
                    {products.filter((p) => (p.stock ?? 0) <= 5).length}
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
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
                    className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                      selectedCategory === cat
                        ? "bg-[#1e3a5f] text-white shadow-lg shadow-blue-900/20"
                        : "hover:bg-slate-100 text-slate-500 font-medium"
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
                <button
                  onClick={() => setIsImportModalOpen(true)}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
                >
                  <UploadCloud className="w-5 h-5" />
                  Importar
                </button>
                <button
                  onClick={handleExport}
                  className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-black px-4 py-2.5 rounded-xl flex items-center gap-2 transition-all shadow-sm"
                >
                  <DownloadCloud className="w-5 h-5" />
                  Exportar
                </button>
                <button
                  onClick={() => navigate("/admin/productos/nuevo")}
                  className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1e3a5f] font-black px-8 py-3 rounded-xl shadow-xl shadow-yellow-500/10 flex items-center gap-2 transition-all transform hover:-translate-y-0.5 whitespace-nowrap"
                >
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
                      <th className="px-8 py-6 text-[11px] font-black uppercase tracking-[0.2em] text-slate-400">Tipo</th>
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
                                {product.imagenUrl ? (
                                  <img
                                    src={product.imagenUrl}
                                    alt={product.nombre}
                                    className="w-full h-full object-cover"
                                    referrerPolicy="no-referrer"
                                  />
                                ) : (
                                  <div className="w-full h-full flex items-center justify-center text-slate-300">
                                    <Package className="w-6 h-6" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="font-black text-slate-900 text-lg leading-tight mb-1">{product.nombre}</p>
                                <p className="text-xs font-bold text-slate-400 tracking-wider">ID: {product.id.slice(0,8).toUpperCase()}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <span className="text-blue-600 text-[10px] font-black tracking-widest uppercase">{product.tipo}</span>
                          </td>
                          <td className="px-8 py-5 font-black text-slate-900 text-lg">
                            ${product.precioBase.toLocaleString()}
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex flex-col">
                              <span className={`font-bold ${(product.stock ?? 0) <= 5 ? "text-orange-600" : "text-slate-500"}`}>
                                {product.stock ?? "—"} unidades
                              </span>
                              {(product.stock ?? 0) <= 5 && (
                                <span className="text-[10px] font-black text-orange-400 uppercase tracking-tighter">Stock Crítico</span>
                              )}
                            </div>
                          </td>
                          <td className="px-8 py-5">
                            <div className="flex items-center gap-3">
                              <span className={`size-2.5 rounded-full ${product.estado === "ACTIVO" ? "bg-emerald-500" : "bg-slate-300"} shadow-sm`} />
                              <span className={`text-sm font-bold ${product.estado === "ACTIVO" ? "text-emerald-600" : "text-slate-400"}`}>
                                {product.estado === "ACTIVO" ? "Activo" : "Inactivo"}
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-5 text-right">
                            <div className="flex items-center justify-end gap-6">
                              <button
                                onClick={() => navigate(`/admin/productos/editar/${product.id}`)}
                                className="text-sm font-black text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                Editar
                              </button>
                              <button className="text-sm font-black text-slate-400 hover:text-red-600 transition-colors">
                                {product.estado === "ACTIVO" ? "Desactivar" : "Activar"}
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
                  Mostrando{" "}
                  <span className="text-slate-900">
                    {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredProducts.length)}
                  </span>{" "}
                  de <span className="text-slate-900">{filteredProducts.length}</span> productos
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
                    className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button key={page} onClick={() => setCurrentPage(page)}
                      className={`size-11 flex items-center justify-center rounded-xl font-black text-sm transition-all ${
                        currentPage === page ? "bg-[#1e3a5f] text-white shadow-xl shadow-blue-900/20" : "hover:bg-slate-100 text-slate-500 font-bold"
                      }`}>
                      {page}
                    </button>
                  ))}
                  <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
                    className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 disabled:opacity-30 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <ImportModal
            isOpen={isImportModalOpen}
            onClose={() => setIsImportModalOpen(false)}
            onConfirm={handleImportConfirm}
            title="Importar Productos"
          />
        </div>
      </div>
    );
  }

  // Customer View
  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 min-h-screen" style={{ zoom: 0.75 }}>
      <FadeIn className="mb-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="max-w-2xl">
            <h2 className="text-4xl md:text-6xl font-black text-[#1A3B5B] mb-4 tracking-tight leading-tight">
              Nuestro <span className="text-[#FBBF24]">Catálogo</span> Floral
            </h2>
            <p className="text-lg text-slate-500 font-medium">
              Diseños exclusivos creados con flores frescas de la mejor calidad para cautivar tus sentidos.
            </p>
          </div>
          <div className="flex flex-col items-end gap-4">
            <div className="relative w-full md:w-80 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-[#FBBF24] transition-colors" />
              <input
                type="text"
                placeholder="Buscar flores..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:ring-4 focus:ring-[#FBBF24]/10 focus:border-[#FBBF24] transition-all shadow-sm"
              />
            </div>
            <div className="flex items-center gap-2 text-xs font-black text-slate-400 uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-100">
              <Filter className="w-3 h-3" />
              <span>{filteredProducts.length} productos encontrados</span>
            </div>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => { setSelectedCategory(cat); setCurrentPage(1); }}
              className={`flex-none px-8 py-3 rounded-2xl font-black text-sm uppercase tracking-wider transition-all ${
                selectedCategory === cat
                  ? "bg-[#1A3B5B] text-white shadow-xl shadow-blue-900/20"
                  : "bg-white text-slate-500 border border-slate-200 hover:border-[#FBBF24] hover:text-[#FBBF24]"
              }`}
            >
              {cat}
            </motion.button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4 p-8 bg-white/50 backdrop-blur-xl rounded-[2.5rem] border border-white shadow-2xl shadow-blue-900/5">
          <div className="flex flex-col gap-4">
            <label className="text-sm font-black text-[#1A3B5B] uppercase tracking-widest">
              Rango de precio: <span className="text-[#FBBF24] ml-2">${priceRange.toLocaleString()} MXN</span>
            </label>
            <div className="px-2">
              <input
                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#FBBF24]"
                max="5000" min="0" step="100" type="range"
                value={priceRange}
                onChange={(e) => { setPriceRange(Number(e.target.value)); setCurrentPage(1); }}
              />
              <div className="flex justify-between text-[10px] text-slate-400 font-black uppercase tracking-tighter mt-3">
                <span>$0 MXN</span>
                <span>$5,000+ MXN</span>
              </div>
            </div>
          </div>

          <CustomDropdown
            label="Tipo de producto"
            options={productTypes}
            value={selectedType}
            onChange={(val) => { setSelectedType(val); setCurrentPage(1); }}
          />
        </div>
      </FadeIn>

      <StaggerContainer className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        <AnimatePresence mode="popLayout">
          {paginatedProducts.length > 0 ? (
            paginatedProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                layout
                className="group bg-white rounded-[2.5rem] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-slate-100 flex flex-col relative"
              >
                <div className="relative aspect-[4/5] overflow-hidden">
                  {product.imagenUrl ? (
                    <motion.div
                      className="absolute inset-0 bg-center bg-cover"
                      style={{ backgroundImage: `url('${product.imagenUrl}')` }}
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                  ) : (
                    <div className="absolute inset-0 bg-slate-100 flex items-center justify-center">
                      <Package className="w-16 h-16 text-slate-300" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {(product.stock ?? 0) <= 5 && (product.stock ?? 0) > 0 && (
                    <div className="absolute top-6 right-6 bg-red-500 px-4 py-1.5 rounded-full text-[10px] font-black text-white uppercase tracking-widest shadow-xl backdrop-blur-md">
                      Pocas unidades
                    </div>
                  )}

                  <div className="absolute inset-0 flex items-center justify-center gap-3 translate-y-10 group-hover:translate-y-0 opacity-0 group-hover:opacity-100 transition-all duration-500">
                    <Link
                      to={`/producto/${product.id}`}
                      className="p-4 bg-white rounded-full text-[#1A3B5B] hover:bg-[#FBBF24] hover:text-white transition-colors shadow-xl"
                    >
                      <Eye className="w-5 h-5" />
                    </Link>
                  </div>
                </div>

                <div className="p-8 flex flex-col flex-1">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-black text-[#1A3B5B] group-hover:text-[#FBBF24] transition-colors leading-tight">
                      {product.nombre}
                    </h3>
                    <span className="text-[10px] font-black text-[#FBBF24] uppercase tracking-[0.2em] bg-[#FBBF24]/10 px-2 py-1 rounded-md">
                      {product.tipo}
                    </span>
                  </div>
                  <p className="text-slate-500 text-sm font-medium line-clamp-2 mb-6 leading-relaxed">
                    Diseño floral exclusivo con las mejores flores de temporada.
                  </p>

                  <div className="mt-auto">
                    <div className="flex items-baseline gap-1 mb-6">
                      <span className="text-xs font-black text-slate-400 uppercase">Desde</span>
                      <span className="text-2xl font-black text-[#1A3B5B]">${product.precioBase.toLocaleString()}</span>
                      <span className="text-xs font-bold text-slate-400">MXN</span>
                    </div>

                    <AnimatedButton
                      className="w-full bg-[#1A3B5B] text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest flex items-center justify-center gap-3 shadow-xl shadow-blue-900/10"
                      onClick={() => handleAddToCart(product)}
                    >
                      <ShoppingCart className="w-5 h-5" />
                      Añadir al carrito
                    </AnimatedButton>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-32 text-center"
            >
              <div className="bg-white rounded-[3rem] p-16 border border-slate-100 shadow-2xl inline-block max-w-lg">
                <div className="w-24 h-24 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-8">
                  <Search className="w-10 h-10 text-slate-300" />
                </div>
                <h3 className="text-2xl font-black text-[#1A3B5B] mb-4">No encontramos lo que buscas</h3>
                <p className="text-slate-500 font-medium mb-10">
                  Ajusta los filtros o intenta con una búsqueda diferente.
                </p>
                <button
                  onClick={() => { setSearchTerm(""); setSelectedCategory("Todos"); setPriceRange(5000); setSelectedType("Todos los tipos"); }}
                  className="px-10 py-4 bg-[#FBBF24] text-[#1A3B5B] font-black rounded-2xl shadow-xl shadow-yellow-500/20 hover:scale-105 transition-transform uppercase text-sm tracking-widest"
                >
                  Limpiar filtros
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </StaggerContainer>

      {totalPages > 1 && (
        <FadeIn className="mt-20 flex justify-center">
          <nav className="flex items-center gap-3 bg-white p-2 rounded-3xl shadow-xl border border-slate-100">
            <button onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))} disabled={currentPage === 1}
              className="p-3 text-slate-400 hover:text-[#1A3B5B] hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-30">
              <ChevronLeft className="w-6 h-6" />
            </button>
            <div className="flex gap-1">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button key={page} onClick={() => setCurrentPage(page)}
                  className={`w-12 h-12 rounded-2xl font-black text-sm transition-all ${
                    currentPage === page ? "bg-[#1A3B5B] text-white shadow-xl shadow-blue-900/20" : "text-slate-500 hover:bg-slate-50"
                  }`}>
                  {page}
                </button>
              ))}
            </div>
            <button onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages}
              className="p-3 text-slate-400 hover:text-[#1A3B5B] hover:bg-slate-50 rounded-2xl transition-all disabled:opacity-30">
              <ChevronRight className="w-6 h-6" />
            </button>
          </nav>
        </FadeIn>
      )}

      {/* Login Modal */}
      <AnimatePresence>
        {isLoginModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-[#1A3B5B]/60 backdrop-blur-md"
              onClick={() => setIsLoginModalOpen(false)}
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white p-12 rounded-[3rem] shadow-[0_30px_100px_rgba(0,0,0,0.3)] max-w-md w-full text-center border border-white/20"
            >
              <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8">
                <Lock className="w-10 h-10 text-[#1A3B5B]" />
              </div>
              <h3 className="text-3xl font-black text-[#1A3B5B] mb-4 leading-tight">¡Únete a nuestra comunidad!</h3>
              <p className="text-slate-500 font-medium mb-10 leading-relaxed">
                Para añadir productos a tu pedido necesitas tener una cuenta activa. ¡Es rápido y gratis!
              </p>
              <div className="flex flex-col gap-4">
                <Link to="/login" className="w-full bg-[#1A3B5B] text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20 hover:scale-[1.02] transition-transform">
                  Iniciar sesión
                </Link>
                <Link to="/registro" className="w-full border-2 border-[#1A3B5B] text-[#1A3B5B] py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-50 transition-all">
                  Registrarme
                </Link>
              </div>
              <button className="mt-8 text-slate-400 hover:text-[#1A3B5B] text-sm font-black uppercase tracking-widest transition-colors"
                onClick={() => setIsLoginModalOpen(false)}>
                Tal vez luego
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}
