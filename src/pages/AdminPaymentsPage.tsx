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
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../services/dataService';

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
        return { label: 'Completado', color: 'text-emerald-700', bg: 'bg-emerald-100', dot: 'bg-emerald-500' };
      case 'pending':
        return { label: 'Pendiente', color: 'text-amber-700', bg: 'bg-amber-100', dot: 'bg-amber-500' };
      case 'failed':
        return { label: 'Fallido', color: 'text-rose-700', bg: 'bg-rose-100', dot: 'bg-rose-500' };
      default:
        return { label: status, color: 'text-slate-700', bg: 'bg-slate-100', dot: 'bg-slate-500' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-[#1e3a5f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Gestión de Pagos</h1>
          <p className="text-sm text-slate-500">Monitorea transacciones, reembolsos y estados de facturación</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <Download className="w-4 h-4" />
            Exportar
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold hover:bg-opacity-90 shadow-lg shadow-[#1e3a5f]/20 transition-all">
            <FileText className="w-4 h-4" />
            Nueva Factura
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Ingresos Hoy', value: `$${stats.incomeToday.toLocaleString()}`, icon: <DollarSign className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50', trend: '+12%' },
          { label: 'Pendientes', value: `$${stats.pendingAmount.toLocaleString()}`, icon: <Clock className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50', trend: '-5%' },
          { label: 'Fallidos', value: stats.failedCount.toString(), icon: <XCircle className="w-5 h-5" />, color: 'text-rose-600', bg: 'bg-rose-50', trend: '+2%' },
          { label: 'Transacciones', value: stats.totalTransactions.toString(), icon: <CreditCard className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50', trend: '+8%' },
        ].map((stat, idx) => (
          <motion.div 
            key={idx} 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ y: -5 }}
            className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm"
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
          </motion.div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por ID de transacción, cliente o monto..." 
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <select 
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 focus:ring-0"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="Todos">Todos los Estados</option>
            <option value="Completado">Completado</option>
            <option value="Pendiente">Pendiente</option>
            <option value="Fallido">Fallido</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-100 transition-colors">
            <Calendar className="w-4 h-4" />
            Este Mes
          </button>
        </div>
      </div>

      {/* Payments Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
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
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="p-4 text-xs font-mono font-bold text-slate-900">{trx.id}</td>
                      <td className="p-4">
                        <p className="text-sm font-bold text-slate-900">{trx.client}</p>
                      </td>
                      <td className="p-4">
                        <span className="text-sm font-black text-[#1e3a5f]">${(trx.amount || 0).toLocaleString()}</span>
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
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusBadge.bg} ${statusBadge.color}`}>
                          <span className={`size-1.5 rounded-full ${statusBadge.dot}`}></span>
                          {statusBadge.label}
                        </span>
                      </td>
                      <td className="p-4 text-right">
                        <button className="p-2 text-slate-400 hover:text-[#1e3a5f] transition-colors">
                          <MoreVertical className="w-5 h-5" />
                        </button>
                      </td>
                    </motion.tr>
                  );
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-slate-100 bg-slate-50/30 text-center">
          <button className="text-xs font-bold text-slate-500 hover:text-[#1e3a5f] transition-colors">Ver conciliación bancaria completa</button>
        </div>
      </div>
    </div>
  );
}
