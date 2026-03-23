import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ChevronRight, Info, Settings, Save, RefreshCw,
  Package, Tag, Layers, X, Plus, ImagePlus, Upload,
  FlaskConical, Star, Search, Trash2, Calculator,
} from 'lucide-react';
import { AdminService } from '../../services/adminService';
import { ProductBody, RecipeItem, Flower } from '../../types';
import { AnimatedButton } from '../../components/Animations';
import { useToast } from '../../hooks/useToast';

// ─── Cloudinary config ────────────────────────────────────────────────────────
const CLOUDINARY_CLOUD_NAME = 'tu-cloud-name';
const CLOUDINARY_UPLOAD_PRESET = 'floreria_unsigned';

const uploadToCloudinary = async (file: File): Promise<string> => {
  const form = new FormData();
  form.append('file', file);
  form.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: form,
  });
  if (!res.ok) throw new Error('Error al subir imagen a Cloudinary');
  const data = await res.json();
  return data.secure_url as string;
};

// ─── Constants ────────────────────────────────────────────────────────────────
const TIPOS = ['Arreglo Floral', 'Ramo', 'Flores de Corte', 'Planta', 'Insumos', 'Accesorios'];
const ESTADOS = [
  { value: 'ACTIVO', label: 'Activo' },
  { value: 'INACTIVO', label: 'Inactivo' },
  { value: 'BORRADOR', label: 'Borrador' },
];
const MAX_IMAGES = 3;
const FACTOR_MARGEN = 2.5; // Margen para precio sugerido: costoBase × FACTOR_MARGEN

const emptyForm = (): ProductBody => ({
  nombre: '',
  descripcion: '',
  precioBase: 0,
  tipo: 'Arreglo Floral',
  esPersonalizable: false,
  estado: 'ACTIVO',
  imagenUrl: '',
  imagenes: [],
  categorias: [],
  colecciones: [],
  receta: [],
});

// ─── Flower search combobox ───────────────────────────────────────────────────
function FlowerSearch({ onSelect }: { onSelect: (f: Flower) => void }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Flower[]>([]);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!query.trim()) { setResults([]); setOpen(false); return; }
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const res = await AdminService.getFlowers({ busqueda: query, estado: 'ACTIVO', size: 10 });
        setResults(res.data.items);
        setOpen(true);
      } catch { setResults([]); }
      finally { setLoading(false); }
    }, 350);
  }, [query]);

  const pick = (f: Flower) => {
    onSelect(f);
    setQuery('');
    setResults([]);
    setOpen(false);
  };

  return (
    <div className="relative">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Buscar flor o insumo..."
          className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all"
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onFocus={() => results.length > 0 && setOpen(true)}
        />
        {loading && <RefreshCw className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 animate-spin" />}
      </div>
      {open && results.length > 0 && (
        <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden">
          {results.map(f => (
            <button
              key={f.id}
              type="button"
              onMouseDown={() => pick(f)}
              className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-slate-50 transition-colors text-left"
            >
              <div>
                <p className="text-sm font-bold text-slate-800">{f.nombre}</p>
                <p className="text-[10px] text-slate-400">{f.tipo}{f.color ? ` · ${f.color}` : ''}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-xs font-black text-slate-700">${f.precioCosto.toFixed(2)}</p>
                {f.esFlorPrimaria && (
                  <span className="text-[10px] text-amber-600 font-bold flex items-center gap-0.5 justify-end">
                    <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />Primaria
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function ProductManagementPage() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id);
  const { showToast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<ProductBody>(emptyForm());
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [catInput, setCatInput] = useState('');
  const [colInput, setColInput] = useState('');

  const [imageFiles, setImageFiles] = useState<{ file: File; preview: string }[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // ── Cálculos de receta ─────────────────────────────────────────────────────
  const receta = form.receta ?? [];
  const costoBaseFloresPrimarias = receta
    .filter(r => r.esFlorPrimaria)
    .reduce((sum, r) => sum + r.cantidad * r.flowerPrecioCosto, 0);
  const precioSugerido = costoBaseFloresPrimarias * FACTOR_MARGEN;

  // Preload precio sugerido when recipe changes and user hasn't manually set it
  const [precioManual, setPrecioManual] = useState(false);

  useEffect(() => {
    if (!precioManual && costoBaseFloresPrimarias > 0) {
      setForm(prev => ({ ...prev, precioBase: parseFloat(precioSugerido.toFixed(2)) }));
    }
  }, [precioSugerido, precioManual]);

  // ── Load product for edit ──────────────────────────────────────────────────
  useEffect(() => {
    if (!isEdit || !id) return;
    (async () => {
      try {
        const res = await AdminService.getAdminProductById(id);
        const p = res.data;
        setForm({
          nombre: p.nombre,
          descripcion: p.descripcion ?? '',
          precioBase: p.precioBase,
          tipo: p.tipo,
          esPersonalizable: p.esPersonalizable ?? false,
          estado: p.estado,
          imagenUrl: p.imagenUrl ?? '',
          imagenes: [],
          categorias: p.categorias ?? [],
          colecciones: p.colecciones ?? [],
          receta: p.receta ?? [],
        });
        if (p.imagenUrl) setImageUrls([p.imagenUrl]);
        setPrecioManual(true); // don't overwrite loaded price
      } catch {
        showToast('No se pudo cargar el producto', 'error');
      } finally {
        setLoading(false);
      }
    })();
  }, [id]);

  useEffect(() => {
    return () => { imageFiles.forEach(f => URL.revokeObjectURL(f.preview)); };
  }, [imageFiles]);

  const set = (field: keyof ProductBody, value: any) =>
    setForm(prev => ({ ...prev, [field]: value }));

  const addTag = (field: 'categorias' | 'colecciones', value: string, clear: () => void) => {
    const trimmed = value.trim();
    if (!trimmed) return;
    if (!(form[field] as string[]).includes(trimmed)) set(field, [...(form[field] as string[]), trimmed]);
    clear();
  };

  const removeTag = (field: 'categorias' | 'colecciones', tag: string) =>
    set(field, (form[field] as string[]).filter(t => t !== tag));

  // ── Recipe handlers ────────────────────────────────────────────────────────
  const addToRecipe = (flower: Flower) => {
    const exists = receta.find(r => r.flowerId === flower.id);
    if (exists) { showToast('Este insumo ya está en la receta', 'error'); return; }
    const item: RecipeItem = {
      flowerId: flower.id,
      flowerNombre: flower.nombre,
      flowerPrecioCosto: flower.precioCosto,
      esFlorPrimaria: flower.esFlorPrimaria,
      cantidad: 1,
    };
    set('receta', [...receta, item]);
  };

  const updateRecipeCantidad = (flowerId: string, cantidad: number) => {
    set('receta', receta.map(r => r.flowerId === flowerId ? { ...r, cantidad } : r));
  };

  const removeFromRecipe = (flowerId: string) => {
    set('receta', receta.filter(r => r.flowerId !== flowerId));
  };

  // ── Image handlers ─────────────────────────────────────────────────────────
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const totalSlots = imageFiles.length + imageUrls.length;
    const available = MAX_IMAGES - totalSlots;
    if (available <= 0) { showToast(`Máximo ${MAX_IMAGES} imágenes`, 'error'); return; }
    const selected = files.slice(0, available);
    if (files.length > available) showToast(`Solo se agregaron ${available} imagen(es)`, 'error');
    setImageFiles(prev => [...prev, ...selected.map(file => ({ file, preview: URL.createObjectURL(file) }))]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeNewImage = (index: number) => {
    setImageFiles(prev => { URL.revokeObjectURL(prev[index].preview); return prev.filter((_, i) => i !== index); });
  };

  const removeExistingUrl = (index: number) => {
    setImageUrls(prev => prev.filter((_, i) => i !== index));
  };

  // ── Save ───────────────────────────────────────────────────────────────────
  const handleSave = async () => {
    if (!form.nombre.trim()) { showToast('El nombre es obligatorio.', 'error'); return; }
    if (form.precioBase <= 0) { showToast('El precio debe ser mayor a 0.', 'error'); return; }
    setSaving(true);
    let uploadedUrls: string[] = [];
    if (imageFiles.length > 0) {
      setUploading(true);
      try {
        uploadedUrls = await Promise.all(imageFiles.map(f => uploadToCloudinary(f.file)));
      } catch (err: any) {
        showToast(err.message || 'Error al subir imágenes', 'error');
        setSaving(false); setUploading(false); return;
      } finally { setUploading(false); }
    }
    const allUrls = [...imageUrls, ...uploadedUrls];
    const body: ProductBody = { ...form, imagenUrl: allUrls[0] ?? '', imagenes: allUrls };
    try {
      if (isEdit && id) {
        await AdminService.updateAdminProduct(id, body);
        showToast('Producto actualizado', 'success');
      } else {
        await AdminService.createAdminProduct(body);
        showToast('Producto creado', 'success');
      }
      navigate('/catalogo');
    } catch {
      showToast('Error al guardar', 'error');
    } finally { setSaving(false); }
  };

  const inp = "w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all";
  const lbl = "text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1 block";
  const sec = "bg-white border border-slate-100 rounded-xl p-4 shadow-sm";
  const secTitle = "text-[10px] font-black uppercase tracking-widest text-slate-500 mb-3 flex items-center gap-2";

  const totalImages = imageFiles.length + imageUrls.length;
  const canAddMore = totalImages < MAX_IMAGES;

  if (loading) return (
    <div className="flex items-center justify-center h-full">
      <RefreshCw className="w-6 h-6 text-blue-500 animate-spin" />
    </div>
  );

  return (
    <div className="flex flex-col h-full overflow-hidden">

      {/* ── Header fijo ── */}
      <div className="flex-none flex items-center justify-between py-3 px-1 border-b border-slate-100 mb-4">
        <div>
          <nav className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1">
            <span className="hover:text-blue-600 cursor-pointer transition-colors" onClick={() => navigate('/catalogo')}>Catálogo</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-slate-700">{isEdit ? 'Editar Producto' : 'Nuevo Producto'}</span>
          </nav>
          <h1 className="text-xl font-black tracking-tight text-slate-900">
            {isEdit ? 'Editar Producto' : 'Nuevo Producto'}
            {isEdit && <span className="ml-2 text-xs font-mono text-slate-400 font-normal">{id?.slice(0, 8).toUpperCase()}</span>}
          </h1>
        </div>
        <div className="flex items-center gap-2">
          <AnimatedButton onClick={() => navigate('/catalogo')} className="px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-black text-slate-600 hover:bg-slate-50 transition-all">
            Cancelar
          </AnimatedButton>
          <AnimatedButton onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-black hover:bg-blue-700 shadow-lg shadow-blue-600/20 transition-all disabled:opacity-60">
            {saving
              ? uploading
                ? <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Subiendo imágenes...</>
                : <><RefreshCw className="w-3.5 h-3.5 animate-spin" />Guardando...</>
              : <><Save className="w-3.5 h-3.5" />{isEdit ? 'Guardar Cambios' : 'Crear Producto'}</>
            }
          </AnimatedButton>
        </div>
      </div>

      {/* ── Contenido scrollable ── */}
      <div className="flex-1 overflow-y-auto pr-1">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

          {/* Columna principal */}
          <div className="lg:col-span-2 space-y-4">

            {/* Información básica */}
            <div className={sec}>
              <p className={secTitle}><Info className="w-3.5 h-3.5 text-blue-500" /> Información Básica</p>
              <div className="space-y-3">
                <div>
                  <label className={lbl}>Nombre <span className="text-red-500">*</span></label>
                  <input type="text" value={form.nombre} onChange={e => set('nombre', e.target.value)} placeholder="Ej. Ramo de Rosas Premium" className={inp} />
                </div>
                <div>
                  <label className={lbl}>Descripción</label>
                  <textarea value={form.descripcion} onChange={e => set('descripcion', e.target.value)} placeholder="Describe el producto..." className={`${inp} resize-none h-16`} />
                </div>
                <div>
                  <label className={lbl}>Precio Base de Venta (MXN) <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-sm">$</span>
                    <input
                      type="number"
                      value={form.precioBase}
                      onChange={e => { setPrecioManual(true); set('precioBase', Number(e.target.value)); }}
                      className={`${inp} pl-7`}
                      placeholder="0.00" min={0} step={0.01}
                    />
                  </div>
                  {costoBaseFloresPrimarias > 0 && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      Precio sugerido: <strong className="text-blue-600">${precioSugerido.toFixed(2)}</strong> (factor ×{FACTOR_MARGEN}) —{' '}
                      <button type="button" onClick={() => { set('precioBase', parseFloat(precioSugerido.toFixed(2))); setPrecioManual(false); }} className="text-blue-500 underline hover:text-blue-700">usar sugerido</button>
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Receta del arreglo */}
            <div className={sec}>
              <p className={secTitle}><FlaskConical className="w-3.5 h-3.5 text-indigo-500" /> Receta del Arreglo (Insumos)</p>

              {/* Flower search */}
              <div className="mb-3">
                <label className={lbl}>Agregar insumo</label>
                <FlowerSearch onSelect={addToRecipe} />
              </div>

              {/* Recipe rows */}
              {receta.length > 0 ? (
                <>
                  <div className="overflow-x-auto rounded-lg border border-slate-100">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="bg-slate-50 border-b border-slate-100">
                          <th className="px-3 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-left">Insumo</th>
                          <th className="px-3 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-left">Tipo</th>
                          <th className="px-3 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-center w-24">Cantidad</th>
                          <th className="px-3 py-2.5 text-[10px] font-black text-slate-400 uppercase tracking-wider text-right">Subtotal</th>
                          <th className="px-3 py-2.5 w-8" />
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-50">
                        {receta.map(item => (
                          <tr key={item.flowerId} className="hover:bg-slate-50/50 transition-colors">
                            <td className="px-3 py-2.5">
                              <div>
                                <div className="flex items-center gap-1.5">
                                  <p className="font-bold text-slate-800">{item.flowerNombre}</p>
                                  {item.esFlorPrimaria && (
                                    <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 bg-amber-50 text-amber-600 border border-amber-100 rounded-full text-[9px] font-black">
                                      <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />Primaria
                                    </span>
                                  )}
                                </div>
                                <p className="text-[10px] text-slate-400">${item.flowerPrecioCosto.toFixed(2)} / unidad</p>
                              </div>
                            </td>
                            <td className="px-3 py-2.5">
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.esFlorPrimaria ? 'bg-amber-50 text-amber-700' : 'bg-slate-100 text-slate-500'}`}>
                                {item.esFlorPrimaria ? 'Flor primaria' : 'Complemento'}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <input
                                type="number"
                                value={item.cantidad}
                                onChange={e => updateRecipeCantidad(item.flowerId, Number(e.target.value))}
                                min={1}
                                step={1}
                                className="w-20 px-2 py-1.5 text-center text-sm font-bold bg-white border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none"
                              />
                            </td>
                            <td className="px-3 py-2.5 text-right">
                              <span className={`text-sm font-black ${item.esFlorPrimaria ? 'text-indigo-600' : 'text-slate-500'}`}>
                                ${(item.cantidad * item.flowerPrecioCosto).toFixed(2)}
                              </span>
                            </td>
                            <td className="px-3 py-2.5">
                              <button type="button" onClick={() => removeFromRecipe(item.flowerId)} className="p-1.5 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Cost summary */}
                  <div className="mt-3 p-3 bg-indigo-50 border border-indigo-100 rounded-xl space-y-1.5">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="w-3.5 h-3.5 text-indigo-500" />
                      <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600">Cálculo de costo</span>
                    </div>
                    <div className="flex justify-between text-xs">
                      <span className="text-slate-500">Costo total (todos los insumos)</span>
                      <span className="font-bold text-slate-700">
                        ${receta.reduce((s, r) => s + r.cantidad * r.flowerPrecioCosto, 0).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between text-xs border-t border-indigo-100 pt-1.5">
                      <span className="text-indigo-700 font-bold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                        Costo base (solo flores primarias)
                      </span>
                      <span className="font-black text-indigo-700">${costoBaseFloresPrimarias.toFixed(2)}</span>
                    </div>
                    {costoBaseFloresPrimarias > 0 && (
                      <div className="flex justify-between text-xs border-t border-indigo-100 pt-1.5">
                        <span className="text-slate-500">Precio sugerido (×{FACTOR_MARGEN})</span>
                        <span className="font-black text-blue-600">${precioSugerido.toFixed(2)}</span>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-slate-300 border border-dashed border-slate-200 rounded-xl">
                  <FlaskConical className="w-8 h-8 mb-2" />
                  <p className="text-xs font-semibold text-slate-400">Sin insumos en la receta</p>
                  <p className="text-[10px] text-slate-300 mt-1">Busca y agrega flores o insumos usando el campo de arriba</p>
                </div>
              )}
            </div>

            {/* Imágenes */}
            <div className={sec}>
              <p className={secTitle}><ImagePlus className="w-3.5 h-3.5 text-pink-500" /> Imágenes del Producto</p>
              <p className="text-[10px] text-slate-400 mb-3">Máximo {MAX_IMAGES} imágenes. Se subirán a Cloudinary al guardar.</p>
              <div className="flex flex-wrap gap-3 mb-3">
                {imageUrls.map((url, i) => (
                  <div key={`url-${i}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-slate-200 group">
                    <img src={url} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" onError={e => { (e.target as HTMLImageElement).src = ''; }} />
                    <button type="button" onClick={() => removeExistingUrl(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 py-0.5 px-1"><span className="text-[9px] text-white font-bold">Guardada</span></div>
                  </div>
                ))}
                {imageFiles.map((f, i) => (
                  <div key={`file-${i}`} className="relative w-24 h-24 rounded-xl overflow-hidden border border-blue-200 group">
                    <img src={f.preview} alt="" className="w-full h-full object-cover" />
                    <button type="button" onClick={() => removeNewImage(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"><X className="w-3 h-3" /></button>
                    <div className="absolute bottom-0 inset-x-0 bg-black/40 py-0.5 px-1"><span className="text-[9px] text-white font-bold">Nueva</span></div>
                  </div>
                ))}
                {canAddMore && (
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="w-24 h-24 rounded-xl border-2 border-dashed border-slate-200 hover:border-blue-400 hover:bg-blue-50 flex flex-col items-center justify-center gap-1.5 text-slate-400 hover:text-blue-500 transition-all">
                    <Upload className="w-5 h-5" />
                    <span className="text-[10px] font-bold">Añadir</span>
                  </button>
                )}
              </div>
              <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={handleFileSelect} />
              {totalImages > 0 && (
                <p className="text-[10px] text-slate-400">{totalImages} / {MAX_IMAGES} imagen{totalImages !== 1 ? 'es' : ''}{imageFiles.length > 0 && ` — ${imageFiles.length} pendiente${imageFiles.length !== 1 ? 's' : ''} de subir`}</p>
              )}
            </div>

            {/* Categorías y colecciones */}
            <div className={sec}>
              <p className={secTitle}><Tag className="w-3.5 h-3.5 text-amber-500" /> Categorías y Colecciones</p>
              <div className="space-y-3">
                <div>
                  <label className={lbl}>Categorías</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.categorias.map(cat => (
                      <span key={cat} className="flex items-center gap-1 px-2.5 py-1 bg-amber-50 text-amber-700 border border-amber-100 rounded-full text-xs font-bold">
                        {cat}<button type="button" onClick={() => removeTag('categorias', cat)}><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={catInput} onChange={e => setCatInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('categorias', catInput, () => setCatInput('')))} placeholder="Nueva categoría + Enter" className={`${inp} flex-1`} />
                    <button type="button" onClick={() => addTag('categorias', catInput, () => setCatInput(''))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
                <div>
                  <label className={lbl}>Colecciones</label>
                  <div className="flex flex-wrap gap-1.5 mb-2">
                    {form.colecciones.map(col => (
                      <span key={col} className="flex items-center gap-1 px-2.5 py-1 bg-blue-50 text-blue-700 border border-blue-100 rounded-full text-xs font-bold">
                        {col}<button type="button" onClick={() => removeTag('colecciones', col)}><X className="w-2.5 h-2.5" /></button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input type="text" value={colInput} onChange={e => setColInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag('colecciones', colInput, () => setColInput('')))} placeholder="Nueva colección + Enter" className={`${inp} flex-1`} />
                    <button type="button" onClick={() => addTag('colecciones', colInput, () => setColInput(''))} className="px-3 py-2 bg-slate-100 hover:bg-slate-200 rounded-lg text-slate-600 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Clasificación */}
            <div className={sec}>
              <p className={secTitle}><Layers className="w-3.5 h-3.5 text-purple-500" /> Clasificación</p>
              <div className="space-y-3">
                <div>
                  <label className={lbl}>Tipo</label>
                  <select value={form.tipo} onChange={e => set('tipo', e.target.value)} className={inp}>
                    {TIPOS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className={lbl}>Estado</label>
                  <select value={form.estado} onChange={e => set('estado', e.target.value)} className={inp}>
                    {ESTADOS.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
              </div>
            </div>

            {/* Personalizable */}
            <div className={sec}>
              <p className={secTitle}><Settings className="w-3.5 h-3.5 text-emerald-500" /> Personalización</p>
              <div className="flex items-center gap-3">
                <div onClick={() => set('esPersonalizable', !form.esPersonalizable)} className="cursor-pointer">
                  <div className={`relative w-10 h-5 rounded-full transition-colors ${form.esPersonalizable ? 'bg-blue-600' : 'bg-slate-200'}`}>
                    <span className={`absolute top-0.5 left-0.5 size-4 bg-white rounded-full shadow transition-transform ${form.esPersonalizable ? 'translate-x-5' : ''}`} />
                  </div>
                </div>
                <span className="text-sm font-bold text-slate-700">{form.esPersonalizable ? 'Habilitado' : 'Deshabilitado'}</span>
              </div>
              <p className="text-xs text-slate-400 mt-2">Permite personalizar colores, tamaño y mensaje.</p>
            </div>

            {/* Resumen */}
            <div className="bg-slate-50 border border-slate-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-3">
                <Package className="w-3.5 h-3.5 text-slate-400" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Resumen</p>
              </div>
              <div className="space-y-1.5 text-sm">
                {[
                  { label: 'Nombre', value: form.nombre || '—' },
                  { label: 'Precio', value: `$${form.precioBase.toLocaleString()}` },
                  { label: 'Tipo', value: form.tipo },
                  { label: 'Estado', value: ESTADOS.find(s => s.value === form.estado)?.label ?? form.estado },
                  { label: 'Imágenes', value: `${totalImages} / ${MAX_IMAGES}` },
                  { label: 'Insumos', value: String(receta.length) },
                  { label: 'Costo base', value: receta.length > 0 ? `$${costoBaseFloresPrimarias.toFixed(2)}` : '—' },
                  { label: 'Categorías', value: String(form.categorias.length) },
                ].map(row => (
                  <div key={row.label} className="flex justify-between">
                    <span className="text-slate-400">{row.label}</span>
                    <span className={`font-bold truncate max-w-[120px] ${row.label === 'Estado' && form.estado === 'ACTIVO' ? 'text-emerald-600' : row.label === 'Costo base' ? 'text-indigo-600' : 'text-slate-700'}`}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
