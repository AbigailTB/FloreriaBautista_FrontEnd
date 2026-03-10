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

export default function OrderDetailPage() {
  const { id } = useParams();

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
            <span className="text-slate-900">#{id || 'FB-8902'}</span>
          </nav>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight">Pedido #{id || 'FB-8902'}</h1>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-orange-100 text-orange-700 border border-orange-200">En Preparación</span>
            <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-red-100 text-red-700 border border-red-200">Alta Prioridad</span>
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
            <span className="text-2xl font-black text-slate-900">$1,250.00</span>
            <span className="text-xs font-bold text-emerald-500">+5.2% vs prom.</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Artículos</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">12</span>
            <span className="text-xs font-bold text-slate-400">3 categorías</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Tiempo Restante</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-[#1a3b5b]">04:20h</span>
            <span className="text-xs font-bold text-slate-400">Entrega HOY</span>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
          <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Margen Neto</p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-black text-slate-900">35%</span>
            <span className="text-xs font-bold text-rose-500">-2% (Insumos)</span>
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
                  <p className="text-base font-bold text-[#1a3b5b]">Bautista Rodríguez</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="size-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <Phone className="w-8 h-8 text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">TELÉFONO</p>
                  <p className="text-base font-bold text-[#1a3b5b]">+52 555 123 4567</p>
                </div>
              </div>
              <div className="pt-4 border-t border-slate-100">
                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Dirección de Entrega</p>
                <p className="text-xs text-slate-600 mb-3">Av. Insurgentes Sur 1232, Col. Del Valle, CP 03100, CDMX</p>
                <div className="rounded-xl overflow-hidden h-40 relative border border-slate-200 shadow-inner group">
                  <img 
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" 
                    src="https://picsum.photos/seed/map/400/300" 
                    alt="Map placeholder"
                  />
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <div className="size-10 bg-[#1a3b5b]/20 rounded-full flex items-center justify-center animate-pulse">
                      <MapPin className="w-6 h-6 text-[#1a3b5b]" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#1a3b5b]" /> Mensaje y Notas
              </h3>
            </div>
            <div className="p-4">
              <div className="bg-[#1a3b5b]/5 p-3 rounded-lg border border-[#1a3b5b]/20 italic text-sm text-slate-700 mb-3">
                "Feliz décimo aniversario, mi amor. Gracias por estos años increíbles. Te amo."
              </div>
              <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">Instrucciones Especiales</p>
              <p className="text-xs text-slate-600">Entregar después de las 4 PM. Tocar timbre 'C'.</p>
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
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded">Stock Confirmado</span>
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
                  {[
                    { name: 'Rosas Rojas Premium', desc: 'Docena x 2', qty: 2, price: '$750.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuB_TJ4veT-MnRXN3jr2Nw9ASEboozEuuIFyYEXlpy3GLmW1u96SIp-qFFFT-QtU6Tr7KTgZsMM2l_S0Cf_vW56FGYIMMBPgTBjz_gnYy9tDogiqu9oMjJOSTNd0JfK6vu8XCnzFt-MVDkYJ9zUibgC6wDGhJ_EFm8PZ3TkNZqNEOVMkuwBAQeh48GnzOdYySUluFLVhbxXNlz25v5y0CSanYuPUmQuxD9bZzNdsxD9QmmI9EAtF_swoy2R8TxhM8MvHn9-6Xbd0gxrz' },
                    { name: 'Florero de Cristal', desc: 'Cilíndrico Grande', qty: 1, price: '$350.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDptvwuBFSPIVwXjr-M8jiz1hlbxJOegp6Bdq8LrjT3ZKSJeKFcAriGqKJPwR5hJIH90tlO3IXB0q3qGGeYhqWZi9L5Ioap_cixvwEDK4xF2aMyRw4MT_ZqHkaObSyiJ7qPe03JuTS2rOS2a0V20fXBjlZo3IbzxlHwDKsE9sOFI4nvf_OMgzQhLyTpxGML8Z-A67JG_2ZMVUs0zCojWiQV3_aObr-aByLCyGVKMLE1mHugUYd5LnlWTCF9qHkwRAmcus_CBxSXwcDL' },
                    { name: 'Caja de Chocolates', desc: 'Artesanales 12 pzs', qty: 1, price: '$150.00', img: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCWZL1kbm1vVB45RBZciWT_jk2r6ATsHlaMltaQVaHrocvkp3gYf4iZmrQzKPGlwdFZ9-x1WUpRV0B2k0vvEAYmrMNGo3Wt98mRkayywcGIxUfsCxknC1J1LDqWcAPKbw2yw-XQldki4Apeif1Eorav-0qZL3oYnSBza4nizEPEbnIC-7kkMSm4ebzHNbEQYTqjU3dv0KFSMzlA6lRn8JTx5tvjffl3_a4kTpMxMhHedc8oEdxgU17FdwFuw-b5noxJP4m6_1qLjAA-' },
                  ].map((item, idx) => (
                    <tr key={idx}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded bg-slate-100 overflow-hidden shrink-0">
                            <img className="w-full h-full object-cover" src={item.img} alt={item.name} />
                          </div>
                          <div>
                            <p className="text-xs font-bold">{item.name}</p>
                            <p className="text-[10px] text-slate-500">{item.desc}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs text-center font-medium">{item.qty}</td>
                      <td className="px-4 py-3 text-xs text-right font-bold">{item.price}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-slate-50">
                  <tr>
                    <td className="px-4 py-2 text-right text-xs font-bold text-slate-500" colSpan={2}>Subtotal:</td>
                    <td className="px-4 py-2 text-right text-xs font-bold">$1,250.00</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 text-right text-xs font-bold text-slate-500" colSpan={2}>Envío:</td>
                    <td className="px-4 py-2 text-right text-xs font-bold text-emerald-600">GRATIS</td>
                  </tr>
                  <tr className="bg-[#1a3b5b]/10">
                    <td className="px-4 py-3 text-right text-sm font-black text-[#1a3b5b]" colSpan={2}>TOTAL:</td>
                    <td className="px-4 py-3 text-right text-sm font-black text-[#1a3b5b]">$1,250.00</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </section>
        </div>

        {/* Col 3: Pagos & Documentación */}
        <div className="space-y-6">
          <section className="bg-[#141210] rounded-2xl border border-white/10 shadow-xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-6">RESUMEN DE PAGO</h3>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-400">Subtotal</span>
                  <span className="text-white">$1,600.00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-400">Costo de Envío</span>
                  <span className="text-white">$120.00</span>
                </div>
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-slate-400">Impuestos (16%)</span>
                  <span className="text-white">$275.20</span>
                </div>
              </div>
              <div className="border-t border-white/5 pt-6 mb-8 flex justify-between items-baseline">
                <span className="text-xl font-bold text-white">Total</span>
                <span className="text-3xl font-black text-[#ec5b13]">$1,995.20</span>
              </div>
              <div className="bg-[#16251a] border border-[#1d3524] rounded-xl p-4 flex items-center gap-4">
                <div className="size-10 bg-emerald-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">PAGADO</p>
                  <p className="text-[10px] text-slate-500">via Tarjeta de Crédito (**** 4242)</p>
                </div>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-3">
              <History className="w-4 h-4 text-orange-500" />
              <h3 className="text-base font-bold text-slate-800">Historial de Pagos</h3>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Anticipo (50%)</p>
                    <p className="text-[10px] text-slate-500">Transferencia • 24 Oct 10:50 AM</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-emerald-600">$720.00</span>
              </div>
              <div className="p-4 bg-white rounded-xl border-2 border-dashed border-slate-200 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="size-10 bg-orange-100 text-orange-600 rounded-full flex items-center justify-center">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">Pago Pendiente</p>
                    <p className="text-[10px] text-slate-500">Esperando entrega</p>
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-400">$720.00</span>
              </div>
            </div>
          </section>

          <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FolderOpen className="w-4 h-4 text-[#1a3b5b]" /> Documentación
              </h3>
            </div>
            <div className="p-4 space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-rose-500" />
                  <span className="text-xs font-medium">Factura_FB-8902.pdf</span>
                </div>
                <Download className="w-3 h-3 text-slate-400" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100 hover:bg-slate-50 transition-colors cursor-pointer">
                <div className="flex items-center gap-2">
                  <Eye className="w-4 h-4 text-[#1a3b5b]" />
                  <span className="text-xs font-medium">Foto_Entrega_Ref.jpg</span>
                </div>
                <Eye className="w-3 h-3 text-slate-400" />
              </div>
              <button className="w-full mt-2 py-2 text-xs font-bold text-[#1a3b5b] border border-[#1a3b5b]/20 rounded-lg hover:bg-[#1a3b5b]/5">
                Subir Archivo
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Timeline */}
      <section className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/50">
          <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-[#1a3b5b]" /> Seguimiento del Pedido
          </h3>
        </div>
        <div className="p-6">
          <div className="relative flex items-center justify-between">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-slate-200 z-0"></div>
            {[
              { label: 'Recibido', time: '10:30 AM', icon: <Check className="w-4 h-4" />, active: true },
              { label: 'Pago Confirmado', time: '10:35 AM', icon: <Check className="w-4 h-4" />, active: true },
              { label: 'Preparación', time: 'En curso', icon: <Sparkles className="w-4 h-4" />, active: true, current: true },
              { label: 'En Camino', time: 'Programado', icon: <Truck className="w-4 h-4" />, active: false },
              { label: 'Entregado', time: 'Pendiente', icon: <PartyPopper className="w-4 h-4" />, active: false },
            ].map((step, idx) => (
              <div key={idx} className={`relative z-10 flex flex-col items-center gap-2 ${!step.active ? 'opacity-50' : ''}`}>
                <div className={`size-8 rounded-full flex items-center justify-center shadow-lg ${step.active ? 'bg-[#1a3b5b] text-white shadow-[#1a3b5b]/30' : 'bg-slate-200 text-slate-500'} ${step.current ? 'ring-4 ring-white' : ''}`}>
                  {step.icon}
                </div>
                <div className="text-center">
                  <p className={`text-[10px] font-bold ${step.current ? 'text-[#1a3b5b]' : ''}`}>{step.label}</p>
                  <p className="text-[8px] text-slate-400">{step.time}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-wrap gap-4 justify-center">
            <button className="flex items-center gap-3 px-6 py-4 bg-[#1a3b5b] text-white rounded-xl font-bold shadow-lg shadow-[#1a3b5b]/20 hover:scale-[1.02] transition-transform">
              <Truck className="w-5 h-5" /> Marcar como En Camino
            </button>
            <button className="flex items-center gap-3 px-6 py-4 bg-emerald-600 text-white rounded-xl font-bold shadow-lg shadow-emerald-200 hover:scale-[1.02] transition-transform">
              <CheckCircle className="w-5 h-5" /> Finalizar Pedido
            </button>
            <button className="flex items-center gap-3 px-6 py-4 bg-white border border-slate-200 text-slate-700 rounded-xl font-bold hover:bg-slate-50">
              <X className="w-5 h-5" /> Cancelar
            </button>
          </div>
        </div>
      </section>

      <footer className="text-center py-8">
        <p className="text-[10px] text-slate-400 uppercase tracking-widest">© 2024 Florería Bautista - Panel de Administración v4.2</p>
      </footer>
    </div>
  );
}
