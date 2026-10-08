// ibgv-web/lib/youtube.ts

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  date: string;
  rawDate?: string;
}

export interface YouTubePlaylist {
  id: string;
  title: string;
  thumbnail: string;
  itemCount: number;
  publishedAt?: string;
}

// Función auxiliar reutilizable para obtener el video más reciente de cualquier Playlist ID
export async function getLatestVideoByPlaylistId(playlistId: string): Promise<YouTubeVideo | null> {
  const API_KEY = process.env.GOOGLE_API_KEY?.trim();
  if (!API_KEY || !playlistId) return null;

  const url = `https://www.googleapis.com/youtube/v3/playlistItems?key=${API_KEY}&playlistId=${playlistId}&part=snippet&maxResults=50`;

  try {
    const res = await fetch(url, { next: { revalidate: 43200 } }); // Revalida cada 12 horas
    if (!res.ok) throw new Error('Error fetching YouTube Playlist');

    const data = await res.json();
    if (!data.items || data.items.length === 0) return null;

    // Filtramos videos privados o eliminados y ordenamos del más reciente al más antiguo
    const validItems = data.items.filter(
      (item: any) => item.snippet.title !== 'Private video' && item.snippet.title !== 'Deleted video'
    );

    if (validItems.length === 0) return null;

    const sortedItems = validItems.sort((a: any, b: any) => {
      return new Date(b.snippet.publishedAt).getTime() - new Date(a.snippet.publishedAt).getTime();
    });

    const latestItem = sortedItems[0];

    return {
      id: latestItem.snippet.resourceId.videoId,
      title: latestItem.snippet.title,
      thumbnail: latestItem.snippet.thumbnails?.high?.url || latestItem.snippet.thumbnails?.default?.url || '',
      date: new Date(latestItem.snippet.publishedAt).toLocaleDateString('es-CO', {
        year: 'numeric', month: 'short', day: 'numeric'
      }),
      rawDate: latestItem.snippet.publishedAt,
    };
  } catch (error) {
    console.error('Error en getLatestVideoByPlaylistId:', error);
    return null;
  }
}

// 1. Último video del Servicio Dominical
export async function getLatestSermonFromPlaylist(): Promise<YouTubeVideo | null> {
  const PLAYLIST_ID = process.env.MAIN_SERIES_PLAYLIST_ID?.trim();
  if (!PLAYLIST_ID) return null;
  return getLatestVideoByPlaylistId(PLAYLIST_ID);
}

// 2. Último video de Estudio Bíblico
export async function getLatestStudyVideo(): Promise<YouTubeVideo | null> {
  // Si defines STUDY_SERIES_PLAYLIST_ID en tu .env.local o Vercel, usa esa lista directamente:
  const ENV_STUDY_ID = process.env.STUDY_SERIES_PLAYLIST_ID?.trim();
  if (ENV_STUDY_ID) {
    return getLatestVideoByPlaylistId(ENV_STUDY_ID);
  }

  // Si no está definida la variable, busca automáticamente en las listas del canal
  const playlists = await getAllPlaylists();
  const mainId = process.env.MAIN_SERIES_PLAYLIST_ID?.trim();

  // Buscamos una lista que contenga palabras clave de estudio bíblico
  const studyPlaylist = playlists.find((p) => {
    if (p.id === mainId) return false;
    const titleLower = p.title.toLowerCase();
    return (
      titleLower.includes('estudio') ||
      titleLower.includes('cristolog') ||
      titleLower.includes('doctrina') ||
      titleLower.includes('esi') ||
      titleLower.includes('escuela')
    );
  }) || playlists.find((p) => p.id !== mainId); // Respaldo: la segunda lista más reciente del canal

  if (!studyPlaylist) return null;
  return getLatestVideoByPlaylistId(studyPlaylist.id);
}

export async function getAllPlaylists(): Promise<YouTubePlaylist[]> {
  const API_KEY = process.env.GOOGLE_API_KEY?.trim();
  const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID?.trim();

  if (!API_KEY || !CHANNEL_ID) return [];

  const url = `https://www.googleapis.com/youtube/v3/playlists?key=${API_KEY}&channelId=${CHANNEL_ID}&part=snippet,contentDetails&maxResults=50`;

  try {
    const res = await fetch(url, { next: { revalidate: 43200 } });
    if (!res.ok) throw new Error('Error fetching Playlists');

    const data = await res.json();
    if (!data.items || data.items.length === 0) return [];

    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails?.high?.url || item.snippet.thumbnails?.default?.url || '',
      itemCount: item.contentDetails.itemCount,
      publishedAt: item.snippet.publishedAt,
    }));
  } catch (error) {
    console.error('Error en getAllPlaylists:', error);
    return [];
  }
}

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