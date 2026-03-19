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
  RefreshCw,
} from 'lucide-react';
import { DataService } from '../../services/dataService';

const inputClass =
  'w-full px-3.5 py-2.5 text-sm border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-blue-400/50 focus:border-blue-400 bg-white text-slate-800 placeholder-slate-400 transition-all';

const labelClass = 'block text-xs font-semibold text-slate-500 mb-1.5';

export default function AdminSettingsPage() {
  const [activeSection, setActiveSection] = useState('general');
  const [settings, setSettings]           = useState<any>(null);
  const [loading, setLoading]             = useState(true);
  const [saving, setSaving]               = useState(false);

  useEffect(() => {
    const data = DataService.getSettings();
    setSettings(data);
    setLoading(false);
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await DataService.saveSettings(settings);
      alert('Configuración guardada exitosamente');
    } catch {
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const updateStoreInfo   = (f: string, v: string)  => setSettings((s: any) => ({ ...s, storeInfo:     { ...s.storeInfo,     [f]: v } }));
  const updateSocial      = (f: string, v: string)  => setSettings((s: any) => ({ ...s, social:        { ...s.social,        [f]: v } }));
  const updateNotification= (f: string, v: boolean) => setSettings((s: any) => ({ ...s, notifications: { ...s.notifications, [f]: v } }));

  const sections = [
    { id: 'general',       label: 'General',         icon: Store       },
    { id: 'notifications', label: 'Notificaciones',  icon: Bell        },
    { id: 'security',      label: 'Seguridad',       icon: Shield      },
    { id: 'payments',      label: 'Pagos',           icon: CreditCard  },
    { id: 'emails',        label: 'Emails',          icon: Mail        },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
          <RefreshCw className="w-5 h-5 text-blue-500 animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6 py-6">

      {/* ── Header ─────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center">
              <Settings className="w-5 h-5 text-slate-600" />
            </div>
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Configuración</h1>
          </div>
          <p className="text-sm text-slate-400 ml-12">Personaliza el comportamiento de tu tienda</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:scale-[.98] disabled:opacity-50 text-white rounded-xl text-sm font-bold transition-all shadow-sm shadow-blue-200 ml-12 sm:ml-0"
        >
          {saving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          {saving ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </div>

      {/* ── Layout ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">

        {/* Sidebar nav */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-2 space-y-0.5">
            {sections.map(({ id, label, icon: Icon }) => (
              <button
                key={id}
                onClick={() => setActiveSection(id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  id === activeSection
                    ? 'bg-blue-50 text-blue-700 border border-blue-100'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className="w-4 h-4" />
                  {label}
                </div>
                <ChevronRight className={`w-3.5 h-3.5 transition-opacity ${id === activeSection ? 'opacity-100' : 'opacity-0'}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3 space-y-5">

          {/* ── General ── */}
          {activeSection === 'general' && (
            <div className="space-y-5">
              {/* Store info */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-sm font-bold text-slate-800">Información de la tienda</h3>
                </div>
                <div className="p-6 space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    <div>
                      <label className={labelClass}>Nombre de la tienda</label>
                      <input type="text" value={settings.storeInfo?.name ?? ''} onChange={e => updateStoreInfo('name', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Email de contacto</label>
                      <input type="email" value={settings.storeInfo?.email ?? ''} onChange={e => updateStoreInfo('email', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Teléfono</label>
                      <input type="text" value={settings.storeInfo?.phone ?? ''} onChange={e => updateStoreInfo('phone', e.target.value)} className={inputClass} />
                    </div>
                    <div>
                      <label className={labelClass}>Moneda principal</label>
                      <div className="relative">
                        <select value={settings.storeInfo?.currency ?? 'MXN'} onChange={e => updateStoreInfo('currency', e.target.value)} className={`${inputClass} appearance-none cursor-pointer pr-9`}>
                          <option value="MXN">Peso Mexicano (MXN)</option>
                          <option value="USD">Dólar Americano (USD)</option>
                        </select>
                        <ChevronRight className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 rotate-90 pointer-events-none" />
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Dirección física</label>
                    <textarea rows={3} value={settings.storeInfo?.address ?? ''} onChange={e => updateStoreInfo('address', e.target.value)} className={`${inputClass} resize-none`} />
                  </div>
                </div>
              </div>

              {/* Social */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                  <h3 className="text-sm font-bold text-slate-800">Redes sociales & SEO</h3>
                </div>
                <div className="p-6 space-y-4">
                  {[
                    { field: 'website',   label: 'Sitio web',  icon: Globe,       type: 'url'  },
                    { field: 'instagram', label: 'Instagram',  icon: Smartphone,  type: 'text' },
                  ].map(({ field, label, icon: Icon, type }) => (
                    <div key={field} className="flex items-center gap-4">
                      <div className="w-9 h-9 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center shrink-0">
                        <Icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <div className="flex-1">
                        <label className={labelClass}>{label}</label>
                        <input type={type} value={settings.social?.[field] ?? ''} onChange={e => updateSocial(field, e.target.value)} className={inputClass} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Danger zone */}
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-rose-800 mb-1.5">Zona de peligro</h3>
                <p className="text-xs text-rose-600 mb-4 leading-relaxed">
                  Una vez que desactivas la tienda no hay vuelta atrás inmediata. Por favor ten cuidado.
                </p>
                <button className="px-4 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-[.98] text-white rounded-xl text-xs font-bold transition-all">
                  Desactivar tienda temporalmente
                </button>
              </div>
            </div>
          )}

          {/* ── Notifications ── */}
          {activeSection === 'notifications' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="text-sm font-bold text-slate-800">Preferencias de notificación</h3>
              </div>
              <div className="divide-y divide-slate-50">
                {[
                  { id: 'orderConfirmation', label: 'Confirmación de pedido',  desc: 'Email automático al cliente tras la compra'         },
                  { id: 'lowStockAlerts',    label: 'Alertas de stock bajo',   desc: 'Notificar cuando un producto llegue al mínimo'      },
                  { id: 'newCustomerAlerts', label: 'Nuevos clientes',         desc: 'Notificar cuando un nuevo usuario se registre'      },
                  { id: 'weeklyReports',     label: 'Reportes semanales',      desc: 'Enviar resumen de ventas cada lunes'                },
                ].map(item => (
                  <div key={item.id} className="flex items-center justify-between px-6 py-4">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={settings.notifications?.[item.id] ?? false}
                        onChange={e => updateNotification(item.id, e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-10 h-6 bg-slate-200 rounded-full peer peer-checked:bg-blue-600 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-4 after:shadow-sm" />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Security ── */}
          {activeSection === 'security' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="text-sm font-bold text-slate-800">Seguridad de la cuenta</h3>
              </div>
              <div className="p-6 space-y-5">
                {[
                  { label: 'Contraseña actual',          ph: '••••••••' },
                  { label: 'Nueva contraseña',           ph: '••••••••' },
                  { label: 'Confirmar nueva contraseña', ph: '••••••••' },
                ].map(({ label, ph }) => (
                  <div key={label}>
                    <label className={labelClass}>{label}</label>
                    <input type="password" placeholder={ph} className={inputClass} />
                  </div>
                ))}
                <button className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 active:scale-[.98] text-white rounded-xl text-sm font-bold transition-all mt-2">
                  Actualizar contraseña
                </button>

                <div className="pt-5 border-t border-slate-100">
                  <h4 className="text-sm font-bold text-slate-800 mb-3">Autenticación de dos factores (2FA)</h4>
                  <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <div>
                      <p className="text-sm font-semibold text-slate-800">App de autenticación</p>
                      <p className="text-xs text-slate-400 mt-0.5">Usa Google Authenticator u otra app compatible</p>
                    </div>
                    <button className="px-3.5 py-2 bg-white border border-slate-200 text-slate-700 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all">
                      Configurar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Payments ── */}
          {activeSection === 'payments' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="text-sm font-bold text-slate-800">Métodos de pago</h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { name: 'Stripe',                abbr: 'STR',  desc: 'Tarjetas de crédito y débito',  bg: 'bg-blue-600',    connected: true  },
                  { name: 'PayPal',                abbr: 'PPL',  desc: 'Pagos internacionales',          bg: 'bg-[#00457C]',   connected: false },
                  { name: 'Transferencia bancaria', abbr: 'SPEI', desc: 'Pagos locales en México',       bg: 'bg-emerald-600', connected: true  },
                ].map(({ name, abbr, desc, bg, connected }) => (
                  <div key={name} className="flex items-center justify-between p-4 border border-slate-200 rounded-xl bg-white hover:bg-slate-50/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-12 h-8 ${bg} rounded-lg flex items-center justify-center text-white text-[10px] font-black`}>
                        {abbr}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-800">{name}</p>
                        <p className="text-xs text-slate-400">{desc}</p>
                      </div>
                    </div>
                    {connected
                      ? <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-lg">Conectado</span>
                      : <button className="text-xs font-bold px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-all">Conectar</button>
                    }
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── Emails ── */}
          {activeSection === 'emails' && (
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 bg-gradient-to-r from-slate-50 to-white">
                <h3 className="text-sm font-bold text-slate-800">Plantillas de email</h3>
              </div>
              <div className="p-6 space-y-3">
                {[
                  { id: 'order_confirmation', name: 'Confirmación de pedido', subject: '¡Gracias por tu compra en {store_name}!'   },
                  { id: 'order_shipped',      name: 'Pedido enviado',         subject: 'Tu pedido #{order_id} está en camino'       },
                  { id: 'order_delivered',    name: 'Pedido entregado',       subject: 'Tu pedido ha sido entregado'                },
                  { id: 'welcome_email',      name: 'Bienvenida',             subject: '¡Bienvenido a {store_name}!'                },
                ].map(t => (
                  <div key={t.id} className="flex items-center justify-between p-4 border border-slate-100 rounded-xl hover:border-blue-200 hover:bg-blue-50/30 transition-all cursor-pointer group">
                    <div>
                      <p className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors">{t.name}</p>
                      <p className="text-xs text-slate-400 mt-0.5">Asunto: {t.subject}</p>
                    </div>
                    <button className="px-3.5 py-2 bg-white border border-slate-200 text-slate-600 rounded-lg text-xs font-bold hover:bg-slate-50 transition-all shrink-0 ml-4">
                      Editar
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}