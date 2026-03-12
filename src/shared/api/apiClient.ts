export interface ApiErrorPayload {
  status: number;
  message: string;
}

export class ApiError extends Error {
  readonly status: number;

  constructor(payload: ApiErrorPayload) {
    super(payload.message);
    this.name = "ApiError";
    this.status = payload.status;
  }
}

const DEFAULT_HEADERS: HeadersInit = {
  Accept: "application/json",
};

async function parseJson<T>(response: Response): Promise<T> {
  const text = await response.text();
  if (!text) return undefined as unknown as T;
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new ApiError({
      status: response.status,
      message: "Invalid JSON response from API",
    });
  }
}

export async function apiGet<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, {
    ...init,
    method: "GET",
    headers: {
      ...DEFAULT_HEADERS,
      ...(init?.headers ?? {}),
    },
  });

  if (!response.ok) {
    throw new ApiError({
      status: response.status,
      message: `API request failed with status ${response.status}`,
    });
  }

  return parseJson<T>(response);
}
