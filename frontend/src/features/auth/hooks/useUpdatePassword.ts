import { ApiError } from '@/core/services';
import { updatePasswordApi } from '@/core/utils/api';

import { UpdatePasswordReq, UpdatePasswordRes } from '@nest/shared';

import { useMutation, useQueryClient } from '@tanstack/react-query';

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
