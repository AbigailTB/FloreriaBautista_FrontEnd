import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Database,
  CloudUpload,
  AlertTriangle,
  RefreshCw,
  Download,
  Plus,
  Table,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { Backup } from '../../types';

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Formulario backup completo
  const [descFull, setDescFull] = useState('');
  const [loadingFull, setLoadingFull] = useState(false);
  const [resultFull, setResultFull] = useState<{ ok: boolean; msg: string } | null>(null);

  // Formulario backup por tabla
  const [tabla, setTabla] = useState('');
  const [descTabla, setDescTabla] = useState('');
  const [loadingTabla, setLoadingTabla] = useState(false);
  const [resultTabla, setResultTabla] = useState<{ ok: boolean; msg: string } | null>(null);

  // Automated Backup State
  const [frecuencia, setFrecuencia] = useState('diario');
  const [hora, setHora] = useState('02:00');
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [resultConfig, setResultConfig] = useState<{ ok: boolean; msg: string } | null>(null);

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
    } catch (err: any) {
      setError(err.message || 'Error al conectar con el servidor');
    } finally {
      setLoading(false);
    }
  };

  const handleFullBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingFull(true);
    setResultFull(null);
    try {
      const res = await AdminService.createFullBackup(descFull);
      setResultFull({ ok: res.success, msg: res.message || 'Respaldo completo creado.' });
      if (res.success) {
        setDescFull('');
        loadBackups();
      }
    } catch (err: any) {
      setResultFull({ ok: false, msg: err.message });
    } finally {
      setLoadingFull(false);
    }
  };

  const handleTableBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTabla(true);
    setResultTabla(null);
    try {
      const res = await AdminService.createTableBackup(tabla, descTabla);
      setResultTabla({ ok: res.success, msg: res.message || 'Respaldo de tabla creado.' });
      if (res.success) {
        setTabla('');
        setDescTabla('');
        loadBackups();
      }
    } catch (err: any) {
      setResultTabla({ ok: false, msg: err.message });
    } finally {
      setLoadingTabla(false);
    }
  };

  const handleSaveConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingConfig(true);
    setResultConfig(null);
    try {
      const res = await AdminService.saveBackupConfig(frecuencia, hora);
      setResultConfig({ ok: res.success, msg: res.message || 'Configuración guardada exitosamente.' });
    } catch (err: any) {
      setResultConfig({ ok: false, msg: err.message });
    } finally {
      setLoadingConfig(false);
    }
  };

  useEffect(() => {
    loadBackups();
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  return (
    <div className="w-full h-full space-y-8 animate-in fade-in duration-500 py-6">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm text-slate-500">
        <span className="hover:text-blue-600 transition-colors cursor-pointer">Operación técnica</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-900 font-medium">Respaldos Manuales</span>
      </nav>

      {/* Title */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            Respaldos Manuales
            <Database className="w-8 h-8 text-amber-600" />
          </h2>
          <p className="text-slate-600 mt-2 max-w-2xl">
            Asegure la integridad de la base de datos. Estos respaldos son críticos ante actualizaciones o mantenimientos preventivos.
          </p>
        </div>
        <div className="bg-blue-50 p-4 rounded-xl flex items-center gap-4 border border-blue-100">
          <CloudUpload className="w-8 h-8 text-blue-600" />
          <div>
            <p className="text-xs font-bold uppercase text-blue-600">Almacenamiento</p>
            <p className="text-sm font-medium text-slate-700">Google Drive</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Forms */}
        <section className="xl:col-span-1 flex flex-col gap-6">
          {/* Backup Completo */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Plus className="w-4 h-4 text-amber-600" />
              Respaldo Completo
            </h3>
            <form onSubmit={handleFullBackup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción</label>
                <input
                  type="text"
                  value={descFull}
                  onChange={(e) => setDescFull(e.target.value)}
                  placeholder="Ej: Antes de actualización v2"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-300 bg-slate-50"
                  required
                />
              </div>
              {resultFull && (
                <div className={`flex items-start gap-2 p-3 rounded-lg text-xs ${resultFull.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {resultFull.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  {resultFull.msg}
                </div>
              )}
              <button
                type="submit"
                disabled={loadingFull}
                className="w-full bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loadingFull ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Database className="w-4 h-4" />}
                {loadingFull ? 'Creando...' : 'Crear Respaldo Completo'}
              </button>
            </form>
          </div>

          {/* Backup por Tabla */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Table className="w-4 h-4 text-blue-600" />
              Respaldo por Tabla
            </h3>
            <form onSubmit={handleTableBackup} className="space-y-3">
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Nombre de la tabla</label>
                <select
                  value={tabla}
                  onChange={(e) => setTabla(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
                  required
                >
                  <option value="" disabled>Seleccione una tabla</option>
                  <option value="usuarios">Usuarios</option>
                  <option value="productos">Productos</option>
                  <option value="pedidos">Pedidos</option>
                  <option value="inventario">Inventario</option>
                  <option value="configuracion">Configuración</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Descripción</label>
                <input
                  type="text"
                  value={descTabla}
                  onChange={(e) => setDescTabla(e.target.value)}
                  placeholder="Ej: Respaldo de usuarios activos"
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 bg-slate-50"
                  required
                />
              </div>
              {resultTabla && (
                <div className={`flex items-start gap-2 p-3 rounded-lg text-xs ${resultTabla.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {resultTabla.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  {resultTabla.msg}
                </div>
              )}
              <button
                type="submit"
                disabled={loadingTabla}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loadingTabla ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Table className="w-4 h-4" />}
                {loadingTabla ? 'Creando...' : 'Crear Respaldo de Tabla'}
              </button>
            </form>
          </div>

          {/* Configuración de Respaldo Automático */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-4 flex items-center gap-2">
              <RefreshCw className="w-4 h-4 text-emerald-600" />
              Automatización de Respaldos
            </h3>
            <form className="space-y-3" onSubmit={handleSaveConfig}>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Frecuencia</label>
                <select
                  value={frecuencia}
                  onChange={(e) => setFrecuencia(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
                >
                  <option value="diario">Diario</option>
                  <option value="semanal">Semanal</option>
                  <option value="mensual">Mensual</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Hora de ejecución</label>
                <input
                  type="time"
                  value={hora}
                  onChange={(e) => setHora(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-300 bg-slate-50"
                />
              </div>
              {resultConfig && (
                <div className={`flex items-start gap-2 p-3 rounded-lg text-xs ${resultConfig.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                  {resultConfig.ok ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                  {resultConfig.msg}
                </div>
              )}
              <button
                type="submit"
                disabled={loadingConfig}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loadingConfig ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                {loadingConfig ? 'Guardando...' : 'Guardar Configuración'}
              </button>
            </form>
          </div>
        </section>

        {/* Tabla de respaldos */}
        <section className="xl:col-span-2 flex flex-col gap-6">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-900">Historial de Respaldos en Drive</h3>
              <button onClick={loadBackups} className="text-blue-600 text-sm font-bold flex items-center gap-1 hover:underline">
                <RefreshCw className="w-4 h-4" />
                Actualizar
              </button>
            </div>

            {loading ? (
              <div className="p-10 text-center">
                <RefreshCw className="w-8 h-8 text-blue-600 animate-spin mx-auto" />
                <p className="text-sm text-slate-500 mt-3">Cargando respaldos...</p>
              </div>
            ) : error ? (
              <div className="p-10 text-center text-red-500">
                <AlertTriangle className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">{error}</p>
              </div>
            ) : backups.length === 0 ? (
              <div className="p-10 text-center text-slate-400">
                <Database className="w-8 h-8 mx-auto mb-2" />
                <p className="text-sm">No hay respaldos registrados</p>
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
                    {backups.map((backup) => (
                      <tr key={backup.id} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4 text-sm font-medium text-slate-900 max-w-xs truncate" title={backup.nombre}>
                          {backup.nombre}
                        </td>
                        <td className="px-6 py-4 text-sm text-slate-600">{formatSize(backup.tamanoBytes)}</td>
                        <td className="px-6 py-4 text-sm text-slate-600">
                          {new Date(backup.creadoEn).toLocaleString('es-MX')}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <a
                            href={backup.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-700 text-sm font-bold"
                          >
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
          </div>
        </section>
      </div>
    </div>
  );
}