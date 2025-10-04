# Database Schema Design

## Users Table
```sql
CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username VARCHAR(80) UNIQUE NOT NULL,
    email VARCHAR(120) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP
);
```

## Progress Table
```sql
CREATE TABLE progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    level VARCHAR(50) NOT NULL,
    exercise_index INTEGER NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    score INTEGER,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE(user_id, level, exercise_index)
);
```

## Relationships
- One User has Many Progress records (1:N)
- Progress tracks individual exercise completion per user per level

## Indexes
- users: username, email (unique)
- progress: user_id, level, exercise_index (composite unique)
