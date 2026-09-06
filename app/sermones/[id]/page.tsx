// ibgv-web/app/sermones/[id]/page.tsx
import Header from '@/components/layout/Header';
import Link from 'next/link';
import { getVideosFromPlaylist } from '@/lib/youtube';

export default async function SeriePage({
  params,
  searchParams
}: {
  // Actualizamos los tipos a Promesas para Next.js 15
  params: Promise<{ id: string }>,
  searchParams: Promise<{ v?: string }>
}) {
  // 1. "Desempaquetamos" los parámetros de la URL con await
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;

  const playlistId = resolvedParams.id;
  const videoId = resolvedSearchParams.v;

  // 2. Extraemos todos los videos usando el ID desempaquetado
  const videos = await getVideosFromPlaylist(playlistId);

  if (!videos || videos.length === 0) {
    return (
       <main className="min-h-screen bg-white flex flex-col">
         <Header />
         <div className="flex-grow flex flex-col items-center justify-center pt-32 text-ui-muted">
            <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
            <p className="text-lg">No se encontraron videos públicos en esta serie.</p>
            <Link href="/sermones" className="text-brand-primary mt-4 hover:underline">Volver a sermones</Link>
         </div>
       </main>
    )
  }

  // 3. Determinamos qué video reproducir
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
          <h2 className="text-2xl font-manofa text-ui-dark mb-8 border-b border-gray-100 pb-4">
            Videos en esta serie <span className="text-brand-primary">({videos.length})</span>
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map((video) => {
              const isPlaying = video.id === activeVideo.id;

              return (
                <Link
                  key={video.id}
                  href={`?v=${video.id}`}
                  scroll={true}
                  className={`group flex flex-col rounded-sm overflow-hidden border transition-all duration-300 ${
                    isPlaying
                      ? 'border-brand-primary bg-brand-light/20 shadow-md ring-1 ring-brand-primary'
                      : 'border-gray-200 bg-ui-bg hover:shadow-lg hover:border-brand-primary/50'
                  }`}
                >
                  <div className="relative aspect-video">
                    <img
                      src={video.thumbnail}
                      alt={video.title}
                      className={`w-full h-full object-cover transition-transform duration-500 ${!isPlaying && 'group-hover:scale-105'}`}
                      loading="lazy"
                    />
                    {isPlaying && (
                      <div className="absolute inset-0 bg-brand-primary/85 flex items-center justify-center backdrop-blur-sm">
                        <span className="text-white font-medium flex items-center gap-2">
                          <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 14.5v-9l6 4.5-6 4.5z"/></svg>
                          En reproducción
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-4 flex flex-col justify-between flex-grow">
                    <h3 className={`text-sm font-bold line-clamp-2 ${isPlaying ? 'text-brand-primary' : 'text-ui-dark group-hover:text-brand-primary transition-colors'}`}>
                      {video.title}
                    </h3>
                    <p className="text-xs text-ui-muted mt-3 font-medium">{video.date}</p>
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