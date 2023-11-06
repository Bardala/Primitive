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
  GET_USER_BLOGS = '/api/v0/user/:id/blogs/:page',
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

  //* Short
  CREATE_SHORT = '/api/v0/space/:spaceId/short',
  UPDATE_SHORT = '/api/v0/short/:shortId',
  GET_SHORT = '/api/v0/short/:shortId',
  DELETE_SHORT = '/api/v0/short/:shortId',

  GET_SHORT_COMMENTS = '/api/v0/short/:shortId/comments',
  GET_SHORT_LIKES = '/api/v0/short/:shortId/likes',
  GET_SHORT_LIKES_LIST = '/api/v0/short/:shortId/likes/list',
  LIKE_SHORT = '/api/v0/short/:shortId/like',
  UNLIKE_SHORT = '/api/v0/short/:shortId/unlike',

  // *Comment
  CREATE_COMMENT = '/api/v0/blog/:blogId/comment',
  UPDATE_COMMENT = '/api/v0/comment/:commentId',
  DELETE_COMMENT = '/api/v0/comment/:commentId',

  // *Space
  CREATE_SPACE = '/api/v0/space',
  UPDATE_SPACE = '/api/v0/space/:spaceId',
  GET_SPACE = '/api/v0/space/:spaceId',
  DELETE_SPACE = '/api/v0/space/:spaceId',

  GET_SPACE_BLOGS = '/api/v0/space/:spaceId/blogs/:page',
  GET_DEFAULT_SPACE = '/api/v0/space',
  JOIN_SPACE = '/api/v0/space/:spaceId/join',
  ADD_MEMBER = '/api/v0/space/:spaceId/member',
  GET_SPACE_MEMBERS = '/api/v0/space/:spaceId/members',
  Get_SPACE_CHAT = '/api/v0/space/:spaceId/chat',
  DELETE_MEMBER = '/api/v0/space/:spaceId/member/:memberId',
  LEAVE_SPACE = '/api/v0/space/:spaceId/leave',
  GET_SPACE_SHORTS = '/api/v0/space/:spaceId/shorts',

  //* Message
  CREATE_MESSAGE = '/api/v0/space/:spaceId/message',
  DELETE_MESSAGE = '/api/v0/message/:msgId',

  // *Like
  LIKE_POST = '/api/v0/post/:postId/like',
  UNLIKE_POST = '/api/v0/post/:postId/unlike',
  GET_POST_LIKES = '/api/v0/post/:postId/likes',

  // *Feeds
  GET_FEEDS = '/api/v0/feeds',
  GET_FEEDS_PAGE = '/api/v0/feeds/:page',

  // *Test
  TEST_INFINITE_SCROLL = '/api/v0/test/infinite-scroll/:page/:pageSize',
}
