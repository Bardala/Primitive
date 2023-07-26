import { Blog, User, UserCard } from '../types';

export type SignUpReq = Pick<User, 'email' | 'password' | 'username'>;
export interface SignUpRes {
  jwt: string;
  username: string;
}

export interface LoginReq {
  login: string;
  password: string;
}
export interface LoginRes {
  jwt: string;
  username: string;
  id: string;
}

export interface GetUserCardReq {}
export interface GetUserCardRes {
  userCard: UserCard;
}

export interface GetUsersListReq {}
export interface GetUsersListRes {
  usernames: string[];
}

export interface FollowUserReq {}
export interface FollowUserRes {}

export interface UnFollowUserReq {}
export interface UnFollowUserRes {}

export interface GetFollowersReq {}
export interface GetFollowersRes {
  followersUsername: string[];
}

export interface UserBlogsReq {}
export interface UserBlogsRes {
  blogs: Blog[];
}
