import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  ShieldCheck, 
  Zap, 
  Clock, 
  AlertCircle,
  CheckCircle2,
  RefreshCw,
  HardDrive,
  Server
} from 'lucide-react';
import { AdminService } from '../services/adminService';
import { HealthCheckResponse } from '../types';

export default function AdminSystemMonitoringPage() {
  const [systemInfo, setSystemInfo] = useState<HealthCheckResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await AdminService.getDatabaseHealth();
      setSystemInfo(data);
    } catch (err) {
      setError('Error al cargar la información del sistema');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-[#1e3a5f] animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64 text-red-500">
        <AlertCircle className="w-8 h-8 mr-2" />
        {error}
      </div>
    );
  }

  const data = systemInfo!.data;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Monitoreo de Sistema</h1>
          <p className="text-sm text-slate-500">Estado en tiempo real de la infraestructura y servicios</p>
        </div>
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold border ${data.conectado ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-red-50 text-red-700 border-red-100'}`}>
          <span className={`size-2 rounded-full animate-pulse ${data.conectado ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
          {data.estado}
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Uptime', value: data.tiempoActividad, icon: <Clock className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Conexiones Activas', value: data.conexionesActivas, icon: <Cpu className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'Conexiones Max', value: data.conexionesMaximas, icon: <Zap className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Tiempo Resp.', value: data.tiempoRespuesta, icon: <HardDrive className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        ].map((stat, idx) => (
          <div key={idx} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-2.5 rounded-xl ${stat.bg} ${stat.color}`}>
                {stat.icon}
              </div>
              <Activity className="w-4 h-4 text-slate-300" />
            </div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-2xl font-black mt-1 text-slate-900">{stat.value}</h3>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Service Status */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <Server className="w-4 h-4 text-[#1e3a5f]" /> Estado de Base de Datos
              </h3>
              <button 
                onClick={loadInfo}
                className="text-xs font-bold text-[#1e3a5f] flex items-center gap-1.5 hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Actualizar
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-700"><strong>Base de Datos:</strong> {data.baseDatos}</p>
              <p className="text-sm text-slate-700 mt-2"><strong>Servidor:</strong> {data.servidor}</p>
              <p className="text-sm text-slate-700 mt-2"><strong>Versión Postgres:</strong> {data.versionPostgres}</p>
              <p className="text-xs text-slate-500 mt-4"><strong>Consultado en:</strong> {new Date(data.consultadoEn).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* System Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1e3a5f] rounded-2xl p-6 text-white shadow-xl shadow-[#1e3a5f]/20">
            <h3 className="text-xs font-bold text-blue-200 uppercase tracking-[0.2em] mb-6">INFORMACIÓN DE NODO</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs text-blue-200">Estado</span>
                <span className="text-sm font-bold">{data.estado}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
