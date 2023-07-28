import mysql, { RowDataPacket } from 'mysql2';
import { Pool } from 'mysql2/promise';

import { DataStoreDao } from '..';
import { UsersList } from '../../../../shared/src/api/user.api.types';
import {
  Blog,
  Comment,
  Like,
  LikedUser,
  Space,
  SpaceMember,
  User,
  UserCard,
} from '../../../../shared/src/types';

export class SqlDataStore implements DataStoreDao {
  private pool!: Pool;
  public defaultSpcId = '1';

  async runDB() {
    this.pool = mysql
      .createPool({
        host: process.env.MY_SQL_DB_HOST,
        user: process.env.MY_SQL_DB_USER,
        database: process.env.MY_SQL_DB_DATABASE,
        password: process.env.MY_SQL_DB_PASSWORD,
      })
      .promise();

    return this;
  }

  async getUserSpaces(userId: string): Promise<Space[]> {
    const query = `
      SELECT s.*
      FROM spaces s
      JOIN members m ON s.id = m.spaceId
      JOIN users u ON m.memberId = u.id
      WHERE u.id=?;
      `;
    return this.pool.query<RowDataPacket[]>(query, userId).then(([rows]) => rows as Space[]);
  }

  async deleteBlogLikes(blogId: string): Promise<void> {
    const query = `
    DELETE FROM likes WHERE blogId=?
    `;
    await this.pool.query(query, blogId);
  }

  async deleteComments(blogId: string): Promise<void> {
    const query = `
    DELETE FROM comments WHERE blogId=?
    `;
    await this.pool.query<RowDataPacket[]>(query, blogId);
  }

  updateUser(_user: User): Promise<void> {
    throw new Error('Method not implemented.');
  }
  deleteUser(_userId: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async createComment(comment: Comment): Promise<void> {
    await this.pool.query<RowDataPacket[]>(
      'INSERT INTO comments SET id=?, blogId=?, userId=?, content=?, timestamp=?',
      [comment.id, comment.blogId, comment.userId, comment.content, comment.timestamp]
    );
  }
  async updateComment(comment: Pick<Comment, 'content' | 'id'>): Promise<void> {
    const query = `
    UPDATE comments 
    SET content=?
    WHERE id=?
    `;
    await this.pool.query<RowDataPacket[]>(query, [comment.content, comment.id]);
  }
  async getComment(commentId: string): Promise<Comment> {
    const query = `
    SELECT * FROM comments WHERE id=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, commentId);
    return rows[0] as Comment;
  }
  async deleteComment(commentId: string): Promise<void> {
    const query = `
    DELETE FROM comments WHERE id=?
    `;
    await this.pool.query(query, commentId);
  }

  async spaceMembers(spaceId: string): Promise<SpaceMember[]> {
    const query = `
    SELECT users.username, users.id
    FROM members RIGHT JOIN users
    ON members.memberId = users.id
    WHERE spaceId=?
    ORDER BY users.username ASC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, spaceId);
    return rows as SpaceMember[];
  }

  async isMember(spaceId: string, memberId: string): Promise<boolean> {
    const query = `
    SELECT COUNT(*) AS res FROM members 
    WHERE spaceId=? AND memberId=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId, memberId]);
    const result = rows[0]['res'] as number;
    return result !== 1 ? false : true;
  }

  async updateBlog(blog: Blog): Promise<void> {
    const query = `
    UPDATE blogs
    SET title=?, content=?, spaceId=?
    WHERE id=?
    `;
    await this.pool.query<RowDataPacket[]>(query, [
      blog.title,
      blog.content,
      blog.spaceId,
      blog.id,
    ]);
  }
  async getComments(blogId: string): Promise<Comment[]> {
    const query = `
    SELECT * FROM comments WHERE blogId=?
    ORDER BY timestamp DESC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, blogId);

    return rows as Comment[];
  }
  async blogLikes(blogId: string): Promise<number> {
    const query = `
    SELECT COUNT(*) FROM likes WHERE blogId=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, blogId);

    return rows[0]['COUNT(*)'] as number;
  }
  async blogLikesList(blogId: string): Promise<LikedUser[]> {
    const query = `
    SELECT users.username, users.id
    FROM likes RIGHT JOIN users
    ON likes.userId = users.id
    WHERE blogId=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, blogId);

    return rows as LikedUser[];
  }

  async getFollowers(followingId: string): Promise<Pick<User, 'id' | 'username'>[]> {
    const query = `
    SELECT users.username, users.id
    FROM users
    INNER JOIN follows ON users.id = follows.followerId
    WHERE follows.followingId = ?
    ORDER BY users.username ASC
    `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [followingId]);

    return rows as Pick<User, 'id' | 'username'>[];
  }

  async createUser(user: User): Promise<void> {
    await this.pool.query<RowDataPacket[]>(
      'INSERT INTO users SET id=?, username=?, password=?, email=?',
      [user.id, user.username, user.password, user.email]
    );
  }

  async getUserById(userId: string): Promise<User | undefined> {
    const [rows] = await this.pool.query<RowDataPacket[]>(`SELECT * FROM users WHERE id = ?`, [
      userId,
    ]);
    return rows[0] as User;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );

    return rows[0] as User;
  }
  async getUserByEmail(email: string): Promise<User | undefined> {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM users WHERE email = ?', [
      email,
    ]);

    return rows[0] as User;
  }

  async getUserCard(userId: string, cardOwnerId: string): Promise<UserCard | undefined> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      `
          SELECT users.id, users.username, users.email, users.timestamp,  
          (SELECT COUNT(*) FROM follows WHERE follows.followingId = users.id) AS followersNum,
          (SELECT COUNT(*) FROM follows WHERE follows.followerId = users.id) AS followingNum,
          (SELECT COUNT(*) FROM follows WHERE follows.followerId = ? AND follows.followingId = users.id) AS isFollowing
          FROM users
          WHERE users.id = ?
          `,
      [userId, cardOwnerId]
    );

    return rows[0] as UserCard;
  }

  async getUsers(): Promise<User[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM users');
    return rows as User[];
  }

  async getUsersList(): Promise<UsersList[]> {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT username, id FRoM users');
    return rows as UsersList[];
  }

  async isFollow(followingId: string, userId: string): Promise<boolean> {
    const query = `
    SELECT followerId FROM follows 
    WHERE 
    followingId = ? AND followerId = ?
    `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [followingId, userId]);

    return rows[0] ? true : false;
  }

  async createFollow(followerId: string, followingId: string): Promise<void> {
    await this.pool.query<RowDataPacket[]>('INSERT INTO follows SET followerId=?, followingId=?', [
      followerId,
      followingId,
    ]);
  }

  async deleteFollow(followerId: string, followingId: string): Promise<void> {
    await this.pool.query<RowDataPacket[]>(
      'DELETE FROM follows WHERE followerId=? AND followingId=?',
      [followerId, followingId]
    );
  }

  async createBlog(blog: Blog): Promise<void> {
    await this.pool.query(
      'INSERT INTO blogs SET id=?, title=?, content=?, userId=?, spaceId=?, timestamp=?, author=?',
      [blog.id, blog.title, blog.content, blog.userId, blog.spaceId, blog.timestamp, blog.author]
    );
  }

  async getBlogs(spaceId: string): Promise<Blog[]> {
    const query = `
    SELECT blogs.* FROM blogs
    WHERE blogs.spaceId = ?
    ORDER BY blogs.timestamp DESC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId]);
    return rows as Blog[];
  }

  async getBlog(blogId: string): Promise<Blog | undefined> {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM blogs WHERE id=?', [
      blogId,
    ]);
    return rows[0] as Blog;
  }

  async deleteBlog(blogId: string): Promise<void> {
    await this.deleteBlogLikes(blogId);
    await this.deleteComments(blogId);
    await this.pool.query('DELETE FROM blogs WHERE id=?', [blogId]);
  }

  async getUserBlogs(userId: string): Promise<Blog[]> {
    const query = `
    SELECT blogs.* FROM blogs
    WHERE blogs.userId = ?
    ORDER BY blogs.timestamp DESC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows as Blog[];
  }

  async createSpace(space: Space): Promise<void> {
    await this.pool.query<RowDataPacket[]>(
      'INSERT INTO spaces SET description=?, id=?, name=?, ownerId=?, status=?',
      [space.description, space.id, space.name, space.ownerId, space.status]
    );
  }

  getDefaultSpace(): Promise<Space | undefined> {
    throw new Error('Method not implemented.');
  }

  async getSpace(spaceId: string): Promise<Space | undefined> {
    const [rows] = await this.pool.query<RowDataPacket[]>('SELECT * FROM spaces WHERE id = ?', [
      spaceId,
    ]);
    return rows[0] as Space;
  }

  async updateSpace(space: Space): Promise<Space | undefined> {
    const [rows] = await this.pool.query<RowDataPacket[]>(
      'UPDATE spaces SET name=?, status=?, description=? WHERE id=?',
      [space.name, space.status, space.description, space.id]
    );
    return rows[0] as Space;
  }

  async addMember(spaceId: string, memberId: string): Promise<void> {
    await this.pool.query<RowDataPacket[]>('INSERT INTO members SET memberId=?, spaceId=?', [
      memberId,
      spaceId,
    ]);
  }

  async deleteSpace(spaceId: string): Promise<void> {
    await this.pool.query<RowDataPacket[]>('DELETE FROM spaces WHERE id=?', [spaceId]);
  }

  async getSpaces(userId: string): Promise<Space[]> {
    const query = `
    SELECT spaces.* FROM spaces
    WHERE spaces.ownerId = ?
    ORDER BY spaces.timestamp DESC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, userId);
    return rows as Space[];
  }

  async createLike(like: Like): Promise<void> {
    await this.pool.query<RowDataPacket[]>('INSERT INTO likes SET blogId=?, userId=?', [
      like.blogId,
      like.userId,
    ]);
  }

  async removeLike(like: Like): Promise<void> {
    const query = `
        DELETE FROM likes WHERE blogId=? AND userId=?
        `;
    await this.pool.query<RowDataPacket[]>(query, [like.blogId, like.userId]);
  }

  async isLiked(like: Like): Promise<boolean> {
    const query = `
        SELECT blogId FROM likes 
        WHERE
        likes.blogId=? AND likes.userId=?
        `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [like.blogId, like.userId]);
    return rows[0] ? true : false;
  }
}
