import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, MessageCircle, MapPin, Phone, Mail } from 'lucide-react';

export default function FooterCliente() {
  return (
    <footer className="bg-[#1A3A5A] text-white pt-16 pb-0">
      <div className="container mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Column 1: Logo & Social */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <img src="/Logo.png" alt="Florería Bautista Logo" className="h-12 w-auto" />
              <span className="text-2xl font-serif font-bold tracking-tight">Florería <span className="text-[#D4AF37]">Bautista</span></span>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-8 max-w-xs">
              Gracias por ser parte de nuestra familia.
            </p>
            <div className="flex gap-4">
              <a className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-[#D4AF37] transition-colors" href="#">
                <Facebook className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-[#D4AF37] transition-colors" href="#">
                <Instagram className="w-5 h-5" />
              </a>
              <a className="w-10 h-10 rounded-full bg-slate-700/50 flex items-center justify-center hover:bg-[#D4AF37] transition-colors" href="#">
                <MessageCircle className="w-5 h-5" />
              </a>
            </div>
          </div>
          {/* Column 2: Enlaces */}
          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm tracking-widest mb-8 uppercase">Mi Cuenta</h4>
            <ul className="space-y-4">
              <li><Link className="text-gray-300 hover:text-white transition-colors" to="/">Inicio</Link></li>
              <li><Link className="text-gray-300 hover:text-white transition-colors" to="/pedidos">Mis Pedidos</Link></li>
              <li><Link className="text-gray-300 hover:text-white transition-colors" to="/perfil">Mi Perfil</Link></li>
            </ul>
          </div>
          {/* Column 3: Contacto */}
          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm tracking-widest mb-8 uppercase">Contacto</h4>
            <ul className="space-y-6">
              <li className="flex items-start gap-4">
                <MapPin className="text-red-500 text-xl shrink-0" />
                <span className="text-gray-300 text-sm leading-snug">Av. Principal S/N, Centro, Huitzitzilingo, Hidalgo.</span>
              </li>
              <li className="flex items-center gap-4">
                <Phone className="text-gray-400 text-xl shrink-0" />
                <span className="text-gray-300 text-sm">+52 (771) 000 0000</span>
              </li>
              <li className="flex items-center gap-4">
                <Mail className="text-blue-300 text-xl shrink-0" />
                <span className="text-gray-300 text-sm">hola@floreriabautista.com</span>
              </li>
            </ul>
          </div>
          {/* Column 4: Horarios */}
          <div>
            <h4 className="text-[#D4AF37] font-bold text-sm tracking-widest mb-8 uppercase">Horarios</h4>
            <ul className="space-y-4">
              <li className="text-gray-300 text-sm">Lunes - Viernes: 8:00 - 20:00</li>
              <li className="text-gray-300 text-sm">Sábados: 9:00 - 18:00</li>
              <li className="text-gray-300 text-sm">Domingos: 9:00 - 14:00</li>
            </ul>
          </div>
        </div>
      </div>
      {/* Bottom Bar */}
      <div className="bg-[#132c45] py-8">
        <div className="container mx-auto px-4">
          <p className="text-center text-gray-400 text-sm tracking-wide">
            © 2023 Florería Bautista. Todos los derechos reservados. San Felipe Orizatlán, Hidalgo.
          </p>
        </div>
      </div>
    </footer>
  );
}
