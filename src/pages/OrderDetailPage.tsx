import React from 'react';
import { 
  ChevronRight, 
  Printer, 
  Edit, 
  CheckCircle, 
  User, 
  Phone, 
  MapPin, 
  FileText, 
  Download, 
  Eye, 
  History, 
  FolderOpen, 
  Clock, 
  Truck, 
  PartyPopper,
  Sparkles,
  Check,
  X
} from 'lucide-react';
import { useParams } from 'react-router-dom';
import { DataService } from '../services/dataService';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = React.useState<any>(null);
  const [user, setUser] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (id) {
      const orderData = DataService.getOrderById(id);
      setOrder(orderData);
      if (orderData) {
        const users = DataService.getUsers();
        setUser(users.find(u => u.id === orderData.customerId));
      }
      setLoading(false);
    }
  }, [id]);

  if (loading) return <div>Cargando...</div>;
  if (!order) return <div>Pedido no encontrado</div>;

  return (
    <div className="max-w-[1440px] mx-auto space-y-6 animate-in fade-in duration-500">
      {/* Breadcrumbs & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1">
            <span className="hover:text-[#1a3b5b] cursor-pointer">Admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="hover:text-[#1a3b5b] cursor-pointer">Pedidos</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">#{order.id}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Pedido #{order.id}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">{order.status}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Printer className="w-4 h-4" /> Factura
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50">
            <Edit className="w-4 h-4" /> Editar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1a3b5b] text-white rounded-lg text-sm font-bold hover:bg-[#1a3b5b]/90 shadow-sm shadow-[#1a3b5b]/20">
            <CheckCircle className="w-4 h-4" /> Finalizar
          </button>
        </div>
      </div>

      {/* Metas / KPI Bar */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total del Pedido</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">${(order.total || 0).toLocaleString()}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Artículos</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{order.items.reduce((acc: number, item: any) => acc + item.quantity, 0)}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Fecha</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1a3b5b]">{new Date(order.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Estado Pago</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">{order.paymentStatus}</span>
          </div>
        </div>
      </div>

      {/* Main Info Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Col 1: Cliente & Entrega */}
        <div className="space-y-6">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              <h3 className="text-sm font-bold text-slate-800">Información del Cliente</h3>
            </div>
            <div className="p-6 space-y-6">
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <User className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">NOMBRE COMPLETO</p>
                  <p className="text-base font-bold text-[#1a3b5b]">{user?.name || 'Cliente Desconocido'}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TELÉFONO</p>
                  <p className="text-base font-bold text-[#1a3b5b]">{user?.phone || 'No disponible'}</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Col 2: Productos & Stock */}
        <div className="lg:col-span-1">
          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-4 py-3 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#1a3b5b]" /> Desglose de Productos
              </h3>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50">
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase">Item</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-center">Cant.</th>
                    <th className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase text-right">Precio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {order.items.map((item: any, idx: number) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="text-xs font-bold">Producto ID: {item.productId}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-center font-medium">{item.quantity}</td>
                      <td className="px-4 py-3 text-xs text-right font-bold">${(item.price || 0).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr className="bg-[#1a3b5b]/10">
                    <td className="px-4 py-3 text-right text-sm font-black text-[#1a3b5b]" colSpan={2}>TOTAL:</td>
                    <td className="px-4 py-3 text-right text-sm font-black text-[#1a3b5b]">${(order.total || 0).toLocaleString()}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
