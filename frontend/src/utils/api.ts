import {
  AddMemberReq,
  AddMemberRes,
  BlogCommentsReq,
  BlogCommentsRes,
  BlogLikesListReq,
  BlogLikesListRes,
  BlogLikesReq,
  BlogLikesRes,
  BlogReq,
  BlogRes,
  ChatReq,
  ChatRes,
  CreateBlogReq,
  CreateBlogRes,
  CreateCommentReq,
  CreateCommentRes,
  CreateLikeReq,
  CreateLikeRes,
  CreateMsgReq,
  CreateMsgRes,
  CreateSpaceReq,
  CreateSpaceRes,
  DeleteBlogReq,
  DeleteBlogRes,
  ENDPOINT,
  FeedsReq,
  FeedsRes,
  FollowUserReq,
  FollowUserRes,
  GetFollowersReq,
  GetFollowersRes,
  GetUserCardReq,
  GetUserCardRes,
  GetUsersListReq,
  GetUsersListRes,
  JoinSpaceReq,
  JoinSpaceRes,
  LeaveSpaceReq,
  LeaveSpaceRes,
  LoginReq,
  LoginRes,
  MembersReq,
  MembersRes,
  RemoveLikeReq,
  RemoveLikeRes,
  SignUpReq,
  SpaceBlogsReq,
  SpaceBlogsRes,
  SpaceReq,
  SpaceRes,
  UnFollowUserReq,
  UnFollowUserRes,
  UnReadMsgsNumReq,
  UnReadMsgsNumRes,
  UpdateSpaceReq,
  UpdateSpaceRes,
  UserBlogsReq,
  UserBlogsRes,
  UserSpacesReq,
  UserSpacesRes,
} from '@nest/shared';

import { fetchFn } from '../fetch';
import { LOCALS } from './localStorage';

const currUser = JSON.parse(localStorage.getItem(LOCALS.CURR_USER) || '{}');

export const spcApi = (spcId: string) => () =>
  fetchFn<SpaceReq, SpaceRes>(ENDPOINT.GET_SPACE, 'GET', undefined, currUser?.jwt, [spcId]);

export const blogsApi =
  (spcId: string) =>
  ({ pageParam = 1 }) =>
    fetchFn<SpaceBlogsReq, SpaceBlogsRes>(
      ENDPOINT.GET_SPACE_BLOGS,
      'GET',
      undefined,
      currUser?.jwt,
      [spcId, pageParam + '']
    );

export const membersApi = (spcId: string) => () =>
  fetchFn<MembersReq, MembersRes>(ENDPOINT.GET_SPACE_MEMBERS, 'GET', undefined, currUser?.jwt, [
    spcId,
  ]);

export const joinSpcApi = (spcId: string) => () =>
  fetchFn<JoinSpaceReq, JoinSpaceRes>(ENDPOINT.JOIN_SPACE, 'POST', undefined, currUser?.jwt, [
    spcId,
  ]);

export const feedsApi =
  () =>
  ({ pageParam = 1 }) =>
    fetchFn<FeedsReq, FeedsRes>(ENDPOINT.GET_FEEDS_PAGE, 'GET', undefined, currUser?.jwt, [
      pageParam + '',
    ]);

export const createBlogApi = (title: string, content: string, spaceId: string) => () =>
  fetchFn<CreateBlogReq, CreateBlogRes>(
    ENDPOINT.CREATE_BLOG,
    'POST',
    { title, content, spaceId },
    currUser?.jwt
  );

export const deleteBlogApi = (blogId: string) => () =>
  fetchFn<DeleteBlogReq, DeleteBlogRes>(ENDPOINT.DELETE_BLOG, 'DELETE', undefined, currUser?.jwt, [
    blogId,
  ]);

export const createShortApi = (title: string, content: string, spaceId: string) => () =>
  fetchFn<CreateBlogReq, CreateBlogRes>(
    ENDPOINT.CREATE_BLOG,
    'POST',
    { title, content, spaceId },
    currUser?.jwt
  );

export const blogApi = (blogId: string) => () =>
  fetchFn<BlogReq, BlogRes>(ENDPOINT.GET_BLOG, 'GET', undefined, currUser?.jwt, [blogId]);

export const blogCommentsApi = (blogId: string) => () =>
  fetchFn<BlogCommentsReq, BlogCommentsRes>(
    ENDPOINT.GET_BLOG_COMMENTS,
    'GET',
    undefined,
    currUser?.jwt,
    [blogId]
  );

export const chatApi = (spaceId: string) => () =>
  fetchFn<ChatReq, ChatRes>(ENDPOINT.Get_SPACE_CHAT, 'GET', undefined, currUser?.jwt, [spaceId]);

export const createMsgApi = (content: string, spaceId: string) => () =>
  fetchFn<CreateMsgReq, CreateMsgRes>(ENDPOINT.CREATE_MESSAGE, 'POST', { content }, currUser?.jwt, [
    spaceId,
  ]);

export const blogLikesListApi = (blogId: string) => () =>
  fetchFn<BlogLikesListReq, BlogLikesListRes>(
    ENDPOINT.GET_BLOG_LIKES_LIST,
    'GET',
    undefined,
    currUser?.jwt,
    [blogId]
  );

export const createLikeApi = (blogId: string) => () =>
  fetchFn<CreateLikeReq, CreateLikeRes>(ENDPOINT.LIKE_BLOG, 'POST', undefined, currUser?.jwt, [
    blogId,
  ]);

export const deleteLikeApi = (blogId: string) => () =>
  fetchFn<RemoveLikeReq, RemoveLikeRes>(ENDPOINT.UNLIKE_BLOG, 'DELETE', undefined, currUser?.jwt, [
    blogId,
  ]);

export const userCardApi = (userId: string) => () =>
  fetchFn<GetUserCardReq, GetUserCardRes>(ENDPOINT.GET_USER_CARD, 'GET', undefined, currUser?.jwt, [
    userId,
  ]);

export const userSpacesApi = (userId: string) => () =>
  fetchFn<UserSpacesReq, UserSpacesRes>(ENDPOINT.GET_USER_SPACES, 'GET', undefined, currUser?.jwt, [
    userId,
  ]);

export const userBlogsApi =
  (userId: string) =>
  ({ pageParam = 1 }) =>
    fetchFn<UserBlogsReq, UserBlogsRes>(ENDPOINT.GET_USER_BLOGS, 'GET', undefined, currUser?.jwt, [
      userId,
      pageParam + '',
    ]);

export const userListApi = () => () =>
  fetchFn<GetUsersListReq, GetUsersListRes>(
    ENDPOINT.GET_USERS_LIST,
    'GET',
    undefined,
    currUser?.jwt
  );

export const addMemberApi = (member: string, isAdmin: boolean, spaceId: string) => () =>
  fetchFn<AddMemberReq, AddMemberRes>(
    ENDPOINT.ADD_MEMBER,
    'POST',
    { member, isAdmin },
    currUser?.jwt,
    [spaceId]
  );

export const createCommApi = (content: string, blogId: string) => () =>
  fetchFn<CreateCommentReq, CreateCommentRes>(
    ENDPOINT.CREATE_COMMENT,
    'POST',
    { content },
    currUser?.jwt,
    [blogId]
  );

export const createSpcApi = (input: CreateSpaceReq) => () =>
  fetchFn<CreateSpaceReq, CreateSpaceRes>(ENDPOINT.CREATE_SPACE, 'POST', input, currUser?.jwt);

export const updateSpcApi = (input: CreateSpaceReq, spcId: string) => () =>
  fetchFn<UpdateSpaceReq, UpdateSpaceRes>(ENDPOINT.UPDATE_SPACE, 'PUT', input, currUser?.jwt, [
    spcId,
  ]);

export const userFollowersApi = (userId: string) => () =>
  fetchFn<GetFollowersReq, GetFollowersRes>(
    ENDPOINT.GET_FOLLOWERS,
    'GET',
    undefined,
    currUser?.jwt,
    [userId]
  );

export const followUserApi = (userId: string) => () =>
  fetchFn<FollowUserReq, FollowUserRes>(ENDPOINT.FOLLOW_USER, 'POST', undefined, currUser?.jwt, [
    userId,
  ]);

export const unfollowUserApi = (userId: string) => () =>
  fetchFn<UnFollowUserReq, UnFollowUserRes>(
    ENDPOINT.UNFOLLOW_USER,
    'DELETE',
    undefined,
    currUser?.jwt,
    [userId]
  );

export const blogLikesApi = (blogId: string) => () =>
  fetchFn<BlogLikesReq, BlogLikesRes>(ENDPOINT.GET_BLOG_LIKES, 'GET', undefined, currUser?.jwt, [
    blogId,
  ]);

export const loginApi = (login: string, password: string) =>
  fetchFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, 'POST', { login, password });

export const signUpApi = (email: string, password: string, username: string) =>
  fetchFn<SignUpReq, LoginRes>(ENDPOINT.SIGNUP, 'POST', { email, password, username });

export const leaveSpcApi = (spcId: string) => () =>
  fetchFn<LeaveSpaceReq, LeaveSpaceRes>(ENDPOINT.LEAVE_SPACE, 'DELETE', undefined, currUser?.jwt, [
    spcId,
  ]);

export const getNumOfUnReadMsgsApi = (spaceId: string) => () =>
  fetchFn<UnReadMsgsNumReq, UnReadMsgsNumRes>(
    ENDPOINT.GET_UNREAD_MSGS_NUM,
    'GET',
    undefined,
    currUser?.jwt,
    [spaceId]
  );
