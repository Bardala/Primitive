import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialLegacySchema1000000000000 implements MigrationInterface {
  name = 'InitialLegacySchema1000000000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Core Tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS users (
        id CHAR(36) NOT NULL,
        username VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        timestamp BIGINT NOT NULL,
        PRIMARY KEY (id),
        UNIQUE INDEX username_UNIQUE (username ASC),
        UNIQUE INDEX email_UNIQUE (email ASC)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS spaces (
        id CHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        status VARCHAR(255) NOT NULL,
        ownerId CHAR(36) NOT NULL,
        description VARCHAR(255) NOT NULL,
        timestamp BIGINT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_spaces_owner FOREIGN KEY (ownerId) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS blogs (
        id CHAR(36) NOT NULL,
        title VARCHAR(255) NOT NULL,
        content MEDIUMTEXT NOT NULL,
        userId CHAR(36) NOT NULL,
        spaceId CHAR(36) NOT NULL,
        author VARCHAR(255) NOT NULL,
        timestamp BIGINT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_blogs_user FOREIGN KEY (userId) REFERENCES users(id),
        CONSTRAINT fk_blogs_space FOREIGN KEY (spaceId) REFERENCES spaces(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 2. Interaction Tables
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS likes (
        blogId CHAR(36) NOT NULL,
        userId CHAR(36) NOT NULL,
        PRIMARY KEY (blogId, userId),
        CONSTRAINT fk_likes_blog FOREIGN KEY (blogId) REFERENCES blogs(id),
        CONSTRAINT fk_likes_user FOREIGN KEY (userId) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id CHAR(36) NOT NULL,
        blogId CHAR(36) NOT NULL,
        userId CHAR(36) NOT NULL,
        content TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_comments_blog FOREIGN KEY (blogId) REFERENCES blogs(id),
        CONSTRAINT fk_comments_user FOREIGN KEY (userId) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS follows (
        followerId CHAR(36) NOT NULL,
        followingId CHAR(36) NOT NULL,
        PRIMARY KEY (followingId, followerId),
        CONSTRAINT fk_follows_follower FOREIGN KEY (followerId) REFERENCES users(id),
        CONSTRAINT fk_follows_following FOREIGN KEY (followingId) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS members (
        memberId CHAR(36) NOT NULL,
        spaceId CHAR(36) NOT NULL,
        isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
        PRIMARY KEY (memberId, spaceId)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 3. Messaging & Activity
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS chat (
        id CHAR(36) NOT NULL,
        spaceId CHAR(36) NOT NULL,
        userId CHAR(36) NOT NULL,
        username VARCHAR(255) NOT NULL,
        content TEXT NOT NULL,
        timestamp BIGINT NOT NULL,
        PRIMARY KEY (id),
        CONSTRAINT fk_chat_user FOREIGN KEY (userId) REFERENCES users(id),
        CONSTRAINT fk_chat_space FOREIGN KEY (spaceId) REFERENCES spaces(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS last_read (
        userId CHAR(36) NOT NULL,
        spaceId CHAR(36) NOT NULL,
        lastReadId CHAR(36) NOT NULL,
        PRIMARY KEY (userId, spaceId),
        CONSTRAINT fk_lastread_user FOREIGN KEY (userId) REFERENCES users(id),
        CONSTRAINT fk_lastread_space FOREIGN KEY (spaceId) REFERENCES spaces(id),
        CONSTRAINT fk_lastread_chat FOREIGN KEY (lastReadId) REFERENCES chat(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS private_conversations (
        id CHAR(36) NOT NULL,
        user1Id CHAR(36) NOT NULL,
        user2Id CHAR(36) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT unique_user_pair UNIQUE (user1Id, user2Id),
        CONSTRAINT fk_private_convo_user1 FOREIGN KEY (user1Id) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_private_convo_user2 FOREIGN KEY (user2Id) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS private_messages (
        id CHAR(36) NOT NULL,
        conversationId CHAR(36) NOT NULL,
        senderId CHAR(36) NOT NULL,
        content TEXT NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_private_msg_convo FOREIGN KEY (conversationId) REFERENCES private_conversations(id) ON DELETE CASCADE,
        CONSTRAINT fk_private_msg_sender FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_activity (
        userId CHAR(36) NOT NULL,
        lastActive TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (userId),
        CONSTRAINT fk_user_activity_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 4. Tags & Series
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS tags (
        id CHAR(36) NOT NULL,
        name VARCHAR(100) NOT NULL UNIQUE,
        PRIMARY KEY (id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS blog_tags (
        blogId CHAR(36) NOT NULL,
        tagId CHAR(36) NOT NULL,
        PRIMARY KEY (blogId, tagId),
        CONSTRAINT fk_blog_tags_blog FOREIGN KEY (blogId) REFERENCES blogs(id) ON DELETE CASCADE,
        CONSTRAINT fk_blog_tags_tag FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS space_tags (
        spaceId CHAR(36) NOT NULL,
        tagId CHAR(36) NOT NULL,
        PRIMARY KEY (spaceId, tagId),
        CONSTRAINT fk_space_tags_space FOREIGN KEY (spaceId) REFERENCES spaces(id) ON DELETE CASCADE,
        CONSTRAINT fk_space_tags_tag FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS blog_series (
        id CHAR(36) NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        createdBy CHAR(36) NOT NULL,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_blog_series_user FOREIGN KEY (createdBy) REFERENCES users(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS blog_series_links (
        seriesId CHAR(36) NOT NULL,
        blogId CHAR(36) NOT NULL,
        position INT NOT NULL,
        PRIMARY KEY (seriesId, blogId),
        CONSTRAINT unique_series_position UNIQUE (seriesId, position),
        CONSTRAINT fk_blog_series_links_series FOREIGN KEY (seriesId) REFERENCES blog_series(id) ON DELETE CASCADE,
        CONSTRAINT fk_blog_series_links_blog FOREIGN KEY (blogId) REFERENCES blogs(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 5. Notifications & State
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS notifications (
        id CHAR(36) NOT NULL,
        userId CHAR(36) NOT NULL,
        type ENUM('message', 'mention', 'comment', 'system') NOT NULL,
        refId CHAR(36) NULL,
        payload JSON NULL,
        isRead BOOLEAN NOT NULL DEFAULT FALSE,
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        PRIMARY KEY (id),
        CONSTRAINT fk_notifications_user FOREIGN KEY (userId) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_conversation_state (
        id CHAR(36) NOT NULL,
        userId CHAR(36) NOT NULL,
        conversationId CHAR(36) NOT NULL,
        conversationType ENUM('space', 'private') NOT NULL,
        lastReadAt TIMESTAMP NULL,
        lastSoundPlayedAt TIMESTAMP NULL,
        PRIMARY KEY (id),
        CONSTRAINT uq_user_conversation UNIQUE (userId, conversationId, conversationType),
        CONSTRAINT fk_user_convo_state_user FOREIGN KEY (userId) REFERENCES users(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS space_permissions (
        id CHAR(36) NOT NULL,
        spaceId CHAR(36) NOT NULL,
        permission ENUM('post_blog', 'send_chat') NOT NULL,
        allowedRole ENUM('owner', 'admin', 'member', 'everyone') NOT NULL DEFAULT 'member',
        PRIMARY KEY (id),
        CONSTRAINT uq_space_permission UNIQUE (spaceId, permission),
        CONSTRAINT fk_space_permissions_space FOREIGN KEY (spaceId) REFERENCES spaces(id)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS user_tags (
        userId CHAR(36) NOT NULL,
        tagId CHAR(36) NOT NULL,
        PRIMARY KEY (userId, tagId),
        CONSTRAINT fk_user_tags_user FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE,
        CONSTRAINT fk_user_tags_tag FOREIGN KEY (tagId) REFERENCES tags(id) ON DELETE CASCADE
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `);

    // 6. Indices
    await queryRunner.query(`CREATE INDEX idx_comments_blog_time ON comments (blogId, timestamp);`);
    await queryRunner.query(`CREATE INDEX idx_chat_space_time ON chat (spaceId, timestamp);`);
    await queryRunner.query(`CREATE INDEX idx_private_msg_convo_time ON private_messages (conversationId, createdAt);`);
    await queryRunner.query(`CREATE INDEX idx_space_createdAt ON blogs (spaceId, timestamp);`);
    await queryRunner.query(`CREATE INDEX idx_notifications_user_unread ON notifications (userId, isRead, createdAt);`);
    await queryRunner.query(`CREATE INDEX idx_user_convo_state_user ON user_conversation_state (userId);`);
    await queryRunner.query(`CREATE INDEX idx_space_permissions_space_perm ON space_permissions (spaceId, permission);`);

    // 7. Backfills (from V25)
    await queryRunner.query(`
      INSERT INTO space_permissions (id, spaceId, permission, allowedRole)
      SELECT UUID(), id, 'post_blog', 'member' FROM spaces
      WHERE NOT EXISTS (
        SELECT 1 FROM space_permissions sp WHERE sp.spaceId = spaces.id AND sp.permission = 'post_blog'
      );
    `);

    await queryRunner.query(`
      INSERT INTO space_permissions (id, spaceId, permission, allowedRole)
      SELECT UUID(), id, 'send_chat', 'member' FROM spaces
      WHERE NOT EXISTS (
        SELECT 1 FROM space_permissions sp WHERE sp.spaceId = spaces.id AND sp.permission = 'send_chat'
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop in reverse order to respect foreign keys
    await queryRunner.query(`DROP TABLE IF EXISTS user_tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS space_permissions`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_conversation_state`);
    await queryRunner.query(`DROP TABLE IF EXISTS notifications`);
    await queryRunner.query(`DROP TABLE IF EXISTS blog_series_links`);
    await queryRunner.query(`DROP TABLE IF EXISTS blog_series`);
    await queryRunner.query(`DROP TABLE IF EXISTS space_tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS blog_tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS tags`);
    await queryRunner.query(`DROP TABLE IF EXISTS user_activity`);
    await queryRunner.query(`DROP TABLE IF EXISTS private_messages`);
    await queryRunner.query(`DROP TABLE IF EXISTS private_conversations`);
    await queryRunner.query(`DROP TABLE IF EXISTS last_read`);
    await queryRunner.query(`DROP TABLE IF EXISTS chat`);
    await queryRunner.query(`DROP TABLE IF EXISTS members`);
    await queryRunner.query(`DROP TABLE IF EXISTS follows`);
    await queryRunner.query(`DROP TABLE IF EXISTS comments`);
    await queryRunner.query(`DROP TABLE IF EXISTS likes`);
    await queryRunner.query(`DROP TABLE IF EXISTS blogs`);
    await queryRunner.query(`DROP TABLE IF EXISTS spaces`);
    await queryRunner.query(`DROP TABLE IF EXISTS users`);
  }
}
