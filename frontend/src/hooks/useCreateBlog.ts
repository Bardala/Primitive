import { CreateBlogReq, CreateBlogRes, DefaultSpaceId, ENDPOINT } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const useCreateBlog = (spaceId: string, title: string, content: string) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const key = spaceId === DefaultSpaceId ? ['feeds', DefaultSpaceId] : ['blogs', spaceId];
  const navToSpace = () => (spaceId === DefaultSpaceId ? nav('/') : nav(`/space/${spaceId}`));

  const createBlogMutation = useMutation<CreateBlogRes, ApiError>({
    mutationFn: () =>
      fetchFn<CreateBlogReq, CreateBlogRes>(
        ENDPOINT.CREATE_BLOG,
        'POST',
        { title, content, spaceId: spaceId! },
        currUser?.jwt
      ),
    onSuccess: () => {
      queryClient.invalidateQueries(key);
      navToSpace();
    },
    onError: err => {
      console.error('err', err);
    },
  });

  return { createBlogMutation };
};
