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
```mermaid
erDiagram
    Users {
        id SERIAL PK
        username VARCHAR(50)
        email VARCHAR(100)
        password_hash VARCHAR(255)
        created_at TIMESTAMP
    }

    Notes {
        id SERIAL PK
        title VARCHAR(200)
        content TEXT
        user_id INTEGER FK
        is_public BOOLEAN
        version INTEGER
        created_at TIMESTAMP
        updated_at TIMESTAMP
    }

    Notebooks {
        id SERIAL PK
        user_id INTEGER FK
        name VARCHAR(100)
        description TEXT
        created_at TIMESTAMP
    }

    Tags {
        id SERIAL PK
        name VARCHAR(50)
        user_id INTEGER FK
    }

    NotebookNotes {
        notebook_id INTEGER FK
        note_id INTEGER FK
    }

    NoteTags {
        note_id INTEGER FK
        tag_id INTEGER FK
    }

    SharedNotes {
        note_id INTEGER FK
        shared_with_user_id INTEGER FK
        permission VARCHAR(20)
        shared_at TIMESTAMP
    }

    Users ||--o{ Notes : "creates"
    Users ||--o{ Notebooks : "owns"
    Users ||--o{ Tags : "creates"
    Notes ||--o{ NoteTags : "has"
    Tags ||--o{ NoteTags : "used_in"
    Notes ||--o{ SharedNotes : "shared_as"
    Users ||--o{ SharedNotes : "has_access_to"
    Notes ||--o{ NotebookNotes : "appears_in"
    Notebooks ||--o{ NotebookNotes : "contains"
```

## API Endpoints
```
Authentication:
POST /api/auth/login
PUT /api/auth/password
POST /api/auth/refresh

Users:
POST /api/users

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
DELETE /api/notes/:id
GET /api/notes/:id/history
POST /api/notes/:id/share
GET /api/notes/shared-with-me

Tags:
GET /api/tags
POST /api/tags
DELETE /api/tags/:id
```

### Ref
- Set up express js: https://blog.logrocket.com/how-to-set-up-node-typescript-express/