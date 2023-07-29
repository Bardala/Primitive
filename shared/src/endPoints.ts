export const HOST = `http://localhost:4001`;

export enum ENDPOINT {
  // *Auth Routes
  SIGNUP = '/api/v0/signup',
  LOGIN = '/api/v0/login',

  // *User
  GET_USER_CARD = '/api/v0/user/:id',
  FOLLOW_USER = '/api/v0/user/:id/follow',
  UNFOLLOW_USER = '/api/v0/user/:id/unfollow',
  GET_FOLLOWERS = '/api/v0/user/:id/followers',
  GET_USERS_LIST = '/api/v0/users',
  GET_USER_BLOGS = '/api/v0/user/:id/blogs',
  GET_USER_SPACES = '/api/v0/user/:id/spaces',

  // *Blog
  CREATE_BLOG = '/api/v0/blog',
  UPDATE_BLOG = '/api/v0/blog/:blogId',
  GET_BLOG = '/api/v0/blog/:blogId',
  DELETE_BLOG = '/api/v0/blog/:blogId',

  GET_BLOG_COMMENTS = '/api/v0/blog/:blogId/comments',
  GET_BLOG_LIKES = '/api/v0/blog/:blogId/likes',
  GET_BLOG_LIKES_LIST = '/api/v0/blog/:blogId/likes/list',
  LIKE_BLOG = '/api/v0/blog/:blogId/like',
  UNLIKE_BLOG = '/api/v0/blog/:blogId/unlike',

  // *Comment
  CREATE_COMMENT = '/api/v0/blog/:blogId/comment',
  UPDATE_COMMENT = '/api/v0/comment/:commentId',
  DELETE_COMMENT = '/api/v0/comment/:commentId',

  // *Space
  CREATE_SPACE = '/api/v0/space',
  UPDATE_SPACE = '/api/v0/space/:spaceId',
  GET_SPACE = '/api/v0/space/:spaceId',
  DELETE_SPACE = '/api/v0/space/:spaceId',

  GET_SPACE_BLOGS = '/api/v0/space/:spaceId/blogs',
  GET_DEFAULT_SPACE = '/api/v0/space',
  JOIN_SPACE = '/api/v0/space/:spaceId/join',
  ADD_MEMBER = '/api/v0/space/:spaceId/member',
  GET_SPACE_MEMBERS = '/api/v0/space/:spaceId/members',
}
