import React, { useState } from 'react';
import { 
  Flower2, 
  User, 
  ShoppingBasket, 
  PlusCircle, 
  Trash2, 
  Truck, 
  Calendar, 
  CreditCard, 
  Save,
  Image as ImageIcon,
  Edit3
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export default function PhysicalOrderPage() {
  const [items, setItems] = useState([
    { id: 1, name: 'Ramo 24 Rosas Rojas', quantity: 1, price: 850 }
  ]);

  const updateQuantity = (id: number, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const removeItem = (id: number) => {
    setItems(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const shipping = 120;
  const total = subtotal + shipping;

  return (
    <motion.main 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto"
    >
      {/* Title and Quick Actions */}
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-[#1A3B5B] flex items-center gap-2">
          <Flower2 className="w-8 h-8" />
          Registro de Pedido Físico
        </h1>
        <div className="flex gap-2">
          <button className="px-4 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Limpiar Formulario
          </button>
        </div>
      </div>

      <form className="grid grid-cols-1 lg:grid-cols-12 gap-6" onSubmit={(e) => e.preventDefault()}>
        {/* Left Column (Customer & Items) */}
        <section className="lg:col-span-7 space-y-6">
          {/* Customer Information Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-2 text-[#1A3B5B]">
              <User className="w-5 h-5" />
              <h2 className="font-semibold text-gray-800">Información del Cliente</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre del Cliente</label>
                <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A3B5B] focus:ring-[#1A3B5B] sm:text-sm" placeholder="Ej. Juan Pérez" type="text"/>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Teléfono de Contacto</label>
                <input className="w-full rounded-md border-gray-300 shadow-sm focus:border-[#1A3B5B] focus:ring-[#1A3B5B] sm:text-sm" placeholder="Ej. 55 1234 5678" type="tel"/>
              </div>
            </div>
          </div>

          {/* Order Items Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <div className="flex items-center gap-2 text-[#1A3B5B]">
                <ShoppingBasket className="w-5 h-5" />
                <h2 className="font-semibold text-gray-800">Productos del Pedido</h2>
              </div>
              <button className="flex items-center gap-1 text-sm font-semibold text-[#1A3B5B] hover:text-blue-800 transition-colors" type="button">
                <PlusCircle className="w-4 h-4" />
                Añadir Producto
              </button>
            </div>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs font-medium text-gray-500 uppercase tracking-wider border-b">
                    <th className="py-2 pr-4">Producto</th>
                    <th className="py-2 px-4 text-center">Cantidad</th>
                    <th className="py-2 px-4 text-right">Precio</th>
                    <th className="py-2 px-4 text-center">Personalizar</th>
                    <th className="py-2 pl-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  <AnimatePresence>
                    {items.map(item => (
                      <motion.tr 
                        key={item.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <td className="py-3 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-400">
                              <ImageIcon className="w-5 h-5" />
                            </div>
                            <span className="text-sm font-medium text-gray-700">{item.name}</span>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-center gap-2">
                            <button onClick={() => updateQuantity(item.id, -1)} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50" type="button">-</button>
                            <span className="text-sm w-4 text-center">{item.quantity}</span>
                            <button onClick={() => updateQuantity(item.id, 1)} className="w-6 h-6 rounded border border-gray-300 flex items-center justify-center hover:bg-gray-50" type="button">+</button>
                          </div>
                        </td>
                        <td className="py-3 px-4 text-right text-sm font-semibold text-gray-900">${(item.price * item.quantity).toFixed(2)}</td>
                        <td className="py-3 px-4 text-center">
                          <button className="text-[#1A3B5B] hover:underline text-xs flex items-center justify-center gap-1 mx-auto" type="button">
                            <Edit3 className="w-3 h-3" />
                            Nota/Tarjeta
                          </button>
                        </td>
                        <td className="py-3 pl-4 text-right">
                          <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-500" type="button">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* Right Column (Delivery & Payment) */}
        <section className="lg:col-span-5 space-y-6">
          {/* Delivery Details Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-2 text-[#1A3B5B]">
              <Truck className="w-5 h-5" />
              <h2 className="font-semibold text-gray-800">Entrega y Logística</h2>
            </div>
            {/* Delivery Type Toggle */}
            <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
              <button className="flex-1 py-2 text-xs font-semibold rounded-md bg-white shadow-sm text-[#1A3B5B]" type="button">PROGRAMADO</button>
              <button className="flex-1 py-2 text-xs font-semibold rounded-md text-gray-500 hover:text-gray-700" type="button">ENTREGA INMEDIATA</button>
            </div>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input className="w-full pl-9 rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-[#1A3B5B] focus:ring-[#1A3B5B]" type="date"/>
                </div>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Bloque Horario</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-[#1A3B5B] focus:ring-[#1A3B5B]">
                  <option>Mañana (9:00 - 13:00)</option>
                  <option>Tarde (13:00 - 18:00)</option>
                  <option>Noche (18:00 - 21:00)</option>
                </select>
              </div>
            </div>
            <div className="space-y-3">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Dirección Completa</label>
                <textarea className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-[#1A3B5B] focus:ring-[#1A3B5B]" placeholder="Calle, número, colonia, código postal..." rows={2}></textarea>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Referencias / Indicaciones</label>
                <input className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-[#1A3B5B] focus:ring-[#1A3B5B]" placeholder="Ej: Portón verde, junto al OXXO" type="text"/>
              </div>
            </div>
          </div>

          {/* Payment Summary Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center gap-2 mb-4 border-b pb-2 text-[#1A3B5B]">
              <CreditCard className="w-5 h-5" />
              <h2 className="font-semibold text-gray-800">Resumen y Pago</h2>
            </div>
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Subtotal</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Envío</span>
                <span>${shipping.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t border-dashed">
                <span>Total</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Método de Pago</label>
                <select className="w-full rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-[#1A3B5B] focus:ring-[#1A3B5B]">
                  <option>Efectivo</option>
                  <option>Tarjeta Crédito/Débito</option>
                  <option>Transferencia</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="block text-xs font-medium text-gray-500 uppercase tracking-wider">Monto a Pagar</label>
                <div className="relative">
                  <span className="absolute left-3 top-2 text-gray-500 sm:text-sm">$</span>
                  <input className="w-full pl-7 rounded-md border-gray-300 shadow-sm sm:text-sm focus:border-[#1A3B5B] focus:ring-[#1A3B5B]" type="number" defaultValue={total.toFixed(2)}/>
                </div>
              </div>
            </div>
            {/* Primary Action */}
            <button className="w-full mt-6 bg-[#1A3B5B] text-white py-3 px-4 rounded-lg font-bold text-lg hover:bg-blue-900 transition-all shadow-md active:scale-[0.98] flex items-center justify-center gap-3" type="submit">
              <Save className="w-5 h-5" />
              Registrar pedido
            </button>
          </div>
        </section>
      </form>
    </motion.main>
  );
}
