CREATE TABLE IF NOT EXISTS user_conversation_state (
  id CHAR(36) NOT NULL,
  userId CHAR(36) NOT NULL,
  conversationId CHAR(36) NOT NULL, -- could be spaceId or private conversationId
  conversationType ENUM('space', 'private') NOT NULL,
  lastReadAt TIMESTAMP NULL,
  lastSoundPlayedAt TIMESTAMP NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_user_conversation (userId, conversationId, conversationType),
  FOREIGN KEY (userId) REFERENCES users(id)
);

-- Index to quickly find unread state for a given user
CREATE INDEX idx_user_convo_state_user ON user_conversation_state (userId);