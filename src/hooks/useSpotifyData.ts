import { useQuery } from '@tanstack/react-query';
import {
  getCurrentlyPlaying,
  getQueue,
  getRecentlyPlayed,
  getTopArtists,
  getTopTracks,
  getUserProfile,
} from '@/services/spotifyApi';
import { TimeRange } from '@/types/spotify';

// Hook for fetching currently playing track
export const useCurrentlyPlaying = () => {
  return useQuery({
    queryKey: ['currentlyPlaying'],
    queryFn: getCurrentlyPlaying,
    refetchInterval: 30000, // Refetch every 30 seconds
    refetchOnWindowFocus: true,
  });
};

// Hook for fetching queue
export const useQueue = () => {
  return useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
    refetchInterval: 30000,
    refetchOnWindowFocus: true,
  });
};

// Hook for fetching recently played tracks
export const useRecentlyPlayed = (limit: number = 20) => {
  return useQuery({
    queryKey: ['recentlyPlayed', limit],
    queryFn: () => getRecentlyPlayed(limit),
    staleTime: 5 * 60 * 1000, // Consider data stale after 5 minutes
  });
};

// Hook for fetching top artists
export const useTopArtists = (timeRange: TimeRange = 'medium_term', limit: number = 20) => {
  return useQuery({
    queryKey: ['topArtists', timeRange, limit],
    queryFn: () => getTopArtists(timeRange, limit),
    staleTime: 60 * 60 * 1000, // Consider data stale after 1 hour
  });
};

// Hook for fetching top tracks
export const useTopTracks = (timeRange: TimeRange = 'medium_term', limit: number = 20) => {
  return useQuery({
    queryKey: ['topTracks', timeRange, limit],
    queryFn: () => getTopTracks(timeRange, limit),
    staleTime: 60 * 60 * 1000,
  });
};

// Hook for fetching user profile
export const useUserProfile = () => {
  return useQuery({
    queryKey: ['userProfile'],
    queryFn: getUserProfile,
    staleTime: 60 * 60 * 1000,
  });
};
