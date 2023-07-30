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
