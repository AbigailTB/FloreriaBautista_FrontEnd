import React, { useState, useEffect, useCallback } from 'react';
import {
  ShieldAlert,
  User,
  Clock,
  Search,
  RefreshCw,
  Activity,
  Lock,
  ChevronLeft,
  ChevronRight,
  Filter,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { AuditLog } from '../../types';

const PAGE_SIZE = 20;

export default function AdminAuditPage() {
  const [logs, setLogs]             = useState<AuditLog[]>([]);
  const [total, setTotal]           = useState(0);
  const [totalPags, setTotalPags]   = useState(1);
  const [page, setPage]             = useState(1);
  const [loading, setLoading]       = useState(true);
  const [timeStr, setTimeStr]       = useState('');

  // Filtros
  const [busqueda, setBusqueda]     = useState('');
  const [entidad, setEntidad]       = useState('');
  const [accion, setAccion]         = useState('');
  const [desde, setDesde]           = useState('');
  const [hasta, setHasta]           = useState('');

  // Reloj
  useEffect(() => {
    const update = () => setTimeStr(new Date().toLocaleTimeString('es-MX', { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await AdminService.getAuditLogs({
        entidad:  entidad  || undefined,
        accion:   accion   || undefined,
        desde:    desde    || undefined,
        hasta:    hasta    || undefined,
        page,
        size: PAGE_SIZE,
      });
      setLogs(res.data.items);
      setTotal(res.data.total);
      setTotalPags(res.data.totalPaginas > 0 ? res.data.totalPaginas : 1);
    } catch {
      // silencioso — tabla vacía
    } finally {
      setLoading(false);
    }
  }, [entidad, accion, desde, hasta, page]);

  useEffect(() => { load(); }, [load]);
  useEffect(() => { setPage(1); }, [entidad, accion, desde, hasta]);

  // Búsqueda client-side sobre la página actual
  const filtered = busqueda.trim()
    ? logs.filter(l => {
        const q = busqueda.toLowerCase();
        return (
          (l.usuarioNombre  ?? '').toLowerCase().includes(q) ||
          (l.usuarioCorreo  ?? '').toLowerCase().includes(q) ||
          (l.accion         ?? '').toLowerCase().includes(q) ||
          (l.entidad        ?? '').toLowerCase().includes(q)
        );
      })
    : logs;

  const stats = {
    total,
    crear:    logs.filter(l => l.accion === 'CREAR').length,
    eliminar: logs.filter(l => l.accion === 'ELIMINAR').length,
  };

  const dateStr = new Date().toLocaleDateString('es-MX', {
    year: 'numeric', month: '2-digit', day: '2-digit',
  });

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
          <button onClick={load} disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* ── Stat chips ─────────────────────────────── */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {[
          { label: 'Total eventos', value: stats.total,    icon: Activity, color: 'text-slate-600',   bg: 'bg-slate-50',   border: 'border-slate-200'  },
          { label: 'Creaciones',    value: stats.crear,    icon: Activity, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
          { label: 'Eliminaciones', value: stats.eliminar, icon: Activity, color: 'text-rose-600',    bg: 'bg-rose-50',    border: 'border-rose-100'    },
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
      <div className="bg-white border border-slate-200 rounded-2xl p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-widest">
          <Filter className="w-3.5 h-3.5" /> Filtros
        </div>
        <div className="flex flex-wrap gap-3">
          {/* Búsqueda local */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input type="text" placeholder="Buscar en resultados..."
              value={busqueda} onChange={e => setBusqueda(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all" />
          </div>
          {/* Entidad */}
          <input type="text" placeholder="Entidad (ej. Producto)"
            value={entidad} onChange={e => setEntidad(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all w-44" />
          {/* Acción */}
          <input type="text" placeholder="Acción (ej. CREATE)"
            value={accion} onChange={e => setAccion(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all w-44" />
          {/* Desde */}
          <input type="date" value={desde} onChange={e => setDesde(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all" />
          {/* Hasta */}
          <input type="date" value={hasta} onChange={e => setHasta(e.target.value)}
            className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-rose-300/50 focus:border-rose-300 transition-all" />
          {(entidad || accion || desde || hasta) && (
            <button onClick={() => { setEntidad(''); setAccion(''); setDesde(''); setHasta(''); }}
              className="px-4 py-2.5 text-xs font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition-all">
              Limpiar
            </button>
          )}
        </div>
      </div>

      {/* ── Table ──────────────────────────────────── */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">

        {/* Column headers */}
        <div className="hidden md:grid grid-cols-[1.4fr_1.2fr_1fr_1.2fr] items-center px-6 py-3 bg-slate-50 border-b border-slate-100">
          {['Usuario', 'Acción', 'Entidad', 'Fecha / Hora'].map(h => (
            <span key={h} className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{h}</span>
          ))}
        </div>

        {/* Rows */}
        <div className="divide-y divide-slate-50">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-3">
              <RefreshCw className="w-5 h-5 text-rose-400 animate-spin" />
              <span className="text-sm text-slate-400">Cargando registros...</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2">
              <Lock className="w-8 h-8 text-slate-300" />
              <p className="text-sm text-slate-400">Sin registros de auditoría</p>
            </div>
          ) : (
            filtered.map((log, idx) => (
              <div key={log.id ?? idx}
                className="grid grid-cols-1 md:grid-cols-[1.4fr_1.2fr_1fr_1.2fr] items-center px-6 py-3.5 hover:bg-slate-50/60 transition-colors gap-2 md:gap-0">
                {/* Usuario */}
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-xs font-semibold text-slate-800 truncate block">
                      {log.usuarioNombre ?? '—'}
                    </span>
                    {log.usuarioCorreo && (
                      <span className="text-[10px] text-slate-400 truncate block">{log.usuarioCorreo}</span>
                    )}
                  </div>
                </div>
                {/* Acción */}
                <span className="text-xs text-slate-600 font-medium truncate pr-4 hidden md:block">
                  {log.accion ?? '—'}
                </span>
                {/* Entidad */}
                <span className="text-[10px] font-mono text-blue-700 bg-blue-50 border border-blue-100 px-2 py-1 rounded-lg w-fit truncate hidden md:block">
                  {log.entidad ?? '—'}
                </span>
                {/* Fecha */}
                <div className="hidden md:flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                  <Clock className="w-3 h-3 shrink-0" />
                  {new Date(log.fechaHora).toLocaleString('es-MX', {
                    day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit',
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer con paginación */}
        <div className="px-6 py-3 flex items-center justify-between bg-slate-50 border-t border-slate-100 flex-wrap gap-3">
          <span className="text-xs text-slate-400 font-medium">
            {filtered.length} de {total} registros · Página {page} de {totalPags}
          </span>
          {totalPags > 1 && (
            <div className="flex items-center gap-2">
              <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-all">
                <ChevronLeft className="w-4 h-4 text-slate-600" />
              </button>
              <span className="text-xs font-bold text-slate-600 px-2">{page}</span>
              <button onClick={() => setPage(p => Math.min(totalPags, p + 1))} disabled={page === totalPags}
                className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 transition-all">
                <ChevronRight className="w-4 h-4 text-slate-600" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
