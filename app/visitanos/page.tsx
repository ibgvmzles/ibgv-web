import Header from '@/components/layout/Header';

export const metadata = {
  title: 'Visítanos | Iglesia Bíblica Gracia Verdadera',
  description: 'Acompáñanos en nuestras reuniones. Ubicación, horarios de servicio y contacto de la IBGV en Manizales.',
};

export default function VisitanosPage() {
  const whatsappMsg = encodeURIComponent(
    "¡Hola! Estuve visitando la página web de la Iglesia Bíblica Gracia Verdadera y me gustaría recibir más información para acompañarlos."
  );

  return (
    <main className="min-h-screen bg-white flex flex-col">
      <Header />

      {/* Título de la sección */}
      <section className="pt-32 pb-12 px-4 sm:px-6 lg:px-8 bg-ui-bg border-b border-gray-100">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-manofa text-ui-dark mb-6">
            Acompáñanos este <span className="text-brand-primary">Domingo</span>
          </h1>
          <p className="text-lg sm:text-xl text-ui-muted max-w-2xl mx-auto leading-relaxed">
            Nos encantaría conocerte. Aquí encontrarás nuestra ubicación, horarios de reuniones y formas de contacto.
          </p>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-start">

            {/* Columna Izquierda: Horarios y Contacto */}
            <div className="space-y-12">

              {/* Bloque de Horarios */}
              <div>
                <h2 className="text-2xl font-bold text-ui-dark mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Nuestras Reuniones
                </h2>

                <div className="space-y-4">
                  {/* Reunión 1 */}
                  <div className="bg-ui-bg p-6 rounded-sm border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                    <h3 className="text-xl font-bold text-brand-primary mb-2">El Día del Señor</h3>
                    <p className="text-lg text-ui-dark font-medium mb-2">Domingos - 10:00 a.m.</p>
                    <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                      Nos reunimos en el Edificio Cootilca para adorar juntos mediante el canto, la oración y la predicación expositiva.
                    </p>
                  </div>
                </div>
              </div>

              {/* Bloque de Contacto y Dirección */}
              <div>
                <h2 className="text-2xl font-bold text-ui-dark mb-6 flex items-center gap-2">
                  <svg className="w-6 h-6 text-brand-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Ubicación y Contacto
                </h2>
                <div className="space-y-3 text-base sm:text-lg text-gray-600 bg-white p-6 border border-gray-100 rounded-sm shadow-sm">
                  <p className="text-xl text-ui-dark font-bold">Edificio Cootilca</p>
                  <p>Calle 44 No. 23-52 Piso 3</p>
                  <p>Manizales, Caldas, Colombia</p>

                  <div className="pt-4 mt-4 border-t border-gray-100 space-y-3">
                    <p className="font-medium text-ui-dark mb-2">Escríbenos por WhatsApp:</p>
                    <p>
                      <a
                        href={`https://wa.me/573223664386?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-primary transition-colors inline-flex items-center gap-2 font-medium"
                      >
                        <span>📱 +57 322 366 4386</span>
                        <span className="text-xs bg-green-600/10 text-green-700 px-2 py-0.5 rounded-sm">Abrir chat</span>
                      </a>
                    </p>
                    <p>
                      <a
                        href={`https://wa.me/573016012415?text=${whatsappMsg}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hover:text-brand-primary transition-colors inline-flex items-center gap-2 font-medium"
                      >
                        <span>📱 +57 301 601 2415</span>
                        <span className="text-xs bg-green-600/10 text-green-700 px-2 py-0.5 rounded-sm">Abrir chat</span>
                      </a>
                    </p>
                  </div>
                </div>
              </div>

            </div>

            {/* Columna Derecha: Mapa Fijo */}
            <div className="w-full h-[400px] lg:h-[600px] rounded-sm overflow-hidden shadow-lg border border-gray-200 lg:sticky lg:top-28">
              <iframe
                src="https://maps.google.com/maps?q=Edificio+Cootilca,+Calle+44+%2323-52,+Manizales&t=&z=16&ie=UTF8&iwloc=&output=embed"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}