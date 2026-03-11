import React, { useState, useEffect, useMemo } from 'react';
import { 
  Calendar, 
  Clock, 
  Truck, 
  TrendingUp, 
  TrendingDown, 
  Filter, 
  RefreshCw, 
  Eye, 
  Edit3, 
  Trash2, 
  ChevronLeft, 
  ChevronRight,
  Download,
  Search,
  Package
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../services/dataService';

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  // Filter and Pagination State
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const allOrders = DataService.getOrders();
        const allUsers = DataService.getUsers();
        const dashboardStats = DataService.getDashboardStats();
        setOrders(allOrders);
        setUsers(allUsers);
        setStats(dashboardStats);
      } catch (error) {
        console.error("Error loading orders data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper to get customer name
  const getCustomerName = (customerId: string) => {
    const user = users.find(u => u.id === customerId);
    return user ? user.name : 'Cliente Desconocido';
  };

  // Filtered and Paginated Orders
  const filteredOrders = useMemo(() => {
    return orders.filter(order => {
      const customerName = getCustomerName(order.customerId);
      const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            order.id.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'Todos' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchTerm, statusFilter, users]);

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Entregado': return 'bg-emerald-100 text-emerald-700';
      case 'Pendiente': return 'bg-amber-100 text-amber-700';
      case 'En Ruta': return 'bg-blue-100 text-blue-700';
      case 'Cancelado': return 'bg-rose-100 text-rose-700';
      case 'En Preparación': return 'bg-indigo-100 text-indigo-700';
      default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tight text-slate-900">Listado de Pedidos</h3>
          <p className="text-slate-500 mt-1">Gestión centralizada de ventas y entregas</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <Package className="w-16 h-16 text-[#1a3b5b]" />
          </div>
          <p className="text-sm font-medium text-slate-500">Total Pedidos</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-black">{orders.length}</span>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              +15% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-[#1a3b5b] h-full rounded-full w-[100%]"></div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <Clock className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">Pendientes</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-black">
              {orders.filter(o => o.status === 'Pendiente').length}
            </span>
            <span className="text-rose-500 text-sm font-bold flex items-center gap-1">
              -5% <TrendingDown className="w-3 h-3" />
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-amber-500 h-full rounded-full w-[30%]"></div>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group"
        >
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <Truck className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">Entregados</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-black">
              {orders.filter(o => o.status === 'Entregado').length}
            </span>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              +2% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-emerald-500 h-full rounded-full w-[80%]"></div>
          </div>
        </motion.div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID o cliente..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 text-sm focus:ring-[#1a3b5b] focus:border-[#1a3b5b]"
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <select 
            className="px-4 py-2 rounded-lg bg-[#1a3b5b] text-white text-sm font-bold border-none focus:ring-0"
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
          >
            <option value="Todos">Todos los estados</option>
            <option value="Pendiente">Pendientes</option>
            <option value="En Preparación">En Preparación</option>
            <option value="En Ruta">En Ruta</option>
            <option value="Entregado">Entregados</option>
            <option value="Cancelado">Cancelados</option>
          </select>
        </div>
        <div className="ml-auto border-l border-slate-200 pl-3 flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-[#1a3b5b] transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button 
            onClick={() => { setSearchTerm(''); setStatusFilter('Todos'); setCurrentPage(1); }}
            className="p-2 text-slate-500 hover:text-[#1a3b5b] transition-colors"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="p-4 w-12 text-xs font-bold text-slate-400 uppercase tracking-wider">
                  <input type="checkbox" className="rounded border-slate-300 text-[#1a3b5b] focus:ring-[#1a3b5b]" />
                </th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID Pedido</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Productos</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              <AnimatePresence mode="popLayout">
                {paginatedOrders.map((order) => (
                  <motion.tr 
                    layout
                    key={order.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50/50 transition-colors"
                  >
                    <td className="p-4">
                      <input type="checkbox" className="rounded border-slate-300 text-[#1a3b5b] focus:ring-[#1a3b5b]" />
                    </td>
                    <td className="p-4 font-bold text-slate-900">{order.id}</td>
                    <td className="p-4">
                      <div className="flex flex-col">
                        <span className="font-semibold">{getCustomerName(order.customerId)}</span>
                        <span className="text-xs text-slate-500">{order.paymentMethod}</span>
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex flex-col gap-0.5">
                        {order.items.map((item: any, i: number) => (
                          <span key={i} className="text-xs text-slate-600">
                            {item.quantity}x {item.productName}
                          </span>
                        ))}
                      </div>
                    </td>
                    <td className="p-4 text-sm">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-slate-400" />
                        {new Date(order.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="p-4 font-bold text-[#1a3b5b]">${(order.total || 0).toLocaleString()}</td>
                    <td className="p-4">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${getStatusColor(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex justify-end gap-1">
                        <Link to={`/admin/pedidos/${order.id}`} className="p-2 text-slate-400 hover:text-[#1a3b5b] transition-colors">
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button className="p-2 text-slate-400 hover:text-[#1a3b5b] transition-colors">
                          <Edit3 className="w-5 h-5" />
                        </button>
                        <button className="p-2 text-slate-400 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-5 h-5" />
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
        <div className="px-4 py-4 border-t border-slate-200 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Mostrando <span className="font-bold">{(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, filteredOrders.length)}</span> de <span className="font-bold">{filteredOrders.length}</span> pedidos
          </p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button 
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-10 h-10 rounded-lg font-bold transition-all ${
                  currentPage === page 
                    ? 'bg-[#1a3b5b] text-white shadow-lg' 
                    : 'border border-slate-200 hover:bg-slate-100 text-slate-600'
                }`}
              >
                {page}
              </button>
            ))}

            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center py-8 border-t border-slate-200">
        <p className="text-xs text-slate-400">© 2026 Florería Bautista - Sistema de Gestión Administrativa v4.0</p>
      </footer>
    </div>
  );
}
