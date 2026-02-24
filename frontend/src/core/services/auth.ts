import { useQueryClient } from '@tanstack/react-query';

import { LOCALS } from '../utils';
import { logoutApi } from '../utils/api';
import { disconnectSocket } from '../utils/socket';

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
  disconnectSocket();
};

export const useLogOut = () => {
  const queryClient = useQueryClient();

  const logOut = async (): Promise<void> => {
    // 1. Disconnect socket immediately so notifications stop
    disconnectSocket();
    // 2. Remove auth data from storage
    localStorage.removeItem(LOCALS.CURR_USER);
    // 3. Clear all cached queries so every observer sees an unauthenticated state
    queryClient.clear();
    // 4. Best-effort server-side cookie/session invalidation
    try {
      await logoutApi();
    } catch (error) {
      console.error('Logout API failed:', error);
    }
  };

  return { logOut };
};
