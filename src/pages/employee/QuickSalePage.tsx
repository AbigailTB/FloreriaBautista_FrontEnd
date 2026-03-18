import React, { useState, useEffect } from 'react';
import { 
  ShoppingBasket, 
  Search, 
  Plus, 
  Minus, 
  Trash2, 
  CreditCard, 
  Banknote, 
  CheckCircle2, 
  UserPlus,
  Flower2,
  Sparkles,
  Leaf,
  Gift,
  PlusCircle,
  Loader2,
  User,
  Package,
  ShoppingCart,
  ChevronRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { DataService, Order, OrderItem, Product } from '../../services/dataService';
import { useToast } from '../../hooks/useToast';

export default function QuickSalePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card'>('cash');
  const [cashReceived, setCashReceived] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const { showToast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const allProducts = DataService.getProducts();
    setProducts(allProducts);
    
    const storedUser = localStorage.getItem('usuario') || localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const addToCart = (product: Product) => {
    if (product.stock <= 0) {
      showToast('Producto sin stock', 'error');
      return;
    }
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          showToast('No hay más stock disponible', 'error');
          return prev;
        }
        return prev.map(item => item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item);
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === id) {
        const product = products.find(p => p.id === id);
        const newQty = Math.max(0, item.quantity + delta);
        if (product && newQty > product.stock) {
          showToast('Stock insuficiente', 'error');
          return item;
        }
        return { ...item, quantity: newQty };
      }
      return item;
    }).filter(item => item.quantity > 0));
  };

  const removeFromCart = (id: string) => {
    setCart(prev => prev.filter(item => item.id !== id));
  };

  const subtotal = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const tax = subtotal * 0.16;
  const total = subtotal + tax;
  const change = Math.max(0, cashReceived - total);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    if (paymentMethod === 'cash' && cashReceived < total) {
      showToast('Efectivo insuficiente', 'error');
      return;
    }

    setIsProcessing(true);
    try {
      const orderItems: OrderItem[] = cart.map(item => ({
        productId: item.id,
        productName: item.name,
        quantity: item.quantity,
        price: item.price,
        image: item.image
      }));

      const newOrder: Order = {
        id: `ORD-${Date.now()}`,
        customerId: 'customer-anonymous',
        items: orderItems,
        total: total,
        status: 'delivered',
        paymentMethod: paymentMethod,
        paymentStatus: 'paid',
        createdAt: new Date().toISOString()
      };

      await DataService.addOrder(newOrder);

      for (const item of cart) {
        const product = products.find(p => p.id === item.id);
        if (product) {
          await DataService.updateProductStock(item.id, product.stock - item.quantity);
        }
      }

      await DataService.addAuditLog({
        action: 'quick_sale',
        details: `Venta rápida registrada por $${total.toFixed(2)}`,
        userId: user?.id || 'staff-1'
      });

      showToast('Venta registrada con éxito', 'success');
      setCart([]);
      setCashReceived(0);
      setProducts(DataService.getProducts());
    } catch (error) {
      showToast('Error al procesar la venta', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-[1440px] mx-auto grid grid-cols-12 gap-6 font-sans">
      {/* Header Section */}
      <header className="col-span-12 flex items-center justify-between bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
        <div className="flex items-center gap-5">
          <div className="bg-blue-600 text-white p-3 rounded-xl shadow-lg shadow-blue-200">
            <Flower2 className="w-8 h-8" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 font-serif">Florería Bautista</h1>
            <div className="flex items-center gap-2 text-slate-500 font-medium">
              <Package className="w-4 h-4" />
              <span className="text-sm">Punto de Venta: Sucursal Central</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right hidden md:block">
            <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Vendedor</p>
            <p className="font-bold text-slate-900">{user?.name || 'Carlos Méndez'}</p>
          </div>
          <div className="h-12 w-12 rounded-full ring-4 ring-slate-50 bg-blue-50 flex items-center justify-center text-blue-600 overflow-hidden border border-blue-100">
            {user?.photoURL ? (
              <img src={user.photoURL || null} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <User className="w-6 h-6" />
            )}
          </div>
        </div>
      </header>

      {/* Left Column: Products & Search */}
      <main className="col-span-12 lg:col-span-8 flex flex-col gap-6">
        {/* Quick Add Section */}
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <motion.button 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 hover:border-amber-400 rounded-2xl shadow-sm transition-all group"
          >
            <div className="bg-amber-50 p-3 rounded-full mb-3 group-hover:bg-amber-100 transition-colors">
              <Sparkles className="text-amber-500 w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Ramo Express</span>
            <span className="text-xs font-bold text-amber-600 mt-1">$15.00</span>
          </motion.button>
          <motion.button 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 hover:border-emerald-400 rounded-2xl shadow-sm transition-all group"
          >
            <div className="bg-emerald-50 p-3 rounded-full mb-3 group-hover:bg-emerald-100 transition-colors">
              <Leaf className="text-emerald-500 w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Florero Básico</span>
            <span className="text-xs font-bold text-emerald-600 mt-1">$25.50</span>
          </motion.button>
          <motion.button 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 hover:border-rose-400 rounded-2xl shadow-sm transition-all group"
          >
            <div className="bg-rose-50 p-3 rounded-full mb-3 group-hover:bg-rose-100 transition-colors">
              <Gift className="text-rose-500 w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Caja Regalo</span>
            <span className="text-xs font-bold text-rose-600 mt-1">$40.00</span>
          </motion.button>
          <motion.button 
            whileHover={{ y: -4 }}
            whileTap={{ scale: 0.98 }}
            className="flex flex-col items-center justify-center p-6 bg-white border border-slate-100 hover:border-blue-400 rounded-2xl shadow-sm transition-all group text-blue-600"
          >
            <div className="bg-blue-50 p-3 rounded-full mb-3 group-hover:bg-blue-100 transition-colors">
              <PlusCircle className="w-6 h-6" />
            </div>
            <span className="font-bold text-slate-900 text-sm">Personalizado</span>
            <span className="text-xs font-bold text-blue-600 mt-1">Manual</span>
          </motion.button>
        </section>

        {/* Search & Product Selection */}
        <section className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-slate-50/30">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 w-6 h-6" />
              <input 
                className="w-full pl-14 pr-6 py-5 bg-white border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 text-xl transition-all shadow-sm" 
                placeholder="Buscar producto por nombre o código..." 
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <div className="p-8 grid grid-cols-2 md:grid-cols-3 gap-8 max-h-[700px] overflow-y-auto no-scrollbar">
            {filteredProducts.map(product => (
              <motion.div 
                key={product.id}
                whileHover={{ y: -6, scale: 1.02 }}
                onClick={() => addToCart(product)}
                className="group relative bg-white p-5 rounded-[2rem] border border-slate-100 hover:border-blue-200 hover:shadow-xl hover:shadow-blue-500/5 transition-all cursor-pointer"
              >
                <div className="aspect-square bg-slate-50 rounded-[1.5rem] mb-5 overflow-hidden relative">
                  <img 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                    src={product.image || null} 
                    alt={product.name} 
                    referrerPolicy="no-referrer" 
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h4 className="font-black text-slate-900 text-base truncate mb-1">{product.name}</h4>
                <div className="flex items-center justify-between">
                  <p className="text-blue-600 font-black text-xl">${product.price}</p>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-widest ${product.stock > 5 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                    {product.stock} disp.
                  </span>
                </div>
                <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-all transform translate-y-3 group-hover:translate-y-0">
                  <div className="bg-blue-600 text-white rounded-2xl p-3 shadow-2xl flex items-center justify-center hover:bg-blue-700 transition-colors">
                    <Plus size={24} strokeWidth={3} />
                  </div>
                </div>
              </motion.div>
            ))}
            {filteredProducts.length === 0 && (
              <div className="col-span-full py-32 flex flex-col items-center justify-center text-slate-300">
                <div className="bg-slate-50 p-10 rounded-full mb-6">
                  <Search className="w-16 h-16 opacity-20" />
                </div>
                <p className="font-black text-xl text-slate-400">No se encontraron productos</p>
                <p className="text-sm mt-2">Intenta con otros términos de búsqueda</p>
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Right Column: Cart & Payment */}
      <aside className="col-span-12 lg:col-span-4 flex flex-col gap-6">
        {/* Client Info Card */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-xs uppercase text-slate-400 tracking-widest">Cliente</h3>
            <span className="text-[10px] bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-bold">Opcional</span>
          </div>
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white text-sm transition-all" placeholder="Nombre o Teléfono" type="text"/>
            </div>
            <button className="bg-blue-50 text-blue-600 p-2.5 rounded-xl hover:bg-blue-100 transition-colors flex items-center justify-center border border-blue-100">
              <UserPlus size={20} />
            </button>
          </div>
          <div className="mt-4 flex items-center gap-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <div className="bg-blue-600 text-white rounded-xl h-10 w-10 flex items-center justify-center shadow-md">
              <User size={20} />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-900">Venta al Público</p>
              <p className="text-xs text-slate-500">Sin registro detallado</p>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-300" />
          </div>
        </section>

        {/* Basket / Shopping List */}
        <section className="bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col min-h-[450px]">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div className="flex items-center gap-2">
              <ShoppingCart className="w-5 h-5 text-slate-400" />
              <h3 className="font-bold text-xs uppercase text-slate-400 tracking-widest">Detalle de Compra</h3>
            </div>
            <span className="bg-blue-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-full shadow-md shadow-blue-100">{cart.length} Ítems</span>
          </div>
          <div className="flex-1 p-6 flex flex-col gap-4 overflow-y-auto max-h-[400px] no-scrollbar">
            <AnimatePresence>
              {cart.map(item => (
                <motion.div 
                  key={item.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="flex items-center gap-4 bg-white p-3 rounded-xl border border-slate-50 hover:border-slate-100 transition-all group"
                >
                  <div className="w-14 h-14 bg-slate-50 rounded-lg overflow-hidden border border-slate-100">
                    <img className="w-full h-full object-cover" src={item.image || null} alt={item.name} referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 leading-tight mb-1">{item.name}</p>
                    <p className="text-xs font-bold text-blue-600">${item.price} <span className="text-slate-400 font-medium">x {item.quantity}</span></p>
                  </div>
                  <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-lg">
                    <button 
                      onClick={() => updateQuantity(item.id, -1)} 
                      className="h-7 w-7 rounded-md bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-bold w-6 text-center">{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)} 
                      className="h-7 w-7 rounded-md bg-white shadow-sm flex items-center justify-center text-slate-600 hover:text-blue-600 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                  <button 
                    onClick={() => removeFromCart(item.id)}
                    className="p-1.5 text-slate-300 hover:text-rose-500 transition-colors"
                  >
                    <Trash2 size={16} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
            {cart.length === 0 && (
              <div className="flex flex-col items-center justify-center h-full text-slate-300 py-10">
                <div className="bg-slate-50 p-6 rounded-full mb-4">
                  <ShoppingBasket size={48} className="opacity-20" />
                </div>
                <p className="text-sm font-bold">Tu carrito está vacío</p>
                <p className="text-xs mt-1">Agrega productos para comenzar</p>
              </div>
            )}
          </div>
          {/* Calculation Section */}
          <div className="p-6 bg-slate-50/50 border-t border-slate-100">
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Subtotal</span>
                <span className="font-bold text-slate-900">${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500 font-medium">Impuestos (16%)</span>
                <span className="font-bold text-slate-900">${tax.toFixed(2)}</span>
              </div>
            </div>
            <div className="flex justify-between items-end pt-4 border-t border-slate-200/50">
              <span className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total</span>
              <span className="text-4xl font-black text-blue-600 tracking-tighter">${total.toFixed(2)}</span>
            </div>
          </div>
        </section>

        {/* Payment & Checkout */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-6">
          <h3 className="font-bold text-xs uppercase text-slate-400 tracking-widest">Método de Pago</h3>
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setPaymentMethod('cash')}
              className={`flex flex-col items-center justify-center py-5 border-2 rounded-2xl transition-all ${paymentMethod === 'cash' ? 'border-blue-600 bg-blue-50/50 shadow-inner' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}`}
            >
              <Banknote className={`${paymentMethod === 'cash' ? 'text-blue-600' : 'text-slate-400'} w-8 h-8 mb-2`} />
              <span className={`text-sm font-bold ${paymentMethod === 'cash' ? 'text-blue-600' : 'text-slate-500'}`}>Efectivo</span>
            </button>
            <button 
              onClick={() => setPaymentMethod('card')}
              className={`flex flex-col items-center justify-center py-5 border-2 rounded-2xl transition-all ${paymentMethod === 'card' ? 'border-blue-600 bg-blue-50/50 shadow-inner' : 'border-slate-50 bg-slate-50/30 hover:border-slate-200'}`}
            >
              <CreditCard className={`${paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-400'} w-8 h-8 mb-2`} />
              <span className={`text-sm font-bold ${paymentMethod === 'card' ? 'text-blue-600' : 'text-slate-500'}`}>Tarjeta</span>
            </button>
          </div>
          
          {paymentMethod === 'cash' && (
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-50 p-4 rounded-2xl border border-slate-100"
            >
              <div className="flex items-center justify-between mb-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recibido</label>
                <div className="flex items-center gap-1 font-black text-2xl text-slate-900">
                  <span className="text-slate-300">$</span>
                  <input 
                    className="w-28 bg-transparent border-none p-0 focus:ring-0 text-right font-black" 
                    type="number" 
                    value={cashReceived}
                    onChange={(e) => setCashReceived(parseFloat(e.target.value) || 0)}
                  />
                </div>
              </div>
              <div className="flex items-center justify-between pt-3 border-t border-slate-200/50">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Cambio</span>
                <span className="text-2xl font-black text-emerald-600">${change.toFixed(2)}</span>
              </div>
            </motion.div>
          )}

          <motion.button 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleCheckout}
            disabled={cart.length === 0 || isProcessing}
            className="w-full bg-amber-400 hover:bg-amber-500 text-slate-900 font-black py-6 rounded-2xl shadow-xl shadow-amber-100 flex items-center justify-center gap-3 text-xl transition-all disabled:opacity-50 disabled:grayscale"
          >
            {isProcessing ? (
              <Loader2 className="animate-spin" size={28} />
            ) : (
              <CheckCircle2 size={28} />
            )}
            {isProcessing ? 'PROCESANDO...' : 'REGISTRAR VENTA'}
          </motion.button>
        </section>
      </aside>

      {/* Floating Action for Mobile */}
      <div className="lg:hidden fixed bottom-8 right-8 z-50">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="h-16 w-16 bg-blue-600 text-white rounded-full shadow-2xl flex items-center justify-center relative border-4 border-white"
        >
          <ShoppingCart className="w-8 h-8" />
          {cart.length > 0 && (
            <span className="absolute -top-2 -right-2 bg-amber-400 text-slate-900 h-7 w-7 rounded-full flex items-center justify-center text-xs font-black border-2 border-white">
              {cart.length}
            </span>
          )}
        </motion.button>
      </div>
    </div>
  );
}
