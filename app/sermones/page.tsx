'use client';

import { useState } from 'react';

// Simulamos los datos que luego vendrán de YouTube / Base de datos
const MOCK_SERMONES = [
  {
    id: '1',
    title: 'Justificados por la fe',
    series: 'Romanos',
    preacher: 'Pastor Principal',
    date: '30 Ago 2026',
    duration: '45:20',
    type: 'video',
    thumbnail: 'bg-gray-800' // Aquí irá la URL de la imagen de YouTube
  },
  {
    id: '2',
    title: 'El problema del corazón humano',
    series: 'Romanos',
    preacher: 'Pastor Principal',
    date: '23 Ago 2026',
    duration: '48:15',
    type: 'video',
    thumbnail: 'bg-gray-700'
  },
  {
    id: '3',
    title: 'La evidencia del Espíritu',
    series: 'Gálatas',
    preacher: 'Pastor Invitado',
    date: '16 Ago 2026',
    duration: '42:10',
    type: 'audio',
    thumbnail: 'bg-brand-primary' // Usamos el color de marca para audios
  },
  {
    id: '4',
    title: 'No hay justo, ni aun uno',
    series: 'Romanos',
    preacher: 'Pastor Principal',
    date: '09 Ago 2026',
    duration: '50:05',
    type: 'video',
    thumbnail: 'bg-gray-800'
  }
];

// Extraemos las series únicas para crear los botones de filtro
const SERIES = ['Todos', ...Array.from(new Set(MOCK_SERMONES.map(s => s.series)))];

export default function SermonesPage() {
  const [activeFilter, setActiveFilter] = useState('Todos');
  const [searchQuery, setSearchQuery] = useState('');

  // Lógica dinámica para filtrar los sermones
  const filteredSermones = MOCK_SERMONES.filter((sermon) => {
    const matchesFilter = activeFilter === 'Todos' || sermon.series === activeFilter;
    const matchesSearch = sermon.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          sermon.preacher.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <main className="min-h-screen bg-ui-bg pt-20">

      {/* Hero de Sermones */}
      <section className="bg-brand-primary text-white py-16 px-4 sm:px-6 lg:px-8 text-center border-b-4 border-brand-secondary">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-manofa mb-4 uppercase">Biblioteca de Sermones</h1>
          <p className="text-brand-light text-lg md:text-xl">
            Exploración expositiva de las Escrituras versículo a versículo.
          </p>
        </div>
      </section>

      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">

        {/* Barra de Filtros y Búsqueda */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-6 mb-12 bg-white p-4 rounded-sm shadow-sm border border-gray-100">

          {/* Botones de Categorías */}
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            {SERIES.map((serie) => (
              <button
                key={serie}
                onClick={() => setActiveFilter(serie)}
                className={`px-4 py-2 text-sm font-medium rounded-sm transition-colors ${
                  activeFilter === serie
                    ? 'bg-brand-primary text-white'
                    : 'bg-gray-100 text-ui-muted hover:bg-gray-200'
                }`}
              >
                {serie}
              </button>
            ))}
          </div>

          {/* Buscador de texto */}
          <div className="w-full md:w-72 relative">
            <input
              type="text"
              placeholder="Buscar sermón o predicador..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-sm focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-sm"
            />
            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Grid Dinámico de Resultados */}
        {filteredSermones.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredSermones.map((sermon) => (
              <article key={sermon.id} className="bg-white rounded-sm overflow-hidden shadow-sm hover:shadow-lg transition-shadow border border-gray-100 group flex flex-col">

                {/* Miniatura del Video/Audio */}
                <div className={`aspect-video ${sermon.thumbnail} relative flex items-center justify-center`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors"></div>

                  {/* Ícono dinámico según si es video o audio */}
                  <div className="z-10 bg-white/90 w-12 h-12 rounded-full flex items-center justify-center text-brand-primary shadow-lg group-hover:scale-110 transition-transform">
                    {sermon.type === 'video' ? (
                      <svg className="w-6 h-6 ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
                    ) : (
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.745 3.808-.87 7.076-.496 9.715 1.115.293.18.386.563.207.853z"/></svg>
                    )}
                  </div>

                  <span className="absolute bottom-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded-sm font-medium">
                    {sermon.duration}
                  </span>
                </div>

                {/* Contenido de la Tarjeta */}
                <div className="p-6 flex-grow flex flex-col">
                  <span className="text-xs font-bold text-brand-primary tracking-wider uppercase mb-2 block">
                    Serie: {sermon.series}
                  </span>
                  <h3 className="text-xl font-manofa text-ui-dark mb-2 leading-tight group-hover:text-brand-primary transition-colors">
                    {sermon.title}
                  </h3>
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between items-center text-sm text-ui-muted">
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                      {sermon.preacher}
                    </span>
                    <span className="flex items-center gap-1">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      {sermon.date}
                    </span>
                  </div>
                </div>

              </article>
            ))}
          </div>
        ) : (
          /* Estado Vacío (Si el usuario busca algo que no existe) */
          <div className="text-center py-20 bg-white rounded-sm border border-gray-100">
            <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-medium text-ui-dark mb-2">No encontramos ningún sermón</h3>
            <p className="text-ui-muted">Intenta buscar con otros términos o selecciona "Todos".</p>
          </div>
        )}

      </section>
    </main>
  );
}