# Nest System Database Schema

## Table: users

| Field     | Type         | Constraints                         |
| --------- | ------------ | ----------------------------------- |
| id        | VARCHAR(255) | NOT NULL, PRIMARY KEY               |
| username  | VARCHAR(255) | UNIQUE, NOT NULL                    |
| password  | VARCHAR(255) | NOT NULL                            |
| email     | VARCHAR(255) | UNIQUE, NOT NULL                    |
| timestamp | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP |

## Table: spaces

| Field       | Type         | Constraints                         |
| ----------- | ------------ | ----------------------------------- |
| id          | VARCHAR(255) | NOT NULL, PRIMARY KEY               |
| name        | VARCHAR(255) | NOT NULL                            |
| status      | VARCHAR(255) | NOT NULL                            |
| ownerId     | VARCHAR(255) | NOT NULL                            |
| description | VARCHAR(255) | NOT NULL                            |
| timestamp   | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| FOREIGN KEY |              | (ownerId) REFERENCES users(id)      |

## Table: blogs

| Field       | Type         | Constraints                         |
| ----------- | ------------ | ----------------------------------- |
| id          | VARCHAR(255) | NOT NULL, PRIMARY KEY               |
| title       | VARCHAR(255) | NOT NULL                            |
| content     | MEDIUMTEXT   | NOT NULL                            |
| userId      | VARCHAR(255) | NOT NULL                            |
| spaceId     | VARCHAR(255) | NOT NULL                            |
| timestamp   | TIMESTAMP    | NOT NULL, DEFAULT CURRENT_TIMESTAMP |
| FOREIGN KEY |              | (userId) REFERENCES users(id)       |
| FOREIGN KEY |              | (spaceId) REFERENCES spaces(id)     |

## Table: likes

| Field                        | Type         | Constraints                   |
| ---------------------------- | ------------ | ----------------------------- |
| blogId                       | VARCHAR(255) | NOT NULL                      |
| userId                       | VARCHAR(255) | NOT NULL                      |
| PRIMARY KEY (blogId, userId) |              |
| FOREIGN KEY                  |              | (blogId) REFERENCES blogs(id) |
| FOREIGN KEY                  |              | (userId) REFERENCES users(id) |

## Table: comments

| Field       | Type         | Constraints                   |
| ----------- | ------------ | ----------------------------- |
| id          | VARCHAR(255) | NOT NULL, PRIMARY KEY         |
| blogId      | VARCHAR(255) | NOT NULL                      |
| userId      | VARCHAR(255) | NOT NULL                      |
| content     | TEXT         |                               |
| timestamp   | TIMESTAMP    |                               |
| FOREIGN KEY |              | (blogId) REFERENCES blogs(id) |
| FOREIGN KEY |              | (userId) REFERENCES users(id) |

## Table: follows

| Field       | Type                      | Constraints                        |
| ----------- | ------------------------- | ---------------------------------- |
| followerId  | VARCHAR(255)              | NOT NULL                           |
| followingId | VARCHAR(255)              | NOT NULL                           |
| PRIMARY KEY | (followingId, followerId) |                                    |
| FOREIGN KEY |                           | (followerId) REFERENCES users(id)  |
| FOREIGN KEY |                           | (followingId) REFERENCES users(id) |

## Table: members

| Field       | Type                | Constraints                     |
| ----------- | ------------------- | ------------------------------- |
| memberId    | VARCHAR(255)        | NOT NULL                        |
| spaceId     | VARCHAR(255)        | NOT NULL                        |
| PRIMARY KEY | (memberId, spaceId) |                                 |
| FOREIGN KEY |                     | (memberId) REFERENCES users(id) |
| FOREIGN KEY |                     | (spaceId) REFERENCES spaces(id) |

## Description

This database schema represents the structure of the system. It includes tables for users, spaces, blogs, likes, comments, follows, and members.

The users table stores information about registered users, including their unique ID, username, password, email, and timestamp of account creation.

The spaces table represents different spaces or categories in the system. It includes fields for the space ID, name, status, owner ID, description, and timestamp of creation. The owner ID is a foreign key referencing the users table.

The blogs table contains the blog posts created by users. It includes fields for the blog ID, title, content, user ID of the author, space ID where the blog belongs, and timestamp of creation. The user ID and space ID are foreign keys referencing the users and spaces tables, respectively.

The likes table tracks the likes given by users to specific blogs. It has columns for the blog ID and user ID, forming a composite primary key. Both columns are foreign keys referencing the blogs and users tables.

The comments table stores the comments made by users on blogs. It includes fields for the comment ID, blog ID, user ID, content, and timestamp of creation. The blog ID and user ID are foreign keys referencing the blogs and users tables, respectively.

The follows table represents the relationship between users who follow each other. It has two columns, followerId and followingId, which together form the primary key. These columns are foreign keys referencing the users table.

The members table represents the membership of users in different spaces. It has two columns, memberId and spaceId, which together form the primary key. These columns are foreign keys referencing the users and spaces tables, respectively.

This database schema provides the necessary structure to manage users, spaces, blogs, likes, comments, follows, and memberships in the system.
