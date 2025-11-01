CREATE TABLE IF NOT EXISTS private_messages (
  id CHAR(36) NOT NULL,
  conversationId CHAR(36) NOT NULL,
  senderId CHAR(36) NOT NULL,
  content TEXT NOT NULL,
  createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  FOREIGN KEY (conversationId) REFERENCES private_conversations(id) ON DELETE CASCADE,
  FOREIGN KEY (senderId) REFERENCES users(id) ON DELETE CASCADE,
  INDEX idx_conversation (conversationId),
  INDEX idx_sender (senderId)
)