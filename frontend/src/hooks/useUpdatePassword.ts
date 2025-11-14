import { UpdatePasswordReq, UpdatePasswordRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError } from 'src/fetch/auth';
import { updatePasswordApi } from 'src/utils/api';

export const useUpdatePassword = () => {
  const queryClient = useQueryClient();

  return useMutation<UpdatePasswordRes, ApiError, UpdatePasswordReq>(
    data => updatePasswordApi(data),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['user']);
      },
    }
  );
};
