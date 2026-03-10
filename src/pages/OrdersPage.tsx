import React from 'react';
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
  MoreVertical,
  Search
} from 'lucide-react';
import { Link } from 'react-router-dom';

export default function OrdersPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h3 className="text-3xl font-black tracking-tight text-slate-900">Listado de Pedidos</h3>
          <p className="text-slate-500 mt-1">Enfoque analítico y gestión masiva de entregas</p>
        </div>
        <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white border border-slate-200 text-sm font-bold hover:bg-slate-50 transition-colors shadow-sm">
          <Download className="w-4 h-4" />
          Exportar CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <Calendar className="w-16 h-16 text-[#1a3b5b]" />
          </div>
          <p className="text-sm font-medium text-slate-500">Pedidos de hoy</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-black">42</span>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              +15% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-[#1a3b5b] h-full rounded-full w-[65%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <Clock className="w-16 h-16 text-amber-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">Pendientes</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-black">12</span>
            <span className="text-rose-500 text-sm font-bold flex items-center gap-1">
              -5% <TrendingDown className="w-3 h-3" />
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-amber-500 h-full rounded-full w-[30%]"></div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 transition-opacity group-hover:opacity-20">
            <Truck className="w-16 h-16 text-emerald-500" />
          </div>
          <p className="text-sm font-medium text-slate-500">En ruta</p>
          <div className="flex items-baseline gap-3 mt-2">
            <span className="text-4xl font-black">08</span>
            <span className="text-emerald-500 text-sm font-bold flex items-center gap-1">
              +2% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full mt-4">
            <div className="bg-emerald-500 h-full rounded-full w-[20%]"></div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-sm">
        <div className="flex-1 min-w-[200px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID, cliente o producto..." 
            className="w-full pl-10 pr-4 py-2 rounded-lg border-slate-200 text-sm focus:ring-[#1a3b5b] focus:border-[#1a3b5b]"
          />
        </div>
        <div className="flex flex-wrap gap-2">
          <button className="px-4 py-2 rounded-lg bg-[#1a3b5b] text-white text-sm font-bold flex items-center gap-2">
            Todos
            <ChevronDown className="w-4 h-4" />
          </button>
          {['Pendientes', 'En Preparación', 'En Ruta', 'Entregados'].map((status) => (
            <button key={status} className="px-4 py-2 rounded-lg bg-slate-100 text-slate-600 text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors">
              {status}
              <ChevronDown className="w-4 h-4" />
            </button>
          ))}
        </div>
        <div className="ml-auto border-l border-slate-200 pl-3 flex items-center gap-2">
          <button className="p-2 text-slate-500 hover:text-[#1a3b5b] transition-colors">
            <Filter className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-500 hover:text-[#1a3b5b] transition-colors">
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
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Producto/Arreglo</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha Entrega</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Total</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {[
                { id: '#FB-2904', client: 'Lucía Méndez', phone: '+52 555 123 4567', prod: 'Ramo de 24 Rosas Rojas Premium', date: '24 May, 15:00', total: '$1,250.00', status: 'Entregado', color: 'bg-emerald-100 text-emerald-700' },
                { id: '#FB-2905', client: 'Roberto Gómez', phone: '+52 555 987 6543', prod: 'Arreglo Floral "Primavera Eterna"', date: 'Hoy, 18:30', total: '$890.00', status: 'En Preparación', color: 'bg-blue-100 text-blue-700' },
                { id: '#FB-2906', client: 'María José Ruiz', phone: '+52 555 444 3322', prod: 'Caja de Orquídeas Blancas', date: 'Programado', total: '$2,100.00', status: 'Pendiente', color: 'bg-amber-100 text-amber-700' },
                { id: '#FB-2907', client: 'Carlos Slim Jr.', phone: '+52 555 000 0001', prod: 'Ramo 50 Rosas Blancas Especial', date: 'En camino', total: '$3,400.00', status: 'En Ruta', color: 'bg-indigo-100 text-indigo-700' },
              ].map((order, idx) => (
                <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-4">
                    <input type="checkbox" className="rounded border-slate-300 text-[#1a3b5b] focus:ring-[#1a3b5b]" />
                  </td>
                  <td className="p-4 font-bold text-slate-900">{order.id}</td>
                  <td className="p-4">
                    <div className="flex flex-col">
                      <span className="font-semibold">{order.client}</span>
                      <span className="text-xs text-slate-500">{order.phone}</span>
                    </div>
                  </td>
                  <td className="p-4 text-sm">{order.prod}</td>
                  <td className="p-4 text-sm">
                    <div className="flex items-center gap-1.5">
                      <Calendar className="w-4 h-4 text-slate-400" />
                      {order.date}
                    </div>
                  </td>
                  <td className="p-4 font-bold text-[#1a3b5b]">{order.total}</td>
                  <td className="p-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${order.color}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Link to={`/admin/pedidos/${order.id.replace('#', '')}`} className="p-2 text-slate-400 hover:text-[#1a3b5b] transition-colors">
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Pagination */}
        <div className="px-4 py-4 border-t border-slate-200 flex items-center justify-between">
          <p className="text-sm text-slate-500">Mostrando <span className="font-bold">1</span> a <span className="font-bold">10</span> de <span className="font-bold">42</span> pedidos</p>
          <div className="flex gap-2">
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 disabled:opacity-50 transition-colors" disabled>
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button className="w-10 h-10 rounded-lg bg-[#1a3b5b] text-white font-bold">1</button>
            <button className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors font-bold text-slate-600">2</button>
            <button className="w-10 h-10 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors font-bold text-slate-600">3</button>
            <button className="p-2 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <footer className="text-center py-8 border-t border-slate-200">
        <p className="text-xs text-slate-400">© 2024 Florería Bautista - Sistema de Gestión Administrativa v3.0</p>
      </footer>
    </div>
  );
}

function ChevronDown(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  )
}
