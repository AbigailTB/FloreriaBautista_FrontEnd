import React, { useState } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  ShoppingCart, 
  Package, 
  CreditCard, 
  BarChart3, 
  Users, 
  Settings, 
  Wrench,
  Bell,
  LogOut,
  ChevronDown,
  Database,
  Activity,
  ArrowLeftRight,
  ShieldAlert,
  Cloud
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isTechOpsOpen, setIsTechOpsOpen] = useState(
    location.pathname.startsWith('/admin/operacion') || 
    location.pathname.startsWith('/admin/respaldos') || 
    location.pathname.startsWith('/admin/monitoreo') || 
    location.pathname.startsWith('/admin/datos') ||
    location.pathname.startsWith('/admin/auditoria')
  );

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('usuario');
    window.location.href = '/';
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinkClass = (path: string) => 
    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path) 
        ? 'bg-white text-[#1e3a5f] shadow-lg' 
        : 'text-slate-200 hover:bg-white/10 hover:text-white'
    }`;

  const subNavLinkClass = (path: string) => 
    `flex items-center gap-3 px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-200 ${
      isActive(path) 
        ? 'text-white bg-white/20' 
        : 'text-slate-300 hover:text-white hover:bg-white/10'
    }`;

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* BEGIN: LeftSidebar */}
      <motion.aside 
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        className="w-64 bg-[#1e3a5f] border-r border-gray-900 shadow-2xl flex flex-col flex-shrink-0 z-20"
      >
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-white/10">
          <Link to="/dashboard" className="flex items-center gap-2">
            <img src="/Logo.png" alt="Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg">
                <span className="text-white">Florería </span>
                <span className="text-[#eab308]">Bautista</span>
              </span>
          </Link>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1 custom-scrollbar">
          <Link to="/dashboard" className={navLinkClass('/dashboard')}>
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          
          <Link to="/catalogo" className={navLinkClass('/catalogo')}>
            <ShoppingBag className="w-5 h-5" />
            Catálogo
          </Link>

          <Link to="/admin/pedidos" className={navLinkClass('/admin/pedidos')}>
            <ShoppingCart className="w-5 h-5" />
            Pedidos
          </Link>

          <Link to="/admin/inventario" className={navLinkClass('/admin/inventario')}>
            <Package className="w-5 h-5" />
            Inventario
          </Link>

          <Link to="/admin/pagos" className={navLinkClass('/admin/pagos')}>
            <CreditCard className="w-5 h-5" />
            Pagos
          </Link>

          <Link to="/admin/reportes" className={navLinkClass('/admin/reportes')}>
            <BarChart3 className="w-5 h-5" />
            Reportes
          </Link>

          <Link to="/admin/usuarios" className={navLinkClass('/admin/usuarios')}>
            <Users className="w-5 h-5" />
            Usuarios
          </Link>
          
          {/* System Section Header */}
          <div className="pt-6 pb-2 px-3">
            <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">Sistema</span>
          </div>

          {/* Technical Operations Submenu */}
          <div>
            <button 
              onClick={() => setIsTechOpsOpen(!isTechOpsOpen)}
              className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isTechOpsOpen ? 'text-white bg-white/10' : 'text-slate-200 hover:bg-white/10'
              }`}
            >
              <div className="flex items-center gap-3">
                <Wrench className="w-5 h-5" />
                Operación técnica
              </div>
              <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isTechOpsOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isTechOpsOpen && (
                <motion.div 
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden ml-4 mt-1 space-y-1 border-l-2 border-slate-100"
                >
                  <Link to="/admin/respaldos" className={subNavLinkClass('/admin/respaldos')}>
                    <Database className="w-4 h-4" />
                    Respaldos manuales
                  </Link>
                  <Link to="/admin/monitoreo" className={subNavLinkClass('/admin/monitoreo')}>
                    <Activity className="w-4 h-4" />
                    Monitoreo de sistema
                  </Link>
                  <Link to="/admin/datos" className={subNavLinkClass('/admin/datos')}>
                    <ArrowLeftRight className="w-4 h-4" />
                    Gestión de datos
                  </Link>
                  <Link to="/admin/auditoria" className={subNavLinkClass('/admin/auditoria')}>
                    <ShieldAlert className="w-4 h-4" />
                    Auditoría
                  </Link>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link to="/admin/configuracion" className={navLinkClass('/admin/configuracion')}>
            <Settings className="w-5 h-5" />
            Configuración
          </Link>

          <button 
            onClick={handleLogout}
            className="w-full text-red-300 hover:bg-red-900/50 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </nav>

        {/* Server Status Indicator */}
        <div className="p-4 border-t border-white/10">
          <div className="flex items-center gap-3 p-3 rounded-xl bg-white/10">
            <Cloud className="w-6 h-6 text-emerald-400" />
            <div>
              <p className="text-[10px] font-bold text-white/70 uppercase tracking-widest">Estado del servidor</p>
              <p className="text-xs font-semibold text-white">Conectado y Seguro</p>
            </div>
          </div>
        </div>
      </motion.aside>
      {/* END: LeftSidebar */}
      
      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* BEGIN: TopNavbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0 z-10">
          {/* Left side of header */}
          <div>
            <h2 className="text-lg font-bold text-[#1e3a5f]">Panel de Administración</h2>
          </div>
          
          {/* Right side of header */}
          <div className="flex items-center gap-6">
            {/* Notification Icon */}
            <Link to="/notificaciones" className="relative p-2 text-gray-400 hover:text-[#1e3a5f] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </Link>
            
            {/* User Profile */}
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#1e3a5f]">{user?.name || 'Carlos Bautista'}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role || 'Propietario'}</p>
              </div>
              <div className="relative">
                <img 
                  alt="User Profile" 
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuCgTQQ5CBal8__PmS7Awrv1-fEp4q5CAO4Jt7MqYur9BTUz29a2MniHPTWKDsN2eJeL8vTqO-jMaQDCaZlW5LIJMmXBwuusCuRVHGIDhDExspzTrxR7AxSuk-wzQvi51g_i9_Rhe1U71ywspcwAjxPpDdA66-mLWUipNQAoP34Lt27PfskwxTq8OkFhAwjuNTKjgAHKimkyu7iocxIr09nI1u0fFSmgiYusQeMfs7L39kYy2NnCSMYkFfzTIgoeJCIerdglChmD-Jxc" 
                />
                <span className="absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-white"></span>
              </div>
            </div>
          </div>
        </header>
        {/* END: TopNavbar */}
        
        {/* BEGIN: MainContentArea */}
        <main className="flex-1 overflow-y-auto bg-slate-100 p-4 md:p-6 lg:p-8 custom-scrollbar">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-[2rem] shadow-sm p-6 md:p-8 min-h-full flex flex-col w-full"
          >
            {children}
          </motion.div>
        </main>
        {/* END: MainContentArea */}
      </div>
    </div>
  );
}