// todo: make all timestamp fields consistent (number vs string vs Date)

export interface Blog {
  id: string;
  title: string;
  content: string;
  userId: string;
  spaceId: string;
  author?: string;
  timestamp?: number;
  space?: Space;
  seriesLinks?: (BlogSeriesLink & { series: BlogSeries })[];
  tags?: Tag[];
}

export interface Comment {
  id: string;
  content: string;
  blogId: string;
  userId: string;
  timestamp?: number;
}
export interface CommentWithUser extends Comment {
  author: string;
}

export type SpaceStatus = 'public' | 'private';

export interface Space {
  id: string;
  name: string;
  status: SpaceStatus;
  description: string;
  ownerId: string;
  timestamp?: number;
}

export interface SpaceMember {
  memberId: string;
  spaceId: string;
  isAdmin: boolean;
  username?: string;
}

export interface LastReadMsg {
  userId: string;
  spaceId: string;
  lastReadId: string;
}

export interface UnReadMsgs {
  chat_spaceId: string;
  spaceName: string;
  unread_count: number;
}

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  timestamp?: number;
  isOnline?: boolean;
  lastSeen?: Date | string;
}

export interface UserCard {
  id: string;
  username: string;
  email: string;
  timestamp: number;
  followersNum: number;
  followingNum: number;
  isFollowing: number;
  isOnline?: boolean;
  lastSeen?: Date | string;
}

export type ChatMessage = {
  id: string;
  userId: string;
  username: string;
  spaceId: string;
  content: string;
  timestamp: number;
};

export type LikedUser = Pick<User, 'id' | 'username'>;

export interface Like {
  blogId: string;
  userId: string;
}

export type Short = {
  id: string;
  title: string;
  content: string;
  userId: string;
  spaceId: string;
  author?: string;
  timestamp?: number;
};

export interface PrivateConversation {
  id: string;
  user1Id: string;
  user2Id: string;
  createdAt?: string; // ISO datetime
}

export interface PrivateMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  createdAt?: Date;
}

export interface UserActivity {
  userId: string;
  lastActive: Date;
}

export interface Tag {
  id: string;
  name: string;
}

export interface BlogTag {
  blogId: string;
  tagId: string;
}

export interface SpaceTag {
  spaceId: string;
  tagId: string;
}

export interface UserTag {
  userId: string;
  tagId: string;
}

export interface BlogSeries {
  id: string;
  name: string;
  description?: string;
  createdBy: string;
  createdAt?: Date;
}

export interface BlogSeriesLink {
  seriesId: string;
  blogId: string;
  position: number;
}

export enum NotificationType {
  MESSAGE = 'message',
  MENTION = 'mention',
  COMMENT = 'comment',
  LIKE = 'like',
  SYSTEM = 'system',
}

export interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  refId?: string;
  payload?: Record<string, any>;
  isRead: boolean;
  createdAt: Date;
}

export enum ConversationType {
  SPACE = 'space',
  PRIVATE = 'private',
}

export interface UserConversationState {
  id: string;
  userId: string;
  conversationId: string;
  conversationType: ConversationType;
  lastReadAt?: Date;
  lastSoundPlayedAt?: Date;
  isMuted?: boolean;
}

export enum SpacePermissionType {
  POST_BLOG = 'post_blog',
  SEND_CHAT = 'send_chat',
}

export enum AllowedRole {
  OWNER = 'owner',
  ADMIN = 'admin',
  MEMBER = 'member',
  EVERYONE = 'everyone',
}

export interface SpacePermission {
  id: string;
  spaceId: string;
  permission: SpacePermissionType;
  allowedRole: AllowedRole;
}

export interface JwtObject {
  userId: string;
}

export type StatusMessage =
  | 'OK'
  | 'Forbidden'
  | 'Not Found'
  | 'Internal Server Error'
  | 'Bad Request'
  | 'Unauthorized';

export type WithError<T> = T & { error: string };

export type RestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

/**
 * Unified API Response type used across frontend and backend
 * Wraps the actual response data with metadata
 * Used for both success (with data) and error responses (with message)
 */
export interface ApiResponse<T = any> {
  data?: T;
  statusCode: number;
  timestamp: string;
  path: string;
  message?: string;
}
