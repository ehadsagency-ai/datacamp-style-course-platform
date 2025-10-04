# Auto Memory for Claude Code - DataCamp-Style Course Platform

## Project Overview
Dynamic, interactive data science course platform with Flask backend and React frontend. Features user authentication, progress tracking, in-browser Python execution, and gamification.

## Current Architecture
- **Backend**: Flask + SQLAlchemy + JWT + Rate Limiting
- **Frontend**: React + Vite + Monaco Editor + Pyodide
- **Database**: SQLite (production-ready for PostgreSQL)
- **Deployment**: GitHub Pages (frontend) + Heroku-ready (backend)

## Completed Features

### Core Functionality
- ✅ Dynamic course generation from 100+ Jupyter notebooks
- ✅ User registration/login with bcrypt password hashing
- ✅ JWT authentication for API access
- ✅ Progress tracking with XP system (10 XP per exercise)
- ✅ In-browser Python execution with Pyodide (numpy, pandas loaded)
- ✅ Comprehensive course metadata (notebook counts, durations, topics, key notebooks)
- ✅ Rate limiting for security (flask-limiter)
- ✅ Caching for performance (1-hour course cache)
- ✅ Health checks and monitoring

### UI/UX Features
- ✅ Pixel-art data theme with dark/light mode toggle
- ✅ Interactive code editor with validation
- ✅ Exercise hints system (progressive hints from notebooks)
- ✅ Certificate generation (PDF) on course completion
- ✅ User stats display (XP, completed exercises)
- ✅ Responsive design with Tailwind CSS

### Data & Content
- ✅ 5 course levels: Python Fundamentals, Data Processing, Visualization, ML, Advanced Topics
- ✅ 96+ exercises parsed from notebooks with code, hints, solutions
- ✅ Topics, durations, and notebook metadata per level

## Current File Structure
```
datacamp-repo/
├── web_orchestrator.py          # Flask backend with all endpoints
├── models.py                     # SQLAlchemy User/Progress models
├── generate_course.py            # Notebook parsing script
├── course_data.json              # Generated course data
├── requirements.txt              # Python dependencies
├── Procfile                      # Heroku deployment
├── .flake8                       # Linting config
├── test_generate_course.py       # Unit tests
├── DATABASE_SCHEMA.md            # DB schema documentation
├── WEBSOCKET_PLAN.md             # Real-time features plan
├── MESSAGE_FOR_CLAUDE.md         # Handoff documentation
├── course_website_react/         # React frontend
│   ├── src/
│   │   ├── App.jsx               # Main app with auth, courses, progress
│   │   ├── CodeEditor.jsx        # Pyodide-enabled editor
│   │   └── ...
│   ├── vite.config.js            # Proxy config for dev
│   └── package.json
└── Level_*/                      # Jupyter notebook directories
```

## API Endpoints
- `POST /api/register` - User registration
- `POST /api/login` - User login (returns JWT)
- `GET /api/courses` - Get course data (JWT required)
- `GET /api/progress` - Get user progress (JWT required)
- `POST /api/progress` - Save progress (JWT required)
- `GET /api/user/stats` - Get user XP/stats (JWT required)
- `GET /health` - Health check

## Database Schema
```sql
Users: id, username, email, password_hash, created_at, last_login
Progress: id, user_id, level, exercise_index, completed, completed_at, score, xp_earned
```

## Authentication Flow
1. User registers/logs in via React form
2. JWT token stored in localStorage
3. All API calls include `Authorization: Bearer <token>`
4. Backend validates token for protected routes

## Deployment Status
- ✅ Frontend: Deployed on GitHub Pages
- ⏳ Backend: Code ready for Heroku/Vercel deployment
- ⏳ Database: SQLite local, PostgreSQL for production

## Pending High-Priority Tasks
1. **Deploy Backend**: `heroku create`, `git push heroku master`
2. **Update API URL**: Set VITE_API_BASE in React for live backend
3. **Test Full Flow**: Register → Login → Access Courses → Complete Exercises → View Stats

## Medium-Priority Enhancements
- Implement WebSocket streaming (flask-socketio)
- Add user roles (student/mentor/admin)
- Video integration (parse/add video URLs)
- Analytics dashboard for admins

## Low-Priority Features
- Enhanced UI/UX (animations, better mobile)
- Collaborative coding sessions
- Advanced error handling
- Performance optimizations

## Development Commands
```bash
# Backend
cd datacamp-repo
python3 -m pip install -r requirements.txt
python3 web_orchestrator.py  # Runs on port 5000

# Frontend
cd course_website_react
npm install
npm run dev  # Runs on port 5173 with proxy

# Testing
python3 test_generate_course.py
flake8
```

## Key Technical Decisions
- JWT for stateless auth (no sessions)
- Pyodide for client-side Python (no server execution)
- SQLite for simplicity (upgrade to PostgreSQL for production)
- Rate limiting per IP (not user-based for simplicity)
- XP system for gamification (10 XP per exercise)

## Security Measures
- Password hashing with bcrypt
- JWT tokens with expiration
- Rate limiting on all endpoints
- CORS configured for frontend
- Input validation on API endpoints

## Performance Optimizations
- Course data caching (1 hour)
- Lazy loading in React
- Pyodide loaded on demand
- Database indexes on user queries

## Known Issues/Limitations
- One notebook parsing error (invalid JSON)
- No password reset functionality
- No email verification
- SQLite not suitable for high concurrency
- No backup/recovery system

## Next Steps for Claude
1. Deploy backend to production
2. Test end-to-end user flow
3. Implement WebSocket features
4. Add video content parsing
5. Build admin analytics dashboard

This memory file provides complete context for continuing development. All code is committed and documented.