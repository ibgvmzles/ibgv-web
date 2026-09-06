'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Sermones', href: '/sermones' },
    { name: 'Actividades', href: '/actividades' },
  ];

  return (
    <header className="fixed w-full bg-white/90 backdrop-blur-md z-50 border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2">
              {/* Aquí luego reemplazaremos esto por la etiqueta <img src="/logo.svg" /> */}
              <div className="w-10 h-10 bg-brand-primary text-white flex items-center justify-center font-manofa text-xl rounded-sm">
                IBGV
              </div>
              <span className="font-manofa text-brand-primary text-xl hidden sm:block leading-tight">
                IGLESIA BÍBLICA<br/>GRACIA VERDADERA
              </span>
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-ui-muted hover:text-brand-primary font-medium transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Botón CTA Desktop */}
          <div className="hidden md:flex">
            <Link
              href="/contacto"
              className="px-5 py-2 rounded-sm bg-brand-primary text-white font-medium hover:bg-brand-secondary transition-colors duration-200"
            >
              Visítanos
            </Link>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-ui-dark hover:text-brand-primary focus:outline-none"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Menú Móvil Desplegable */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-100">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-ui-muted hover:text-brand-primary hover:bg-gray-50 rounded-md"
              >
                {item.name}
              </Link>
            ))}
            <Link
              href="/contacto"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 mt-4 text-base font-medium text-white bg-brand-primary rounded-md text-center"
            >
              Visítanos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}