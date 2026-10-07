import Header from '@/components/layout/Header';
import Link from 'next/link';
import { getHorarios } from '@/lib/sheets';
import { getLatestSermonFromPlaylist } from '@/lib/youtube';
import DailyReading from '@/components/layout/DailyReading';

export default async function Home() {
  // 1. Obtenemos los datos desde las APIs de manera simultánea
  const [horarios, ultimoSermon] = await Promise.all([
    getHorarios(),
    getLatestSermonFromPlaylist()
  ]);

  // 2. Filtramos horarios
  const domingos = horarios.filter(h => h.tipo.toLowerCase() === 'domingo');
  const semana = horarios.filter(h => h.tipo.toLowerCase() !== 'domingo');

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* =========================================
          1. SECCIÓN PRINCIPAL (Hero con Video de Fondo)
          ========================================= */}
      <section className="relative pt-40 pb-32 flex items-center justify-center min-h-[85vh] overflow-hidden">

        {/* Fondo de Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/fondo-iglesia.mp4" type="video/mp4" />
          Tu navegador no soporta videos HTML5.
        </video>

        {/* Filtro oscuro para garantizar la lectura de las letras blancas */}
        <div className="absolute inset-0 bg-black/70 z-0"></div>

        {/* Contenido (Textos, botón y dirección) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center">
          <h1 className="text-4xl md:text-6xl font-manofa mb-6 text-white leading-tight">
            Una comunidad reformada <br className="hidden md:block" />
            en <span className="text-[#DEA6AB]">Manizales</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-300 mb-10 max-w-3xl mx-auto leading-relaxed">
            Donde el centro de absolutamente todo es Jesucristo y su obra en la cruz.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/visitanos"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-medium text-lg rounded-sm hover:bg-brand-secondary transition-all shadow-lg hover:shadow-xl"
            >
              Visítanos
            </a>
          </div>

          {/* Dirección Clicable a Google Maps */}
          <div className="pt-12 text-sm text-gray-400 flex items-center justify-center gap-2">
            <svg className="w-5 h-5 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <a
              href="https://maps.google.com/?q=Edificio+Cootilca,+Calle+44+%2323-52,+Manizales"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline transition-colors"
            >
              Calle 44 No. 23-52 Piso 3, Edificio Cootilca
            </a>
          </div>
        </div>
      </section>

      {/* WIDGET LECTURA DIARIA */}
      <section className="relative z-20 -mt-12 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto w-full">
        <DailyReading />
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
            <div className="bg-ui-bg p-8 md:p-10 rounded-sm border border-gray-100 shadow-sm">
              <h3 className="text-2xl text-brand-primary mb-6 border-b border-gray-200 pb-4">
                El Día del Señor
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
                Nos reunimos en el Edificio Cootilca (Calle 44 No. 23-52 Piso 3) para adorar juntos mediante el canto, la oración y la predicación expositiva.
              </p>
            </div>

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
          3. SECCIÓN ÚLTIMO SERMÓN (Multimedia Dinámica)
          ========================================= */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-primary text-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">

          <div className="space-y-6">
            <span className="text-brand-light font-medium tracking-wider uppercase text-sm">
              Última Enseñanza
            </span>
            <h2 className="text-3xl md:text-5xl font-manofa leading-tight">
              Alimentándonos de la Palabra
            </h2>
            <p className="text-brand-light text-lg max-w-md pb-2">
              Acompáñanos en nuestro estudio expositivo. Puedes ver las grabaciones en video o escuchar el audio mientras te desplazas por la ciudad.
            </p>

            {/* Reproductor Incrustado de Spotify (Súper Liviano) */}
            <div className="max-w-md bg-brand-secondary/30 p-4 rounded-sm border border-brand-secondary">
              <h3 className="text-xs font-bold text-brand-light mb-3 uppercase tracking-wider">Escucha el Podcast:</h3>
              <iframe
                src="https://open.spotify.com/embed/show/033I8k275SDuLONqsAOVdA?utm_source=generator&theme=0"
                width="100%"
                height="152"
                frameBorder="0"
                allowFullScreen={false}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="rounded-sm shadow-lg"
              ></iframe>
            </div>

            <div className="pt-2">
              <Link href="/sermones" className="inline-flex items-center gap-2 bg-white text-brand-primary px-6 py-3 rounded-sm font-medium hover:bg-gray-100 transition-colors">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.996,15.005l0-6.01L15.224,12L9.996,15.005z"/></svg>
                Ver todos los sermones
              </Link>
            </div>
          </div>

          {/* Tarjeta Visual de Video desde YouTube */}
          <div>
             <h3 className="text-xs font-bold text-brand-light mb-3 uppercase tracking-wider">Último video en YouTube:</h3>
             {ultimoSermon ? (
                <a
                  href={`https://www.youtube.com/watch?v=${ultimoSermon.id}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="relative aspect-video bg-ui-dark rounded-sm overflow-hidden shadow-2xl flex items-center justify-center group cursor-pointer border border-brand-secondary block"
                >
                  {/* Miniatura extraída de YouTube */}
                  <img
                    src={ultimoSermon.thumbnail}
                    alt={ultimoSermon.title}
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
                      {ultimoSermon.title}
                    </p>
                    <p className="text-gray-300 text-sm mt-1">{ultimoSermon.date}</p>
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
    </main>
  );
}