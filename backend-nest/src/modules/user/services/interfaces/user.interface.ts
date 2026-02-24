import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto, GetUserCardRes, UpdatePasswordReq } from '../../dto';

/**
 * IUserService interface
 * Responsibility: Core user management operations
 */
export interface IUserService {
  // User CRUD
  create(createUserDto: CreateUserDto): Promise<User>;
  findAll(): Promise<{ id: string; username: string }[]>;
  findById(id: string): Promise<User | null>;
  findByEmail(email: string): Promise<User | null>;
  findByUsername(username: string): Promise<User | null>;
  findByLogin(login: string): Promise<User | null>;
  update(id: string, updateUserDto: UpdateUserDto): Promise<User | null>;

  // Password Management
  updatePassword(id: string, updatePasswordDto: UpdatePasswordReq): Promise<void>;

  // User Info
  getUserCard(currentUserId: string, targetUserId: string): Promise<GetUserCardRes>;
  getUserBlogs(
    userId: string,
    page?: number,
    pageSize?: number,
  ): Promise<{ blogs: any[]; page: number }>;
  getUserSpaces(userId: string): Promise<any[]>;

  // Activity
  updateLastActive(userId: string): Promise<void>;
}
