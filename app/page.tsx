import Header from '@/components/layout/Header';
import Link from 'next/link';
import { getHorarios } from '@/lib/sheets';
import { getLatestSermonFromPlaylist, getLatestStudyVideo } from '@/lib/youtube';
import DailyReading from '@/components/layout/DailyReading';
import LatestTeachingSection from '@/components/layout/LatestTeachingSection';

export default async function Home() {
  // 1. Obtenemos los datos desde las APIs de manera simultánea (Sermón Dominical + Estudio Bíblico)
  const [horarios, ultimoSermon, ultimoEstudio] = await Promise.all([
    getHorarios(),
    getLatestSermonFromPlaylist(),
    getLatestStudyVideo()
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

        {/* Filtro oscuro inteligente: Gradiente vertical (oscuro en los bordes, claro en el centro) */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/30 to-black/80 z-0"></div>

        {/* Contenido (Textos, botón y dirección) */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full text-center mt-8">

          {/* Sombras intensas (drop-shadow) para que el texto resalte sobre el video claro */}
          <h1 className="text-4xl md:text-6xl font-manofa mb-6 text-white leading-tight drop-shadow-[0_4px_6px_rgba(0,0,0,0.9)]">
            Una comunidad reformada <br className="hidden md:block" />
            en <span className="text-[#DEA6AB] drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">Manizales</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-100 mb-10 max-w-3xl mx-auto leading-relaxed font-medium drop-shadow-[0_3px_5px_rgba(0,0,0,0.9)]">
            Donde el centro de absolutamente todo es Jesucristo y su obra en la cruz.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a
              href="/visitanos"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-medium text-lg rounded-sm hover:bg-brand-secondary transition-all shadow-xl hover:shadow-2xl"
            >
              Visítanos
            </a>
          </div>

          {/* Dirección Clicable a Google Maps */}
          <div className="pt-12 text-sm sm:text-base text-gray-300 flex items-center justify-center gap-2 drop-shadow-md">
            <svg className="w-5 h-5 text-brand-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <a
              href="https://maps.google.com/?q=Edificio+Cootilca,+Calle+44+%2323-52,+Manizales"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white hover:underline transition-colors font-medium"
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
                    <li key={idx} className="flex justify-between items-center border-b border-gray-200/50 pb-2 last:border-0 last:pb-0 gap-4">
                      <span className="font-medium text-lg sm:text-xl">{item.actividad}</span>
                      <span className="text-brand-secondary font-medium text-base sm:text-lg shrink-0">{item.hora}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-ui-muted italic text-base">Horarios de domingo por confirmar...</p>
              )}

              {/* 1. Párrafo de dirección aumentado de text-sm a text-base / text-lg con mejor interlineado */}
              <p className="mt-8 text-base sm:text-lg text-gray-600 leading-relaxed pt-4 border-t border-gray-200">
                Nos reunimos en el Edificio Cootilca (Calle 44 No. 23-52 Piso 3) para adorar juntos mediante el canto, la oración y la predicación expositiva.
              </p>
            </div>

            <div>
              <h3 className="text-2xl text-ui-dark mb-6">Durante la semana</h3>
              <div className="space-y-4">
                {semana.length > 0 ? (
                  semana.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-4 p-5 bg-gray-50 hover:bg-gray-100 transition-colors rounded-sm border border-gray-100">
                      <div className="w-2.5 h-2.5 mt-2 bg-brand-primary rounded-full shrink-0"></div>
                      <div>
                        {/* 2. Subimos el día/hora a text-lg */}
                        <h4 className="font-medium text-lg text-ui-dark mb-1">
                          {item.dia} — {item.hora}
                        </h4>
                        {/* 3. Subimos la descripción de text-sm a text-base sm:text-lg */}
                        <p className="text-gray-600 text-base sm:text-lg leading-snug">
                          {item.actividad} <span className="font-semibold text-gray-700">({item.ubicacion})</span>
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-ui-muted italic p-4 text-base">No hay actividades programadas en semana.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================
          3. SECCIÓN ÚLTIMO SERMÓN (Multimedia Dinámica: Servicio Dominical + Estudio Bíblico)
          ========================================= */}
      <LatestTeachingSection
        sermonDominical={ultimoSermon}
        estudioBiblico={ultimoEstudio}
      />
    </main>
  );
}