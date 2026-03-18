import React, { useState, useEffect } from 'react';
import { 
  Wrench, 
  Database, 
  Activity, 
  ArrowLeftRight, 
  ShieldAlert, 
  Terminal, 
  ChevronRight,
  Settings2,
  HardDrive,
  Cloud,
  RefreshCw
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { DataService } from '../../services/dataService';
import { FadeIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';

export default function AdminOperationPage() {
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

  const operations = [
    {
      title: 'Respaldos Manuales',
      desc: 'Gestión de copias de seguridad de la base de datos y archivos multimedia.',
      icon: <Database className="w-6 h-6" />,
      path: '/admin/respaldos',
      color: 'bg-amber-50 text-amber-600',
      borderColor: 'hover:border-amber-200'
    },
    {
      title: 'Monitoreo de Sistema',
      desc: 'Estado en tiempo real de servidores, latencia y servicios externos.',
      icon: <Activity className="w-6 h-6" />,
      path: '/admin/monitoreo',
      color: 'bg-blue-50 text-blue-600',
      borderColor: 'hover:border-blue-200'
    },
    {
      title: 'Gestión de Datos',
      desc: 'Importación y exportación masiva de catálogos y registros de clientes.',
      icon: <ArrowLeftRight className="w-6 h-6" />,
      path: '/admin/datos',
      color: 'bg-emerald-50 text-emerald-600',
      borderColor: 'hover:border-emerald-200'
    },
    {
      title: 'Auditoría de Seguridad',
      desc: 'Revisión de logs de acceso, intentos fallidos y cambios de permisos.',
      icon: <ShieldAlert className="w-6 h-6" />,
      path: '/admin/auditoria',
      color: 'bg-rose-50 text-rose-600',
      borderColor: 'hover:border-rose-200'
    },
    {
      title: 'Configuración de API',
      desc: 'Gestión de llaves de acceso para integraciones con terceros.',
      icon: <Settings2 className="w-6 h-6" />,
      path: '#',
      color: 'bg-indigo-50 text-indigo-600',
      borderColor: 'hover:border-indigo-200'
    },
    {
      title: 'Consola de Comandos',
      desc: 'Interfaz de bajo nivel para mantenimiento avanzado del sistema.',
      icon: <Terminal className="w-6 h-6" />,
      path: '#',
      color: 'bg-slate-50 text-slate-600',
      borderColor: 'hover:border-slate-200'
    }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  const { stats } = systemInfo;

  return (
    <div className="w-full h-full space-y-8">
      {/* Header */}
      <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">Operación Técnica</h1>
          <p className="text-sm text-slate-500 font-medium">Herramientas de mantenimiento y diagnóstico del sistema</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-slate-100/50 text-slate-600 rounded-2xl text-[10px] font-black border border-slate-200 uppercase tracking-widest shadow-sm">
          <Wrench className="w-3.5 h-3.5" />
          MODO MANTENIMIENTO: DESACTIVADO
        </div>
      </FadeIn>

      {/* Stats Summary */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <GlassCard className="p-6 flex items-center gap-4 border-none">
          <div className="size-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
            <Cloud className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Último Respaldo</p>
            <p className="text-xl font-black text-slate-900">Hace 2 horas</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-4 border-none">
          <div className="size-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado General</p>
            <p className="text-xl font-black text-emerald-600">{stats.uptime} Online</p>
          </div>
        </GlassCard>
        <GlassCard className="p-6 flex items-center gap-4 border-none">
          <div className="size-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center shadow-sm">
            <HardDrive className="w-6 h-6" />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Espacio en Disco</p>
            <p className="text-xl font-black text-slate-900">{stats.diskSpace} Usado</p>
          </div>
        </GlassCard>
      </StaggerContainer>

      {/* Operations Grid */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {operations.map((op, idx) => (
          <Link 
            key={idx} 
            to={op.path}
            className="group"
          >
            <GlassCard className={`p-8 border-none h-full transition-all duration-300 group-hover:shadow-xl group-hover:-translate-y-1`}>
              <div className={`size-14 rounded-2xl ${op.color} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm`}>
                {op.icon}
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-2 flex items-center justify-between">
                {op.title}
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
              </h3>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                {op.desc}
              </p>
            </GlassCard>
          </Link>
        ))}
      </StaggerContainer>

      {/* Footer Info */}
      <FadeIn delay={0.5}>
        <GlassCard className="bg-slate-50/50 border-none p-8 text-center">
          <p className="text-xs text-slate-500 font-black uppercase tracking-widest leading-relaxed">
            Estas herramientas están reservadas para personal técnico autorizado. Cualquier cambio estructural queda registrado en el log de auditoría.
          </p>
        </GlassCard>
      </FadeIn>
    </div>
  );
}
