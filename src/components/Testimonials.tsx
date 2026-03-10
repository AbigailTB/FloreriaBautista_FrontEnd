import React from 'react';
import { motion } from 'motion/react';
import testimonialsData from '../data/testimonials.json';

export default function Testimonials() {
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
  };

  // Only show the first 3 testimonials on the home page
  const displayTestimonials = testimonialsData.slice(0, 3);

  return (
    <section className="py-20 bg-white" id="opiniones">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-3xl md:text-5xl font-bold text-center mb-16"
        >
          Lo que dicen nuestros clientes
        </motion.h2>
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {displayTestimonials.map((testimonial) => (
            <motion.div key={testimonial.id} variants={itemVariants} className="p-8 bg-brand-light rounded-custom border border-transparent hover:border-brand-coral transition-colors">
              <div className="flex text-brand-coral mb-4">
                <span>{'★'.repeat(testimonial.rating)}</span>
              </div>
              <p className="italic text-gray-700 mb-6">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-brand-deep rounded-full flex items-center justify-center text-white font-bold">{testimonial.initials}</div>
                <div>
                  <p className="font-bold">{testimonial.author}</p>
                  <p className="text-xs text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
