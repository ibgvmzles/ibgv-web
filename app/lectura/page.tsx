'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// --- LÓGICA DEL PLAN DE LECTURA (Sin cambios) ---
const ANTIGUO_TESTAMENTO = [
  { nombre: "Génesis", cap: 50 }, { nombre: "Éxodo", cap: 40 }, { nombre: "Levítico", cap: 27 },
  { nombre: "Números", cap: 36 }, { nombre: "Deuteronomio", cap: 34 }, { nombre: "Josué", cap: 24 },
  { nombre: "Jueces", cap: 21 }, { nombre: "Rut", cap: 4 }, { nombre: "1 Samuel", cap: 31 },
  { nombre: "2 Samuel", cap: 24 }, { nombre: "1 Reyes", cap: 22 }, { nombre: "2 Reyes", cap: 25 },
  { nombre: "1 Crónicas", cap: 29 }, { nombre: "2 Crónicas", cap: 36 }, { nombre: "Esdras", cap: 10 },
  { nombre: "Nehemías", cap: 13 }, { nombre: "Ester", cap: 10 }, { nombre: "Job", cap: 42 },
  { nombre: "Eclesiastés", cap: 12 }, { nombre: "Cantares", cap: 8 }, { nombre: "Isaías", cap: 66 },
  { nombre: "Jeremías", cap: 52 }, { nombre: "Lamentaciones", cap: 5 }, { nombre: "Ezequiel", cap: 48 },
  { nombre: "Daniel", cap: 12 }, { nombre: "Oseas", cap: 14 }, { nombre: "Joel", cap: 3 },
  { nombre: "Amós", cap: 9 }, { nombre: "Abdías", cap: 1 }, { nombre: "Jonás", cap: 4 },
  { nombre: "Miqueas", cap: 7 }, { nombre: "Nahúm", cap: 3 }, { nombre: "Habacuc", cap: 3 },
  { nombre: "Sofonías", cap: 3 }, { nombre: "Hageo", cap: 2 }, { nombre: "Zacarías", cap: 14 },
  { nombre: "Malaquías", cap: 4 }
];

const NUEVO_TESTAMENTO = [
  { nombre: "Mateo", cap: 28 }, { nombre: "Marcos", cap: 16 }, { nombre: "Lucas", cap: 24 },
  { nombre: "Juan", cap: 21 }, { nombre: "Hechos", cap: 28 }, { nombre: "Romanos", cap: 16 },
  { nombre: "1 Corintios", cap: 16 }, { nombre: "2 Corintios", cap: 13 }, { nombre: "Gálatas", cap: 6 },
  { nombre: "Efesios", cap: 6 }, { nombre: "Filipenses", cap: 4 }, { nombre: "Colosenses", cap: 4 },
  { nombre: "1 Tesalonicenses", cap: 5 }, { nombre: "2 Tesalonicenses", cap: 3 }, { nombre: "1 Timoteo", cap: 6 },
  { nombre: "2 Timoteo", cap: 4 }, { nombre: "Tito", cap: 3 }, { nombre: "Filemón", cap: 1 },
  { nombre: "Hebreos", cap: 13 }, { nombre: "Santiago", cap: 5 }, { nombre: "1 Pedro", cap: 5 },
  { nombre: "2 Pedro", cap: 3 }, { nombre: "1 Juan", cap: 5 }, { nombre: "2 Juan", cap: 1 },
  { nombre: "3 Juan", cap: 1 }, { nombre: "Judas", cap: 1 }, { nombre: "Apocalipsis", cap: 22 }
];

function generarPlan() {
  let plan = [];
  let fechaActual = new Date(2026, 1, 1);
  const fechaFin = new Date(2026, 11, 31);
  let atPointer = { bookIdx: 3, capIdx: 7 };
  let ntPointer = { bookIdx: 5, capIdx: 7 };
  let salmoIdx = 124;

  while (fechaActual <= fechaFin) {
      let options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
      let fechaStr = new Intl.DateTimeFormat('es-CO', options).format(fechaActual);

      let diaLectura = {
          id: fechaActual.toISOString().split('T')[0],
          fecha: fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1),
          lecturas: [] as string[]
      };

      let huboResetHoy = false;
      let capsAtHoy = (salmoIdx <= 150) ? 1 : 2;

      let lecturasATHoy = [];
      for (let i = 0; i < capsAtHoy; i++) {
          let libroAT = ANTIGUO_TESTAMENTO[atPointer.bookIdx];
          lecturasATHoy.push({ nombre: libroAT.nombre, cap: atPointer.capIdx });
          atPointer.capIdx++;
          if (atPointer.capIdx > libroAT.cap) {
              atPointer.bookIdx++;
              atPointer.capIdx = 1;
              if (atPointer.bookIdx >= ANTIGUO_TESTAMENTO.length) {
                  atPointer.bookIdx = 0; atPointer.capIdx = 1;
                  if (salmoIdx > 150) { salmoIdx = 1; huboResetHoy = true; break; }
              }
          }
      }

      if (lecturasATHoy.length > 0) {
          if (lecturasATHoy.length === 1) {
              diaLectura.lecturas.push(`${lecturasATHoy[0].nombre} ${lecturasATHoy[0].cap}`);
          } else {
              let primero = lecturasATHoy[0];
              let ultimo = lecturasATHoy[lecturasATHoy.length - 1];
              if (primero.nombre === ultimo.nombre) {
                  diaLectura.lecturas.push(`${primero.nombre} ${primero.cap}-${ultimo.cap}`);
              } else {
                  let textoCombinado = lecturasATHoy.map(l => `${l.nombre} ${l.cap}`).join(', ');
                  diaLectura.lecturas.push(textoCombinado);
              }
          }
      }

      if (salmoIdx <= 150 && !huboResetHoy) { diaLectura.lecturas.push(`Salmo ${salmoIdx}`); salmoIdx++; }
      let diaMes = fechaActual.getDate();
      diaLectura.lecturas.push(`Proverbios ${diaMes}`);
      let libroNT = NUEVO_TESTAMENTO[ntPointer.bookIdx];
      diaLectura.lecturas.push(`${libroNT.nombre} ${ntPointer.capIdx}`);
      ntPointer.capIdx++;
      if (ntPointer.capIdx > libroNT.cap) {
          ntPointer.bookIdx++; ntPointer.capIdx = 1;
          if (ntPointer.bookIdx >= NUEVO_TESTAMENTO.length) { ntPointer.bookIdx = 0; ntPointer.capIdx = 1; }
      }

      plan.push(diaLectura);
      fechaActual.setDate(fechaActual.getDate() + 1);
  }
  return plan;
}

export default function PaginaLectura() {
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isXLarge, setIsXLarge] = useState(false);
  const [isSepia, setIsSepia] = useState(false);
  const [isClassicFont, setIsClassicFont] = useState(true); // Lora como opción predeterminada
  const [fechaHoy, setFechaHoy] = useState('');

  useEffect(() => {
    const fetchLectura = async () => {
      const plan = generarPlan();
      const todayStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit'
      }).format(new Date());

      const todayReading = plan.find(d => d.id === todayStr);

      if (todayReading) {
        setFechaHoy(todayReading.fecha);
        const pasajes = todayReading.lecturas.join(';');

        try {
          const res = await fetch(`/api/biblia?q=${encodeURIComponent(pasajes)}`);
          const data = await res.json();
          if (data.html) {
            setHtmlContent(data.html);
          } else {
            setHtmlContent('<p>No se pudo cargar la lectura hoy.</p>');
          }
        } catch (error) {
          setHtmlContent('<p>Error de conexión al cargar la Biblia.</p>');
        }
      }
      setLoading(false);
    };

    fetchLectura();
  }, []);

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isSepia ? 'bg-[#fbf0d9]' : 'bg-ui-bg'}`}>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        <Link href="/" className="inline-flex items-center text-brand-primary font-medium hover:underline mb-6 font-oswald">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Volver al Inicio
        </Link>

        <header className="mb-8 border-b border-gray-200/50 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="font-manofa text-3xl sm:text-4xl text-ui-dark uppercase">Lectura Diaria</h1>
            <p className="font-oswald text-brand-accent mt-1">{fechaHoy || 'Cargando fecha...'}</p>
          </div>

          {/* CONTROLES DE UX: TIPOGRAFÍA, COLOR Y TAMAÑO */}
          <div className="flex flex-wrap gap-4 font-oswald">

            {/* Control de Tipografía */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pl-1">Letra</span>
              <div className="flex bg-black/5 rounded-sm p-1">
                <button
                  onClick={() => setIsClassicFont(false)}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${!isClassicFont ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Moderna
                </button>
                <button
                  onClick={() => setIsClassicFont(true)}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${isClassicFont ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Clásica
                </button>
              </div>
            </div>

            {/* Control de Color */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pl-1">Fondo</span>
              <div className="flex bg-black/5 rounded-sm p-1">
                <button
                  onClick={() => setIsSepia(false)}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${!isSepia ? 'bg-white text-ui-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Claro
                </button>
                <button
                  onClick={() => setIsSepia(true)}
                  className={`px-3 py-1 text-sm font-medium rounded-sm transition-colors ${isSepia ? 'bg-[#f4e3c5] text-ui-dark shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Sepia
                </button>
              </div>
            </div>

            {/* Control de Tamaño */}
            <div className="flex flex-col gap-1.5">
              <span className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider pl-1">Tamaño</span>
              <div className="flex bg-black/5 rounded-sm p-1">
                <button
                  onClick={() => setIsXLarge(false)}
                  className={`px-4 py-1 text-sm font-medium rounded-sm transition-colors ${!isXLarge ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Aa
                </button>
                <button
                  onClick={() => setIsXLarge(true)}
                  className={`px-4 py-1 text-sm font-medium rounded-sm transition-colors ${isXLarge ? 'bg-white text-brand-primary shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  AA
                </button>
              </div>
            </div>

          </div>
        </header>

        {/* CONTENEDOR DE LECTURA */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-brand-light">
            <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
          </div>
        ) : (
          <>
            <div
              // Alternamos entre font-oswald y nuestra nueva clase font-lora
              className={`leading-relaxed text-ui-dark transition-all duration-300 ${isXLarge ? 'text-2xl' : 'text-lg'} ${isClassicFont ? 'font-lora' : 'font-oswald'}`}
              style={{ '--verse-color': '#AB5C5E' } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            <div className="mt-16 pt-8 border-t border-gray-200/50 text-center pb-12 font-oswald">
              <Link href="/">
                <button className="bg-brand-primary hover:bg-brand-secondary text-white font-medium py-4 px-8 rounded-sm shadow-md transition-all transform hover:scale-105">
                  ¡He terminado mi lectura de hoy! 🎉
                </button>
              </Link>
            </div>
          </>
        )}

        <style dangerouslySetInnerHTML={{__html: `
          /* Importamos la fuente Lora desde Google Fonts directamente aquí */
          @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');

          .font-lora { font-family: 'Lora', serif; }

          .bible-passage p { margin-bottom: 1.2em; text-align: justify; }
          .bible-passage .v { font-weight: bold; color: var(--verse-color); font-size: 0.75em; vertical-align: super; margin-right: 5px; opacity: 0.8; font-family: var(--font-oswald), sans-serif; }
          .bible-passage .s { font-family: var(--font-manofa); font-size: 1.3em; margin-top: 1.5em; margin-bottom: 0.8em; color: var(--color-brand-primary); }
          .bible-passage .q { margin-left: 1.5em; display: block; }
          .bible-passage .q1 { margin-left: 1.5em; display: block; }
          .bible-passage .q2 { margin-left: 3em; display: block; }
          .bible-passage .c { font-family: var(--font-manofa); font-size: 1.5em; color: var(--color-brand-secondary); display: block; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 1px solid #eee; padding-bottom: 5px; }
        `}} />
      </div>
    </div>
  );
}