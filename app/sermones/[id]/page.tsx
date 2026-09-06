// ibgv-web/app/sermones/[id]/page.tsx
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { getVideosFromPlaylist } from '@/lib/youtube';

export default async function SeriePage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>,
  searchParams: Promise<{ v?: string, view?: string }>
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const playlistId = resolvedParams.id;
  const videoId = resolvedSearchParams.v;
  // Leemos si el usuario quiere ver en lista o en cuadrícula (por defecto 'grid')
  const viewType = resolvedSearchParams.view || 'grid';

  const videos = await getVideosFromPlaylist(playlistId);

  if (!videos || videos.length === 0) {
    return (
       <main className="min-h-screen bg-white flex flex-col">
         <Header />
         <div className="flex-grow flex flex-col items-center justify-center pt-32 text-ui-muted">
            <p className="text-lg">No se encontraron videos públicos en esta serie.</p>
            <Link href="/sermones" className="text-brand-primary mt-4 hover:underline">Volver a sermones</Link>
         </div>
       </main>
    )
  }

  const activeVideo = videoId
    ? videos.find(vid => vid.id === videoId) || videos[0]
    : videos[0];

  return (
    <main className="min-h-screen bg-ui-bg flex flex-col">
      <Header />

      {/* 1. ZONA DEL REPRODUCTOR PRINCIPAL */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-ui-dark text-white">
        <div className="max-w-5xl mx-auto">
          <Link href="/sermones" className="inline-flex items-center gap-2 text-brand-light hover:text-white mb-6 transition-colors font-medium">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Volver a la biblioteca
          </Link>

          <div className="relative aspect-video w-full bg-black rounded-sm overflow-hidden shadow-2xl border border-gray-800">
            <iframe
              src={`https://www.youtube.com/embed/${activeVideo.id}?autoplay=0&rel=0`}
              title={activeVideo.title}
              className="absolute top-0 left-0 w-full h-full"
              allowFullScreen
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            ></iframe>
          </div>

          <div className="mt-8 border-b border-gray-800 pb-6">
            <h1 className="text-2xl md:text-3xl font-bold leading-tight">{activeVideo.title}</h1>
            <div className="flex items-center gap-2 text-gray-400 mt-3 text-sm">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
              <span>Publicado el: {activeVideo.date}</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. ZONA DE LISTA DE REPRODUCCIÓN (EPISODIOS) */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white flex-grow">
        <div className="max-w-5xl mx-auto">

          {/* Cabecera con Botones de Vistas */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b border-gray-100 pb-4 gap-4">
            <h2 className="text-2xl font-manofa text-ui-dark">
              Videos en esta serie <span className="text-brand-primary">({videos.length})</span>
            </h2>

            {/* Botones Grid / List */}
            <div className="flex bg-ui-bg p-1 rounded-sm border border-gray-200">
              <Link
                href={`?v=${activeVideo.id}&view=grid`}
                scroll={false}
                className={`p-2 rounded-sm transition-colors ${viewType === 'grid' ? 'bg-white shadow-sm text-brand-primary' : 'text-ui-muted hover:text-ui-dark'}`}
                title="Vista de cuadrícula"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
              </Link>
              <Link
                href={`?v=${activeVideo.id}&view=list`}
                scroll={false}
                className={`p-2 rounded-sm transition-colors ${viewType === 'list' ? 'bg-white shadow-sm text-brand-primary' : 'text-ui-muted hover:text-ui-dark'}`}
                title="Vista de lista"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              </Link>
            </div>
          </div>

          {/* Contenedor dinámico (Grid o List) */}
          <div className={
            viewType === 'grid'
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "flex flex-col gap-4"
          }>
            {videos.map((video) => {
              const isPlaying = video.id === activeVideo.id;

              return (
                <Link
                  key={video.id}
                  href={`?v=${video.id}&view=${viewType}`}
                  scroll={true}
                  className={`group flex rounded-sm overflow-hidden border transition-all duration-300 ${
                    viewType === 'grid' ? 'flex-col' : 'flex-row items-center h-28'
                  } ${
                    isPlaying
                      ? 'border-brand-primary bg-brand-light/20 shadow-md ring-1 ring-brand-primary'
                      : 'border-gray-200 bg-ui-bg hover:shadow-lg hover:border-brand-primary/50'
                  }`}
                >
                  {/* Miniatura del video */}
                  <div className={`relative ${viewType === 'grid' ? 'aspect-video w-full' : 'w-40 md:w-48 h-full flex-shrink-0'}`}>
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${!isPlaying && 'group-hover:scale-105'}`}
                      loading="lazy"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-brand-primary/85 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-medium flex items-center gap-2 text-sm">
                          <svg className="w-4 h-4 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                          {viewType === 'grid' ? 'En reproducción' : 'Sonando'}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Textos */}
                  <div className={`flex flex-col justify-between flex-grow ${viewType === 'grid' ? 'p-4' : 'p-4 md:px-6'}`}>
                    <h3 className={`font-bold line-clamp-2 ${viewType === 'grid' ? 'text-sm' : 'text-base md:text-lg'} ${isPlaying ? 'text-brand-primary' : 'text-ui-dark group-hover:text-brand-primary transition-colors'}`}>
                      {video.title}
                    </h3>
                    <p className="text-xs text-ui-muted mt-2 font-medium">{video.date}</p>
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      </section>
    </main>
  )
}