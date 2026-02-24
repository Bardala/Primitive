import { useQueryClient } from '@tanstack/react-query';

import { LOCALS } from '../utils';
import { logoutApi } from '../utils/api';

export class ApiError extends Error {
  public status: number;

  constructor(msg: string, status: number) {
    super(msg);
    this.status = status;
  }
}

export const isLoggedIn = (): boolean => {
  return !!localStorage.getItem(LOCALS.CURR_USER);
};

export const logOut = async (): Promise<void> => {
  try {
    await logoutApi();
  } catch (error) {
    console.error('Logout API failed:', error);
  }
  localStorage.removeItem(LOCALS.CURR_USER);
};

export const useLogOut = () => {
  const queryClient = useQueryClient();

  const logOut = async (): Promise<void> => {
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed:', error);
    }
    localStorage.removeItem(LOCALS.CURR_USER);
    queryClient.removeQueries();
  };

  return { logOut };
};
