import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Store, 
  Bell, 
  Shield, 
  CreditCard, 
  Globe, 
  Mail, 
  Smartphone,
  ChevronRight,
  Save,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService } from '../services/dataService';

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const data = DataService.getSettings();
      setSettings(data);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      alert('Configuración guardada correctamente (Simulado)');
    }, 1500);
  };

  const sections = [
    { id: 'general', label: 'General', icon: <Store className="w-4 h-4" /> },
    { id: 'notifications', label: 'Notificaciones', icon: <Bell className="w-4 h-4" /> },
    { id: 'security', label: 'Seguridad', icon: <Shield className="w-4 h-4" /> },
    { id: 'payments', label: 'Pagos', icon: <CreditCard className="w-4 h-4" /> },
    { id: 'emails', label: 'Emails', icon: <Mail className="w-4 h-4" /> },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="w-8 h-8 text-[#1e3a5f] animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Configuración</h1>
          <p className="text-sm text-slate-500">Personaliza el comportamiento y apariencia de tu tienda</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-[#1e3a5f] text-white rounded-xl text-sm font-bold hover:bg-opacity-90 shadow-lg shadow-[#1e3a5f]/20 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <nav className="p-2 space-y-1">
              {sections.map((section) => (
                <button 
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    section.id === activeSection 
                      ? 'bg-slate-100 text-[#1e3a5f]' 
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {section.icon}
                    {section.label}
                  </div>
                  <ChevronRight className={`w-4 h-4 transition-all ${section.id === activeSection ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'}`} />
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {activeSection === 'general' && (
              <motion.div 
                key="general"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                {/* Store Info */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="text-sm font-bold text-slate-800">Información de la Tienda</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de la Tienda</label>
                        <input 
                          type="text" 
                          defaultValue={settings.storeInfo.name} 
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email de Contacto</label>
                        <input 
                          type="email" 
                          defaultValue={settings.storeInfo.email} 
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teléfono</label>
                        <input 
                          type="text" 
                          defaultValue={settings.storeInfo.phone} 
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Moneda Principal</label>
                        <select 
                          defaultValue={settings.storeInfo.currency}
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f]"
                        >
                          <option value="MXN">Peso Mexicano (MXN)</option>
                          <option value="USD">Dólar Americano (USD)</option>
                        </select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Dirección Física</label>
                      <textarea 
                        rows={3}
                        defaultValue={settings.storeInfo.address}
                        className="w-full rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f] focus:border-[#1e3a5f]"
                      ></textarea>
                    </div>
                  </div>
                </section>

                {/* Social & SEO */}
                <section className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="text-sm font-bold text-slate-800">Redes Sociales & SEO</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-500 uppercase">Sitio Web</p>
                          <input 
                            type="text" 
                            defaultValue={settings.social.website} 
                            className="w-full mt-1 rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f]"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-500 uppercase">Instagram</p>
                          <input 
                            type="text" 
                            defaultValue={settings.social.instagram} 
                            className="w-full mt-1 rounded-xl border-slate-200 text-sm focus:ring-[#1e3a5f]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </section>

                {/* Danger Zone */}
                <section className="bg-rose-50 rounded-2xl border border-rose-100 p-6">
                  <h3 className="text-sm font-bold text-rose-900 mb-2">Zona de Peligro</h3>
                  <p className="text-xs text-rose-700 mb-6">Una vez que eliminas la tienda o desactivas el servicio, no hay vuelta atrás. Por favor, ten cuidado.</p>
                  <button className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors">
                    Desactivar Tienda Temporalmente
                  </button>
                </section>
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden p-6"
              >
                <h3 className="text-lg font-bold text-slate-900 mb-6">Preferencias de Notificación</h3>
                <div className="space-y-6">
                  {[
                    { id: 'orderConfirmation', label: 'Confirmación de Pedido', desc: 'Enviar email automático al cliente tras la compra' },
                    { id: 'lowStockAlerts', label: 'Alertas de Stock Bajo', desc: 'Notificar cuando un producto llegue al mínimo' },
                    { id: 'newCustomerAlerts', label: 'Nuevos Clientes', desc: 'Notificar cuando un nuevo usuario se registre' },
                    { id: 'weeklyReports', label: 'Reportes Semanales', desc: 'Enviar resumen de ventas cada lunes' },
                  ].map((item) => (
                    <div key={item.id} className="flex items-center justify-between py-4 border-b border-slate-100 last:border-0">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.label}</p>
                        <p className="text-xs text-slate-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input 
                          type="checkbox" 
                          defaultChecked={settings.notifications[item.id]} 
                          className="sr-only peer" 
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1e3a5f]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection !== 'general' && activeSection !== 'notifications' && (
              <motion.div 
                key="other"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-sm p-12 text-center"
              >
                <Settings className="w-12 h-12 text-slate-200 mx-auto mb-4" />
                <h3 className="text-lg font-bold text-slate-900">Sección en Desarrollo</h3>
                <p className="text-sm text-slate-500">Esta sección de configuración estará disponible próximamente.</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
