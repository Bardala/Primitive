import { ApiResponse, ENDPOINT, RestMethod } from '@nest/shared';

import { HOST, LOCALS, ROUTES } from '../utils';
import { ApiError } from './auth';

const API_PREFIX = '/api/v0';
function addQueryParams(url: string, query: Record<string, any> | undefined): string {
  if (query && Object.keys(query).length > 0) {
    const queryString = new URLSearchParams();

    Object.entries(query).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        // Handle arrays and objects
        if (Array.isArray(value)) {
          value.forEach(item => queryString.append(`${key}[]`, String(item)));
        } else if (typeof value === 'object' && value !== null) {
          queryString.append(key, JSON.stringify(value));
        } else {
          queryString.append(key, String(value));
        }
      }
    });

    const queryStr = queryString.toString();
    if (queryStr) {
      url += `?${queryStr}`;
    }
  }

  return url;
}

/**
 * Constructs a complete URL by replacing route parameters with actual values
 * @param endpoint - The endpoint path with optional parameters (e.g., "/:id/profile")
 * @param params - Array of parameter values to replace in order
 * @param query - Query parameters object to append to URL
 * @returns Complete URL string
 */
const buildUrl = (
  endpoint: ENDPOINT,
  params: string[] = [],
  query?: Record<string, any>
): string => {
  let path = String(endpoint);

  // Extract parameter placeholders (e.g., ":id")
  const placeholders = [...path.matchAll(/:[\w]+/g)].map(m => m[0]);

  if (placeholders.length !== params.length)
    throw new Error(
      `Parameter count mismatch: expected ${placeholders.length}, got ${params.length}`
    );

  // Replace placeholders with provided params
  placeholders.forEach((placeholder, i) => {
    path = path.replace(placeholder, params[i]);
  });

  // Construct final URL
  const url = `${HOST}${API_PREFIX}${path}`;
  return addQueryParams(url, query);
};

interface FetchOptions<TRequest> {
  endpoint: ENDPOINT;
  method: RestMethod;
  body?: TRequest;
  params?: string[];
  token?: string | null;
  queryParams?: Record<string, any>;
}

/**
 * Core fetch function with automatic error handling and response parsing
 */
export const fetchFn = async <TRequest, TResponse>(
  options: FetchOptions<TRequest>
): Promise<TResponse> => {
  const { endpoint, method, body, params, token, queryParams } = options;

  // Get auth token from localStorage
  let authToken = token;
  if (!authToken) {
    const currUser = localStorage.getItem(LOCALS.CURR_USER);
    if (currUser) {
      try {
        authToken = JSON.parse(currUser).jwt;
      } catch (err) {
        console.warn('Invalid stored authentication token');
      }
    }
  }

  // Build URL with parameters
  const url = buildUrl(endpoint, params, queryParams);

  // Prepare fetch headers
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }

  // Execute fetch request
  let response: Response;
  try {
    response = await fetch(url, {
      method,
      headers,
      ...(body && { body: JSON.stringify(body) }),
    });
  } catch (err: any) {
    const errorMessage =
      err?.message === 'Failed to fetch' ? 'Connection problem…' : 'Network error occurred';
    throw new ApiError(0, errorMessage);
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType?.includes('application/json')) {
    const apiResponse: ApiResponse<TResponse> = await response.json();

    const { statusCode, message } = apiResponse;
    const location = window.location;
    const isAuthPath = location.pathname === ROUTES.LOGIN || location.pathname === ROUTES.SIGNUP;

    if (statusCode >= 400) {
      if (statusCode === 401 && isAuthPath) localStorage.removeItem(LOCALS.CURR_USER);
      else if (statusCode === 401) {
        localStorage.removeItem(LOCALS.CURR_USER);
        location.href = ROUTES.LOGIN;
        throw new ApiError(statusCode, message || 'Unauthenticated');
      }

      // Handle other errors
      throw new ApiError(statusCode, message || response.statusText);
    }

    // Return parsed data on success
    return apiResponse.data as TResponse;
  }

  // Handle non-JSON responses
  if (!response.ok) {
    throw new ApiError(response.status, response.statusText);
  }

  return response as unknown as TResponse;
};

export const getFn = <TResponse>(
  endpoint: ENDPOINT,
  params?: string[],
  token?: string | null,
  queryParams?: Record<string, any>
): Promise<TResponse> => fetchFn({ endpoint, method: 'GET', params, token, queryParams });

export const postFn = <TRequest, TResponse>(
  endpoint: ENDPOINT,
  body?: TRequest,
  params?: string[],
  token?: string | null,
  queryParams?: Record<string, any>
): Promise<TResponse> => fetchFn({ endpoint, method: 'POST', body, params, token, queryParams });

export const putFn = <TRequest, TResponse>(
  endpoint: ENDPOINT,
  body?: TRequest,
  params?: string[],
  token?: string | null,
  queryParams?: Record<string, any>
): Promise<TResponse> => fetchFn({ endpoint, method: 'PUT', body, params, token, queryParams });

export const patchFn = <TRequest, TResponse>(
  endpoint: ENDPOINT,
  body?: TRequest,
  params?: string[],
  token?: string | null,
  queryParams?: Record<string, any>
): Promise<TResponse> => fetchFn({ endpoint, method: 'PATCH', body, params, token, queryParams });

export const deleteFn = <TResponse>(
  endpoint: ENDPOINT,
  params?: string[],
  token?: string | null,
  queryParams?: Record<string, any>
): Promise<TResponse> => fetchFn({ endpoint, method: 'DELETE', params, token, queryParams });
