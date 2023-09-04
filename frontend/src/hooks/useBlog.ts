import { Blog, CreateBlogRes, DefaultSpaceId, DeleteBlogRes } from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { ApiError } from '../fetch/auth';
import { createBlogApi, createShortApi, deleteBlogApi } from '../utils/api';

const getSpcKey = (spaceId: string) =>
  spaceId === DefaultSpaceId ? ['feeds'] : ['blogs', spaceId];

export const useCreateBlog = (spaceId: string, title: string, content: string) => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const navToSpace = () => (spaceId === DefaultSpaceId ? nav('/') : nav(`/space/${spaceId}`));

  const createBlogMutation = useMutation<CreateBlogRes, ApiError>(
    createBlogApi(title, content, spaceId),
    {
      onSuccess: data => {
        queryClient.invalidateQueries(getSpcKey(spaceId));
        navToSpace();
      },
    }
  );

  return { createBlogMutation };
};

export const useCreateShort = (spaceId: string, title: string, content: string) => {
  const queryClient = useQueryClient();

  const createShortMutation = useMutation<CreateBlogRes, ApiError>(
    createShortApi(title, content, spaceId),
    {
      onSuccess: data => queryClient.invalidateQueries(getSpcKey(spaceId)),
    }
  );

  return { createShortMutation };
};

export const useDeleteBlog = (id: string, blog: Blog) => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const navToSpace = () =>
    blog.spaceId === DefaultSpaceId ? nav('/') : nav(`/space/${blog.spaceId}`);

  const deleteBlogMutate = useMutation<DeleteBlogRes, ApiError>(deleteBlogApi(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['feeds']);
      queryClient.invalidateQueries(['blog', id]);
      navToSpace();
      window.document.location.reload();
    },
  });

  return { deleteBlogMutate };
};
