import { ENDPOINT, ERROR, HOST, RestMethod } from '@nest/shared';
import 'react-notifications-component/dist/theme.css';

import { addNotification } from '../utils/assists';
import { ApiError } from './auth';

const errorFn = (status: number, message: string) => {
  const error = new ApiError(status, message);
  addNotification({ type: 'danger', message: message });
  throw error;
};

const extractParams = (endPoint: ENDPOINT, params: string[]): string => {
  const apiParamsCount = String(endPoint).match(/:\w+/g)?.length || 0;
  let res = String(endPoint);

  if (apiParamsCount !== params.length) throw new Error('params count mismatch');

  for (let i = 0; i < apiParamsCount; i++) res = res.replace(/:\w+/, params[i]);

  return HOST + res;
};

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
      if (data.error === ERROR.TOKEN_EXPIRED || data.error === ERROR.INVALID_TOKEN) {
        localStorage.removeItem('currUser');
        window.location.reload();
        errorFn(res.status, data.error);
      } else if (data.error === ERROR.UNAUTHORIZED) {
        window.location.href = '/login';
        throw new ApiError(res.status, data.error);
      } else errorFn(res.status, data.error);
    return data;
  }

  if (!res.ok) errorFn(res.status, res.statusText);
  return res as unknown as Response;
};
