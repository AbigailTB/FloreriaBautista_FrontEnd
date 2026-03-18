import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye } from 'lucide-react';

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <main className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-[#f0f7ff]">
      <div className="max-w-6xl w-full bg-[#f0f7ff] rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Side Image Panel */}
        <div className="lg:w-1/2 relative hidden lg:block">
          <div className="absolute inset-0 bg-brand-coral/10 mix-blend-multiply"></div>
          <img 
            alt="Premium Bouquet" 
            className="h-full w-full object-cover" 
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuAhiiM0MK5qtvm5FrmQ_lpkQIR_WS5UlVsed3SPmlrHhC0kYmnXaQPF9q0TwADGBra8ObaUbqCnZqTYTEua_nTWhjbaAr2kuubs-PWlHwHhflDCZpmETV5EyIbZvMCoX-6X_L38qcJSuWQSOoeZBZCcObwdxGuanSTogd5DEmqUI21R6wYMV7QNMn-EWvqcMse_NhRhLO1pXpu_UWYcPT_1Mfk787WbdozLAFvnHv1nSRP2HP07uCId1QCU23OznaGP-e6haAeQcoR2"
          />
          <div className="absolute bottom-0 left-0 right-0 p-12 bg-gradient-to-t from-black/80 to-transparent">
            <h2 className="text-3xl font-bold text-white mb-2">Diseños que cuentan historias</h2>
            <p className="text-slate-200 text-lg">Únete a nuestra comunidad exclusiva y recibe las mejores flores frescas en la puerta de tu hogar.</p>
          </div>
        </div>

        {/* Registration Form Panel */}
        <div className="lg:w-1/2 p-8 sm:p-12 lg:p-16">
          <div className="mb-10 text-center lg:text-left">
            <button 
              onClick={() => navigate(-1)}
              className="flex items-center justify-center lg:justify-start gap-1 text-brand-coral hover:text-brand-coral/80 font-semibold text-sm mb-4 transition-colors w-full lg:w-auto" 
              type="button"
            >
              <ArrowLeft className="w-4 h-4" />
              Volver
            </button>
            <h1 className="text-3xl font-extrabold text-brand-deep mb-2">Crear una cuenta</h1>
            <p className="text-slate-500">Regístrate para comenzar tu experiencia floral personalizada.</p>
          </div>

          <form className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Nombre completo</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral outline-none transition-all" 
                  placeholder="Ej. Juan Pérez" 
                  type="text"
                />
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Teléfono</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral outline-none transition-all" 
                  placeholder="+52 1 234 567 890" 
                  type="tel"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Correo electrónico</label>
              <input 
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral outline-none transition-all" 
                placeholder="hola@ejemplo.com" 
                type="email"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Género</label>
                <select className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral outline-none transition-all">
                  <option>Seleccionar</option>
                  <option>Femenino</option>
                  <option>Masculino</option>
                  <option>Otro / Prefiero no decir</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-sm font-semibold text-slate-700">Fecha de nacimiento</label>
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral outline-none transition-all" 
                  type="date"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-sm font-semibold text-slate-700">Contraseña</label>
              <div className="relative">
                <input 
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:ring-2 focus:ring-brand-coral/20 focus:border-brand-coral outline-none transition-all" 
                  placeholder="••••••••" 
                  type="password"
                />
                <button className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-brand-coral" type="button">
                  <Eye className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <span className="w-3 h-3 rounded-full bg-green-500 flex items-center justify-center text-white text-[8px]">✓</span> 8+ caracteres
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <span className="w-3 h-3 rounded-full border border-slate-300"></span> 1 mayúscula
                </span>
                <span className="flex items-center gap-1 text-[11px] font-medium text-slate-500">
                  <span className="w-3 h-3 rounded-full border border-slate-300"></span> 1 número
                </span>
              </div>
            </div>

            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-xl font-bold text-lg transition-all shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 mt-4" 
              type="button"
            >
              Crear cuenta
            </button>

            <div className="text-center pt-4">
              <p className="text-sm text-slate-600">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="text-brand-coral font-bold hover:underline">
                  Inicia sesión
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}
