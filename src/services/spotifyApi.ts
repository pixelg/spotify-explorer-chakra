import {
  SpotifyAuthResponse,
  CurrentlyPlayingResponse,
  QueueResponse,
  RecentlyPlayedResponse,
  SpotifyTrack,
  SpotifyArtist,
  TopItemsResponse,
  TimeRange,
  SpotifyPlaylist,
  SpotifyUser,
} from '@/types/spotify';

const CLIENT_ID = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
const AUTH_ENDPOINT = 'https://accounts.spotify.com/authorize';
const TOKEN_ENDPOINT = 'https://accounts.spotify.com/api/token';
const API_BASE_URL = 'https://api.spotify.com/v1';

// PKCE Auth Flow Utilities
const generateRandomString = (length: number): string => {
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  const values = crypto.getRandomValues(new Uint8Array(length));
  return Array.from(values)
    .map(x => possible[x % possible.length])
    .join('');
};

const sha256 = async (plain: string): Promise<ArrayBuffer> => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return await crypto.subtle.digest('SHA-256', data);
};

const base64URLEncode = (buffer: ArrayBuffer): string => {
  return btoa(String.fromCharCode(...new Uint8Array(buffer)))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

// Generate and store code verifier
export const generateCodeVerifier = (): string => {
  const codeVerifier = generateRandomString(64);
  localStorage.setItem('code_verifier', codeVerifier);
  return codeVerifier;
};

// Generate code challenge from verifier
export const generateCodeChallenge = async (codeVerifier: string): Promise<string> => {
  const hashed = await sha256(codeVerifier);
  return base64URLEncode(hashed);
};

// Initiate Spotify authorization with PKCE
export const initiateAuth = async (): Promise<void> => {
  const codeVerifier = generateCodeVerifier();
  const codeChallenge = await generateCodeChallenge(codeVerifier);

  const scope =
    'user-read-private user-read-email user-read-currently-playing user-read-playback-state user-read-recently-played user-top-read playlist-modify-public playlist-modify-private';

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: REDIRECT_URI,
    code_challenge_method: 'S256',
    code_challenge: codeChallenge,
    scope: scope,
  });

  window.location.href = `${AUTH_ENDPOINT}?${params.toString()}`;
};

// Exchange authorization code for access token
export const getAccessToken = async (code: string): Promise<SpotifyAuthResponse> => {
  const codeVerifier = localStorage.getItem('code_verifier') || '';

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: REDIRECT_URI,
    code_verifier: codeVerifier,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to get access token');
  }

  const data: SpotifyAuthResponse = await response.json();

  // Store tokens in localStorage with expiration
  const expiresAt = new Date().getTime() + data.expires_in * 1000;
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token || '');
  localStorage.setItem('expires_at', expiresAt.toString());

  return data;
};

// Refresh access token
export const refreshAccessToken = async (): Promise<SpotifyAuthResponse> => {
  const refreshToken = localStorage.getItem('refresh_token');

  if (!refreshToken) {
    throw new Error('No refresh token available');
  }

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    grant_type: 'refresh_token',
    refresh_token: refreshToken,
  });

  const response = await fetch(TOKEN_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: params.toString(),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data: SpotifyAuthResponse = await response.json();

  // Update tokens in localStorage
  const expiresAt = new Date().getTime() + data.expires_in * 1000;
  localStorage.setItem('access_token', data.access_token);
  if (data.refresh_token) {
    localStorage.setItem('refresh_token', data.refresh_token);
  }
  localStorage.setItem('expires_at', expiresAt.toString());

  return data;
};

// Check if token is expired and refresh if needed
export const getValidToken = async (): Promise<string> => {
  const expiresAt = Number(localStorage.getItem('expires_at') || '0');
  const accessToken = localStorage.getItem('access_token');

  if (!accessToken) {
    throw new Error('No access token available');
  }

  // If token is expired or will expire in the next 5 minutes
  if (new Date().getTime() > expiresAt - 5 * 60 * 1000) {
    const data = await refreshAccessToken();
    return data.access_token;
  }

  return accessToken;
};

// API request helper with automatic token handling
export const apiRequest = async <T, B extends Record<string, unknown> = Record<string, unknown>>(
  endpoint: string,
  method: string = 'GET',
  body?: B
): Promise<T> => {
  const token = await getValidToken();

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

  if (!response.ok) {
    throw new Error(`API request failed: ${response.statusText}`);
  }
if (response.status === 204 || response.status === 205) {
  return null as unknown as T;
}

  return (await response.json()) as T;
};

// API Endpoints

// Get currently playing track
export const getCurrentlyPlaying = (): Promise<CurrentlyPlayingResponse | null> => {
  return apiRequest<CurrentlyPlayingResponse | null>('/me/player/currently-playing');
};

// Get playback queue
export const getQueue = (): Promise<QueueResponse> => {
  return apiRequest<QueueResponse>('/me/player/queue');
};

// Get recently played tracks
export const getRecentlyPlayed = (limit: number = 20): Promise<RecentlyPlayedResponse> => {
  return apiRequest<RecentlyPlayedResponse>(`/me/player/recently-played?limit=${limit}`);
};

// Get user's top artists
export const getTopArtists = (
  timeRange: TimeRange = 'medium_term',
  limit: number = 20
): Promise<TopItemsResponse<SpotifyArtist>> => {
  return apiRequest<TopItemsResponse<SpotifyArtist>>(
    `/me/top/artists?time_range=${timeRange}&limit=${limit}`
  );
};

// Get user's top tracks
export const getTopTracks = (
  timeRange: TimeRange = 'medium_term',
  limit: number = 20
): Promise<TopItemsResponse<SpotifyTrack>> => {
  return apiRequest<TopItemsResponse<SpotifyTrack>>(
    `/me/top/tracks?time_range=${timeRange}&limit=${limit}`
  );
};

// Create a new playlist
export const createPlaylist = (
  userId: string,
  name: string,
  description: string = '',
  isPublic: boolean = true
): Promise<SpotifyPlaylist> => {
  return apiRequest<SpotifyPlaylist>(`/users/${userId}/playlists`, 'POST', {
    name,
    description,
    public: isPublic,
  });
};

// Add tracks to a playlist
export const addTracksToPlaylist = (
  playlistId: string,
  uris: string[]
): Promise<{ snapshot_id: string }> => {
  return apiRequest<{ snapshot_id: string }>(`/playlists/${playlistId}/tracks`, 'POST', { uris });
};

// Get user profile

export const getUserProfile = () => {
  return apiRequest<SpotifyUser>('/me');
};

// Check if user is authenticated
export const isAuthenticated = (): boolean => {
  const accessToken = localStorage.getItem('access_token');
  const expiresAt = Number(localStorage.getItem('expires_at') || '0');

  return !!accessToken && new Date().getTime() < expiresAt;
};

// Logout - clear all auth data
export const logout = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('expires_at');
  localStorage.removeItem('code_verifier');
};
