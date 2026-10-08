'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CALENDARIO_ORACION } from '@/lib/calendarioOracion';

// --- LÓGICA DEL PLAN DE LECTURA ---
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

const STORAGE_KEY = 'ibgv_lecturas_completadas_v1';

function restarUnDia(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().split('T')[0];
}

function generarPlan() {
  const plan = [];
  const fechaActual = new Date(2026, 1, 1);
  const fechaFin = new Date(2026, 11, 31);
  const atPointer = { bookIdx: 3, capIdx: 7 };
  const ntPointer = { bookIdx: 5, capIdx: 7 };
  let salmoIdx = 124;

  while (fechaActual <= fechaFin) {
    const options: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long' };
    const fechaStr = new Intl.DateTimeFormat('es-CO', options).format(fechaActual);

    const diaLectura = {
      id: fechaActual.toISOString().split('T')[0],
      fecha: fechaStr.charAt(0).toUpperCase() + fechaStr.slice(1),
      lecturas: [] as string[]
    };

    let huboResetHoy = false;
    const capsAtHoy = (salmoIdx <= 150) ? 1 : 2;

    const lecturasATHoy = [];
    for (let i = 0; i < capsAtHoy; i++) {
      const libroAT = ANTIGUO_TESTAMENTO[atPointer.bookIdx];
      lecturasATHoy.push({ nombre: libroAT.nombre, cap: atPointer.capIdx });
      atPointer.capIdx++;
      if (atPointer.capIdx > libroAT.cap) {
        atPointer.bookIdx++;
        atPointer.capIdx = 1;
        if (atPointer.bookIdx >= ANTIGUO_TESTAMENTO.length) {
          atPointer.bookIdx = 0;
          atPointer.capIdx = 1;
          if (salmoIdx > 150) {
            salmoIdx = 1;
            huboResetHoy = true;
            break;
          }
        }
      }
    }

    if (lecturasATHoy.length > 0) {
      if (lecturasATHoy.length === 1) {
        diaLectura.lecturas.push(`${lecturasATHoy[0].nombre} ${lecturasATHoy[0].cap}`);
      } else {
        const primero = lecturasATHoy[0];
        const ultimo = lecturasATHoy[lecturasATHoy.length - 1];
        if (primero.nombre === ultimo.nombre) {
          diaLectura.lecturas.push(`${primero.nombre} ${primero.cap}-${ultimo.cap}`);
        } else {
          const textoCombinado = lecturasATHoy.map(l => `${l.nombre} ${l.cap}`).join(', ');
          diaLectura.lecturas.push(textoCombinado);
        }
      }
    }

    if (salmoIdx <= 150 && !huboResetHoy) {
      diaLectura.lecturas.push(`Salmo ${salmoIdx}`);
      salmoIdx++;
    }
    const diaMes = fechaActual.getDate();
    diaLectura.lecturas.push(`Proverbios ${diaMes}`);
    const libroNT = NUEVO_TESTAMENTO[ntPointer.bookIdx];
    diaLectura.lecturas.push(`${libroNT.nombre} ${ntPointer.capIdx}`);
    ntPointer.capIdx++;
    if (ntPointer.capIdx > libroNT.cap) {
      ntPointer.bookIdx++;
      ntPointer.capIdx = 1;
      if (ntPointer.bookIdx >= NUEVO_TESTAMENTO.length) {
        ntPointer.bookIdx = 0;
        ntPointer.capIdx = 1;
      }
    }

    plan.push(diaLectura);
    fechaActual.setDate(fechaActual.getDate() + 1);
  }
  return plan;
}

export default function DailyReading() {
  const [lecturaHoy, setLecturaHoy] = useState<{ fecha: string; lecturas: string[] } | null>(null);
  const [motivosOracion, setMotivosOracion] = useState<string[]>([]);
  const [racha, setRacha] = useState(0);
  const [completadoHoy, setCompletadoHoy] = useState(false);

  useEffect(() => {
    const plan = generarPlan();

    // Fecha actual en Colombia (YYYY-MM-DD)
    const todayStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());

    // Motivos de oración según el día del mes (1 al 31)
    const diaDelMes = parseInt(todayStr.split('-')[2], 10);
    if (CALENDARIO_ORACION[diaDelMes]) {
      setMotivosOracion(CALENDARIO_ORACION[diaDelMes]);
    }

    const encontrada = plan.find(d => d.id === todayStr);
    if (encontrada) {
      setLecturaHoy(encontrada);
    }

    // Leemos la racha de forma silenciosa para mostrar el detalle minimalista
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      if (guardado) {
        const setFechas = new Set<string>(JSON.parse(guardado));
        const hoyListo = setFechas.has(todayStr);
        setCompletadoHoy(hoyListo);

        let count = 0;
        let cursor = hoyListo ? todayStr : restarUnDia(todayStr);
        while (setFechas.has(cursor)) {
          count++;
          cursor = restarUnDia(cursor);
        }
        setRacha(count);
      }
    } catch (e) {
      // Silencioso en caso de navegador bloqueando storage
    }
  }, []);

  if (!lecturaHoy) return null;

  return (
    <div className="bg-white border-l-4 border-brand-primary p-6 sm:p-8 rounded-sm shadow-sm relative overflow-hidden flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
      <div className="z-10 flex-1 w-full">

        {/* Encabezado superior con insignia minimalista de racha */}
        <div className="flex flex-wrap items-center gap-2.5 mb-1">
          <span className="text-xs font-oswald uppercase tracking-widest text-brand-accent font-semibold">
            Plan de Lectura Bíblica • {lecturaHoy.fecha}
          </span>

          {/* DETALLE MINIMALISTA DE RACHA (Solo visible o resaltado discretamente) */}
          <span className="inline-flex items-center gap-1 text-xs font-oswald font-medium bg-orange-50 text-brand-primary border border-orange-200/70 px-2 py-0.5 rounded-full">
            <span>🔥 {racha} {racha === 1 ? 'día' : 'días'}</span>
          </span>

          {completadoHoy && (
            <span className="inline-flex items-center gap-1 text-xs font-oswald font-medium bg-green-50 text-green-700 border border-green-200 px-2 py-0.5 rounded-full">
              ✓ Completada hoy
            </span>
          )}
        </div>

        <h3 className="font-manofa text-2xl sm:text-3xl text-ui-dark uppercase mb-4">
          Lectura de Hoy
        </h3>

        {/* Pasajes del día */}
        <div className="flex flex-wrap gap-2 mb-5">
          {lecturaHoy.lecturas.map((pasaje, index) => (
            <span
              key={index}
              className="bg-ui-bg text-brand-primary font-oswald px-3.5 py-1.5 rounded-sm text-base font-medium border border-gray-200"
            >
              {pasaje}
            </span>
          ))}
        </div>

        {/* Sección de Oración del Día */}
        {motivosOracion.length > 0 && (
          <div className="pt-4 border-t border-gray-100">
            <div className="flex items-center gap-2 text-brand-primary font-oswald text-sm uppercase tracking-wider font-semibold mb-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>Hoy oramos por:</span>
            </div>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 font-oswald text-base text-gray-700">
              {motivosOracion.map((motivo, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="inline-block w-1.5 h-1.5 rounded-full bg-brand-accent mt-2 flex-shrink-0" />
                  <span>{motivo}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Botón hacia la página de lectura */}
      <div className="z-10 flex-shrink-0 w-full md:w-auto">
        <Link
          href="/lectura"
          className="flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-3.5 rounded-sm hover:bg-brand-secondary transition-colors font-oswald font-medium text-lg w-full shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          {completadoHoy ? 'Repasar lectura' : 'Leer pasajes'}
        </Link>
      </div>
    </div>
  );
}