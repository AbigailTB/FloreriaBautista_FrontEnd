import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Package, 
  Truck, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  CreditCard, 
  Edit3, 
  Printer,
  Navigation,
  Check,
  Brush,
  X,
  Plus,
  Minus,
  Trash2,
  ExternalLink,
  History,
  ShoppingBag,
  Wallet
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../../services/dataService';

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showStatusModal, setShowStatusModal] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const orderData = DataService.getOrderById(id || '');
        if (orderData) {
          setOrder(orderData);
          const userData = DataService.getUsers().find(u => u.id === orderData.customerId);
          setUser(userData);
        }
      } catch (error) {
        console.error("Error loading order detail:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  if (loading) return <div className="flex items-center justify-center h-96"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1a3b5b]"></div></div>;
  if (!order) return <div className="text-center py-20"><h2 className="text-2xl font-bold text-slate-400">Pedido no encontrado</h2></div>;

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'pending': return 'bg-amber-100 text-amber-700 border-amber-200';
      case 'shipped': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelled': return 'bg-rose-100 text-rose-700 border-rose-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'delivered': return 'Entregado';
      case 'pending': return 'Pendiente';
      case 'shipped': return 'En Ruta';
      case 'cancelled': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-[1100px] mx-auto space-y-6"
    >
      {/* Header Section */}
      <div className="flex flex-wrap justify-between items-start gap-4 p-6 bg-white rounded-xl shadow-sm border border-slate-200">
        <div className="flex min-w-72 flex-col gap-2">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="p-2 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft className="w-6 h-6 text-slate-600" />
            </button>
            <h1 className="text-[#1a3b5b] text-4xl font-black leading-tight tracking-tight">Pedido #{order.id}</h1>
            <span className={`${getStatusStyle(order.status)} px-3 py-1 rounded-full text-sm font-bold border`}>
              {getStatusLabel(order.status)}
            </span>
          </div>
          <p className="text-slate-500 text-base font-normal">Actualizado hace 15 minutos</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowStatusModal(true)}
            className="flex items-center justify-center rounded-xl px-6 py-3 bg-slate-100 text-[#1a3b5b] text-base font-bold transition-colors hover:bg-slate-200"
          >
            <Edit3 className="w-5 h-5 mr-2" />
            Cambiar estado
          </button>
          <button className="flex items-center justify-center rounded-xl px-6 py-3 bg-[#1a3b5b] text-white text-base font-bold shadow-lg shadow-[#1a3b5b]/20 transition-transform active:scale-95">
            <Wallet className="w-5 h-5 mr-2" />
            Registrar pago
          </button>
        </div>
      </div>

      {/* Grid Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Client Info Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#1a3b5b]">
            <User className="w-5 h-5" />
            <h3 className="font-bold text-lg">Cliente</h3>
          </div>
          <div className="space-y-2">
            <p className="text-slate-900 font-semibold text-base">{user?.name || 'Cliente Desconocido'}</p>
            <div className="flex items-center gap-2 text-slate-600">
              <Phone className="w-4 h-4" />
              <span className="text-sm">{user?.phone || 'No disponible'}</span>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Mail className="w-4 h-4" />
              <span className="text-sm">{user?.email || 'No disponible'}</span>
            </div>
          </div>
        </div>

        {/* Arrangement Info Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#1a3b5b]">
            <ShoppingBag className="w-5 h-5" />
            <h3 className="font-bold text-lg">Arreglo</h3>
          </div>
          <div className="space-y-2">
            <p className="text-slate-900 font-semibold text-base">{order.items[0]?.productName || 'Producto'}</p>
            <p className="text-slate-600 text-sm">Base de cerámica blanca, listón dorado satinado.</p>
            <div className="bg-slate-50 p-2 rounded-lg mt-2">
              <p className="text-xs font-bold text-[#1a3b5b] uppercase tracking-wider">Mensaje:</p>
              <p className="text-sm italic text-slate-700">"Feliz aniversario, por muchos años más."</p>
            </div>
          </div>
        </div>

        {/* Logistics Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#1a3b5b]">
            <Navigation className="w-5 h-5" />
            <h3 className="font-bold text-lg">Logística</h3>
          </div>
          <div className="space-y-2">
            <div className="flex items-start gap-2 text-slate-600">
              <MapPin className="w-4 h-4 mt-1 shrink-0" />
              <p className="text-sm">Calle Floral 123, Col. Polanco, CDMX, 11560</p>
            </div>
            <div className="flex items-center gap-2 text-slate-600">
              <Clock className="w-4 h-4 shrink-0" />
              <p className="text-sm">Entrega: Hoy, 4:00 PM - 6:00 PM</p>
            </div>
            <button className="mt-2 text-[#1a3b5b] font-bold text-sm flex items-center gap-1 hover:underline">
              Ver en mapa <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>

        {/* Payment Control Card */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-4">
          <div className="flex items-center gap-3 text-[#1a3b5b]">
            <Wallet className="w-5 h-5" />
            <h3 className="font-bold text-lg">Control de Pago</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-500 text-sm">Total:</span>
              <span className="text-xl font-black text-slate-900">${order.total.toLocaleString()}</span>
            </div>
            <div className={`flex justify-between items-center p-2 rounded-lg ${order.paymentStatus === 'paid' ? 'bg-emerald-50 text-emerald-700' : 'bg-amber-50 text-amber-700'}`}>
              <span className="text-xs font-bold uppercase tracking-wider">Estado:</span>
              <span className="text-sm font-bold">{order.paymentStatus === 'paid' ? 'Pagado' : 'Pendiente'}</span>
            </div>
            <p className="text-xs text-slate-500">Método: {order.paymentMethod}</p>
          </div>
        </div>
      </div>

      {/* Timeline Section */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
        <h2 className="text-[#1a3b5b] text-[22px] font-bold leading-tight tracking-tight pb-6">Línea de Tiempo del Pedido</h2>
        <div className="relative space-y-0">
          {/* Timeline Item 1 */}
          <div className="grid grid-cols-[40px_1fr] gap-x-4">
            <div className="flex flex-col items-center">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-green-500 text-white shadow-sm">
                <Check className="w-4 h-4" />
              </div>
              <div className="w-[2px] bg-slate-200 h-12"></div>
            </div>
            <div className="pb-6">
              <p className="text-slate-900 text-base font-bold">Pedido Recibido</p>
              <p className="text-slate-500 text-sm">10 Oct, 09:00 AM • Sistema Automático</p>
            </div>
          </div>
          {/* Timeline Item 2 */}
          <div className="grid grid-cols-[40px_1fr] gap-x-4">
            <div className="flex flex-col items-center">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-600">
                <Clock className="w-4 h-4" />
              </div>
              <div className="w-[2px] bg-slate-200 h-12"></div>
            </div>
            <div className="pb-6">
              <p className="text-slate-900 text-base font-bold">En Preparación</p>
              <p className="text-slate-500 text-sm">10 Oct, 11:15 AM • Asignado a: Florista Ana</p>
            </div>
          </div>
          {/* Timeline Item 3 (Current) */}
          <div className="grid grid-cols-[40px_1fr] gap-x-4">
            <div className="flex flex-col items-center">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#1a3b5b] text-white ring-4 ring-[#1a3b5b]/20">
                <Brush className="w-4 h-4" />
              </div>
              <div className="w-[2px] bg-slate-200 h-12 opacity-50"></div>
            </div>
            <div className="pb-6">
              <p className="text-[#1a3b5b] text-base font-black">Estado Actual: Diseño & Armado</p>
              <p className="text-slate-500 text-sm">Actualizado hace 15 min</p>
            </div>
          </div>
          {/* Timeline Item 4 (Future) */}
          <div className="grid grid-cols-[40px_1fr] gap-x-4">
            <div className="flex flex-col items-center">
              <div className="z-10 flex h-8 w-8 items-center justify-center rounded-full border-2 border-slate-200 bg-white text-slate-300">
                <Truck className="w-4 h-4" />
              </div>
            </div>
            <div className="pb-4">
              <p className="text-slate-400 text-base font-medium">Pendiente de Envío</p>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL: Cambiar Estado */}
      <AnimatePresence>
        {showStatusModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowStatusModal(false)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200"
            >
              <div className="flex items-center justify-between p-6 border-b border-slate-100">
                <h3 className="text-xl font-black text-[#1a3b5b]">Actualizar Estado del Pedido</h3>
                <button onClick={() => setShowStatusModal(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-6 h-6" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                {/* Status Selector */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Nuevo Estado</label>
                  <div className="grid grid-cols-1 gap-2">
                    <button className="flex items-center justify-between px-4 py-3 border-2 border-[#1a3b5b] bg-[#1a3b5b]/5 rounded-xl text-[#1a3b5b] font-bold">
                      <div className="flex items-center gap-3">
                        <CheckCircle2 className="w-5 h-5" />
                        <span>Preparación Completada</span>
                      </div>
                      <CheckCircle2 className="w-5 h-5 text-[#1a3b5b]" />
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 border-2 border-slate-100 rounded-xl text-slate-600 font-medium hover:border-[#1a3b5b]/30">
                      <Truck className="w-5 h-5" />
                      <span>En Ruta de Entrega</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 border-2 border-slate-100 rounded-xl text-slate-600 font-medium hover:border-[#1a3b5b]/30">
                      <CheckCircle2 className="w-5 h-5" />
                      <span>Entregado con Éxito</span>
                    </button>
                    <button className="flex items-center gap-3 px-4 py-3 border-2 border-slate-100 rounded-xl text-red-500 font-medium hover:border-red-200">
                      <X className="w-5 h-5" />
                      <span>Problema con el Pedido</span>
                    </button>
                  </div>
                </div>
                {/* Comment Field */}
                <div className="space-y-3">
                  <label className="block text-sm font-bold text-slate-700">Comentarios / Observaciones</label>
                  <textarea className="w-full rounded-xl border-slate-200 focus:border-[#1a3b5b] focus:ring-[#1a3b5b] text-sm p-4" placeholder="Ej: El arreglo está listo para que el repartidor lo recoja..." rows={3}></textarea>
                </div>
              </div>
              <div className="flex items-center justify-end gap-3 p-6 bg-slate-50">
                <button onClick={() => setShowStatusModal(false)} className="px-6 py-2 rounded-xl text-slate-600 font-bold hover:bg-slate-100">
                  Cancelar
                </button>
                <button className="px-8 py-2 bg-[#1a3b5b] text-white rounded-xl font-bold shadow-lg shadow-[#1a3b5b]/20 hover:bg-[#1a3b5b]/90">
                  Guardar Cambios
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
