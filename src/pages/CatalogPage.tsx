import React, { useState, useEffect } from 'react';
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
  AlertTriangle
} from 'lucide-react';
import { motion } from 'motion/react';
import productsData from '../data/products.json';

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
  const products = productsData.slice(0, 8); // Display first 8 products for catalog

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // If user is admin, show the management view
  if (user?.role === 'administrador') {
    return (
      <div className="bg-[#f8fafc] min-h-full -m-8 p-8">
        <div className="max-w-[1400px] mx-auto space-y-6">
          {/* Main Content Container with Light Theme */}
          <div className="bg-white rounded-[2rem] p-8 shadow-xl border-[6px] border-slate-100">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#f8f6f6] p-8 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-blue-500/30 transition-all">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-2">Total productos</p>
                  <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">124</h3>
                  <p className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                    <TrendingUp className="w-4 h-4" /> +12% este mes
                  </p>
                </div>
                <div className="bg-blue-500/10 p-5 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                  <Package className="w-10 h-10" />
                </div>
              </div>
              
              <div className="bg-[#f8f6f6] p-8 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-emerald-500/30 transition-all">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-2">Activos</p>
                  <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">118</h3>
                  <p className="text-emerald-600 text-sm font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" /> 95% del total
                  </p>
                </div>
                <div className="bg-emerald-500/10 p-5 rounded-2xl text-emerald-400 group-hover:scale-110 transition-transform">
                  <CheckCircle className="w-10 h-10" />
                </div>
              </div>
              
              <div className="bg-[#f8f6f6] p-8 rounded-3xl border border-slate-200 flex justify-between items-center group hover:border-orange-500/30 transition-all">
                <div>
                  <p className="text-slate-500 text-sm font-medium mb-2">Bajo Stock</p>
                  <h3 className="text-5xl font-black text-slate-900 mb-2 tracking-tight">6</h3>
                  <p className="text-orange-600 text-sm font-bold flex items-center gap-1">
                    <AlertTriangle className="w-4 h-4" /> Requiere atención
                  </p>
                </div>
                <div className="bg-orange-500/10 p-5 rounded-2xl text-orange-600 group-hover:scale-110 transition-transform">
                  <AlertCircle className="w-10 h-10" />
                </div>
              </div>
            </div>

            {/* Filters & Catalog Actions */}
            <div className="bg-slate-50 backdrop-blur-md p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-4 mb-8">
              <div className="flex items-center gap-2">
                <button className="px-6 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-900/20">Todos</button>
                <button className="px-6 py-2.5 hover:bg-slate-100 text-slate-500 rounded-xl text-sm font-medium transition-all">Ramos</button>
                <button className="px-6 py-2.5 hover:bg-slate-100 text-slate-500 rounded-xl text-sm font-medium transition-all">Fúnebres</button>
                <button className="px-6 py-2.5 hover:bg-slate-100 text-slate-500 rounded-xl text-sm font-medium transition-all">Especiales</button>
                <div className="h-8 w-[1px] bg-slate-200 mx-2"></div>
                <button className="flex items-center gap-2 px-6 py-2.5 text-slate-500 hover:bg-slate-100 rounded-xl text-sm font-medium">
                  <Filter className="w-4 h-4" /> Filtrar
                </button>
              </div>
              <button className="bg-[#fbbf24] hover:bg-[#f59e0b] text-[#1e3a5f] font-black px-8 py-3 rounded-xl shadow-xl shadow-yellow-500/10 flex items-center gap-2 transition-all transform hover:-translate-y-0.5">
                <Plus className="w-6 h-6 stroke-[3px]" />
                Nuevo producto
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm">
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
                  {[
                    { name: 'Rosas Rojas Premium', sku: 'FL-001', cat: 'RAMOS', price: '$850.00', stock: '24 unidades', status: 'Activo', statusColor: 'bg-emerald-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_6zt1Fo5rz2VcJ1xr2c_z0f2K7mZ4FbcGx8jdMe1lD8Vjuyq4rU3USWKgunfmZpcdWgTSUS3xcnUeHN7MLgk8_wgt7fl_5iRdQS9FJKExKVetr0WiY4wveTu0IFmEexqcJ4SbUWxue3jMfqztx-YKx8WT2lYYiLG7yEg2i69KwRCXkWK6ehG79Scd_X6g0J7mXjyXYkzemf55it8xDhH8nUyFmIxDxcL0oQsCsjkfGMg9f9fmyFAHcc69h4Tt2C8XaV6_Xv3sPp-n' },
                    { name: 'Corona Esperanza', sku: 'FL-042', cat: 'FÚNEBRE', price: '$1,450.00', stock: '4 unidades', status: 'Bajo Stock', statusColor: 'bg-orange-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCmldsh1evZJR5hMX61YXueq7-c_B8CdlpftysatwksUNIpLzVWcOm6pSYJ_Qe2AzvgEbeC7a56ZzlzAXgXg4AdweZxFU3PgjdiI35Efl32tQVvWZzzZMGhWr1x1P-K7Cem6LMw0bp-7x8gRKblzvuPF21uuhvSkySE5T95eSYzgyQSzvBxquwr3sf81ts8jfCwGGULbWuHnv0A4wvPwPmHf-DXt9eP3DbuigZltTQQrWW2l_SxPdAhxHsn-qzKp0fHexYZKZ_FLGD5' },
                    { name: 'Caja de Tulipanes', sku: 'FL-089', cat: 'PRIMAVERA', price: '$1,100.00', stock: '12 unidades', status: 'Activo', statusColor: 'bg-emerald-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDthLDg2RcKO7Dupra9-QsYiWwlfcbsi5mtxoFv_9h8ws4fLo7L7i9AgHU6LJmAPhviiMGmzZHgAR9VyVlKHp2LE6K7a9nUuIacLb1sP88ceO1B3izNDFlTZarO5CJJ7T1EUaP_NWGPB2HJORZnpwS5JdU9evwMar9N91-7Q93oOMgdTPB2C-Vui0TO4MgJU84jvHPdRyLmgVEK3gO8-FHDImGJG_4iceS5CYk0673uE92jdSzMBmyfzfX8_3pCjbqSSjTlTzGtnZ31' },
                  ].map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50 transition-colors group">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-5">
                          <div className="size-16 rounded-full bg-slate-100 overflow-hidden border-2 border-slate-200 group-hover:border-blue-500/50 transition-colors">
                            <div className="w-full h-full bg-cover bg-center" style={{ backgroundImage: `url('${item.img}')` }}></div>
                          </div>
                          <div>
                            <p className="font-black text-slate-900 text-lg leading-tight mb-1">{item.name}</p>
                            <p className="text-xs font-bold text-slate-400 tracking-wider">SKU: {item.sku}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <span className="text-blue-600 text-[10px] font-black tracking-widest">{item.cat}</span>
                      </td>
                      <td className="px-8 py-5 font-black text-slate-900 text-lg">{item.price}</td>
                      <td className="px-8 py-5 font-bold text-slate-500">{item.stock}</td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-3">
                          <span className={`size-2.5 rounded-full ${item.statusColor} shadow-sm`}></span>
                          <span className={`text-sm font-bold ${item.status === 'Activo' ? 'text-emerald-600' : 'text-orange-600'}`}>{item.status}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <div className="flex items-center justify-end gap-6">
                          <button className="text-sm font-black text-blue-600 hover:text-blue-800 transition-colors">Editar</button>
                          <button className="text-sm font-black text-slate-400 hover:text-red-600 transition-colors">Desactivar</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {/* Pagination */}
              <div className="px-8 py-6 bg-slate-50 flex items-center justify-between border-t border-slate-100">
                <p className="text-sm font-bold text-slate-500">Mostrando <span className="text-slate-900">1-10</span> de <span className="text-slate-900">124</span> productos</p>
                <div className="flex gap-2">
                  <button className="p-2.5 border border-slate-200 rounded-xl text-slate-300 hover:bg-slate-100 disabled:opacity-30" disabled>
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button className="size-11 flex items-center justify-center rounded-xl bg-[#1e3a5f] text-white font-black text-sm shadow-xl shadow-blue-900/20">1</button>
                  <button className="size-11 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 font-bold text-sm transition-colors">2</button>
                  <button className="size-11 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-500 font-bold text-sm transition-colors">3</button>
                  <button className="p-2.5 border border-slate-200 rounded-xl text-slate-500 hover:bg-slate-100 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
            <span>Mostrando 24 productos</span>
          </div>
        </div>

        <div className="flex gap-3 overflow-x-auto pb-4 no-scrollbar">
          <button className="flex-none px-6 py-2.5 bg-brand-deep text-white rounded-full font-semibold transition-all hover:shadow-lg">Todos</button>
          <button className="flex-none px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:border-brand-coral hover:text-brand-coral transition-all">Cumpleaños</button>
          <button className="flex-none px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:border-brand-coral hover:text-brand-coral transition-all">Romance</button>
          <button className="flex-none px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:border-brand-coral hover:text-brand-coral transition-all">Eventos</button>
          <button className="flex-none px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:border-brand-coral hover:text-brand-coral transition-all">Fúnebres</button>
          <button className="flex-none px-6 py-2.5 bg-white text-slate-700 border border-slate-200 rounded-full font-medium hover:border-brand-coral hover:text-brand-coral transition-all">Aniversario</button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8 p-6 bg-white rounded-2xl border border-slate-200">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Rango de precio</label>
            <input className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-brand-deep" max="5000" min="0" step="100" type="range" />
            <div className="flex justify-between text-xs text-slate-500 font-medium">
              <span>$0 MXN</span>
              <span>$5,000+ MXN</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Tipo de producto</label>
            <select className="rounded-xl border-slate-200 text-slate-700 focus:ring-brand-deep focus:border-brand-deep px-3 py-2 border bg-white">
              <option>Todos los tipos</option>
              <option>Ramos</option>
              <option>Arreglos de mesa</option>
              <option>Cajas florales</option>
              <option>Plantas</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold text-slate-700">Colección</label>
            <select className="rounded-xl border-slate-200 text-slate-700 focus:ring-brand-deep focus:border-brand-deep px-3 py-2 border bg-white">
              <option>Todas las colecciones</option>
              <option>Premium</option>
              <option>Clásica</option>
              <option>Económica</option>
              <option>Temporada</option>
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
        {products.map((product) => (
          <motion.div key={product.id} variants={itemVariants} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden">
              <div 
                className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110" 
                style={{ backgroundImage: `url('${product.image}')` }}
              />
              {product.badge && (
                <div className={`absolute top-4 right-4 ${product.badgeBg} px-3 py-1 rounded-full text-xs font-bold ${product.badgeColor} uppercase tracking-wider`}>
                  {product.badge}
                </div>
              )}
            </div>
            <div className="p-6 flex flex-col flex-1">
              <h3 className="text-xl font-bold text-brand-deep mb-2 group-hover:text-brand-coral transition-colors">{product.name}</h3>
              <p className="text-slate-500 text-sm line-clamp-2 mb-4">{product.description}</p>
              <div className="mt-auto">
                <div className="text-xl font-bold text-slate-900 mb-4">Desde ${product.price} MXN</div>
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
      </motion.section>

      <div className="mt-16 flex justify-center">
        <nav className="flex items-center gap-2">
          <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button className="w-10 h-10 bg-brand-coral text-white rounded-lg font-bold ring-4 ring-brand-coral/20">1</button>
          <button className="w-10 h-10 text-slate-600 hover:bg-slate-50 rounded-lg font-bold transition-colors">2</button>
          <button className="w-10 h-10 text-slate-600 hover:bg-slate-50 rounded-lg font-bold transition-colors">3</button>
          <span className="text-slate-400 px-2">...</span>
          <button className="w-10 h-10 text-slate-600 hover:bg-slate-50 rounded-lg font-bold transition-colors">8</button>
          <button className="p-2 border border-slate-200 rounded-lg text-slate-400 hover:bg-slate-50 transition-colors">
            <ChevronRight className="w-5 h-5" />
          </button>
        </nav>
      </div>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsLoginModalOpen(false)}
          ></div>
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
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
          </div>
        </div>
      )}
    </main>
  );
}
