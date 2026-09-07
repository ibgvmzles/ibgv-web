import Header from '@/components/layout/Header';
import Link from 'next/link';
import { getAllPlaylists } from '@/lib/youtube';

export const metadata = {
  title: 'Sermones | Iglesia Bíblica Gracia Verdadera',
  description: 'Biblioteca de predicaciones expositivas y estudios bíblicos de la IBGV en Manizales.',
};

export default async function SermonesPage({
  searchParams
}: {
  searchParams: Promise<{ sort?: string }>
}) {
  const resolvedSearchParams = await searchParams;
  // Leemos el orden (desc = más recientes primero, por defecto)
  const sortType = resolvedSearchParams.sort || 'desc';

  // Traemos todas las listas del canal
  const playlists = await getAllPlaylists();

  // Ordenamos las listas (series) matemáticamente por fecha de creación
  const sortedPlaylists = [...playlists].sort((a: any, b: any) => {
    const dateA = new Date(a.publishedAt || 0).getTime();
    const dateB = new Date(b.publishedAt || 0).getTime();
    return sortType === 'desc' ? dateB - dateA : dateA - dateB;
  });

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Título de la sección */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-ui-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-manofa text-ui-dark mb-6">
            Biblioteca de <span className="text-[#DEA6AB]">Enseñanzas</span>
          </h1>
          <p className="text-lg text-ui-muted max-w-2xl mx-auto">
            Explora nuestras series de predicación expositiva y estudios bíblicos organizados por temas y libros de la Biblia.
          </p>
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-white flex-grow">
        <div className="max-w-7xl mx-auto">

          {/* Controles de Filtro */}
          <div className="flex justify-end mb-8">
            <div className="flex bg-ui-bg p-1 rounded-sm border border-gray-200 text-sm">
              <Link
                href="?sort=desc"
                scroll={false}
                className={`px-3 py-1.5 rounded-sm transition-colors ${sortType === 'desc' ? 'bg-white shadow-sm text-brand-primary font-medium' : 'text-ui-muted hover:text-ui-dark'}`}
              >
                Más recientes
              </Link>
              <Link
                href="?sort=asc"
                scroll={false}
                className={`px-3 py-1.5 rounded-sm transition-colors ${sortType === 'asc' ? 'bg-white shadow-sm text-brand-primary font-medium' : 'text-ui-muted hover:text-ui-dark'}`}
              >
                Más antiguas
              </Link>
            </div>
          </div>

          {/* Cuadrícula de Series */}
          {sortedPlaylists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {sortedPlaylists.map((playlist) => (
                <Link
                  key={playlist.id}
                  // Al dar clic, obligamos a que los videos de adentro también se muestren desde el más reciente
                  href={`/sermones/${playlist.id}?sort=desc`}
                  className="group flex flex-col bg-ui-bg rounded-sm border border-gray-100 overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300"
                >
                  {/* Contenedor de la Imagen */}
                  <div className="relative aspect-video overflow-hidden bg-brand-secondary/10">
                    <img
                      src={playlist.thumbnail}
                      alt={playlist.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    {/* Etiqueta flotante con el número de videos */}
                    <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs font-medium px-2 py-1 rounded-sm flex items-center gap-1 backdrop-blur-sm">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M7 4V16L15 10L7 4Z" /></svg>
                      {playlist.itemCount} {playlist.itemCount === 1 ? 'video' : 'videos'}
                    </div>
                  </div>

                  {/* Título de la Serie */}
                  <div className="p-5 flex-grow flex flex-col justify-between">
                    <h2 className="text-lg font-bold text-ui-dark line-clamp-2 group-hover:text-brand-primary transition-colors">
                      {playlist.title}
                    </h2>
                    <p className="text-sm text-brand-primary mt-4 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                      Ver serie completa →
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-ui-muted">
              <p>Cargando biblioteca de sermones...</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}