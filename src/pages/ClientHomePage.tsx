import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../hooks/useCart';
import { motion } from 'framer-motion';
import { Lock } from 'lucide-react';

export default function ClientHomePage({ user }: { user?: any }) {
  const userName = user?.name || 'Carlos';
  const { addToCart } = useCart();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  return (
    <main className="max-w-7xl mx-auto pt-24 pb-20">
      <section className="p-4 lg:p-10">
        <div className="relative min-h-[400px] rounded-3xl overflow-hidden flex items-center justify-start p-6 lg:p-12">
          <div 
            className="absolute inset-0 bg-cover bg-center" 
            style={{
              backgroundImage: `linear-gradient(to right, rgba(26, 59, 91, 0.8) 0%, rgba(26, 59, 91, 0.2) 60%, rgba(26, 59, 91, 0) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuDiqKa-pG2AUir0S_KPqT0wNmI1l7oWuYZHREe1DXshdkDbD3P_UUdpai_hEtg8c0AcHQzBhXp-FXiectMMB6_zq6rNl-9SC_ji0wUyuZC_Y_biJz5CI-Y4rbjYCGMHXqs9PDdi1vJBULg6KR0q6Uf46uUwn3xLuf3YtFAqiaJ4bbmLf-aXcpomLsJEufuPU5Vqct64J1qg-5Jw4OzYiixOw5l5r09HJ9GHjpSFetP-fpaZSrvVLtK4jI6nfrOTuVzzqXZ9-Obk75yj')`
            }}
          >
          </div>
          <div className="relative z-10 max-w-xl text-white">
            <span className="inline-block px-3 py-1 bg-yellow-400 text-brand-deep text-xs font-bold rounded-full mb-4">
              BIENVENIDO DE VUELTA
            </span>
            <h1 className="text-3xl lg:text-5xl font-black mb-4 leading-tight">
              Tu próximo detalle inolvidable te espera, {userName}
            </h1>
            <p className="text-base lg:text-lg text-white/90 mb-6 leading-relaxed">
              Flores frescas seleccionadas a mano para transformar cualquier momento en un recuerdo eterno. Descubre nuestra colección de temporada.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/catalogo" className="px-6 py-3 bg-brand-deep text-white font-bold rounded-xl hover:bg-brand-deep/90 transition-all shadow-lg">
                Ver catálogo
              </Link>
              <button className="px-6 py-3 bg-white/10 backdrop-blur-md text-white font-bold rounded-xl hover:bg-white/20 transition-all">
                Personalizar ramo
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 lg:px-10 py-10">
        <h2 className="text-2xl font-bold mb-8 flex items-center gap-2">
          <span className="material-symbols-outlined text-brand-deep dark:text-white">auto_awesome_motion</span> Accesos Directos
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link to="/pedidos" className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer block">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 filter blur-[2px]" 
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCawVT-5B_e0L-ouIC8qN1I4mCP8bdbedGw7cKEu8AhzGMRGHciGyxxcI2PAyKo5kNzwYsB85lW8gJeRgOqR1f8VROGvlqpW9YWQE1FK064J4dw9Yq4YWazpuL49sUXRG_MiRu8Nc5qarLEdWo1-U3BdWt9loEulnXw9vIquy0XGITKMILW7pwdKomvhA6l3HgyIxvsCpZTn0wAYgUlyf8jE9pQHITdhyIusiIfPShPSZ0CKIdDJjEAL8QZvfb6fFdUpsyi1tKY-qDk')`
              }}
            >
            </div>
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <span className="material-symbols-outlined text-yellow-400 mb-2">package_2</span>
              <h3 className="text-2xl font-bold">Historial de pedidos</h3>
              <p className="text-white/70 text-sm">Revisa el estado de tus entregas y pedidos pasados</p>
            </div>
          </Link>
          
          <Link to="/direcciones" className="group relative h-48 rounded-2xl overflow-hidden cursor-pointer block">
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110 filter blur-[2px]" 
              style={{
                backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.7)), url('https://lh3.googleusercontent.com/aida-public/AB6AXuD5SdB5oVCRnajVoX1GjQW73VFK1mXNxnXdkfuByUxnA5eZvySHmcNPiTD1dOXTmX824nJkMkYs1rFfpwqW3AlKXcmXmX6SHw75lxZRLCtSvtfuRhI79252NpqYIm1k-7_eGOjKJFfz5IvRd7NYK0nMTYqRB923Qw3tQK7V80NZ8w_9482fCXUhy7zUoomARrUWyA6xDmK9YBBQKnYAUigaTQJLh0OsO_YJXv3VMGrx1XQahGchsKv4pMELC69NwJ-XFFEGBd30usvi')`
              }}
            >
            </div>
            <div className="relative h-full flex flex-col justify-end p-8 text-white">
              <span className="material-symbols-outlined text-yellow-400 mb-2">location_on</span>
              <h3 className="text-2xl font-bold">Gestión de direcciones</h3>
              <p className="text-white/70 text-sm">Administra tus lugares de entrega frecuentes</p>
            </div>
          </Link>
        </div>
      </section>

      <section className="px-4 lg:px-10 py-10">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <span className="material-symbols-outlined text-brand-deep dark:text-white">eco</span> Novedades de temporada
          </h2>
          <Link to="/catalogo" className="text-brand-deep dark:text-white font-bold text-sm flex items-center gap-1 hover:underline">
            Ver todas <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Product 1 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
            <div className="relative h-72 overflow-hidden">
              <div className="absolute top-4 right-4 z-10">
                <button className="bg-white/90 p-2 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                  <span className="material-symbols-outlined">favorite</span>
                </button>
              </div>
              <img 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt="Vibrant spring bouquet with tulips and lilies" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCuJRj-eKLvW5rq6oR6TuNxGrlar4ppFGyUu1ON5MGuNZCeHhxwumbxBRxa2bQwZzEnApQrRCk-o5W2rHZvzn18TYg2LF8slSqb352y7Psw-5-LAiw1Wd283iuaf0m24zYGVUClj3vEfuC32MutzUC1VwzpfFNJzFegJHgcB6lgQiuzdsRCG8INX6qZ-Agbp1-Nequ2rVYWNkLTxvyT0gczgSl-nWsy9H326JtCM5SF2IePhg3cUG7QRzjThGVuvK72p1IGhD2DDQQt"
              />
              <div className="absolute bottom-0 left-0 bg-yellow-400 text-brand-deep px-4 py-1 font-bold text-xs">NOVEDAD</div>
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">Amanecer Primaveral</h4>
                <span className="text-brand-deep dark:text-white font-bold">$45.00</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Mix de tulipanes, lirios y follaje verde intenso.</p>
              <button 
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-brand-deep dark:text-white font-bold rounded-xl group-hover:bg-brand-deep group-hover:text-white dark:group-hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  if (user) {
                    addToCart({ id: 'nov-1', name: 'Amanecer Primaveral', price: 45, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCuJRj-eKLvW5rq6oR6TuNxGrlar4ppFGyUu1ON5MGuNZCeHhxwumbxBRxa2bQwZzEnApQrRCk-o5W2rHZvzn18TYg2LF8slSqb352y7Psw-5-LAiw1Wd283iuaf0m24zYGVUClj3vEfuC32MutzUC1VwzpfFNJzFegJHgcB6lgQiuzdsRCG8INX6qZ-Agbp1-Nequ2rVYWNkLTxvyT0gczgSl-nWsy9H326JtCM5SF2IePhg3cUG7QRzjThGVuvK72p1IGhD2DDQQt' });
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span> Añadir al carrito
              </button>
            </div>
          </div>

          {/* Product 2 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
            <div className="relative h-72 overflow-hidden">
              <img 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt="Classic red rose bouquet in elegant wrapping" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAy8yMEBwvCMwBWcpEeP4pLJ_QKbgx5rda_S5cA3zyzkaui1FjmNz-Z2y3qBYRxB9bO1NuvgD0Va3Bt__Y46df5fCz4eGuVeGrOdIWa3CQftiCM0hKSdOSMvPKzU7wfcXAXzbzOBknNFk_sX2mx36lH3Prd-PHJd7e4ACHDidI0_NoKA6cC1KsH56BRFwX7_TtQbJ-oORKM6kRycx-uVGhi3T6cgsiPnK_MAOseXpxAEVxGbBjdM2GOidhE3OT_HswHKOkBHOvd0Bht"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">Elegancia Carmesí</h4>
                <span className="text-brand-deep dark:text-white font-bold">$62.00</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">12 Rosas rojas premium con tallo largo.</p>
              <button 
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-brand-deep dark:text-white font-bold rounded-xl group-hover:bg-brand-deep group-hover:text-white dark:group-hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  if (user) {
                    addToCart({ id: 'nov-2', name: 'Elegancia Carmesí', price: 62, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAy8yMEBwvCMwBWcpEeP4pLJ_QKbgx5rda_S5cA3zyzkaui1FjmNz-Z2y3qBYRxB9bO1NuvgD0Va3Bt__Y46df5fCz4eGuVeGrOdIWa3CQftiCM0hKSdOSMvPKzU7wfcXAXzbzOBknNFk_sX2mx36lH3Prd-PHJd7e4ACHDidI0_NoKA6cC1KsH56BRFwX7_TtQbJ-oORKM6kRycx-uVGhi3T6cgsiPnK_MAOseXpxAEVxGbBjdM2GOidhE3OT_HswHKOkBHOvd0Bht' });
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span> Añadir al carrito
              </button>
            </div>
          </div>

          {/* Product 3 */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl overflow-hidden shadow-sm border border-slate-100 dark:border-slate-700 hover:shadow-xl transition-all group">
            <div className="relative h-72 overflow-hidden">
              <img 
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                alt="Minimalist sunflower and daisy arrangement" 
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuA-AYO9Mm4EgzL_xvSOa9Z5ktrYsFSKBLTMYzVM97F-zFTOnOsy2NbHlMryIkcuQFzekrk78Fss50kA-vD19WIcltw38Byxhvs-HyfqHgD9Fs2MuEUuV8RqYEhcNwb4vLWSwww397EY0WrNmn90wnYMTY94qTZKha__G0Sp7EyWGZYIt3IUK94CKxpRY55RD6gxojI1VLJQm8OyvUYakTZYMx5KbKeypDFkUAj5FRMfxXEyxiCVVkqbMADIwAGfbHy1WWQTR0TTRxsa"
              />
            </div>
            <div className="p-6">
              <div className="flex justify-between items-start mb-2">
                <h4 className="font-bold text-lg">Rayo de Sol</h4>
                <span className="text-brand-deep dark:text-white font-bold">$38.00</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">Girasoles brillantes acompañados de margaritas blancas.</p>
              <button 
                className="w-full py-3 bg-slate-100 dark:bg-slate-700 text-brand-deep dark:text-white font-bold rounded-xl group-hover:bg-brand-deep group-hover:text-white dark:group-hover:bg-slate-600 transition-all flex items-center justify-center gap-2"
                onClick={() => {
                  if (user) {
                    addToCart({ id: 'nov-3', name: 'Rayo de Sol', price: 38, image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA-AYO9Mm4EgzL_xvSOa9Z5ktrYsFSKBLTMYzVM97F-zFTOnOsy2NbHlMryIkcuQFzekrk78Fss50kA-vD19WIcltw38Byxhvs-HyfqHgD9Fs2MuEUuV8RqYEhcNwb4vLWSwww397EY0WrNmn90wnYMTY94qTZKha__G0Sp7EyWGZYIt3IUK94CKxpRY55RD6gxojI1VLJQm8OyvUYakTZYMx5KbKeypDFkUAj5FRMfxXEyxiCVVkqbMADIwAGfbHy1WWQTR0TTRxsa' });
                  } else {
                    setIsLoginModalOpen(true);
                  }
                }}
              >
                <span className="material-symbols-outlined text-sm">add_shopping_cart</span> Añadir al carrito
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Login Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" 
            onClick={() => setIsLoginModalOpen(false)}
          ></motion.div>
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-2xl max-w-sm w-full text-center"
          >
            <div className="w-16 h-16 bg-slate-100 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <Lock className="w-8 h-8 text-[#1A3A5A] dark:text-white" />
            </div>
            <h3 className="text-2xl font-bold text-[#1A3A5A] dark:text-white mb-2">¡Inicia sesión para continuar!</h3>
            <p className="text-slate-500 dark:text-slate-400 mb-8">Para añadir productos a tu pedido necesitas tener una cuenta activa.</p>
            <div className="flex flex-col gap-3">
              <Link to="/login" className="w-full bg-[#1A3A5A] text-white py-3.5 rounded-2xl font-bold hover:shadow-lg transition-all">Iniciar sesión</Link>
              <Link to="/registro" className="w-full border-2 border-[#1A3A5A] text-[#1A3A5A] dark:border-white dark:text-white py-3.5 rounded-2xl font-bold hover:bg-slate-50 dark:hover:bg-slate-700 transition-all">Registrarme</Link>
            </div>
            <button 
              className="mt-6 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-sm font-medium transition-colors"
              onClick={() => setIsLoginModalOpen(false)}
            >
              Tal vez luego
            </button>
          </motion.div>
        </div>
      )}
    </main>
  );
}
