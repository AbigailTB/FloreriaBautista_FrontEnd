import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ArrowLeftRight, 
  FileJson, 
  FileSpreadsheet, 
  UploadCloud, 
  DownloadCloud, 
  AlertCircle,
  CheckCircle2,
  Clock,
  History,
  Settings2,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { DataService } from '../services/dataService';

export default function AdminDataManagementPage() {
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

  const { services } = systemInfo;

  // Map services to sync items for display
  const syncItems = services.map((s: any) => ({
    name: s.name,
    lastSync: s.latency === 'N/A' ? 'Nunca' : 'Hace poco',
    status: s.status === 'Operativo' ? 'Éxito' : 'Pendiente',
    icon: s.type === 'database' ? <Database className="w-5 h-5" /> : 
          s.type === 'gateway' ? <ArrowLeftRight className="w-5 h-5" /> :
          s.type === 'cdn' ? <FileJson className="w-5 h-5" /> : <FileSpreadsheet className="w-5 h-5" />,
    pending: s.status !== 'Operativo'
  }));

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Gestión de Datos</h1>
          <p className="text-sm text-slate-500">Importación, exportación y sincronización masiva de información</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-700 hover:bg-slate-50 transition-all">
            <History className="w-4 h-4" />
            Historial
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold hover:bg-opacity-90 shadow-lg shadow-[#1e3a5f]/20 transition-all">
            <Settings2 className="w-4 h-4" />
            Configurar API
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Export/Import Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-[#1e3a5f]/30 transition-all group cursor-pointer">
              <div className="size-12 rounded-2xl bg-blue-50 text-[#1e3a5f] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Importar Datos</h3>
              <p className="text-sm text-slate-500 mb-6">Carga masiva de productos, clientes o inventario desde archivos CSV o JSON.</p>
              <div className="flex items-center gap-2 text-[#1e3a5f] text-sm font-bold">
                Comenzar importación <ChevronRight className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-500/30 transition-all group cursor-pointer">
              <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <DownloadCloud className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Exportar Datos</h3>
              <p className="text-sm text-slate-500 mb-6">Descarga copias de seguridad de tus tablas en formatos estructurados para análisis externo.</p>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-bold">
                Generar reporte <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Sync Status */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
              <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <ArrowLeftRight className="w-4 h-4 text-[#1e3a5f]" /> Sincronización Externa
              </h3>
              <span className="text-[10px] font-bold bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded uppercase tracking-wider">Sincronizado</span>
            </div>
            <div className="p-6 space-y-6">
              {syncItems.map((sync: any, idx: number) => (
                <div key={idx} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 border border-slate-100">
                  <div className="flex items-center gap-4">
                    <div className="size-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-400">
                      {sync.icon}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-900">{sync.name}</p>
                      <p className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" /> {sync.lastSync}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-xs font-bold ${sync.pending ? 'text-amber-600' : 'text-emerald-600'}`}>
                      {sync.status}
                    </span>
                    {sync.pending ? <Clock className="w-4 h-4 text-amber-500" /> : <CheckCircle2 className="w-4 h-4 text-emerald-500" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="text-sm font-bold text-amber-900 uppercase tracking-wider">Zona de Riesgo</h3>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed mb-6">
              Las operaciones de importación masiva pueden sobrescribir datos existentes. Asegúrese de realizar un respaldo manual antes de proceder con cambios estructurales.
            </p>
            <button className="w-full py-2.5 bg-amber-600 text-white rounded-xl text-xs font-bold hover:bg-amber-700 transition-colors">
              Limpiar Caché de Datos
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm">
            <h3 className="text-sm font-bold text-slate-800 mb-4">Formatos Soportados</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-bold">CSV</div>
                  <span className="text-xs font-medium text-slate-600">Valores Coma</span>
                </div>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-bold">JSON</div>
                  <span className="text-xs font-medium text-slate-600">JavaScript Obj</span>
                </div>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg border border-slate-100">
                <div className="flex items-center gap-2">
                  <div className="size-6 rounded bg-amber-50 text-amber-600 flex items-center justify-center text-[10px] font-bold">XLSX</div>
                  <span className="text-xs font-medium text-slate-600">MS Excel</span>
                </div>
                <CheckCircle2 className="w-3 h-3 text-emerald-500" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
