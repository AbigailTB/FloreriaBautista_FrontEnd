import React, { useState, useEffect } from 'react';
import {
  ChevronRight,
  Database,
  CloudUpload,
  AlertTriangle,
  RefreshCw,
  Plus,
  Table,
  CheckCircle2,
  XCircle,
  Clock,
  HardDrive,
  Zap,
  Calendar,
  Filter,
  X,
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ToggleLeft,
  ToggleRight,
  RotateCcw,
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

  const [frecuencia, setFrecuencia] = useState('DIARIO');
  const [hora, setHora] = useState('02:00');
  const [diaSemana, setDiaSemana] = useState(0);
  const [backupActivo, setBackupActivo] = useState(true);
  const [mantenimientoActivo, setMantenimientoActivo] = useState(true);
  const [schedulerInfo, setSchedulerInfo] = useState<{ proximoBackup: string; proximoMantenimiento: string } | null>(null);
  const [loadingConfig, setLoadingConfig] = useState(false);
  const [resultConfig, setResultConfig] = useState<{ ok: boolean; msg: string } | null>(null);

  const [filterFechaDesde, setFilterFechaDesde] = useState('');
  const [filterFechaHasta, setFilterFechaHasta] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [filterEstado, setFilterEstado] = useState('');
  const [sortBy, setSortBy] = useState<'fecha' | 'tamano'>('fecha');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');

  // Restore modal
  const [restoreBackup, setRestoreBackup] = useState<Backup | null>(null);
  const [loadingRestore, setLoadingRestore] = useState(false);
  const [resultRestore, setResultRestore] = useState<{ ok: boolean; msg: string } | null>(null);

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
      const horaNum = parseInt(hora.split(':')[0], 10);
      const res = await AdminService.saveSchedulerConfig({
        backupAutomaticoActivo: backupActivo,
        frecuencia,
        diaSemana,
        hora: isNaN(horaNum) ? 2 : horaNum,
        mantenimientoActivo,
      });
      setResultConfig({ ok: res.success, msg: res.message || 'Configuración guardada exitosamente.' });
      if (res.success && res.data) {
        const d = res.data;
        setFrecuencia(d.frecuencia);
        setHora(d.horaFormato);
        setDiaSemana(d.diaSemana);
        setBackupActivo(d.backupAutomaticoActivo);
        setMantenimientoActivo(d.mantenimientoActivo);
        setSchedulerInfo({ proximoBackup: d.proximoBackup, proximoMantenimiento: d.proximoMantenimiento });
      }
    } catch (err: any) {
      setResultConfig({ ok: false, msg: err.message });
    } finally { setLoadingConfig(false); }
  };

  const handleRestore = async () => {
    if (!restoreBackup) return;
    setLoadingRestore(true);
    setResultRestore(null);
    try {
      const res = await AdminService.restoreBackup(restoreBackup.id);
      setResultRestore({ ok: res.success, msg: res.message || 'Restauración iniciada.' });
      if (res.success) { setTimeout(() => { setRestoreBackup(null); setResultRestore(null); loadBackups(); }, 3000); }
    } catch (err: any) {
      setResultRestore({ ok: false, msg: err.message });
    } finally { setLoadingRestore(false); }
  };

  useEffect(() => {
    loadBackups();
    AdminService.getScheduler().then(res => {
      if (res.success && res.data) {
        const d = res.data;
        setFrecuencia(d.frecuencia ?? 'DIARIO');
        setHora(d.horaFormato ?? '02:00');
        setDiaSemana(d.diaSemana ?? 0);
        setBackupActivo(d.backupAutomaticoActivo ?? true);
        setMantenimientoActivo(d.mantenimientoActivo ?? true);
        setSchedulerInfo({ proximoBackup: d.proximoBackup, proximoMantenimiento: d.proximoMantenimiento });
      }
    }).catch(() => {/* silencioso */});
  }, []);

  const formatSize = (bytes: number) => {
    if (bytes >= 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
    return `${(bytes / 1024).toFixed(2)} KB`;
  };

  const getBackupType = (nombre: string) => {
    const n = nombre.toLowerCase();
    if (n.includes('completo') || n.includes('full')) return { label: 'Solo BD', color: 'bg-blue-50 text-blue-700 border-blue-100' };
    if (n.includes('estatico') || n.includes('archivo') || n.includes('static')) return { label: 'BD + Archivos', color: 'bg-emerald-50 text-emerald-700 border-emerald-100' };
    return { label: 'Respaldo', color: 'bg-slate-50 text-slate-600 border-slate-200' };
  };

  const getBackupStatus = (_backup: Backup) => {
    // Since API only returns completed backups in Drive, we treat all as Completado
    return { label: 'Completado', color: 'bg-emerald-50 text-emerald-700' };
  };

  const activeFilters = [filterFechaDesde, filterFechaHasta, filterTipo, filterEstado].filter(Boolean).length;

  const filteredBackups = backups
    .filter(b => {
      const date = new Date(b.creadoEn);
      if (filterFechaDesde && date < new Date(filterFechaDesde)) return false;
      if (filterFechaHasta && date > new Date(filterFechaHasta + 'T23:59:59')) return false;
      if (filterTipo) {
        const tipo = getBackupType(b.nombre).label;
        if (tipo !== filterTipo) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const mul = sortDir === 'asc' ? 1 : -1;
      if (sortBy === 'fecha') return mul * (new Date(a.creadoEn).getTime() - new Date(b.creadoEn).getTime());
      return mul * (a.tamanoBytes - b.tamanoBytes);
    });

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
              {/* Toggle backup activo */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Backup automático activo</span>
                <button type="button" onClick={() => setBackupActivo(v => !v)} className="shrink-0">
                  {backupActivo
                    ? <ToggleRight className="w-8 h-8 text-emerald-600" />
                    : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>
              {/* Toggle mantenimiento activo */}
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-600">Mantenimiento automático activo</span>
                <button type="button" onClick={() => setMantenimientoActivo(v => !v)} className="shrink-0">
                  {mantenimientoActivo
                    ? <ToggleRight className="w-8 h-8 text-emerald-600" />
                    : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Frecuencia</label>
                  <div className="relative">
                    <select value={frecuencia} onChange={(e) => setFrecuencia(e.target.value)} className={`${selectClass} focus:ring-emerald-400/60 focus:border-emerald-400`}>
                      <option value="DIARIO">Diario</option>
                      <option value="SEMANAL">Semanal</option>
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
              {/* Día de semana — solo para SEMANAL */}
              {frecuencia === 'SEMANAL' && (
                <div>
                  <label className="block text-xs font-semibold text-slate-500 mb-1.5">Día de la semana</label>
                  <div className="relative">
                    <select value={diaSemana} onChange={(e) => setDiaSemana(Number(e.target.value))} className={`${selectClass} focus:ring-emerald-400/60 focus:border-emerald-400`}>
                      <option value={0}>Domingo</option>
                      <option value={1}>Lunes</option>
                      <option value={2}>Martes</option>
                      <option value={3}>Miércoles</option>
                      <option value={4}>Jueves</option>
                      <option value={5}>Viernes</option>
                      <option value={6}>Sábado</option>
                    </select>
                    <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
                  </div>
                </div>
              )}
              {schedulerInfo && (
                <div className="grid grid-cols-1 gap-1.5 p-3 rounded-xl bg-slate-50 border border-slate-100 text-[10px] font-mono text-slate-500">
                  <span><span className="font-bold text-slate-600">Próximo backup:</span> {schedulerInfo.proximoBackup}</span>
                  <span><span className="font-bold text-slate-600">Próximo mant.:</span> {schedulerInfo.proximoMantenimiento}</span>
                </div>
              )}
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
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden h-full flex flex-col">

            {/* Table header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  Historial de respaldos
                  {activeFilters > 0 && (
                    <span className="px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-bold rounded-full border border-blue-100">
                      {activeFilters} filtro{activeFilters > 1 ? 's' : ''}
                    </span>
                  )}
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Almacenados en Google Drive</p>
              </div>
              <div className="flex items-center gap-2">
                {activeFilters > 0 && (
                  <button
                    onClick={() => { setFilterFechaDesde(''); setFilterFechaHasta(''); setFilterTipo(''); setFilterEstado(''); }}
                    className="flex items-center gap-1.5 text-xs font-semibold text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-100 px-3 py-1.5 rounded-lg transition-all"
                  >
                    <X className="w-3.5 h-3.5" />Limpiar filtros
                  </button>
                )}
                <button
                  onClick={loadBackups}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 bg-slate-50 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 px-3 py-1.5 rounded-lg transition-all"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
                  Actualizar
                </button>
              </div>
            </div>

            {/* Filter bar */}
            <div className="flex flex-wrap items-center gap-3 px-6 py-3 border-b border-slate-100 bg-slate-50/40">
              <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Desde</label>
                <input type="date" value={filterFechaDesde} onChange={e => setFilterFechaDesde(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 outline-none" />
              </div>
              <div className="flex items-center gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Hasta</label>
                <input type="date" value={filterFechaHasta} onChange={e => setFilterFechaHasta(e.target.value)}
                  className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 outline-none" />
              </div>
              <select value={filterTipo} onChange={e => setFilterTipo(e.target.value)}
                className="text-xs border border-slate-200 rounded-lg px-2 py-1.5 bg-white focus:ring-2 focus:ring-amber-400/40 focus:border-amber-400 outline-none cursor-pointer">
                <option value="">Todos los tipos</option>
                <option value="Solo BD">Solo BD</option>
                <option value="BD + Archivos">BD + Archivos</option>
                <option value="Respaldo">Otros</option>
              </select>
              <div className="ml-auto flex items-center gap-1.5">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ordenar</label>
                <button onClick={() => setSortBy('fecha')} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${sortBy === 'fecha' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'}`}>
                  Fecha
                  {sortBy === 'fecha' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
                </button>
                <button onClick={() => setSortBy('tamano')} className={`text-xs px-2.5 py-1.5 rounded-lg border transition-all flex items-center gap-1 ${sortBy === 'tamano' ? 'bg-amber-50 border-amber-200 text-amber-700' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700'}`}>
                  Tamaño
                  {sortBy === 'tamano' ? (sortDir === 'desc' ? <ArrowDown className="w-3 h-3" /> : <ArrowUp className="w-3 h-3" />) : <ArrowUpDown className="w-3 h-3" />}
                </button>
                <button onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')} className="p-1.5 bg-white border border-slate-200 rounded-lg text-slate-400 hover:text-slate-700 transition-all">
                  {sortDir === 'asc' ? <ArrowUp className="w-3.5 h-3.5" /> : <ArrowDown className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Table content */}
            <div className="flex-1 overflow-auto">
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
              ) : filteredBackups.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-300">
                  <Database className="w-10 h-10" />
                  <div className="text-center">
                    <p className="text-sm font-semibold text-slate-400">{backups.length === 0 ? 'Sin respaldos' : 'Sin resultados'}</p>
                    <p className="text-xs text-slate-300 mt-1">{backups.length === 0 ? 'Crea tu primer respaldo usando los formularios' : 'Intenta cambiar los filtros activos'}</p>
                  </div>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-slate-100">
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Nombre</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tipo</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Estado</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Tamaño</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">Creado</th>
                        <th className="px-6 py-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider text-right">Acción</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-50">
                      {filteredBackups.map((backup, i) => {
                        const tipo = getBackupType(backup.nombre);
                        const status = getBackupStatus(backup);
                        return (
                          <tr key={backup.id} className="group hover:bg-slate-50/70 transition-colors" style={{ animationDelay: `${i * 40}ms` }}>
                            <td className="px-6 py-3.5">
                              <div className="flex items-center gap-2.5">
                                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border ${tipo.color}`}>
                                  <Database className="w-3.5 h-3.5" />
                                </div>
                                <span className="text-sm font-semibold text-slate-800 truncate max-w-[160px]" title={backup.nombre}>{backup.nombre}</span>
                              </div>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold border ${tipo.color}`}>{tipo.label}</span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold ${status.color}`}>
                                <CheckCircle2 className="w-3 h-3" />{status.label}
                              </span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 bg-slate-100 px-2 py-1 rounded-md">
                                <HardDrive className="w-3 h-3" />{formatSize(backup.tamanoBytes)}
                              </span>
                            </td>
                            <td className="px-6 py-3.5">
                              <span className="text-sm text-slate-500">{new Date(backup.creadoEn).toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })}</span>
                            </td>
                            <td className="px-6 py-3.5 text-right">
                              <button
                                onClick={() => { setRestoreBackup(backup); setResultRestore(null); }}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-600 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-100 hover:border-amber-200 px-3 py-1.5 rounded-lg transition-all"
                              >
                                <RotateCcw className="w-3 h-3" />
                                Restaurar BD
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Table footer */}
            {!loading && !error && backups.length > 0 && (
              <div className="px-6 py-3 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  {filteredBackups.length} de {backups.length} respaldo{backups.length !== 1 ? 's' : ''}
                  {activeFilters > 0 && ' (filtrados)'}
                </span>
                <span className="text-xs text-slate-400 flex items-center gap-1">
                  <CloudUpload className="w-3 h-3" />Sincronizado con Drive
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Restore confirmation modal ── */}
      {restoreBackup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl border border-amber-100 max-w-md w-full p-6">
            <div className="flex items-start gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
              </div>
              <div>
                <h3 className="text-base font-black text-slate-900 mb-1">¿Restaurar base de datos?</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Esta acción restaurará la base de datos al estado del respaldo <strong className="text-slate-700">"{restoreBackup.nombre}"</strong>.
                  Esto puede sobrescribir información reciente. ¿Deseas continuar?
                </p>
              </div>
            </div>
            {resultRestore && (
              <div className={`mb-4 flex items-start gap-2 p-3 rounded-xl text-xs font-medium ${resultRestore.ok ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
                {resultRestore.ok ? <CheckCircle2 className="w-3.5 h-3.5 shrink-0 mt-0.5" /> : <XCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />}
                {resultRestore.msg}
              </div>
            )}
            <div className="flex gap-3">
              <button
                onClick={() => { setRestoreBackup(null); setResultRestore(null); }}
                disabled={loadingRestore}
                className="flex-1 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleRestore}
                disabled={loadingRestore || resultRestore?.ok === true}
                className="flex-1 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-xl text-sm font-bold shadow-sm shadow-amber-500/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loadingRestore
                  ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Restaurando...</>
                  : <><RotateCcw className="w-3.5 h-3.5" />Confirmar restauración</>
                }
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}