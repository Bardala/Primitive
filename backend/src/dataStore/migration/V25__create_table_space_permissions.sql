CREATE TABLE IF NOT EXISTS space_permissions (
  id CHAR(36) NOT NULL,
  spaceId CHAR(36) NOT NULL,
  permission ENUM('post_blog', 'send_chat') NOT NULL,
  allowedRole ENUM('owner', 'admin', 'member', 'everyone') NOT NULL DEFAULT 'member',
  
  PRIMARY KEY (id),
  UNIQUE KEY uq_space_permission (spaceId, permission),
  FOREIGN KEY (spaceId) REFERENCES spaces(id)
);

-- Backfill default permissions for all existing spaces
INSERT INTO space_permissions (id, spaceId, permission, allowedRole)
SELECT UUID(), id, 'post_blog', 'member' FROM spaces
WHERE NOT EXISTS (
  SELECT 1 FROM space_permissions sp WHERE sp.spaceId = spaces.id AND sp.permission = 'post_blog'
);

INSERT INTO space_permissions (id, spaceId, permission, allowedRole)
SELECT UUID(), id, 'send_chat', 'member' FROM spaces
WHERE NOT EXISTS (
  SELECT 1 FROM space_permissions sp WHERE sp.spaceId = spaces.id AND sp.permission = 'send_chat'
);

-- Index for fast lookups by space and permission
CREATE INDEX idx_space_permissions_space_perm 
ON space_permissions (spaceId, permission);