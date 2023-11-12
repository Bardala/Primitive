CREATE TABLE IF NOT EXISTS last_read (
  userId VARCHAR(255) NOT NULL,
  spaceId VARCHAR(255) NOT NULL,
  lastReadId VARCHAR(255) NOT NULL,
  PRIMARY KEY (userId, spaceId),
  FOREIGN KEY (userId) REFERENCES users(id),
  FOREIGN KEY (spaceId) REFERENCES spaces(id),
  FOREIGN KEY (lastReadId) REFERENCES chat(id) 
);