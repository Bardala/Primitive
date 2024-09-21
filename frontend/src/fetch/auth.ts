import { useQueryClient } from '@tanstack/react-query';

import { LOCALS } from '../utils/localStorage';

export class ApiError extends Error {
  public status: number;

  constructor(status: number, msg: string) {
    super(msg);
    this.status = status;
  }
}

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem(LOCALS.CURR_USER);
};

export const logOut = async (): Promise<void> => {
  localStorage.removeItem(LOCALS.CURR_USER);
};

export const useLogOut = () => {
  const queryClient = useQueryClient();

  const logOut = async (): Promise<void> => {
    localStorage.removeItem(LOCALS.CURR_USER);
    queryClient.removeQueries();
  };

  return { logOut };
};
