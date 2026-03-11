import React, { useState, useEffect } from 'react';
import { 
  ShieldAlert, 
  User, 
  Clock, 
  Globe, 
  AlertCircle,
  CheckCircle2,
  Search,
  Filter,
  Download,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { motion } from 'motion/react';
import { DataService } from '../services/dataService';

export default function AdminAuditPage() {
  const [auditLogs, setAuditLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos los niveles');

  useEffect(() => {
    const loadLogs = () => {
      const logs = DataService.getAuditLogs();
      setAuditLogs(logs);
      setLoading(false);
    };
    loadLogs();
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    const matchesSearch = 
      log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.action.toLowerCase().includes(searchTerm.toLowerCase()) ||
      log.ip.includes(searchTerm);
    
    const matchesStatus = statusFilter === 'Todos los niveles' || log.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const stats = {
    todayEvents: auditLogs.length,
    criticalAlerts: auditLogs.filter(l => l.status === 'Crítico').length,
    integrity: 'Verificada'
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
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Auditoría de Seguridad</h1>
          <p className="text-sm text-slate-500">Registro detallado de todas las acciones críticas en el sistema</p>
        </div>
        <button className="flex items-center gap-2 px-6 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all">
          <Download className="w-4 h-4" />
          Descargar Reporte Completo
        </button>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Eventos Hoy</p>
            <p className="text-lg font-black text-slate-900">{stats.todayEvents} registros</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Alertas Críticas</p>
            <p className="text-lg font-black text-rose-600">{stats.criticalAlerts.toString().padStart(2, '0')} alertas</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="size-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Integridad Sistema</p>
            <p className="text-lg font-black text-emerald-600">{stats.integrity}</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar por usuario, acción o IP..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border-none rounded-xl text-sm focus:ring-2 focus:ring-[#1e3a5f]/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 px-3 py-2 rounded-xl border border-slate-100">
            <Filter className="w-4 h-4 text-slate-400" />
            <select 
              className="bg-transparent border-none text-sm font-bold text-slate-600 focus:ring-0 p-0 pr-8"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option>Todos los niveles</option>
              <option>Exitoso</option>
              <option>Advertencia</option>
              <option>Crítico</option>
            </select>
          </div>
          <button className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-xl transition-colors">
            <Calendar className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Audit Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Usuario</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Acción</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Objetivo</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Fecha / Hora</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Dirección IP</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredLogs.map((log, idx) => (
                <motion.tr 
                  key={log.id} 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="size-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
                        <User className="w-4 h-4" />
                      </div>
                      <span className="text-sm font-bold text-slate-900">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600 font-medium">{log.action}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-mono text-slate-500 bg-slate-50 px-2 py-1 rounded border border-slate-100">{log.target}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {new Date(log.date).toLocaleString()}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-xs text-slate-400 font-mono">
                      <Globe className="w-3.5 h-3.5" />
                      {log.ip}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      log.status === 'Exitoso' ? 'bg-emerald-50 text-emerald-600' : 
                      log.status === 'Advertencia' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                    }`}>
                      {log.status}
                    </span>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
