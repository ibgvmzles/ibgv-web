import Image from 'next/image';
import Link from 'next/link';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const whatsappMsg = encodeURIComponent(
    "¡Hola! Estuve visitando la página web de la Iglesia Bíblica Gracia Verdadera y me gustaría recibir más información para acompañarlos."
  );

  return (
    <footer className="bg-ui-dark text-gray-300 py-16 border-t-4 border-brand-primary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Columna 1: Marca y Misión */}
          <div className="space-y-4">
            <Link href="/" className="inline-block mb-6 hover:opacity-90 transition-opacity">
              <Image
                src="/logo-footer.png"
                alt="Logo IBGV"
                width={200}
                height={80}
                className="h-16 w-auto"
              />
            </Link>
            <p className="text-base text-gray-400 leading-relaxed">
              Una comunidad reformada en Manizales donde el centro de absolutamente todo es Jesucristo y su obra en la cruz.
            </p>
          </div>

          {/* Columna 2: Navegación Rápida */}
          <div>
            <h3 className="text-white font-manofa text-xl tracking-wider uppercase mb-6">Explorar</h3>
            <ul className="space-y-3 text-base">
              <li>
                <Link href="/" className="hover:text-brand-light transition-colors">Inicio</Link>
              </li>
              <li>
                <Link href="/nosotros" className="hover:text-brand-light transition-colors">Quiénes Somos</Link>
              </li>
              <li>
                <Link href="/evangelio" className="hover:text-brand-light transition-colors">El Evangelio</Link>
              </li>
              <li>
                <Link href="/#horarios" className="hover:text-brand-light transition-colors">Horarios de Reuniones</Link>
              </li>
            </ul>
          </div>

          {/* Columna 3: Contacto y Ubicación */}
          <div>
            <h3 className="text-white font-manofa text-xl tracking-wider uppercase mb-6">Visítanos</h3>
            <ul className="space-y-4 text-base text-gray-400">
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-primary shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span className="leading-relaxed">Calle 44 No. 23-52 Piso 3<br/>Edificio Cootilca<br/>Manizales, Colombia</span>
              </li>
              <li className="flex items-start gap-3">
                <svg className="w-5 h-5 text-brand-primary shrink-0 mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <div className="flex flex-col space-y-2">
                  <a
                    href={`https://wa.me/573223664386?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline transition-colors flex items-center gap-2"
                  >
                    <span>322 366 4386</span>
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-sm">WhatsApp</span>
                  </a>
                  <a
                    href={`https://wa.me/573016012415?text=${whatsappMsg}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white hover:underline transition-colors flex items-center gap-2"
                  >
                    <span>301 601 2415</span>
                    <span className="text-xs bg-green-600/20 text-green-400 px-2 py-0.5 rounded-sm">WhatsApp</span>
                  </a>
                </div>
              </li>
            </ul>
          </div>

          {/* Columna 4: Redes Sociales */}
          <div>
            <h3 className="text-white font-manofa text-xl tracking-wider uppercase mb-6">Conéctate</h3>
            <div className="flex gap-4">
              {/* YouTube */}
              <a href="https://youtube.com/@ibgvmanizales" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors" aria-label="YouTube IBGV">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.86-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M9.996,15.005l0-6.01L15.224,12L9.996,15.005z"/></svg>
              </a>
              {/* Instagram */}
              <a href="https://www.instagram.com/ibgvmanizales" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors" aria-label="Instagram IBGV">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/></svg>
              </a>
              {/* Spotify */}
              <a href="https://open.spotify.com/show/033I8k275SDuLONqsAOVdA" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors" aria-label="Spotify IBGV">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.477 2 12c0 5.523 4.477 10 10 10s10-4.477 10-10C22 6.477 17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.35-1.434-5.305-1.76-8.786-.963-.335.077-.67-.133-.746-.467-.077-.334.132-.67.467-.745 3.808-.87 7.076-.496 9.715 1.115.293.18.386.563.207.853zm1.19-3.21c-.225.367-.704.482-1.07.257-2.695-1.656-6.804-2.146-9.97-1.176-.412.126-.84-.105-.967-.517-.126-.412.106-.84.518-.968 3.633-1.112 8.18-.567 11.233 1.308.368.225.483.704.256 1.096zm.014-3.34c-3.224-1.916-8.544-2.093-11.606-1.16-.505.154-1.037-.132-1.19-.637-.154-.504.13-1.036.635-1.19 3.51-.107 9.38.093 13.126 2.316.452.268.602.846.335 1.298-.268.453-.846.603-1.3.336z"/></svg>
              </a>
            </div>
          </div>

        </div>

        {/* Copyright */}
        <div className="border-t border-gray-800 mt-12 pt-8 text-center text-base text-gray-500">
          <p>&copy; {currentYear} Iglesia Bíblica Gracia Verdadera. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
}