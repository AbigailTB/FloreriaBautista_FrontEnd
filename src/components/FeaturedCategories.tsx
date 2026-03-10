import React from 'react';
import { motion } from 'motion/react';
import categoriesData from '../data/categories.json';

export default function FeaturedCategories() {
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <section className="py-20 bg-white" id="arreglos">
      <div className="container mx-auto px-4">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={itemVariants}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Categorías destacadas</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">Encuentra el detalle ideal para cada ocasión.</p>
        </motion.div>
        <motion.div 
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {categoriesData.map((category) => (
            <motion.div key={category.id} variants={itemVariants} className="bg-brand-light rounded-custom overflow-hidden shadow-sm hover:shadow-md transition-all group text-center p-4">
              <img alt={category.title} className="w-full h-48 object-cover rounded-custom mb-4" src={category.image} />
              <h3 className="font-bold mb-2">{category.title}</h3>
              <p className="text-xs text-gray-500 mb-4">{category.description}</p>
              <a className="inline-block bg-brand-deep text-white px-4 py-2 rounded-custom text-sm font-semibold" href={category.link}>Ver arreglos</a>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
