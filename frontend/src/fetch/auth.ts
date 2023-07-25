import { WithError } from '@nest/shared';

import { Locals } from '../localStorage';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
  }
}

// export const signUp = async (req: SignUpReq): Promise<void> => {
//   const res = await fetch(`${HOST}/signup`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(req),
//   });
//   const currUser: WithError<SignUpRes> = await res.json();

//   if (!res.ok) throw new ApiError(res.status, currUser.error);
//   localStorage.setItem(Locals.CurrUser, JSON.stringify(currUser));
// };

// export const loginFn = async (req: LoginReq): Promise<void> => {
//   const res = await fetch(`${HOST}/login`, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json",
//     },
//     body: JSON.stringify(req),
//   });
//   const currUser: WithError<SignUpRes> = await res.json();

//   if (!res.ok) throw new ApiError(res.status, currUser.error);

//   localStorage.setItem(Locals.CurrUser, JSON.stringify(currUser));
// };

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem(Locals.CurrUser);
};

export const logOut = async (): Promise<void> => {
  localStorage.removeItem(Locals.CurrUser);
};

export const fetchFn = async <Req, Res>(url: string, method: string, body?: Req): Promise<Res> => {
  const res = await window.fetch(url, {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const data: WithError<Res> = await res.json();

  if (!res.ok) throw new ApiError(res.status, data.error);

  return data as Res;
};
