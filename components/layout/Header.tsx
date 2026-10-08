'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const pathname = usePathname();

  // 1. Identificamos en qué página estamos
  const isHome = pathname === '/';
  const isLectura = pathname?.startsWith('/lectura');

  // 2. Escuchamos el scroll para detectar si el usuario baja o sube el dedo
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determina si ya bajamos del tope (para cambiar el header en el Inicio)
      setIsScrolled(currentScrollY > 20);

      // Lógica exclusiva para ocultar al bajar y mostrar al subir un poquito:
      if (currentScrollY < 40) {
        // Si está arriba del todo, siempre visible
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current + 8) {
        // Si desliza hacia abajo -> Ocultamos el header
        setIsVisible(false);
      } else if (currentScrollY < lastScrollY.current - 5) {
        // Si desliza un poquito hacia arriba -> Mostramos el header de inmediato
        setIsVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // 3. Reglas visuales:
  // - Transparente ÚNICAMENTE en la página principal (/) cuando está arriba del todo.
  // - En /lectura y las demás páginas siempre tiene su fondo blanco sólido para no cruzarse con las letras.
  const isHomeTransparent = isHome && !isScrolled && !isMenuOpen;

  // - En /lectura se esconde al bajar y reaparece al subir (salvo que el menú móvil esté abierto).
  const hideHeader = isLectura && !isVisible && !isMenuOpen;

  const navigation = [
    { name: 'Inicio', href: '/' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Sermones', href: '/sermones' },
    { name: 'El Evangelio', href: '/evangelio' },
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${
          hideHeader
            ? '-translate-y-full opacity-0 pointer-events-none'
            : 'translate-y-0 opacity-100'
        } ${
          isHomeTransparent
            ? 'bg-transparent border-transparent py-2'
            : 'bg-white/95 backdrop-blur-md border-b border-gray-100 py-0 shadow-xs'
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
                    isHomeTransparent
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
                    isHomeTransparent
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
                  isHomeTransparent
                    ? 'bg-brand-primary text-white border border-white/20 hover:bg-brand-secondary'
                    : 'bg-brand-primary text-white hover:bg-brand-secondary'
                }`}
              >
                Visítanos
              </Link>
            </div>

            {/* Botón Menú Móvil */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className={`focus:outline-none transition-colors duration-200 ${
                  isHomeTransparent
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

      {/* Espaciador automático para /lectura: evita que el logo tape el botón "Volver al Inicio" */}
      {isLectura && <div className="h-16 bg-transparent" />}
    </>
  );
}