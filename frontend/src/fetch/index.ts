import { ENDPOINT, ERROR, HOST, RestMethod } from '@nest/shared';

import { ApiError } from './auth';

function extractParams(endPoint: ENDPOINT, params: string[]): string {
  const apiParamsCount = String(endPoint).match(/:\w+/g)?.length || 0;
  let res = String(endPoint);

  if (apiParamsCount !== params.length) throw new Error('params count mismatch');

  for (let i = 0; i < apiParamsCount; i++) res = res.replace(/:\w+/, params[i]);

  return HOST + res;
}

export const fetchFn = async <Request, Response>(
  endPoint: ENDPOINT,
  method: RestMethod,
  req?: Request,
  token?: string,
  params?: string[]
): Promise<Response> => {
  let url = HOST + endPoint;
  if (params) url = extractParams(endPoint, params);

  const res = await fetch(url, {
    method: method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(req && { body: JSON.stringify(req) }),
  });

  if (res.headers.get('Content-Type')?.includes('application/json')) {
    const data = await res.json();
    if (!res.ok)
      if (data.error === ERROR.TOKEN_EXPIRED) {
        localStorage.removeItem('currUser');
        window.location.reload();
        throw new ApiError(res.status, data.error);
      } else if (data.error === ERROR.UNAUTHORIZED) {
        window.location.href = '/login';
        throw new ApiError(res.status, data.error);
      } else throw new ApiError(res.status, data.error);

    return data;
  }

  if (!res.ok) throw new ApiError(res.status, res.statusText);
  return res as unknown as Response;
};
