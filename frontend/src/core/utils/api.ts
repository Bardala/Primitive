import { AuthApi } from '@/features/auth/api/auth.api';
import { BlogApi, CommentApi, LikeApi } from '@/features/blog/api';
import { ChatApi } from '@/features/chat/api';
import { FeedsApi, SpaceApi } from '@/features/spaces/api';
import { UserApi } from '@/features/user/api';

import {
  AddMemberReq,
  AddMemberRes,
  AllUnReadMsgsRes,
  BlogCommentsRes,
  BlogLikesListRes,
  BlogLikesRes,
  BlogRes,
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
  DeleteBlogRes,
  DeleteCommentRes,
  ENDPOINT,
  FeedsReq,
  FeedsRes,
  FollowUserReq,
  FollowUserRes,
  GetFollowersRes,
  GetUserCardRes,
  GetUsersListRes,
  JoinSpaceReq,
  JoinSpaceRes,
  LeaveSpaceRes,
  LoginReq,
  LoginRes,
  MembersRes,
  NumOfCommentsRes,
  RemoveLikeRes,
  SignUpReq,
  SpaceBlogsRes,
  SpaceRes,
  UnFollowUserRes,
  UnReadMsgsNumRes,
  UpdateCommentReq,
  UpdateCommentRes,
  UpdatePasswordReq,
  UpdatePasswordRes,
  UpdateSpaceReq,
  UpdateSpaceRes,
  UserBlogsRes,
  UserSpacesRes,
  updateBlogReq,
  updateBlogRes,
} from '@nest/shared';

import { deleteFn, getFn, postFn, putFn } from '../services';

export const Api = {
  space: SpaceApi,
  feeds: FeedsApi,
  blog: BlogApi,
  comment: CommentApi,
  chat: ChatApi,
  like: LikeApi,
  user: UserApi,
  auth: AuthApi,
};

// Space APIs
export const spcApi = (spcId: string) => () => getFn<SpaceRes>(ENDPOINT.GET_SPACE, [spcId]);
export const defaultSpcApi = () => () => getFn<SpaceRes>(ENDPOINT.GET_DEFAULT_SPACE);

export const blogsApi = (spcId: string, pageParam: number = 1) =>
  getFn<SpaceBlogsRes>(ENDPOINT.GET_SPACE_BLOGS, [spcId, pageParam.toString()]);

export const membersApi = (spcId: string) => () =>
  getFn<MembersRes>(ENDPOINT.GET_SPACE_MEMBERS, [spcId]);

export const joinSpcApi = (spcId: string) => () =>
  postFn<JoinSpaceReq, JoinSpaceRes>(ENDPOINT.JOIN_SPACE, undefined, [spcId]);

export const leaveSpcApi = (spcId: string) => () =>
  deleteFn<LeaveSpaceRes>(ENDPOINT.LEAVE_SPACE, [spcId]);

// Feed APIs
export const feedsApi = (pageParam: number = 1) =>
  getFn<FeedsRes>(ENDPOINT.GET_FEEDS_PAGE, [pageParam.toString()]);

export const smarterFeedsApi = (pageParam: number = 1) =>
  getFn<FeedsRes>(ENDPOINT.Get_SMART_FEEDS, [pageParam.toString()]);

export const personalFeedsApi = (query: FeedsReq) => getFn<FeedsRes>(ENDPOINT.PERSONAL_FEEDS);

export const smartFeedsApi = (query: FeedsReq) => getFn<FeedsRes>(ENDPOINT.SMART_FEEDS);

export const mixedFeedsApi = (query: FeedsReq) => getFn<FeedsRes>(ENDPOINT.MIXED_FEEDS);

export const publicFeedsApi = (query: FeedsReq) => getFn<FeedsRes>(ENDPOINT.PUBLIC_FEEDS);

export const smartPublicFeedsApi = (query: FeedsReq) =>
  getFn<FeedsRes>(ENDPOINT.SMART_PUBLIC_FEEDS);

export const userFeedsApi = (userId: string, query: FeedsReq) =>
  getFn<FeedsRes>(ENDPOINT.USER_FEEDS, [userId]);

// Blog APIs
export const blogApi = (blogId: string) => () => getFn<BlogRes>(ENDPOINT.GET_BLOG, [blogId]);

export const createBlogApi = (title: string, content: string, spaceId: string) => () =>
  postFn<CreateBlogReq, CreateBlogRes>(ENDPOINT.CREATE_BLOG, { title, content, spaceId });

export const createShortApi = (title: string, content: string, spaceId: string) => () =>
  postFn<CreateBlogReq, CreateBlogRes>(ENDPOINT.CREATE_BLOG, { title, content, spaceId });

export const updateBlogApi = (blogId: string, data: updateBlogReq) =>
  putFn<updateBlogReq, updateBlogRes>(ENDPOINT.UPDATE_BLOG, data, [blogId]);

export const deleteBlogApi = (blogId: string) =>
  deleteFn<DeleteBlogRes>(ENDPOINT.DELETE_BLOG, [blogId]);

// Comments APIs
export const blogCommentsApi = (blogId: string) => () =>
  getFn<BlogCommentsRes>(ENDPOINT.GET_BLOG_COMMENTS, [blogId]);

export const createCommApi = (content: string, blogId: string) => () =>
  postFn<CreateCommentReq, CreateCommentRes>(ENDPOINT.CREATE_COMMENT, { content }, [blogId]);

export const updateCommentApi = (commentId: string, data: UpdateCommentReq) =>
  putFn<UpdateCommentReq, UpdateCommentRes>(ENDPOINT.UPDATE_COMMENT, data, [commentId]);

export const deleteCommentApi = (commentId: string) =>
  deleteFn<DeleteCommentRes>(ENDPOINT.DELETE_COMMENT, [commentId]);

export const numOfCommsApi = (blogId: string) =>
  getFn<NumOfCommentsRes>(ENDPOINT.NUM_OF_COMMENTS, [blogId]);

// Chat APIs
export const chatApi = (spaceId: string) => () =>
  getFn<ChatRes>(ENDPOINT.Get_SPACE_CHAT, [spaceId]);

export const createMsgApi = (content: string, spaceId: string) => () =>
  postFn<CreateMsgReq, CreateMsgRes>(ENDPOINT.CREATE_MESSAGE, { content }, [spaceId]);

export const getNumOfUnReadMsgsApi = (spaceId: string) =>
  getFn<UnReadMsgsNumRes>(ENDPOINT.GET_UNREAD_MSGS_NUM, [spaceId]);

export const getAllUnReadMsgsApi = () => () =>
  getFn<AllUnReadMsgsRes>(ENDPOINT.GET_ALL_UNREAD_MSGS);

// Likes APIs
export const blogLikesApi = (blogId: string) => () =>
  getFn<BlogLikesRes>(ENDPOINT.GET_BLOG_LIKES, [blogId]);

export const blogLikesListApi = (blogId: string) =>
  getFn<BlogLikesListRes>(ENDPOINT.GET_BLOG_LIKES_LIST, [blogId]);

export const createLikeApi = (blogId: string) => () =>
  postFn<CreateLikeReq, CreateLikeRes>(ENDPOINT.LIKE_BLOG, undefined, [blogId]);

export const deleteLikeApi = (blogId: string) => () =>
  deleteFn<RemoveLikeRes>(ENDPOINT.UNLIKE_BLOG, [blogId]);

// User APIs
export const userCardApi = (userId: string) => () =>
  getFn<GetUserCardRes>(ENDPOINT.GET_USER_CARD, [userId]);

export const userSpacesApi = (userId: string) => () =>
  getFn<UserSpacesRes>(ENDPOINT.GET_USER_SPACES, [userId]);

export const userBlogsApi = (userId: string, pageParam: number = 1) =>
  getFn<UserBlogsRes>(ENDPOINT.GET_USER_BLOGS, [userId, pageParam.toString()]);

export const userListApi = () => getFn<GetUsersListRes>(ENDPOINT.GET_USERS_LIST);

export const userFollowersApi = (userId: string) => () =>
  getFn<GetFollowersRes>(ENDPOINT.GET_FOLLOWERS, [userId]);

export const followUserApi = (userId: string) => () =>
  postFn<FollowUserReq, FollowUserRes>(ENDPOINT.FOLLOW_USER, undefined, [userId]);

export const unfollowUserApi = (userId: string) => () =>
  deleteFn<UnFollowUserRes>(ENDPOINT.UNFOLLOW_USER, [userId]);

// Space Management APIs
export const addMemberApi = (member: string, isAdmin: boolean, spaceId: string) => () =>
  postFn<AddMemberReq, AddMemberRes>(ENDPOINT.ADD_MEMBER, { member, isAdmin }, [spaceId]);

export const createSpcApi = (input: CreateSpaceReq) => () =>
  postFn<CreateSpaceReq, CreateSpaceRes>(ENDPOINT.CREATE_SPACE, input);

export const updateSpcApi = (input: CreateSpaceReq, spcId: string) => () =>
  putFn<UpdateSpaceReq, UpdateSpaceRes>(ENDPOINT.UPDATE_SPACE, input, [spcId]);

// Auth APIs (Public endpoints)
export const loginApi = (login: string, password: string) =>
  postFn<LoginReq, LoginRes>(ENDPOINT.LOGIN, { login, password });

export const signUpApi = (email: string, password: string, username: string) =>
  postFn<SignUpReq, LoginRes>(ENDPOINT.SIGNUP, { email, password, username });

export const updatePasswordApi = (data: UpdatePasswordReq) =>
  postFn<UpdatePasswordReq, UpdatePasswordRes>(ENDPOINT.UPDATE_USER_PASSWORD, data);
