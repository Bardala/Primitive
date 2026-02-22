import { ApiError } from '@/core/services';
import { ROUTES, deleteBlogApi, numOfCommsApi, updateBlogApi } from '@/core/utils';

import {
  Blog,
  CreateBlogRes,
  DefaultSpaceId,
  DeleteBlogRes,
  NumOfCommentsRes,
  updateBlogReq,
  updateBlogRes,
} from '@nest/shared';

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { BlogApi } from '../api';

const getSpcKey = (spaceId: string) =>
  spaceId === DefaultSpaceId ? ['feeds'] : ['blogs', spaceId];

export const useCreateBlog = (spaceId: string, title: string, content: string, seriesId?: string, tagNames?: string[]) => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const navToSpace = () =>
    spaceId === DefaultSpaceId ? nav(ROUTES.HOME) : nav(ROUTES.GET_SPACE(spaceId));

  const createBlogMutation = useMutation<CreateBlogRes, ApiError>(
    BlogApi.createBlog(title, content, spaceId, seriesId, tagNames),
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
    BlogApi.createShort(title, content, spaceId),
    {
      onSuccess: data => queryClient.invalidateQueries(getSpcKey(spaceId)),
    }
  );

  return { createShortMutation };
};

export const useUpdateBlog = (blogId: string) => {
  const queryClient = useQueryClient();

  return useMutation<updateBlogRes, ApiError, updateBlogReq>(
    updateData => updateBlogApi(blogId, updateData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['blog', blogId]);
        queryClient.invalidateQueries(['blogs']);
      },
    }
  );
};

export const useDeleteBlog = (id: string, blog: Blog) => {
  const queryClient = useQueryClient();
  const nav = useNavigate();
  const navToSpace = () =>
    blog.spaceId === DefaultSpaceId ? nav(ROUTES.HOME) : nav(ROUTES.GET_SPACE(blog.spaceId));

  const deleteBlogMutate = useMutation<DeleteBlogRes, ApiError>(() => deleteBlogApi(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['feeds']);
      queryClient.invalidateQueries(['blog', id]);
      navToSpace();
    },
  });

  return { deleteBlogMutate };
};

export const useCommCounts = (id: string) => {
  const numOfComments = useQuery<NumOfCommentsRes, ApiError>(
    ['commsNum', id],
    () => numOfCommsApi(id),
    {
      enabled: !!id,
      refetchOnMount: true,
      refetchOnWindowFocus: true,
    }
  );

  return { numOfComments };
};
