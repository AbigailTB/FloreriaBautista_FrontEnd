import React from 'react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ChevronRight, 
  Edit3, 
  Zap, 
  Mail, 
  Info, 
  Lock, 
  ShoppingBag,
  Clock
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export default function CheckoutReviewPage() {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();

  const shippingCost = 120.00;
  const total = cartTotal + shippingCost;

  return (
    <main className="max-w-7xl mx-auto px-6 lg:px-20 py-10 lg:py-20 pt-32 min-h-screen font-display bg-[#f0f7ff]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 mb-8 text-sm text-slate-500">
        <Link to="/carrito" className="hover:text-[#ec5b13]">Carrito</Link>
        <ChevronRight className="w-3 h-3" />
        <Link to="/checkout/datos" className="hover:text-[#ec5b13]">Envío</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#ec5b13] font-semibold">Confirmación</span>
      </nav>

      <div className="mb-10">
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-2">Revisa tu Pedido</h2>
        <p className="text-slate-600">Casi terminamos. Por favor, verifica que toda la información sea correcta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Columna Izquierda: Detalles del pedido */}
        <div className="lg:col-span-8 space-y-8">
          {/* Dirección de Envío */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <MapPin className="text-[#ec5b13] w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-slate-900">Dirección de Envío</h3>
              </div>
              <button 
                onClick={() => navigate('/checkout/datos')}
                className="text-[#ec5b13] text-sm font-semibold flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-4 h-4" /> Editar
              </button>
            </div>
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-1">
                <p className="font-semibold text-slate-900">Juan Pérez</p>
                <p className="text-slate-600 mt-1">Av. Paseo de la Reforma 222, Colonia Juárez</p>
                <p className="text-slate-600">Alcaldía Cuauhtémoc, CDMX, CP 06600</p>
                <p className="text-slate-600 mt-2">Tel: +52 55 1234 5678</p>
              </div>
              <div className="w-full md:w-48 h-32 rounded-lg bg-slate-200 overflow-hidden relative">
                <div 
                  className="absolute inset-0 bg-cover bg-center opacity-80" 
                  style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCfRG6d8QxAKMsiQUG6sPedz1Gz1f474nEwxVC2-Kb6vmtW_bn51wY6l8AJNf0pYHxAeDERZRPA_hz9AxjJ61ZIsq9h621RpfDVOK1nLksaehh7WtECdFspB0D4Q-bJs6xO1mIYGeHleWVaBz5hf9iLwwxar1H0GOr7etV7gg4GHA33xhnefpdUBqwaRKusLDQFb3R60M9oq1KyfGfUoVSQvt904WabFRbgcAiEXlRYvx9hags7RbM9aOWkYliPdskaMOJblRGGGXsL')" }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <MapPin className="text-[#ec5b13] w-8 h-8" />
                </div>
              </div>
            </div>
          </section>

          {/* Método de Entrega */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-4">
              <Zap className="text-[#ec5b13] w-6 h-6" />
              <h3 className="text-xl font-serif font-bold text-slate-900">Método de Entrega</h3>
            </div>
            <div className="p-4 rounded-lg bg-[#ec5b13]/5 border border-[#ec5b13]/20 flex items-center justify-between">
              <div>
                <p className="font-bold text-slate-900">Entrega Instantánea</p>
                <p className="text-sm text-slate-600">Recibe tus flores en un lapso de 60 a 90 minutos.</p>
              </div>
              <span className="text-[#ec5b13] font-bold">${shippingCost.toFixed(2)} MXN</span>
            </div>
          </section>

          {/* Mensaje para la tarjeta */}
          <section className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <Mail className="text-[#ec5b13] w-6 h-6" />
                <h3 className="text-xl font-serif font-bold text-slate-900">Mensaje para la Tarjeta</h3>
              </div>
              <button 
                onClick={() => navigate('/checkout/datos')}
                className="text-[#ec5b13] text-sm font-semibold flex items-center gap-1 hover:underline"
              >
                <Edit3 className="w-4 h-4" /> Editar
              </button>
            </div>
            <div className="italic text-slate-700 border-l-4 border-[#ec5b13]/30 pl-4 py-2">
              "Para la persona que ilumina mis días con su sonrisa. ¡Feliz aniversario, mi amor! Con todo mi cariño."
            </div>
            <p className="text-xs text-slate-500 mt-4 text-right">— De: Roberto B.</p>
          </section>

          {/* Políticas de entrega */}
          <div className="bg-slate-100 p-4 rounded-lg border-l-4 border-[#ec5b13] flex gap-4">
            <Info className="text-[#ec5b13] w-6 h-6 flex-shrink-0" />
            <div className="text-sm text-slate-600 leading-relaxed">
              <p className="font-bold mb-1">Políticas de Entrega:</p>
              Al confirmar tu pedido, aceptas nuestras condiciones de servicio. Las flores pueden variar ligeramente de la foto según disponibilidad estacional. Si el destinatario no se encuentra, el repartidor dejará el pedido con un vecino o vigilancia previa notificación.
            </div>
          </div>
        </div>

        {/* Columna Derecha: Resumen */}
        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-32 space-y-6">
            <div className="bg-white p-6 rounded-xl shadow-xl border border-slate-100">
              <h3 className="text-xl font-serif font-bold mb-6 border-b border-slate-100 pb-4 text-slate-900">Resumen del Pedido</h3>
              
              {/* Lista de Productos */}
              <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto no-scrollbar">
                {cart.length > 0 ? (
                  cart.map((item) => (
                    <div key={item.id} className="flex gap-4">
                      <div className="size-16 rounded-lg overflow-hidden flex-shrink-0">
                        <img 
                          alt={item.name} 
                          className="w-full h-full object-cover" 
                          src={item.image || "https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=200"}
                        />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-bold leading-tight text-slate-900">{item.name}</p>
                        <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
                        <p className="text-sm font-semibold mt-1 text-[#ec5b13]">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-slate-400 py-4">Carrito vacío</p>
                )}
              </div>

              {/* Totales */}
              <div className="space-y-3 pt-6 border-t border-slate-100">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Subtotal</span>
                  <span className="font-medium text-slate-900">${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-600">Envío (Instantáneo)</span>
                  <span className="font-medium text-slate-900">${shippingCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-lg font-bold pt-4 text-slate-900">
                  <span>Total</span>
                  <span className="text-[#ec5b13]">${total.toFixed(2)} MXN</span>
                </div>
              </div>

              {/* Botón Principal */}
              <button 
                onClick={() => navigate('/checkout/exito')}
                className="w-full mt-8 bg-[#ec5b13] hover:bg-[#ec5b13]/90 text-white font-bold py-4 rounded-xl shadow-lg shadow-[#ec5b13]/20 transition-all active:scale-[0.98]"
              >
                CONFIRMAR PEDIDO
              </button>
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-slate-400">
                <Lock className="w-3 h-3" />
                Pago 100% Seguro y Encriptado
              </div>
            </div>

            {/* Cupones o ayuda */}
            <div className="p-4 border-2 border-dashed border-slate-300 rounded-xl flex items-center gap-3 group cursor-pointer hover:border-[#ec5b13] transition-colors">
              <ShoppingBag className="w-5 h-5 text-slate-400 group-hover:text-[#ec5b13]" />
              <span className="text-sm font-medium text-slate-600">¿Tienes un cupón de descuento?</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-20 pb-10 text-center text-xs text-slate-400">
        © 2024 Florería Bautista. Todos los derechos reservados.
      </div>
    </main>
  );
}

