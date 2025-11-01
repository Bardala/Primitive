CREATE TABLE IF NOT EXISTS notifications (
  id CHAR(36) NOT NULL,
  userId CHAR(36) NOT NULL,
  type ENUM('message', 'mention', 'comment', 'system') NOT NULL,
  refId CHAR(36) NULL,  -- reference to blog/message/comment/etc
  payload JSON NULL, -- optional additional data
  isRead BOOLEAN NOT NULL DEFAULT FALSE,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Optimize unread notifications query
CREATE INDEX idx_notifications_user_unread ON notifications (userId, isRead, createdAt);