import React, { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Link } from 'react-router-dom';
import { 
  TrendingUp, 
  ShoppingCart, 
  CreditCard, 
  UserPlus, 
  AlertTriangle,
  MoreVertical,
  ChevronRight,
  Download,
  Briefcase,
  UserCircle,
  User,
  Package,
  MapPin,
  ArrowRight,
  Heart
} from 'lucide-react';
import { DataService } from '../services/dataService';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState(DataService.getDashboardStats());
  const [alerts, setAlerts] = useState(DataService.getInventoryAlerts());
  const [weeklySales, setWeeklySales] = useState(DataService.getWeeklySalesData());
  const [recentOrders, setRecentOrders] = useState(DataService.getOrders().slice(0, 5));

  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 3;
  const totalPages = Math.ceil(alerts.length / pageSize);

  const displayedAlerts = alerts.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  const nextPage = () => setCurrentPage((prev) => (prev + 1) % totalPages);
  const prevPage = () => setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages);

  useEffect(() => {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500 italic">Cargando información del usuario...</p>
      </div>
    );
  }

  // If user is admin, show the full dashboard
  if (user.role === 'admin' || user.role === 'administrador') {
    return (
      <div className="space-y-8 animate-in fade-in duration-500">
        {/* KPI Section */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-sm font-medium">Ventas Totales</p>
              <span className="p-2 bg-green-50 text-green-600 rounded-lg">
                <TrendingUp className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">${(stats?.totalSales || 0).toLocaleString()}</p>
            <p className="text-xs font-medium text-green-600">+15.4% <span className="text-slate-400 font-normal">vs periodo anterior</span></p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-sm font-medium">Pedidos Totales</p>
              <span className="p-2 bg-orange-50 text-orange-600 rounded-lg">
                <ShoppingCart className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{(stats?.orderCount || 0)}</p>
            <p className="text-xs font-medium text-orange-600">Activos <span className="text-slate-400 font-normal">en sistema</span></p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-sm font-medium">Ticket Promedio</p>
              <span className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CreditCard className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">${(stats?.averageTicket || 0).toFixed(2)}</p>
            <p className="text-xs font-medium text-blue-600">Optimizado <span className="text-slate-400 font-normal">por volumen</span></p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <p className="text-slate-500 text-sm font-medium">Nuevos Clientes</p>
              <span className="p-2 bg-purple-50 text-purple-600 rounded-lg">
                <UserPlus className="w-4 h-4" />
              </span>
            </div>
            <p className="text-3xl font-bold text-slate-900">{(stats?.newCustomers || 0)}</p>
            <p className="text-xs font-medium text-purple-600">Esta semana <span className="text-slate-400 font-normal">registrados</span></p>
          </motion.div>
        </section>

        {/* Alerts & Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Inventory Alert (Important) */}
          <div className="lg:col-span-1 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-500" />
                Alertas de Inventario
              </h2>
              <span className="px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full uppercase">Crítico</span>
            </div>
            
            <div className="space-y-3">
              {alerts.length > 0 ? (
                <>
                  {displayedAlerts.map((p, idx) => (
                    <motion.div 
                      key={idx}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.1 }}
                      className="p-4 bg-red-50 border border-red-100 rounded-xl"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-red-700">{p.name} (Stock Bajo)</p>
                          <p className="text-xs text-red-600/70 mt-1">Quedan {p.stock} unidades. Mínimo: {p.stock_minimo}.</p>
                        </div>
                        <button className="bg-red-600 hover:bg-red-700 text-white text-[10px] font-bold px-3 py-1 rounded-lg shadow-sm transition-colors shrink-0">PEDIR YA</button>
                      </div>
                    </motion.div>
                  ))}
                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 mt-4">
                      <button onClick={prevPage} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
                        <ChevronRight className="w-4 h-4 rotate-180" />
                      </button>
                      <span className="text-xs font-bold text-slate-500">
                        {currentPage + 1} / {totalPages}
                      </span>
                      <button onClick={nextPage} className="p-2 rounded-full bg-slate-100 hover:bg-slate-200">
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <p className="text-sm text-slate-500 italic">No hay alertas críticas de inventario.</p>
              )}
            </div>
          </div>

          {/* Weekly Sales Chart */}
          <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-bold">Ventas de la Semana</h2>
              <div className="flex gap-2">
                <button className="text-xs bg-slate-50 px-3 py-1 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1">
                  <Download className="w-3 h-3" />
                  Exportar
                </button>
              </div>
            </div>
            <div className="flex items-end justify-between h-48 gap-4 pt-4">
              {weeklySales.map((item, idx) => {
                const maxTotal = Math.max(...weeklySales.map(d => d.total));
                const height = maxTotal > 0 ? `${(item.total / maxTotal) * 100}%` : '5%';
                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2">
                    <motion.div 
                      initial={{ height: 0 }}
                      animate={{ height }}
                      className={`w-full rounded-t-lg transition-all hover:bg-orange-400/60 ${item.day === 'HOY' ? 'bg-orange-500/40 border-2 border-orange-500/50' : 'bg-orange-500/20'}`} 
                    ></motion.div>
                    <span className={`text-[10px] font-medium text-slate-500`}>{item.day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Recent Orders Table */}
        <section className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <h2 className="text-lg font-bold">Pedidos Recientes</h2>
            <div className="flex gap-2">
              <button className="px-4 py-2 text-xs font-semibold rounded-lg text-orange-600 bg-orange-50">Todos</button>
              <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">Pendientes</button>
              <button className="px-4 py-2 text-xs font-semibold rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">En Camino</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">ID</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Monto</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Estado</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Pago</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {recentOrders.map((order, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-sm font-bold">{order.id}</td>
                    <td className="px-6 py-4 text-sm font-bold">${order.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 text-[10px] font-bold rounded-lg uppercase ${
                        order.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>{order.status}</span>
                    </td>
                    <td className="px-6 py-4 text-sm capitalize">{order.paymentMethod}</td>
                    <td className="px-6 py-4 text-sm">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-slate-400 hover:text-orange-500 transition-colors">
                        <MoreVertical className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="p-4 bg-slate-50 flex justify-center">
            <button className="text-xs font-bold text-orange-600 hover:underline uppercase tracking-widest flex items-center gap-1">
              Ver todos los pedidos
              <ChevronRight className="w-3 h-3" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Welcome message for other roles
  if (user.role === 'customer' || user.role === 'cliente') {
    return (
      <div className="font-display bg-[#f8f6f6] dark:bg-[#1a1c1e] text-slate-900 dark:text-slate-100 min-h-screen">
        <main className="max-w-7xl mx-auto pb-20 pt-8">
          <section className="p-4 lg:p-10">
            <div className="relative min-h-[520px] rounded-3xl overflow-hidden flex items-center justify-start p-8 lg:p-20">
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "linear-gradient(to right, rgba(26, 59, 91, 0.8) 0%, rgba(26, 59, 91, 0.2) 60%, rgba(26, 59, 91, 0) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiqKa-pG2AUir0S_KPqT0wNmI1l7oWuYZHREe1DXshdkDbD3P_UUdpai_hEtg8c0AcHQzBhXp-FXiectMMB6_zq6rNl-9SC_ji0wUyuZC_Y_biJz5CI-Y4rbjYCGMHXqs9PDdi1vJBULg6KR0q6Uf46uUwn3xLuf3YtFAqiaJ4bbmLf-aXcpomLsJEufuPU5Vqct64J1qg-5Jw4OzYiixOw5l5r09HJ9GHjpSFetP-fpaZSrvVLtK4jI6nfrOTuVzzqXZ9-Obk75yj')" }}>
              </div>
              <div className="relative z-10 max-w-xl text-white">
                <span className="inline-block px-3 py-1 bg-[#facc15] text-[#1a3b5b] text-xs font-bold rounded-full mb-4">BIENVENIDO DE VUELTA</span>
                <h1 className="text-4xl lg:text-6xl font-black mb-6 leading-tight">
                  Tu próximo detalle inolvidable te espera, {user.name.split(' ')[0]}
                </h1>
                <p className="text-lg text-white/90 mb-8 leading-relaxed">
                  Flores frescas seleccionadas a mano para transformar cualquier momento en un recuerdo eterno. Descubre nuestra colección de temporada.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/catalogo" className="px-8 py-4 bg-[#1a3b5b] text-white font-bold rounded-xl hover:bg-[#1a3b5b]/90 transition-all shadow-lg border border-white/10">
                    Ver catálogo
                  </Link>
                  <Link to="/catalogo" className="px-8 py-4 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all border border-white/30">
                    Personalizar ramo
                  </Link>
                </div>
              </div>
            </div>
          </section>
          
          <section className="px-4 lg:px-10 py-10">
            <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
              <Package className="text-[#1a3b5b]" /> Accesos Directos
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Link to="/mis-pedidos" className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 filter blur-[2px]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCawVT-5B_e0L-ouIC8qN1I4mCP8bdbedGw7cKEu8AhzGMRGHciGyxxcI2PAyKo5kNzwYsB85lW8gJeRgOqR1f8VROGvlqpW9YWQE1FK064J4dw9Yq4YWazpuL49sUXRG_MiRu8Nc5qarLEdWo1-U3BdWt9loEulnXw9vIquy0XGITKMILW7pwdKomvhA6l3HgyIxvsCpZTn0wAYgUlyf8jE9pQHITdhyIusiIfPShPSZ0CKIdDJjEAL8QZvfb6fFdUpsyi1tKY-qDk')" }}>
                </div>
                <div className="relative h-full flex flex-col justify-end p-8 text-white">
                  <Package className="text-[#facc15] mb-2 w-8 h-8" />
                  <h3 className="text-2xl font-bold">Historial de pedidos</h3>
                  <p className="text-white/70 text-sm">Revisa el estado de tus entregas y pedidos pasados</p>
                </div>
              </Link>
              <Link to="/mis-direcciones" className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer">
                <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 filter blur-[2px]" style={{ backgroundImage: "linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5SdB5oVCRnajVoX1GjQW73VFK1mXNxnXdkfuByUxnA5eZvySHmcNPiTD1dOXTmX824nJkMkYs1rFfpwqW3AlKXcmXmX6SHw75lxZRLCtSvtfuRhI79252NpqYIm1k-7_eGOjKJFfz5IvRd7NYK0nMTYqRB923Qw3tQK7V80NZ8w_9482fCXUhy7zUoomARrUWyA6xDmK9YBBQKnYAUigaTQJLh0OsO_YJXv3VMGrx1XQahGchsKv4pMELC69NwJ-XFFEGBd30usvi')" }}>
                </div>
                <div className="relative h-full flex flex-col justify-end p-8 text-white">
                  <MapPin className="text-[#facc15] mb-2 w-8 h-8" />
                  <h3 className="text-2xl font-bold">Gestión de direcciones</h3>
                  <p className="text-white/70 text-sm">Administra tus lugares de entrega frecuentes</p>
                </div>
              </Link>
            </div>
          </section>
          
          <section className="px-4 lg:px-10 py-10">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold flex items-center gap-2">
                <span className="text-[#1a3b5b]">🌿</span> Novedades de temporada
              </h2>
              <Link to="/catalogo" className="text-[#1a3b5b] font-bold text-sm flex items-center gap-1 hover:underline">
                Ver todas <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
                <div className="relative h-72 overflow-hidden">
                  <div className="absolute top-4 right-4 z-10">
                    <button className="bg-white/90 p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                      <Heart className="w-5 h-5" />
                    </button>
                  </div>
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuJRj-eKLvW5rq6oR6TuNxGrlar4ppFGyUu1ON5MGuNZCeHhxwumbxBRxa2bQwZzEnApQrRCk-o5W2rHZvzn18TYg2LF8slSqb352y7Psw-5-LAiw1Wd283iuaf0m24zYGVUClj3vEfuC32MutzUC1VwzpfFNJzFegJHgcB6lgQiuzdsRCG8INX6qZ-Agbp1-Nequ2rVYWNkLTxvyT0gczgSl-nWsy9H326JtCM5SF2IePhg3cUG7QRzjThGVuvK72p1IGhD2DDQQt" alt="Amanecer Primaveral" />
                  <div className="absolute bottom-0 left-0 bg-[#facc15] text-[#1a3b5b] px-4 py-1 font-bold text-xs">NOVEDAD</div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">Amanecer Primaveral</h4>
                    <span className="text-[#1a3b5b] font-bold">$45.00</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Mix de tulipanes, lirios y follaje verde intenso.</p>
                  <button className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-[#1a3b5b] dark:text-white font-bold rounded-xl group-hover:bg-[#1a3b5b] group-hover:text-white transition-all flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Añadir al carrito
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
                <div className="relative h-72 overflow-hidden">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy8yMEBwvCMwBWcpEeP4pLJ_QKbgx5rda_S5cA3zyzkaui1FjmNz-Z2y3qBYRxB9bO1NuvgD0Va3Bt__Y46df5fCz4eGuVeGrOdIWa3CQftiCM0hKSdOSMvPKzU7wfcXAXzbzOBknNFk_sX2mx36lH3Prd-PHJd7e4ACHDidI0_NoKA6cC1KsH56BRFwX7_TtQbJ-oORKM6kRycx-uVGhi3T6cgsiPnK_MAOseXpxAEVxGbBjdM2GOidhE3OT_HswHKOkBHOvd0Bht" alt="Elegancia Carmesí" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">Elegancia Carmesí</h4>
                    <span className="text-[#1a3b5b] font-bold">$62.00</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">12 Rosas rojas premium con tallo largo.</p>
                  <button className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-[#1a3b5b] dark:text-white font-bold rounded-xl group-hover:bg-[#1a3b5b] group-hover:text-white transition-all flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Añadir al carrito
                  </button>
                </div>
              </div>
              
              <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
                <div className="relative h-72 overflow-hidden">
                  <img className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-AYO9Mm4EgzL_xvSOa9Z5ktrYsFSKBLTMYzVM97F-zFTOnOsy2NbHlMryIkcuQFzekrk78Fss50kA-vD19WIcltw38Byxhvs-HyfqHgD9Fs2MuEUuV8RqYEhcNwb4vLWSwww397EY0WrNmn90wnYMTY94qTZKha__G0Sp7EyWGZYIt3IUK94CKxpRY55RD6gxojI1VLJQm8OyvUYakTZYMx5KbKeypDFkUAj5FRMfxXEyxiCVVkqbMADIwAGfbHy1WWQTR0TTRxsa" alt="Rayo de Sol" />
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-bold text-lg">Rayo de Sol</h4>
                    <span className="text-[#1a3b5b] font-bold">$38.00</span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Girasoles brillantes acompañados de margaritas blancas.</p>
                  <button className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-[#1a3b5b] dark:text-white font-bold rounded-xl group-hover:bg-[#1a3b5b] group-hover:text-white transition-all flex items-center justify-center gap-2">
                    <ShoppingCart className="w-4 h-4" /> Añadir al carrito
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    );
  }

  const getWelcomeMessage = () => {
    switch (user.role) {
      case 'staff':
      case 'empleado':
        return {
          title: "¡Bienvenido Empleado!",
          description: "Gestiona los pedidos y el inventario del día de hoy.",
          icon: <Briefcase className="w-16 h-16 text-emerald-600" />,
          bgColor: "bg-emerald-50",
          borderColor: "border-emerald-200"
        };
      case 'customer':
      case 'cliente':
        return {
          title: "¡Bienvenido Cliente!",
          description: "Explora nuestro catálogo y encuentra el arreglo perfecto.",
          icon: <UserCircle className="w-16 h-16 text-brand-coral" />,
          bgColor: "bg-brand-light",
          borderColor: "border-brand-coral/20"
        };
      default:
        return {
          title: `¡Bienvenido ${user.name}!`,
          description: "Gracias por visitarnos.",
          icon: <User className="w-16 h-16 text-gray-600" />,
          bgColor: "bg-gray-50",
          borderColor: "border-gray-200"
        };
    }
  };

  const welcome = getWelcomeMessage();

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className={`max-w-2xl w-full ${welcome.bgColor} border ${welcome.borderColor} rounded-3xl p-8 md:p-12 text-center shadow-xl`}
      >
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, type: "spring" }}
          >
            {welcome.icon}
          </motion.div>
        </div>
        
        <motion.h1 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-3xl md:text-5xl font-black text-brand-deep mb-4"
        >
          {welcome.title}
        </motion.h1>
        
        <motion.p 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-lg text-gray-600 mb-8"
        >
          {welcome.description}
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex flex-wrap justify-center gap-4"
        >
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Usuario</p>
            <p className="font-bold text-brand-deep">{user.name}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Correo</p>
            <p className="font-bold text-brand-deep">{user.email}</p>
          </div>
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-gray-100">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider mb-1">Rol de acceso</p>
            <p className="font-bold text-brand-deep capitalize">{user.role}</p>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
