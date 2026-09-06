// ibgv-web/lib/youtube.ts

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
}

export async function getLatestSermons(): Promise<YouTubeVideo[]> {
  const API_KEY = process.env.GOOGLE_API_KEY?.trim();
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID?.trim();

  // Usamos el endpoint "search" de YouTube para traer los últimos 4 videos del canal
  const url = `https://www.googleapis.com/youtube/v3/search?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=4&type=video`;

  try {
    // Revalidamos cada 12 horas (43200 segundos) para no agotar la cuota gratuita de YouTube
    const res = await fetch(url, { next: { revalidate: 43200 } });

    if (!res.ok) {
      throw new Error('Error fetching YouTube Data');
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      // Usamos la miniatura "high" para que no se vea borrosa
      thumbnail: item.snippet.thumbnails.high.url,
      // Formateamos la fecha (ej. 2026-09-06T12:00:00Z -> 06/09/2026)
      date: new Date(item.snippet.publishedAt).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric'
      }),
    }));
  } catch (error) {
    console.error('Error en getLatestSermons:', error);
    return [];
  }
}