export interface Blog {
  id: string;
  title: string;
  content: string;
  userId: string;
  spaceId: string;
  timestamp?: string;
}

export interface Comment {
  id: string;
  content: string;
  blogId: string;
  userId: string;
  timestamp?: string;
}

export type SpaceStatus = "public" | "private";

export interface Space {
  id: string;
  name: string;
  status: SpaceStatus;
  description: string;
  ownerId: string;
  timestamp?: string;
}

export type SpaceMember = Pick<User, "id" | "username">;

export interface User {
  id: string;
  username: string;
  email: string;
  password: string;
  timestamp?: string;
}

export interface UserCard {
  id: string;
  username: string;
  email: string;
  timestamp: string;
  followersNum: number;
  followingNum: number;
  isFollowing: number;
}

export interface Like {
  id?: string;
  blogId: string;
  userId: string;
}

export interface JwtObject {
  userId: string;
}
