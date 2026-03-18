import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  ChevronRight, 
  PlusCircle, 
  Zap, 
  Calendar, 
  Clock, 
  ArrowLeft, 
  ArrowRight, 
  ShoppingBasket,
  ShieldCheck,
  CheckCircle,
  X
} from 'lucide-react';
import { useCart } from '../../hooks/useCart';

export default function CheckoutDataPage() {
  const navigate = useNavigate();
  const { cart, cartTotal } = useCart();
  const [address, setAddress] = useState('casa');
  const [orderType, setOrderType] = useState('instantaneo');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [deliveryDate, setDeliveryDate] = useState(new Date().toISOString().split('T')[0]);
  
  const today = new Date().toISOString().split('T')[0];

  const timeSlots = [
    { label: '09:00 AM - 12:00 PM', startHour: 9 },
    { label: '12:00 PM - 03:00 PM', startHour: 12 },
    { label: '03:00 PM - 06:00 PM', startHour: 15 },
    { label: '06:00 PM - 09:00 PM', startHour: 18 },
  ];

  const getAvailableSlots = () => {
    const now = new Date();
    const currentHour = now.getHours();
    const minHour = currentHour + 4;

    if (deliveryDate === today) {
      return timeSlots.filter(slot => slot.startHour >= minHour);
    }
    return timeSlots;
  };

  const availableSlots = getAvailableSlots();

  useEffect(() => {
    if (orderType === 'instantaneo') {
      setDeliveryDate(today);
    }
  }, [orderType, today]);

  const [savedAddresses, setSavedAddresses] = useState([
    { id: 'casa', label: 'Casa', address: 'Calle Los Tulipanes 123, Col. Jardines, Monterrey, NL. CP 64000' },
    { id: 'trabajo', label: 'Trabajo', address: 'Av. Constitución 450, Piso 12, Monterrey, NL. CP 64000' }
  ]);

  const [newAddress, setNewAddress] = useState({
    label: '',
    street: '',
    colony: '',
    city: 'Monterrey',
    zip: ''
  });

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    const id = `address-${Date.now()}`;
    const fullAddress = `${newAddress.street}, Col. ${newAddress.colony}, ${newAddress.city}. CP ${newAddress.zip}`;
    
    setSavedAddresses([...savedAddresses, { id, label: newAddress.label || 'Nueva Dirección', address: fullAddress }]);
    setAddress(id);
    setShowAddressModal(false);
    setNewAddress({ label: '', street: '', colony: '', city: 'Monterrey', zip: '' });
  };

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 sm:px-6 lg:px-8 pt-32 min-h-screen font-display bg-[#f0f7ff]">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-sm mb-8 text-slate-500">
        <Link to="/carrito" className="hover:text-[#ec5b13] transition-colors">Carrito</Link>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#ec5b13] font-semibold">Datos de Pedido</span>
        <ChevronRight className="w-3 h-3" />
        <span className="text-slate-400">Confirmación</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Checkout Form */}
        <div className="lg:col-span-8 space-y-8">
          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#ec5b13]/10 rounded-lg">
                <MapPin className="w-6 h-6 text-[#ec5b13]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Dirección de Entrega</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {savedAddresses.map((addr) => (
                <label key={addr.id} className="relative group cursor-pointer">
                  <input 
                    type="radio" 
                    name="address" 
                    className="peer sr-only" 
                    checked={address === addr.id} 
                    onChange={() => setAddress(addr.id)}
                  />
                  <div className="p-4 h-full rounded-xl border-2 border-slate-100 bg-slate-50 peer-checked:border-[#ec5b13] peer-checked:bg-[#ec5b13]/5 transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <span className="font-bold text-slate-900">{addr.label}</span>
                      <CheckCircle className="w-5 h-5 text-[#ec5b13] opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <p className="text-sm text-slate-600">{addr.address}</p>
                  </div>
                </label>
              ))}
            </div>
            
            <button 
              onClick={() => setShowAddressModal(true)}
              className="flex items-center gap-2 text-[#ec5b13] font-semibold hover:gap-3 transition-all"
            >
              <PlusCircle className="w-5 h-5" />
              Añadir nueva dirección
            </button>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#ec5b13]/10 rounded-lg">
                <Zap className="w-6 h-6 text-[#ec5b13]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Tipo de Pedido</h2>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <label className="relative cursor-pointer">
                <input 
                  type="radio" 
                  name="order_type" 
                  className="peer sr-only" 
                  checked={orderType === 'instantaneo'} 
                  onChange={() => setOrderType('instantaneo')}
                />
                <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-slate-100 rounded-xl peer-checked:border-[#ec5b13] peer-checked:bg-[#ec5b13]/5 transition-all">
                  <Zap className={`w-8 h-8 mb-2 transition-colors ${orderType === 'instantaneo' ? 'text-[#ec5b13]' : 'text-slate-400'}`} />
                  <span className="font-bold text-lg text-slate-900">INSTANTÁNEO</span>
                  <span className="text-sm text-slate-500">Entrega hoy mismo</span>
                </div>
              </label>
              
              <label className="relative cursor-pointer">
                <input 
                  type="radio" 
                  name="order_type" 
                  className="peer sr-only" 
                  checked={orderType === 'anticipado'} 
                  onChange={() => setOrderType('anticipado')}
                />
                <div className="flex flex-col items-center justify-center p-6 text-center border-2 border-slate-100 rounded-xl peer-checked:border-[#ec5b13] peer-checked:bg-[#ec5b13]/5 transition-all">
                  <Calendar className={`w-8 h-8 mb-2 transition-colors ${orderType === 'anticipado' ? 'text-[#ec5b13]' : 'text-slate-400'}`} />
                  <span className="font-bold text-lg text-slate-900">ANTICIPADO</span>
                  <span className="text-sm text-slate-500">Programar para después</span>
                </div>
              </label>
            </div>
          </section>

          <section className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-[#ec5b13]/10 rounded-lg">
                <Clock className="w-6 h-6 text-[#ec5b13]" />
              </div>
              <h2 className="text-xl font-bold text-slate-900">Fecha y Hora</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                  <Calendar className="w-4 h-4" />
                  Seleccionar Fecha
                </label>
                <div className="relative">
                  <input 
                    className={`w-full rounded-lg border-slate-200 focus:border-[#ec5b13] focus:ring-[#ec5b13] p-3 ${orderType === 'instantaneo' ? 'bg-slate-50 cursor-not-allowed opacity-70' : ''}`} 
                    type="date" 
                    value={deliveryDate}
                    min={today}
                    readOnly={orderType === 'instantaneo'}
                    onChange={(e) => setDeliveryDate(e.target.value)}
                  />
                </div>
                <p className="text-xs text-slate-400">
                  {orderType === 'instantaneo' 
                    ? 'Los pedidos instantáneos se entregan el mismo día.' 
                    : 'Selecciona una fecha futura para tu entrega.'}
                </p>
              </div>

              {orderType === 'anticipado' && (
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center gap-2 text-slate-700">
                    <Clock className="w-4 h-4" />
                    Rango de Entrega
                  </label>
                  <select className="w-full rounded-lg border-slate-200 focus:border-[#ec5b13] focus:ring-[#ec5b13] p-3">
                    {availableSlots.length > 0 ? (
                      availableSlots.map((slot) => (
                        <option key={slot.label}>{slot.label}</option>
                      ))
                    ) : (
                      <option disabled>No hay horarios disponibles para hoy</option>
                    )}
                  </select>
                  <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                    {availableSlots.length > 0 ? (
                      <>
                        <CheckCircle className="w-3 h-3" />
                        Horario disponible
                      </>
                    ) : (
                      <span className="text-red-500">Por favor selecciona otra fecha</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </section>

          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
            <button 
              onClick={() => navigate('/carrito')}
              className="w-full sm:w-auto px-8 py-3 rounded-xl font-bold text-slate-600 hover:bg-slate-100 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              Volver al carrito
            </button>
            <button 
              onClick={() => navigate('/checkout/revision')}
              className="w-full sm:w-auto px-12 py-3 rounded-xl bg-[#ec5b13] text-white font-bold hover:shadow-lg hover:shadow-[#ec5b13]/20 transition-all flex items-center justify-center gap-2"
            >
              Continuar a revisión
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Right Column: Cart Summary (Sticky) */}
        <aside className="lg:col-span-4 lg:sticky lg:top-32 space-y-6">
          <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2 text-slate-900">
              <ShoppingBasket className="w-5 h-5 text-[#ec5b13]" />
              Resumen de Compra
            </h3>
            
            <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto no-scrollbar">
              {cart.length > 0 ? (
                cart.map((item) => (
                  <div key={item.id} className="flex gap-3">
                    <div className="h-16 w-16 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden">
                      <img 
                        alt={item.name} 
                        className="h-full w-full object-cover" 
                        src={item.image || "https://images.unsplash.com/photo-1522673607200-1648832cee98?auto=format&fit=crop&q=80&w=200"}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold truncate text-slate-900">{item.name}</p>
                      <p className="text-xs text-slate-500">Cantidad: {item.quantity}</p>
                      <p className="text-sm font-bold text-[#ec5b13]">${(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-slate-400 py-4">Tu carrito está vacío</p>
              )}
            </div>
            
            <div className="border-t border-dashed border-slate-200 pt-4 space-y-3">
              <div className="flex justify-between text-sm text-slate-600">
                <span>Subtotal</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-600">
                <span>Envío</span>
                <span className="text-green-600 font-medium">¡Gratis!</span>
              </div>
              <div className="flex justify-between text-xl font-black text-slate-900 pt-2">
                <span>Total</span>
                <span>${cartTotal.toFixed(2)}</span>
              </div>
            </div>
          </div>
          
          <div className="bg-[#ec5b13]/10 rounded-xl p-4 flex gap-3">
            <ShieldCheck className="w-6 h-6 text-[#ec5b13] flex-shrink-0" />
            <p className="text-xs text-slate-600">
              <span className="font-bold block text-slate-900">Compra Segura</span>
              Tus datos están protegidos con encriptación SSL de grado bancario.
            </p>
          </div>
        </aside>
      </div>

      {/* Floating Address Modal */}
      <AnimatePresence>
        {showAddressModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <MapPin className="text-[#ec5b13]" />
                  Nueva Dirección
                </h3>
                <button 
                  onClick={() => setShowAddressModal(false)}
                  className="p-2 hover:bg-slate-200 rounded-full transition-colors"
                >
                  <X className="w-6 h-6 text-slate-500" />
                </button>
              </div>
              
              <form onSubmit={handleAddAddress} className="p-8 space-y-6">
                <div className="space-y-1">
                  <label className="text-sm font-bold text-slate-700">Etiqueta (Ej. Oficina, Casa Mamá)</label>
                  <input 
                    required
                    className="w-full rounded-xl border-slate-200 focus:border-[#ec5b13] focus:ring-[#ec5b13] p-3" 
                    placeholder="Nombre para esta dirección" 
                    type="text"
                    value={newAddress.label}
                    onChange={(e) => setNewAddress({...newAddress, label: e.target.value})}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Calle y Número</label>
                    <input 
                      required
                      className="w-full rounded-xl border-slate-200 focus:border-[#ec5b13] focus:ring-[#ec5b13] p-3" 
                      placeholder="Ej. Calle 10 #123" 
                      type="text"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Colonia</label>
                    <input 
                      required
                      className="w-full rounded-xl border-slate-200 focus:border-[#ec5b13] focus:ring-[#ec5b13] p-3" 
                      placeholder="Ej. Centro" 
                      type="text"
                      value={newAddress.colony}
                      onChange={(e) => setNewAddress({...newAddress, colony: e.target.value})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Ciudad</label>
                    <input 
                      required
                      className="w-full rounded-xl border-slate-200 focus:border-[#ec5b13] focus:ring-[#ec5b13] p-3" 
                      placeholder="Monterrey" 
                      type="text"
                      value={newAddress.city}
                      onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-sm font-bold text-slate-700">Código Postal</label>
                    <input 
                      required
                      className="w-full rounded-xl border-slate-200 focus:border-[#ec5b13] focus:ring-[#ec5b13] p-3" 
                      placeholder="64000" 
                      type="text"
                      value={newAddress.zip}
                      onChange={(e) => setNewAddress({...newAddress, zip: e.target.value})}
                    />
                  </div>
                </div>

                <div className="pt-4">
                  <button 
                    type="submit"
                    className="w-full py-4 bg-[#ec5b13] text-white font-black rounded-2xl hover:shadow-xl hover:shadow-[#ec5b13]/30 transition-all"
                  >
                    Guardar Dirección
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </main>
  );
}

