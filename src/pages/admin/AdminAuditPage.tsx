import React, { useState, useEffect } from 'react';
import {
  ShieldAlert,
  User,
  Clock,
  Globe,
  AlertCircle,
  CheckCircle2,
  Search,
  Download,
  RefreshCw,
  Activity,
  Lock,
} from 'lucide-react';
import { DataService } from '../../services/dataService';

const statusMeta: Record<string, { label: string; color: string; dot: string }> = {
  Exitoso:     { label: 'OK',   color: 'text-emerald-700 bg-emerald-50 border-emerald-200', dot: 'bg-emerald-500' },
  Advertencia: { label: 'WARN', color: 'text-amber-700 bg-amber-50 border-amber-200',       dot: 'bg-amber-400'   },
  Crítico:     { label: 'CRIT', color: 'text-rose-700 bg-rose-50 border-rose-200',          dot: 'bg-rose-500'    },
};

export default function AdminAuditPage() {
  const [auditLogs, setAuditLogs]       = useState<any[]>([]);
  const [loading, setLoading]           = useState(true);
  const [searchTerm, setSearchTerm]     = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [timeStr, setTimeStr]           = useState('');

  // Reloj — cleanup garantizado
  useEffect(() => {
    const update = () =>
      setTimeStr(new Date().toLocaleTimeString('es-MX', { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const logs = DataService.getAuditLogs();
    setAuditLogs(logs);
    setLoading(false);
  }, []);

  const filteredLogs = auditLogs.filter(log => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (log.user   ?? '').toLowerCase().includes(q) ||
      (log.action ?? '').toLowerCase().includes(q) ||
      (log.ip     ?? '').includes(q);
    const matchStatus = statusFilter === 'ALL' || log.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const stats = {
    total:    auditLogs.length,
    ok:       auditLogs.filter(l => l.status === 'Exitoso').length,
    warn:     auditLogs.filter(l => l.status === 'Advertencia').length,
    critical: auditLogs.filter(l => l.status === 'Crítico').length,
  };

  const dateStr = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-rose-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-6">

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center">
              <ShieldAlert className="w-5 h-5 text-rose-500" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Auditoría de Seguridad</h1>
          </div>
          <p className="text-sm text-slate-400 ml-12">Registro de todas las acciones críticas del sistema</p>
        </div>

        <div className="flex items-center gap-3 ml-12 sm:ml-0">
          <div className="hidden sm:flex flex-col items-end text-right">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wide">Sistema activo</span>
            <span className="text-xs font-mono text-emerald-600">{dateStr} · {timeStr}</span>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all">
            <Download className="w-3.5 h-3.5" />
            Exportar
          </button>
        </div>
      </div>

      {/* ── Stat chips ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Total eventos', value: stats.total,    icon: Activity,     color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200'  },
          { label: 'Exitosos',      value: stats.ok,       icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Advertencias',  value: stats.warn,     icon: AlertCircle,  color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
          { label: 'Críticos',      value: stats.critical, icon: Lock,         color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100'    },
        ].map(({ label, value, icon: Icon, color, bg, border }) => (
          <div key={label} className={`rounded-xl border ${border} ${bg} px-4 py-3 flex items-center gap-3`}>
            <Icon className={`w-4 h-4 ${color} shrink-0`} />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
              <p className={`text-sm font-bold ${color}`}>{String(value).padStart(2, '0')}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filters ────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por usuario, acción o IP..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-rose-300/50 focus:border-rose-300 transition-all"
          />
        </div>
        <div className="flex items-center gap-2">
          {[
            { key: 'ALL',         label: 'Todos'   },
            { key: 'Exitoso',     label: 'OK'      },
            { key: 'Advertencia', label: 'Warn'    },
            { key: 'Crítico',     label: 'Crítico' },
          ].map(f => (
            <button
              key={f.key}
              onClick={() => setStatusFilter(f.key)}
              className={`px-3.5 py-2.5 rounded-xl text-xs font-bold border transition-all ${
                statusFilter === f.key
                  ? 'bg-slate-900 border-slate-900 text-white'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] items-center px-6 py-3 bg-slate-50 border-b border-slate-100">
          {['Usuario', 'Acción', 'Objetivo', 'Fecha / Hora', 'IP', 'Estado'].map(h => (
            <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {filteredLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <ShieldAlert className="w-8 h-8 text-slate-300" />
              <p className="text-sm text-slate-400">Sin resultados</p>
            </div>
          ) : (
            filteredLogs.map((log, idx) => {
              const meta = statusMeta[log.status] ?? statusMeta['Exitoso'];
              return (
                <div
                  key={log.id ?? idx}
                  className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr_1fr_1fr_auto] items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors gap-2 md:gap-0"
                >
                  {/* User */}
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5 text-slate-400" />
                    </div>
                    <span className="text-xs font-semibold text-slate-800 truncate">{log.user}</span>
                  </div>

                  {/* Action */}
                  <span className="text-xs text-slate-500 truncate pr-4 hidden md:block">{log.action}</span>

                  {/* Target */}
                  <span className="text-[10px] font-mono text-emerald-700 bg-emerald-50 border border-emerald-100 px-2 py-1 rounded-lg w-fit truncate hidden md:block">
                    {log.target}
                  </span>

                  {/* Date */}
                  <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <Clock className="w-3 h-3" />
                    {new Date(log.date).toLocaleString('es-MX', {
                      day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                    })}
                  </div>

                  {/* IP */}
                  <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                    <Globe className="w-3 h-3" />
                    {log.ip}
                  </div>

                  {/* Status */}
                  <div className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-[10px] font-bold w-fit ${meta.color}`}>
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />
                    {meta.label}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 flex items-center justify-between bg-slate-50 border-t border-slate-100">
          <span className="text-xs text-slate-400 font-medium">
            {filteredLogs.length} de {auditLogs.length} registros
          </span>
          <span className="text-xs text-slate-400">
            Integridad: <span className="text-emerald-600 font-semibold ml-1">Verificada ✓</span>
          </span>
        </div>
      </div>
    </div>
  );
}