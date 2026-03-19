import React, { useState, useRef } from 'react';
import { 
  ChevronRight, 
  Info, 
  Settings, 
  Check, 
  Camera, 
  Plus, 
  X,
  Save,
  Upload,
} from 'lucide-react';
import { DataService, Product } from '../services/dataService';
import { useToast } from '../hooks/useToast';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../services/cloudinaryService';

export default function ProductManagementPage() {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [product, setProduct] = useState<Partial<Product>>({
    name: '',
    description: '',
    price: 0,
    sku: '',
    category: 'Arreglo Floral',
    status: 'active',
    images: [], // Changed from image to images array
    stock: 0,
    stock_minimo: 5,
    createdAt: new Date().toISOString(),
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  // ... (inside handleImageUpload)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if ((imageFiles.length) >= 3) {
        showToast('Máximo 3 imágenes permitidas.', 'error');
        return;
      }
      const file = e.target.files[0];
      setImageFiles(prev => [...prev, file]);
      
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!product.name || !product.price) {
      showToast('Por favor completa los campos obligatorios.', 'error');
      return;
    }

    // Upload images to Cloudinary
    const imageUrls = await Promise.all(imageFiles.map(file => uploadToCloudinary(file)));
    
    const products = DataService.getProducts(true);
    const newProduct: Product = {
      ...product as Product,
      id: `PROD-${Date.now()}`,
      price: Number(product.price),
      stock: Number(product.stock),
      stock_minimo: Number(product.stock_minimo),
      images: imageUrls, // Store Cloudinary URLs
    };

    const success = await DataService.saveProducts([...products, newProduct]);
    if (success) {
      showToast('Producto guardado correctamente.', 'success');
      navigate('/admin/catalog');
    } else {
      showToast('No se pudo guardar el producto.', 'error');
    }
  };


  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
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
          <button onClick={() => navigate(-1)} className="px-6 py-2 border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-all">
            Cancelar
          </button>
          <button onClick={handleSave} className="px-6 py-2 bg-[#1a3b5b] text-white rounded-lg text-sm font-semibold shadow-sm hover:bg-opacity-90 transition-all flex items-center gap-2">
            <Save className="w-4 h-4" />
            Guardar Producto
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12">
        {/* Left Column: Form Fields */}
        <div className="lg:col-span-2 space-y-6">
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
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
                  name="name"
                  value={product.name}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 focus:border-[#1a3b5b] focus:ring-[#1a3b5b] border-2" 
                  placeholder="Ej. Ramo de Rosas Premium" 
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-1 after:content-['*'] after:text-red-500 after:ml-1">Descripción</label>
                <textarea 
                  name="description"
                  value={product.description}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 focus:border-[#1a3b5b] focus:ring-[#1a3b5b] border-2" 
                  placeholder="Describe las características principales..." 
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
                      name="price"
                      value={product.price}
                      onChange={handleInputChange}
                      className="w-full pl-8 rounded-lg border-slate-300 focus:border-[#1a3b5b] focus:ring-[#1a3b5b] border-2" 
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
                    name="sku"
                    value={product.sku}
                    onChange={handleInputChange}
                    className="w-full rounded-lg border-slate-300 focus:border-[#1a3b5b] focus:ring-[#1a3b5b] border-2" 
                    placeholder="FB-ROS-001" 
                  />
                </div>
              </div>
            </div>
          </section>
          {/* Personalization */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
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
                <div key={idx} className="p-4 border border-slate-200 rounded-xl bg-slate-50/50 shadow-sm flex flex-col">
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
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Imágenes (Máx 3)</h3>
            
            {/* Featured Image / Main Upload Area */}
            <div className="mb-4">
              {imagePreviews.length > 0 ? (
                <div className="relative w-full aspect-video rounded-lg overflow-hidden border-2 border-slate-200">
                  <img src={imagePreviews[0]} alt="Featured" className="w-full h-full object-cover" />
                  <button onClick={() => removeImage(0)} className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1.5 shadow-md">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full aspect-video rounded-lg border-2 border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 hover:border-[#1a3b5b] hover:text-[#1a3b5b] transition-colors"
                >
                  <Camera className="w-8 h-8 mb-2" />
                  <span className="text-sm font-medium">Subir imagen destacada</span>
                </button>
              )}
            </div>

            {/* Thumbnails */}
            <div className="grid grid-cols-3 gap-2">
              {[1, 2].map((idx) => (
                imagePreviews[idx] ? (
                  <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-slate-200">
                    <img src={imagePreviews[idx]} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
                    <button onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 shadow-sm">
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ) : (
                  <button 
                    key={idx}
                    onClick={() => fileInputRef.current?.click()}
                    disabled={imagePreviews.length < idx}
                    className={`w-full aspect-square rounded-lg border-2 border-dashed flex items-center justify-center ${imagePreviews.length >= idx ? 'border-slate-300 text-slate-400 hover:border-[#1a3b5b] hover:text-[#1a3b5b]' : 'border-slate-100 bg-slate-50 text-slate-300 cursor-not-allowed'}`}
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                )
              ))}
            </div>
            <input type="file" ref={fileInputRef} onChange={handleImageUpload} accept="image/*" className="hidden" />
          </section>

          {/* Classification */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <h3 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Clasificación</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1 uppercase">Tipo de Producto</label>
                <select 
                  name="category"
                  value={product.category}
                  onChange={handleInputChange}
                  className="w-full rounded-lg border-slate-300 text-sm focus:ring-[#1a3b5b] border-2"
                >
                  <option value="">Seleccionar...</option>
                  <option value="Arreglo Floral">Arreglo Floral</option>
                  <option value="Planta">Planta</option>
                  <option value="Accesorio">Accesorio</option>
                  <option value="Fúnebre">Fúnebre</option>
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
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
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
