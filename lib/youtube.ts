// ibgv-web/lib/youtube.ts

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  rawDate?: string; // <-- Agregamos esto aquí
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

// Añade esto al final de ibgv-web/lib/youtube.ts

export interface YouTubePlaylist {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number;
  publishedAt?: string;
}

export async function getAllPlaylists(): Promise<YouTubePlaylist[]> {
  const API_KEY = process.env.GOOGLE_API_KEY?.trim();
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID?.trim();

  if (!API_KEY || !CHANNEL_ID) return [];

  // Usamos el endpoint "playlists" de YouTube
  const url = `https://www.googleapis.com/youtube/v3/playlists?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,contentDetails&maxResults=50`;

  try {
    const res = await fetch(url, { next: { revalidate: 43200 } });

    if (!res.ok) {
      throw new Error('Error fetching Playlists');
    }

    const data = await res.json();

    if (!data.items || data.items.length === 0) {
      return [];
    }

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      // Miniatura de la lista
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      // Cantidad de videos que tiene la lista
      itemCount: item.contentDetails.itemCount,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('Error en getAllPlaylists:', error);
    return [];
  }
}

// Añade esto al final de ibgv-web/lib/youtube.ts

export async function getVideosFromPlaylist(playlistId: string): Promise<YouTubeVideo[]> {
  const API_KEY = process.env.GOOGLE_API_KEY?.trim();
  if (!API_KEY || !playlistId) return [];

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=50`;

  try {
    const res = await fetch(url, { next: { revalidate: 43200 } });
    if (!res.ok) throw new Error('Error fetching Playlist Videos');

    const data = await res.json();
    if (!data.items) return [];

    return data.items
      // Filtramos videos "Privados" o "Eliminados" que a veces quedan ocultos en YouTube
      .filter((item: any) => item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video')
      .map((item: any) => ({
        id: item.snippet.resourceId.videoId,
        title: item.snippet.title,
        thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
        date: new Date(item.snippet.publishedAt).toLocaleDateString('es-CO', {
          year: 'numeric', month: 'short', day: 'numeric'
        }),
        rawDate: item.snippet.publishedAt,
      }));
  } catch (error) {
    console.error('Error en getVideosFromPlaylist:', error);
    return [];
  }
}