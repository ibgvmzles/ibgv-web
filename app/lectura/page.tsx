'use client';

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
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

type NeuralVoice = 'es-MX-JorgeNeural' | 'es-US-AlonsoNeural' | 'es-MX-DaliaNeural';

function restarUnDia(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return dt.toISOString().split('T')[0];
}

function calcularEstadisticasRacha(fechasCompletadas: string[], todayStr: string) {
  const setFechas = new Set(fechasCompletadas);
  const totalDias = setFechas.size;
  const completadoHoy = setFechas.has(todayStr);

  let racha = 0;
  let cursor = completadoHoy ? todayStr : restarUnDia(todayStr);

  while (setFechas.has(cursor)) {
    racha++;
    cursor = restarUnDia(cursor);
  }

  return { totalDias, racha, completadoHoy };
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

export default function PaginaLectura() {
  const router = useRouter();
  const [htmlContent, setHtmlContent] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isXLarge, setIsXLarge] = useState(false);
  const [isSepia, setIsSepia] = useState(false);
  const [isClassicFont, setIsClassicFont] = useState(true);
  const [fechaHoy, setFechaHoy] = useState('');
  const [todayIso, setTodayIso] = useState('');
  const [motivosOracion, setMotivosOracion] = useState<string[]>([]);

  // Estados para racha
  const [diasCompletados, setDiasCompletados] = useState(0);
  const [rachaActual, setRachaActual] = useState(0);
  const [completadoHoy, setCompletadoHoy] = useState(false);

  // --- ESTADOS Y REFS PARA VOZ NEURAL ---
  const [audioStatus, setAudioStatus] = useState<'idle' | 'loading' | 'playing' | 'paused'>('idle');
  const [selectedVoice, setSelectedVoice] = useState<NeuralVoice>('es-MX-JorgeNeural');
  const [playbackSpeed, setPlaybackSpeed] = useState<number>(1.0);
  const [currentChunkIdx, setCurrentChunkIdx] = useState(0);
  const [totalChunks, setTotalChunks] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const chunksRef = useRef<string[]>([]);
  const audioCacheRef = useRef<Map<string, string>>(new Map());
  const isCancelledRef = useRef<boolean>(false);

  useEffect(() => {
    const fetchLectura = async () => {
      const plan = generarPlan();

      const todayStr = new Intl.DateTimeFormat('en-CA', {
        timeZone: 'America/Bogota',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }).format(new Date());

      setTodayIso(todayStr);

      try {
        const guardado = localStorage.getItem(STORAGE_KEY);
        const listaFechas: string[] = guardado ? JSON.parse(guardado) : [];
        const stats = calcularEstadisticasRacha(listaFechas, todayStr);
        setDiasCompletados(stats.totalDias);
        setRachaActual(stats.racha);
        setCompletadoHoy(stats.completadoHoy);
      } catch (e) {
        console.error('Error leyendo racha en localStorage:', e);
      }

      const diaDelMes = parseInt(todayStr.split('-')[2], 10);
      if (CALENDARIO_ORACION[diaDelMes]) {
        setMotivosOracion(CALENDARIO_ORACION[diaDelMes]);
      }

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

    return () => {
      detenerAudio();
    };
  }, []);

  // Extrae el texto limpio sin números de versículos y lo divide en bloques ágiles (~1200 caracteres)
  const prepararFragmentosDeLectura = (): string[] => {
    if (!htmlContent) return [];
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = htmlContent;

    // Quitamos los numeritos de versículo (.v) para que no interrumpan las frases
    tempDiv.querySelectorAll('.v').forEach(el => el.remove());

    // Convertimos números de capítulo (.c) en pausa hablada ("Capítulo X.")
    tempDiv.querySelectorAll('.c').forEach(el => {
      el.textContent = ` Capítulo ${el.textContent?.trim()}. `;
    });

    // Aseguramos pausa en títulos y subtítulos
    tempDiv.querySelectorAll('h2, h3, .s').forEach(el => {
      el.textContent = ` ${el.textContent?.trim()}. `;
    });

    const rawText = (tempDiv.textContent || tempDiv.innerText || '')
      .replace(/\s+/g, ' ')
      .trim();

    const oraciones = rawText.match(/[^.!?]+[.!?]+/g) || [rawText];
    const bloques: string[] = [];
    let bloqueActual = '';

    for (const oracion of oraciones) {
      if ((bloqueActual + ' ' + oracion).length > 1100 && bloqueActual.length > 0) {
        bloques.push(bloqueActual.trim());
        bloqueActual = oracion;
      } else {
        bloqueActual += ' ' + oracion;
      }
    }
    if (bloqueActual.trim().length > 0) {
      bloques.push(bloqueActual.trim());
    }

    return bloques;
  };

  // Descarga un fragmento desde nuestra API /api/tts (y lo guarda en memoria por si lo repite)
  const obtenerAudioUrlDeFragmento = async (index: number, voice: string): Promise<string | null> => {
    const texto = chunksRef.current[index];
    if (!texto) return null;

    const cacheKey = `${voice}_${index}`;
    if (audioCacheRef.current.has(cacheKey)) {
      return audioCacheRef.current.get(cacheKey)!;
    }

    const res = await fetch('/api/tts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text: texto, voice }),
    });

    if (!res.ok) throw new Error('Error en servidor TTS');

    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    audioCacheRef.current.set(cacheKey, url);
    return url;
  };

  // Reproduce un bloque y pre-carga el siguiente en segundo plano
  const reproducirFragmento = async (index: number, voice: string) => {
    if (isCancelledRef.current) return;

    if (index >= chunksRef.current.length) {
      setAudioStatus('idle');
      setCurrentChunkIdx(0);
      return;
    }

    setCurrentChunkIdx(index);
    setAudioStatus('loading');

    try {
      const audioUrl = await obtenerAudioUrlDeFragmento(index, voice);
      if (isCancelledRef.current || !audioUrl) return;

      // Pre-cargamos el siguiente bloque silenciosamente mientras suena el actual
      if (index + 1 < chunksRef.current.length) {
        obtenerAudioUrlDeFragmento(index + 1, voice).catch(() => {});
      }

      if (!audioRef.current) {
        audioRef.current = new Audio();
      }

      audioRef.current.src = audioUrl;
      audioRef.current.playbackRate = playbackSpeed;

      audioRef.current.onended = () => {
        if (!isCancelledRef.current) {
          reproducirFragmento(index + 1, voice);
        }
      };

      await audioRef.current.play();
      setAudioStatus('playing');
    } catch (error) {
      console.error('Error reproduciendo audio neural:', error);
      setAudioStatus('idle');
    }
  };

  const handlePlayPauseAudio = () => {
    if (audioStatus === 'playing') {
      audioRef.current?.pause();
      setAudioStatus('paused');
      return;
    }

    if (audioStatus === 'paused' && audioRef.current) {
      audioRef.current.play();
      setAudioStatus('playing');
      return;
    }

    // Inicia desde cero o desde el fragmento actual
    isCancelledRef.current = false;
    if (chunksRef.current.length === 0) {
      const generados = prepararFragmentosDeLectura();
      chunksRef.current = generados;
      setTotalChunks(generados.length);
    }

    reproducirFragmento(currentChunkIdx, selectedVoice);
  };

  const detenerAudio = () => {
    isCancelledRef.current = true;
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    setAudioStatus('idle');
    setCurrentChunkIdx(0);
  };

  const cambiarVoz = (nuevaVoz: NeuralVoice) => {
    setSelectedVoice(nuevaVoz);
    if (audioStatus === 'playing' || audioStatus === 'paused') {
      if (audioRef.current) audioRef.current.pause();
      isCancelledRef.current = false;
      reproducirFragmento(currentChunkIdx, nuevaVoz);
    }
  };

  const cambiarVelocidad = (nuevaVel: number) => {
    setPlaybackSpeed(nuevaVel);
    if (audioRef.current) {
      audioRef.current.playbackRate = nuevaVel;
    }
  };

  const toggleLecturaHoy = (forzarCompletado?: boolean) => {
    if (!todayIso) return;
    try {
      const guardado = localStorage.getItem(STORAGE_KEY);
      const listaFechas: string[] = guardado ? JSON.parse(guardado) : [];
      const setFechas = new Set(listaFechas);

      const nuevoEstado = forzarCompletado !== undefined ? forzarCompletado : !setFechas.has(todayIso);

      if (nuevoEstado) {
        setFechas.add(todayIso);
      } else {
        setFechas.delete(todayIso);
      }

      const nuevoArray = Array.from(setFechas);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nuevoArray));

      const stats = calcularEstadisticasRacha(nuevoArray, todayIso);
      setDiasCompletados(stats.totalDias);
      setRachaActual(stats.racha);
      setCompletadoHoy(stats.completadoHoy);
    } catch (e) {
      console.error('Error guardando racha en localStorage:', e);
    }
  };

  const handleFinalizarAbajo = () => {
    detenerAudio();
    toggleLecturaHoy(true);
    setTimeout(() => {
      router.push('/');
    }, 650);
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${isSepia ? 'bg-[#fbf0d9]' : 'bg-ui-bg'}`}>
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">

        {/* Botón Volver */}
        <Link href="/" className="inline-flex items-center text-brand-primary font-medium hover:underline mb-6 font-oswald">
          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al Inicio
        </Link>

        {/* Encabezado y Controles de UX */}
        <header className="mb-6 border-b border-gray-200/50 pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <h1 className="font-manofa text-3xl sm:text-4xl text-ui-dark uppercase">Lectura Diaria</h1>
            <p className="font-oswald text-brand-accent mt-1">{fechaHoy || 'Cargando fecha...'}</p>
          </div>

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

        {/* =========================================
            MEDIDOR DE PROGRESO Y RACHA (Con Casilla Rápida)
            ========================================= */}
        <section className="mb-6 font-oswald">
          <div className="grid grid-cols-2 gap-4 sm:gap-6 mb-4">
            <div
              className={`p-5 sm:p-6 rounded-xl shadow-xs border text-center transition-colors duration-500 ${
                isSepia ? 'bg-[#f4e3c5]/80 border-[#e4cfa6]' : 'bg-white border-gray-100'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-500 block mb-1">
                Días Completados
              </span>
              <span className="text-3xl sm:text-4xl font-bold text-brand-primary">
                {diasCompletados}
              </span>
            </div>

            <div
              className={`p-5 sm:p-6 rounded-xl shadow-xs border text-center transition-colors duration-500 ${
                isSepia ? 'bg-[#f4e3c5]/80 border-[#e4cfa6]' : 'bg-white border-gray-100'
              }`}
            >
              <span className="text-xs sm:text-sm font-bold tracking-wider uppercase text-slate-500 block mb-1">
                Racha Actual
              </span>
              <div className="flex items-center justify-center gap-1.5">
                <span className="text-3xl sm:text-4xl font-bold text-brand-primary">
                  {rachaActual}
                </span>
                <span className="text-2xl sm:text-3xl" role="img" aria-label="Fuego">
                  🔥
                </span>
              </div>
            </div>
          </div>

          {/* Casilla superior para confirmar lectura */}
          <button
            type="button"
            onClick={() => toggleLecturaHoy()}
            className={`w-full py-3 px-4 rounded-lg border flex items-center justify-between transition-all cursor-pointer ${
              completadoHoy
                ? 'bg-green-50/90 border-green-300 text-green-900'
                : isSepia
                ? 'bg-[#f4e3c5]/50 border-[#e4cfa6] text-ui-dark hover:bg-[#f4e3c5]'
                : 'bg-white border-gray-200 text-ui-dark hover:bg-gray-50'
            }`}
          >
            <div className="flex items-center gap-3 text-left">
              <div
                className={`w-5 h-5 rounded-xs flex items-center justify-center border transition-colors ${
                  completadoHoy
                    ? 'bg-green-600 border-green-600 text-white'
                    : 'border-gray-400 bg-white'
                }`}
              >
                {completadoHoy && (
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </div>
              <span className="text-sm sm:text-base font-medium">
                {completadoHoy
                  ? '¡Lectura de hoy completada! Gracias a Dios por Su Palabra.'
                  : 'Marcar mi lectura de hoy como completada'}
              </span>
            </div>

            {completadoHoy && (
              <span className="text-xs font-semibold uppercase tracking-wider bg-green-200/70 text-green-800 px-2.5 py-0.5 rounded-full shrink-0">
                +1 día 🔥
              </span>
            )}
          </button>
        </section>

        {/* =========================================
            REPRODUCTOR DE VOZ NEURAL GUIADA
            ========================================= */}
        {!loading && htmlContent && (
          <section
            className={`mb-10 p-4 sm:p-5 rounded-xl border font-oswald transition-colors duration-500 ${
              isSepia ? 'bg-[#f4e3c5]/90 border-[#e4cfa6]' : 'bg-white border-gray-200 shadow-xs'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* Botones Principales de Audio */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={handlePlayPauseAudio}
                  disabled={audioStatus === 'loading'}
                  className={`inline-flex items-center gap-2.5 px-5 py-2.5 rounded-sm font-medium text-white shadow-sm transition-all cursor-pointer ${
                    audioStatus === 'playing'
                      ? 'bg-amber-600 hover:bg-amber-700'
                      : 'bg-brand-primary hover:bg-brand-secondary'
                  } disabled:opacity-70`}
                >
                  {audioStatus === 'loading' ? (
                    <>
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Preparando voz neural...</span>
                    </>
                  ) : audioStatus === 'playing' ? (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                      </svg>
                      <span>Pausar lectura</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z" />
                      </svg>
                      <span>{audioStatus === 'paused' ? 'Reanudar lectura' : 'Escuchar lectura guiada'}</span>
                    </>
                  )}
                </button>

                {(audioStatus === 'playing' || audioStatus === 'paused') && (
                  <button
                    type="button"
                    onClick={detenerAudio}
                    className="px-3 py-2 text-sm text-gray-600 hover:text-red-700 font-medium transition-colors cursor-pointer"
                  >
                    Reiniciar
                  </button>
                )}
              </div>

              {/* Selectores de Narrador Neutro y Velocidad */}
              <div className="flex flex-wrap items-center gap-3 text-sm">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-wider text-gray-400">Voz:</span>
                  <div className="flex bg-black/5 rounded-xs p-0.5">
                    <button
                      type="button"
                      onClick={() => cambiarVoz('es-MX-JorgeNeural')}
                      className={`px-2.5 py-1 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                        selectedVoice === 'es-MX-JorgeNeural'
                          ? 'bg-white text-brand-primary shadow-2xs'
                          : 'text-gray-600 hover:text-ui-dark'
                      }`}
                    >
                      Jorge (Neutro)
                    </button>
                    <button
                      type="button"
                      onClick={() => cambiarVoz('es-US-AlonsoNeural')}
                      className={`px-2.5 py-1 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                        selectedVoice === 'es-US-AlonsoNeural'
                          ? 'bg-white text-brand-primary shadow-2xs'
                          : 'text-gray-600 hover:text-ui-dark'
                      }`}
                    >
                      Alonso (Profundo)
                    </button>
                    <button
                      type="button"
                      onClick={() => cambiarVoz('es-MX-DaliaNeural')}
                      className={`px-2.5 py-1 rounded-xs text-xs font-medium transition-colors cursor-pointer ${
                        selectedVoice === 'es-MX-DaliaNeural'
                          ? 'bg-white text-brand-primary shadow-2xs'
                          : 'text-gray-600 hover:text-ui-dark'
                      }`}
                    >
                      Dalia
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <span className="text-xs uppercase tracking-wider text-gray-400">Ritmo:</span>
                  <select
                    value={playbackSpeed}
                    onChange={(e) => cambiarVelocidad(parseFloat(e.target.value))}
                    className="bg-black/5 rounded-xs px-2 py-1 text-xs text-ui-dark font-medium focus:outline-none cursor-pointer"
                  >
                    <option value={0.85}>Muy pausado (0.85x)</option>
                    <option value={0.92}>Pausado (0.92x)</option>
                    <option value={1.0}>Normal (1.0x)</option>
                    <option value={1.1}>Ágil (1.1x)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Barra de avance por secciones cuando está activo */}
            {totalChunks > 0 && (audioStatus === 'playing' || audioStatus === 'paused' || audioStatus === 'loading') && (
              <div className="mt-3 pt-3 border-t border-black/5 flex items-center justify-between gap-3 text-xs text-gray-500">
                <span>
                  Narrando sección {currentChunkIdx + 1} de {totalChunks}
                </span>
                <div className="flex-1 max-w-xs h-1.5 bg-black/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-primary transition-all duration-300"
                    style={{ width: `${Math.round(((currentChunkIdx + 1) / totalChunks) * 100)}%` }}
                  />
                </div>
              </div>
            )}
          </section>
        )}

        {/* Contenedor Principal */}
        {loading ? (
          <div className="flex justify-center items-center h-64 text-brand-light">
            <svg className="animate-spin h-10 w-10" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
          <>
            {/* Texto Bíblico */}
            <div
              className={`leading-relaxed text-ui-dark transition-all duration-300 ${isXLarge ? 'text-2xl' : 'text-lg'} ${isClassicFont ? 'font-lora' : 'font-oswald'}`}
              style={{ '--verse-color': '#AB5C5E' } as React.CSSProperties}
              dangerouslySetInnerHTML={{ __html: htmlContent }}
            />

            {/* Tarjeta del Calendario de Oración del Día */}
            {motivosOracion.length > 0 && (
              <section
                className={`mt-14 p-6 sm:p-8 rounded-sm border-l-4 border-brand-primary transition-colors duration-500 shadow-sm ${
                  isSepia ? 'bg-[#f4e3c5]/70' : 'bg-white'
                }`}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 rounded-full bg-brand-primary/10 text-brand-primary flex-shrink-0">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-manofa text-xl sm:text-2xl text-brand-primary uppercase tracking-wide">
                      Motivos de Oración de Hoy
                    </h3>
                    <p className="font-oswald text-sm text-gray-500">
                      Unidos como iglesia intercediendo los unos por los otros
                    </p>
                  </div>
                </div>

                <ul className={`space-y-3 mt-5 ${isXLarge ? 'text-xl' : 'text-base'} ${isClassicFont ? 'font-lora' : 'font-oswald'}`}>
                  {motivosOracion.map((motivo, idx) => (
                    <li key={idx} className="flex items-start gap-3 text-ui-dark">
                      <span className="inline-block w-2 h-2 rounded-full bg-brand-accent mt-2.5 flex-shrink-0" />
                      <span className="leading-relaxed">{motivo}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}

            {/* Botón de Finalización */}
            <div className="mt-12 pt-8 border-t border-gray-200/50 text-center pb-12 font-oswald">
              <button
                type="button"
                onClick={handleFinalizarAbajo}
                className={`font-medium py-4 px-8 rounded-sm shadow-md transition-all transform hover:scale-105 cursor-pointer ${
                  completadoHoy
                    ? 'bg-green-700 hover:bg-green-800 text-white'
                    : 'bg-brand-primary hover:bg-brand-secondary text-white'
                }`}
              >
                {completadoHoy
                  ? '✅ ¡Lectura y oración registradas hoy! Volver al inicio'
                  : '¡He terminado mi lectura y oración de hoy! 🎉'}
              </button>
            </div>
          </>
        )}

        {/* Estilos Globales para el contenido de la API */}
        <style dangerouslySetInnerHTML={{
          __html: `
            @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;0,600;1,400&display=swap');

            .font-lora { font-family: 'Lora', serif; }

            .bible-passage p { margin-bottom: 1.2em; text-align: justify; }
            .bible-passage .v { font-weight: bold; color: var(--verse-color); font-size: 0.75em; vertical-align: super; margin-right: 5px; opacity: 0.8; font-family: var(--font-oswald), sans-serif; }
            .bible-passage .s { font-family: var(--font-manofa); font-size: 1.3em; margin-top: 1.5em; margin-bottom: 0.8em; color: var(--color-brand-primary); }
            .bible-passage .q { margin-left: 1.5em; display: block; }
            .bible-passage .q1 { margin-left: 1.5em; display: block; }
            .bible-passage .q2 { margin-left: 3em; display: block; }
            .bible-passage .c { font-family: var(--font-manofa); font-size: 1.5em; color: var(--color-brand-secondary); display: block; margin-top: 1.5em; margin-bottom: 0.5em; border-bottom: 1px solid #eee; padding-bottom: 5px; }
          `
        }} />
      </div>
    </div>
  );
}