import Header from '@/components/layout/Header';
import Link from 'next/link';
import { getHorarios } from '@/lib/sheets';

export default async function Home() {
  // 1. Obtenemos los datos dinámicos desde Google Sheets
  const horarios = await getHorarios();

  // 2. Filtramos los datos según la columna "tipo" de tu Excel
  const domingos = horarios.filter(h => h.tipo.toLowerCase() === 'domingo');
  const semana = horarios.filter(h => h.tipo.toLowerCase() !== 'domingo');

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* =========================================
          1. SECCIÓN HERO (Bienvenida)
          ========================================= */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-ui-bg flex items-center justify-center border-b border-gray-100">
        <div className="max-w-4xl mx-auto text-center space-y-8 mt-12 sm:mt-8">
          <h1 className="text-5xl sm:text-6xl md:text-7xl text-ui-dark leading-tight">
            Proclamando las verdades del{' '}
            <span className="text-brand-primary">evangelio de Dios</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-ui-muted leading-relaxed">
            Somos una comunidad reformada en Manizales donde el centro es Jesucristo.
            Un puerto seguro lejos del moralismo, que abraza la profundidad bíblica y
            descansa en la gracia verdadera.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <a
              href="#horarios"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-medium text-lg rounded-sm hover:bg-brand-secondary transition-all shadow-lg hover:shadow-xl"
            >
              Acompáñanos este domingo
            </a>
            <Link
              href="/nosotros"
              className="w-full sm:w-auto px-8 py-4 bg-white text-ui-dark border border-gray-200 font-medium text-lg rounded-sm hover:border-brand-primary hover:text-brand-primary transition-all"
            >
              Conoce nuestra doctrina
            </Link>
          </div>
          <div className="pt-12 text-sm text-ui-muted flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span>Calle 44 No. 23-52 Piso 3, Edificio Cootilca (El Centro)</span>
          </div>
        </div>
      </section>

      {/* =========================================
          2. SECCIÓN HORARIOS (Dinámica desde Google Sheets)
          ========================================= */}
      <section id="horarios" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-ui-dark mb-4">Reuniones Generales</h2>
            <div className="w-16 h-1 bg-brand-primary mx-auto"></div>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-start">

            {/* Tarjeta Día del Señor (Domingo) */}
            <div className="bg-ui-bg p-8 md:p-10 rounded-sm border border-gray-100 shadow-sm">
              <h3 className="text-2xl text-brand-primary mb-6 border-b border-gray-200 pb-4">
                El Día del Señor - Domingo 6 de septiembre
              </h3>

              {domingos.length > 0 ? (
                <ul className="space-y-6 text-ui-dark">
                  {domingos.map((item, idx) => (
                    <li key={idx} className="flex justify-between items-center border-b border-gray-200/50 pb-2 last:border-0 last:pb-0">
                      <span className="font-medium text-lg">{item.actividad}</span>
                      <span className="text-brand-secondary font-medium">{item.hora}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ui-muted italic">Horarios de domingo por confirmar...</p>
              )}

              <p className="mt-8 text-sm text-ui-muted pt-4 border-t border-gray-200">
                Nos reunimos en el Edificio Cootilca (El Centro) para adorar juntos mediante el canto, la oración y la predicación expositiva.
              </p>
            </div>

            {/* Tarjeta Actividades de Semana */}
            <div>
              <h3 className="text-2xl text-ui-dark mb-6">Durante la semana</h3>

              <div className="space-y-3">
                {semana.length > 0 ? (
                  semana.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-4 bg-gray-50 hover:bg-gray-100 transition-colors rounded-sm border border-gray-100">
                      <div className="w-2 h-2 mt-2 bg-brand-primary rounded-full shrink-0"></div>
                      <div>
                        <h4 className="font-medium text-ui-dark mb-1">
                          {item.dia} — {item.hora}
                        </h4>
                        <p className="text-ui-muted text-sm">
                          {item.actividad} <span className="font-medium text-gray-500">({item.ubicacion})</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-ui-muted italic p-4">No hay actividades programadas en semana.</p>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================
          3. SECCIÓN ÚLTIMO SERMÓN (Multimedia)
          ========================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <span className="text-brand-light font-medium tracking-wider uppercase text-sm">
              Última Enseñanza
            </span>
            <h2 className="text-3xl md:text-5xl font-manofa leading-tight">
              Alimentándonos de la Palabra
            </h2>
            <p className="text-brand-light text-lg max-w-md">
              Acompáñanos en nuestro estudio expositivo. Puedes ver las grabaciones en video o escuchar el audio mientras te desplazas por la ciudad.
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <a href="https://youtube.com/@ibgvmanizales" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-sm font-medium hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.996,15.005l0-6.01L15.224,12L9.996,15.005z"/></svg>
                Canal de YouTube
              </a>
              <a href="https://open.spotify.com/show/033I8k275SDuLONqsAOVdA" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 border border-brand-light text-white px-6 py-3 rounded-sm font-medium hover:bg-brand-secondary transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.745 3.808-.87 7.076-.496 9.715 1.115.293.18.386.563.207.853zm1.19-3.21c-.225.367-.704.482-1.07.257-2.695-1.656-6.804-2.146-9.97-1.176-.412.126-.84-.105-.967-.517-.126-.412.106-.84.518-.968 3.633-1.112 8.18-.567 11.233 1.308.368.225.483.704.256 1.096zm.014-3.34c-3.224-1.916-8.544-2.093-11.606-1.16-.505.154-1.037-.132-1.19-.637-.154-.504.13-1.036.635-1.19 3.51-.107 9.38.093 13.126 2.316.452.268.602.846.335 1.298-.268.453-.846.603-1.3.336z"/></svg>
                Podcast en Spotify
              </a>
            </div>
          </div>

          <div className="relative aspect-video bg-ui-dark rounded-sm overflow-hidden shadow-2xl flex items-center justify-center group cursor-pointer border border-brand-secondary">
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
            <div className="z-10 bg-brand-primary w-16 h-16 rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
              <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z"/></svg>
            </div>
            <div className="absolute bottom-4 left-4 z-10">
              <p className="text-white font-medium shadow-sm">Sermón Dominical</p>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}