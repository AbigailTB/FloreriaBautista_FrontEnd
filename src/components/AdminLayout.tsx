import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  LogOut
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: any;
}

export default function AdminLayout({ children, user }: AdminLayoutProps) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="flex h-screen overflow-hidden bg-slate-100">
      {/* BEGIN: LeftSidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0">
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#1e3a5f] rounded-md flex items-center justify-center text-white">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"></path>
              </svg>
            </div>
            <span className="font-bold text-[#1e3a5f] text-lg">Florería Bautista</span>
          </div>
        </div>
        
        {/* Navigation Links */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {/* Main Dashboard Link (Active State) */}
          <Link to="/dashboard" className="bg-[#1e3a5f] text-white flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          
          {/* Other Links */}
          <Link to="/catalogo" className="text-slate-500 hover:bg-slate-100 hover:text-[#1e3a5f] flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <ShoppingBag className="w-5 h-5" />
            Catálogo
          </Link>
          <a href="#" className="text-slate-500 hover:bg-slate-100 hover:text-[#1e3a5f] flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <ShoppingCart className="w-5 h-5" />
            Pedidos
          </a>
          <a href="#" className="text-slate-500 hover:bg-slate-100 hover:text-[#1e3a5f] flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Package className="w-5 h-5" />
            Inventario
          </a>
          <a href="#" className="text-slate-500 hover:bg-slate-100 hover:text-[#1e3a5f] flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <CreditCard className="w-5 h-5" />
            Pagos
          </a>
          <a href="#" className="text-slate-500 hover:bg-slate-100 hover:text-[#1e3a5f] flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <BarChart3 className="w-5 h-5" />
            Reportes
          </a>
          <a href="#" className="text-slate-500 hover:bg-slate-100 hover:text-[#1e3a5f] flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Users className="w-5 h-5" />
            Usuarios
          </a>
          
          {/* System Section Header */}
          <div className="pt-6 pb-2 px-3">
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Sistema</span>
          </div>
          <a href="#" className="text-slate-500 hover:bg-slate-100 hover:text-[#1e3a5f] flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Wrench className="w-5 h-5" />
            Operación técnica
          </a>
          <a href="#" className="text-slate-500 hover:bg-slate-100 hover:text-[#1e3a5f] flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors">
            <Settings className="w-5 h-5" />
            Configuración
          </a>

          <button 
            onClick={handleLogout}
            className="w-full text-red-500 hover:bg-red-50 flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors mt-8"
          >
            <LogOut className="w-5 h-5" />
            Cerrar Sesión
          </button>
        </nav>
      </aside>
      {/* END: LeftSidebar */}
      
      {/* Content Wrapper */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* BEGIN: TopNavbar */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-8 flex-shrink-0">
          {/* Left side of header */}
          <div>
            <h2 className="text-lg font-bold text-[#1e3a5f]">Panel de Administración</h2>
          </div>
          
          {/* Right side of header */}
          <div className="flex items-center gap-6">
            {/* Notification Icon */}
            <button className="relative p-2 text-gray-400 hover:text-[#1e3a5f] transition-colors">
              <Bell className="w-6 h-6" />
              <span className="absolute top-2 right-2 block h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
            </button>
            
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
        <main className="flex-1 overflow-y-auto bg-white p-8">
          {children}
        </main>
        {/* END: MainContentArea */}
      </div>
    </div>
  );
}
