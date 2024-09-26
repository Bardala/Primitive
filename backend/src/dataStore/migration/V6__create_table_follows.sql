CREATE TABLE IF NOT EXISTS follows (
  followerId VARCHAR(255) NOT NULL,
  followingId VARCHAR(255) NOT NULL,
  PRIMARY KEY (followingId, followerId),
  FOREIGN KEY (followerId) REFERENCES users(id),
  FOREIGN KEY (followingId) REFERENCES users(id)
);