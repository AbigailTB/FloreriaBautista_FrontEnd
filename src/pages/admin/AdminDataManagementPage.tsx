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
import { DataService } from '../../services/dataService';
import { FadeIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';

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
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
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
    <div className="w-full h-full space-y-8">
      {/* Header */}
      <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Gestión de Datos</h1>
          <p className="text-sm text-slate-500 font-medium">Importación, exportación y sincronización masiva de información</p>
        </div>
        <div className="flex items-center gap-3">
          <AnimatedButton className="flex items-center gap-2 px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-700 hover:bg-slate-50 transition-all shadow-sm">
            <History className="w-4 h-4" />
            Historial
          </AnimatedButton>
          <AnimatedButton className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all">
            <Settings2 className="w-4 h-4" />
            Configurar API
          </AnimatedButton>
        </div>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Actions */}
        <div className="lg:col-span-2 space-y-8">
          {/* Export/Import Cards */}
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GlassCard className="p-8 border-none group cursor-pointer">
              <div className="size-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <UploadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Importar Datos</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">Carga masiva de productos, clientes o inventario desde archivos CSV o JSON.</p>
              <div className="flex items-center gap-2 text-blue-600 text-sm font-black group-hover:translate-x-1 transition-transform">
                Comenzar importación <ChevronRight className="w-4 h-4" />
              </div>
            </GlassCard>

            <GlassCard className="p-8 border-none group cursor-pointer">
              <div className="size-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm">
                <DownloadCloud className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2">Exportar Datos</h3>
              <p className="text-sm text-slate-500 mb-8 font-medium leading-relaxed">Descarga copias de seguridad de tus tablas en formatos estructurados para análisis externo.</p>
              <div className="flex items-center gap-2 text-emerald-600 text-sm font-black group-hover:translate-x-1 transition-transform">
                Generar reporte <ChevronRight className="w-4 h-4" />
              </div>
            </GlassCard>
          </StaggerContainer>

          {/* Sync Status */}
          <FadeIn delay={0.3}>
            <GlassCard className="border-none overflow-hidden">
              <div className="px-6 py-5 border-b border-slate-100 flex justify-between items-center bg-slate-50/30">
                <h3 className="text-sm font-black text-slate-800 flex items-center gap-2 uppercase tracking-widest">
                  <ArrowLeftRight className="w-4 h-4 text-blue-600" /> Sincronización Externa
                </h3>
                <span className="text-[10px] font-black bg-emerald-100 text-emerald-700 px-3 py-1 rounded-xl uppercase tracking-widest shadow-sm">Sincronizado</span>
              </div>
              <div className="p-6 space-y-4">
                {syncItems.map((sync: any, idx: number) => (
                  <FadeIn key={idx} delay={0.1 * idx}>
                    <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="size-12 rounded-2xl bg-white border border-slate-100 flex items-center justify-center text-slate-400 shadow-sm group-hover:scale-110 transition-transform">
                          {sync.icon}
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900">{sync.name}</p>
                          <p className="text-xs text-slate-500 font-bold flex items-center gap-1.5 mt-0.5">
                            <Clock className="w-3.5 h-3.5 text-slate-400" /> {sync.lastSync}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase tracking-widest ${sync.pending ? 'text-amber-600' : 'text-emerald-600'}`}>
                          {sync.status}
                        </span>
                        {sync.pending ? <Clock className="w-5 h-5 text-amber-500" /> : <CheckCircle2 className="w-5 h-5 text-emerald-500" />}
                      </div>
                    </div>
                  </FadeIn>
                ))}
              </div>
            </GlassCard>
          </FadeIn>
        </div>

        {/* Sidebar Info */}
        <StaggerContainer className="space-y-6">
          <GlassCard className="bg-amber-50/50 border-amber-200 p-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <h3 className="text-xs font-black text-amber-900 uppercase tracking-widest">Zona de Riesgo</h3>
            </div>
            <p className="text-xs text-amber-800 leading-relaxed mb-8 font-bold">
              Las operaciones de importación masiva pueden sobrescribir datos existentes. Asegúrese de realizar un respaldo manual antes de proceder con cambios estructurales.
            </p>
            <AnimatedButton className="w-full py-3.5 bg-amber-600 text-white rounded-2xl text-xs font-black hover:bg-amber-700 transition-colors shadow-lg shadow-amber-600/20">
              Limpiar Caché de Datos
            </AnimatedButton>
          </GlassCard>

          <GlassCard className="p-8 border-none">
            <h3 className="text-xs font-black text-slate-800 mb-6 uppercase tracking-widest">Formatos Soportados</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center text-[10px] font-black shadow-sm">CSV</div>
                  <span className="text-xs font-bold text-slate-600">Valores Coma</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center text-[10px] font-black shadow-sm">JSON</div>
                  <span className="text-xs font-bold text-slate-600">JavaScript Obj</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-2xl border border-slate-100 bg-slate-50/50">
                <div className="flex items-center gap-3">
                  <div className="size-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center text-[10px] font-black shadow-sm">XLSX</div>
                  <span className="text-xs font-bold text-slate-600">MS Excel</span>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              </div>
            </div>
          </GlassCard>
        </StaggerContainer>
      </div>
    </div>
  );
}
