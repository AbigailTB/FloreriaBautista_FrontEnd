import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreVertical, 
  Shield, 
  Mail, 
  Phone, 
  Calendar,
  CheckCircle2,
  XCircle,
  Edit2,
  Trash2,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService, User } from '../../services/dataService';
import { FadeIn, ScaleIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';
import { useToast } from '../../hooks/useToast';

export default function AdminUsersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('Todos los Roles');
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [isNewUserModalOpen, setIsNewUserModalOpen] = useState(false);
  const { showToast } = useToast();

  const [newUser, setNewUser] = useState({
    name: '',
    email: '',
    role: 'staff',
    status: 'active'
  });

  useEffect(() => {
    const loadData = () => {
      const allUsers = DataService.getUsers();
      setUsers(allUsers);
      setLoading(false);
    };

    loadData();
  }, []);

  const handleAddUser = () => {
    if (!newUser.name || !newUser.email) {
      showToast('Por favor, completa los campos obligatorios.', 'error');
      return;
    }

    // Mock adding user
    const userToAdd: User = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role as any,
      status: newUser.status as any,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(newUser.name)}&background=random`,
      createdAt: new Date().toISOString()
    };

    setUsers([userToAdd, ...users]);
    showToast(`Usuario ${newUser.name} creado exitosamente`, 'success');
    setIsNewUserModalOpen(false);
    setNewUser({
      name: '',
      email: '',
      role: 'staff',
      status: 'active'
    });
  };

  const handleAction = (action: string, userId: string) => {
    showToast(`Acción "${action}" ejecutada para el usuario`, 'success');
    // Here you would implement the actual logic for edit, delete, etc.
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    let matchesRole = roleFilter === 'Todos los Roles';
    if (!matchesRole) {
      if (roleFilter === 'Administrador' && user.role === 'admin') matchesRole = true;
      if (roleFilter === 'Vendedor' && user.role === 'staff') matchesRole = true;
      if (roleFilter === 'Repartidor' && user.role === 'staff') matchesRole = true; // For now mapping staff to both
      if (roleFilter === 'Cliente' && user.role === 'customer') matchesRole = true;
    }
    
    return matchesSearch && matchesRole;
  });

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return { label: 'Administrador', color: 'bg-purple-100 text-purple-700' };
      case 'staff':
        return { label: 'Personal', color: 'bg-blue-100 text-blue-700' };
      case 'customer':
        return { label: 'Cliente', color: 'bg-amber-100 text-amber-700' };
      default:
        return { label: role, color: 'bg-slate-100 text-slate-700' };
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-8">
      {/* Header */}
      <FadeIn>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Gestión de Usuarios</h1>
            <p className="text-sm text-slate-500 font-medium">Administra el personal y sus niveles de acceso al sistema</p>
          </div>
          <AnimatedButton 
            onClick={() => setIsNewUserModalOpen(true)}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-2xl text-sm font-black hover:bg-blue-700 shadow-xl shadow-blue-600/20 transition-all"
          >
            <UserPlus className="w-4 h-4" />
            Nuevo Usuario
          </AnimatedButton>
        </div>
      </FadeIn>

      {/* Stats */}
      <StaggerContainer className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[
          { label: 'Total Usuarios', value: users.length.toString(), icon: <Users className="w-5 h-5" />, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Administradores', value: users.filter(u => u.role === 'admin').length.toString(), icon: <Shield className="w-5 h-5" />, color: 'text-purple-600', bg: 'bg-purple-50' },
          { label: 'Activos Ahora', value: users.filter(u => u.status === 'active').length.toString(), icon: <CheckCircle2 className="w-5 h-5" />, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { label: 'Inactivos', value: users.filter(u => u.status === 'inactive').length.toString(), icon: <XCircle className="w-5 h-5" />, color: 'text-slate-600', bg: 'bg-slate-50' },
        ].map((stat, idx) => (
          <GlassCard 
            key={idx} 
            className="p-6 border-none"
          >
            <div className={`p-3 w-fit rounded-2xl ${stat.bg} ${stat.color} mb-4 shadow-sm`}>
              {stat.icon}
            </div>
            <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest">{stat.label}</p>
            <h3 className="text-3xl font-black mt-1 text-slate-900">{stat.value}</h3>
          </GlassCard>
        ))}
      </StaggerContainer>

      {/* Filters & Search */}
      <FadeIn delay={0.3}>
        <GlassCard className="flex flex-wrap items-center gap-4 p-4 border-none">
          <div className="flex-1 min-w-[300px] relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar por nombre, email o rol..." 
              className="w-full pl-12 pr-4 py-3 rounded-2xl border-none bg-slate-50 text-sm font-medium focus:ring-2 focus:ring-blue-600/20 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-3">
            <AnimatedButton className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Filter className="w-4 h-4" />
              Filtros
            </AnimatedButton>
            <select 
              className="px-5 py-3 bg-white border border-slate-100 rounded-2xl text-sm font-black text-slate-600 focus:ring-2 focus:ring-blue-600/20 outline-none shadow-sm cursor-pointer"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
            >
              <option value="Todos los Roles">Todos los Roles</option>
              <option value="Administrador">Administrador</option>
              <option value="Vendedor">Personal</option>
              <option value="Cliente">Cliente</option>
            </select>
          </div>
        </GlassCard>
      </FadeIn>

      {/* Users Table */}
      <FadeIn delay={0.4}>
        <GlassCard className="border-none overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Usuario</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Contacto</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Rol / Permisos</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Registro</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Estado</th>
                  <th className="p-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                <AnimatePresence mode="popLayout">
                  {filteredUsers.map((user) => {
                    const roleBadge = getRoleBadge(user.role);
                    return (
                      <motion.tr 
                        key={user.id} 
                        layout
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="hover:bg-slate-50/30 transition-colors group"
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-4">
                            <div className="relative">
                              {user.avatar ? (
                                <img src={user.avatar} alt={user.name} className="size-12 rounded-2xl object-cover border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                              ) : (
                                <div className="size-12 rounded-2xl bg-slate-200 flex items-center justify-center text-slate-500 font-bold">
                                  {user.name.charAt(0)}
                                </div>
                              )}
                              <div className={`absolute -bottom-1 -right-1 size-4 rounded-full border-2 border-white ${user.status === 'active' ? 'bg-emerald-500' : 'bg-slate-400'}`}></div>
                            </div>
                            <div>
                              <p className="text-sm font-black text-slate-900">{user.name}</p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">ID: #{user.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                              <Mail className="w-3.5 h-3.5 text-slate-400" /> {user.email}
                            </div>
                            {user.phone && (
                              <div className="flex items-center gap-2 text-xs text-slate-600 font-medium">
                                <Phone className="w-3.5 h-3.5 text-slate-400" /> {user.phone}
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`px-3 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest ${roleBadge.color} shadow-sm`}>
                            {roleBadge.label}
                          </span>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-xs text-slate-600 font-bold">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            {new Date(user.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' })}
                          </div>
                        </td>
                        <td className="p-5">
                          <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest ${
                            user.status === 'active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'
                          }`}>
                            {user.status === 'active' ? 'Activo' : 'Inactivo'}
                          </span>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <AnimatedButton 
                              onClick={() => handleAction('Editar', user.id)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-blue-600 hover:bg-white rounded-xl shadow-sm transition-all"
                            >
                              <Edit2 className="w-4 h-4" />
                            </AnimatedButton>
                            <AnimatedButton 
                              onClick={() => handleAction('Eliminar', user.id)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-rose-500 hover:bg-white rounded-xl shadow-sm transition-all"
                            >
                              <Trash2 className="w-4 h-4" />
                            </AnimatedButton>
                            <AnimatedButton 
                              onClick={() => handleAction('Opciones', user.id)}
                              className="p-2.5 bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-white rounded-xl shadow-sm transition-all"
                            >
                              <MoreVertical className="w-4 h-4" />
                            </AnimatedButton>
                          </div>
                        </td>
                      </motion.tr>
                    );
                  })}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
          <div className="p-5 border-t border-slate-50 bg-slate-50/20 text-center">
            <button className="text-[10px] font-black text-slate-400 hover:text-blue-600 transition-all uppercase tracking-widest">Ver todos los registros de actividad</button>
          </div>
        </GlassCard>
      </FadeIn>

      {/* New User Modal */}
      <AnimatePresence>
        {isNewUserModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
              onClick={() => setIsNewUserModalOpen(false)}
            ></motion.div>
            <ScaleIn className="relative bg-white p-8 rounded-[2rem] shadow-2xl max-w-xl w-full border border-white/20">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-black text-slate-900">Nuevo Usuario</h3>
                <button onClick={() => setIsNewUserModalOpen(false)} className="p-2 bg-slate-100 rounded-full text-slate-500 hover:text-slate-900 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
              
              <div className="space-y-4 mb-8">
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Nombre Completo *</label>
                  <input 
                    type="text" 
                    value={newUser.name}
                    onChange={(e) => setNewUser({...newUser, name: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Correo Electrónico *</label>
                  <input 
                    type="email" 
                    value={newUser.email}
                    onChange={(e) => setNewUser({...newUser, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                    placeholder="juan@ejemplo.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Rol</label>
                  <select 
                    value={newUser.role}
                    onChange={(e) => setNewUser({...newUser, role: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                  >
                    <option value="staff">Personal</option>
                    <option value="admin">Administrador</option>
                    <option value="customer">Cliente</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-slate-500">Estado</label>
                  <select 
                    value={newUser.status}
                    onChange={(e) => setNewUser({...newUser, status: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-bold"
                  >
                    <option value="active">Activo</option>
                    <option value="inactive">Inactivo</option>
                  </select>
                </div>
              </div>
              
              <div className="flex justify-end gap-4">
                <button 
                  onClick={() => setIsNewUserModalOpen(false)}
                  className="px-6 py-3 rounded-xl font-black text-slate-500 hover:bg-slate-100 transition-colors"
                >
                  Cancelar
                </button>
                <AnimatedButton 
                  onClick={handleAddUser}
                  className="px-8 py-3 bg-blue-600 text-white rounded-xl font-black shadow-lg shadow-blue-600/20 hover:bg-blue-700 transition-colors"
                >
                  Crear Usuario
                </AnimatedButton>
              </div>
            </ScaleIn>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
