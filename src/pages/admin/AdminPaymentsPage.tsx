import React, { useState, useEffect } from 'react';
import {
  CreditCard, DollarSign, Search, Download, Clock, XCircle,
  MoreVertical, Calendar, FileText, RefreshCw, X,
  TrendingUp, TrendingDown, ChevronRight, CheckCircle2, Receipt,
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../../services/dataService';
import { FadeIn, ScaleIn, AnimatedButton } from '../../components/Animations';
import { useToast } from '../../hooks/useToast';

// ─── Status config ─────────────────────────────────────────────────────────────
const statusLabel: Record<string, string> = {
  paid: 'Completado', pending: 'Pendiente', failed: 'Fallido',
};
const statusStyle: Record<string, string> = {
  paid:    'text-emerald-600',
  pending: 'text-amber-500',
  failed:  'text-rose-500',
};
const statusDot: Record<string, string> = {
  paid: 'bg-emerald-500', pending: 'bg-amber-400', failed: 'bg-rose-500',
};

const INVOICE_FIELDS = [
  { label: 'Cliente *',      key: 'client',  type: 'text',   placeholder: 'Nombre del cliente o empresa'   },
  { label: 'Monto (MXN) *', key: 'amount',  type: 'number', placeholder: '0.00'                           },
  { label: 'Concepto *',     key: 'concept', type: 'text',   placeholder: 'Ej. Arreglo floral para evento' },
  { label: 'Vencimiento',    key: 'dueDate', type: 'date',   placeholder: ''                               },
] as const;

export default function AdminPaymentsPage() {
  const [searchTerm,   setSearchTerm]   = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los Estados');
  const [payments,     setPayments]     = useState<any[]>([]);
  const [stats,        setStats]        = useState({
    incomeToday: 0, pendingAmount: 0, failedCount: 0, totalTransactions: 0,
  });
  const [loading,    setLoading]    = useState(true);
  const [modalOpen,  setModalOpen]  = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const { showToast } = useToast();

  const [invoice, setInvoice] = useState({ client: '', amount: 0, concept: '', dueDate: '' });

  useEffect(() => {
    setPayments(DataService.getPayments());
    setStats(DataService.getPaymentStats());
    setLoading(false);
  }, []);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (activeMenu && !(e.target as Element).closest('.menu-container')) setActiveMenu(null);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [activeMenu]);

  const handleCreate = () => {
    if (!invoice.client || !invoice.amount || !invoice.concept) {
      showToast('Por favor, completa los campos obligatorios.', 'error');
      return;
    }
    showToast(`Factura creada para ${invoice.client} por $${invoice.amount}`, 'success');
    setModalOpen(false);
    setInvoice({ client: '', amount: 0, concept: '', dueDate: '' });
  };

  const filtered = payments.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch = p.client.toLowerCase().includes(q) || p.id.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === 'Todos los Estados' ||
      (statusFilter === 'Completado' && p.status === 'paid')    ||
      (statusFilter === 'Pendiente'  && p.status === 'pending') ||
      (statusFilter === 'Fallido'    && p.status === 'failed');
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-3">
        <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
        <span className="text-xs font-semibold text-slate-400 tracking-widest uppercase">Cargando pagos...</span>
      </div>
    </div>
  );

  const STAT_CARDS = [
    { label: 'Ingresos Hoy',  value: `$${stats.incomeToday.toLocaleString()}`,  icon: DollarSign, color: 'text-emerald-500', trend: '+12%', trendUp: true  },
    { label: 'Pendientes',    value: `$${stats.pendingAmount.toLocaleString()}`, icon: Clock,      color: 'text-amber-500',   trend: '-5%',  trendUp: false },
    { label: 'Fallidos',      value: stats.failedCount.toString(),               icon: XCircle,    color: 'text-rose-500',    trend: '+2%',  trendUp: false },
    { label: 'Transacciones', value: stats.totalTransactions.toString(),         icon: CreditCard, color: 'text-blue-500',    trend: '+8%',  trendUp: true  },
  ];

  const inputClass = "w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all";
  const labelClass = "block text-xs font-semibold text-slate-500 mb-1.5";

  return (
    <div className="w-full space-y-8">

      {/* ── HEADER ── */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Gestión de Pagos</h1>
            <p className="text-slate-400 text-sm mt-1">Monitorea transacciones, reembolsos y estados de facturación</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
              <Download className="w-4 h-4" />
              Exportar
            </button>
            <AnimatedButton onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-md transition-all">
              <FileText className="w-4 h-4" />
              Nueva Factura
            </AnimatedButton>
          </div>
        </div>
      </FadeIn>

      {/* ── KPI STATS — horizontal, sin cards ── */}
      <FadeIn delay={0.1}>
        <div className="grid grid-cols-2 lg:grid-cols-4 divide-x divide-slate-100 border border-slate-100 rounded-2xl bg-white overflow-hidden shadow-sm">
          {STAT_CARDS.map((s, i) => (
            <div key={i} className="px-7 py-6 flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <s.icon className={`w-5 h-5 ${s.color}`} />
                <span className={`text-xs font-bold ${s.trendUp ? 'text-emerald-500' : 'text-rose-400'}`}>
                  {s.trend}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{s.label}</p>
                <p className="text-3xl font-black text-slate-900 mt-1 tracking-tight">{s.value}</p>
              </div>
            </div>
          ))}
        </div>
      </FadeIn>

      {/* ── FILTERS ── */}
      <FadeIn delay={0.15}>
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="flex-1 min-w-[260px] relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            <input type="text"
              placeholder="Buscar por ID de transacción, cliente o monto..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm"
              value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
          </div>

          {/* Status select */}
          <div className="relative">
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              className="appearance-none pl-4 pr-9 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all shadow-sm cursor-pointer"
            >
              <option>Todos los Estados</option>
              <option>Completado</option>
              <option>Pendiente</option>
              <option>Fallido</option>
            </select>
            <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
          </div>

          {/* Date */}
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
            <Calendar className="w-4 h-4 text-slate-400" />
            Este Mes
          </button>
        </div>
      </FadeIn>

      {/* ── TABLE ── */}
      <FadeIn delay={0.2}>
        <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-slate-100">
                  {['ID Transacción', 'Cliente', 'Monto', 'Método', 'Fecha / Hora', 'Estado', 'Acciones'].map((h, i) => (
                    <th key={i} className={`px-6 py-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest ${i === 6 ? 'text-right' : ''}`}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <AnimatePresence mode="popLayout">
                  {filtered.map((trx, idx) => (
                    <motion.tr key={trx.id} layout
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      transition={{ delay: idx * 0.02 }}
                      className="border-b border-slate-100 hover:bg-slate-50/40 transition-colors group">

                      {/* ID */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                          {trx.id}
                        </span>
                      </td>

                      {/* Cliente */}
                      <td className="px-6 py-4">
                        <p className="text-sm font-bold text-slate-900">{trx.client}</p>
                      </td>

                      {/* Monto */}
                      <td className="px-6 py-4">
                        <span className="text-sm font-black text-slate-900">
                          ${(trx.amount || 0).toLocaleString()}
                        </span>
                      </td>

                      {/* Método */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <CreditCard className="w-3.5 h-3.5" />
                          <span className="text-sm font-medium capitalize">{trx.method}</span>
                        </div>
                      </td>

                      {/* Fecha */}
                      <td className="px-6 py-4">
                        <span className="text-sm text-slate-500">
                          {new Date(trx.date).toLocaleString('es-MX', {
                            day: '2-digit', month: 'numeric', year: 'numeric',
                            hour: '2-digit', minute: '2-digit',
                          })}
                        </span>
                      </td>

                      {/* Estado — texto plano con dot, sin chip */}
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center gap-1.5 text-sm font-bold ${statusStyle[trx.status] || 'text-slate-500'}`}>
                          <span className={`size-1.5 rounded-full ${statusDot[trx.status] || 'bg-slate-400'} ${trx.status === 'failed' ? 'animate-pulse' : ''}`} />
                          {(statusLabel[trx.status] || trx.status).toUpperCase()}
                        </span>
                      </td>

                      {/* Acciones */}
                      <td className="px-6 py-4 text-right relative menu-container">
                        <button onClick={() => setActiveMenu(activeMenu === trx.id ? null : trx.id)}
                          className="p-2 text-slate-300 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        <AnimatePresence>
                          {activeMenu === trx.id && (
                            <motion.div
                              initial={{ opacity: 0, scale: 0.95, y: 6 }}
                              animate={{ opacity: 1, scale: 1,    y: 0 }}
                              exit={{   opacity: 0, scale: 0.95, y: 6 }}
                              transition={{ duration: 0.13 }}
                              className="absolute right-6 top-12 w-44 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-20">
                              <div className="p-1.5 flex flex-col gap-0.5">
                                <button className="text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors">
                                  Ver detalle
                                </button>
                                <button className="text-left px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg transition-colors">
                                  Descargar recibo
                                </button>
                                <div className="h-px bg-slate-100 my-0.5" />
                                <button className="text-left px-3 py-2 text-sm font-medium text-rose-500 hover:bg-rose-50 rounded-lg transition-colors">
                                  Reembolsar
                                </button>
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>

          {filtered.length === 0 && (
            <div className="py-14 text-center">
              <CheckCircle2 className="w-8 h-8 text-slate-200 mx-auto mb-2" />
              <p className="text-sm text-slate-400">No hay transacciones que mostrar.</p>
            </div>
          )}

          <div className="px-6 py-3.5 border-t border-slate-100 flex justify-between items-center">
            <span className="text-xs text-slate-400">{filtered.length} de {payments.length} transacciones</span>
            <button className="flex items-center gap-1.5 text-xs font-semibold text-blue-500 hover:text-blue-700 transition-colors">
              Ver conciliación bancaria completa
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </FadeIn>

      {/* ── MODAL NUEVA FACTURA ── */}
      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm"
              onClick={() => setModalOpen(false)} />

            <ScaleIn className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
              <div className="px-7 py-5 border-b border-slate-100 flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900">Nueva Factura</h3>
                <button onClick={() => setModalOpen(false)}
                  className="size-8 flex items-center justify-center bg-slate-100 rounded-lg text-slate-400 hover:bg-slate-200 hover:text-slate-700 transition-all">
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="px-7 py-6 space-y-4">
                {INVOICE_FIELDS.map(({ label, key, type, placeholder }) => (
                  <div key={key}>
                    <label className={labelClass}>{label}</label>
                    <input type={type} placeholder={placeholder}
                      value={(invoice as any)[key]}
                      onChange={e => setInvoice({
                        ...invoice,
                        [key]: type === 'number' ? Number(e.target.value) : e.target.value,
                      })}
                      className={inputClass} />
                  </div>
                ))}
              </div>

              <div className="px-7 py-5 border-t border-slate-100 flex justify-end gap-3">
                <button onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-slate-500 hover:bg-slate-100 transition-colors">
                  Cancelar
                </button>
                <AnimatedButton onClick={handleCreate}
                  className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 shadow-md transition-all">
                  <FileText className="w-4 h-4" />
                  Generar Factura
                </AnimatedButton>
              </div>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}