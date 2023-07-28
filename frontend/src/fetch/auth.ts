import { RestMethod } from '@nest/shared';

import { Locals } from '../localStorage';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
  }
}

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem(Locals.CurrUser);
};

export const logOut = async (): Promise<void> => {
  localStorage.removeItem(Locals.CurrUser);
};

export const fetchFn = async <Request, Response>(
  url: string,
  method: RestMethod,
  req?: Request,
  token?: string
): Promise<Response> => {
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
    if (!res.ok) throw new ApiError(res.status, data.error);
    return data;
  }
  console.log(res);
  return res.text() as Response;
};
