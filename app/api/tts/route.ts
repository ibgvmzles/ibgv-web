import { NextRequest, NextResponse } from 'next/server';
import { MsEdgeTTS, OUTPUT_FORMAT } from 'msedge-tts';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const { text, voice = 'es-MX-JorgeNeural' } = await req.json();

    if (!text || typeof text !== 'string') {
      return NextResponse.json({ error: 'Texto requerido' }, { status: 400 });
    }

    // Si es voz masculina (Jorge o Alonso), reducimos la velocidad base un -14% para que suene solemne y pausada.
    // Si es voz femenina (Dalia), la reducimos un -10%.
    const isMaleVoice = voice.includes('Jorge') || voice.includes('Alonso');
    const baseRate = isMaleVoice ? '-14%' : '-10%';
    const langCode = voice.substring(0, 5); // Ej: "es-MX" o "es-US"

    const tts = new MsEdgeTTS();
    await tts.setMetadata(voice, OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

    // Escapamos caracteres especiales XML
    const cleanText = text
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');

    const ssml = `<speak version="1.0" xmlns="http://www.w3.org/2001/10/synthesis" xml:lang="${langCode}">
      <voice name="${voice}">
        <prosody rate="${baseRate}" pitch="-1Hz">
          ${cleanText}
        </prosody>
      </voice>
    </speak>`;

    const rawResult: any = tts.rawToStream(ssml);
    const stream = rawResult?.audioStream || rawResult;

    const audioBuffer = await new Promise<Buffer>((resolve, reject) => {
      const chunks: Buffer[] = [];
      stream.on('data', (chunk: any) => {
        chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
      });
      stream.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      stream.on('error', (err: any) => {
        reject(err);
      });
    });

    return new NextResponse(new Uint8Array(audioBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'audio/mpeg',
        'Cache-Control': 'public, max-age=86400',
      },
    });
  } catch (error) {
    console.error('Error generando voz neural:', error);
    return NextResponse.json({ error: 'No se pudo generar el audio' }, { status: 500 });
  }
}