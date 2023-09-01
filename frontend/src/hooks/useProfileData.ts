import { GetUserCardRes, UserSpacesRes } from '@nest/shared';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { ApiError } from '../fetch/auth';
import { userBlogsApi, userCardApi, userSpacesApi } from '../utils/api';

export const useProfileData = (id: string) => {
  const { currUser } = useAuthContext();
  const isMyPage = currUser?.id === id;
  const cardKey = ['userCard', id];
  const spacesKey = ['userSpaces', id];
  const blogsKey = ['userBlogs', id];

  const userCardQuery = useQuery<GetUserCardRes, ApiError>(cardKey, userCardApi(id), {
    enabled: !!currUser?.jwt && !!id,
  });

  const userSpacesQuery = useQuery<UserSpacesRes, ApiError>(spacesKey, userSpacesApi(id), {
    enabled: isMyPage && !!currUser?.jwt && !!id && !!userCardQuery.data?.userCard,
    refetchOnWindowFocus: false,
  });

  const userBlogsQuery = useQuery(blogsKey, userBlogsApi(id), {
    enabled: !!currUser?.jwt && !!id && !!userCardQuery.data?.userCard,
    refetchOnWindowFocus: false,
  });

  return { userCardQuery, userSpacesQuery, userBlogsQuery, isMyPage };
};
