/**
 * Centralized API client for all frontend requests.
 * Provides consistent error handling, logging, and retry logic.
 */

interface ApiResponse<T> {
    data?: T;
    error?: string;
    status: number;
}

interface ApiRequestOptions {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    body?: Record<string, unknown>;
    timeout?: number;
    retries?: number;
}

const DEFAULT_TIMEOUT = 30000; // 30 seconds
const DEFAULT_RETRIES = 3;

/**
 * Makes an API request with error handling, logging, and retry logic.
 */
export async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {}
): Promise<ApiResponse<T>> {
    const {
        method = 'GET',
        body,
        timeout = DEFAULT_TIMEOUT,
        retries = DEFAULT_RETRIES,
    } = options;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= retries; attempt++) {
        try {
            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: body ? JSON.stringify(body) : undefined,
                signal: controller.signal,
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.error || `HTTP ${response.status}: ${response.statusText}`
                );
            }

            clearTimeout(timeoutId);
            logRequest(endpoint, method, response.status, attempt);
            return { data, status: response.status };
        } catch (error) {
            lastError = error instanceof Error ? error : new Error(String(error));

            // Only retry on network errors or timeouts, not on 4xx errors
            if (
                lastError.name !== 'AbortError' &&
                !endpoint.includes('/api/') // Don't retry API routes excessively
            ) {
                if (attempt < retries) {
                    await new Promise((resolve) => setTimeout(resolve, 1000 * (attempt + 1)));
                    continue;
                }
            }

            clearTimeout(timeoutId);
            logError(endpoint, method, lastError, attempt);

            return {
                error: lastError.message,
                status: lastError.name === 'AbortError' ? 504 : 500,
            };
        }
    }

    clearTimeout(timeoutId);
    return {
        error: lastError?.message || 'Unknown error occurred',
        status: 500,
    };
}

/**
 * GET request helper
 */
export async function apiGet<T>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: 'GET' });
}

/**
 * POST request helper
 */
export async function apiPost<T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: 'POST', body });
}

/**
 * PUT request helper
 */
export async function apiPut<T>(
    endpoint: string,
    body?: Record<string, unknown>,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: 'PUT', body });
}

/**
 * DELETE request helper
 */
export async function apiDelete<T>(
    endpoint: string,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
): Promise<ApiResponse<T>> {
    return apiRequest<T>(endpoint, { ...options, method: 'DELETE' });
}

/**
 * Logs successful requests for debugging
 */
function logRequest(endpoint: string, method: string, status: number, attempts: number) {
    if (process.env.NODE_ENV === 'development') {
        console.log(
            `[API] ${method} ${endpoint} → ${status}${attempts > 0 ? ` (attempt ${attempts + 1})` : ''}`
        );
    }
}

/**
 * Logs failed requests for debugging
 */
function logError(endpoint: string, method: string, error: Error, attempts: number) {
    console.warn(
        `[API] ${method} ${endpoint} → Error${attempts > 0 ? ` (attempt ${attempts + 1})` : ''}: ${error.message}`
    );
}
