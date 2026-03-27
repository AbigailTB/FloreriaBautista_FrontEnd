import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ChevronRight, User, Mail, Phone, Shield, Lock, Eye, EyeOff, Save, Loader2 } from 'lucide-react';
import { FadeIn, GlassCard, AnimatedButton } from '../../components/Animations';
import { useToast } from '../../hooks/useToast';
import { AdminService } from '../../services/adminService';

const ROLE_OPTIONS = [
  { value: 'ADMIN', label: 'Administrador', description: 'Acceso total al sistema' },
  { value: 'EMPLEADO', label: 'Empleado', description: 'Gestión de pedidos y ventas' },
  { value: 'CLIENTE', label: 'Cliente', description: 'Acceso básico de cliente' },
];

export default function AdminNewUserPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    nombre: '',
    apellido: '',
    correo: '',
    telefono: '',
    password: '',
    confirmPassword: '',
    roles: [] as string[],
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleToggle = (role: string) => {
    setForm(prev => ({
      ...prev,
      roles: prev.roles.includes(role)
        ? prev.roles.filter(r => r !== role)
        : [...prev.roles, role],
    }));
  };

  const validateForm = (): boolean => {
    if (!form.nombre.trim()) {
      showToast('El nombre es obligatorio', 'error');
      return false;
    }
    if (!form.apellido.trim()) {
      showToast('El apellido es obligatorio', 'error');
      return false;
    }
    if (!form.correo.trim()) {
      showToast('El correo es obligatorio', 'error');
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.correo)) {
      showToast('El correo no tiene un formato válido', 'error');
      return false;
    }
    if (!form.password) {
      showToast('La contraseña es obligatoria', 'error');
      return false;
    }
    if (form.password.length < 6) {
      showToast('La contraseña debe tener al menos 6 caracteres', 'error');
      return false;
    }
    if (form.password !== form.confirmPassword) {
      showToast('Las contraseñas no coinciden', 'error');
      return false;
    }
    if (form.roles.length === 0) {
      showToast('Debes seleccionar al menos un rol', 'error');
      return false;
    }
    return true;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    setLoading(true);
    try {
      await AdminService.createAdminUser({
        nombre: form.nombre.trim(),
        apellido: form.apellido.trim(),
        correo: form.correo.trim().toLowerCase(),
        telefono: form.telefono.trim() || undefined,
        password: form.password,
        roles: form.roles,
      });
      showToast('Usuario creado exitosamente', 'success');
      navigate('/admin/usuarios');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al crear usuario';
      showToast(message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
              <button
                onClick={() => navigate('/admin/usuarios')}
                className="hover:text-blue-600 cursor-pointer transition-colors"
              >
                Usuarios
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-slate-700">Nuevo Usuario</span>
            </nav>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Crear Usuario</h1>
            <p className="text-sm text-slate-500 font-medium">Completa la información para registrar un nuevo miembro</p>
          </div>
          <div className="flex items-center gap-3">
            <AnimatedButton
              onClick={() => navigate('/admin/usuarios')}
              className="px-6 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 shadow-sm transition-all"
            >
              Cancelar
            </AnimatedButton>
            <AnimatedButton
              onClick={handleSave}
              disabled={loading}
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Save className="w-4 h-4" />
              )}
              Guardar Usuario
            </AnimatedButton>
          </div>
        </div>
      </FadeIn>

      {/* Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main fields */}
        <div className="lg:col-span-2 space-y-6">
          <GlassCard className="p-8 border-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shadow-sm">
                <User className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Información Personal</h2>
            </div>
            <div className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                    Nombre <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="nombre"
                    value={form.nombre}
                    onChange={handleChange}
                    placeholder="Ej. Juan"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                    Apellido <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="apellido"
                    value={form.apellido}
                    onChange={handleChange}
                    placeholder="Ej. Pérez"
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="correo"
                    value={form.correo}
                    onChange={handleChange}
                    placeholder="juan@ejemplo.com"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Teléfono
                </label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="tel"
                    name="telefono"
                    value={form.telefono}
                    onChange={handleChange}
                    placeholder="+52 55 0000 0000"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                </div>
              </div>
            </div>
          </GlassCard>

          {/* Password section */}
          <GlassCard className="p-8 border-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-sm">
                <Lock className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Contraseña</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    placeholder="Mínimo 6 caracteres"
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Confirmar Contraseña <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={form.confirmPassword}
                    onChange={handleChange}
                    placeholder="Repite la contraseña"
                    className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <GlassCard className="p-8 border-none">
            <div className="flex items-center gap-3 mb-6">
              <div className="size-10 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center shadow-sm">
                <Shield className="w-5 h-5" />
              </div>
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Roles</h2>
            </div>
            <div className="space-y-3">
              {ROLE_OPTIONS.map(role => (
                <button
                  key={role.value}
                  type="button"
                  onClick={() => handleRoleToggle(role.value)}
                  className={`w-full p-4 rounded-xl border-2 text-left transition-all ${
                    form.roles.includes(role.value)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className={`text-sm font-black ${form.roles.includes(role.value) ? 'text-blue-700' : 'text-slate-800'}`}>
                        {role.label}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">{role.description}</p>
                    </div>
                    <div className={`size-5 rounded-full border-2 flex items-center justify-center transition-all ${
                      form.roles.includes(role.value)
                        ? 'border-blue-500 bg-blue-500'
                        : 'border-slate-300 bg-white'
                    }`}>
                      {form.roles.includes(role.value) && (
                        <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-none bg-blue-50/40">
            <div className="flex items-start gap-3">
              <div className="size-8 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                <UserPlus className="w-4 h-4" />
              </div>
              <div>
                <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest mb-1">Información</p>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  El usuario podrá iniciar sesión con el correo y contraseña que definas aquí. Es responsabilidad del administrador comunicar estas credenciales de forma segura.
                </p>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}