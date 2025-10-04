#!/usr/bin/env python3
"""
Cron Jobs for DataCamp Course Platform
Run automated tasks like course regeneration, database backup, etc.
"""

import os
import sys
import subprocess
from datetime import datetime
from pathlib import Path

# Add current directory to path for imports
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

def regenerate_courses():
    """Regenerate course data from notebooks"""
    print(f"[{datetime.now()}] Regenerating course data...")
    try:
        subprocess.run([sys.executable, 'generate_course.py'], check=True)
        print("Course regeneration completed successfully")
    except subprocess.CalledProcessError as e:
        print(f"Course regeneration failed: {e}")

def backup_database():
    """Backup SQLite database"""
    db_path = 'courses.db'
    if os.path.exists(db_path):
        timestamp = datetime.now().strftime('%Y%m%d_%H%M%S')
        backup_path = f'backups/courses_backup_{timestamp}.db'
        os.makedirs('backups', exist_ok=True)

        print(f"[{datetime.now()}] Backing up database to {backup_path}...")
        try:
            # Simple file copy for SQLite
            import shutil
            shutil.copy2(db_path, backup_path)
            print("Database backup completed successfully")

            # Keep only last 7 backups
            backup_dir = Path('backups')
            backups = sorted(backup_dir.glob('courses_backup_*.db'), reverse=True)
            for old_backup in backups[7:]:
                old_backup.unlink()
                print(f"Removed old backup: {old_backup}")

        except Exception as e:
            print(f"Database backup failed: {e}")
    else:
        print("Database not found, skipping backup")

def cleanup_old_backups():
    """Remove backups older than 30 days"""
    from datetime import timedelta
    cutoff = datetime.now() - timedelta(days=30)

    backup_dir = Path('backups')
    if backup_dir.exists():
        for backup_file in backup_dir.glob('courses_backup_*.db'):
            try:
                # Extract timestamp from filename
                timestamp_str = backup_file.stem.split('_', 2)[-1]
                file_date = datetime.strptime(timestamp_str, '%Y%m%d_%H%M%S')

                if file_date < cutoff:
                    backup_file.unlink()
                    print(f"Removed old backup: {backup_file}")
            except (ValueError, IndexError):
                continue

def run_health_check():
    """Run basic health checks"""
    print(f"[{datetime.now()}] Running health checks...")

    # Check if database exists and is accessible
    try:
        from models import db, User, Progress
        # This would require app context, simplified check
        if os.path.exists('courses.db'):
            print("Database: OK")
        else:
            print("Database: MISSING")
    except ImportError:
        print("Database check: FAILED - models not importable")

    # Check if course data exists
    if os.path.exists('course_data.json'):
        print("Course data: OK")
    else:
        print("Course data: MISSING")

    print("Health check completed")

def main():
    """Main cron job runner"""
    print(f"[{datetime.now()}] Starting cron jobs...")

    # Run all jobs
    regenerate_courses()
    backup_database()
    cleanup_old_backups()
    run_health_check()

    print(f"[{datetime.now()}] All cron jobs completed")

if __name__ == '__main__':
    main()