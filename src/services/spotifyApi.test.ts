import * as spotify from './spotifyApi';
import { vi, describe, expect, it, beforeEach, afterEach } from 'vitest';

describe('apiRequest', () => {
  beforeEach(() => {
    vi.spyOn(spotify, 'getValidToken').mockResolvedValue('token');
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('returns null for 204 responses', async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 204,
      json: vi.fn(),
    } as unknown as Response);
    (global as any).fetch = fetchMock;

    const result = await spotify.apiRequest('/test');
    expect(result).toBeNull();
  });

  it('parses JSON for 200 responses', async () => {
    const data = { foo: 'bar' };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      status: 200,
      json: vi.fn().mockResolvedValue(data),
    } as unknown as Response);
    (global as any).fetch = fetchMock;

    const result = await spotify.apiRequest<typeof data>('/test');
    expect(result).toEqual(data);
  });
});
