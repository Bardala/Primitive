import { LoginRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { loginApi } from '../utils/api';
import { LOCALS } from '../utils/localStorage';
import { ROUTES } from '../utils/routes';

interface LoginCredentials {
  login: string;
  password: string;
}

export const useLoginMutation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { refetchCurrUser } = useAuthContext();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ login, password }: LoginCredentials): Promise<LoginRes> =>
      loginApi(login, password),

    onMutate: async () => {
      // Cancel any outgoing refetches to avoid overwriting our optimistic update
      await queryClient.cancelQueries({ queryKey: ['currentUser'] });
    },

    onSuccess: (user: LoginRes) => {
      // Update localStorage
      localStorage.setItem(LOCALS.CURR_USER, JSON.stringify(user));

      // Update React Query cache
      queryClient.setQueryData(['currentUser'], user);

      // Navigate to the intended page
      const from = location.state?.from?.pathname || ROUTES.HOME;
      navigate(from, { replace: true });
    },

    onError: (error: ApiError) => {
      console.error('Login error:', error);
      // You can add additional error handling here if needed
    },

    onSettled: () => {
      // Always refetch current user to ensure sync with server
      queryClient.invalidateQueries({ queryKey: ['currentUser'] });
      refetchCurrUser();
    },
  });
};
