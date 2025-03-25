export interface SpotifyAuthResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token?: string;
  scope: string;
}

export interface SpotifyUser {
  id: string;
  display_name: string;
  email: string;
  images: Array<{ url: string }>;
  product: string;
}

export interface SpotifyTrack {
  id: string;
  name: string;
  artists: SpotifyArtist[];
  album: SpotifyAlbum;
  duration_ms: number;
  popularity: number;
  uri: string;
}

export interface SpotifyArtist {
  id: string;
  name: string;
  genres?: string[];
  images?: Array<{ url: string }>;
  popularity?: number;
}

export interface SpotifyAlbum {
  id: string;
  name: string;
  images: Array<{ url: string; height: number; width: number }>;
  release_date: string;
}

export interface SpotifyPlaylist {
  id: string;
  name: string;
  description: string;
  images: Array<{ url: string }>;
  owner: {
    id: string;
    display_name: string;
  };
  tracks: {
    total: number;
    items?: Array<{
      track: SpotifyTrack;
      added_at: string;
    }>;
  };
}

export interface CurrentlyPlayingResponse {
  item: SpotifyTrack;
  is_playing: boolean;
  progress_ms: number;
}

export interface QueueResponse {
  currently_playing: SpotifyTrack;
  queue: SpotifyTrack[];
}

export interface RecentlyPlayedResponse {
  items: Array<{
    track: SpotifyTrack;
    played_at: string;
  }>;
  next: string | null;
  cursors: {
    after: string;
    before: string;
  };
  limit: number;
  href: string;
}

export interface TopItemsResponse<T> {
  items: T[];
  total: number;
  limit: number;
  offset: number;
  href: string;
  next: string | null;
  previous: string | null;
}

export type TimeRange = 'short_term' | 'medium_term' | 'long_term';
