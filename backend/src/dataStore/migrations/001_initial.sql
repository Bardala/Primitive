--init database
CREATE DATABASE IF NOT EXISTS nest_system;

-- todo: edit timestamp to be bigint
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(255) NOT NULL ,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    PRIMARY KEY (id),
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    UNIQUE INDEX username_UNIQUE (username ASC) VISIBLE,
    UNIQUE INDEX email_UNIQUE (email ASC) VISIBLE
);

-- todo: edit timestamp to be bigint
CREATE TABLE IF NOT EXISTS spaces (
    id VARCHAR(255) NOT NULL ,
    name VARCHAR(255) NOT NULL,
    status VARCHAR(255) NOT NULL,
    ownerId VARCHAR(255) NOT NULL,
    description VARCHAR(255) NOT NULL,
    timestamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    FOREIGN KEY (ownerId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS blogs (
    id VARCHAR(255) NOT NULL ,
    title VARCHAR(255) NOT NULL,
    content MEDIUMTEXT NOT NULL,
    userId VARCHAR(255) NOT NULL,
    spaceId VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    timestamp BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (spaceId) REFERENCES spaces(id)
);

-- todo: add likeCounts column to let user add more than one like to a blog
CREATE TABLE IF NOT EXISTS likes (
    blogId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    PRIMARY KEY (blogId, userId),
    FOREIGN KEY (blogId) REFERENCES blogs(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS comments (
    id VARCHAR(255) NOT NULL ,
    blogId VARCHAR(255) NOT NULL,
    userId VARCHAR(255) NOT NULL,
    author VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    timestamp BIGINT NOT NULL,
    PRIMARY KEY (id),
    FOREIGN KEY (blogId) REFERENCES blogs(id),
    FOREIGN KEY (userId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS follows (
    followerId VARCHAR(255) NOT NULL,
    followingId VARCHAR(255) NOT NULL,
    PRIMARY KEY (followingId, followerId),
    FOREIGN KEY (followerId) REFERENCES users(id),
    FOREIGN KEY (followingId) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS members (
    memberId VARCHAR(255) NOT NULL,
    spaceId VARCHAR(255) NOT NULL,
    isAdmin BOOLEAN NOT NULL DEFAULT FALSE,
    PRIMARY KEY (userId, spaceId),
    FOREIGN KEY (userId) REFERENCES users(id),
    FOREIGN KEY (spaceId) REFERENCES spaces(id)
);