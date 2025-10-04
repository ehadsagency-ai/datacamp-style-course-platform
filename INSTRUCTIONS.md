# Data Analyst Course Project - Complete Instructions

## Overview
This project combines a file management orchestrator (Python/Flask) with an interactive course website (React/Vite) adapted from a math-forestry app style. The system organizes downloads, provides a GUI for monitoring, and deploys a mobile-responsive course site on GitHub Pages.

## Project Structure
```
/Users/deo_metoyer/Library/Mobile Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/Data_Analyst/
├── course_website_react/          # React app for course website
│   ├── src/
│   │   ├── App.jsx               # Main app with level tabs and charts
│   │   ├── InteractiveCharts.jsx # Recharts progress visualization
│   │   ├── App.css               # Pixel-art data theme styles
│   │   └── index.css             # Tailwind imports
│   ├── package.json              # React deps (react, recharts, tailwind)
│   ├── vite.config.js            # Vite config with base path
│   ├── tailwind.config.js        # Data theme colors
│   ├── .github/workflows/deploy.yml # GitHub Actions for Pages
│   └── README.md                 # Basic setup info
├── Scripts Magiques/             # Original scripts (proton_sync.py, etc.)
├── downloads_ui.py               # Tkinter GUI for API config
├── monitor.py                    # Tkinter monitor with API key GUI
├── web_orchestrator.py           # Flask app for file management
├── offline_automator.py          # Async file classifier
├── Dockerfile & docker-compose.yml # Containerization
├── test_orchestrator.py          # Pytest for Flask app
└── Documentation_Library/        # Course docs and guides
```

## Core Components

### 1. File Management Orchestrator (Python/Flask)
- **web_orchestrator.py**: Flask web app with tabs for Professions/Clouds/Rules/Files/Config.
- **offline_automator.py**: Background file watcher that classifies downloads by profession (CEO/PROF/DEVOPS) and category (documents/images/archives).
- **proton_sync.py**: WebDAV client for Proton Drive sync.
- **monitor.py**: Tkinter always-on-top window showing file counts, process status, and API key input GUI.
- **downloads_ui.py**: Tkinter GUI for API configuration.

**Key Features**:
- Real-time file classification and movement.
- Metadata tracking with embeddings for semantic search.
- Cloud sync (Proton Drive integrated, extensible to Google/OneDrive/Dropbox).
- Mobile-responsive web UI with pixel-art theme.
- API key management via monitor GUI.

### 2. Course Website (React/Vite)
- Adapted from math-forestry-app style: Pixel-art data theme (blues instead of greens), interactive tabs, Recharts charts.
- Levels: Python Fundamentals, Data Processing, Visualization, ML, Advanced Topics.
- Mobile-responsive with Tailwind CSS.
- Deployed on GitHub Pages with Actions.

**Tech Stack**:
- React 18, Vite, Tailwind CSS, Recharts.
- Pixel-art buttons, data-themed colors.
- GitHub Actions auto-deploy.

### 3. Infrastructure
- **Docker**: Containerized with docker-compose for orchestrator and automator.
- **GitHub Pages**: Static site deployment for course.
- **GitHub Actions**: CI/CD for build/deploy.

## Setup Instructions

### Prerequisites
- Python 3.13+, Node.js 20+, npm/pnpm, Git.
- macOS (for LaunchAgent), or adapt for other OS.

### 1. Clone/Navigate to Directory
```bash
cd '/Users/deo_metoyer/Library/Mobile Documents/com~apple~CloudDocs/MY_GOUV/HOME/PSL_MINES/Data_Analyst'
```

### 2. Set Up Orchestrator
```bash
# Install Python deps (if pip works)
pip install flask sentence-transformers loguru webdavclient3 watchdog

# Run Flask app
python web_orchestrator.py

# Run automator
python offline_automator.py

# Run monitor
python monitor.py
```

### 3. Set Up Course Website
```bash
cd course_website_react
npm install
npm run dev  # Local dev
npm run build  # Production build
```

### 4. Deployment
- **GitHub Pages**: Push to repo, enable Pages in settings, Actions auto-deploys.
- **Docker**: `docker-compose up` for containerized run.
- **Local**: Use LaunchAgent for monitor auto-start.

## API Endpoints (Flask App)
- `GET /`: Main UI.
- `POST /apply_rules`: Classify and move files.
- `POST /sync_clouds`: Sync to clouds.
- `POST /save_rules`: Save rules.
- `POST /save_config`: Save config.
- `GET /health`: Health check.
- `POST /search`: Semantic search.

## Customization Notes
- **Theme**: Data colors (blues), pixel-art fonts/buttons.
- **Charts**: Recharts for progress visualization.
- **Auth**: Basic role-based (USER_ROLE env var).
- **Clouds**: Proton integrated, add others in sync_clouds.
- **Mobile**: Responsive via Tailwind breakpoints.

## Troubleshooting
- **Pip/npm issues**: Use --user or fix PATH.
- **GitHub Pages**: Ensure repo public or add PAT for private.
- **Tkinter**: Install python3-tk if needed.
- **Permissions**: iCloud paths may need access.

## Next Steps
- Add user auth to Flask app.
- Integrate more clouds (Google Drive API).
- Expand course content with quizzes.
- Add analytics (Google Analytics).

## Session History Summary
- Adapted math-forestry-app style for data theme.
- Built React app with tabs/charts.
- Integrated orchestrator with real file ops.
- Deployed to GitHub Pages.
- Added monitor GUI for API keys.

This covers the full project for seamless handoff to another AI.
