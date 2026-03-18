import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../hooks/useCart';
import { Trash2, ShoppingBag, ArrowLeft, ShieldCheck, Heart, Edit3 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CartPage() {
  const { cart, cartTotal, removeFromCart, updateQuantity } = useCart();
  const shippingCost = cart.length > 0 ? 150 : 0;
  const total = cartTotal + shippingCost;

  const recommendations = [
    {
      id: 'rec-1',
      name: 'Caja Chocolates Artisan',
      price: 280,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCIRTfjcbn-ndv4P-2-Qn70VAyzz-eSPnFNa8Mi-UuLVIA-GzvM9E6ROY3feS9ZqNxW-DLAxmommEl3tB3zD0C73PXJv39mzTvWgbiTN1FUox3XKWhbjH2ROp-lLZHk7z5KQlgulw1tRw5pxYSn9TV-ZlHewIXJSRHGGsKiWvbQcg99HcTgyjC503rnFT3a2UvfjTSDuzYP3iAW8EI2imNo-QYgjMG_QnpxbT0T0psvjfkzvBs_SNZexCzqxADIad44O2_xUtDTW2yK'
    },
    {
      id: 'rec-2',
      name: 'Set de Globos "Celebración"',
      price: 190,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAcJx7HjCh1QoBG9bbQWxgNKsa1kzZevUrHpQucMalU3JBgcBJCxYnzXsMbCblMCTEfxsRZ56NtEWVIbdCj5eVg1pNBOLQH2ueNo36yUkn8Sa9-uH0XOqUhHzvyRHm9VjkcWy8yNGcSs5CDWudHOAqZePrWZYox8gCw_QGMmQg9EMFUwXrTwniY_0AX0Bh0Dx7U0MUJsqKvCGthKo1kECjHLNy4lJmddjPtkabWzjqDa04LIXqPujZ9xUDocD8DmIuBImg05diW0zw6'
    },
    {
      id: 'rec-3',
      name: 'Orquídea Phalaenopsis',
      price: 850,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAUcofGuGfq35eIZs2frjjZWCDN7yNjc5SPlS4RMM__PN704SqcxYcmZydNVn2dU_mOOkHNAFQ9tqOTyu0CuZpZwK7-lZnrFELNd-1CCmVCQYD7nZtG5I7DA23BufwP8Hx3FKvRZAECU4VBh5ucJ_OOx6sfL3W_JffRZAzeplARwteCW2HQZEEtRNIsU4BD1v31vQqRpqpLOmyGStCbqr66pkHQoLod6YSK_nKsicDe8Mdt6x6hdINZZjvazvyLkBoZKjSFjcGEreHu'
    },
    {
      id: 'rec-4',
      name: 'Vino Tinto Reserva Selección',
      price: 540,
      image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBaYJUQ9qv0mFULykbk-yWdf0TAMnO33iqpfiLVhCWN6UjB5uchQIN17Yr_46ChSgpDLCf_E20vMpzuHd5ZCDmsdvTpZfMmGff5P6Ja-0lR0ENgxyR4jiuUdofefa2b8ScX9dK7HyMsqoiOuccMTcxsOBWB3z3-o643pS0Cb_WSnc_78iTJCYX08JAGZs0uL7mAPgEBbHdbdFvvOTQnGooMpdV3JvjWEQP2T7FtJmaBy-JFSDKuo9qHszsPyYxZAIbgruHhuQXBs0OO'
    }
  ];

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 pt-32 min-h-screen font-sans bg-[#f0f7ff] text-slate-800 antialiased">
      {/* Header Section */}
      <header className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-bold text-[#004A99] mb-2 font-serif">Tu Carrito</h1>
        <p className="text-[#4B5563] italic">Cada arreglo es una historia que estás a punto de enviar.</p>
      </header>

      {cart.length === 0 ? (
        <div className="text-center py-20">
          <ShoppingBag className="w-20 h-20 mx-auto text-slate-200 mb-6" />
          <h2 className="text-2xl font-bold mb-4">Tu carrito está vacío</h2>
          <p className="text-slate-500 mb-8">¡Explora nuestro catálogo y encuentra el detalle perfecto!</p>
          <Link 
            to="/catalogo" 
            className="inline-flex items-center gap-2 bg-[#004A99] text-white px-8 py-4 rounded-full font-semibold hover:bg-blue-800 transition-all shadow-lg"
          >
            <ArrowLeft className="w-5 h-5" />
            Ir al catálogo
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Product List Section */}
          <section className="lg:col-span-2 space-y-8">
            {cart.map((item) => (
              <article key={item.id} className="flex flex-col md:flex-row gap-6 p-6 border-b border-gray-100 items-start md:items-center group">
                <div className="w-full md:w-32 h-40 bg-gray-100 overflow-hidden rounded-lg">
                  <img 
                    alt={item.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                    src={item.image || 'https://picsum.photos/seed/flower/400/400'} 
                  />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex justify-between items-start">
                    <h3 className="text-2xl font-semibold font-serif">{item.name}</h3>
                    <button 
                      onClick={() => removeFromCart(item.id)}
                      aria-label="Eliminar producto" 
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="h-5 w-5" />
                    </button>
                  </div>
                  <p className="text-[#4B5563] text-sm">SKU: FB-{item.id.substring(0, 5).toUpperCase()} | Cantidad: {item.quantity}</p>
                  
                  {/* Emotional Element - Card Message */}
                  <div className="mt-4 p-4 bg-[#E6F0FF]/50 border border-[#E6F0FF] rounded-lg">
                    <div className="flex items-center gap-2 mb-2 text-[#004A99]">
                      <Edit3 className="h-4 w-4" />
                      <span className="font-semibold text-sm uppercase tracking-wider">Tu Mensaje Personalizado</span>
                    </div>
                    <p className="text-gray-700 italic text-sm leading-relaxed">"Para la persona que ilumina mis días. ¡Feliz Aniversario!"</p>
                    <button className="mt-2 text-xs font-medium text-[#004A99] underline hover:no-underline">Editar dedicatoria</button>
                  </div>
                </div>
                <div className="text-right flex flex-col items-end gap-4">
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors"
                    >-</button>
                    <span className="px-4 py-1 font-medium">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="px-3 py-1 hover:bg-gray-100 transition-colors"
                    >+</button>
                  </div>
                  <span className="text-xl font-bold text-slate-900">${(item.price * item.quantity).toLocaleString()} MXN</span>
                </div>
              </article>
            ))}
          </section>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-1">
            <div className="bg-[#F3F4F6] p-8 rounded-2xl sticky top-32">
              <h2 className="text-2xl font-bold text-[#004A99] mb-6 font-serif">Resumen del Pedido</h2>
              <div className="space-y-4 text-sm mb-8 border-b border-gray-200 pb-6">
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">Subtotal ({cart.length} productos)</span>
                  <span className="font-medium">${cartTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">Envío estimado</span>
                  <span className="font-medium">${shippingCost.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#4B5563]">Impuestos (IVA)</span>
                  <span className="font-medium">$0.00</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline mb-8">
                <span className="text-lg font-bold">Total</span>
                <span className="text-3xl font-bold text-[#004A99]">${total.toLocaleString()} MXN</span>
              </div>
              <div className="space-y-4">
                <Link 
                  to="/checkout/datos" 
                  className="w-full bg-[#004A99] text-white py-4 rounded-full font-semibold text-lg hover:bg-blue-800 transition-all shadow-lg hover:shadow-[#004A99]/20 text-center block"
                >
                  Continuar con pedido
                </Link>
                <Link 
                  to="/catalogo" 
                  className="w-full bg-white text-[#004A99] border-2 border-[#004A99] py-4 rounded-full font-semibold text-lg hover:bg-[#E6F0FF] transition-all text-center block"
                >
                  Seguir comprando
                </Link>
              </div>
              <div className="mt-8 flex items-center justify-center gap-4 text-xs text-[#4B5563] uppercase tracking-tighter">
                <div className="flex items-center gap-1">
                  <ShieldCheck className="h-4 w-4" />
                  <span>Pago Seguro</span>
                </div>
                <span>|</span>
                <div className="flex items-center gap-1">
                  <Heart className="h-4 w-4" />
                  <span>Garantía Florería Bautista</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* Recommendations Section */}
      <section className="mt-24 pt-12 border-t border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-center md:items-end mb-8 gap-4">
          <div>
            <h2 className="text-3xl font-bold font-serif">Recomendaciones para ti</h2>
            <p className="text-[#4B5563] italic">Complementa tu gesto con estos detalles especiales.</p>
          </div>
          <Link to="/catalogo" className="text-[#004A99] font-semibold border-b-2 border-[#004A99] pb-1">Ver catálogo completo</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {recommendations.map((product) => (
            <motion.div 
              key={product.id}
              whileHover={{ y: -10 }}
              className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all border border-slate-100 flex flex-col"
            >
              <div className="relative aspect-[4/5] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-center bg-cover transition-transform duration-500 group-hover:scale-110" 
                  style={{ backgroundImage: `url('${product.image}')` }}
                />
              </div>
              <div className="p-6 flex flex-col flex-1">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-xl font-bold text-[#004A99] group-hover:text-[#FF7F7D] transition-colors">{product.name}</h3>
                  <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Extra</span>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4">El complemento perfecto para tu regalo floral.</p>
                <div className="mt-auto">
                  <div className="text-xl font-bold text-slate-900 mb-4">${product.price.toLocaleString()} MXN</div>
                  <button className="w-full bg-[#FF7F7D] text-white py-2.5 rounded-xl font-bold hover:bg-opacity-90 transition-all shadow-sm">
                    Añadir al carrito
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
