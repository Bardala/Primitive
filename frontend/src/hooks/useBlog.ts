import {
  Blog,
  CreateBlogReq,
  CreateBlogRes,
  DefaultSpaceId,
  DeleteBlogReq,
  DeleteBlogRes,
  ENDPOINT,
} from '@nest/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

const getSpcKey = (spaceId: string) =>
  spaceId === DefaultSpaceId ? ['feeds'] : ['blogs', spaceId];

//! When creating a blog on the default space the rest of blogs are repeated, fix this
export const useCreateBlog = (spaceId: string, title: string, content: string) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const navToSpace = () => (spaceId === DefaultSpaceId ? nav('/') : nav(`/space/${spaceId}`));

  const createBlogMutation = useMutation<CreateBlogRes, ApiError>({
    mutationFn: () =>
      fetchFn<CreateBlogReq, CreateBlogRes>(
        ENDPOINT.CREATE_BLOG,
        'POST',
        { title, content, spaceId: spaceId! },
        currUser?.jwt
      ),
    onSuccess: data => {
      queryClient.invalidateQueries(getSpcKey(spaceId));
      navToSpace();
    },
    onError: err => {
      console.error('err', err);
    },
  });

  return { createBlogMutation };
};

//! When creating a short on the default space the rest of shorts are repeated, fix this
export const useCreateShort = (spaceId: string, title: string, content: string) => {
  const { currUser } = useAuthContext();
  const queryClient = useQueryClient();

  const createShortMutation = useMutation<CreateBlogRes, ApiError>({
    mutationFn: () =>
      fetchFn<CreateBlogReq, CreateBlogRes>(
        ENDPOINT.CREATE_BLOG,
        'POST',
        { title, content, spaceId: spaceId || DefaultSpaceId },
        currUser?.jwt
      ),
    onSuccess: data => {
      queryClient.invalidateQueries(getSpcKey(spaceId));
    },
  });

  return { createShortMutation };
};

//! When deleting a blog from default space it didn't be removed from it, fix this
export const useDeleteBlog = (id: string, blog: Blog) => {
  const queryClient = useQueryClient();
  const { currUser } = useAuthContext();
  const nav = useNavigate();
  const navToSpace = () =>
    blog.spaceId === DefaultSpaceId ? nav('/') : nav(`/space/${blog.spaceId}`);

  const deleteBlogMutate = useMutation<DeleteBlogRes, ApiError>(
    () =>
      fetchFn<DeleteBlogReq, DeleteBlogRes>(
        ENDPOINT.DELETE_BLOG,
        'DELETE',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    {
      onSuccess: data => {
        blog.spaceId !== '1' && queryClient.invalidateQueries(getSpcKey(blog.spaceId));
        navToSpace();
      },
      onError: err => console.error('err', err),
    }
  );

  return { deleteBlogMutate };
};
