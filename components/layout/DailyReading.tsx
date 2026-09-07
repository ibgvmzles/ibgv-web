'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

// --- LÓGICA IMPORTADA DE TU SCRIPT ORIGINAL ---
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
              diaLectura.lecturas.push(`AT: ${lecturasATHoy[0].nombre} ${lecturasATHoy[0].cap}`);
          } else {
              let primero = lecturasATHoy[0];
              let ultimo = lecturasATHoy[lecturasATHoy.length - 1];
              if (primero.nombre === ultimo.nombre) {
                  diaLectura.lecturas.push(`AT: ${primero.nombre} ${primero.cap}-${ultimo.cap}`);
              } else {
                  let textoCombinado = lecturasATHoy.map(l => `${l.nombre} ${l.cap}`).join(', ');
                  diaLectura.lecturas.push(`AT: ${textoCombinado}`);
              }
          }
      }

      if (salmoIdx <= 150 && !huboResetHoy) { diaLectura.lecturas.push(`Salmo ${salmoIdx}`); salmoIdx++; }
      let diaMes = fechaActual.getDate();
      diaLectura.lecturas.push(`Proverbios ${diaMes}`);
      let libroNT = NUEVO_TESTAMENTO[ntPointer.bookIdx];
      diaLectura.lecturas.push(`NT: ${libroNT.nombre} ${ntPointer.capIdx}`);
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

export default function DailyReading() {
  const [todayReading, setTodayReading] = useState<{ id: string; fecha: string; lecturas: string[] } | null>(null);

  useEffect(() => {
    const plan = generarPlan();
    // Obtenemos la fecha de hoy local del usuario
    const todayStr = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/Bogota',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(new Date());
    const found = plan.find(d => d.id === todayStr);

    if (found) {
      setTodayReading(found);
    }
  }, []);

  if (!todayReading) return null; // Si no hay lectura hoy, no mostramos nada

  const lecturasLimpias = todayReading.lecturas.map(l => l.replace('AT: ', '').replace('NT: ', ''));

  return (
    <div className="bg-ui-bg border border-gray-100 rounded-sm p-6 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">

      {/* Detalle visual de fondo (Marca de agua centrada) */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-48 md:w-64 h-48 md:h-64 opacity-[0.07] pointer-events-none select-none z-0">
        <img
          src="/icon.png"
          alt="Marca de agua"
          className="w-full h-full object-contain"
        />
      </div>

      <div className="z-10 text-center md:text-left">
        <h3 className="font-manofa text-2xl text-ui-dark mb-1">Lectura de <span className="text-[#DEA6AB]">Hoy</span></h3>
        <p className="text-sm font-bold text-ui-muted uppercase tracking-wide mb-3">{todayReading.fecha}</p>
        <p className="font-oswald text-lg text-ui-dark">{todayReading.lecturas.join(' • ')}</p>
      </div>

      <div className="z-10 flex-shrink-0 w-full md:w-auto">
        {/* Cambiamos la etiqueta <a> externa por un <Link> interno de Next.js */}
        <Link
          href="/lectura"
          className="flex items-center justify-center gap-2 bg-brand-primary text-white px-6 py-3 rounded-sm hover:bg-brand-secondary transition-colors font-medium w-full shadow-md hover:shadow-lg"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
          Leer pasajes
        </Link>
      </div>
    </div>
  );
}