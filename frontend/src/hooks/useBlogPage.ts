import { BlogCommentsReq, BlogCommentsRes, BlogReq, BlogRes, ENDPOINT } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

export const useBlogPage = (id: string) => {
  const { currUser } = useAuthContext();

  const blogQuery = useQuery<BlogRes, ApiError>(
    ['blog', id],
    () => fetchFn<BlogReq, BlogRes>(ENDPOINT.GET_BLOG, 'GET', undefined, currUser?.jwt, [id!]),
    {
      enabled: !!currUser?.jwt && !!id,
      // refetchOnMount: false, // Disable refetch on mount
      // refetchInterval: 5000, // Refetch every 5 seconds (5000 milliseconds)
      staleTime: 60000,
    }
  );

  const commentsQuery = useQuery(
    ['comments', id],
    () =>
      fetchFn<BlogCommentsReq, BlogCommentsRes>(
        ENDPOINT.GET_BLOG_COMMENTS,
        'GET',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    { enabled: !!currUser?.jwt && !!id && !!blogQuery.data?.blog }
  );

  return { blogQuery, commentsQuery };
};
