import React from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  DollarSign, 
  ShoppingBag, 
  UserPlus, 
  Package,
  Download,
  FileText,
  Filter,
  ChevronDown,
  Minus
} from 'lucide-react';

export default function ReportsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Reportes Analíticos</h1>
          <p className="text-sm text-slate-500">Última actualización: Hoy, 09:42 AM</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold hover:bg-slate-50 transition-all">
            <FileText className="w-4 h-4 text-red-500" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#607AFB] text-white rounded-xl text-sm font-bold hover:bg-[#607AFB]/90 shadow-lg shadow-[#607AFB]/20 transition-all">
            <Download className="w-4 h-4" />
            Exportar Excel
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium">
          <span>Periodo: </span>
          <span className="font-bold">Este Mes</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium">
          <span>Sucursal: </span>
          <span className="font-bold">Todas</span>
          <ChevronDown className="w-4 h-4" />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-slate-200 text-sm font-medium">
          <Filter className="w-4 h-4" />
          Más Filtros
        </button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
              <DollarSign className="w-5 h-5" />
            </div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
              +12.5% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Ventas Totales</p>
          <h3 className="text-2xl font-bold mt-1">$45,230.00</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-amber-50 rounded-lg text-amber-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <span className="text-emerald-500 text-xs font-bold flex items-center gap-1">
              +5.2% <TrendingUp className="w-3 h-3" />
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Pedidos</p>
          <h3 className="text-2xl font-bold mt-1">1,248</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-purple-50 rounded-lg text-purple-600">
              <UserPlus className="w-5 h-5" />
            </div>
            <span className="text-slate-500 text-xs font-bold flex items-center gap-1">
              0.0% <Minus className="w-3 h-3" />
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Nuevos Clientes</p>
          <h3 className="text-2xl font-bold mt-1">84</h3>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2 bg-rose-50 rounded-lg text-rose-600">
              <Package className="w-5 h-5" />
            </div>
            <span className="text-rose-500 text-xs font-bold flex items-center gap-1">
              -2.1% <TrendingDown className="w-3 h-3" />
            </span>
          </div>
          <p className="text-slate-500 text-xs font-medium uppercase tracking-wider">Valor de Inventario</p>
          <h3 className="text-2xl font-bold mt-1">$12,850.00</h3>
        </div>
      </div>

      {/* Visual Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trends */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-6">
          <div className="flex justify-between items-center mb-6">
            <h4 className="text-lg font-bold">Tendencias de Venta</h4>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-[#607AFB]"></span>
                <span className="text-xs font-medium text-slate-500">Ventas</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="size-2 rounded-full bg-amber-400"></span>
                <span className="text-xs font-medium text-slate-500">Gastos</span>
              </div>
            </div>
          </div>
          <div className="relative h-[280px] w-full border-b border-l border-slate-100">
            <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 40">
              <path d="M0 35 Q 10 32, 20 25 T 40 15 T 60 10 T 80 20 T 100 5" fill="none" stroke="#607AFB" strokeWidth="2"></path>
              <path className="fill-[#607AFB]/5" d="M0 35 Q 10 32, 20 25 T 40 15 T 60 10 T 80 20 T 100 5 L 100 40 L 0 40 Z"></path>
              <path d="M0 38 Q 20 35, 40 30 T 70 25 T 100 28" fill="none" stroke="#FFD700" strokeDasharray="2" strokeWidth="2"></path>
            </svg>
            <div className="absolute bottom-[-24px] w-full flex justify-between text-[10px] text-slate-400 font-bold uppercase">
              <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
            </div>
          </div>
        </div>

        {/* Channel Distribution */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col">
          <h4 className="text-lg font-bold mb-6">Canales de Venta</h4>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative size-48 rounded-full border-[16px] border-slate-100 flex items-center justify-center">
              <div className="absolute inset-0 rounded-full border-[16px] border-[#607AFB] border-r-transparent border-b-transparent"></div>
              <div className="absolute inset-0 rounded-full border-[16px] border-amber-400 border-t-transparent border-l-transparent rotate-45"></div>
              <div className="text-center">
                <p className="text-2xl font-black">1,248</p>
                <p className="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Total</p>
              </div>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4 w-full">
              <div className="flex items-center gap-2">
                <span className="size-3 rounded bg-[#607AFB]"></span>
                <span className="text-xs font-medium">Tienda Física (65%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded bg-amber-400"></span>
                <span className="text-xs font-medium">E-commerce (25%)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="size-3 rounded bg-slate-300"></span>
                <span className="text-xs font-medium">WhatsApp (10%)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Top Performers */}
      <div className="bg-white rounded-2xl border border-slate-200 p-6">
        <h4 className="text-lg font-bold mb-6">Productos Más Vendidos</h4>
        <div className="space-y-6">
          {[
            { name: 'Rosas Rojas Premium (Docena)', sales: 428, color: 'bg-[#607AFB]', width: '85%' },
            { name: 'Arreglo Girasoles "Sol de Verano"', sales: 312, color: 'bg-amber-400', width: '62%' },
            { name: 'Orquídea Blanca Imperial', sales: 195, color: 'bg-[#607AFB]/70', width: '40%' },
            { name: 'Caja de Tulipanes Mixtos', sales: 156, color: 'bg-amber-400/70', width: '32%' },
          ].map((item, idx) => (
            <div key={idx} className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="font-medium">{item.name}</span>
                <span className="font-bold">{item.sales} ventas</span>
              </div>
              <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                <div className={`${item.color} h-full rounded-full`} style={{ width: item.width }}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tables Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Analysis Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
            <h4 className="text-lg font-bold">Top Clientes</h4>
            <button className="text-[#607AFB] text-sm font-bold hover:underline">Ver todos</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Cliente</th>
                  <th className="px-6 py-3">Última Compra</th>
                  <th className="px-6 py-3">Monto Total</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Maria Garcia', email: 'maria.g@email.com', last: 'Hace 2 días', total: '$2,450.00', status: 'VIP', statusColor: 'bg-emerald-100 text-emerald-600', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCchIoxq4-_441MuNQx5dLnGrnETznTaw3YJk5XPgfhAZL1_Y8ppNliu5tT-kjy3rwLGHQVSKI5fBdrq_XqdWSRvHm_H7oZRhdz8PSNx0v95-oGWtCBwCH01WQK6JhV0ur1GNEbq7YydNJgvDjWcLxFEV4ZXlrGZIxR0IAAHVifmLEC9jPSLw0UwSTl6oJ95FNOnVfFv4haQ-jExYRhPiOgpO5xuj2iTmfGLNgnh6x6tiaaBNVgn2lf2NlBujXBe25Lz9U6bWcf_Yn6' },
                  { name: 'Juan Perez', email: 'j.perez@email.com', last: 'Hace 1 semana', total: '$1,820.00', status: 'Fiel', statusColor: 'bg-blue-100 text-blue-600', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDYJRBg-KVbmA8Y3MGRMcWEp2vwblCF2zuU7KGV8EtFPzcdQWjruYlhPblXDfqx2HVNwVOZBWuSp77WK99UOl7DOoEi6WNKS3BpVCKCf88_LwY5PNEq8mH4Y8EcqVcaEK7TBcCukysWBmpkZthqkAhjBPWvFk6yY88nlgCLJtV0XcbLknzcF0DgdVWGAu1dXtEV2FE9WlvTozibMns-n5Pqecoswknul_gBlvVlVRe3f-VvLMYwiryu0OPC6Ng0K5bWxXfaUt6v9YaB' },
                  { name: 'Luisa Mendez', email: 'luisa.m@email.com', last: 'Hace 3 horas', total: '$950.00', status: 'Regular', statusColor: 'bg-slate-100 text-slate-500', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBgm_UsJdsYDkC9Z34dfYGSu3-z7KfsJzDvxwaZwOC-mKYDRpwh7OquAMfR7V21R8D3NgeIV4a1pCerdjS5RoDSq4HpJbiCRJs1qEW9oD6JrOmqEzxO5EpMarr9bfXc_Poxv8G_5fqWpu2rr_r57IjVaqwQT4yZ0sWjdNuZgOy3Jxiw-bzDQdDGOAPl23jhIQX0OT5wV9wXDnzxVhnN7x-85Y6ZnIMZkl8lDwdikLiJTvoIv_nklWAannEzbKHIqtFkLS3RBw4Zx04c' },
                ].map((client, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img src={client.img} alt={client.name} className="size-8 rounded-full object-cover" />
                      <div>
                        <p className="text-sm font-bold">{client.name}</p>
                        <p className="text-[11px] text-slate-500">{client.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-slate-600">{client.last}</td>
                    <td className="px-6 py-4 text-sm font-black">{client.total}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full ${client.statusColor} text-[10px] font-bold`}>{client.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Operational / Inventory Table */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm">
          <div className="px-6 py-4 border-b border-slate-100">
            <h4 className="text-lg font-bold">Status de Inventario Crítico</h4>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-500 text-[11px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3">Insumo / Flor</th>
                  <th className="px-6 py-3">Stock Actual</th>
                  <th className="px-6 py-3">Stock Mínimo</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Acción</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {[
                  { name: 'Rosas Rojas (Unidades)', current: 45, min: 100, status: 'Critico', color: 'text-rose-500', dot: 'bg-rose-500 animate-pulse' },
                  { name: 'Espuma Floral (Ladrillos)', current: 12, min: 20, status: 'Bajo', color: 'text-amber-500', dot: 'bg-amber-500' },
                  { name: 'Lazos de Seda (Metros)', current: 850, min: 200, status: 'Óptimo', color: 'text-emerald-500', dot: 'bg-emerald-500' },
                ].map((item, idx) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-sm font-bold">{item.name}</td>
                    <td className="px-6 py-4 text-sm">{item.current}</td>
                    <td className="px-6 py-4 text-sm">{item.min}</td>
                    <td className="px-6 py-4">
                      <span className={`flex items-center gap-1.5 ${item.color} text-xs font-bold`}>
                        <span className={`size-2 rounded-full ${item.dot}`}></span>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      {item.status !== 'Óptimo' ? (
                        <button className="text-[#607AFB] text-xs font-bold bg-[#607AFB]/5 px-3 py-1 rounded-lg border border-[#607AFB]/20">Reabastecer</button>
                      ) : (
                        <span className="text-slate-400 text-xs font-bold">Actualizado</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
