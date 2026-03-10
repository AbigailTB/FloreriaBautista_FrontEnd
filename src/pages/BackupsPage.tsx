import React from 'react';
import { 
  ChevronRight, 
  Database, 
  CloudUpload, 
  PlusCircle, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Download,
  Info
} from 'lucide-react';

export default function BackupsPage() {
  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <span className="hover:text-[#1e40af] transition-colors cursor-pointer">Operación técnica</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium">Respaldos Manuales</span>
      </nav>

      {/* Title Section */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Respaldos Manuales
            <Database className="w-8 h-8 text-amber-600" />
          </h2>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Asegure la integridad de la base de datos y los archivos multimedia de Florería Bautista. Estos respaldos son críticos ante actualizaciones o mantenimientos preventivos.
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4 border border-blue-100">
          <CloudUpload className="w-8 h-8 text-[#1e40af]" />
          <div>
            <p className="text-xs font-bold uppercase text-[#1e40af]">Estado del Servidor</p>
            <p className="text-sm font-medium text-slate-700">Conectado y Seguro</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Back Up Form */}
        <section className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-2 mb-6">
              <PlusCircle className="w-5 h-5 text-[#1e40af]" />
              <h3 className="text-lg font-bold text-slate-900">Nuevo Respaldo</h3>
            </div>
            <form className="flex flex-col gap-5">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Tipo de respaldo</label>
                <select className="rounded-xl border-slate-200 bg-slate-50 text-sm focus:ring-[#1e40af] focus:border-[#1e40af]">
                  <option value="db">Solo Base de Datos (SQL)</option>
                  <option value="full">Base de Datos + Archivos Multimedia</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-slate-700">Comentario (Opcional)</label>
                <textarea 
                  className="rounded-xl border-slate-200 bg-slate-50 text-sm focus:ring-[#1e40af] focus:border-[#1e40af]" 
                  placeholder="Ej: Antes de importar nuevo catálogo de rosas..." 
                  rows={3}
                ></textarea>
              </div>
              {/* Warning */}
              <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Nota importante:</strong> Los respaldos completos pueden tardar varios minutos dependiendo del tamaño de la galería de fotos. Por favor, no cierre esta ventana durante el proceso.
                </p>
              </div>
              <button 
                className="w-full bg-[#1e40af] hover:bg-blue-700 text-white py-3 px-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#1e40af]/20" 
                type="submit"
              >
                <Database className="w-5 h-5" />
                Generar respaldo ahora
              </button>
            </form>
          </div>

          {/* Visual Progress Indicator */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-10">
              <RefreshCw className="w-16 h-16 text-[#1e40af]" />
            </div>
            <h4 className="text-sm font-bold text-slate-900 mb-4">Tarea en curso</h4>
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-slate-600">Comprimiendo archivos multimedia...</span>
              <span className="text-xs font-bold text-[#1e40af]">64%</span>
            </div>
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div className="bg-[#1e40af] h-full w-[64%] rounded-full transition-all duration-500"></div>
            </div>
            <div className="mt-4 flex items-center gap-2 text-[11px] text-slate-500">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Iniciado por Admin hace 2 minutos
            </div>
          </div>
        </section>

        {/* Backups Table */}
        <section className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Historial de Respaldos</h3>
              <button className="text-[#1e40af] text-sm font-bold flex items-center gap-1 hover:underline">
                <RefreshCw className="w-4 h-4" />
                Actualizar lista
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Fecha / Hora</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tipo</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Usuario</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Estado</th>
                    <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { date: '24 May 2024', time: '14:30:12', type: 'BD + Archivos', user: 'Admin_Bautista', status: 'Completado', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
                    { date: '23 May 2024', time: '09:15:44', type: 'Solo BD', user: 'Soporte_Gen', status: 'En progreso', color: 'bg-blue-100 text-blue-700', icon: <RefreshCw className="w-3 h-3 animate-spin" /> },
                    { date: '20 May 2024', time: '22:45:01', type: 'BD + Archivos', user: 'Admin_Bautista', status: 'Error', color: 'bg-red-100 text-red-700', icon: <XCircle className="w-3 h-3" /> },
                    { date: '15 May 2024', time: '11:00:00', type: 'Solo BD', user: 'Auto_System', status: 'Completado', color: 'bg-green-100 text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
                  ].map((backup, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-900">{backup.date}</div>
                        <div className="text-xs text-slate-500">{backup.time}</div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">{backup.type}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center text-[10px] font-bold">
                            {backup.user.substring(0, 2).toUpperCase()}
                          </div>
                          <span className="text-sm text-slate-600">{backup.user}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[11px] font-bold ${backup.color} flex items-center w-fit gap-1`}>
                          {backup.icon} {backup.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {backup.status === 'Completado' ? (
                          <button className="inline-flex items-center gap-1.5 text-[#1e40af] hover:text-blue-700 text-sm font-bold">
                            <Download className="w-4 h-4" />
                            Descargar
                          </button>
                        ) : backup.status === 'Error' ? (
                          <button className="text-slate-400 hover:text-slate-600">
                            <Info className="w-5 h-5" />
                          </button>
                        ) : (
                          <span className="text-slate-400 text-sm font-medium italic">Preparando...</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-xs font-bold text-slate-500 hover:text-[#1e40af] transition-colors">Ver historial completo (Más de 30 días)</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
