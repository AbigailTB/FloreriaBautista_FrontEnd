import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'motion/react';

export default function Shipping() {
  return (
    <section className="py-20 bg-brand-light" id="envios">
      <div className="container mx-auto px-4 text-center">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 30 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto bg-white p-10 rounded-custom shadow-sm border border-brand-accent"
        >
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-brand-accent text-brand-deep rounded-full flex items-center justify-center mb-4">
              <MapPin className="h-8 w-8" />
            </div>
            <h2 className="text-3xl font-bold">Envíos a Domicilio</h2>
          </div>
          <p className="text-lg text-gray-700 mb-8">
            Entregamos frescura y amor en todo <strong>Huitzitzilingo</strong> y <strong>San Felipe Orizatlán, Hidalgo</strong>. Servicio puntual y cuidadoso para que tus flores lleguen perfectas.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-brand-light p-4 rounded-custom border border-brand-accent">
              <h4 className="font-bold text-brand-deep">Huitzitzilingo (Centro y Barrios)</h4>
              <p className="text-sm">Envío gratis en pedidos mayores a $500</p>
            </div>
            <div className="bg-brand-light p-4 rounded-custom border border-brand-accent">
              <h4 className="font-bold text-brand-deep">San Felipe Orizatlán</h4>
              <p className="text-sm">Tarifa fija de $50 MXN</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
