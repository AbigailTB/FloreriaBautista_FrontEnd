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
import { DataService } from '../services/dataService';

export default function AdminSystemMonitoringPage() {
  const [systemInfo, setSystemInfo] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadInfo = () => {
      const info = DataService.getSystemInfo();
      setSystemInfo(info);
      setLoading(false);
    };
    loadInfo();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-[#1e3a5f] animate-spin" />
      </div>
    );
  }

  const { stats, services, errorLogs, nodeInfo, security } = systemInfo;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Monitoreo de Sistema</h1>
          <p className="text-sm text-slate-500">Estado en tiempo real de la infraestructura y servicios</p>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-bold border border-emerald-100">
          <span className="size-2 bg-emerald-500 rounded-full animate-pulse"></span>
          SISTEMA OPERATIVO
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Uptime', value: stats.uptime, icon: <Clock className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'CPU Load', value: stats.cpuLoad, icon: <Cpu className="w-5 h-5" />, color: 'text-indigo-600', bg: 'bg-indigo-50' },
          { label: 'RAM Usage', value: stats.ramUsage, icon: <Zap className="w-5 h-5" />, color: 'text-amber-600', bg: 'bg-amber-50' },
          { label: 'Disk Space', value: stats.diskSpace, icon: <HardDrive className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
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
                <Server className="w-4 h-4 text-[#1e3a5f]" /> Estado de Servicios
              </h3>
              <button 
                onClick={() => {
                  setLoading(true);
                  setTimeout(() => setLoading(false), 500);
                }}
                className="text-xs font-bold text-[#1e3a5f] flex items-center gap-1.5 hover:underline"
              >
                <RefreshCw className="w-3 h-3" /> Actualizar
              </button>
            </div>
            <div className="divide-y divide-slate-100">
              {services.map((service: any, idx: number) => (
                <div key={idx} className="px-6 py-4 flex items-center justify-between hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg ${service.warning ? 'bg-amber-50 text-amber-600' : 'bg-slate-50 text-slate-500'}`}>
                      {service.type === 'database' && <Database className="w-4 h-4" />}
                      {service.type === 'gateway' && <Globe className="w-4 h-4" />}
                      {service.type === 'cdn' && <Zap className="w-4 h-4" />}
                      {service.type === 'auth' && <ShieldCheck className="w-4 h-4" />}
                      {service.type === 'search' && <Activity className="w-4 h-4" />}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{service.name}</p>
                      <p className="text-[10px] text-slate-500 font-medium">Latencia: {service.latency}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-[10px] font-bold uppercase tracking-widest ${service.warning ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {service.status}
                    </span>
                    {service.warning ? <AlertCircle className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Error Logs Preview */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-500" /> Registros de Error Recientes
              </h3>
            </div>
            <div className="p-4 space-y-3">
              {errorLogs.map((log: any, idx: number) => (
                <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex gap-3">
                  <span className="text-[10px] font-mono text-slate-400 mt-0.5">{log.time}</span>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-slate-700">{log.msg}</p>
                    <span className={`text-[9px] font-bold uppercase tracking-widest ${
                      log.level === 'Crítico' ? 'text-rose-600' : 
                      log.level === 'Seguridad' ? 'text-indigo-600' : 'text-amber-600'
                    }`}>{log.level}</span>
                  </div>
                </div>
              ))}
            </div>
            <div className="p-3 border-t border-slate-100 text-center">
              <button className="text-xs font-bold text-[#1e3a5f] hover:underline">Ver todos los logs</button>
            </div>
          </div>
        </div>

        {/* System Info Sidebar */}
        <div className="space-y-6">
          <div className="bg-[#1e3a5f] rounded-2xl p-6 text-white shadow-xl shadow-[#1e3a5f]/20">
            <h3 className="text-xs font-bold text-blue-200 uppercase tracking-[0.2em] mb-6">INFORMACIÓN DE NODO</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs text-blue-200">Versión App</span>
                <span className="text-sm font-bold">{nodeInfo.version}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs text-blue-200">Node.js</span>
                <span className="text-sm font-bold">{nodeInfo.nodeVersion}</span>
              </div>
              <div className="flex justify-between items-center border-b border-white/10 pb-3">
                <span className="text-xs text-blue-200">Región</span>
                <span className="text-sm font-bold">{nodeInfo.region}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-blue-200">SSL Status</span>
                <span className="text-xs font-bold bg-emerald-500/20 text-emerald-400 px-2 py-0.5 rounded">{nodeInfo.sslStatus}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Seguridad de Red</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Firewall Status</span>
                    <span className="text-[10px] font-bold text-emerald-600">{security.firewall}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full">
                    <div className="bg-emerald-500 h-full w-full rounded-full"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertCircle className="w-4 h-4" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between mb-1">
                    <span className="text-[10px] font-bold text-slate-500 uppercase">Amenazas Bloqueadas</span>
                    <span className="text-[10px] font-bold text-slate-900">{(security?.threatsBlocked || 0).toLocaleString()}</span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full">
                    <div className="bg-rose-500 h-full w-[15%] rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
