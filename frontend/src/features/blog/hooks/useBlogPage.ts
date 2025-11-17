import { ApiError } from '@/core/services';
import { blogApi, blogCommentsApi } from '@/core/utils';

import { BlogCommentsRes, BlogRes } from '@nest/shared';

import { useQuery } from '@tanstack/react-query';

export const useBlogPage = (id: string) => {
  const blogKey = ['blog', id];
  const commentsKey = ['comments', id];

  const blogQuery = useQuery<BlogRes, ApiError>(blogKey, blogApi(id), {
    enabled: !!id,
    staleTime: 60000,
  });

  const commentsQuery = useQuery<BlogCommentsRes, ApiError>(commentsKey, blogCommentsApi(id), {
    enabled: !!id && !!blogQuery.data?.blog,
  });

  return { blogQuery, commentsQuery };
};
