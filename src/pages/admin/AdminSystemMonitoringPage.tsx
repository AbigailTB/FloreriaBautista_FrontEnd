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
import { AdminService } from '../../services/adminService';
import { HealthCheckResponse, MaintenanceTask } from '../../types';
import { FadeIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';

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
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
        <p className="text-sm text-slate-500 font-medium">Consultando estado del sistema...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-3 text-red-500">
        <AlertCircle className="w-10 h-10" />
        <p className="text-sm font-black">{error}</p>
        <AnimatedButton onClick={loadInfo} className="text-sm text-blue-600 font-black hover:underline flex items-center gap-1">
          <RefreshCw className="w-4 h-4" /> Reintentar
        </AnimatedButton>
      </div>
    );
  }

  const data = systemInfo!.data;
  const completadas = maintenanceResults.filter((t) => t.estado === 'COMPLETADO').length;
  const errores = maintenanceResults.filter((t) => t.estado === 'ERROR').length;

  return (
    <div className="w-full h-full space-y-8">
      {/* Breadcrumb & Header */}
      <div className="space-y-4">
        <FadeIn>
          <nav className="flex items-center gap-2 text-xs text-slate-400 font-black uppercase tracking-widest">
            <span className="cursor-pointer hover:text-blue-600 transition-colors">Operación técnica</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-900">Monitoreo de Sistema</span>
          </nav>
        </FadeIn>

        <FadeIn delay={0.1} className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Monitoreo de Sistema</h1>
            <p className="text-sm text-slate-500 font-medium">Estado en tiempo real de la infraestructura y base de datos</p>
          </div>
          <div className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-[10px] font-black border uppercase tracking-widest shadow-sm ${
            data.conectado
              ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
              : 'bg-red-50 text-red-700 border-red-100'
          }`}>
            <span className={`size-2 rounded-full animate-pulse ${data.conectado ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
            {data.conectado ? 'Conectado' : 'Desconectado'} — {data.estado}
          </div>
        </FadeIn>
      </div>

      {/* Stats Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Uptime', value: data.tiempoActividad, icon: <Clock className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Conexiones Activas', value: `${data.conexionesActivas} / ${data.conexionesMaximas}`, icon: <Cpu className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Tiempo de Respuesta', value: data.tiempoRespuesta, icon: <Zap className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Base de Datos', value: data.baseDatos, icon: <HardDrive className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, idx) => (
          <GlassCard key={idx} className="p-6 border-none hover:shadow-lg transition-all group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-2xl ${stat.bg} ${stat.color} shadow-sm group-hover:scale-110 transition-transform`}>{stat.icon}</div>
              <Activity className="w-4 h-4 text-slate-200" />
            </div>
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-xl font-black mt-1 text-slate-900 truncate">{stat.value}</h3>
          </GlassCard>
        ))}
      </StaggerContainer>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Info técnica */}
        <FadeIn delay={0.3} className="lg:col-span-2">
          <GlassCard className="border-none overflow-hidden h-full">
            <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                <Server className="w-4 h-4 text-blue-600" /> Detalle de la Base de Datos
              </h3>
              <AnimatedButton onClick={loadInfo} className="text-[10px] font-black text-blue-600 flex items-center gap-2 uppercase tracking-widest hover:bg-slate-100 px-3 py-1.5 rounded-xl transition-all">
                <RefreshCw className="w-3.5 h-3.5" /> Actualizar
              </AnimatedButton>
            </div>
            <div className="p-6 space-y-4">
              {[
                { label: 'Base de Datos', value: data.baseDatos },
                { label: 'Servidor', value: data.servidor },
                { label: 'Versión PostgreSQL', value: data.versionPostgres },
                { label: 'Consultado en', value: new Date(data.consultadoEn).toLocaleString('es-MX') },
              ].map((row) => (
                <div key={row.label} className="flex justify-between items-start py-3 border-b border-slate-50 last:border-0">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{row.label}</span>
                  <span className="text-sm text-slate-700 font-bold text-right max-w-xs">{row.value}</span>
                </div>
              ))}
              {data.mensajeError && (
                <div className="mt-4 p-4 bg-red-50 rounded-2xl text-xs text-red-700 font-bold flex gap-3 shadow-sm">
                  <AlertCircle className="w-5 h-5 shrink-0 text-red-500" />
                  {data.mensajeError}
                </div>
              )}
            </div>
          </GlassCard>
        </FadeIn>

        {/* Mantenimiento */}
        <FadeIn delay={0.4}>
          <GlassCard className="border-none overflow-hidden">
            <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                <Wrench className="w-4 h-4 text-blue-600" /> Mantenimiento de BD
              </h3>
            </div>
            <div className="p-6 space-y-6">
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Ejecuta VACUUM, ANALYZE y REINDEX para optimizar el rendimiento de la base de datos.
              </p>
              <AnimatedButton
                onClick={runMaintenance}
                disabled={maintenanceLoading}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white py-4 rounded-2xl text-xs font-black transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
              >
                {maintenanceLoading
                  ? <><RefreshCw className="w-4 h-4 animate-spin" /> Ejecutando...</>
                  : <><Wrench className="w-4 h-4" /> Ejecutar Mantenimiento</>
                }
              </AnimatedButton>

              {maintenanceMsg && (
                <p className="text-xs text-center text-slate-400 font-black uppercase tracking-widest italic">{maintenanceMsg}</p>
              )}

              {maintenanceResults.length > 0 && (
                <div className="space-y-3">
                  {/* Resumen */}
                  <div className="flex gap-4 text-[10px] font-black uppercase tracking-widest">
                    <span className="text-emerald-600 flex items-center gap-1.5">
                      <CheckCircle2 className="w-4 h-4" /> {completadas} OK
                    </span>
                    <span className="text-red-500 flex items-center gap-1.5">
                      <XCircle className="w-4 h-4" /> {errores} Error
                    </span>
                  </div>

                  {/* Detalle por tarea */}
                  <StaggerContainer className="space-y-2">
                    {maintenanceResults.map((task, idx) => (
                      <FadeIn key={idx} delay={0.1 * idx}>
                        <div
                          className={`p-4 rounded-2xl text-xs border shadow-sm ${
                            task.estado === 'COMPLETADO'
                              ? 'bg-emerald-50/50 border-emerald-100 text-emerald-800'
                              : 'bg-red-50/50 border-red-100 text-red-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-black uppercase tracking-widest">{task.tarea}</span>
                            <span className={`text-[10px] font-black px-2 py-1 rounded-xl uppercase tracking-widest shadow-sm ${
                              task.estado === 'COMPLETADO' ? 'bg-emerald-200 text-emerald-900' : 'bg-red-200 text-red-900'
                            }`}>
                              {task.estado}
                            </span>
                          </div>
                          {task.detalle && <p className="text-[11px] font-bold opacity-80">{task.detalle}</p>}
                          {task.mensajeError && (
                            <p className="text-[10px] mt-2 font-black uppercase tracking-widest opacity-70 break-words">{task.mensajeError}</p>
                          )}
                          <p className="text-[10px] mt-2 font-black uppercase tracking-widest opacity-40">{task.duracionMs.toFixed(0)} ms</p>
                        </div>
                      </FadeIn>
                    ))}
                  </StaggerContainer>
                </div>
              )}
            </div>
          </GlassCard>
        </FadeIn>
      </div>
    </div>
  );
}