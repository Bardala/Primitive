-- 1) Drop Foreign Keys (use the names from your query)
ALTER TABLE
  blogs DROP FOREIGN KEY blogs_ibfk_1;

ALTER TABLE
  blogs DROP FOREIGN KEY blogs_ibfk_2;

ALTER TABLE
  chat DROP FOREIGN KEY chat_ibfk_1;

ALTER TABLE
  chat DROP FOREIGN KEY chat_ibfk_2;

ALTER TABLE
  comments DROP FOREIGN KEY comments_ibfk_1;

ALTER TABLE
  comments DROP FOREIGN KEY comments_ibfk_2;

ALTER TABLE
  follows DROP FOREIGN KEY follows_ibfk_1;

ALTER TABLE
  follows DROP FOREIGN KEY follows_ibfk_2;

ALTER TABLE
  last_read DROP FOREIGN KEY last_read_ibfk_1;

ALTER TABLE
  last_read DROP FOREIGN KEY last_read_ibfk_2;

ALTER TABLE
  last_read DROP FOREIGN KEY last_read_ibfk_3;

ALTER TABLE
  likes DROP FOREIGN KEY likes_ibfk_1;

ALTER TABLE
  likes DROP FOREIGN KEY likes_ibfk_2;

ALTER TABLE
  spaces DROP FOREIGN KEY spaces_ibfk_1;

-- 2) Alter Column Types to CHAR(36)
ALTER TABLE
  users
MODIFY
  id CHAR(36) NOT NULL;

ALTER TABLE
  spaces
MODIFY
  id CHAR(36) NOT NULL,
MODIFY
  ownerId CHAR(36) NOT NULL;

ALTER TABLE
  blogs
MODIFY
  id CHAR(36) NOT NULL,
MODIFY
  userId CHAR(36) NOT NULL,
MODIFY
  spaceId CHAR(36) NOT NULL;

ALTER TABLE
  chat
MODIFY
  id CHAR(36) NOT NULL,
MODIFY
  userId CHAR(36) NOT NULL,
MODIFY
  spaceId CHAR(36) NOT NULL;

ALTER TABLE
  comments
MODIFY
  id CHAR(36) NOT NULL,
MODIFY
  blogId CHAR(36) NOT NULL,
MODIFY
  userId CHAR(36) NOT NULL;

ALTER TABLE
  follows
MODIFY
  followerId CHAR(36) NOT NULL,
MODIFY
  followingId CHAR(36) NOT NULL;

ALTER TABLE
  likes
MODIFY
  blogId CHAR(36) NOT NULL,
MODIFY
  userId CHAR(36) NOT NULL;

ALTER TABLE
  last_read
MODIFY
  userId CHAR(36) NOT NULL,
MODIFY
  spaceId CHAR(36) NOT NULL,
MODIFY
  lastReadId CHAR(36) NOT NULL;

-- 3) Recreate Foreign Keys with Meaningful Names
ALTER TABLE
  spaces
ADD
  CONSTRAINT fk_spaces_owner FOREIGN KEY (ownerId) REFERENCES users(id);

ALTER TABLE
  blogs
ADD
  CONSTRAINT fk_blogs_user FOREIGN KEY (userId) REFERENCES users(id),
ADD
  CONSTRAINT fk_blogs_space FOREIGN KEY (spaceId) REFERENCES spaces(id);

ALTER TABLE
  chat
ADD
  CONSTRAINT fk_chat_user FOREIGN KEY (userId) REFERENCES users(id),
ADD
  CONSTRAINT fk_chat_space FOREIGN KEY (spaceId) REFERENCES spaces(id);

ALTER TABLE
  comments
ADD
  CONSTRAINT fk_comments_blog FOREIGN KEY (blogId) REFERENCES blogs(id),
ADD
  CONSTRAINT fk_comments_user FOREIGN KEY (userId) REFERENCES users(id);

ALTER TABLE
  follows
ADD
  CONSTRAINT fk_follows_follower FOREIGN KEY (followerId) REFERENCES users(id),
ADD
  CONSTRAINT fk_follows_following FOREIGN KEY (followingId) REFERENCES users(id);

ALTER TABLE
  likes
ADD
  CONSTRAINT fk_likes_blog FOREIGN KEY (blogId) REFERENCES blogs(id),
ADD
  CONSTRAINT fk_likes_user FOREIGN KEY (userId) REFERENCES users(id);

ALTER TABLE
  last_read
ADD
  CONSTRAINT fk_lastread_user FOREIGN KEY (userId) REFERENCES users(id),
ADD
  CONSTRAINT fk_lastread_space FOREIGN KEY (spaceId) REFERENCES spaces(id),
ADD
  CONSTRAINT fk_lastread_chat FOREIGN KEY (lastReadId) REFERENCES chat(id);