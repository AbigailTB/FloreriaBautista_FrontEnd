import React from 'react';

export default function AboutUs() {
  return (
    <section className="py-20 bg-brand-deep text-white" id="nosotros">
      <div className="container mx-auto px-4 flex flex-col md:flex-row items-center gap-12">
        <div className="md:w-1/2">
          <img alt="Nuestra Florería" className="rounded-custom shadow-2xl" src="https://lh3.googleusercontent.com/aida-public/AB6AXuDlE4KUeczw7vVazW7Qx4LA87lIUBbwBKmytz1qQxsm7Efw9aDslp6eywlqXcEjoGstoKwe7PgXB0KvRE3eBBmkcgDzjwyr3FQawYeGSo9qAYxTON18_nhIZCFjAyy9272xYws3qfn99ENlquV3aP75bLH8AEjIG0HMrRa5wkC1hFVJoogduLiYGHRdW6wLeb5f5HHEyIpm1J9mdyFCRR6IOAnGGzjjlYbTBdrpbkZiEJF0N67f9mnBQI5VBGdv35_nc6irtend-Bma" />
        </div>
        <div className="md:w-1/2">
          <h2 className="text-3xl font-bold mb-6">Tradición y Calidad Familiar</h2>
          <p className="text-lg text-brand-accent mb-6 leading-relaxed">
            En <strong>Florería Bautista</strong>, entendemos que cada arreglo cuenta una historia. Somos un negocio familiar con años de experiencia en la Huasteca Hidalguense, dedicados a ofrecer la mejor calidad floral.
          </p>
          <p className="text-lg text-brand-accent mb-8 leading-relaxed">
            Seleccionamos personalmente cada flor para asegurar que el mensaje que deseas enviar llegue con la máxima frescura y elegancia. No solo vendemos flores, entregamos emociones.
          </p>
          <div className="grid grid-cols-2 gap-6 border-t border-brand-accent/20 pt-8">
            <div>
              <span className="text-brand-coral text-3xl font-bold">100%</span>
              <p className="text-sm text-gray-300">Confianza Local</p>
            </div>
            <div>
              <span className="text-brand-coral text-3xl font-bold">+10k</span>
              <p className="text-sm text-gray-300">Entregas Exitosas</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
