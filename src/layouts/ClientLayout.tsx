import React from 'react';
import { NavbarCliente } from '../components/NavbarCliente';
import FooterCliente from '../components/FooterCliente';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-brand-light font-sans text-brand-deep overflow-x-hidden min-h-screen flex flex-col">
      <NavbarCliente />
      <div className="flex-grow pt-16">
        {children}
      </div>
      <FooterCliente />
    </div>
  );
}
