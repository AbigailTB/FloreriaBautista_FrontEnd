import React from 'react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { 
  CheckCircle, 
  ArrowLeft, 
  Download, 
  Printer, 
  Share2 
} from 'lucide-react';

export default function OrderSuccessPage() {
  const navigate = useNavigate();

  return (
    <main className="max-w-2xl mx-auto pt-32 pb-20 px-4 font-sans bg-gray-50 min-h-screen">
      {/* BEGIN: HeaderSection */}
      <div className="text-center mb-12">
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle className="w-12 h-12 text-green-600" />
        </motion.div>
        <h1 className="font-serif text-3xl text-[#1A3B5B] mb-2">¡Pedido Confirmado!</h1>
        <p className="text-gray-500 italic">Gracias por confiar en Florería Bautista. Tu pedido está en camino.</p>
      </div>
      {/* END: HeaderSection */}

      {/* BEGIN: TicketLayout */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 relative"
      >
        {/* BEGIN: TicketTop */}
        <div className="p-8 border-b border-gray-100 relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h2 className="font-serif text-xl text-[#D4AF37] tracking-wide">Florería Bautista</h2>
              <p className="text-xs uppercase tracking-widest text-gray-400">Recibo de Pedido #FB-2024</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-400">Fecha de Orden</p>
              <p className="font-semibold text-[#1A3B5B]">24 de Mayo, 2024</p>
            </div>
          </div>

          {/* BEGIN: ProductsList */}
          <section>
            <h3 className="font-serif text-lg text-[#1A3B5B] mb-4 flex items-center">
              <span className="w-8 h-px bg-[#D4AF37] mr-3"></span>
              Productos y Personalización
            </h3>
            <div className="space-y-6">
              {/* Product Item 1 */}
              <div className="flex gap-4 items-start pb-6 border-b border-gray-50">
                <img 
                  alt="Arreglo Rosas" 
                  className="w-20 h-20 object-cover rounded-lg shadow-sm" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuBWf_ZMCTM0sOnzMtJmtirusE2YEjHUo4GhBWQ5cc-G7wQLM5eeM4-Y2EvaD6qkLFYFFsA5vb4Z6gOSOlQs7wxTSEcvJE4GmniBmqKyWS9VucH4CwqDRo68FHP3sPXk5MEDGsTtxiKCyDuivzlBzKdYjCbNVidsQ8P-Z14s3FO7xcxoNdmQn63nMw3bPQZVp1XDx4UxBm1Y6v7Y4Gowbn7tpilOKJPLGZED1q8hAcvcb9rmgmwluHQKxalsYKcCp0IbEzkjiiaohKwn"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-[#1A3B5B]">Ramo Esplendor Imperial</h4>
                    <span className="text-[#1A3B5B] font-semibold">$1,250.00</span>
                  </div>
                  <ul className="mt-1 text-sm text-gray-600 space-y-1">
                    <li><span className="font-medium text-[#D4AF37]">Tamaño:</span> Grande (24 rosas)</li>
                    <li><span className="font-medium text-[#D4AF37]">Color:</span> Rojo Pasión</li>
                    <li className="italic bg-[#F9F1DC] p-2 rounded mt-2 text-xs">
                      "Feliz aniversario mi amor, cada día te amo más."
                    </li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">Cantidad: 1</p>
                </div>
              </div>
              {/* Product Item 2 */}
              <div className="flex gap-4 items-start">
                <img 
                  alt="Tulipanes" 
                  className="w-20 h-20 object-cover rounded-lg shadow-sm" 
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuAt0SeG3_WG990fIgvchflE08gMc0EJ7vQgeyLRvJ1i6u5zflcye6n8dZskKy2WX9riKWY3PXLd-Gpq3r3B_f0Ufu_NZL2Gh6g6sUlB3iqF5adpCg7N1_glBmzpvk9X3-0mNnWdJO3T5OjULMJXqMoFue-zFJ_Cre8_9wJw-eglaBFEH-SQChhyuziVMP9KgHykMZM7pEqfrSU1ymzpksjHOzK1Y40pZo5TBG1T-6HMLqzMmK-wiaShKfwRyKayHC_ueqDoi6ZhY1k3"
                />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h4 className="font-semibold text-[#1A3B5B]">Duo de Tulipanes Holandeses</h4>
                    <span className="text-[#1A3B5B] font-semibold">$850.00</span>
                  </div>
                  <ul className="mt-1 text-sm text-gray-600 space-y-1">
                    <li><span className="font-medium text-[#D4AF37]">Tamaño:</span> Estándar</li>
                    <li><span className="font-medium text-[#D4AF37]">Color:</span> Amarillos y Blancos</li>
                  </ul>
                  <p className="text-xs text-gray-400 mt-2">Cantidad: 1</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Decorative Perforation Line */}
        <div className="h-4 w-full flex items-center overflow-hidden">
          <div className="w-full border-b-2 border-dashed border-[#D4AF37] opacity-30"></div>
        </div>

        {/* BEGIN: TicketMiddle */}
        <div className="p-8 bg-white border-b border-gray-100">
          <section>
            <h3 className="font-serif text-lg text-[#1A3B5B] mb-4 flex items-center">
              <span className="w-8 h-px bg-[#D4AF37] mr-3"></span>
              Detalles de Entrega
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-2">
                <p className="text-gray-400 uppercase text-[10px] tracking-widest font-bold">Dirección de Envío</p>
                <p className="text-gray-700 leading-relaxed">
                  Av. Paseo de la Reforma 1234,<br/>
                  Torre B, Depto 502, Col. Juárez,<br/>
                  CP 06600, CDMX.
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-gray-400 uppercase text-[10px] tracking-widest font-bold">Programación</p>
                <div className="flex flex-col gap-1">
                  <span className="inline-flex items-center px-2 py-1 rounded bg-blue-50 text-[#1A3B5B] text-xs font-semibold w-fit">
                    Pedido Anticipado
                  </span>
                  <p className="text-gray-700 font-medium">Lunes 27 de Mayo</p>
                  <p className="text-gray-500">Horario: 09:00 AM - 12:00 PM</p>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* BEGIN: TicketBottom */}
        <div className="p-8 bg-[#F9F1DC]/30">
          <section>
            <h3 className="font-serif text-lg text-[#1A3B5B] mb-4 flex items-center">
              <span className="w-8 h-px bg-[#D4AF37] mr-3"></span>
              Resumen de Pago
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal Productos</span>
                <span>$2,100.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Costo de Envío</span>
                <span>$150.00</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Impuestos (IVA 16%)</span>
                <span>$360.00</span>
              </div>
              <div className="pt-4 mt-2 border-t border-[#D4AF37]/20 flex justify-between items-center">
                <span className="font-serif text-xl text-[#1A3B5B] font-bold">Total Pagado</span>
                <span className="font-serif text-2xl text-[#1A3B5B] font-bold">$2,610.00</span>
              </div>
            </div>
          </section>
        </div>
      </motion.div>

      {/* BEGIN: ActionButtons */}
      <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center items-center">
        <button 
          onClick={() => navigate('/catalogo')}
          className="w-full sm:w-auto px-8 py-3 text-[#1A3B5B] font-semibold border-2 border-[#1A3B5B]/20 rounded-full hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Seguir comprando
        </button>
        <div className="flex gap-2 w-full sm:w-auto">
          <button className="p-3 bg-white text-[#1A3B5B] border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm">
            <Printer className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white text-[#1A3B5B] border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm">
            <Download className="w-5 h-5" />
          </button>
          <button className="p-3 bg-white text-[#1A3B5B] border border-gray-200 rounded-full hover:bg-gray-50 transition-all shadow-sm">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>
    </main>
  );
}
