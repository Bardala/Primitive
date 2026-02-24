import {
  AllowedRole,
  Blog,
  BlogSeries,
  BlogSeriesLink,
  BlogTag,
  ChatMessage,
  Comment,
  CommentWithUser,
  ConversationType,
  DefaultSpaceId,
  LastReadMsg,
  Like,
  LikedUser,
  Notification,
  PrivateConversation,
  PrivateMessage,
  Space,
  SpaceMember,
  SpacePermission,
  SpacePermissionType,
  SpaceTag,
  Tag,
  UnReadMsgs,
  User,
  UserActivity,
  UserCard,
  UserConversationState,
  UserTag,
  UsersList,
} from '@nest/shared';
import mysql, { RowDataPacket } from 'mysql2';
import { Pool } from 'mysql2/promise';

import { DataStoreDao } from '..';

export class SqlDataStore implements DataStoreDao {
  lastReadAt?: string | undefined;
  lastSoundPlayedAt?: string | undefined;
  private readonly blogIconLength = 500;
  private pool!: Pool;
  private prodProps: mysql.PoolOptions = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_ROOT_PASSWORD,
    // socketPath: process.env.MY_SQL_DB_SOCKET_PATH,
    multipleStatements: true,
    connectionLimit: 50,
  };
  private devProps: mysql.PoolOptions = {
    host: process.env.MYSQLHOST,
    user: process.env.MYSQLUSER,
    database: process.env.MYSQL_DATABASE,
    password: process.env.MYSQL_ROOT_PASSWORD,
    multipleStatements: true,
    connectionLimit: 20,
  };

  async runDB() {
    this.pool = mysql
      .createPool({
        ...(process.env.NODE_ENV === 'prod' ? this.prodProps : this.devProps),
      })
      .promise();

    return this;
  }

  async addUserTag(userTag: UserTag): Promise<void> {
    const { userId, tagId } = userTag;
    const query = `INSERT INTO user_tags (userId, tagId) VALUES (?, ?)`;
    await this.pool.query(query, [userId, tagId]);
  }

  async removeUserTag(userTag: UserTag): Promise<void> {
    const { userId, tagId } = userTag;
    const query = `DELETE FROM user_tags WHERE userId=? AND tagId=?`;
    await this.pool.query(query, [userId, tagId]);
  }

  async getUserTags(userId: string): Promise<Tag[]> {
    const query = `
    SELECT t.* FROM tags t
    JOIN user_tags ut ON t.id = ut.tagId
    WHERE ut.userId=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, userId);
    return rows as Tag[];
  }

  async getUsersByTag(tagId: string, limit: number = 50, offset: number = 0): Promise<string[]> {
    const query = `
    SELECT userId from user_tags
    WHERE tagId = ?
    LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [tagId, limit, offset]);
    return rows.map(row => row.userId as string);
  }

  async searchUsers(query: string): Promise<Pick<User, 'id' | 'username'>[]> {
    const searchQuery = `
    SELECT id, username FROM users 
    WHERE username LIKE ? OR email LIKE ?
    ORDER BY 
      CASE 
        WHEN username LIKE ? THEN 1 
        WHEN email LIKE ? THEN 2 
        ELSE 3 
      END,
      username
    LIMIT 50
    `;

    const searchTerm = `%${query}%`;
    const [rows] = await this.pool.query<RowDataPacket[]>(searchQuery, [
      searchTerm,
      searchTerm,
      `${query}%`,
      `${query}%`, // Prioritize exact starts
    ]);

    return rows as Pick<User, 'id' | 'username'>[];
  }

  async searchSpaces(query: string): Promise<Space[]> {
    const searchQuery = `
    SELECT s.*, u.username as ownerName 
    FROM spaces s
    JOIN users u ON s.ownerId = u.id
    WHERE s.name LIKE ? OR s.description LIKE ?
    ORDER BY 
      CASE 
        WHEN s.name LIKE ? THEN 1 
        WHEN s.description LIKE ? THEN 2 
        ELSE 3 
      END,
      s.name
    LIMIT 50
    `;

    const searchTerm = `%${query}%`;
    const [rows] = await this.pool.query<RowDataPacket[]>(searchQuery, [
      searchTerm,
      searchTerm,
      `${query}%`,
      `${query}%`, // Prioritize exact starts
    ]);

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      status: row.status,
      description: row.description,
      ownerId: row.ownerId,
      timestamp: row.timestamp,
    })) as Space[];
  }

  async getSpacesByOwner(ownerId: string): Promise<Space[]> {
    const query = `
    SELECT * FROM spaces 
    WHERE ownerId = ? 
    ORDER BY timestamp DESC
  `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [ownerId]);
    return rows as Space[];
  }

  async getSpaceStats(spaceId: string): Promise<{ memberCount: number; blogCount: number }> {
    const memberCountQuery = `SELECT COUNT(*) as memberCount FROM members WHERE spaceId = ?`;
    const blogCountQuery = `SELECT COUNT(*) as blogCount FROM blogs WHERE spaceId = ?`;

    const [[memberRows], [blogRows]] = await Promise.all([
      this.pool.query<RowDataPacket[]>(memberCountQuery, [spaceId]),
      this.pool.query<RowDataPacket[]>(blogCountQuery, [spaceId]),
    ]);

    return {
      memberCount: (memberRows[0]?.memberCount as number) || 0,
      blogCount: (blogRows[0]?.blogCount as number) || 0,
    };
  }

  async listConversationHistory(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<PrivateMessage[]> {
    const query = `
    SELECT pm.*, u.username as senderUsername 
    FROM private_messages pm
    JOIN users u ON pm.senderId = u.id
    WHERE pm.conversationId = ? 
    ORDER BY pm.createdAt DESC 
    LIMIT ? OFFSET ?
  `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [conversationId, limit, offset]);

    return rows.map(row => ({
      id: row.id,
      conversationId: row.conversationId,
      senderId: row.senderId,
      content: row.content,
      createdAt: row.createdAt,
    })) as PrivateMessage[];
  }

  async editDirectMessage(messageId: string, content: string): Promise<void> {
    const query = `UPDATE private_messages SET content = ? WHERE id = ?`;
    await this.pool.query(query, [content, messageId]);
  }

  async clearConversationHistory(conversationId: string): Promise<void> {
    const query = `DELETE FROM private_messages WHERE conversationId = ?`;
    await this.pool.query(query, [conversationId]);
  }

  async getLatestDirectMessageId(conversationId: string): Promise<string | undefined> {
    const query = `
    SELECT id FROM private_messages 
    WHERE conversationId = ? 
    ORDER BY createdAt DESC 
    LIMIT 1
  `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [conversationId]);
    return rows[0]?.id as string | undefined;
  }

  // Enhanced search with fuzzy matching and relevance scoring
  async searchUsersEnhanced(query: string): Promise<Pick<User, 'id' | 'username'>[]> {
    const searchQuery = `
    SELECT 
      id, 
      username,
      -- Relevance scoring
      CASE 
        WHEN username = ? THEN 100
        WHEN username LIKE ? THEN 80
        WHEN username LIKE ? THEN 60
        WHEN email = ? THEN 50
        WHEN email LIKE ? THEN 30
        ELSE 10
      END as relevance
    FROM users 
    WHERE username LIKE ? OR email LIKE ?
    ORDER BY relevance DESC, username
    LIMIT 50
  `;

    const searchTerm = `%${query}%`;
    const startsWith = `${query}%`;

    const [rows] = await this.pool.query<RowDataPacket[]>(searchQuery, [
      query,
      startsWith,
      searchTerm,
      query,
      searchTerm,
      searchTerm,
      searchTerm,
    ]);

    return rows.map(row => ({
      id: row.id,
      username: row.username,
    }));
  }

  // Enhanced space search with member count
  async searchSpacesEnhanced(
    query: string
  ): Promise<(Space & { memberCount: number; ownerName: string })[]> {
    const searchQuery = `
    SELECT 
      s.*, 
      u.username as ownerName,
      COUNT(m.memberId) as memberCount,
      CASE 
        WHEN s.name = ? THEN 100
        WHEN s.name LIKE ? THEN 80
        WHEN s.description LIKE ? THEN 60
        ELSE 10
      END as relevance
    FROM spaces s
    JOIN users u ON s.ownerId = u.id
    LEFT JOIN members m ON s.id = m.spaceId
    WHERE s.name LIKE ? OR s.description LIKE ?
    GROUP BY s.id, s.name, s.status, s.description, s.ownerId, s.timestamp, u.username
    ORDER BY relevance DESC, memberCount DESC
    LIMIT 50
  `;

    const searchTerm = `%${query}%`;
    const startsWith = `${query}%`;

    const [rows] = await this.pool.query<RowDataPacket[]>(searchQuery, [
      query,
      startsWith,
      searchTerm,
      searchTerm,
      searchTerm,
    ]);

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      status: row.status,
      description: row.description,
      ownerId: row.ownerId,
      timestamp: row.timestamp,
      memberCount: row.memberCount,
      ownerName: row.ownerName,
    })) as (Space & { memberCount: number; ownerName: string })[];
  }

  // Enhanced space stats with more metrics
  async getSpaceStatsEnhanced(spaceId: string): Promise<{
    memberCount: number;
    blogCount: number;
    activeMembers: number;
    recentBlogs: number;
  }> {
    const queries = {
      memberCount: `SELECT COUNT(*) as count FROM members WHERE spaceId = ?`,
      blogCount: `SELECT COUNT(*) as count FROM blogs WHERE spaceId = ?`,
      activeMembers: `
      SELECT COUNT(DISTINCT m.memberId) as count 
      FROM members m
      LEFT JOIN user_activity ua ON m.memberId = ua.userId
      WHERE m.spaceId = ? AND ua.lastActive > DATE_SUB(NOW(), INTERVAL 7 DAY)
    `,
      recentBlogs: `
      SELECT COUNT(*) as count 
      FROM blogs 
      WHERE spaceId = ? AND timestamp > UNIX_TIMESTAMP() * 1000 - (7 * 24 * 60 * 60 * 1000)
    `,
    };

    const [[memberRows], [blogRows], [activeRows], [recentRows]] = await Promise.all([
      this.pool.query<RowDataPacket[]>(queries.memberCount, [spaceId]),
      this.pool.query<RowDataPacket[]>(queries.blogCount, [spaceId]),
      this.pool.query<RowDataPacket[]>(queries.activeMembers, [spaceId]),
      this.pool.query<RowDataPacket[]>(queries.recentBlogs, [spaceId]),
    ]);

    return {
      memberCount: (memberRows[0]?.count as number) || 0,
      blogCount: (blogRows[0]?.count as number) || 0,
      activeMembers: (activeRows[0]?.count as number) || 0,
      recentBlogs: (recentRows[0]?.count as number) || 0,
    };
  }

  async getNumOfComments(blogId: string): Promise<number> {
    const query = `
    SELECT COUNT(*) AS comments FROM comments WHERE blogId=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, blogId);
    return rows[0]['comments'] as Promise<number>;
  }

  async getLastMsgId(spaceId: string): Promise<string> {
    const query = `
    SELECT id FROM chat WHERE spaceId=? ORDER BY timestamp DESC LIMIT 1
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, spaceId);

    return rows.length == 0 ? '' : (rows[0]['id'] as string);
  }

  async numOfUnReadMsgs(params: { userId: string; spaceId: string }): Promise<number> {
    const query = `
    SELECT COUNT(*) AS unread_count FROM chat c 
    JOIN 
    last_read lr 
    ON c.spaceId = lr.spaceId WHERE c.spaceId = ? 
    AND lr.userId = ?
    AND c.timestamp > (SELECT timestamp FROM chat WHERE id = lr.lastReadId);
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [params.spaceId, params.userId]);
    return rows[0]['unread_count'] as number;
  }

  async numOfAllUnReadMsgs(userId: string): Promise<UnReadMsgs[]> {
    const query = `
    SELECT c.spaceId AS chat_spaceId, s.name AS spaceName, COUNT(*) AS unread_count FROM chat c 
    JOIN last_read lr 
    ON c.spaceId = lr.spaceId 
    JOIN spaces s
    ON c.spaceId = s.id
    WHERE lr.userId = ? 
    AND c.timestamp > (SELECT timestamp FROM chat WHERE id = lr.lastReadId) 
    GROUP BY chat_spaceId, spaceName;
    `;

    return this.pool.query<RowDataPacket[]>(query, [userId]).then(([rows]) => rows as any);
  }

  // async updateLastRead(lastRead: LastReadMsg): Promise<void> {
  //   const query = `
  //   INSERT INTO last_read (userId, spaceId, lastReadId) VALUES (?, ?, ?)
  //   ON DUPLICATE KEY UPDATE lastReadId = ?;
  //   `;
  //   await this.pool.query(query, [
  //     lastRead.userId,
  //     lastRead.spaceId,
  //     lastRead.msgId,
  //     lastRead.msgId,
  //   ]);
  // }

  async getSmartFeeds(memberId: string, pageSize: number, offset: number): Promise<Blog[]> {
    const query = `
    WITH blog_scores AS (
      SELECT 
        b.id,
        b.title,
        SUBSTRING(b.content, 1, ${this.blogIconLength}) AS content,  -- Only select content once
        b.userId,
        b.spaceId,
        b.author,
        b.timestamp,
        -- Calculate score components
        EXP(-(UNIX_TIMESTAMP() * 1000 - b.timestamp) / (1000 * 60 * 60 * 48)) as time_score,
        LOG(1 + COUNT(DISTINCT l.userId)) / LOG(100) as like_score,
        LOG(1 + COUNT(DISTINCT c.id)) / LOG(50) as comment_score,
        LOG(1 + COUNT(DISTINCT CASE 
          WHEN rc.timestamp > UNIX_TIMESTAMP() * 1000 - (24 * 60 * 60 * 1000) 
          THEN rc.id END
        )) / LOG(20) as recent_comment_score,
        -- Final weighted score
        (EXP(-(UNIX_TIMESTAMP() * 1000 - b.timestamp) / (1000 * 60 * 60 * 48)) * 0.4) +
        (LOG(1 + COUNT(DISTINCT l.userId)) / LOG(100) * 0.25) +
        (LOG(1 + COUNT(DISTINCT c.id)) / LOG(50) * 0.2) +
        (LOG(1 + COUNT(DISTINCT CASE 
          WHEN rc.timestamp > UNIX_TIMESTAMP() * 1000 - (24 * 60 * 60 * 1000) 
          THEN rc.id END
        )) / LOG(20) * 0.15) as score
        
      FROM blogs b
      LEFT JOIN likes l ON b.id = l.blogId
      LEFT JOIN comments c ON b.id = c.blogId
      LEFT JOIN comments rc ON b.id = rc.blogId
      
      WHERE b.spaceId IN (
        SELECT spaceId FROM members WHERE memberId = ? AND spaceId != '1'
      )
      OR b.userId IN (
        SELECT followingId FROM follows WHERE followerId = ? AND b.spaceId = '1'
      )
      OR b.userId = ?
      
      GROUP BY b.id, b.title, b.content, b.userId, b.spaceId, b.author, b.timestamp
    )
    SELECT * FROM blog_scores
    ORDER BY score DESC, timestamp DESC
    LIMIT ? OFFSET ?
  `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [
      memberId,
      memberId,
      memberId,
      pageSize,
      offset,
    ]);

    return rows as Blog[];
  }

  async getSmartPublicFeeds(pageSize: number, offset: number): Promise<Blog[]> {
    const query = `
    WITH blog_scores AS (
      SELECT 
        b.id,
        b.title,
        SUBSTRING(b.content, 1, ${this.blogIconLength}) AS content,
        b.userId,
        b.spaceId,
        b.author,
        b.timestamp,
        -- Enhanced scoring logic for public content
        EXP(-(UNIX_TIMESTAMP() * 1000 - b.timestamp) / (1000 * 60 * 60 * 48)) as time_score,
        LOG(1 + COUNT(DISTINCT l.userId)) / LOG(100) as like_score,
        LOG(1 + COUNT(DISTINCT c.id)) / LOG(50) as comment_score,
        LOG(1 + COUNT(DISTINCT CASE 
          WHEN rc.timestamp > UNIX_TIMESTAMP() * 1000 - (24 * 60 * 60 * 1000) 
          THEN rc.id END
        )) / LOG(20) as recent_comment_score,
        -- Final weighted score (same weights as authenticated version for consistency)
        (EXP(-(UNIX_TIMESTAMP() * 1000 - b.timestamp) / (1000 * 60 * 60 * 48)) * 0.4) +
        (LOG(1 + COUNT(DISTINCT l.userId)) / LOG(100) * 0.25) +
        (LOG(1 + COUNT(DISTINCT c.id)) / LOG(50) * 0.2) +
        (LOG(1 + COUNT(DISTINCT CASE 
          WHEN rc.timestamp > UNIX_TIMESTAMP() * 1000 - (24 * 60 * 60 * 1000) 
          THEN rc.id END
        )) / LOG(20) * 0.15) as score
        
      FROM blogs b
      LEFT JOIN likes l ON b.id = l.blogId
      LEFT JOIN comments c ON b.id = c.blogId
      LEFT JOIN comments rc ON b.id = rc.blogId
      LEFT JOIN spaces s ON b.spaceId = s.id
      
      -- Include all public spaces (not just spaceId = '1')
      WHERE s.status = 'public' OR b.spaceId = '1'
      
      GROUP BY b.id, b.title, b.content, b.userId, b.spaceId, b.author, b.timestamp
    )
    SELECT * FROM blog_scores
    ORDER BY score DESC, timestamp DESC
    LIMIT ? OFFSET ?
  `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [pageSize, offset]);
    return rows as Blog[];
  }

  async getFeeds(memberId: string, pageSize: number, offset: number): Promise<Blog[]> {
    const query = `
    SELECT blogs.*, SUBSTRING(blogs.content, 1, ${this.blogIconLength}) AS content FROM blogs
    WHERE blogs.spaceId IN (
      SELECT spaceId FROM members WHERE memberId = ? AND NOT spaceId = '1' 
    )
    OR blogs.userId IN(
      SELECT followingId FROM follows WHERE followerId = ? AND blogs.spaceId = '1'
    ) 
    OR blogs.userId = ?
    ORDER BY blogs.timestamp DESC
    LIMIT ? OFFSET ? 
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [
      memberId,
      memberId,
      memberId,
      pageSize,
      offset,
    ]);
    const blogs = rows as Blog[];
    return blogs;
  }

  async getPublicFeeds(pageSize: number, offset: number): Promise<Blog[]> {
    const query = `
  SELECT 
    blogs.*, 
    SUBSTRING(blogs.content, 1, ${this.blogIconLength}) AS content 
  FROM blogs
  INNER JOIN spaces ON blogs.spaceId = spaces.id
  WHERE spaces.status = 'public'  -- Only public spaces
  ORDER BY blogs.timestamp DESC
  LIMIT ? OFFSET ?
  `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [pageSize, offset]);
    const blogs = rows as Blog[];
    return blogs;
  }

  async getPostLikes(postId: string): Promise<LikedUser[]> {
    const query = `
    SELECT users.username, users.id
    FROM likes RIGHT JOIN users
    ON likes.userId = users.id
    WHERE blogId=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, postId);
    return rows as LikedUser[];
  }

  async getShComments(shortId: string): Promise<CommentWithUser[]> {
    const query = `
    SELECT * FROM Comments WHERE blogId=?
    ORDER BY timestamp DESC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, shortId);
    return rows as CommentWithUser[];
  }

  async deleteShComments(shortId: string): Promise<void> {
    const query = `
    DELETE FROM Comments WHERE blogId=?
    `;
    await this.pool.query(query, shortId);
  }

  async shortLikes(shortId: string): Promise<number> {
    const query = `
    SELECT COUNT(*) As likes FROM shLikes WHERE blogId=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, shortId);
    return rows[0]['likes'] as number;
  }

  async shortLikesList(shortId: string): Promise<LikedUser[]> {
    const query = `
    SELECT userId, username 
    FROM likes 
    RIGHT JOIN users 
    ON likes.userId = users.id WHERE blogId=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, shortId);
    return rows as LikedUser[];
  }

  async getSpaceChat(spaceId: string, limit = 100): Promise<ChatMessage[]> {
    const query = `
    SELECT * FROM chat WHERE spaceId=?
    ORDER BY timestamp DESC
    LIMIT ?
  `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId, limit]);
    return rows as ChatMessage[]; // return oldest -> newest
  }

  async createMessage(message: ChatMessage): Promise<void> {
    const query = `
    INSERT INTO chat SET id=?, userId=?, spaceId=?, content=?, timestamp=?, username=?
    `;
    await this.pool.query<RowDataPacket[]>(query, [
      message.id,
      message.userId,
      message.spaceId,
      message.content,
      message.timestamp,
      message.username,
    ]);
  }

  async getMessage(messageId: string): Promise<ChatMessage> {
    const query = `
    SELECT * FROM chat WHERE id=?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, messageId);
    return rows[0] as ChatMessage;
  }

  async deleteMessage(messageId: string): Promise<void> {
    const query = `
    DELETE FROM chat WHERE id=?
    `;
    await this.pool.query(query, messageId);
  }

  async getUserSpaces(userId: string): Promise<Space[]> {
    const query = `
    SELECT 
        s.*,
        COALESCE(blog_count, 0) AS user_blog_count,
        COALESCE(like_count, 0) AS user_like_count,
        COALESCE(comment_count, 0) AS user_comment_count,
        COALESCE(chat_count, 0) AS user_chat_count,
        (COALESCE(blog_count, 0) * 3 + 
        COALESCE(like_count, 0) * 1 + 
        COALESCE(comment_count, 0) * 2 + 
        COALESCE(chat_count, 0) * 2) AS interaction_score
    FROM spaces s
    JOIN members m ON s.id = m.spaceId
    JOIN users u ON m.memberId = u.id
    LEFT JOIN (
        SELECT spaceId, COUNT(*) AS blog_count
        FROM blogs 
        WHERE userId = ?
        GROUP BY spaceId
    ) bc ON s.id = bc.spaceId
    LEFT JOIN (
        SELECT b.spaceId, COUNT(*) AS like_count
        FROM likes l
        JOIN blogs b ON l.blogId = b.id
        WHERE l.userId = ?
        GROUP BY b.spaceId
    ) lc ON s.id = lc.spaceId
    LEFT JOIN (
        SELECT b.spaceId, COUNT(*) AS comment_count
        FROM comments c
        JOIN blogs b ON c.blogId = b.id
        WHERE c.userId = ?
        GROUP BY b.spaceId
    ) cc ON s.id = cc.spaceId
    LEFT JOIN (
        SELECT spaceId, COUNT(*) AS chat_count
        FROM chat 
        WHERE userId = ?
        GROUP BY spaceId
    ) chc ON s.id = chc.spaceId
    WHERE u.id = ?
    ORDER BY interaction_score DESC, user_blog_count DESC, user_chat_count DESC;
    `;

    // Pass an array with the userId repeated for each placeholder
    return this.pool
      .query<RowDataPacket[]>(query, [userId, userId, userId, userId, userId])
      .then(([rows]) => rows as Space[]);
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

  async updateUserPassword(userId: string, newHashedPassword: string): Promise<void> {
    const query = `
    UPDATE users SET password=? WHERE id=?
    `;
    await this.pool.query<RowDataPacket[]>(query, [newHashedPassword, userId]);
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

  // async getSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
  //   const query = `
  //   SELECT members.*, users.username
  //   FROM members JOIN users ON members.memberId = users.id
  //   WHERE spaceId=?
  //   `;
  //   const [rows] = await this.pool.query<RowDataPacket[]>(query, spaceId);
  //   return rows as SpaceMember[];
  // }

  // async isMember(spaceId: string, memberId: string): Promise<User | undefined> {
  //   const query = `
  //   SELECT u.* FROM members m
  //   JOIN users u ON m.memberId = u.id
  //   WHERE m.spaceId = ? AND m.memberId = ?
  //   `;
  //   const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId, memberId]);
  //   return rows[0] as User;
  // }

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
  async getComments(blogId: string): Promise<CommentWithUser[]> {
    const query = `
    SELECT comments.*, users.username AS author
    FROM comments
    JOIN users ON comments.userId = users.id
    WHERE comments.blogId = ?
    ORDER BY comments.timestamp DESC;
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, blogId);
    return rows as CommentWithUser[];
  }

  async blogLikes(blogId: string, userId: string): Promise<{ likes: number; isLiked: boolean }> {
    const query = `
    SELECT 
        (SELECT COUNT(*) FROM likes WHERE blogId=?) AS likesCount,
        (SELECT COUNT(*) FROM likes WHERE blogId=? AND userId=?) > 0 AS userLikes
    `;

    const [rows] = await this.pool.query<RowDataPacket[]>(query, [blogId, blogId, userId]);

    const likes = rows[0]['likesCount'] as number;
    const isLiked = rows[0]['userLikes'] as boolean;

    return { likes, isLiked };
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

  // async getFollowers(followingId: string): Promise<Pick<User, 'id' | 'username'>[]> {
  //   const query = `
  //   SELECT users.username, users.id
  //   FROM users
  //   INNER JOIN follows ON users.id = follows.followerId
  //   WHERE follows.followingId = ?
  //   ORDER BY users.username ASC
  //   `;

  //   const [rows] = await this.pool.query<RowDataPacket[]>(query, [followingId]);

  //   return rows as Pick<User, 'id' | 'username'>[];
  // }

  private async createMainSpace(ownerId: string): Promise<void> {
    const query = `
    INSERT INTO spaces (id, name, status, ownerId, description, timestamp) VALUES (?,?,?,?,?,?)
    `;
    await this.pool.query<RowDataPacket[]>(query, [
      '1',
      'Home Space',
      'public',
      ownerId,
      'This the app home',
      Date.now(),
    ]);
  }

  async getNumberOfUsers(): Promise<number> {
    const query = 'SELECT COUNT(*) AS nums FROM users';
    const [rows] = await this.pool.query<RowDataPacket[]>(query);

    return rows[0]['nums'] as Promise<number>;
  }

  async createUser(user: User): Promise<void> {
    await this.pool.query<RowDataPacket[]>(
      'INSERT INTO users SET id=?, username=?, password=?, email=?, timestamp=?',
      [user.id, user.username, user.password, user.email, user.timestamp]
    );
    // todo: Use another approach instead of this, because the system implements unnecessary queries for enrolling every new user
    const numberOfUsers = await this.getNumberOfUsers();
    if (numberOfUsers == 1) await this.createMainSpace(user.id);
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

  // async createFollow(followerId: string, followingId: string): Promise<void> {
  //   await this.pool.query<RowDataPacket[]>('INSERT INTO follows SET followerId=?, followingId=?', [
  //     followerId,
  //     followingId,
  //   ]);
  // }

  // async deleteFollow(followerId: string, followingId: string): Promise<void> {
  //   await this.pool.query<RowDataPacket[]>(
  //     'DELETE FROM follows WHERE followerId=? AND followingId=?',
  //     [followerId, followingId]
  //   );
  // }

  async createBlog(blog: Blog): Promise<void> {
    await this.pool.query(
      'INSERT INTO blogs SET id=?, title=?, content=?, userId=?, spaceId=?, timestamp=?, author=?',
      [blog.id, blog.title, blog.content, blog.userId, blog.spaceId, blog.timestamp, blog.author]
    );
  }

  async getBlogs(spaceId: string, pageSize: number, offset: number): Promise<Blog[]> {
    const query = `
    SELECT blogs.*, SUBSTRING(blogs.content, 1, ${this.blogIconLength}) AS content FROM blogs
    WHERE blogs.spaceId = ?
    ORDER BY blogs.timestamp DESC
    LIMIT ? OFFSET ?
  `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId, pageSize, offset]);
    const blogs = rows as Blog[];
    return blogs;
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

  async getUserDefaultSpaceBlogs(
    userId: string,
    pageSize: number,
    offset: number
  ): Promise<Blog[]> {
    const q = `
    SELECT blogs.*, SUBSTRING(blogs.content, 1, ${this.blogIconLength}) AS content FROM blogs
    WHERE blogs.spaceId = ? AND userId = ? 
    ORDER BY blogs.timestamp DESC
    LIMIT ? OFFSET ?
    `;

    const [rows] = await this.pool.query<RowDataPacket[]>(q, [
      DefaultSpaceId,
      userId,
      pageSize,
      offset,
    ]);
    const blogs = rows as Blog[];
    return blogs;
  }

  async getUserBlogs(userId: string, pageSize: number, offset: number): Promise<Blog[]> {
    const query = `
    SELECT blogs.*, SUBSTRING(blogs.content, 1, ${this.blogIconLength}) AS content
    FROM blogs
    JOIN spaces ON blogs.spaceId = spaces.id
    WHERE blogs.userId = ? AND spaces.status = 'public'
    ORDER BY blogs.timestamp DESC
    LIMIT ? OFFSET ?
  `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId, pageSize, offset]);
    const blogs = rows as Blog[];
    return blogs;
  }

  async createSpace(space: Space): Promise<void> {
    await this.pool.query<RowDataPacket[]>(
      'INSERT INTO spaces SET description=?, id=?, name=?, ownerId=?, status=?, timestamp=?',
      [space.description, space.id, space.name, space.ownerId, space.status, space.timestamp]
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

  // ===== BlogSeriesDao Implementation =====
  async createSeries(series: BlogSeries): Promise<void> {
    const query = `
      INSERT INTO blog_series (id, name, description, createdBy, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `;
    await this.pool.query(query, [
      series.id,
      series.name,
      series.description || null,
      series.createdBy,
      series.createdAt || new Date().toISOString(),
    ]);
  }

  async updateSeries(series: BlogSeries): Promise<void> {
    const query = `
      UPDATE blog_series SET name = ?, description = ? WHERE id = ?
    `;
    await this.pool.query(query, [series.name, series.description || null, series.id]);
  }

  async getSeries(seriesId: string): Promise<BlogSeries | undefined> {
    const query = `SELECT * FROM blog_series WHERE id = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [seriesId]);
    return rows[0] as BlogSeries | undefined;
  }

  async getUserSeries(userId: string): Promise<BlogSeries[]> {
    const query = `SELECT * FROM blog_series WHERE createdBy = ? ORDER BY createdAt DESC`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows as BlogSeries[];
  }

  async deleteSeries(seriesId: string): Promise<void> {
    const query = `DELETE FROM blog_series WHERE id = ?`;
    await this.pool.query(query, [seriesId]);
  }

  async addBlogToSeries(link: BlogSeriesLink): Promise<void> {
    const query = `
      INSERT INTO blog_series_links (seriesId, blogId, position)
      VALUES (?, ?, ?)
      ON DUPLICATE KEY UPDATE position = ?
    `;
    await this.pool.query(query, [link.seriesId, link.blogId, link.position, link.position]);
  }

  async removeBlogFromSeries(seriesId: string, blogId: string): Promise<void> {
    const query = `DELETE FROM blog_series_links WHERE seriesId = ? AND blogId = ?`;
    await this.pool.query(query, [seriesId, blogId]);
  }

  async updateBlogPosition(seriesId: string, blogId: string, position: number): Promise<void> {
    const query = `UPDATE blog_series_links SET position = ? WHERE seriesId = ? AND blogId = ?`;
    await this.pool.query(query, [position, seriesId, blogId]);
  }

  async getSeriesBlogs(seriesId: string): Promise<BlogSeriesLink[]> {
    const query = `
      SELECT * FROM blog_series_links 
      WHERE seriesId = ? 
      ORDER BY position ASC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [seriesId]);
    return rows as BlogSeriesLink[];
  }

  async getBlogSeries(blogId: string): Promise<BlogSeries[]> {
    const query = `
      SELECT bs.* FROM blog_series bs
      JOIN blog_series_links bsl ON bs.id = bsl.seriesId
      WHERE bsl.blogId = ?
      ORDER BY bs.createdAt DESC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [blogId]);
    return rows as BlogSeries[];
  }

  async getSeriesWithBlogs(
    seriesId: string
  ): Promise<{ series: BlogSeries; blogs: BlogSeriesLink[] } | undefined> {
    const series = await this.getSeries(seriesId);
    if (!series) return undefined;

    const blogs = await this.getSeriesBlogs(seriesId);
    return { series, blogs };
  }

  // ===== NotificationDao Implementation =====
  async createNotification(notification: Notification): Promise<void> {
    const query = `
      INSERT INTO notifications (id, userId, type, refId, payload, isRead, createdAt)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
    await this.pool.query(query, [
      notification.id,
      notification.userId,
      notification.type,
      notification.refId || null,
      notification.payload ? JSON.stringify(notification.payload) : null,
      notification.isRead,
      notification.createdAt,
    ]);
  }

  async getUserNotifications(
    userId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<Notification[]> {
    const query = `
      SELECT * FROM notifications 
      WHERE userId = ? 
      ORDER BY createdAt DESC 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId, limit, offset]);
    return rows.map(row => ({
      ...row,
      payload: row.payload ? JSON.parse(row.payload) : undefined,
    })) as Notification[];
  }

  async getUnreadNotifications(userId: string): Promise<Notification[]> {
    const query = `
      SELECT * FROM notifications 
      WHERE userId = ? AND isRead = FALSE 
      ORDER BY createdAt DESC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows.map(row => ({
      ...row,
      payload: row.payload ? JSON.parse(row.payload) : undefined,
    })) as Notification[];
  }

  async markAsRead(notificationId: string): Promise<void> {
    const query = `UPDATE notifications SET isRead = TRUE WHERE id = ?`;
    await this.pool.query(query, [notificationId]);
  }

  async markAllAsRead(userId: string): Promise<void> {
    const query = `UPDATE notifications SET isRead = TRUE WHERE userId = ?`;
    await this.pool.query(query, [userId]);
  }

  async deleteNotification(notificationId: string): Promise<void> {
    const query = `DELETE FROM notifications WHERE id = ?`;
    await this.pool.query(query, [notificationId]);
  }

  async deleteUserNotifications(userId: string): Promise<void> {
    const query = `DELETE FROM notifications WHERE userId = ?`;
    await this.pool.query(query, [userId]);
  }

  async getNotificationCount(userId: string): Promise<{ total: number; unread: number }> {
    const query = `
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN isRead = FALSE THEN 1 ELSE 0 END) as unread
      FROM notifications 
      WHERE userId = ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return {
      total: rows[0].total as number,
      unread: rows[0].unread as number,
    };
  }

  // ===== PrivateConversationDao Implementation =====
  async createConversation(conversation: PrivateConversation): Promise<void> {
    const query = `
      INSERT INTO private_conversations (id, user1Id, user2Id, createdAt)
      VALUES (?, ?, ?, ?)
    `;
    await this.pool.query(query, [
      conversation.id,
      conversation.user1Id,
      conversation.user2Id,
      conversation.createdAt || new Date().toISOString(),
    ]);
  }

  async getConversation(conversationId: string): Promise<PrivateConversation | undefined> {
    const query = `SELECT * FROM private_conversations WHERE id = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [conversationId]);
    return rows[0] as PrivateConversation | undefined;
  }

  async getConversationByUsers(
    user1Id: string,
    user2Id: string
  ): Promise<PrivateConversation | undefined> {
    const query = `
      SELECT * FROM private_conversations 
      WHERE (user1Id = ? AND user2Id = ?) OR (user1Id = ? AND user2Id = ?)
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [
      user1Id,
      user2Id,
      user2Id,
      user1Id,
    ]);
    return rows[0] as PrivateConversation | undefined;
  }

  async getUserConversations(userId: string): Promise<PrivateConversation[]> {
    const query = `
      SELECT * FROM private_conversations 
      WHERE user1Id = ? OR user2Id = ?
      ORDER BY createdAt DESC
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId, userId]);
    return rows as PrivateConversation[];
  }

  async deleteConversation(conversationId: string): Promise<void> {
    const query = `DELETE FROM private_conversations WHERE id = ?`;
    await this.pool.query(query, [conversationId]);
  }

  // ===== PrivateMessageDao Implementation =====
  async sendDirectMessage(message: PrivateMessage): Promise<void> {
    const query = `
      INSERT INTO private_messages (id, conversationId, senderId, content, createdAt)
      VALUES (?, ?, ?, ?, ?)
    `;
    await this.pool.query(query, [
      message.id,
      message.conversationId,
      message.senderId,
      message.content,
      message.createdAt || new Date().toISOString(),
    ]);
  }

  async fetchDirectMessage(messageId: string): Promise<PrivateMessage | undefined> {
    const query = `SELECT * FROM private_messages WHERE id = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [messageId]);
    return rows[0] as PrivateMessage | undefined;
  }

  async getConversationMessages(
    conversationId: string,
    limit: number = 50,
    offset: number = 0
  ): Promise<PrivateMessage[]> {
    const query = `
      SELECT * FROM private_messages 
      WHERE conversationId = ? 
      ORDER BY createdAt ASC 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [conversationId, limit, offset]);
    return rows as PrivateMessage[];
  }

  async updateMessage(messageId: string, content: string): Promise<void> {
    const query = `UPDATE private_messages SET content = ? WHERE id = ?`;
    await this.pool.query(query, [content, messageId]);
  }

  async removeDirectMessage(messageId: string): Promise<void> {
    const query = `DELETE FROM private_messages WHERE id = ?`;
    await this.pool.query(query, [messageId]);
  }

  async deleteConversationMessages(conversationId: string): Promise<void> {
    const query = `DELETE FROM private_messages WHERE conversationId = ?`;
    await this.pool.query(query, [conversationId]);
  }

  async getLastMessageId(conversationId: string): Promise<string | undefined> {
    const query = `
      SELECT id FROM private_messages 
      WHERE conversationId = ? 
      ORDER BY createdAt DESC 
      LIMIT 1
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [conversationId]);
    return rows[0]?.id as string | undefined;
  }

  // ===== FollowDao Implementation =====
  async createFollow(followerId: string, followingId: string): Promise<void> {
    const query = `INSERT INTO follows (followerId, followingId) VALUES (?, ?)`;
    await this.pool.query(query, [followerId, followingId]);
  }

  async deleteFollow(followerId: string, followingId: string): Promise<void> {
    const query = `DELETE FROM follows WHERE followerId = ? AND followingId = ?`;
    await this.pool.query(query, [followerId, followingId]);
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

  async getFollowing(followerId: string): Promise<Pick<User, 'id' | 'username'>[]> {
    const query = `
      SELECT u.id, u.username FROM follows f
      JOIN users u ON f.followingId = u.id
      WHERE f.followerId = ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [followerId]);
    return rows as Pick<User, 'id' | 'username'>[];
  }

  async isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const query = `SELECT 1 FROM follows WHERE followerId = ? AND followingId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [followerId, followingId]);
    return rows.length > 0;
  }

  async getFollowerCount(userId: string): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM follows WHERE followingId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows[0].count as number;
  }

  async getFollowingCount(userId: string): Promise<number> {
    const query = `SELECT COUNT(*) as count FROM follows WHERE followerId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows[0].count as number;
  }

  // ===== TagDao Implementation =====
  async createTag(tag: Tag): Promise<void> {
    const query = `INSERT INTO tags (id, name) VALUES (?, ?)`;
    await this.pool.query(query, [tag.id, tag.name]);
  }

  async getTag(tagId: string): Promise<Tag | undefined> {
    const query = `SELECT * FROM tags WHERE id = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [tagId]);
    return rows[0] as Tag | undefined;
  }

  async getTagByName(name: string): Promise<Tag | undefined> {
    const query = `SELECT * FROM tags WHERE name = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [name]);
    return rows[0] as Tag | undefined;
  }

  async getAllTags(): Promise<Tag[]> {
    const query = `SELECT * FROM tags ORDER BY name`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query);
    return rows as Tag[];
  }

  async deleteTag(tagId: string): Promise<void> {
    const query = `DELETE FROM tags WHERE id = ?`;
    await this.pool.query(query, [tagId]);
  }

  async addBlogTag(blogTag: BlogTag): Promise<void> {
    const query = `INSERT INTO blog_tags (blogId, tagId) VALUES (?, ?)`;
    await this.pool.query(query, [blogTag.blogId, blogTag.tagId]);
  }

  async removeBlogTag(blogTag: BlogTag): Promise<void> {
    const query = `DELETE FROM blog_tags WHERE blogId = ? AND tagId = ?`;
    await this.pool.query(query, [blogTag.blogId, blogTag.tagId]);
  }

  async getBlogTags(blogId: string): Promise<Tag[]> {
    const query = `
      SELECT t.* FROM tags t
      JOIN blog_tags bt ON t.id = bt.tagId
      WHERE bt.blogId = ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [blogId]);
    return rows as Tag[];
  }

  async getBlogsByTag(tagId: string, limit: number = 50, offset: number = 0): Promise<string[]> {
    const query = `
      SELECT blogId FROM blog_tags 
      WHERE tagId = ? 
      LIMIT ? OFFSET ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [tagId, limit, offset]);
    return rows.map(row => row.blogId as string);
  }

  async addSpaceTag(spaceTag: SpaceTag): Promise<void> {
    const query = `INSERT INTO space_tags (spaceId, tagId) VALUES (?, ?)`;
    await this.pool.query(query, [spaceTag.spaceId, spaceTag.tagId]);
  }

  async removeSpaceTag(spaceTag: SpaceTag): Promise<void> {
    const query = `DELETE FROM space_tags WHERE spaceId = ? AND tagId = ?`;
    await this.pool.query(query, [spaceTag.spaceId, spaceTag.tagId]);
  }

  async getSpaceTags(spaceId: string): Promise<Tag[]> {
    const query = `
      SELECT t.* FROM tags t
      JOIN space_tags st ON t.id = st.tagId
      WHERE st.spaceId = ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId]);
    return rows as Tag[];
  }

  async getSpacesByTag(tagId: string): Promise<string[]> {
    const query = `SELECT spaceId FROM space_tags WHERE tagId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [tagId]);
    return rows.map(row => row.spaceId as string);
  }

  // ===== LastReadDao Implementation =====
  async updateLastRead(lastRead: LastReadMsg): Promise<void> {
    const query = `
    INSERT INTO last_read (userId, spaceId, lastReadId) VALUES (?, ?, ?)  
    ON DUPLICATE KEY UPDATE lastReadId = ?;
    `;
    await this.pool.query(query, [
      lastRead.userId,
      lastRead.spaceId,
      lastRead.lastReadId,
      lastRead.lastReadId,
    ]);
  }

  async getLastRead(userId: string, spaceId: string): Promise<LastReadMsg | undefined> {
    const query = `SELECT * FROM last_read WHERE userId = ? AND spaceId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId, spaceId]);
    return rows[0] as LastReadMsg | undefined;
  }

  async deleteUserLastRead(userId: string): Promise<void> {
    const query = `DELETE FROM last_read WHERE userId = ?`;
    await this.pool.query(query, [userId]);
  }

  async deleteSpaceLastRead(spaceId: string): Promise<void> {
    const query = `DELETE FROM last_read WHERE spaceId = ?`;
    await this.pool.query(query, [spaceId]);
  }

  // ===== MemberDao Implementation =====
  async addMember(member: SpaceMember): Promise<void> {
    const query = `INSERT INTO members (memberId, spaceId, isAdmin) VALUES (?, ?, ?)`;
    await this.pool.query(query, [member.memberId, member.spaceId, member.isAdmin]);
  }

  async removeMember(spaceId: string, memberId: string): Promise<void> {
    const query = `DELETE FROM members WHERE spaceId = ? AND memberId = ?`;
    await this.pool.query(query, [spaceId, memberId]);
  }

  async updateMemberAdminStatus(
    spaceId: string,
    memberId: string,
    isAdmin: boolean
  ): Promise<void> {
    const query = `UPDATE members SET isAdmin = ? WHERE spaceId = ? AND memberId = ?`;
    await this.pool.query(query, [isAdmin, spaceId, memberId]);
  }

  async getSpaceMembers(spaceId: string): Promise<SpaceMember[]> {
    const query = `
      SELECT m.*, u.username 
      FROM members m 
      JOIN users u ON m.memberId = u.id 
      WHERE m.spaceId = ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId]);
    return rows as SpaceMember[];
  }

  async isMember(spaceId: string, memberId: string): Promise<User | undefined> {
    const query = `
      SELECT u.* FROM users u
      JOIN members m ON u.id = m.memberId
      WHERE m.spaceId = ? AND m.memberId = ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId, memberId]);
    return rows[0] as User | undefined;
  }

  async isSpaceAdmin(spaceId: string, memberId: string): Promise<boolean> {
    const query = `SELECT isAdmin FROM members WHERE spaceId = ? AND memberId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId, memberId]);
    return rows.length > 0 ? (rows[0].isAdmin as boolean) : false;
  }

  async getMemberSpacesWithInfo(
    userId: string
  ): Promise<Array<{ spaceId: string; isAdmin: boolean }>> {
    const query = `SELECT spaceId, isAdmin FROM members WHERE memberId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows as Array<{ spaceId: string; isAdmin: boolean }>;
  }

  // ===== SpacePermissionDao Implementation =====
  async setPermission(permission: SpacePermission): Promise<void> {
    const query = `
      INSERT INTO space_permissions (id, spaceId, permission, allowedRole)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE allowedRole = ?
    `;
    await this.pool.query(query, [
      permission.id,
      permission.spaceId,
      permission.permission,
      permission.allowedRole,
      permission.allowedRole,
    ]);
  }

  async getSpacePermissions(spaceId: string): Promise<SpacePermission[]> {
    const query = `SELECT * FROM space_permissions WHERE spaceId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId]);
    return rows as SpacePermission[];
  }

  async getPermission(
    spaceId: string,
    permission: SpacePermissionType
  ): Promise<SpacePermission | undefined> {
    const query = `SELECT * FROM space_permissions WHERE spaceId = ? AND permission = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [spaceId, permission]);
    return rows[0] as SpacePermission | undefined;
  }

  async updatePermission(
    spaceId: string,
    permission: SpacePermissionType,
    allowedRole: AllowedRole
  ): Promise<void> {
    const query = `UPDATE space_permissions SET allowedRole = ? WHERE spaceId = ? AND permission = ?`;
    await this.pool.query(query, [allowedRole, spaceId, permission]);
  }

  async deleteSpacePermissions(spaceId: string): Promise<void> {
    const query = `DELETE FROM space_permissions WHERE spaceId = ?`;
    await this.pool.query(query, [spaceId]);
  }

  async getUserPermissionLevel(
    spaceId: string,
    userId: string
  ): Promise<'owner' | 'admin' | 'member' | null> {
    // Check if user is owner
    const spaceQuery = `SELECT ownerId FROM spaces WHERE id = ?`;
    const [spaceRows] = await this.pool.query<RowDataPacket[]>(spaceQuery, [spaceId]);

    if (spaceRows.length > 0 && spaceRows[0].ownerId === userId) {
      return 'owner';
    }

    // Check if user is admin
    const adminQuery = `SELECT isAdmin FROM members WHERE spaceId = ? AND memberId = ? AND isAdmin = TRUE`;
    const [adminRows] = await this.pool.query<RowDataPacket[]>(adminQuery, [spaceId, userId]);
    if (adminRows.length > 0) {
      return 'admin';
    }

    // Check if user is member
    const memberQuery = `SELECT 1 FROM members WHERE spaceId = ? AND memberId = ?`;
    const [memberRows] = await this.pool.query<RowDataPacket[]>(memberQuery, [spaceId, userId]);
    if (memberRows.length > 0) {
      return 'member';
    }

    return null;
  }

  async canUserPerformAction(
    spaceId: string,
    userId: string,
    permission: SpacePermissionType
  ): Promise<boolean> {
    const userRole = await this.getUserPermissionLevel(spaceId, userId);
    if (!userRole) return false;

    const perm = await this.getPermission(spaceId, permission);
    if (!perm) return false;

    // Role hierarchy: owner > admin > member > everyone
    const roleHierarchy = ['everyone', 'member', 'admin', 'owner'];
    const userRoleIndex = roleHierarchy.indexOf(userRole);
    const requiredRoleIndex = roleHierarchy.indexOf(perm.allowedRole);

    return userRoleIndex >= requiredRoleIndex;
  }

  // ===== UserActivityDao Implementation =====
  async updateUserActivity(userId: string): Promise<void> {
    const query = `
      INSERT INTO user_activity (userId, lastActive) VALUES (?, ?)
      ON DUPLICATE KEY UPDATE lastActive = ?
    `;
    await this.pool.query(query, [userId, new Date(), new Date()]);
  }

  async getUserActivity(userId: string): Promise<UserActivity | undefined> {
    const query = `SELECT * FROM user_activity WHERE userId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows[0] as UserActivity | undefined;
  }

  async getUsersActivity(userIds: string[]): Promise<UserActivity[]> {
    if (userIds.length === 0) return [];
    const placeholders = userIds.map(() => '?').join(',');
    const query = `SELECT * FROM user_activity WHERE userId IN (${placeholders})`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, userIds);
    return rows as UserActivity[];
  }

  async deleteUserActivity(userId: string): Promise<void> {
    const query = `DELETE FROM user_activity WHERE userId = ?`;
    await this.pool.query(query, [userId]);
  }

  async getOnlineUsers(): Promise<UserActivity[]> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const query = `SELECT * FROM user_activity WHERE lastActive > ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [fiveMinutesAgo]);
    return rows as UserActivity[];
  }

  // ===== UserConversationState Implementation =====
  async markConversationAsRead(params: {
    userId: string;
    conversationId: string;
    conversationType: ConversationType;
    lastReadAt: string;
  }): Promise<void> {
    const query = `
      INSERT INTO user_conversation_state (userId, conversationId, conversationType, lastReadAt)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE lastReadAt = ?
    `;
    await this.pool.query(query, [
      params.userId,
      params.conversationId,
      params.conversationType,
      params.lastReadAt,
      params.lastReadAt,
    ]);
  }

  async updateLastSoundPlayed(params: {
    userId: string;
    conversationId: string;
    conversationType: ConversationType;
    lastSoundPlayedAt: string;
  }): Promise<void> {
    const query = `
      INSERT INTO user_conversation_state (userId, conversationId, conversationType, lastSoundPlayedAt)
      VALUES (?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE lastSoundPlayedAt = ?
    `;
    await this.pool.query(query, [
      params.userId,
      params.conversationId,
      params.conversationType,
      params.lastSoundPlayedAt,
      params.lastSoundPlayedAt,
    ]);
  }

  async getUserConversationState(
    userId: string,
    conversationId: string,
    conversationType: ConversationType
  ): Promise<UserConversationState | undefined> {
    const query = `
      SELECT * FROM user_conversation_state 
      WHERE userId = ? AND conversationId = ? AND conversationType = ?
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [
      userId,
      conversationId,
      conversationType,
    ]);
    return rows[0] as UserConversationState | undefined;
  }

  async getUserAllConversationStates(userId: string): Promise<UserConversationState[]> {
    const query = `SELECT * FROM user_conversation_state WHERE userId = ?`;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows as UserConversationState[];
  }

  async deleteUserConversationState(
    userId: string,
    conversationId: string,
    conversationType: ConversationType
  ): Promise<void> {
    const query = `
      DELETE FROM user_conversation_state 
      WHERE userId = ? AND conversationId = ? AND conversationType = ?
    `;
    await this.pool.query(query, [userId, conversationId, conversationType]);
  }

  async getUnreadConversations(userId: string): Promise<UserConversationState[]> {
    const query = `
      SELECT ucs.* FROM user_conversation_state ucs
      WHERE ucs.userId = ? AND ucs.lastReadAt IS NOT NULL
    `;
    const [rows] = await this.pool.query<RowDataPacket[]>(query, [userId]);
    return rows as UserConversationState[];
  }
}
