import React from 'react';
import { motion } from 'motion/react';

export default function FAQ() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4 max-w-3xl">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold text-center mb-12"
        >
          Preguntas Frecuentes
        </motion.h2>
        <motion.div 
          className="space-y-4"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.details variants={itemVariants} className="group bg-brand-light p-6 rounded-custom cursor-pointer">
            <summary className="flex justify-between items-center font-bold text-brand-deep list-none">
              ¿Con cuánta anticipación debo hacer mi pedido?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="mt-4 text-gray-600">Recomendamos realizar pedidos de arreglos comunes con al menos 24 horas de anticipación. Para eventos grandes como bodas, sugerimos contactarnos con 1 mes de antelación.</p>
          </motion.details>
          <motion.details variants={itemVariants} className="group bg-brand-light p-6 rounded-custom cursor-pointer">
            <summary className="flex justify-between items-center font-bold text-brand-deep list-none">
              ¿Qué métodos de pago aceptan?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="mt-4 text-gray-600">Aceptamos efectivo directamente en tienda, transferencias bancarias y depósitos en OXXO. Para pedidos por WhatsApp, te proporcionaremos los datos de pago al momento.</p>
          </motion.details>
          <motion.details variants={itemVariants} className="group bg-brand-light p-6 rounded-custom cursor-pointer">
            <summary className="flex justify-between items-center font-bold text-brand-deep list-none">
              ¿Puedo personalizar mi arreglo?
              <span className="group-open:rotate-180 transition-transform">↓</span>
            </summary>
            <p className="mt-4 text-gray-600">¡Por supuesto! Puedes elegir el tipo de flores, colores y el tipo de base o envoltorio. Solo menciónalo al realizar tu pedido por WhatsApp.</p>
          </motion.details>
        </motion.div>
      </div>
    </section>
  );
}
