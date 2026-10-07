'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const pathname = usePathname();

  // 1. Verificamos si estamos exactamente en la página de inicio
  const isHome = pathname === '/';

  // 2. Escuchamos el scroll de la pantalla
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    handleScroll(); // Revisamos la posición inicial al cargar
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Definimos cuándo el header debe ser transparente:
  // Solo en el inicio, solo si estamos arriba del todo, y con el menú móvil cerrado.
  const isTransparent = isHome && !isScrolled && !isMenuOpen;

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Sermones', href: '/sermones' },
    { name: 'El Evangelio', href: '/evangelio' },
  ];

  return (
    <header
      className={`fixed w-full z-50 transition-all duration-500 ${
        isTransparent
          ? 'bg-transparent border-transparent py-2'
          : 'bg-white/90 backdrop-blur-md border-b border-gray-100 py-0'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="flex items-center gap-2 hover:opacity-90 transition-opacity">
              <Image
                src="/logo-ibgv.png"
                alt="Logo Iglesia Bíblica Gracia Verdadera"
                width={200}
                height={80}
                className={`h-14 w-auto md:h-16 transition-all duration-300 ${
                  isTransparent
                    ? 'drop-shadow-[0_2px_8px_rgba(255,255,255,0.7)] brightness-110'
                    : ''
                }`}
                priority
              />
            </Link>
          </div>

          {/* Navegación Desktop */}
          <nav className="hidden md:flex space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={`font-medium transition-colors duration-200 ${
                  isTransparent
                    ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-[#DEA6AB]'
                    : 'text-ui-muted hover:text-brand-primary'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </nav>

          {/* Botón CTA Desktop */}
          <div className="hidden md:flex">
            <Link
              href="/visitanos"
              className={`px-5 py-2 rounded-sm font-medium transition-colors duration-200 shadow-md ${
                isTransparent
                  ? 'bg-brand-primary text-white border border-white/20 hover:bg-brand-secondary'
                  : 'bg-brand-primary text-white hover:bg-brand-secondary'
              }`}
            >
              Visítanos
            </Link>
          </div>

          {/* Botón Menú Móvil */}
          <div className="md:flex flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={`focus:outline-none transition-colors duration-200 ${
                isTransparent
                  ? 'text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)] hover:text-gray-300'
                  : 'text-ui-dark hover:text-brand-primary'
              }`}
            >
              <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
        <div className="md:hidden bg-white border-t border-gray-100 shadow-xl">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsMenuOpen(false)}
                className="block px-3 py-2 text-base font-medium text-ui-muted hover:text-brand-primary hover:bg-gray-50 rounded-md transition-colors"
              >
                {item.name}
              </Link>
            ))}
            {/* Botón CTA Móvil */}
            <Link
              href="/visitanos"
              onClick={() => setIsMenuOpen(false)}
              className="block px-3 py-2 mt-4 text-base font-medium text-white bg-brand-primary rounded-md text-center hover:bg-brand-secondary transition-colors"
            >
              Visítanos
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}