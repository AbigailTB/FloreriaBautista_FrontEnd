import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { ChevronRight, ChevronLeft, Star, Check, Lock } from 'lucide-react';
import productsData from '../data/products.json';

export default function ProductPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [selectedSize, setSelectedSize] = useState('premium');
  
  // Find the current product based on ID, fallback to first product if not found
  const product = productsData.find(p => p.id === id) || productsData[0];
  
  const [mainImage, setMainImage] = useState(product.image || 'https://picsum.photos/seed/placeholder/400/400');

  // Update main image when product changes
  useEffect(() => {
    setMainImage(product.image || 'https://picsum.photos/seed/placeholder/400/400');
  }, [product]);

  const galleryImages = [
    product.image || 'https://picsum.photos/seed/placeholder/400/400',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCDYGKfVHfTS3ldHHOrQnerNTC1omLHOym-AQ9qBk1iYhdfo_rj8rD6r2a_b1P2WX2BrbDb9cpxaUcUldro0ebeEWkEGQzk6rNVPD7eTCFpEjsep4pilL8RPwQox-6ODBj4hhpD_NHdm7d5HIwwAojC4uC7k6N1JKrCmrrvr53Fca3M8K4lqu1yXLJzcoOkcUOc0oxxIwTeZwGvytSylJEjViohb5_UdKxM5bnKzGGvdqKqrQ6_islcvI_RseoDvsxVnJc1gPN39Zqd',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuCkOQ5wDy_7FX998xfnEI-pTh5U3fC78RZSuLpzycZ6FxzzLEKNNkf-gXt5zl26kzF2oxWS5B0cr9jh7CEmmHR6Ngwq10ovIPgJb-lRaRMYnk2CnKWzkpCNe1SH4s2yTLofEH3lduYRmYTKuDDIpAgtkfXnAIdWTsN7CTJXRVypzbSFNXgl57rifciA9cgkASiK1ShiQ9KjpZx2xjJUiorxG36Hv_3ZPkkMSJjST5UkMFX6fnwmICvlRBxyTdr5UV0-nt2tTqiubTla',
    'https://lh3.googleusercontent.com/aida-public/AB6AXuBMaIvEFeqS4JnxnWCtmKGxyI8CnAszto86dLu5otmdvRd45u3dePs0jCAh3CZZHOojfhPeFSiC1sEoNR3NTOt-KU88qd2n_uRGNwcov35mSr6m5CqHIqRtYKA19HILIksYdyveX07JQbCdXjhqryydvbKqfDXxqYEg3S9JN3BASQN3fxnhluN75RALi2d6oQPS8i6rNbX_0yDpyx2QnZ35I8kxU1lAsHHAXr8k7ubYg25zFid1FTsNR3dUJ-Ejo7Fd678bKT9BPMKR'
  ];

  // Filter out current product and get up to 4 related products
  const relatedProducts = productsData
    .filter(p => p.id !== product.id && !p.isInventoryOnly)
    .slice(0, 4);

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-32 min-h-screen">
      {/* Back Button */}
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-500 hover:text-brand-coral transition-colors mb-6 font-medium"
      >
        <ChevronLeft className="w-4 h-4" />
        Volver
      </button>

      {/* Breadcrumbs */}
      <nav aria-label="Breadcrumb" className="flex items-center text-sm text-slate-500 mb-8">
        <Link to="/" className="hover:underline">Inicio</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <Link to="/catalogo" className="hover:underline">Catálogo</Link>
        <ChevronRight className="w-4 h-4 mx-2" />
        <span className="font-semibold text-brand-deep">{product.name}</span>
      </nav>

      {/* Product Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Left Column: Images */}
        <div>
          <div className="relative rounded-2xl overflow-hidden mb-4 aspect-square bg-gray-100">
            {(product as any).badge && (
              <span className={`absolute top-4 left-4 ${(product as any).badgeBg} ${(product as any).badgeColor} text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider z-10`}>
                {(product as any).badge}
              </span>
            )}
            <img 
              alt={product.name} 
              className="w-full h-full object-cover" 
              src={mainImage} 
            />
          </div>
          <div className="grid grid-cols-4 gap-4">
            {galleryImages.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setMainImage(img)}
                className={`rounded-xl overflow-hidden aspect-square border-2 transition-colors ${mainImage === img ? 'border-[#D4AF37]' : 'border-transparent hover:border-gray-300'}`}
              >
                <img className="w-full h-full object-cover" src={img} alt={`Gallery ${idx}`} />
              </button>
            ))}
          </div>
        </div>

        {/* Right Column: Details & Options */}
        <div className="flex flex-col">
          <h1 className="font-serif text-4xl font-bold text-brand-deep mb-2">{product.name}</h1>
          <div className="flex items-center gap-2 mb-4">
            <div className="flex text-[#D4AF37]">
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
              <Star className="w-4 h-4 fill-current" />
            </div>
            <span className="text-sm text-slate-500">(48 Reseñas)</span>
          </div>
          <p className="text-slate-600 mb-6 leading-relaxed">
            {(product as any).description || 'Un hermoso arreglo floral diseñado con las flores más frescas y seleccionadas para transmitir tus mejores sentimientos.'}
          </p>
          <div className="text-3xl font-bold text-brand-deep mb-6">${product.price} MXN</div>

          {/* Customization Form */}
          <div className="space-y-6">
            {/* Size Selector */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-3 tracking-widest">Selecciona el tamaño</label>
              <div className="grid grid-cols-3 gap-3">
                <button 
                  onClick={() => setSelectedSize('estandar')}
                  className={`p-3 rounded-lg text-center transition-all border-2 ${selectedSize === 'estandar' ? 'border-brand-coral bg-brand-coral/5' : 'border-gray-200 hover:border-brand-coral/50'}`}
                >
                  <div className={`text-xs font-bold ${selectedSize === 'estandar' ? 'text-brand-coral' : 'text-slate-500'}`}>Estándar</div>
                  <div className="font-bold text-brand-deep">${product.price}</div>
                </button>
                <button 
                  onClick={() => setSelectedSize('deluxe')}
                  className={`p-3 rounded-lg text-center transition-all border-2 ${selectedSize === 'deluxe' ? 'border-brand-coral bg-brand-coral/5' : 'border-gray-200 hover:border-brand-coral/50'}`}
                >
                  <div className={`text-xs font-bold ${selectedSize === 'deluxe' ? 'text-brand-coral' : 'text-slate-500'}`}>Deluxe</div>
                  <div className="font-bold text-brand-deep">${product.price + 200}</div>
                </button>
                <button 
                  onClick={() => setSelectedSize('premium')}
                  className={`p-3 rounded-lg text-center transition-all border-2 ${selectedSize === 'premium' ? 'border-brand-coral bg-brand-coral/5' : 'border-gray-200 hover:border-brand-coral/50'}`}
                >
                  <div className={`text-xs font-bold ${selectedSize === 'premium' ? 'text-brand-coral' : 'text-slate-500'}`}>Premium</div>
                  <div className="font-bold text-brand-deep">${product.price + 350}</div>
                </button>
              </div>
            </div>

            {/* Extras */}
            <div className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="w-5 h-5 rounded border-gray-300 text-brand-coral focus:ring-brand-coral" type="checkbox" />
                <span className="text-sm text-slate-700 group-hover:text-brand-deep">Incluir tarjeta de regalo (Gratis)</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer group">
                <input className="w-5 h-5 rounded border-gray-300 text-brand-coral focus:ring-brand-coral" type="checkbox" />
                <span className="text-sm text-slate-700 group-hover:text-brand-deep">Envío anónimo</span>
              </label>
            </div>

            {/* Delivery Date */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-widest">Fecha de entrega</label>
              <input className="w-full border-gray-300 rounded-lg focus:ring-brand-deep focus:border-brand-deep px-4 py-2 border" type="date" />
            </div>

            {/* Message */}
            <div>
              <label className="block text-xs font-bold uppercase text-slate-500 mb-2 tracking-widest">Mensaje personalizado (Dedicatoria)</label>
              <textarea className="w-full border-gray-300 rounded-lg focus:ring-brand-deep focus:border-brand-deep resize-none px-4 py-2 border" placeholder="Escribe aquí tu mensaje..." rows={3}></textarea>
            </div>

            {/* Action Button */}
            <button 
              className="w-full bg-brand-deep text-white py-4 rounded-xl font-bold text-lg hover:shadow-lg transform active:scale-[0.98] transition"
              onClick={() => setIsLoginModalOpen(true)}
            >
              Iniciar pedido
            </button>
          </div>
        </div>
      </div>

      {/* Detailed Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12 py-16 border-t border-gray-100">
        {/* Specifications */}
        <section>
          <h3 className="font-serif text-xl font-bold text-brand-deep mb-6 flex items-center gap-2">
            <Check className="w-5 h-5 text-brand-coral" />
            Especificaciones
          </h3>
          <ul className="space-y-4 text-sm">
            <li className="flex justify-between pb-2 border-b border-gray-50"><span className="text-slate-500">Altura:</span> <span className="font-medium">60 cm aproximadamente</span></li>
            <li className="flex justify-between pb-2 border-b border-gray-50"><span className="text-slate-500">Contenido:</span> <span className="font-medium">24 Rosas Premium</span></li>
            <li className="flex justify-between pb-2 border-b border-gray-50"><span className="text-slate-500">Follaje:</span> <span className="font-medium">Eucalipto y Ruscus</span></li>
            <li className="flex justify-between pb-2 border-b border-gray-50"><span className="text-slate-500">Extras:</span> <span className="font-medium">Moño y Alimento floral</span></li>
          </ul>
        </section>

        {/* Reviews */}
        <section>
          <h3 className="font-serif text-xl font-bold text-brand-deep mb-6 flex items-center gap-2">
            <Star className="w-5 h-5 text-brand-coral" />
            Reseñas de clientes
          </h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-sm">María G.</span>
                <span className="text-[#D4AF37] text-xs">★★★★★</span>
              </div>
              <p className="text-xs text-slate-600 italic">"Las rosas más hermosas que he recibido. El aroma es increíble y duraron más de una semana frescas."</p>
            </div>
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-sm">Ricardo S.</span>
                <span className="text-[#D4AF37] text-xs">★★★★★</span>
              </div>
              <p className="text-xs text-slate-600 italic">"Excelente servicio, llegaron puntual y el mensaje personalizado quedó perfecto. Altamente recomendados."</p>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h3 className="font-serif text-xl font-bold text-brand-deep mb-6 flex items-center gap-2">
            <svg className="w-5 h-5 text-brand-coral" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            Preguntas Frecuentes
          </h3>
          <div className="space-y-3">
            <details className="group bg-brand-light rounded-lg p-3 cursor-pointer">
              <summary className="list-none flex justify-between items-center text-sm font-medium">
                ¿Cómo cuido mi ramo?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-xs text-slate-500 mt-2">Corta los tallos 2cm en diagonal y cambia el agua cada 2 días.</p>
            </details>
            <details className="group bg-brand-light rounded-lg p-3 cursor-pointer">
              <summary className="list-none flex justify-between items-center text-sm font-medium">
                ¿A qué zonas envían?
                <span className="group-open:rotate-180 transition">▼</span>
              </summary>
              <p className="text-xs text-slate-500 mt-2">Realizamos entregas en toda la región Huitzitzilingo-Orizatlán.</p>
            </details>
          </div>
        </section>
      </div>

      {/* Related Products */}
      <section className="py-16 border-t border-gray-100">
        <h2 className="font-serif text-2xl font-bold text-brand-deep mb-8">También te podría gustar</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((product) => (
            <div key={product.id} className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col">
              <div className="relative aspect-[4/5] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110" 
                  style={{ backgroundImage: `url('${product.image}')` }}
                />
                {(product as any).badge && (
                  <div className={`absolute top-4 right-4 ${(product as any).badgeBg} px-3 py-1 rounded-full text-xs font-bold ${(product as any).badgeColor} uppercase tracking-wider`}>
                    {(product as any).badge}
                  </div>
                )}
              </div>
              <div className="p-6 flex flex-col flex-1">
                <h3 className="text-xl font-bold text-brand-deep mb-2 group-hover:text-brand-coral transition-colors">{product.name}</h3>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">{(product as any).description || 'Un hermoso arreglo floral diseñado con las flores más frescas.'}</p>
                <div className="mt-auto">
                  <div className="text-xl font-bold text-slate-900 mb-4">Desde ${product.price} MXN</div>
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2">
                      <Link to={`/producto/${product.id}`} className="flex-1 bg-brand-deep text-white py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all text-center">Ver detalles</Link>
                      <button className="w-12 h-11 flex items-center justify-center bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all">
                        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                        </svg>
                      </button>
                    </div>
                    <button 
                      className="w-full bg-brand-coral text-white py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-sm"
                      onClick={() => setIsLoginModalOpen(true)}
                    >
                      Añadir al pedido
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsLoginModalOpen(false)}
          ></div>
          <div className="relative bg-white p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-brand-deep" />
            </div>
            <h3 className="text-2xl font-bold text-brand-deep mb-2">¡Inicia sesión para continuar!</h3>
            <p className="text-slate-500 mb-8">Para continuar con tu pedido, por favor inicia sesión o crea una cuenta.</p>
            <div className="flex flex-col gap-3">
              <button className="w-full bg-brand-deep text-white py-3.5 rounded-2xl font-bold hover:shadow-lg transition-all">Iniciar sesión</button>
              <button className="w-full border-2 border-brand-deep text-brand-deep py-3.5 rounded-2xl font-bold hover:bg-slate-50 transition-all">Registrarme</button>
            </div>
            <button 
              className="mt-6 text-slate-400 hover:text-slate-600 text-sm font-medium transition-colors"
              onClick={() => setIsLoginModalOpen(false)}
            >
              Tal vez luego
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
