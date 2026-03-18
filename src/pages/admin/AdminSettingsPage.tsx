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
import { DataService } from '../../services/dataService';
import { FadeIn, StaggerContainer, GlassCard, AnimatedButton } from '../../components/Animations';

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

  const handleSave = async () => {
    setSaving(true);
    try {
      await DataService.saveSettings(settings);
      // In a real app, we would show a toast here
      alert('Configuración guardada exitosamente');
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateStoreInfo = (field: string, value: string) => {
    setSettings({
      ...settings,
      storeInfo: {
        ...settings.storeInfo,
        [field]: value
      }
    });
  };

  const updateSocial = (field: string, value: string) => {
    setSettings({
      ...settings,
      social: {
        ...settings.social,
        [field]: value
      }
    });
  };

  const updateNotification = (field: string, value: boolean) => {
    setSettings({
      ...settings,
      notifications: {
        ...settings.notifications,
        [field]: value
      }
    });
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
        <RefreshCw className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  return (
    <div className="w-full h-full space-y-8">
      {/* Header */}
      <FadeIn className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black tracking-tight text-slate-900">Configuración</h1>
          <p className="text-sm text-slate-500">Personaliza el comportamiento y apariencia de tu tienda</p>
        </div>
        <AnimatedButton 
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-50"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Guardando...' : 'Guardar Cambios'}
        </AnimatedButton>
      </FadeIn>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Nav */}
        <FadeIn className="lg:col-span-1">
          <GlassCard className="overflow-hidden">
            <nav className="p-2 space-y-1">
              {sections.map((section) => (
                <button 
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-bold transition-all ${
                    section.id === activeSection 
                      ? 'bg-blue-600/10 text-blue-600' 
                      : 'text-slate-500 hover:bg-white/50 hover:text-slate-900'
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
          </GlassCard>
        </FadeIn>

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
                <GlassCard className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="text-sm font-bold text-slate-800">Información de la Tienda</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nombre de la Tienda</label>
                        <input 
                          type="text" 
                          value={settings.storeInfo.name} 
                          onChange={(e) => updateStoreInfo('name', e.target.value)}
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-600 focus:border-blue-600 bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email de Contacto</label>
                        <input 
                          type="email" 
                          value={settings.storeInfo.email} 
                          onChange={(e) => updateStoreInfo('email', e.target.value)}
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-600 focus:border-blue-600 bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Teléfono</label>
                        <input 
                          type="text" 
                          value={settings.storeInfo.phone} 
                          onChange={(e) => updateStoreInfo('phone', e.target.value)}
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-600 focus:border-blue-600 bg-white/50"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Moneda Principal</label>
                        <select 
                          value={settings.storeInfo.currency}
                          onChange={(e) => updateStoreInfo('currency', e.target.value)}
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-600 bg-white/50"
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
                        value={settings.storeInfo.address}
                        onChange={(e) => updateStoreInfo('address', e.target.value)}
                        className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-600 focus:border-blue-600 bg-white/50"
                      ></textarea>
                    </div>
                  </div>
                </GlassCard>

                {/* Social & SEO */}
                <GlassCard className="overflow-hidden">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/30">
                    <h3 className="text-sm font-bold text-slate-800">Redes Sociales & SEO</h3>
                  </div>
                  <div className="p-6 space-y-6">
                    <div className="space-y-4">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-100/50 flex items-center justify-center text-slate-500">
                          <Globe className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-500 uppercase">Sitio Web</p>
                          <input 
                            type="text" 
                            value={settings.social.website} 
                            onChange={(e) => updateSocial('website', e.target.value)}
                            className="w-full mt-1 rounded-xl border-slate-200 text-sm focus:ring-blue-600 bg-white/50"
                          />
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-slate-100/50 flex items-center justify-center text-slate-500">
                          <Smartphone className="w-5 h-5" />
                        </div>
                        <div className="flex-1">
                          <p className="text-xs font-bold text-slate-500 uppercase">Instagram</p>
                          <input 
                            type="text" 
                            value={settings.social.instagram} 
                            onChange={(e) => updateSocial('instagram', e.target.value)}
                            className="w-full mt-1 rounded-xl border-slate-200 text-sm focus:ring-blue-600 bg-white/50"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* Danger Zone */}
                <section className="bg-rose-50/50 backdrop-blur-sm rounded-2xl border border-rose-100 p-6">
                  <h3 className="text-sm font-bold text-rose-900 mb-2">Zona de Peligro</h3>
                  <p className="text-xs text-rose-700 mb-6">Una vez que eliminas la tienda o desactivas el servicio, no hay vuelta atrás. Por favor, ten cuidado.</p>
                  <AnimatedButton className="px-6 py-2.5 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition-colors">
                    Desactivar Tienda Temporalmente
                  </AnimatedButton>
                </section>
              </motion.div>
            )}

            {activeSection === 'notifications' && (
              <motion.div 
                key="notifications"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard className="p-6 overflow-hidden">
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
                            checked={settings.notifications[item.id]} 
                            onChange={(e) => updateNotification(item.id, e.target.checked)}
                            className="sr-only peer" 
                          />
                          <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                        </label>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSection === 'security' && (
              <motion.div 
                key="security"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard className="p-6 overflow-hidden">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Seguridad de la Cuenta</h3>
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Contraseña Actual</label>
                        <input 
                          type="password" 
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-600 focus:border-blue-600 bg-white/50"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Nueva Contraseña</label>
                        <input 
                          type="password" 
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-600 focus:border-blue-600 bg-white/50"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Confirmar Nueva Contraseña</label>
                        <input 
                          type="password" 
                          className="w-full rounded-xl border-slate-200 text-sm focus:ring-blue-600 focus:border-blue-600 bg-white/50"
                          placeholder="••••••••"
                        />
                      </div>
                      <div className="pt-4">
                        <AnimatedButton className="px-6 py-2.5 bg-slate-900 text-white rounded-xl text-sm font-bold hover:bg-slate-800 transition-colors">
                          Actualizar Contraseña
                        </AnimatedButton>
                      </div>
                    </div>
                    
                    <div className="pt-8 border-t border-slate-100">
                      <h4 className="text-sm font-bold text-slate-900 mb-4">Autenticación de Dos Factores (2FA)</h4>
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                        <div>
                          <p className="text-sm font-bold text-slate-900">App de Autenticación</p>
                          <p className="text-xs text-slate-500">Usa una app como Google Authenticator</p>
                        </div>
                        <AnimatedButton className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                          Configurar
                        </AnimatedButton>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSection === 'payments' && (
              <motion.div 
                key="payments"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard className="p-6 overflow-hidden">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Métodos de Pago</h3>
                  <div className="space-y-6">
                    <div className="p-5 border border-slate-200 rounded-2xl flex items-start justify-between bg-white">
                      <div className="flex gap-4">
                        <div className="w-12 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-black text-xs">
                          STRIPE
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Stripe</h4>
                          <p className="text-xs text-slate-500">Tarjetas de crédito y débito</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">Conectado</span>
                    </div>
                    
                    <div className="p-5 border border-slate-200 rounded-2xl flex items-start justify-between bg-white">
                      <div className="flex gap-4">
                        <div className="w-12 h-8 bg-[#00457C] rounded flex items-center justify-center text-white font-black text-xs">
                          PAYPAL
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">PayPal</h4>
                          <p className="text-xs text-slate-500">Pagos internacionales</p>
                        </div>
                      </div>
                      <AnimatedButton className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-200 transition-colors">
                        Conectar
                      </AnimatedButton>
                    </div>

                    <div className="p-5 border border-slate-200 rounded-2xl flex items-start justify-between bg-white">
                      <div className="flex gap-4">
                        <div className="w-12 h-8 bg-emerald-600 rounded flex items-center justify-center text-white font-black text-xs">
                          SPEI
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-900">Transferencia Bancaria</h4>
                          <p className="text-xs text-slate-500">Pagos locales en México</p>
                        </div>
                      </div>
                      <span className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black rounded-full uppercase tracking-widest">Conectado</span>
                    </div>
                  </div>
                </GlassCard>
              </motion.div>
            )}

            {activeSection === 'emails' && (
              <motion.div 
                key="emails"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <GlassCard className="p-6 overflow-hidden">
                  <h3 className="text-lg font-bold text-slate-900 mb-6">Plantillas de Email</h3>
                  <div className="space-y-4">
                    {[
                      { id: 'order_confirmation', name: 'Confirmación de Pedido', subject: '¡Gracias por tu compra en {store_name}!' },
                      { id: 'order_shipped', name: 'Pedido Enviado', subject: 'Tu pedido #{order_id} está en camino' },
                      { id: 'order_delivered', name: 'Pedido Entregado', subject: 'Tu pedido ha sido entregado' },
                      { id: 'welcome_email', name: 'Bienvenida', subject: '¡Bienvenido a {store_name}!' },
                    ].map((template) => (
                      <div key={template.id} className="p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/50 transition-colors cursor-pointer group">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-700">{template.name}</h4>
                            <p className="text-xs text-slate-500 mt-1">Asunto: {template.subject}</p>
                          </div>
                          <AnimatedButton className="px-4 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-colors">
                            Editar
                          </AnimatedButton>
                        </div>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
