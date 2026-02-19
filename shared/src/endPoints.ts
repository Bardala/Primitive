export enum ENDPOINT {
  // *Auth Routes
  SIGNUP = '/auth/signup',
  LOGIN = '/auth/login',

  // *User
  GET_USER_CARD = '/users/:id/card',
  FOLLOW_USER = '/users/:id/follow',
  UNFOLLOW_USER = '/users/:id/unfollow',
  GET_FOLLOWERS = '/users/:id/followers',
  GET_FOLLOWING = '/users/:id/following',
  GET_USERS_LIST = '/users',
  GET_USER_BLOGS = '/users/:id/blogs',
  GET_ALL_USER_BLOGS = '/users/blogs/:page/all',
  GET_USER_SPACES = '/users/:id/spaces',
  GET_ALL_UNREAD_MSGS = '/users/messages/unread',
  UPDATE_USER_PASSWORD = '/users/password',

  // *Blog
  CREATE_BLOG = '/blogs',
  UPDATE_BLOG = '/blogs/:blogId',
  GET_BLOG = '/blogs/:blogId',
  DELETE_BLOG = '/blogs/:blogId',

  GET_BLOG_COMMENTS = '/blogs/:blogId/comments',
  GET_BLOG_LIKES = '/blogs/:blogId/likes',
  GET_BLOG_LIKES_LIST = '/blogs/:blogId/likes-list',
  LIKE_BLOG = '/blogs/:blogId/like',
  UNLIKE_BLOG = '/blogs/:blogId/like',
  NUM_OF_COMMENTS = '/blogs/:blogId/comments-count',

  //* Short
  CREATE_SHORT = '/shorts/:spaceId/short',
  UPDATE_SHORT = '/shorts/:shortId',
  GET_SHORT = '/shorts/:shortId',
  DELETE_SHORT = '/shorts/:shortId',

  GET_SHORT_COMMENTS = '/shorts/:shortId/comments',
  GET_SHORT_LIKES = '/shorts/:shortId/likes',
  GET_SHORT_LIKES_LIST = '/shorts/:shortId/likes-list',
  LIKE_SHORT = '/shorts/:shortId/like',
  UNLIKE_SHORT = '/shorts/:shortId/like',

  // *Comment
  CREATE_COMMENT = '/comments/:blogId',
  UPDATE_COMMENT = '/comments',
  DELETE_COMMENT = '/comments/:commentId',

  // *Space
  CREATE_SPACE = '/spaces',
  UPDATE_SPACE = '/spaces/:spaceId',
  GET_SPACE = '/spaces/:spaceId',
  DELETE_SPACE = '/spaces/:spaceId',

  GET_SPACE_BLOGS = '/spaces/:spaceId/blogs',
  GET_DEFAULT_SPACE_BLOGS = '/spaces/default/blogs',
  GET_DEFAULT_SPACE = '/spaces/default',
  JOIN_SPACE = '/spaces/:spaceId/join',
  ADD_MEMBER = '/spaces/:spaceId/members',
  GET_SPACE_MEMBERS = '/spaces/:spaceId/members',
  Get_SPACE_CHAT = '/spaces/:spaceId/messages',
  DELETE_MEMBER = '/spaces/:spaceId/members/:memberId',
  LEAVE_SPACE = '/spaces/:spaceId/leave',
  GET_UNREAD_MSGS_NUM = '/spaces/:spaceId/unread-msgs',

  //* Message (Chat)
  CREATE_MESSAGE = '/chats/:spaceId/message',
  DELETE_MESSAGE = '/chats/:msgId',

  // *Like
  LIKE_POST = '/likes/:postId/like',
  UNLIKE_POST = '/likes/:postId/unlike',
  GET_POST_LIKES = '/likes/:postId/likes',

  // *Feeds
  GET_FEEDS = '/blogs',
  GET_FEEDS_PAGE = '/blogs/:page',
  Get_SMART_FEEDS = '/blogs/smart/:page',

  PERSONAL_FEEDS = '/feeds/personal',
  SMART_FEEDS = '/feeds/smart',
  MIXED_FEEDS = '/feeds/mixed',
  PUBLIC_FEEDS = '/feeds/public',
  SMART_PUBLIC_FEEDS = '/feeds/public/smart',
  USER_FEEDS = '/feeds/user/:userId',

  // *Tags
  GET_TAGS = '/tags',
  CREATE_TAG = '/tags',
  GET_USER_TAGS = '/tags/user',
  ADD_USER_TAG = '/tags/user',
  REMOVE_USER_TAG = '/tags/user/:tagId',
  ADD_BLOG_TAG = '/tags/:blogId/add',
  REMOVE_BLOG_TAG = '/tags/:blogId/:tagId',
  GET_BLOG_TAGS = '/tags/:blogId/blog-tags',
  ADD_SPACE_TAG = '/tags/space/:spaceId/add',
  REMOVE_SPACE_TAG = '/tags/space/:spaceId/:tagId',
  GET_SPACE_TAGS = '/tags/space/:spaceId/tags',

  // *Notifications
  // *Notifications
  GET_NOTIFICATIONS = '/notifications',
  MARK_AS_READ = '/notifications/:id/read',
  MARK_ALL_AS_READ = '/notifications/read-all',

  // *Blog Series
  CREATE_SERIES = '/series',
  UPDATE_SERIES = '/series/:seriesId',
  GET_SERIES = '/series/:seriesId',
  GET_USER_SERIES = '/series/user',
  DELETE_SERIES = '/series/:seriesId',
  ADD_BLOG_TO_SERIES = '/series/:seriesId/blogs',
  REMOVE_BLOG_FROM_SERIES = '/series/:seriesId/blogs/:blogId',

  // *Space Permissions
  GET_SPACE_PERMISSIONS = '/spaces/:spaceId/permissions',
  UPDATE_SPACE_PERMISSIONS = '/spaces/:spaceId/permissions',

  // *Private Chat
  GET_PRIVATE_CONVERSATIONS = '/chats/private',
  GET_PRIVATE_MESSAGES = '/chats/private/:conversationId',
  CREATE_PRIVATE_CONVERSATION = '/chats/private',
  SEND_PRIVATE_MESSAGE = '/chats/private/:conversationId/message',
  MARK_PRIVATE_CHAT_AS_READ = '/chats/private/:conversationId/read',

  // *Space Chat Read Tracking
  MARK_SPACE_CHAT_AS_READ = '/spaces/:spaceId/messages/read',
  MUTE_PRIVATE_CHAT = '/chats/private/:conversationId/mute',
  MUTE_SPACE_CHAT = '/spaces/:spaceId/mute',
}
