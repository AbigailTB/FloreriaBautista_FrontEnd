import React, { useState, useEffect, useCallback } from 'react';
import {
  Activity, Database, Clock, AlertCircle, CheckCircle2, XCircle,
  RefreshCw, Server, Wrench, Zap, ChevronRight, Wifi, WifiOff,
  Maximize2, Minimize2, ArrowUpDown, ArrowUp, ArrowDown, AlertTriangle,
  Link2, BarChart2, HardDrive, Users,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { HealthCheckResponse, MaintenanceTask, DatabaseMonitorData } from '../../types';

type SortField = 'totalFilas' | 'tamanoTotalBytes';
type SortDir   = 'asc' | 'desc';

function timeAgo(iso: string) {
  const diff = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (diff < 60)   return `hace ${diff}s`;
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}min`;
  return `hace ${Math.floor(diff / 3600)}h`;
}

export default function AdminSystemMonitoringPage() {
  const [tab,        setTab]        = useState<'estado' | 'monitor'>('estado');
  const [fullscreen, setFullscreen] = useState(false);

  // ── Estado ──
  const [systemInfo,          setSystemInfo]          = useState<HealthCheckResponse | null>(null);
  const [maintenanceResults,  setMaintenanceResults]  = useState<MaintenanceTask[]>([]);
  const [loadingState,        setLoadingState]        = useState(true);
  const [maintenanceLoading,  setMaintenanceLoading]  = useState(false);
  const [maintenanceMsg,      setMaintenanceMsg]      = useState<string | null>(null);
  const [stateError,          setStateError]          = useState<string | null>(null);

  // ── Monitor ──
  const [monitor,        setMonitor]        = useState<DatabaseMonitorData | null>(null);
  const [loadingMonitor, setLoadingMonitor] = useState(false);
  const [monitorError,   setMonitorError]   = useState<string | null>(null);
  const [sortField,      setSortField]      = useState<SortField>('tamanoTotalBytes');
  const [sortDir,        setSortDir]        = useState<SortDir>('desc');
  const [expandedQuery,  setExpandedQuery]  = useState<string | null>(null);

  const loadInfo = useCallback(async () => {
    setLoadingState(true); setStateError(null);
    try { setSystemInfo(await AdminService.getDatabaseHealth()); }
    catch (err: any) { setStateError(err.message || 'Error al cargar estado del sistema'); }
    finally { setLoadingState(false); }
  }, []);

  const loadMonitor = useCallback(async () => {
    setLoadingMonitor(true); setMonitorError(null);
    try { const res = await AdminService.getDatabaseMonitor(); setMonitor(res.data); }
    catch (err: any) { setMonitorError(err.message || 'Error al cargar monitor de BD'); }
    finally { setLoadingMonitor(false); }
  }, []);

  const runMaintenance = async () => {
    setMaintenanceLoading(true); setMaintenanceResults([]); setMaintenanceMsg(null);
    try {
      const res = await AdminService.runMaintenance();
      setMaintenanceResults(res.data);
      setMaintenanceMsg(res.message || 'Mantenimiento ejecutado.');
    } catch (err: any) { setMaintenanceMsg(err.message || 'Error al ejecutar mantenimiento'); }
    finally { setMaintenanceLoading(false); }
  };

  useEffect(() => { loadInfo(); }, [loadInfo]);
  useEffect(() => { if (tab === 'monitor' && !monitor) loadMonitor(); }, [tab, monitor, loadMonitor]);

  const toggleSort = (field: SortField) => {
    if (sortField === field) setSortDir(d => d === 'asc' ? 'desc' : 'asc');
    else { setSortField(field); setSortDir('desc'); }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className="w-3 h-3 text-slate-300" />;
    return sortDir === 'asc' ? <ArrowUp className="w-3 h-3 text-blue-500" /> : <ArrowDown className="w-3 h-3 text-blue-500" />;
  };

  const sortedTablas = monitor
    ? [...monitor.tablas].sort((a, b) =>
        sortDir === 'asc' ? (a[sortField] as number) - (b[sortField] as number) : (b[sortField] as number) - (a[sortField] as number))
    : [];

  const cacheColor = monitor
    ? monitor.estadisticas.porcentajeCacheHit >= 99
      ? 'text-emerald-600 bg-emerald-50 border-emerald-200'
      : monitor.estadisticas.porcentajeCacheHit >= 95
        ? 'text-amber-600 bg-amber-50 border-amber-200'
        : 'text-red-600 bg-red-50 border-red-200'
    : '';

  const pgStatDisabled = monitor?.queriesLentos?.[0]?.query?.toLowerCase().includes('pg_stat_statements') ?? false;
  const conectado = systemInfo?.data.conectado;

  // ── Shared styles ──
  const thClass = "px-4 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap";

  return (
    <div className={fullscreen ? 'fixed inset-0 z-50 bg-slate-50 overflow-auto p-6 flex flex-col' : 'w-full flex flex-col gap-5'}>

      {/* ── Header ── */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium mb-3">
          <span className="hover:text-slate-600 transition-colors cursor-pointer">Operación técnica</span>
          <ChevronRight className="w-3 h-3" />
          <span className="text-slate-700">Monitoreo de Sistema</span>
        </nav>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">Monitoreo de Sistema</h1>
              <p className="text-xs text-slate-400">Estado e infraestructura de base de datos</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {tab === 'estado' && systemInfo && (
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-bold ${conectado ? 'bg-emerald-50 border-emerald-200 text-emerald-700' : 'bg-red-50 border-red-200 text-red-700'}`}>
                {conectado
                  ? <><Wifi className="w-3.5 h-3.5" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Conectado</>
                  : <><WifiOff className="w-3.5 h-3.5" />Desconectado</>}
              </div>
            )}
            <button onClick={() => setFullscreen(f => !f)}
              className="p-2 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 hover:border-blue-200 transition-all">
              {fullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>

      {/* ── Tabs ── */}
      <div className="flex gap-0.5 bg-slate-100 p-1 rounded-xl w-fit">
        {([['estado', 'Estado del Sistema', Server], ['monitor', 'Monitor de BD', BarChart2]] as const).map(([key, label, Icon]) => (
          <button key={key} onClick={() => setTab(key)}
            className={`flex items-center gap-2 px-5 py-2 rounded-lg text-xs font-black transition-all ${tab === key ? 'bg-white shadow-sm text-blue-600' : 'text-slate-500 hover:text-slate-700'}`}>
            <Icon className="w-3.5 h-3.5" />{label}
          </button>
        ))}
      </div>

      {/* ════════ TAB: ESTADO ════════ */}
      {tab === 'estado' && (
        <div className="space-y-5">
          {loadingState ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-400">Consultando estado del sistema...</p>
            </div>
          ) : stateError ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <AlertCircle className="w-7 h-7 text-red-400" />
              <p className="text-sm text-red-500 font-semibold">{stateError}</p>
              <button onClick={loadInfo} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                <RefreshCw className="w-3.5 h-3.5" />Reintentar
              </button>
            </div>
          ) : systemInfo && (
            <>
              {/* Stat chips */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Uptime',       value: systemInfo.data.tiempoActividad,                                     icon: Clock,     color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100'    },
                  { label: 'Conexiones',   value: `${systemInfo.data.conexionesActivas} / ${systemInfo.data.conexionesMaximas}`, icon: Users,     color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100'  },
                  { label: 'Tiempo resp.', value: systemInfo.data.tiempoRespuesta,                                     icon: Zap,       color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
                  { label: 'Base de datos',value: systemInfo.data.baseDatos,                                           icon: HardDrive, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
                ].map(({ label, value, icon: Icon, color, bg, border }) => (
                  <div key={label} className={`rounded-xl border ${border} ${bg} px-4 py-3 flex items-center gap-3`}>
                    <Icon className={`w-4 h-4 ${color} shrink-0`} />
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                      <p className={`text-sm font-bold ${color} truncate`}>{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* DB detail + Maintenance — aligned grid */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

                {/* DB detail */}
                <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                    <div className="flex items-center gap-2.5">
                      <Server className="w-4 h-4 text-blue-600" />
                      <h3 className="text-sm font-bold text-slate-800">Detalle de la base de datos</h3>
                    </div>
                    <button onClick={loadInfo}
                      className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all">
                      <RefreshCw className="w-3.5 h-3.5" />Actualizar
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {[
                      { label: 'Base de datos',     value: systemInfo.data.baseDatos },
                      { label: 'Servidor',           value: systemInfo.data.servidor },
                      { label: 'Versión PostgreSQL', value: systemInfo.data.versionPostgres },
                      { label: 'Consultado en',      value: new Date(systemInfo.data.consultadoEn).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                        <span className="text-xs font-semibold text-slate-400">{row.label}</span>
                        <span className="text-sm font-semibold text-slate-700 text-right max-w-[60%] truncate">{row.value}</span>
                      </div>
                    ))}
                  </div>
                  {systemInfo.data.mensajeError && (
                    <div className="mx-6 mb-5 mt-1 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />{systemInfo.data.mensajeError}
                    </div>
                  )}
                </div>

                {/* ── Maintenance panel ── */}
                <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                    <Wrench className="w-4 h-4 text-slate-600" />
                    <h3 className="text-sm font-bold text-slate-800">Mantenimiento de BD</h3>
                  </div>

                  <div className="p-5 space-y-4">
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Ejecuta <strong className="text-slate-600">VACUUM</strong>, <strong className="text-slate-600">ANALYZE</strong> y <strong className="text-slate-600">REINDEX</strong> para optimizar el rendimiento.
                    </p>

                    <button onClick={runMaintenance} disabled={maintenanceLoading}
                      className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[.98] disabled:opacity-50 text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm">
                      {maintenanceLoading
                        ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Ejecutando...</>
                        : <><Wrench className="w-3.5 h-3.5" />Ejecutar mantenimiento</>}
                    </button>

                    {maintenanceMsg && (
                      <p className="text-xs text-center text-slate-400 font-medium">{maintenanceMsg}</p>
                    )}

                    {/* ── Results — NO max-height, NO overflow ── */}
                    {maintenanceResults.length > 0 && (
                      <div className="space-y-2.5">
                        {/* Summary badges */}
                        <div className="flex items-center gap-2 pb-1">
                          {(() => {
                            const comp = maintenanceResults.filter(t => t.estado === 'COMPLETADO').length;
                            const err  = maintenanceResults.filter(t => t.estado === 'ERROR').length;
                            return (
                              <>
                                <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                                  <CheckCircle2 className="w-3.5 h-3.5" />{comp} OK
                                </span>
                                {err > 0 && (
                                  <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                                    <XCircle className="w-3.5 h-3.5" />{err} Error
                                  </span>
                                )}
                              </>
                            );
                          })()}
                        </div>

                        {/* Task cards — full height, no scroll container */}
                        {maintenanceResults.map((task, idx) => {
                          const ok = task.estado === 'COMPLETADO';
                          return (
                            <div key={idx}
                              className={`rounded-xl border p-3.5 ${ok ? 'bg-emerald-50 border-emerald-100' : 'bg-red-50 border-red-100'}`}>
                              <div className="flex items-center justify-between mb-1.5">
                                <span className={`text-xs font-bold ${ok ? 'text-emerald-800' : 'text-red-800'}`}>
                                  {task.tarea}
                                </span>
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${ok ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'}`}>
                                  {task.estado}
                                </span>
                              </div>
                              {task.detalle && (
                                <p className={`text-[11px] mb-1 ${ok ? 'text-emerald-700' : 'text-red-700'}`}>{task.detalle}</p>
                              )}
                              {task.mensajeError && (
                                <p className="text-[10px] text-red-600 font-semibold break-words">{task.mensajeError}</p>
                              )}
                              <p className={`text-[10px] mt-1.5 font-semibold ${ok ? 'text-emerald-500' : 'text-red-400'}`}>
                                {task.duracionMs.toFixed(0)} ms
                              </p>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ════════ TAB: MONITOR ════════ */}
      {tab === 'monitor' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            {monitor && (
              <span className="text-xs text-slate-400 font-medium flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                Generado {timeAgo(monitor.generadoEn)} — {new Date(monitor.generadoEn).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}
              </span>
            )}
            <button onClick={loadMonitor} disabled={loadingMonitor}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all ml-auto">
              <RefreshCw className={`w-3.5 h-3.5 ${loadingMonitor ? 'animate-spin' : ''}`} />Actualizar
            </button>
          </div>

          {loadingMonitor && !monitor ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <RefreshCw className="w-7 h-7 text-blue-500 animate-spin" />
              <p className="text-sm text-slate-400">Consultando monitor de base de datos...</p>
            </div>
          ) : monitorError ? (
            <div className="flex flex-col items-center justify-center h-48 gap-3">
              <AlertCircle className="w-7 h-7 text-red-400" />
              <p className="text-sm text-red-500 font-semibold">{monitorError}</p>
              <button onClick={loadMonitor} className="flex items-center gap-1.5 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-1.5 rounded-lg">
                <RefreshCw className="w-3.5 h-3.5" />Reintentar
              </button>
            </div>
          ) : monitor && (
            <>
              {/* KPI chips */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: 'Tamaño total BD',  value: monitor.estadisticas.tamanoTotalBd,                                                         icon: HardDrive, extraClass: 'bg-white border-slate-200 text-blue-600' },
                  { label: 'Transacciones',    value: monitor.estadisticas.totalTransacciones.toLocaleString(),                                    icon: Activity,  extraClass: 'bg-white border-slate-200 text-indigo-600' },
                  { label: 'Cache Hit',        value: `${monitor.estadisticas.porcentajeCacheHit.toFixed(1)}%`,                                    icon: Zap,       extraClass: cacheColor },
                  { label: 'Último Vacuum',    value: new Date(monitor.estadisticas.fechaUltimoVacuum).toLocaleDateString('es-MX', { day: 'numeric', month: 'short', year: 'numeric' }), icon: Clock, extraClass: 'bg-white border-slate-200 text-emerald-600' },
                ].map(({ label, value, icon: Icon, extraClass }) => (
                  <div key={label} className={`rounded-xl border px-4 py-3 flex items-center gap-3 ${extraClass}`}>
                    <Icon className="w-4 h-4 shrink-0" />
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
                      <p className="text-sm font-bold">{value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Tablas */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
                  <Database className="w-4 h-4 text-blue-500" />
                  <h3 className="text-sm font-bold text-slate-800">Tablas y tamaños</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        <th className={thClass}>Tabla</th>
                        <th className={thClass}>
                          <button onClick={() => toggleSort('totalFilas')} className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                            Total filas <SortIcon field="totalFilas" />
                          </button>
                        </th>
                        <th className={thClass}>Tabla</th>
                        <th className={thClass}>Índices</th>
                        <th className={thClass}>
                          <button onClick={() => toggleSort('tamanoTotalBytes')} className="flex items-center gap-1.5 hover:text-slate-700 transition-colors">
                            Total <SortIcon field="tamanoTotalBytes" />
                          </button>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {sortedTablas.map(t => (
                        <tr key={t.nombreTabla} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-5 py-3 font-bold text-slate-800">{t.nombreTabla}</td>
                          <td className="px-5 py-3 text-slate-600">{t.totalFilas.toLocaleString()}</td>
                          <td className="px-5 py-3 text-slate-500">{t.tamanoTabla}</td>
                          <td className="px-5 py-3 text-slate-500">{t.tamanoIndices}</td>
                          <td className="px-5 py-3 font-semibold text-slate-700">{t.tamanoTotal}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Conexiones activas */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
                  <Link2 className="w-4 h-4 text-indigo-500" />
                  <h3 className="text-sm font-bold text-slate-800">Conexiones activas</h3>
                  <span className="ml-1 px-2 py-0.5 bg-indigo-50 text-indigo-600 text-[10px] font-bold rounded-full">{monitor.conexiones.length}</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-100">
                        {['PID','Usuario','Base de datos','Estado','IP cliente','Duración','Query actual'].map(h => (
                          <th key={h} className={thClass}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {monitor.conexiones.map(c => (
                        <tr key={c.pid} className="hover:bg-slate-50/70 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs text-slate-600">{c.pid}</td>
                          <td className="px-4 py-3 text-slate-700 font-medium">{c.usuario}</td>
                          <td className="px-4 py-3 text-slate-600">{c.baseDatos}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase ${c.estado === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                              {c.estado}
                            </span>
                          </td>
                          <td className="px-4 py-3 font-mono text-xs text-slate-500">{c.ipCliente}</td>
                          <td className="px-4 py-3 text-xs text-slate-500 whitespace-nowrap">{c.duracionQuery}</td>
                          <td className="px-4 py-3 max-w-[200px]">
                            <button onClick={() => setExpandedQuery(expandedQuery === String(c.pid) ? null : String(c.pid))}
                              className="text-xs text-slate-500 hover:text-blue-600 text-left truncate max-w-full transition-colors" title={c.queryActual}>
                              {c.queryActual?.substring(0, 50)}{c.queryActual?.length > 50 ? '…' : ''}
                            </button>
                            {expandedQuery === String(c.pid) && (
                              <div className="mt-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs font-mono text-slate-700 break-all max-h-32 overflow-auto">
                                {c.queryActual}
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {monitor.conexiones.length === 0 && (
                    <p className="text-center text-sm text-slate-400 py-8">Sin conexiones activas</p>
                  )}
                </div>
              </div>

              {/* Índices sin uso */}
              {monitor.indicesSinUso.length > 0 && (
                <div className="bg-white rounded-2xl border border-amber-200 shadow-sm overflow-hidden">
                  <div className="flex items-center gap-2 px-5 py-3.5 border-b border-amber-100 bg-amber-50">
                    <AlertTriangle className="w-4 h-4 text-amber-500" />
                    <h3 className="text-sm font-bold text-amber-800">Índices sin uso</h3>
                    <span className="ml-1 px-2 py-0.5 bg-amber-100 text-amber-700 text-[10px] font-bold rounded-full">{monitor.indicesSinUso.length}</span>
                    <span className="ml-auto text-xs text-amber-600 font-medium">Considerar revisión con el administrador técnico</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-amber-50/50 border-b border-amber-100">
                          {['Nombre índice','Tabla','Columnas','Veces usado','Tamaño','Recomendación'].map(h => (
                            <th key={h} className="px-4 py-3 text-[10px] font-bold text-amber-700 uppercase tracking-wider whitespace-nowrap">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-amber-50">
                        {monitor.indicesSinUso.map(idx => (
                          <tr key={idx.nombreIndice} className="hover:bg-amber-50/50 transition-colors">
                            <td className="px-4 py-3 font-mono text-xs text-slate-700 font-semibold">{idx.nombreIndice}</td>
                            <td className="px-4 py-3 text-slate-600">{idx.nombreTabla}</td>
                            <td className="px-4 py-3 font-mono text-xs text-slate-500">{idx.columnas}</td>
                            <td className="px-4 py-3">
                              <span className="px-2.5 py-1 bg-red-50 text-red-600 text-[10px] font-bold rounded-lg">{idx.vecesUsado}</span>
                            </td>
                            <td className="px-4 py-3 text-slate-500">{idx.tamano}</td>
                            <td className="px-4 py-3 text-xs text-amber-700 font-medium">{idx.recomendacion}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* Queries lentos */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="flex items-center gap-2 px-5 py-3.5 border-b border-slate-100">
                  <Zap className="w-4 h-4 text-red-500" />
                  <h3 className="text-sm font-bold text-slate-800">Queries lentos</h3>
                </div>
                {pgStatDisabled ? (
                  <div className="p-6">
                    <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-amber-800 mb-1">Extensión pg_stat_statements no habilitada</p>
                        <p className="text-xs text-amber-700">Consultar a soporte técnico para habilitar <code className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">pg_stat_statements</code> en PostgreSQL.</p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          {['Query','Tiempo promedio (ms)','Veces ejecutado','Tiempo total (ms)','Base de datos'].map(h => (
                            <th key={h} className={thClass}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {monitor.queriesLentos.map((q, i) => (
                          <tr key={i} className="hover:bg-slate-50/70 transition-colors">
                            <td className="px-4 py-3 max-w-[240px]">
                              <span className="text-xs font-mono text-slate-700 truncate block" title={q.query}>
                                {q.query.substring(0, 80)}{q.query.length > 80 ? '…' : ''}
                              </span>
                            </td>
                            <td className="px-4 py-3 text-slate-600">{q.tiempoPromedioMs.toFixed(2)}</td>
                            <td className="px-4 py-3 text-slate-600">{q.vecesEjecutado.toLocaleString()}</td>
                            <td className="px-4 py-3 text-slate-600">{q.tiempoTotalMs.toFixed(2)}</td>
                            <td className="px-4 py-3 text-slate-500">{q.baseDatos}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    {monitor.queriesLentos.length === 0 && (
                      <p className="text-center text-sm text-slate-400 py-8">Sin queries lentos registrados</p>
                    )}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
}