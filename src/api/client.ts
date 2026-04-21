const isDev = import.meta.env.DEV;

function getBaseUrl(): string {
  const stored = localStorage.getItem('soc_api_url');
  return stored || import.meta.env.VITE_API_URL || 'http://localhost:8000';
}

function log(method: string, url: string, data?: unknown) {
  if (isDev) {
    console.log(`[API] ${method} ${url}`, data ?? '');
  }
}

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public detail?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

function humanizeError(status: number, detail?: string): string {
  if (status === 0 || status === undefined) {
    return 'Cannot reach triage server. Is it running?';
  }
  if (status === 404) {
    return 'Jira ticket not found. Check the issue key and try again.';
  }
  if (status === 408 || status === 504) {
    return 'Triage is taking longer than expected. Check back shortly.';
  }
  if (status >= 500) {
    return detail || 'Triage failed. Please try again or contact support.';
  }
  if (status === 422) {
    return 'Invalid input. Please check the issue key format (e.g., SOC-1234).';
  }
  return detail || `Request failed with status ${status}.`;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const url = `${getBaseUrl()}${path}`;
  log(options.method || 'GET', url, options.body ? JSON.parse(options.body as string) : undefined);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    clearTimeout(timeout);

    const data = await response.json().catch(() => ({}));

    if (isDev) {
      console.log(`[API] Response ${response.status}:`, data);
    }

    if (!response.ok) {
      const detail = (data as { detail?: string }).detail;
      throw new ApiError(response.status, humanizeError(response.status, detail), detail);
    }

    return data as T;
  } catch (err) {
    clearTimeout(timeout);

    if (err instanceof ApiError) throw err;

    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new ApiError(408, 'Triage is taking longer than expected. Check back shortly.');
    }

    // Network error
    throw new ApiError(0, 'Cannot reach triage server. Is it running?');
  }
}

export const apiClient = {
  get: <T>(path: string) => request<T>(path, { method: 'GET' }),
  post: <T>(path: string, body: unknown) =>
    request<T>(path, { method: 'POST', body: JSON.stringify(body) }),
};
