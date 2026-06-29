const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';
const REQUEST_TIMEOUT_MS = 12000;
const RETRYABLE_STATUS_CODES = new Set([502, 503, 504]);
const timerHost = globalThis;

export async function apiRequest(path, { method = 'GET', body, token } = {}) {
  const attempts = method === 'GET' ? 2 : 1;

  for (let attempt = 0; attempt < attempts; attempt += 1) {
    const controller = new AbortController();
    const timeout = timerHost.setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

    try {
      const response = await fetch(`${API_BASE_URL}${path}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {})
        },
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal
      });

      const data = await response.json().catch(() => ({}));

      if (response.ok) {
        return data;
      }

      if (attempt + 1 < attempts && RETRYABLE_STATUS_CODES.has(response.status)) {
        continue;
      }

      throw new Error(data?.error?.message || `Request failed (${response.status})`);
    } catch (error) {
      if (attempt + 1 < attempts && (error.name === 'TypeError' || error.name === 'AbortError')) {
        continue;
      }

      if (error.name === 'AbortError') {
        throw new Error('The request timed out. Check your connection and try again.');
      }

      if (error.name === 'TypeError') {
        throw new Error('Unable to reach TinySteps. Check your connection and try again.');
      }

      throw error;
    } finally {
      timerHost.clearTimeout(timeout);
    }
  }

  throw new Error('Unable to reach TinySteps. Check your connection and try again.');
}
