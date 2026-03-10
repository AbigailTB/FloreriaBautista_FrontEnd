import React from 'react';
import { motion } from 'motion/react';

export default function HowItWorks() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  return (
    <section className="py-20 bg-brand-accent/30" id="como-funciona">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="text-center mb-16"
          variants={itemVariants}
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Cómo funciona</h2>
          <p className="text-gray-600">Tu pedido listo en 3 sencillos pasos.</p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div className="flex flex-col items-center" variants={itemVariants}>
            <div className="w-16 h-16 bg-brand-deep text-white rounded-full flex items-center justify-center mb-6 text-2xl font-bold">1</div>
            <h3 className="text-xl font-bold mb-3">Elige tu arreglo</h3>
            <p className="text-gray-600">Selecciona una categoría y un diseño que te encante.</p>
          </motion.div>
          <motion.div className="flex flex-col items-center" variants={itemVariants}>
            <div className="w-16 h-16 bg-brand-deep text-white rounded-full flex items-center justify-center mb-6 text-2xl font-bold">2</div>
            <h3 className="text-xl font-bold mb-3">Personaliza y paga</h3>
            <p className="text-gray-600">Agrega una dedicatoria, elige la fecha y realiza el pago en línea de forma segura.</p>
          </motion.div>
          <motion.div className="flex flex-col items-center" variants={itemVariants}>
            <div className="w-16 h-16 bg-brand-deep text-white rounded-full flex items-center justify-center mb-6 text-2xl font-bold">3</div>
            <h3 className="text-xl font-bold mb-3">Recibe tu entrega</h3>
            <p className="text-gray-600">Entregamos a domicilio en Huautla y zonas cercanas con el mayor cuidado.</p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
