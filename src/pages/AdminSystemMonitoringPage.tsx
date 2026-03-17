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
} from 'lucide-react';
import { AdminService } from '../services/adminService';
import { HealthCheckResponse, MaintenanceTask } from '../types';

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

  useEffect(() => {
    loadInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3">
        <RefreshCw className="w-8 h-8 text-[#1e3a5f] animate-spin" />
        <p className="text-sm text-slate-500">Consultando estado del sistema...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="text-sm font-medium">{error}</p>
        <button onClick={loadInfo} className="text-sm text-[#1e3a5f] font-bold hover:underline flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Reintentar
        </button>
      </div>
    );
  }

  const data = systemInfo!.data;
  const completadas = maintenanceResults.filter((t) => t.estado === 'COMPLETADO').length;
  const errores = maintenanceResults.filter((t) => t.estado === 'ERROR').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <span className="cursor-pointer hover:text-[#1e3a5f]">Operación técnica</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium">Monitoreo de Sistema</span>
      </nav>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Monitoreo de Sistema</h1>
          <p className="text-sm text-slate-500">Estado en tiempo real de la infraestructura y base de datos</p>
        </div>
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border ${
          data.conectado
            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
            : 'bg-red-50 text-red-700 border-red-200'
        }`}>
          <span className={`size-2 rounded-full animate-pulse ${data.conectado ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          {data.conectado ? 'Conectado' : 'Desconectado'} — {data.estado}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Uptime', value: data.tiempoActividad, icon: <Clock className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Conexiones Activas', value: `${data.conexionesActivas} / ${data.conexionesMaximas}`, icon: <Cpu className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Tiempo de Respuesta', value: data.tiempoRespuesta, icon: <Zap className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Base de Datos', value: data.baseDatos, icon: <HardDrive className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>{stat.icon}</div>
              <Activity className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-xl font-black mt-1 text-slate-900 truncate">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info técnica */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#1e3a5f]" /> Detalle de la Base de Datos
              </h3>
              <button onClick={loadInfo} className="text-xs font-bold text-[#1e3a5f] flex items-center gap-1.5 hover:underline">
                <RefreshCw className="w-3 h-3" /> Actualizar
              </button>
            </div>
            <div className="p-6 space-y-3">
              {[
                { label: 'Base de Datos', value: data.baseDatos },
                { label: 'Servidor', value: data.servidor },
                { label: 'Versión PostgreSQL', value: data.versionPostgres },
                { label: 'Consultado en', value: new Date(data.consultadoEn).toLocaleString('es-MX') },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-start py-2 border-b border-slate-50 last:border-0">
                  <span className="text-xs font-bold text-slate-400 uppercase">{row.label}</span>
                  <span className="text-sm text-slate-700 font-medium text-right max-w-xs">{row.value}</span>
                </div>
              ))}
              {data.mensajeError && (
                <div className="mt-2 p-3 bg-red-50 rounded-lg text-xs text-red-700 flex gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  {data.mensajeError}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mantenimiento */}
        <div>
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Wrench className="w-4 h-4 text-[#1e3a5f]" /> Mantenimiento de BD
              </h3>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-xs text-slate-500">
                Ejecuta VACUUM, ANALYZE y REINDEX para optimizar el rendimiento de la base de datos.
              </p>
              <button
                onClick={runMaintenance}
                disabled={maintenanceLoading}
                className="w-full bg-[#1e3a5f] hover:bg-[#1e3a5f]/90 disabled:opacity-50 text-white py-2.5 rounded-xl text-sm font-bold transition-colors flex items-center justify-center gap-2"
              >
                {maintenanceLoading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Ejecutando...</>
                  : <><Wrench className="w-4 h-4" /> Ejecutar Mantenimiento</>
                }
              </button>

              {maintenanceMsg && (
                <p className="text-xs text-center text-slate-500 italic">{maintenanceMsg}</p>
              )}

              {maintenanceResults.length > 0 && (
                <div className="space-y-2">
                  {/* Resumen */}
                  <div className="flex gap-3 text-xs font-bold">
                    <span className="text-emerald-600 flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> {completadas} OK
                    </span>
                    <span className="text-red-500 flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> {errores} Error
                    </span>
                  </div>

                  {/* Detalle por tarea */}
                  {maintenanceResults.map((task, idx) => (
                    <div
                      key={idx}
                      className={`p-3 rounded-xl text-xs border ${
                        task.estado === 'COMPLETADO'
                          ? 'bg-emerald-50 border-emerald-100 text-emerald-800'
                          : 'bg-red-50 border-red-100 text-red-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-bold">{task.tarea}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          task.estado === 'COMPLETADO' ? 'bg-emerald-200 text-emerald-800' : 'bg-red-200 text-red-800'
                        }`}>
                          {task.estado}
                        </span>
                      </div>
                      {task.detalle && <p className="text-[11px] opacity-80">{task.detalle}</p>}
                      {task.mensajeError && (
                        <p className="text-[10px] mt-1 opacity-70 break-words">{task.mensajeError}</p>
                      )}
                      <p className="text-[10px] mt-1 opacity-50">{task.duracionMs.toFixed(0)} ms</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}