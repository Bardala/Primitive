import { RestMethod, WithError } from '@nest/shared';

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

export const fetchFn = async <Req, Res>(
  url: string,
  method: RestMethod,
  body?: Req,
  token?: string
): Promise<Res> => {
  const res = await window.fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    },
    ...(body && { body: JSON.stringify(body) }),
  });
  const data: WithError<Res> = await res.json();
  console.log('data form fetchFn: ', data);

  if (!res.ok) throw new ApiError(res.status, data.error);

  return data;
};
