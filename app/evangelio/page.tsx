import Link from 'next/link';

export default function EvangelioPage() {
  const steps = [
    {
      id: 1,
      title: 'DIOS ES SANTO Y CREADOR',
      verses: [
        { ref: 'Isaías 6:3', text: 'Y el uno al otro daba voces, diciendo: «Santo, Santo, Santo es el Señor de los ejércitos, Llena está toda la tierra de Su gloria.' },
        { ref: 'Apocalipsis 4:11', text: 'Digno eres, Señor y Dios nuestro, de recibir la gloria y el honor y el poder, porque Tú creaste todas las cosas, y por Tu voluntad existen y fueron creadas.' }
      ],
      explanation: 'Dios es perfecto, santo y digno de toda adoración. Él nos creó para tener relación con Él.',
      bgColor: 'bg-white'
    },
    {
      id: 2,
      title: 'EL HOMBRE ES PECADOR',
      verses: [
        { ref: 'Romanos 3:23', text: 'por cuanto todos pecaron y no alcanzan la gloria de Dios.' },
        { ref: 'Romanos 3:10', text: 'Como está escrito: No hay justo, ni aun uno.' }
      ],
      explanation: 'El problema no es solo el mundo, es el corazón humano. Todos hemos pecado. Nos hemos apartado de Dios.',
      bgColor: 'bg-ui-bg'
    },
    {
      id: 3,
      title: 'EL PECADO TIENE CONSECUENCIAS',
      verses: [
        { ref: 'Romanos 6:23', text: 'Porque la paga del pecado es muerte, pero la dádiva de Dios es vida eterna en Cristo Jesús Señor nuestro.' },
        { ref: 'Isaías 59:2', text: 'Pero las iniquidades de ustedes han hecho separación entre ustedes y su Dios, Y los pecados le han hecho esconder Su rostro para no escucharlos.' }
      ],
      explanation: 'No somos "básicamente buenos", estamos separados de Dios. El pecado nos separa de Dios. Merecemos condenación.',
      bgColor: 'bg-white'
    },
    {
      id: 4,
      title: 'CRISTO ES LA SOLUCIÓN',
      verses: [
        { ref: 'Romanos 5:8', text: 'Pero Dios demuestra Su amor para con nosotros, en que siendo aún pecadores, Cristo murió por nosotros.' },
        { ref: '2 Corintios 5:21', text: 'Al que no conoció pecado, lo hizo pecado por nosotros, para que fuéramos hechos justicia de Dios en Él.' }
      ],
      explanation: 'Cristo hizo lo que tú no puedes hacer. Jesús murió en nuestro lugar. Pagó el precio por nuestro pecado.',
      bgColor: 'bg-ui-bg'
    },
    {
      id: 5,
      title: 'LA SALVACIÓN ES POR GRACIA SOLAMENTE POR LA FE',
      verses: [
        { ref: 'Efesios 2:8-9', text: 'Porque por gracia ustedes han sido salvados por medio de la fe, y esto no procede de ustedes, sino que es don de Dios; no por obras, para que nadie se gloríe.' },
        { ref: 'Romanos 10:9', text: 'que si confiesas con tu boca a Jesús por Señor, y crees en tu corazón que Dios lo resucitó de entre los muertos, serás salvo.' },
        { ref: 'Juan 3:16', text: 'Porque de tal manera amó Dios al mundo, que dio a Su Hijo unigénito, para que todo aquel que cree en Él, no se pierda, sino que tenga vida eterna.' }
      ],
      explanation: 'No se trata de lo que haces, sino en quién confías. No se gana por obras. Se recibe confiando en Cristo.',
      bgColor: 'bg-white'
    }
  ];

  const benefits = [
    { title: 'Perdón', ref: 'Efesios 1:7', desc: 'En Él tenemos redención mediante Su sangre, el perdón de nuestros pecados según las riquezas de Su gracia...' },
    { title: 'Reconciliación', ref: 'Romanos 5:10', desc: 'Porque si cuando éramos enemigos fuimos reconciliados con Dios por la muerte de Su Hijo, mucho más, habiendo sido reconciliados, seremos salvos por Su vida.' },
    { title: 'Adopción', ref: 'Juan 1:12', desc: 'Pero a todos los que lo recibieron, les dio el derecho de llegar a ser hijos de Dios, es decir, a los que creen en Su nombre.' },
    { title: 'Guianza del Espíritu', ref: 'Romanos 8:14', desc: 'Porque todos los que son guiados por el Espíritu de Dios, los tales son hijos de Dios.' },
    { title: 'Vida eterna', ref: 'Juan 3:16', desc: 'Porque de tal manera amó Dios al mundo... para que todo aquel que cree en Él, no se pierda, sino que tenga vida eterna.' },
    { title: 'Vida nueva', ref: '2 Corintios 5:17', desc: 'De modo que si alguno está en Cristo, nueva criatura es; las cosas viejas pasaron, ahora han sido hechas nuevas.' }
  ];

  return (
    <main className="min-h-screen flex flex-col bg-white">

      {/* Hero del Evangelio */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 text-center bg-brand-primary text-white">
        <div className="max-w-3xl mx-auto mt-8">
          <h1 className="text-sm md:text-base font-medium tracking-[0.2em] text-brand-light uppercase mb-4">
            Las Buenas Noticias de Dios
          </h1>
          <h2 className="text-5xl md:text-7xl font-manofa leading-tight mb-6">
            6 Pasos Claros del Evangelio
          </h2>
          <div className="w-24 h-1 bg-brand-light mx-auto"></div>
        </div>
      </section>

      {/* Pasos 1 al 5 mapeados automáticamente */}
      {steps.map((step) => (
        <section key={step.id} className={`py-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden ${step.bgColor}`}>
          {/* Número Gigante de Fondo (Ahora más visible: text-gray-200/80) */}
          <div className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/4 text-[20rem] font-manofa text-gray-200/80 select-none z-0 hidden lg:block">
            {step.id}
          </div>

          <div className="max-w-4xl mx-auto relative z-10 grid md:grid-cols-12 gap-8 items-start">

            {/* Título y Explicación Central */}
            <div className="md:col-span-5 space-y-6">
              <div className="flex items-center gap-4">
                <span className="text-6xl font-manofa text-brand-primary lg:hidden">{step.id}</span>
                <h3 className="text-3xl md:text-4xl font-manofa text-ui-dark leading-tight uppercase">
                  {step.title}
                </h3>
              </div>
              <p className="text-xl md:text-2xl font-medium text-brand-primary leading-relaxed">
                {step.explanation}
              </p>
            </div>

            {/* Versículos Bíblicos */}
            <div className="md:col-span-7 space-y-6 mt-6 md:mt-0">
              {step.verses.map((verse, idx) => (
                <blockquote key={idx} className="border-l-4 border-brand-primary/30 pl-6 py-2">
                  <p className="text-ui-muted text-lg mb-2 leading-relaxed">
                    «{verse.text}»
                  </p>
                  <footer className="text-brand-secondary font-medium font-manofa tracking-wide text-lg">
                    {verse.ref}
                  </footer>
                </blockquote>
              ))}
            </div>

          </div>
        </section>
      ))}

      {/* Paso 6: El Llamado a la Acción */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-brand-secondary text-white text-center">
        <div className="max-w-5xl mx-auto">
          <span className="text-8xl font-manofa text-brand-light/30 block mb-4">6</span>
          <h3 className="text-5xl md:text-6xl font-manofa mb-8 uppercase">Debes Responder</h3>

          <div className="bg-white text-ui-dark p-8 md:p-12 rounded-sm shadow-xl mt-8">
            <h4 className="text-2xl md:text-3xl font-medium text-brand-primary mb-6">
              No basta saberlo, debes responder:
            </h4>
            <p className="text-xl text-ui-muted mb-8 pb-8 border-b border-gray-100">
              <span className="font-bold text-ui-dark">Arrepiéntete</span> — <span className="font-bold text-ui-dark">Cree en Cristo</span> — <span className="font-bold text-ui-dark">Recíbelo como Señor y Salvador.</span>
            </p>

            {/* Cuadrícula de 4 versículos actualizada */}
            <div className="grid md:grid-cols-2 gap-8 text-left">
              <blockquote className="border-l-4 border-brand-primary pl-4">
                <p className="text-ui-muted text-sm mb-2">«Por tanto, arrepiéntanse y conviértanse, para que sus pecados sean borrados, a fin de que tiempos de alivio vengan de la presencia del Señor»</p>
                <footer className="text-brand-primary font-medium">Hechos 3:19</footer>
              </blockquote>
              <blockquote className="border-l-4 border-brand-primary pl-4">
                <p className="text-ui-muted text-sm mb-2">«Pero a todos los que lo recibieron, les dio el derecho de llegar a ser hijos de Dios, es decir, a los que creen en Su nombre»</p>
                <footer className="text-brand-primary font-medium">Juan 1:12</footer>
              </blockquote>
              <blockquote className="border-l-4 border-brand-primary pl-4">
                <p className="text-ui-muted text-sm mb-2">«En Él también ustedes, después de escuchar el mensaje de la verdad, el evangelio de su salvación, y habiendo creído, fueron sellados en Él con el Espíritu Santo de la promesa.»</p>
                <footer className="text-brand-primary font-medium">Efesios 1:13</footer>
              </blockquote>
              <blockquote className="border-l-4 border-brand-primary pl-4">
                <p className="text-ui-muted text-sm mb-2">«Toda Escritura es inspirada por Dios y útil para enseñar, para reprender, para corregir, para instruir en justicia.»</p>
                <footer className="text-brand-primary font-medium">2 Timoteo 3:16</footer>
              </blockquote>
            </div>
          </div>
        </div>
      </section>

      {/* Sección: ¿Qué recibes al venir a Cristo? */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-ui-bg">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl text-ui-dark mb-4 uppercase font-manofa">¿Qué recibes al venir a Cristo?</h2>
            <div className="w-16 h-1 bg-brand-primary mx-auto"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, idx) => (
              <div key={idx} className="bg-white p-8 rounded-sm shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <h4 className="text-xl font-medium text-brand-primary mb-1">{benefit.title}</h4>
                <span className="text-xs font-bold uppercase tracking-wider text-ui-muted block mb-4 border-b pb-2">{benefit.ref}</span>
                <p className="text-ui-muted text-sm leading-relaxed">{benefit.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Invitación Final */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white border-t border-gray-100 text-center">
        <div className="max-w-2xl mx-auto space-y-6">
          <h3 className="text-3xl md:text-4xl font-manofa text-ui-dark">¿Quieres conocer más de la Biblia?</h3>
          <p className="text-xl text-brand-primary font-medium">¡Ven y estudia con nosotros!</p>
          <div className="pt-6">
            <Link
              href="/#horarios"
              className="inline-block px-8 py-4 bg-brand-primary text-white font-medium text-lg rounded-sm hover:bg-brand-secondary transition-all shadow-lg"
            >
              Ver horarios de reuniones
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}