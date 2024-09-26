# Database Schema

## Table: `users`

| Column      | Type         | Constraints           |
| ----------- | ------------ | --------------------- |
| `id`        | VARCHAR(255) | PRIMARY KEY, NOT NULL |
| `username`  | VARCHAR(255) | UNIQUE, NOT NULL      |
| `password`  | VARCHAR(255) | NOT NULL              |
| `email`     | VARCHAR(255) | UNIQUE, NOT NULL      |
| `timestamp` | BIGINT       | NOT NULL              |

### Indexes:

- `username_UNIQUE`: UNIQUE INDEX on `username`
- `email_UNIQUE`: UNIQUE INDEX on `email`

---

## Table: `spaces`

| Column        | Type         | Constraints                                    |
| ------------- | ------------ | ---------------------------------------------- |
| `id`          | VARCHAR(255) | PRIMARY KEY, NOT NULL                          |
| `name`        | VARCHAR(255) | NOT NULL                                       |
| `status`      | VARCHAR(255) | NOT NULL                                       |
| `ownerId`     | VARCHAR(255) | FOREIGN KEY (`ownerId`) REFERENCES `users(id)` |
| `description` | VARCHAR(255) | NOT NULL                                       |
| `timestamp`   | BIGINT       | NOT NULL                                       |

---

## Table: `blogs`

| Column      | Type         | Constraints                                     |
| ----------- | ------------ | ----------------------------------------------- |
| `id`        | VARCHAR(255) | PRIMARY KEY, NOT NULL                           |
| `title`     | VARCHAR(255) | NOT NULL                                        |
| `content`   | MEDIUMTEXT   | NOT NULL                                        |
| `userId`    | VARCHAR(255) | FOREIGN KEY (`userId`) REFERENCES `users(id)`   |
| `spaceId`   | VARCHAR(255) | FOREIGN KEY (`spaceId`) REFERENCES `spaces(id)` |
| `author`    | VARCHAR(255) | NOT NULL                                        |
| `timestamp` | BIGINT       | NOT NULL                                        |

---

## Table: `likes`

| Column   | Type         | Constraints                                                                     |
| -------- | ------------ | ------------------------------------------------------------------------------- |
| `blogId` | VARCHAR(255) | PRIMARY KEY (`blogId`, `userId`), FOREIGN KEY (`blogId`) REFERENCES `blogs(id)` |
| `userId` | VARCHAR(255) | FOREIGN KEY (`userId`) REFERENCES `users(id)`                                   |

---

## Table: `comments`

| Column      | Type         | Constraints                                   |
| ----------- | ------------ | --------------------------------------------- |
| `id`        | VARCHAR(255) | PRIMARY KEY, NOT NULL                         |
| `blogId`    | VARCHAR(255) | FOREIGN KEY (`blogId`) REFERENCES `blogs(id)` |
| `userId`    | VARCHAR(255) | FOREIGN KEY (`userId`) REFERENCES `users(id)` |
| `content`   | TEXT         | NOT NULL                                      |
| `timestamp` | BIGINT       | NOT NULL                                      |

---

## Table: `follows`

| Column        | Type         | Constraints                                                                                  |
| ------------- | ------------ | -------------------------------------------------------------------------------------------- |
| `followerId`  | VARCHAR(255) | PRIMARY KEY (`followingId`, `followerId`), FOREIGN KEY (`followerId`) REFERENCES `users(id)` |
| `followingId` | VARCHAR(255) | FOREIGN KEY (`followingId`) REFERENCES `users(id)`                                           |

---

## Table: `members`

| Column     | Type         | Constraints                         |
| ---------- | ------------ | ----------------------------------- |
| `memberId` | VARCHAR(255) | PRIMARY KEY (`memberId`, `spaceId`) |
| `spaceId`  | VARCHAR(255) | NOT NULL                            |
| `isAdmin`  | BOOLEAN      | NOT NULL, DEFAULT FALSE             |

---

## Table: `chat`

| Column      | Type         | Constraints                                     |
| ----------- | ------------ | ----------------------------------------------- |
| `id`        | VARCHAR(255) | PRIMARY KEY, NOT NULL                           |
| `spaceId`   | VARCHAR(255) | FOREIGN KEY (`spaceId`) REFERENCES `spaces(id)` |
| `userId`    | VARCHAR(255) | FOREIGN KEY (`userId`) REFERENCES `users(id)`   |
| `username`  | VARCHAR(255) | NOT NULL                                        |
| `content`   | TEXT         | NOT NULL                                        |
| `timestamp` | BIGINT       | NOT NULL                                        |

---

## Table: `last_read`

| Column       | Type         | Constraints                                                                      |
| ------------ | ------------ | -------------------------------------------------------------------------------- |
| `userId`     | VARCHAR(255) | PRIMARY KEY (`userId`, `spaceId`), FOREIGN KEY (`userId`) REFERENCES `users(id)` |
| `spaceId`    | VARCHAR(255) | FOREIGN KEY (`spaceId`) REFERENCES `spaces(id)`                                  |
| `lastReadId` | VARCHAR(255) | FOREIGN KEY (`lastReadId`) REFERENCES `chat(id)`                                 |

---
