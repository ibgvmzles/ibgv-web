// ibgv-web/lib/youtube.ts

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
}

export async function getLatestSermonFromPlaylist(): Promise<YouTubeVideo | null> {
  const API_KEY = process.env.GOOGLE_API_KEY?.trim();
  const PLAYLIST_ID = process.env.MAIN_SERIES_PLAYLIST_ID?.trim();

  if (!PLAYLIST_ID) return null;

  // Usamos el endpoint playlistItems para extraer videos de la lista de Romanos
  const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${PLAYLIST_ID}&part=snippet&maxResults=50`;

  try {
    const res = await fetch(url, { next: { revalidate: 43200 } }); // Revalida cada 12 horas

    if (!res.ok) {
      throw new Error('Error fetching YouTube Playlist');
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return null;
    }

    // Ordenamos los videos de la lista para asegurar que obtenemos el más reciente
    const sortedItems = data.items.sort((a: any, b: any) => {
      return new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime();
    });

    const latestItem = sortedItems[0];

    return {
      id: latestItem.snippet.resourceId.videoId,
      title: latestItem.snippet.title,
      // Usamos chaining (?.) por si YouTube no genera miniatura de alta resolución en un video específico
      thumbnail: latestItem.snippet.thumbnails?.high?.url || latestItem.snippet.thumbnails?.default?.url || '',
      date: new Date(latestItem.snippet.publishedAt).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric'
      }),
    };
  } catch (error) {
    console.error('Error en getLatestSermonFromPlaylist:', error);
    return null;
  }
}