export interface Blog {
    id: string;
    title: string;
    content: string;
    userId: string;
    spaceId: string;
    author?: string;
    timestamp?: number;
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
    msgId: string;
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
}
export interface UserCard {
    id: string;
    username: string;
    email: string;
    timestamp: number;
    followersNum: number;
    followingNum: number;
    isFollowing: number;
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
    createdAt?: string;
}
export interface PrivateMessage {
    id: string;
    conversationId: string;
    senderId: string;
    content: string;
    createdAt?: string;
}
export interface UserActivity {
    userId: string;
    lastActive: string;
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
    createdAt?: string;
}
export interface BlogSeriesLink {
    seriesId: string;
    blogId: string;
    position: number;
}
export type NotificationType = 'message' | 'mention' | 'comment' | 'system';
export interface Notification {
    id: string;
    userId: string;
    type: NotificationType;
    refId?: string;
    payload?: Record<string, any>;
    isRead: boolean;
    createdAt: string;
}
export type ConversationType = 'space' | 'private';
export interface UserConversationState {
    id: string;
    userId: string;
    conversationId: string;
    conversationType: ConversationType;
    lastReadAt?: string;
    lastSoundPlayedAt?: string;
}
export type SpacePermissionType = 'post_blog' | 'send_chat';
export type AllowedRole = 'owner' | 'admin' | 'member' | 'everyone';
export interface SpacePermission {
    id: string;
    spaceId: string;
    permission: SpacePermissionType;
    allowedRole: AllowedRole;
}
export interface JwtObject {
    userId: string;
}
export type StatusMessage = 'OK' | 'Forbidden' | 'Not Found' | 'Internal Server Error' | 'Bad Request' | 'Unauthorized';
export type WithError<T> = T & {
    error: string;
};
export type RestMethod = 'GET' | 'POST' | 'PUT' | 'DELETE';
