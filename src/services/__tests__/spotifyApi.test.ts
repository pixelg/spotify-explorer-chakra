import { describe, it, expect, vi, afterEach } from 'vitest';
import * as spotifyApi from '../spotifyApi';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('getCurrentlyPlaying', () => {
  it('returns null when response status is 204', async () => {
    vi.spyOn(spotifyApi, 'getValidToken').mockResolvedValue('token');
    global.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 204 }));

    const result = await spotifyApi.getCurrentlyPlaying();
    expect(result).toBeNull();
  });

  it('returns null when response status is 205', async () => {
    vi.spyOn(spotifyApi, 'getValidToken').mockResolvedValue('token');
    global.fetch = vi.fn().mockResolvedValue(new Response(null, { status: 205 }));

    const result = await spotifyApi.getCurrentlyPlaying();
    expect(result).toBeNull();
  });
});
