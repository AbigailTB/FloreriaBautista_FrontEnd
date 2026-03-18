import React, { useState, useEffect } from 'react';
import { 
  CreditCard, 
  DollarSign, 
  Search, 
  Download, 
  Clock, 
  XCircle,
  MoreVertical,
  Calendar,
  FileText,
  RefreshCw,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../../services/dataService';
import { FadeIn, ScaleIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';
import { useToast } from '../../hooks/useToast';

export default function AdminPaymentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({
    incomeToday: 0,
    pendingAmount: 0,
    failedCount: 0,
    totalTransactions: 0
  });
  const [loading, setLoading] = useState(true);
  const [isNewInvoiceModalOpen, setIsNewInvoiceModalOpen] = useState(false);
  const { showToast } = useToast();

  const [newInvoice, setNewInvoice] = useState({
    client: '',
    amount: 0,
    concept: '',
    dueDate: ''
  });

  useEffect(() => {
    const loadData = () => {
      const allPayments = DataService.getPayments();
      const paymentStats = DataService.getPaymentStats();
      setPayments(allPayments);
      setStats(paymentStats);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleCreateInvoice = () => {
    if (!newInvoice.client || !newInvoice.amount || !newInvoice.concept) {
      showToast('Por favor, completa los campos obligatorios.', 'error');
      return;
    }

    // Mock creating invoice
    showToast(`Factura creada para ${newInvoice.client} por $${newInvoice.amount}`, 'success');
    setIsNewInvoiceModalOpen(false);
    setNewInvoice({
      client: '',
      amount: 0,
      concept: '',
      dueDate: ''
    });
  };

  const filteredPayments = payments.filter(payment => {
    const matchesSearch = payment.client.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         payment.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesStatus = statusFilter === 'Todos';
    if (!matchesStatus) {
      if (statusFilter === 'Completado' && payment.status === 'paid') matchesStatus = true;
      if (statusFilter === 'Pendiente' && payment.status === 'pending') matchesStatus = true;
      if (statusFilter === 'Fallido' && payment.status === 'failed') matchesStatus = true;
    }
    
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'paid':
        return { label: 'Completado', color: 'text-emerald-700', bg: 'bg-emerald-100/50', dot: 'bg-emerald-500' };
      case 'pending':
        return { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-100/50', dot: 'bg-amber-500' };
      case 'failed':
        return { label: 'Fallido', color: 'text-rose-700', bg: 'bg-rose-100/50', dot: 'bg-rose-500' };
      default:
        return { label: status, color: 'text-slate-700', bg: 'bg-slate-100/50', dot: 'bg-slate-500' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-8">
      {/* Header */}
      <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Gestión de Pagos</h1>
          <p className="text-sm text-slate-500">Monitorea transacciones, reembolsos y estados de facturación</p>
        </div>
        <div className="flex items-center gap-2">
          <AnimatedButton className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            Exportar
          </AnimatedButton>
          <AnimatedButton 
            onClick={() => setIsNewInvoiceModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all"
          >
            <FileText className="w-4 h-4" />
            Nueva Factura
          </AnimatedButton>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Ingresos Hoy', value: `$${stats.incomeToday.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
          { label: 'Pendientes', value: `$${stats.pendingAmount.toLocaleString()}`, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-5%' },
          { label: 'Fallidos', value: stats.failedCount.toString(), icon: <XCircle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50', trend: '+2%' },
          { label: 'Transacciones', value: stats.totalTransactions.toString(), icon: <CreditCard className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8%' },
        ].map((stat, idx) => (
          <GlassCard 
            key={idx} 
            className="p-5"
          >
            <div className="flex justify-between items-start mb-3">
              <div className={`p-2 rounded-lg ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <span className={`text-[10px] font-bold ${stat.trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>
                {stat.trend}
              </span>
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1 text-slate-900">{stat.value}</h3>
          </GlassCard>
        ))}
      </StaggerContainer>

      {/* Filters */}
      <FadeIn>
        <GlassCard className="flex flex-wrap items-center gap-4 p-4">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por ID de transacción, cliente o monto..." 
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 text-sm focus:ring-blue-600 focus:border-blue-600 bg-white/50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2">
            <select 
              className="px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-0"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="Todos">Todos los Estados</option>
              <option value="Completado">Completado</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Fallido">Fallido</option>
            </select>
            <AnimatedButton className="flex items-center gap-2 px-4 py-2.5 bg-white/50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-white transition-colors">
              <Calendar className="w-4 h-4" />
              Este Mes
            </AnimatedButton>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Payments Table */}
      <FadeIn>
        <GlassCard className="overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-200">
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">ID Transacción</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Cliente</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Monto</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Método</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha / Hora</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                  <th className="p-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <AnimatePresence mode="popLayout">
                  {filteredPayments.map((trx) => {
                    const statusBadge = getStatusBadge(trx.status);
                    return (
                      <motion.tr 
                        key={trx.id} 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-white/40 transition-colors"
                      >
                        <td className="p-4 text-xs font-mono font-bold text-slate-900">{trx.id}</td>
                        <td className="p-4">
                          <p className="text-sm font-bold text-slate-900">{trx.client}</p>
                        </td>
                        <td className="p-4">
                          <span className="text-sm font-black text-blue-600">${(trx.amount || 0).toLocaleString()}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                            <CreditCard className="w-3.5 h-3.5" />
                            {trx.method}
                          </div>
                        </td>
                        <td className="p-4 text-xs text-slate-500 font-medium">
                          {new Date(trx.date).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusBadge.bg} ${statusBadge.color} backdrop-blur-sm`}>
                            <span className={`size-1.5 rounded-full ${statusBadge.dot}`}></span>
                            {statusBadge.label}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <AnimatedButton className="p-2 text-slate-400 hover:text-blue-600 transition-colors">
                            <MoreVertical className="w-5 h-5" />
                          </AnimatedButton>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
            <AnimatedButton className="text-xs font-bold text-slate-500 hover:text-blue-600 transition-colors">
              Ver conciliación bancaria completa
            </AnimatedButton>
          </div>
        </GlassCard>
      </FadeIn>

      {/* New Invoice Modal */}
      <AnimatePresence>
        {isNewInvoiceModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsNewInvoiceModalOpen(false)}
            ></motion.div>
            <ScaleIn className="relative bg-white p-8 rounded-[2rem] shadow-2xl max-w-xl w-full border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900">Nueva Factura</h3>
                <button onClick={() => setIsNewInvoiceModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Cliente *</label>
                  <input 
                    type="text" 
                    value={newInvoice.client}
                    onChange={(e) => setNewInvoice({...newInvoice, client: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="Nombre del cliente o empresa"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Monto (MXN) *</label>
                  <input 
                    type="number" 
                    value={newInvoice.amount}
                    onChange={(e) => setNewInvoice({...newInvoice, amount: Number(e.target.value)})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Concepto *</label>
                  <input 
                    type="text" 
                    value={newInvoice.concept}
                    onChange={(e) => setNewInvoice({...newInvoice, concept: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="Ej. Arreglo floral para evento"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Fecha de Vencimiento</label>
                  <input 
                    type="date" 
                    value={newInvoice.dueDate}
                    onChange={(e) => setNewInvoice({...newInvoice, dueDate: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold text-slate-600"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsNewInvoiceModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <AnimatedButton 
                  onClick={handleCreateInvoice}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                >
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
