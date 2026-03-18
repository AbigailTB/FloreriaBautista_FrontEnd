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
import { DataService } from '../../services/dataService';
import { FadeIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';

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
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-8">
      {/* Header */}
      <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Auditoría de Seguridad</h1>
          <p className="text-sm text-slate-500 font-medium">Registro detallado de todas las acciones críticas en el sistema</p>
        </div>
        <AnimatedButton className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Download className="w-4 h-4" />
          Descargar Reporte Completo
        </AnimatedButton>
      </FadeIn>

      {/* Stats Summary */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-4 border-none">
          <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Eventos Hoy</p>
            <p className="text-xl font-black text-slate-900">{stats.todayEvents} registros</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-4 border-none">
          <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Alertas Críticas</p>
            <p className="text-xl font-black text-rose-600">{stats.criticalAlerts.toString().padStart(2, '0')} alertas</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-4 border-none">
          <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Integridad Sistema</p>
            <p className="text-xl font-black text-emerald-600">{stats.integrity}</p>
          </div>
        </GlassCard>
      </StaggerContainer>

      {/* Filters */}
      <FadeIn delay={0.3}>
        <GlassCard className="p-4 border-none flex flex-col md:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por usuario, acción o IP..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl text-sm font-medium focus:ring-2 focus:ring-blue-600/20 transition-all"
            />
          </div>
          <div className="flex items-center gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2 bg-slate-50 px-4 py-3 rounded-2xl border border-slate-100">
              <Filter className="w-4 h-4 text-slate-400" />
              <select 
                className="bg-transparent border-none text-sm font-black text-slate-600 focus:ring-0 p-0 pr-8 cursor-pointer"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>Todos los niveles</option>
                <option>Exitoso</option>
                <option>Advertencia</option>
                <option>Crítico</option>
              </select>
            </div>
            <AnimatedButton className="p-3 bg-slate-50 text-slate-400 hover:text-slate-900 rounded-2xl transition-colors shadow-sm">
              <Calendar className="w-5 h-5" />
            </AnimatedButton>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Audit Table */}
      <FadeIn delay={0.4}>
        <GlassCard className="border-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Acción</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Objetivo</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Fecha / Hora</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Dirección IP</th>
                  <th className="px-6 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredLogs.map((log, idx) => (
                  <motion.tr 
                    key={log.id} 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="hover:bg-slate-50/30 transition-colors group"
                  >
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 shadow-sm">
                          <User className="w-5 h-5" />
                        </div>
                        <span className="text-sm font-black text-slate-900">{log.user}</span>
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-slate-600 font-bold">{log.action}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-[10px] font-black font-mono text-slate-500 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100 uppercase tracking-wider">{log.target}</span>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-xs text-slate-500 font-bold">
                        <Clock className="w-4 h-4 text-slate-400" />
                        {new Date(log.date).toLocaleString(undefined, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 font-black font-mono uppercase tracking-widest">
                        <Globe className="w-4 h-4" />
                        {log.ip}
                      </div>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${
                        log.status === 'Exitoso' ? 'bg-emerald-50 text-emerald-600' : 
                        log.status === 'Advertencia' ? 'bg-amber-50 text-amber-600' : 'bg-rose-50 text-rose-600'
                      } shadow-sm`}>
                        {log.status}
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
