export interface Horario {
  dia: string;
  hora: string;
  actividad: string;
  ubicacion: string;
  tipo: string;
}

export async function getHorarios(): Promise<Horario[]> {
  // El .trim() elimina cualquier espacio accidental al inicio o al final
  const SHEET_ID = process.env.GOOGLE_SHEET_ID?.trim();
  const API_KEY = process.env.GOOGLE_API_KEY?.trim();
  const RANGE = 'Horarios!A2:E20';

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;

  console.log("🕵️ Buscando Excel con ID:", SHEET_ID);

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      // Si falla, le pedimos a Google que nos explique EXACTAMENTE por qué
      const errorText = await res.text();
      console.error("❌ Respuesta de Google:", errorText);
      throw new Error(`Error fetching Google Sheets: ${res.statusText}`);
    }

    const data = await res.json();
    const rows = data.values as string[][];

    if (!rows || rows.length === 0) {
      console.log("⚠️ El Excel fue encontrado, pero parece estar vacío en ese rango.");
      return [];
    }

    return rows.map((row) => ({
      dia: row[0] || '',
      hora: row[1] || '',
      actividad: row[2] || '',
      ubicacion: row[3] || '',
      tipo: row[4] || '',
    }));
  } catch (error) {
    console.error('Error en getHorarios:', error);
    return [];
  }
}