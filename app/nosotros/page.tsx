import Link from 'next/link';

export default function NosotrosPage() {
  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* Hero de Nosotros */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center bg-brand-primary text-white">
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-sm md:text-base font-medium tracking-[0.2em] text-brand-light uppercase mb-4">
            Nuestra Identidad
          </h1>
          <h2 className="text-5xl md:text-7xl font-manofa leading-tight mb-6">
            Quiénes Somos
          </h2>
          <div className="w-24 h-1 bg-brand-light mx-auto"></div>
        </div>
      </section>

      {/* Declaración Principal */}
      <section className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-2xl md:text-4xl text-ui-dark font-medium leading-relaxed font-manofa">
            «Somos la Iglesia Bíblica Gracia Verdadera, una comunidad reformada, basada en la teología del Nuevo Pacto. Estamos ubicados en la ciudad de Manizales, donde el centro de absolutamente todo es Jesucristo y su obra en la cruz.»
          </p>
        </div>
      </section>

      {/* Los 3 Pilares (El Manifiesto) */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-ui-bg border-y border-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-12 md:gap-8">

            {/* Pilar 1: Lo que creemos y rechazamos */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-brand-primary text-white flex items-center justify-center rounded-sm mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-2xl font-manofa text-ui-dark uppercase">Autoridad y Reverencia</h3>
              <p className="text-ui-muted leading-relaxed">
                Creemos firmemente en la autoridad infalible de la Biblia y en una adoración reverente. No somos un club de gente perfecta ni una franquicia de motivación. <span className="font-medium text-brand-primary">Rechazamos por completo el moralismo, el emocionalismo, el legalismo</span> y los discursos de superación personal o teología de la prosperidad.
              </p>
            </div>

            {/* Pilar 2: El contexto de la ciudad */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-brand-primary text-white flex items-center justify-center rounded-sm mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </div>
              <h3 className="text-2xl font-manofa text-ui-dark uppercase">Un Puerto Seguro</h3>
              <p className="text-ui-muted leading-relaxed">
                Sabemos que en Manizales (y en el mundo) hay muchas personas lastimadas, descarriadas o cansadas de iglesias manipuladoras, de la falta de transparencia financiera y del show. <span className="font-medium text-ui-dark">Para ellos, nosotros somos un puerto seguro y transparente.</span>
              </p>
            </div>

            {/* Pilar 3: Profundidad Intelectual */}
            <div className="space-y-4">
              <div className="w-12 h-12 bg-brand-primary text-white flex items-center justify-center rounded-sm mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-2xl font-manofa text-ui-dark uppercase">Evangelio Profundo</h3>
              <p className="text-ui-muted leading-relaxed">
                Creemos en la gracia de Dios y en la obra activa del Espíritu Santo para hacernos crecer. Al estar en una ciudad universitaria, abrazamos las inquietudes intelectuales: <span className="font-medium text-ui-dark">aquí el evangelio es profundo, no subestima la razón</span> y busca responder a las dudas con la verdad bíblica.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Enlaces a siguientes pasos */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white text-center">
        <div className="max-w-3xl mx-auto space-y-8">
          <h2 className="text-3xl md:text-4xl font-manofa text-ui-dark">
            Conoce el centro de nuestro mensaje
          </h2>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/evangelio"
              className="w-full sm:w-auto px-8 py-4 bg-brand-primary text-white font-medium text-lg rounded-sm hover:bg-brand-secondary transition-all shadow-lg"
            >
              Las Buenas Noticias
            </Link>
            <Link
              href="/#horarios"
              className="w-full sm:w-auto px-8 py-4 bg-white text-ui-dark border border-gray-200 font-medium text-lg rounded-sm hover:border-brand-primary hover:text-brand-primary transition-all"
            >
              Visítanos este domingo
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}