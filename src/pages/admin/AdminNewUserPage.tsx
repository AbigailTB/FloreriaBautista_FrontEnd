import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserPlus, ChevronRight, User, Mail, Phone, Shield, ToggleLeft, Save } from 'lucide-react';
import { DataService, User as UserType } from '../../services/dataService';
import { FadeIn, GlassCard, AnimatedButton } from '../../components/Animations';
import { useToast } from '../../hooks/useToast';

export default function AdminNewUserPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'staff',
    status: 'active',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name || !form.email) {
      showToast('Por favor, completa los campos obligatorios.', 'error');
      return;
    }

    const newUser: UserType = {
      id: `usr-${Date.now()}`,
      name: form.name,
      email: form.email,
      phone: form.phone,
      role: form.role as any,
      status: form.status as any,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(form.name)}&background=random`,
      createdAt: new Date().toISOString(),
    };

    // Aquí iría DataService.saveUser(newUser) cuando esté disponible
    showToast(`Usuario ${form.name} creado exitosamente`, 'success');
    navigate('/admin/usuarios');
  };

  return (
    <div className="w-full h-full space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <nav className="flex items-center gap-2 text-xs text-slate-400 font-bold uppercase tracking-widest mb-2">
              <span className="hover:text-blue-600 cursor-pointer" onClick={() => navigate('/admin/usuarios')}>
                Usuarios
              </span>
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
              className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all"
            >
              <Save className="w-4 h-4" />
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
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Nombre Completo <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Ej. Juan Pérez"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                />
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">
                  Correo Electrónico <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    name="email"
                    value={form.email}
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
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="+52 55 0000 0000"
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                  />
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
              <h2 className="text-sm font-black text-slate-800 uppercase tracking-widest">Rol y Acceso</h2>
            </div>
            <div className="space-y-5">
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Rol</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                >
                  <option value="staff">Personal</option>
                  <option value="admin">Administrador</option>
                  <option value="customer">Cliente</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase tracking-widest text-slate-500 mb-2 block">Estado</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:ring-2 focus:ring-blue-500/20 outline-none cursor-pointer"
                >
                  <option value="active">Activo</option>
                  <option value="inactive">Inactivo</option>
                </select>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="p-6 border-none bg-blue-50/40">
            <p className="text-[11px] font-black text-blue-700 uppercase tracking-widest mb-2">Nota</p>
            <p className="text-xs text-slate-500 font-medium leading-relaxed">
              El usuario recibirá un correo con sus credenciales de acceso al sistema una vez creado.
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}