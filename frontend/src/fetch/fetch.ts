import { ENDPOINT, ERROR, RestMethod } from '@nest/shared';
import { LOCALS } from 'src/utils/localStorage';

import { HOST } from '../config';
import { ROUTES } from '../utils/routes';
import { ApiError } from './auth';

const extractParams = (endPoint: ENDPOINT, params: string[]): string => {
  const apiParamsCount = String(endPoint).match(/:\w+/g)?.length || 0;
  let res = String(endPoint);

  if (apiParamsCount !== params.length) throw new Error('params count mismatch');

  for (let i = 0; i < apiParamsCount; i++) res = res.replace(/:\w+/, params[i]);

  return HOST + res;
};

interface FetchOptions<Request> {
  endpoint: ENDPOINT;
  method: RestMethod;
  body?: Request;
  params?: string[];
  token?: string | null;
}

export const fetchFn = async <Request, Response>(
  options: FetchOptions<Request>
): Promise<Response> => {
  const { endpoint, method, body, params, token } = options;

  let authToken = token;
  const currUser = localStorage.getItem(LOCALS.CURR_USER);
  if (currUser) {
    try {
      authToken = JSON.parse(currUser).jwt;
    } catch {
      console.warn('Invalid Authentication');
    }
  }

  let url = HOST + endpoint;
  if (params) url = extractParams(endpoint, params);

  let res;
  try {
    res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
      },
      ...(body && { body: JSON.stringify(body) }),
    });
  } catch (err: any) {
    if (err.message === 'Failed to fetch') {
      throw new ApiError(0, 'Connection problem…');
    }

    throw err;
  }

  if (res.headers.get('Content-Type')?.includes('application/json')) {
    const data = await res.json();
    if (!res.ok)
      if (data.error === ERROR.TOKEN_EXPIRED || data.error === ERROR.INVALID_TOKEN) {
        localStorage.removeItem(LOCALS.CURR_USER);
        throw new ApiError(res.status, data.error);
      } else if (data.error === ERROR.UNAUTHORIZED) {
        window.location.href = ROUTES.LOGIN;
        throw new ApiError(res.status, data.error);
      } else throw new ApiError(res.status, data.error);
    return data;
  }

  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return res as unknown as Response;
};

export const getFn = <Response>(
  endpoint: ENDPOINT,
  params?: string[],
  token?: string | null
): Promise<Response> => fetchFn({ endpoint, method: 'GET', params, token });

export const postFn = <Request, Response>(
  endpoint: ENDPOINT,
  body?: Request,
  params?: string[],
  token?: string | null
): Promise<Response> => fetchFn({ endpoint, method: 'POST', body, params, token });

export const putFn = <Request, Response>(
  endpoint: ENDPOINT,
  body?: Request,
  params?: string[],
  token?: string | null
): Promise<Response> => fetchFn({ endpoint, method: 'PUT', body, params, token });

export const deleteFn = <Response>(
  endpoint: ENDPOINT,
  params?: string[],
  token?: string | null
): Promise<Response> => fetchFn({ endpoint, method: 'DELETE', params, token });
