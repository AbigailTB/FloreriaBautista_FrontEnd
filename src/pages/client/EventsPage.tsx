import React from 'react';
import { motion } from 'motion/react';
import { Calendar, ArrowRight, Sparkles, Star } from 'lucide-react';

const events = [
  {
    id: 1,
    title: 'Despertar de Primavera',
    type: 'Taller Presencial',
    date: '25 Mar',
    description: 'Aprende las técnicas de composición con flores de temporada y llévate tu propia creación a casa.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWr57pE8WSmvl0CDIG6F7n7sYfFaf-yT75S5jMTOVtrdXx56gKwMTVyKT4hQQeZQ-G3D6_ROM_48uA4lRjxiohpDtkE9Sun8TKsRZ97ypl5spIG6iHebYmVzz0LaqOXqHtSff-deowSxvDSPEYbJfXWZvkdin7WQnxFACSXflqBEfTjAiAu6-3ReeHiqARqDCxS2_SMgo5N3x0wURpkXBE6YmVLMYmYWo7dON3q7XZ79J6NED_TI30Q1-N3VjwjHN5PUEckwUAbC77'
  },
  {
    id: 2,
    title: 'Bodas & Grandes Galas',
    type: 'Servicio Especial',
    date: 'Reserva',
    description: 'Diseño de concepto floral integral para eventos que buscan la excelencia y el lujo.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCzru3NGCnIsXhgLOcid7hLN2VEMJ2ixTm5MWMQLd3pEVPymrBtj8BUKGqTTSmsSmxM3QWS_5cWc_j2fh9YKepM6vGDvol_ap5zKmdCXKFaWPfZfFhJ2IQFtUfasDrUoSCcMF3DrVzWAFzSm4-oS2AZotSyjikMX05YDx4JD5RCzGiNrF8iDeWOgVI_7d8eHMpf8E8DrqGf3rw_9rFfRCHPRS5-BxWnSYKCV94_NByx2ap1SLIAxd4kkAC7RPrJjB8g2PdKHIEqSeqW'
  }
];

const archiveItems = [
  {
    id: 1,
    title: '25° Aniversario de la Tienda',
    date: 'Diciembre 2023',
    description: 'Celebración comunitaria y exhibición floral.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDOTNNUpsybD87gDUEoDgHPhmxL7Hxitm-pNelMdNBYBh7mmQ1k8ieyLzIGxwSG-UZYEJVzl5sLDA3IytnKI2ukI42lZl5t5awdUrz1WHgozhnxZa7vHoj19WndzVRQeaiOKptzX1UmjcQL2dnJGpkNKFuz4B9yRNQDo76I1GGUIQB1GBPn7VtboT5QXPY2dIWcXZeDH9f1gwbOblPrlw5X2AlQrHWC73mY-iYWxtzpMAyEjGgKE56NI5eAEVZKpHkbw3rRPswAJzMw'
  },
  {
    id: 2,
    title: 'Gala de Otoño "Colores de Tierra"',
    date: 'Octubre 2023',
    description: 'Lanzamiento de temporada y cata de flores.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC-MkQVdTGBsDPw1YdvnRZdnJfgEvJsNkitXPrmuOS-lFYn5iH2bGVOplDocPvNJ6D48pYRwt2V1H7oQbIZFtvHkCCjksuSII-JBoabmBGT7IxXoFwUC4O9YLhpX1nK8cJ-ZbPhJIS8w7TYLz_6ynhqJmxwsZw7ByfgpCMMZn2gWr845IDw6AmEE6YbhylrZEAWQy7Jsr1fhNR4KDW_XegEa5u2oRaY4H585viUaR5kzsVNFOJ4c1j0GJH05Qx780jJvoe2JhdxhnaU'
  }
];

export default function EventsPage() {
  return (
    <div className="bg-[#f0f7ff] min-h-screen pt-24 pb-12">
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-24">
        {/* Header Section */}
        <header className="text-center space-y-6 max-w-3xl mx-auto">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-serif font-bold tracking-tight text-slate-900"
          >
            Eventos & Fechas Especiales
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 leading-relaxed italic"
          >
            "Hay momentos que merecen ser recordados para siempre. En Florería Bautista, diseñamos la atmósfera perfecta para cada una de tus celebraciones."
          </motion.p>
          <div className="w-24 h-1 bg-[#1e3a8a] mx-auto mt-8"></div>
        </header>

        {/* Featured Event (Hero) */}
        <motion.section 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8 }}
          className="relative rounded-3xl overflow-hidden shadow-2xl group"
        >
          <div className="aspect-[21/9] w-full">
            <img 
              alt="Decoración San Valentín" 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuAw0Gmj9QFNPO3_FDqf2Yxa-mguHs73lmgTDNu3bO4hVuYS_9Fb3IptLuDYMEt3GCFYGppAM9CnZqq51H_g8lgw8J8heTwiZ90iY_snAFPcJQt5VfTIKxhYjaNZikKJoN_lg-r9A-0BSon3mNZnLqm14qnx3JRgiNJITANSiYwOENb6acVVCFo_OVgxxEzkVt3KBGvZM96pC62ZFMvHIqfznUW_5yhCfhcRrMLXbbqU9wwpKeI_qeJdCmW_ztOPl15l4rNSd91W9gXL"
            />
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent flex items-center p-8 md:p-16">
            <div className="max-w-xl text-white space-y-6">
              <span className="inline-block px-4 py-1 border border-white/40 bg-white/10 backdrop-blur-md rounded-full text-sm font-semibold tracking-widest uppercase">Próximo Evento</span>
              <h2 className="text-4xl md:text-6xl font-serif font-bold">San Valentín: El Arte del Romance</h2>
              <p className="text-lg text-white/90 leading-relaxed">
                Descubre nuestra colección exclusiva y talleres de arreglos personalizados para celebrar el amor en todas sus formas este 14 de Febrero.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <button className="bg-[#1e3a8a] hover:bg-[#3b82f6] text-white px-8 py-4 rounded-full font-semibold transition-all shadow-lg flex items-center">
                  Explorar Colección
                  <ArrowRight className="h-5 w-5 ml-2" />
                </button>
                <button className="bg-white/20 hover:bg-white/30 backdrop-blur-md text-white border border-white/50 px-8 py-4 rounded-full font-semibold transition-all">
                  Agendar Taller
                </button>
              </div>
            </div>
          </div>
        </motion.section>

        {/* Secondary Events Grid */}
        <section>
          <div className="flex items-end justify-between mb-12">
            <div className="space-y-2">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Próximos Encuentros y Talleres</h2>
              <p className="text-slate-500">Únete a nuestra comunidad creativa.</p>
            </div>
            <div className="hidden md:block">
              <button className="text-[#1e3a8a] font-semibold hover:underline flex items-center">
                Ver calendario completo
                <ArrowRight className="h-4 w-4 ml-1" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {/* Workshop Card 1 */}
            <motion.article 
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="aspect-[4/3] overflow-hidden">
                <img alt="Taller de Primavera" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={events[0].image} />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
                  <span>{events[0].type}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">{events[0].date}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold">{events[0].title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{events[0].description}</p>
                <button className="w-full py-3 border-2 border-[#1e3a8a] text-[#1e3a8a] font-bold rounded-lg hover:bg-[#1e3a8a] hover:text-white transition-colors">
                  Inscribirse
                </button>
              </div>
            </motion.article>

            {/* Workshop Card 2 (Large) */}
            <motion.article 
              whileHover={{ y: -8 }}
              className="bg-[#1e3a8a] text-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all lg:row-span-2 flex flex-col h-full"
            >
              <div className="flex-grow p-8 flex flex-col justify-center space-y-6">
                <Sparkles className="h-12 w-12 text-[#3b82f6]/60" />
                <h3 className="text-3xl font-serif font-bold">Día de las Madres: Suscripción VIP</h3>
                <p className="text-white/80 leading-relaxed">
                  Asegura el regalo perfecto con antelación. Suscríbete a nuestra preventa exclusiva y obtén un diseño floral personalizado único para mamá.
                </p>
                <ul className="space-y-3 text-sm text-white/90">
                  <li className="flex items-center"><Star className="w-4 h-4 text-[#3b82f6] mr-3" /> Envío prioritario garantizado</li>
                  <li className="flex items-center"><Star className="w-4 h-4 text-[#3b82f6] mr-3" /> Tarjeta caligrafiada a mano</li>
                  <li className="flex items-center"><Star className="w-4 h-4 text-[#3b82f6] mr-3" /> Flores premium de exportación</li>
                </ul>
                <button className="bg-white text-[#1e3a8a] w-full py-4 rounded-xl font-bold hover:bg-slate-100 transition-colors shadow-lg">
                  Pre-ordenar Ahora
                </button>
              </div>
              <div className="h-48">
                <img alt="Flores Premium" className="w-full h-full object-cover opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBoDG78UwdpnwrlFHo-hIRvDRr74u5BbguZzq1dBEUHwe2an1KXCNv3qCob0jlTpOeEfF_Ty8Vgeu_g3TkLxl8gpfi6dIEb5XYVKIS0hSy6mpoFSQEVUFCztzRB7-qSaXJhgtCsJC36WnzYdGufoMu1P1IziHxZyWy0kOb_z6n5yVP_JfZW6I53nxt-83nwAEOCQN4VpehQrRurXWOUe-2ONQtjBG-qvLcqrCWXXI8uxP5yKbST4jI3-_Y1imGQq7-MadyujvpC5OGo" />
              </div>
            </motion.article>

            {/* Workshop Card 3 */}
            <motion.article 
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-sm hover:shadow-xl transition-all group"
            >
              <div className="aspect-square overflow-hidden">
                <img alt="Boda de destino" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" src={events[1].image} />
              </div>
              <div className="p-6 space-y-4">
                <div className="flex justify-between items-center text-xs font-bold text-[#1e3a8a] uppercase tracking-wider">
                  <span>{events[1].type}</span>
                  <span className="bg-slate-100 px-2 py-1 rounded">{events[1].date}</span>
                </div>
                <h3 className="text-2xl font-serif font-bold">{events[1].title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{events[1].description}</p>
                <button className="w-full py-3 bg-slate-50 text-slate-800 font-bold rounded-lg hover:bg-slate-200 transition-colors">
                  Consultar Disponibilidad
                </button>
              </div>
            </motion.article>
          </div>
        </section>

        {/* Events Archive */}
        <section className="border-t border-slate-100 pt-20">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-serif font-bold text-slate-900">Memorias de Bautista</h2>
              <p className="text-slate-500 mt-2 italic text-sm">Un vistazo a nuestras celebraciones pasadas.</p>
            </div>
            <div className="space-y-4">
              {archiveItems.map((item) => (
                <motion.div 
                  key={item.id}
                  whileHover={{ x: 10 }}
                  className="flex items-center p-4 rounded-xl hover:bg-slate-50 transition-all group cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <div className="w-16 h-16 rounded-lg bg-slate-100 flex-shrink-0 overflow-hidden shadow-sm">
                    <img alt={item.title} className="w-full h-full object-cover" src={item.image} />
                  </div>
                  <div className="ml-6 flex-grow">
                    <h4 className="font-bold text-slate-800 group-hover:text-[#1e3a8a] transition-colors">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.date} • {item.description}</p>
                  </div>
                  <ArrowRight className="h-6 w-6 text-slate-300 group-hover:text-[#1e3a8a] transition-colors" />
                </motion.div>
              ))}
            </div>
            <div className="text-center mt-10">
              <button className="text-slate-400 text-sm font-medium hover:text-slate-600 transition-colors uppercase tracking-widest underline decoration-slate-200 underline-offset-8">
                Ver Archivo Completo
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
