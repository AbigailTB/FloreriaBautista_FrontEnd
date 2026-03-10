import React from 'react';
import { 
  ChevronRight, 
  Info, 
  Settings, 
  Check, 
  Camera, 
  Plus, 
  X,
  Eye,
  Save,
  Trash2
} from 'lucide-react';

export default function ProductManagementPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <nav className="flex items-center gap-2 text-sm text-slate-500 mb-1">
            <span className="hover:text-amber-600 cursor-pointer">Catálogo</span>
            <ChevronRight className="w-3 h-3" />
            <span className="font-medium text-slate-900">Crear Producto</span>
          </nav>
          <h2 className="text-2xl font-bold text-slate-900">Gestión de Producto</h2>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            Cancelar
          </button>
          <button className="px-6 py-2 bg-[#1a3b5b] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-opacity-90 transition-all flex items-center gap-2">
            <Save className="w-4 h-4" />
            Guardar Producto
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center mb-6">
              <span className="w-8 h-8 rounded-full bg-blue-50 text-[#1a3b5b] flex items-center justify-center mr-3">
                <Info className="w-4 h-4" />
              </span>
              <h3 className="text-lg font-bold text-slate-800">Información Básica</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 after:content-['*'] after:text-red-500 after:ml-1">Nombre del Producto</label>
                <input 
                  type="text" 
                  className="w-full rounded-lg border-slate-300 focus:border-[#1a3b5b] focus:ring-[#1a3b5b]" 
                  placeholder="Ej. Ramo de Rosas Premium" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 after:content-['*'] after:text-red-500 after:ml-1">Descripción</label>
                <textarea 
                  className="w-full rounded-lg border-slate-300 focus:border-[#1a3b5b] focus:ring-[#1a3b5b]" 
                  placeholder="Describe las características principales, tipos de flores y cuidados..." 
                  required 
                  rows={4}
                ></textarea>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1 after:content-['*'] after:text-red-500 after:ml-1">Precio Base (MXN)</label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-500">$</span>
                    <input 
                      type="number" 
                      className="w-full pl-8 rounded-lg border-slate-300 focus:border-[#1a3b5b] focus:ring-[#1a3b5b]" 
                      placeholder="0.00" 
                      required 
                      step="0.01"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">SKU / Referencia</label>
                  <input 
                    type="text" 
                    className="w-full rounded-lg border-slate-300 focus:border-[#1a3b5b] focus:ring-[#1a3b5b]" 
                    placeholder="FB-ROS-001" 
                  />
                </div>
              </div>
            </div>
          </section>

          {/* Personalization */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center space-x-3">
                <Settings className="w-5 h-5 text-slate-700" />
                <h3 className="text-lg font-bold text-slate-800">Personalización</h3>
              </div>
              <div className="flex items-center space-x-3">
                <span className="text-sm text-slate-500">Habilitar</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#1a3b5b]"></div>
                </label>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: 'Color de flores', desc: 'Permitir elegir el color de las flores principales.' },
                { title: 'Tamaño de arreglo', desc: 'Opciones: Chico, Mediano, Grande, Deluxe.' },
                { title: 'Mensaje dedicado', desc: 'Incluir tarjeta con mensaje personalizado.' },
              ].map((opt, idx) => (
                <div key={idx} className="p-4 border border-slate-100 rounded-xl bg-slate-50/50 shadow-sm flex flex-col">
                  <div className="flex items-start mb-2">
                    <div className="bg-[#1a3b5b] rounded flex items-center justify-center p-0.5 mr-3">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{opt.title}</h4>
                      <p className="text-xs text-slate-500 mt-1">{opt.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Right Column: Sidebar Settings */}
        <div className="space-y-6">
          {/* Image Management */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Imagen Destacada</h3>
            <div className="relative group cursor-pointer border-2 border-dashed border-slate-300 rounded-xl overflow-hidden hover:border-[#1a3b5b] transition-all">
              <img 
                alt="Product Preview" 
                className="w-full h-64 object-cover opacity-90 group-hover:opacity-100 transition-opacity" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCZFYxXGhp49ZAZSn2ccHrQnIXq09O03wnj-MU__6LosKteNxbLWCHCC4i-GC60sf3R7ZaNbkLqybsN6PutqPVR3_nv08IMRQ6rf0UvPxFc7f_HPDdpVkRnVDdwAFKPPKUkVKq1ZPNpTUafZJEuyf_QIbo6XjbGm1qwOSsiPO72gW1cBlKYF04lqsnIqagPK8I9nSSo_WfheW3Lkb32MQNPyt6Mu-dpb147wXSNCj7AQ_G-tBCHAWhXdFCwPi7m0TADtOSFNRaVGenx" 
              />
              <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="text-white w-8 h-8 mb-2" />
                <span className="text-white text-xs font-bold">Cambiar Imagen</span>
              </div>
            </div>
            <div className="mt-4 flex space-x-2">
              <div className="w-16 h-16 rounded border border-slate-200 overflow-hidden cursor-pointer hover:ring-2 ring-[#1a3b5b]">
                <img className="w-full h-full object-cover" src="https://lh3.googleusercontent.com/aida-public/AB6AXuAmEvRyVpEak2OMr6Yas7KLBr34fMklVOjH5scdMPAyNCsHXFSNo4LS8P_k1d9OcXgvlszn2n7xc74P9818McZQaqSZpEpzpB_2rBvs9p6mPM4Hl_iUSINRRULY0CQgQR2XS-rBXio9OS4EdentTXR4IrqGWc18apEGifhi6D3FHMBT_6MVlR8wcV_hjlEKdyJ0q6KQzdmWryZ-T6JKf91j-Oe2kO06BU6nQA8WivvQ3Uw34x9ixu4Dsjr-dEU8syCPl0Lcin3fMT1o" />
              </div>
              <div className="w-16 h-16 rounded border-2 border-dashed border-slate-300 flex items-center justify-center cursor-pointer hover:bg-slate-50 text-slate-400">
                <Plus className="w-5 h-5" />
              </div>
            </div>
          </section>

          {/* Classification */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Clasificación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Tipo de Producto</label>
                <select className="w-full rounded-lg border-slate-300 text-sm focus:ring-[#1a3b5b]">
                  <option>Seleccionar...</option>
                  <option selected>Arreglo Floral</option>
                  <option>Planta</option>
                  <option>Accesorio</option>
                  <option>Fúnebre</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Categorías</label>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                    Rosas <X className="w-3 h-3 cursor-pointer" />
                  </span>
                  <span className="bg-amber-50 text-amber-700 px-3 py-1 rounded-full text-xs font-bold border border-amber-100 flex items-center gap-1">
                    Premium <X className="w-3 h-3 cursor-pointer" />
                  </span>
                  <button type="button" className="px-3 py-1 rounded-full text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-50">+ Añadir</button>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-2 uppercase">Colecciones</label>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 flex items-center gap-1">
                    San Valentín <X className="w-3 h-3 cursor-pointer" />
                  </span>
                  <button type="button" className="px-3 py-1 rounded-full text-xs font-medium border border-slate-300 text-slate-600 hover:bg-slate-50">+ Añadir</button>
                </div>
              </div>
            </div>
          </section>

          {/* Status Card */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Estado de Visibilidad</h3>
            <div className="space-y-2">
              {[
                { id: 'published', label: 'Publicado', color: 'text-emerald-600' },
                { id: 'draft', label: 'Borrador', color: 'text-amber-600' },
                { id: 'archived', label: 'Archivado', color: 'text-slate-600' },
              ].map((status) => (
                <label key={status.id} className="flex items-center cursor-pointer group">
                  <input 
                    type="radio" 
                    name="status" 
                    className="text-[#1a3b5b] focus:ring-[#1a3b5b] w-4 h-4" 
                    defaultChecked={status.id === 'published'} 
                  />
                  <span className={`ml-2 text-sm font-medium text-slate-700 group-hover:${status.color} transition-colors`}>{status.label}</span>
                </label>
              ))}
            </div>
          </section>
        </div>
      </form>
    </div>
  );
}
