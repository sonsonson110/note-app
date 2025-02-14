# NotePro - Advanced Note Taking Application

## Core Features
1. User Management
   - Registration and login with JWT authentication
   - Password hashing and security
   - User profiles with customizable settings
   - Role-based access control (Admin, User)

2. Note Management
   - CRUD operations for notes
   - Rich text editing with markdown support
   - Categories and tags for organization
   - Note sharing and collaboration
   - Version history tracking

3. Organization
   - Notebooks/Folders for grouping notes
   - Hierarchical organization structure
   - Drag-and-drop organization
   - Search functionality with filters

## Technical Stack
1. Backend (Express.js)
   - Express.js for routing and middleware
   - Prisma ORM for database operations
   - PostgreSQL as the database
   - JWT for authentication
   - bcrypt for password hashing
   - class-validator for input validation

2. Additional Features
   - File uploads (images, attachments)
   - Real-time collaboration using Socket.IO
   - Rate limiting for API protection
   - Request logging and monitoring
   - Automated testing setup

## Database Schema
```sql
-- Users table
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notebooks table
CREATE TABLE notebooks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Notes table
CREATE TABLE notes (
    id SERIAL PRIMARY KEY,
    notebook_id INTEGER REFERENCES notebooks(id),
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(200) NOT NULL,
    content TEXT,
    is_public BOOLEAN DEFAULT false,
    version INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tags table
CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    user_id INTEGER REFERENCES users(id)
);

-- Note_Tags junction table
CREATE TABLE note_tags (
    note_id INTEGER REFERENCES notes(id),
    tag_id INTEGER REFERENCES tags(id),
    PRIMARY KEY (note_id, tag_id)
);

-- Shared_Notes table
CREATE TABLE shared_notes (
    note_id INTEGER REFERENCES notes(id),
    shared_with_user_id INTEGER REFERENCES users(id),
    permission VARCHAR(20) DEFAULT 'read',
    shared_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (note_id, shared_with_user_id)
);
```

## API Endpoints
```
Authentication:
POST /api/auth/register
POST /api/auth/login
POST /api/auth/refresh-token

Users:
GET /api/users/profile
PUT /api/users/profile
PUT /api/users/password

Notebooks:
GET /api/notebooks
POST /api/notebooks
GET /api/notebooks/:id
PUT /api/notebooks/:id
DELETE /api/notebooks/:id

Notes:
GET /api/notes
POST /api/notes
GET /api/notes/:id
PUT /api/notes/:id
DELETE /api/notes/:id
GET /api/notes/:id/history
POST /api/notes/:id/share
GET /api/notes/shared-with-me

Tags:
GET /api/tags
POST /api/tags
DELETE /api/tags/:id
```