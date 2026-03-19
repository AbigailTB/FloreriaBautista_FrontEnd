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
  Clock,
  HardDrive,
  Zap,
  Calendar,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { Backup } from '../../types';

export default function BackupsPage() {
  const [backups, setBackups] = useState<Backup[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [descFull, setDescFull] = useState('');
  const [loadingFull, setLoadingFull] = useState(false);
  const [resultFull, setResultFull] = useState<{ ok: boolean; msg: string } | null>(null);

  const [tabla, setTabla] = useState('');
  const [descTabla, setDescTabla] = useState('');
  const [loadingTabla, setLoadingTabla] = useState(false);
  const [resultTabla, setResultTabla] = useState<{ ok: boolean; msg: string } | null>(null);

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
      if (res.success) { setDescFull(''); loadBackups(); }
    } catch (err: any) {
      setResultFull({ ok: false, msg: err.message });
    } finally { setLoadingFull(false); }
  };

  const handleTableBackup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoadingTabla(true);
    setResultTabla(null);
    try {
      const res = await AdminService.createTableBackup(tabla, descTabla);
      setResultTabla({ ok: res.success, msg: res.message || 'Respaldo de tabla creado.' });
      if (res.success) { setTabla(''); setDescTabla(''); loadBackups(); }
    } catch (err: any) {
      setResultTabla({ ok: false, msg: err.message });
    } finally { setLoadingTabla(false); }
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
    } finally { setLoadingConfig(false); }
  };

  useEffect(() => { loadBackups(); }, []);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const inputClass =
    'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-amber-400/60 focus:border-amber-400 bg-white text-slate-800 placeholder-slate-400 transition-all';

  const selectClass =
    'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-amber-400/60 focus:border-amber-400 bg-white text-slate-800 transition-all appearance-none cursor-pointer';

  return (
    <div className="w-full space-y-6 ">

      {/* ── Breadcrumb ─────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-400 font-medium">
        <span className="hover:text-slate-600 transition-colors cursor-pointer">Operación técnica</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-700">Respaldos Manuales</span>
      </nav>

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center">
              <Database className="w-5 h-5 text-amber-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Respaldos</h1>
          </div>
          <p className="text-sm text-slate-500 ml-12">
            Gestión de copias de seguridad en Google Drive
          </p>
        </div>
        <div className="flex items-center gap-2 bg-blue-50 border border-blue-100 rounded-xl px-4 py-2.5 ml-12 sm:ml-0">
          <CloudUpload className="w-4 h-4 text-blue-500" />
          <span className="text-xs font-semibold text-blue-700">Google Drive</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 ml-1" />
        </div>
      </div>

      {/* ── Stat chips ─────────────────────────────── */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: HardDrive,  label: 'Respaldos',  value: loading ? '—' : String(backups.length), color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
          { icon: Clock,      label: 'Último',     value: !loading && backups.length ? new Date(backups[0]?.creadoEn).toLocaleDateString('es-MX') : '—', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
          { icon: Zap,        label: 'Automático', value: 'Diario',    color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-100' },
        ].map(({ icon: Icon, label, value, color, bg, border }) => (
          <div key={label} className={`rounded-xl border ${border} ${bg} px-4 py-3 flex items-center gap-3`}>
            <Icon className={`w-4 h-4 ${color} shrink-0`} />
            <div className="min-w-0">
              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">{label}</p>
              <p className={`text-sm font-bold ${color} truncate`}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main grid ──────────────────────────────── */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

        {/* ── Left column: forms ─── (2/5) */}
        <div className="xl:col-span-2 flex flex-col gap-4">

          {/* Backup Completo */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-amber-50 to-white">
              <div className="w-7 h-7 rounded-lg bg-amber-100 flex items-center justify-center">
                <Plus className="w-3.5 h-3.5 text-amber-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Respaldo Completo</h3>
            </div>
            <form onSubmit={handleFullBackup} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Descripción</label>
                <input
                  type="text"
                  value={descFull}
                  onChange={(e) => setDescFull(e.target.value)}
                  placeholder="Ej: Antes de actualización v2"
                  className={inputClass}
                  required
                />
              </div>
              {resultFull && (
                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium ${resultFull.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {resultFull.ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                  {resultFull.msg}
                </div>
              )}
              <button
                type="submit"
                disabled={loadingFull}
                className="w-full bg-amber-600 hover:bg-amber-700 active:scale-[.98] disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-amber-200"
              >
                {loadingFull ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Database className="w-3.5 h-3.5" />}
                {loadingFull ? 'Creando...' : 'Crear respaldo completo'}
              </button>
            </form>
          </div>

          {/* Backup por Tabla */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-blue-50 to-white">
              <div className="w-7 h-7 rounded-lg bg-blue-100 flex items-center justify-center">
                <Table className="w-3.5 h-3.5 text-blue-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Respaldo por Tabla</h3>
            </div>
            <form onSubmit={handleTableBackup} className="p-5 space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Tabla</label>
                <div className="relative">
                  <select value={tabla} onChange={(e) => setTabla(e.target.value)} className={selectClass} required>
                    <option value="" disabled>Seleccione una tabla</option>
                    <option value="usuarios">Usuarios</option>
                    <option value="productos">Productos</option>
                    <option value="pedidos">Pedidos</option>
                    <option value="inventario">Inventario</option>
                    <option value="configuracion">Configuración</option>
                  </select>
                  <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1.5">Descripción</label>
                <input
                  type="text"
                  value={descTabla}
                  onChange={(e) => setDescTabla(e.target.value)}
                  placeholder="Ej: Respaldo de usuarios activos"
                  className={inputClass}
                  required
                />
              </div>
              {resultTabla && (
                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium ${resultTabla.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {resultTabla.ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                  {resultTabla.msg}
                </div>
              )}
              <button
                type="submit"
                disabled={loadingTabla}
                className="w-full bg-blue-600 hover:bg-blue-700 active:scale-[.98] disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-blue-200"
              >
                {loadingTabla ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Table className="w-3.5 h-3.5" />}
                {loadingTabla ? 'Creando...' : 'Crear respaldo de tabla'}
              </button>
            </form>
          </div>

          {/* Automatización */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="flex items-center gap-2.5 px-5 py-4 border-b border-slate-100 bg-gradient-to-r from-emerald-50 to-white">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 flex items-center justify-center">
                <Calendar className="w-3.5 h-3.5 text-emerald-700" />
              </div>
              <h3 className="text-sm font-bold text-slate-800">Automatización</h3>
            </div>
            <form onSubmit={handleSaveConfig} className="p-5 space-y-3.5">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Frecuencia</label>
                  <div className="relative">
                    <select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} className={`${selectClass} focus:ring-emerald-400/60 focus:border-emerald-400`}>
                      <option value="diario">Diario</option>
                      <option value="semanal">Semanal</option>
                      <option value="mensual">Mensual</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Hora</label>
                  <input
                    type="time"
                    value={hora}
                    onChange={(e) => setHora(e.target.value)}
                    className={`${inputClass} focus:ring-emerald-400/60 focus:border-emerald-400`}
                  />
                </div>
              </div>
              {resultConfig && (
                <div className={`flex items-start gap-2 p-3 rounded-xl text-xs font-medium ${resultConfig.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                  {resultConfig.ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                  {resultConfig.msg}
                </div>
              )}
              <button
                type="submit"
                disabled={loadingConfig}
                className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[.98] disabled:opacity-50 text-white text-sm font-bold py-2.5 rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm shadow-emerald-200"
              >
                {loadingConfig ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                {loadingConfig ? 'Guardando...' : 'Guardar configuración'}
              </button>
            </form>
          </div>
        </div>

        {/* ── Right column: table ─── (3/5) */}
        <div className="xl:col-span-3">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full">

            {/* Table header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Historial de respaldos</h3>
                <p className="text-xs text-slate-400 mt-0.5">Almacenados en Google Drive</p>
              </div>
              <button
                onClick={loadBackups}
                className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                Actualizar
              </button>
            </div>

            {/* Table content */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
                <RefreshCw className="w-7 h-7 animate-spin" />
                <p className="text-sm">Cargando respaldos...</p>
              </div>
            ) : error ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-red-400">
                <AlertTriangle className="w-7 h-7" />
                <p className="text-sm font-medium">{error}</p>
              </div>
            ) : backups.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-300">
                <Database className="w-10 h-10" />
                <div className="text-center">
                  <p className="text-sm font-semibold text-slate-400">Sin respaldos</p>
                  <p className="text-xs text-slate-300 mt-1">Crea tu primer respaldo usando los formularios</p>
                </div>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-slate-100">
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tamaño</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creado</th>
                      <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {backups.map((backup, i) => (
                      <tr
                        key={backup.id}
                        className="group hover:bg-slate-50/70 transition-colors"
                        style={{ animationDelay: `${i * 40}ms` }}
                      >
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-2.5">
                            <div className="w-7 h-7 rounded-lg bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                              <Database className="w-3.5 h-3.5 text-amber-500" />
                            </div>
                            <span className="text-sm font-semibold text-slate-800 truncate max-w-[180px]" title={backup.nombre}>
                              {backup.nombre}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                            <HardDrive className="w-3 h-3" />
                            {formatSize(backup.tamanoBytes)}
                          </span>
                        </td>
                        <td className="px-6 py-3.5">
                          <span className="text-sm text-slate-500">
                            {new Date(backup.creadoEn).toLocaleString('es-MX', {
                              dateStyle: 'short',
                              timeStyle: 'short',
                            })}
                          </span>
                        </td>
                        <td className="px-6 py-3.5 text-right">
                          <a
                            href={backup.enlace}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-100 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all"
                          >
                            <Download className="w-3 h-3" />
                            Descargar
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Table footer */}
            {!loading && !error && backups.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {backups.length} respaldo{backups.length !== 1 ? 's' : ''} registrado{backups.length !== 1 ? 's' : ''}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <CloudUpload className="w-3 h-3" />
                  Sincronizado con Drive
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}