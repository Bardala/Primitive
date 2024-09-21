import { BlogCommentsRes, BlogRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { blogApi, blogCommentsApi } from '../utils/api';

export const useBlogPage = (id: string) => {
  const { currUser } = useAuthContext();
  const blogKey = ['blog', id];
  const commentsKey = ['comments', id];

  const blogQuery = useQuery<BlogRes, ApiError>(blogKey, blogApi(id), {
    enabled: !!currUser?.jwt && !!id,
    staleTime: 60000,
  });

  const commentsQuery = useQuery<BlogCommentsRes, ApiError>(commentsKey, blogCommentsApi(id), {
    enabled: !!currUser?.jwt && !!id && !!blogQuery.data?.blog,
  });

  return { blogQuery, commentsQuery };
};
