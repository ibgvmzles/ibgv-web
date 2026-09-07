import { NextResponse } from 'next/server';

// ID de la NBLA en API.Bible
const BIBLE_ID = 'ce11b813f9a27e20-01';

// Diccionario para traducir los nombres del plan al estándar de la API
const BOOK_MAP: Record<string, string> = {
  "Génesis": "GEN", "Éxodo": "EXO", "Levítico": "LEV", "Números": "NUM",
  "Deuteronomio": "DEU", "Josué": "JOS", "Jueces": "JDG", "Rut": "RUT",
  "1 Samuel": "1SA", "2 Samuel": "2SA", "1 Reyes": "1KI", "2 Reyes": "2KI",
  "1 Crónicas": "1CH", "2 Crónicas": "2CH", "Esdras": "EZR", "Nehemías": "NEH",
  "Ester": "EST", "Job": "JOB", "Salmo": "PSA", "Proverbios": "PRO",
  "Eclesiastés": "ECC", "Cantares": "SNG", "Isaías": "ISA", "Jeremías": "JER",
  "Lamentaciones": "LAM", "Ezequiel": "EZK", "Daniel": "DAN", "Oseas": "HOS",
  "Joel": "JOL", "Amós": "AMO", "Abdías": "OBA", "Jonás": "JON", "Miqueas": "MIC",
  "Nahúm": "NAM", "Habacuc": "HAB", "Sofonías": "ZEP", "Hageo": "HAG",
  "Zacarías": "ZEC", "Malaquías": "MAL", "Mateo": "MAT", "Marcos": "MRK",
  "Lucas": "LUK", "Juan": "JHN", "Hechos": "ACT", "Romanos": "ROM",
  "1 Corintios": "1CO", "2 Corintios": "2CO", "Gálatas": "GAL", "Efesios": "EPH",
  "Filipenses": "PHP", "Colosenses": "COL", "1 Tesalonicenses": "1TH",
  "2 Tesalonicenses": "2TH", "1 Timoteo": "1TI", "2 Timoteo": "2TI",
  "Tito": "TIT", "Filemón": "PHM", "Hebreos": "HEB", "Santiago": "JAS",
  "1 Pedro": "1PE", "2 Pedro": "2PE", "1 Juan": "1JN", "2 Juan": "2JN",
  "3 Juan": "3JN", "Judas": "JUD", "Apocalipsis": "REV"
};

// Función para convertir "Isaías 35-36" a "ISA.35-ISA.36"
function parsePassage(query: string): string | null {
  const match = query.trim().match(/^(.+?)\s+(\d+)(?:-(\d+))?$/);
  if (!match) return null;

  const bookName = match[1].trim();
  const startChap = match[2];
  const endChap = match[3];

  const bookCode = BOOK_MAP[bookName];
  if (!bookCode) return null;

  if (endChap) {
    return `${bookCode}.${startChap}-${bookCode}.${endChap}`;
  }
  return `${bookCode}.${startChap}`;
}

export async function GET(request: Request) {
  // 1. Obtenemos las lecturas desde la URL (ej. ?q=Isaías 35-36,Juan 1)
  const { searchParams } = new URL(request.url);
  const q = searchParams.get('q');

  if (!q) {
    return NextResponse.json({ error: 'Faltan pasajes' }, { status: 400 });
  }

  const apiKey = process.env.BIBLE_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: 'API Key no configurada' }, { status: 500 });
  }

  const queries = q.split(';');
  let htmlContent = '';

  // 2. Por cada lectura, llamamos a API.Bible de forma segura
  for (const query of queries) {
    const passageId = parsePassage(query);
    if (!passageId) continue;

    try {
      const response = await fetch(`https://rest.api.bible/v1/bibles/${BIBLE_ID}/passages/${passageId}?content-type=html&include-notes=false&include-titles=true&include-chapter-numbers=true&include-verse-numbers=true`, {
        headers: {
          'api-key': apiKey,
        },
        // Cacheamos por un día para no gastar la cuota de la API
        next: { revalidate: 86400 }
      });

      if (response.ok) {
        const data = await response.json();
        // Inyectamos un título con el nombre del libro/pasaje justo antes del texto
        htmlContent += `
          <div class="bible-passage mb-16">
            <h2 class="text-2xl sm:text-3xl font-manofa text-brand-primary mb-6 border-b-2 border-[#DEA6AB]/30 pb-3 uppercase tracking-wider flex items-center gap-3">
              <svg class="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
              ${query}
            </h2>
            ${data.data.content}
          </div>
        `;
      }
    } catch (error) {
      console.error(`Error obteniendo ${passageId}:`, error);
    }
  }

  // 3. Devolvemos todo el HTML listo para renderizar
  return NextResponse.json({ html: htmlContent });
}