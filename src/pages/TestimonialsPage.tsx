import React from 'react';
import { Star } from 'lucide-react';
import testimonialsData from '../data/testimonials.json';

export default function TestimonialsPage() {
  return (
    <main className="pt-24 min-h-screen bg-slate-50">
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl md:text-5xl text-brand-deep mb-4 tracking-wide">Testimonios de clientes</h2>
            <div className="w-24 h-1 bg-[#D4AF37] mx-auto mb-6"></div>
            <p className="text-slate-600 font-medium text-lg">
              Nuestra comunidad: <span className="text-brand-deep font-bold">+500 clientes felices</span>
            </p>
          </div>

          {/* Testimonial Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {testimonialsData.map((testimonial) => (
              <div 
                key={testimonial.id} 
                className="bg-white p-8 rounded-xl border border-slate-100 flex flex-col justify-between transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <div>
                  <div className="flex text-[#D4AF37] mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 fill-current" />
                    ))}
                  </div>
                  <p className="italic text-slate-700 leading-relaxed mb-6">"{testimonial.text}"</p>
                </div>
                <div className="flex justify-between items-center pt-6 border-t border-slate-50">
                  <span className="font-semibold text-brand-deep">{testimonial.author}</span>
                  <span className="text-xs text-slate-400">{testimonial.date}</span>
                </div>
              </div>
            ))}
          </div>

          {/* Section Footer Action */}
          <div className="text-center">
            <button className="inline-block border-2 border-brand-deep text-brand-deep hover:bg-brand-deep hover:text-white px-10 py-4 rounded-xl font-semibold transition-all duration-300">
              Explorar más reseñas
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
