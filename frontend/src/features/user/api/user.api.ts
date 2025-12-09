import { deleteFn, getFn, postFn } from '@/core/services';

import {
  ENDPOINT,
  FollowUserReq,
  FollowUserRes,
  GetFollowersRes,
  GetUserCardRes,
  GetUsersListRes,
  UnFollowUserRes,
  UserBlogsRes,
  UserSpacesRes,
} from '@nest/shared';

export const UserApi = {
  getUserCard: (userId: string) => getFn<GetUserCardRes>(ENDPOINT.GET_USER_CARD, [userId]),

  getUserSpaces: (userId: string) => getFn<UserSpacesRes>(ENDPOINT.GET_USER_SPACES, [userId]),

  getUserBlogs: (userId: string, page: number = 1) =>
    getFn<UserBlogsRes>(ENDPOINT.GET_USER_BLOGS, [userId, page.toString()]),

  getUsersList: () => getFn<GetUsersListRes>(ENDPOINT.GET_USERS_LIST),

  getFollowers: (userId: string) => getFn<GetFollowersRes>(ENDPOINT.GET_FOLLOWERS, [userId]),

  followUser: (userId: string) =>
    postFn<FollowUserReq, FollowUserRes>(ENDPOINT.FOLLOW_USER, undefined, [userId]),

  unfollowUser: (userId: string) => deleteFn<UnFollowUserRes>(ENDPOINT.UNFOLLOW_USER, [userId]),
};
