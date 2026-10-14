import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge'; // Funciona más rápido en Vercel Edge

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'es-MX-JorgeNeural' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    // Leemos tus credenciales oficiales de Azure
    const apiKey = process.env.AZURE_TTS_KEY;
    const region = process.env.AZURE_TTS_REGION;

    if (!apiKey || !region) {
      console.error('Faltan variables de entorno AZURE_TTS_KEY o AZURE_TTS_REGION');
      return NextResponse.json({ error: 'Faltan credenciales de Azure' }, { status: 500 });
    }

    // Configuración de velocidad según la voz (Solemnidad)
    const isMaleVoice = voice.includes('Jorge') || voice.includes('Alonso');
    const baseRate = isMaleVoice ? '-14%' : '-10%';
    const langCode = voice.substring(0, 5); // ej: "es-MX"

    // Limpiamos el texto para evitar que caracteres especiales rompan el XML
    const cleanText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    // Construimos el SSML (Lenguaje de Marcado de Síntesis de Voz)
    const ssml = `<speak version='1.0' xml:lang='${langCode}'>
      <voice xml:lang='${langCode}' name='${voice}'>
        <prosody rate='${baseRate}' pitch='-1Hz'>
          ${cleanText}
        </prosody>
      </voice>
    </speak>`;

    // URL oficial de Azure Cognitive Services
    const endpoint = `https://${region}.tts.speech.microsoft.com/cognitiveservices/v1`;

    // Hacemos la petición directa a la API oficial de Microsoft
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Ocp-Apim-Subscription-Key': apiKey,
        'Content-Type': 'application/ssml+xml',
        'X-Microsoft-OutputFormat': 'audio-24khz-48kbitrate-mono-mp3',
        'User-Agent': 'ibgv-web-app'
      },
      body: ssml,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error de Azure:', errorText);
      throw new Error(`Azure devolvió error: ${response.status}`);
    }

    // Obtenemos el audio limpio
    const audioBuffer = await response.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400', // El caché evita gastar cuota si alguien repite la lectura hoy
      },
    });

  } catch (error) {
    console.error('Error generando voz oficial de Azure:', error);
    return NextResponse.json({ error: 'No se pudo generar el audio' }, { status: 500 });
  }
}