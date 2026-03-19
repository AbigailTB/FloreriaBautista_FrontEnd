import React, { useState, useEffect } from 'react';
import {
  Activity,
  Cpu,
  Database,
  Clock,
  AlertCircle,
  CheckCircle2,
  XCircle,
  RefreshCw,
  HardDrive,
  Server,
  Wrench,
  Zap,
  ChevronRight,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { HealthCheckResponse, MaintenanceTask } from '../../types';

export default function AdminSystemMonitoringPage() {
  const [systemInfo, setSystemInfo] = useState<HealthCheckResponse | null>(null);
  const [maintenanceResults, setMaintenanceResults] = useState<MaintenanceTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [maintenanceLoading, setMaintenanceLoading] = useState(false);
  const [maintenanceMsg, setMaintenanceMsg] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminService.getDatabaseHealth();
      setSystemInfo(data);
    } catch (err: any) {
      setError(err.message || 'Error al cargar la información del sistema');
    } finally {
      setLoading(false);
    }
  };

  const runMaintenance = async () => {
    setMaintenanceLoading(true);
    setMaintenanceResults([]);
    setMaintenanceMsg(null);
    try {
      const response = await AdminService.runMaintenance();
      setMaintenanceResults(response.data);
      setMaintenanceMsg(response.message || 'Mantenimiento ejecutado.');
    } catch (err: any) {
      setMaintenanceMsg(err.message || 'Error al ejecutar mantenimiento');
    } finally {
      setMaintenanceLoading(false);
    }
  };

  useEffect(() => { loadInfo(); }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
        <p className="text-sm text-slate-400 font-medium">Consultando estado del sistema...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <div className="w-10 h-10 rounded-2xl bg-red-50 border border-red-100 flex items-center justify-center">
          <AlertCircle className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-sm text-red-500 font-semibold">{error}</p>
        <button
          onClick={loadInfo}
          className="flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 px-3 py-1.5 rounded-lg transition-all"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Reintentar
        </button>
      </div>
    );
  }

  const data = systemInfo!.data;
  const completadas = maintenanceResults.filter((t) => t.estado === 'COMPLETADO').length;
  const errores = maintenanceResults.filter((t) => t.estado === 'ERROR').length;
  const conectado = data.conectado;

  return (
    <div className="w-full space-y-6">

      {/* ── Breadcrumb ─────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span className="hover:text-slate-600 transition-colors cursor-pointer">Operación técnica</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Monitoreo de Sistema</span>
      </nav>

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <Activity className="w-5 h-5 text-blue-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Monitoreo de Sistema</h1>
          </div>
          <p className="text-sm text-slate-400 ml-12">Estado en tiempo real de la infraestructura</p>
        </div>

        {/* Status badge */}
        <div className={`flex items-center gap-2.5 px-4 py-2 rounded-xl border text-xs font-bold ml-12 sm:ml-0 ${
          conectado
            ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
            : 'bg-red-50 border-red-200 text-red-700'
        }`}>
          {conectado
            ? <><Wifi className="w-3.5 h-3.5" /><span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />Conectado — {data.estado}</>
            : <><WifiOff className="w-3.5 h-3.5" /><span className="w-1.5 h-1.5 rounded-full bg-red-400 animate-pulse" />Desconectado — {data.estado}</>
          }
        </div>
      </div>

      {/* ── Stat chips ─────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: 'Uptime',             value: data.tiempoActividad,                              icon: Clock,     color: 'text-blue-600',    bg: 'bg-blue-50',    border: 'border-blue-100'    },
          { label: 'Conexiones',          value: `${data.conexionesActivas} / ${data.conexionesMaximas}`, icon: Cpu,  color: 'text-indigo-600',  bg: 'bg-indigo-50',  border: 'border-indigo-100'  },
          { label: 'Tiempo de respuesta', value: data.tiempoRespuesta,                             icon: Zap,       color: 'text-amber-600',   bg: 'bg-amber-50',   border: 'border-amber-100'   },
          { label: 'Base de datos',       value: data.baseDatos,                                   icon: HardDrive, color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
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

      {/* ── Main grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* ── DB Detail card ── (3/5) */}
        <div className="lg:col-span-3 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                <Server className="w-3.5 h-3.5 text-blue-600" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Detalle de la base de datos</h3>
            </div>
            <button
              onClick={loadInfo}
              className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all"
            >
              <RefreshCw className="w-3.5 h-3.5" /> Actualizar
            </button>
          </div>

          <div className="divide-y divide-slate-50">
            {[
              { label: 'Base de datos',       value: data.baseDatos },
              { label: 'Servidor',            value: data.servidor },
              { label: 'Versión PostgreSQL',  value: data.versionPostgres },
              { label: 'Consultado en',       value: new Date(data.consultadoEn).toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' }) },
            ].map((row) => (
              <div key={row.label} className="flex items-center justify-between px-6 py-3.5 hover:bg-slate-50/60 transition-colors">
                <span className="text-xs font-semibold text-slate-400">{row.label}</span>
                <span className="text-sm font-semibold text-slate-700 text-right max-w-[60%] truncate">{row.value}</span>
              </div>
            ))}
          </div>

          {data.mensajeError && (
            <div className="mx-6 mb-5 mt-1 p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5 text-xs text-red-700 font-medium">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              {data.mensajeError}
            </div>
          )}
        </div>

        {/* ── Maintenance card ── (2/5) */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center gap-2.5 px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
            <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Wrench className="w-3.5 h-3.5 text-slate-600" />
            </div>
            <h3 className="text-sm font-bold text-slate-800">Mantenimiento de BD</h3>
          </div>

          <div className="p-6 flex flex-col gap-5 flex-1">
            <p className="text-xs text-slate-400 leading-relaxed">
              Ejecuta <span className="font-bold text-slate-600">VACUUM</span>, <span className="font-bold text-slate-600">ANALYZE</span> y <span className="font-bold text-slate-600">REINDEX</span> para optimizar el rendimiento de la base de datos.
            </p>

            <button
              onClick={runMaintenance}
              disabled={maintenanceLoading}
              className="w-full bg-slate-900 hover:bg-slate-800 active:scale-[.98] disabled:opacity-50 text-white text-xs font-bold py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
            >
              {maintenanceLoading
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" /> Ejecutando...</>
                : <><Wrench className="w-3.5 h-3.5" /> Ejecutar mantenimiento</>
              }
            </button>

            {maintenanceMsg && (
              <p className="text-xs text-center text-slate-400 font-medium">{maintenanceMsg}</p>
            )}

            {/* Results summary */}
            {maintenanceResults.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg">
                    <CheckCircle2 className="w-3.5 h-3.5" /> {completadas} OK
                  </span>
                  {errores > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-red-600 bg-red-50 border border-red-200 px-2.5 py-1 rounded-lg">
                      <XCircle className="w-3.5 h-3.5" /> {errores} Error
                    </span>
                  )}
                </div>

                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {maintenanceResults.map((task, idx) => {
                    const ok = task.estado === 'COMPLETADO';
                    return (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-xl border text-xs ${
                          ok
                            ? 'bg-emerald-50 border-emerald-100'
                            : 'bg-red-50 border-red-100'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1.5">
                          <span className={`font-bold ${ok ? 'text-emerald-800' : 'text-red-800'}`}>
                            {task.tarea}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                            ok ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                          }`}>
                            {task.estado}
                          </span>
                        </div>
                        {task.detalle && (
                          <p className={`text-[11px] ${ok ? 'text-emerald-700' : 'text-red-700'} mb-1`}>{task.detalle}</p>
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
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}