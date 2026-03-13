import React, { useState, useEffect } from 'react';
import { 
  ChevronRight, 
  Database, 
  CloudUpload, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  Download,
  Info
} from 'lucide-react';
import { AdminService } from '../services/adminService';
import { Backup } from '../types';

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadBackups = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await AdminService.getDriveBackups();
      if (response.success && response.data) {
        setBackups(response.data);
      } else {
        setError(response.message || 'Error al cargar los respaldos');
      }
    } catch (err) {
      setError('Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

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
        {/* Back Up Form (Simplified for now) */}
        <section className="xl:col-span-1 flex flex-col gap-6">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Nuevo Respaldo</h3>
            <div className="bg-amber-50 border border-amber-200 p-4 rounded-xl flex gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
              <p className="text-xs text-amber-800 leading-relaxed">
                Funcionalidad de creación de respaldos en desarrollo.
              </p>
            </div>
          </div>
        </section>

        {/* Backups Table */}
        <section className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Historial de Respaldos</h3>
              <button onClick={loadBackups} className="text-[#1e40af] text-sm font-bold flex items-center gap-1 hover:underline">
                <RefreshCw className="w-4 h-4" />
                Actualizar lista
              </button>
            </div>
            {loading ? (
              <div className="p-10 text-center">
                <RefreshCw className="w-8 h-8 text-[#1e40af] animate-spin mx-auto" />
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                {error}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Nombre</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Tamaño</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase">Creado en</th>
                      <th className="px-6 py-4 text-xs font-bold text-slate-500 uppercase text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {backups.map((backup, idx) => (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900">{backup.nombre}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{(backup.tamanoBytes / 1024).toFixed(2)} KB</td>
                        <td className="px-6 py-4 text-sm text-slate-600">{new Date(backup.creadoEn).toLocaleString()}</td>
                        <td className="px-6 py-4 text-right">
                          <a href={backup.enlace} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-[#1e40af] hover:text-blue-700 text-sm font-bold">
                            <Download className="w-4 h-4" />
                            Descargar
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
              <button className="text-xs font-bold text-slate-500 hover:text-[#1e40af] transition-colors">Ver historial completo (Más de 30 días)</button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
