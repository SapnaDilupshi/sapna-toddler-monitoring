import { afterEach, describe, expect, it, vi } from 'vitest';
import { apiRequest } from '../client';

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

function jsonResponse(status, body) {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: async () => body
  };
}

describe('apiRequest', () => {
  it('retries a GET once after a transient gateway error', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse(503, { error: { message: 'Temporarily unavailable' } }))
      .mockResolvedValueOnce(jsonResponse(200, { ok: true }));

    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('/health')).resolves.toEqual({ ok: true });
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('does not retry a mutating request after a server error', async () => {
    const fetchMock = vi.fn().mockResolvedValue(jsonResponse(503, { error: { message: 'Try again later' } }));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('/children', { method: 'POST', body: { nickname: 'Nia' } })).rejects.toThrow(
      'Try again later'
    );
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('shows a friendly message when the network is unreachable', async () => {
    const fetchMock = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'));
    vi.stubGlobal('fetch', fetchMock);

    await expect(apiRequest('/children')).rejects.toThrow('Unable to reach TinySteps. Check your connection and try again.');
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });
});
