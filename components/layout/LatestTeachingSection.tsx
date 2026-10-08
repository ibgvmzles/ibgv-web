'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { YouTubeVideo } from '@/lib/youtube';

// ID de Spotify para Estudios Bíblicos (Tomado de tu enlace)
const SPOTIFY_ESTUDIO_ID = '033I8k275SDuLONqsAOVdA';

// ⚠️ REEMPLAZA ESTE ID por el de tu enlace de Spotify de "Servicios Dominicales"
const SPOTIFY_DOMINICAL_ID = '033IdVSAbnqSwkXTDYbZ2i';

interface Props {
  sermonDominical: YouTubeVideo | null;
  estudioBiblico: YouTubeVideo | null;
}

export default function LatestTeachingSection({ sermonDominical, estudioBiblico }: Props) {
  const [activeTab, setActiveTab] = useState<'dominical' | 'estudio'>('dominical');
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Deslizamiento automático cada 6 segundos (se pausa apenas el usuario toca la sección)
  useEffect(() => {
    if (!isAutoPlaying) return;

    const timer = setInterval(() => {
      setActiveTab((prev) => (prev === 'dominical' ? 'estudio' : 'dominical'));
    }, 6000);

    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const handleSelectTab = (tab: 'dominical' | 'estudio') => {
    setActiveTab(tab);
    setIsAutoPlaying(false);
  };

  // Video activo según la pestaña seleccionada
  const videoActivo = activeTab === 'dominical' ? sermonDominical : (estudioBiblico || sermonDominical);

  return (
    <section
      className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-primary text-white"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onTouchStart={() => setIsAutoPlaying(false)}
    >
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

        {/* Columna Izquierda: Textos, Selector, Spotify y Botón */}
        <div className="space-y-6">
          <span className="text-brand-light font-medium tracking-wider uppercase text-sm">
            Última Enseñanza
          </span>
          <h2 className="text-3xl md:text-5xl font-manofa leading-tight">
            Alimentándonos de la Palabra
          </h2>
          <p className="text-brand-light text-lg max-w-md pb-1">
            Acompáñanos en nuestro estudio expositivo. Puedes ver las grabaciones en video o escuchar el audio mientras te desplazas por la ciudad.
          </p>

          {/* Selector Sincronizado (Cambia Spotify y YouTube a la vez) */}
          <div className="max-w-md">
            <div className="grid grid-cols-2 gap-2 bg-black/25 p-1.5 rounded-sm border border-brand-secondary">
              <button
                type="button"
                onClick={() => handleSelectTab('dominical')}
                className={`py-2.5 px-3 rounded-sm text-sm sm:text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === 'dominical'
                    ? 'bg-white text-brand-primary shadow-md'
                    : 'text-brand-light hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeTab === 'dominical' ? 'bg-brand-primary' : 'bg-white/40'}`} />
                Servicio Dominical
              </button>

              <button
                type="button"
                onClick={() => handleSelectTab('estudio')}
                className={`py-2.5 px-3 rounded-sm text-sm sm:text-base font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                  activeTab === 'estudio'
                    ? 'bg-white text-brand-primary shadow-md'
                    : 'text-brand-light hover:text-white hover:bg-white/5'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${activeTab === 'estudio' ? 'bg-brand-primary' : 'bg-white/40'}`} />
                Estudio Bíblico
              </button>
            </div>
          </div>

          {/* Reproductor Incrustado de Spotify (Súper Liviano) */}
          <div className="max-w-md bg-brand-secondary/30 p-4 rounded-sm border border-brand-secondary">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-xs font-bold text-brand-light uppercase tracking-wider">
                Escucha el Podcast ({activeTab === 'dominical' ? 'Servicio Dominical' : 'Estudio Bíblico'}):
              </h3>
              {/* Indicadores de carrusel */}
              <div className="flex items-center gap-1.5">
                <span className={`h-1.5 rounded-full transition-all duration-300 ${activeTab === 'dominical' ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
                <span className={`h-1.5 rounded-full transition-all duration-300 ${activeTab === 'estudio' ? 'w-5 bg-white' : 'w-1.5 bg-white/40'}`} />
              </div>
            </div>

            {/* Podcast 1: Servicios Dominicales */}
            <div className={activeTab === 'dominical' ? 'block' : 'hidden'}>
              <iframe
                src={`https://open.spotify.com/embed/show/${SPOTIFY_DOMINICAL_ID}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-sm shadow-lg"
              ></iframe>
            </div>

            {/* Podcast 2: Estudios Bíblicos */}
            <div className={activeTab === 'estudio' ? 'block' : 'hidden'}>
              <iframe
                src={`https://open.spotify.com/embed/show/${SPOTIFY_ESTUDIO_ID}?utm_source=generator&theme=0`}
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-sm shadow-lg"
              ></iframe>
            </div>
          </div>

          <div className="pt-2">
            <Link href="/sermones" className="inline-flex items-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-sm font-medium hover:bg-gray-100 transition-colors">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.996,15.005l0-6.01L15.224,12L9.996,15.005z"/></svg>
              Ver todos los sermones
            </Link>
          </div>
        </div>

        {/* Columna Derecha: Tarjeta Visual de Video desde YouTube */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-brand-light uppercase tracking-wider">
              Último video en YouTube ({activeTab === 'dominical' ? 'Servicio Dominical' : 'Estudio Bíblico'}):
            </h3>
          </div>

          {videoActivo ? (
            <a
              key={videoActivo.id}
              href={`https://www.youtube.com/watch?v=${videoActivo.id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-video bg-ui-dark rounded-sm overflow-hidden shadow-2xl flex items-center justify-center group cursor-pointer border border-brand-secondary block"
            >
              {/* Miniatura extraída de YouTube */}
              <img
                src={videoActivo.thumbnail}
                alt={videoActivo.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
              />

              <div className="absolute inset-0 bg-black/30 group-hover:bg-transparent transition-colors duration-300"></div>

              <div className="z-10 bg-brand-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
              </div>

              {/* Título superpuesto con gradiente */}
              <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black/90 to-transparent z-10 text-left">
                <p className="text-white font-medium text-lg leading-tight line-clamp-2 shadow-sm">
                  {videoActivo.title}
                </p>
                <p className="text-gray-300 text-sm mt-1">{videoActivo.date}</p>
              </div>
            </a>
          ) : (
            <div className="relative aspect-video bg-brand-secondary/50 rounded-sm overflow-hidden shadow-2xl flex flex-col items-center justify-center border border-brand-secondary text-brand-light">
              <svg className="w-10 h-10 mb-2 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
              <p>Cargando último sermón...</p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}