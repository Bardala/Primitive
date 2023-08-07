import {
  ENDPOINT,
  GetUserCardReq,
  GetUserCardRes,
  UserBlogsReq,
  UserBlogsRes,
  UserSpacesReq,
  UserSpacesRes,
} from '@nest/shared';
import { useQuery } from '@tanstack/react-query';

import { useAuthContext } from '../context/AuthContext';
import { fetchFn } from '../fetch';

export const useProfileData = (id: string) => {
  const { currUser } = useAuthContext();
  const isMyPage = currUser?.id === id;

  const userCardQuery = useQuery({
    queryKey: ['userCard', id],
    queryFn: () =>
      fetchFn<GetUserCardReq, GetUserCardRes>(
        ENDPOINT.GET_USER_CARD,
        'GET',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    enabled: !!currUser?.jwt && !!id,
    onError: err => console.error(err),
  });

  const userSpacesQuery = useQuery({
    queryKey: ['userSpaces', id],
    queryFn: () =>
      fetchFn<UserSpacesReq, UserSpacesRes>(
        ENDPOINT.GET_USER_SPACES,
        'GET',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    enabled: isMyPage && !!currUser?.jwt && !!id && !!userCardQuery.data?.userCard,
    onError: err => console.error(err),
    refetchOnWindowFocus: false,
  });

  const userBlogsQuery = useQuery({
    queryKey: ['userBlogs', id],
    queryFn: () =>
      fetchFn<UserBlogsReq, UserBlogsRes>(
        ENDPOINT.GET_USER_BLOGS,
        'GET',
        undefined,
        currUser?.jwt,
        [id!]
      ),
    enabled: !!currUser?.jwt && !!id && !!userCardQuery.data?.userCard,
    onError: err => console.error(err),
    refetchOnWindowFocus: false,
  });

  return { userCardQuery, userSpacesQuery, userBlogsQuery, isMyPage };
};
