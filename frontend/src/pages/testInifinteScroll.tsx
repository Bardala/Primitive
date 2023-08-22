import { Blog, ENDPOINT, SpaceBlogsReq, SpaceBlogsRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

import { BlogList } from '../components/BlogList';
import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';
import { ApiError } from '../fetch/auth';

const useFetch = (pageSize: number) => {
  const { currUser } = useAuthContext();
  const [page, setPage] = useState(1);
  const [isEnd, setIsEnd] = useState(false);

  console.log('page', page);
  const blogsQuery = useQuery<SpaceBlogsRes, ApiError>(
    ['blogs', 'testInfiniteScroll', page],
    () =>
      fetchFn<SpaceBlogsReq, SpaceBlogsRes>(
        ENDPOINT.TEST_INFINITE_SCROLL,
        'GET',
        undefined,
        currUser?.jwt,
        [page + '', pageSize + '']
      ),
    {
      enabled: !!currUser?.jwt,
      onSuccess: data => {
        if (data.blogs.length < pageSize) {
          setIsEnd(true);
        }
      },
    }
  );

  return { blogsQuery, setPage, isEnd };
};

export const TestInfiniteScroll = () => {
  const [data, setData] = useState<Blog[]>([]);
  const pageSize = 3;

  const { blogsQuery, setPage, isEnd } = useFetch(pageSize);

  useEffect(() => {
    if (blogsQuery.data) {
      const newData: Blog[] = blogsQuery.data.blogs;
      setData(prevData => [...prevData, ...newData]);
    }
  }, [blogsQuery.data]);

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, clientHeight, scrollHeight } = document.documentElement;

      if (scrollTop + clientHeight >= scrollHeight && !blogsQuery.isLoading && !isEnd) {
        setPage(prevPage => prevPage + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [blogsQuery.isLoading, isEnd, setPage]);

  if (blogsQuery.isError) {
    return <div>Error: {blogsQuery.error?.message}</div>;
  }

  return (
    <>
      {blogsQuery.isLoading && <div>Loading...</div>}
      <BlogList posts={data} />
    </>
  );
};
