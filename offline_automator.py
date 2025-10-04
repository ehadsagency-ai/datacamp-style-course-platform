import asyncio
import json
import os
import shutil
from pathlib import Path
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from sentence_transformers import SentenceTransformer
import logging

# Setup logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Load local AI model
model = SentenceTransformer('all-MiniLM-L6-v2')

DOWNLOADS_PATH = Path("/Users/deo_metoyer/Downloads")
METADATA_FILE = "/Users/deo_metoyer/Downloads/.orchestrator/downloads_metadata.json"

def load_metadata():
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'r') as f:
            return json.load(f)
    return {"files": []}

def save_metadata(data):
    with open(METADATA_FILE, 'w') as f:
        json.dump(data, f)
PROFESSION_HUBS = {
    "CEO": DOWNLOADS_PATH / "Profession_Hubs/CEO/incoming",
    "PROF": DOWNLOADS_PATH / "Profession_Hubs/PROF/incoming",
    "DEVOPS": DOWNLOADS_PATH / "Profession_Hubs/DEVOPS/incoming"
}

class FileHandler(FileSystemEventHandler):
    def __init__(self):
        self.queue = asyncio.Queue()

    def on_created(self, event):
        if not event.is_directory and event.src_path.startswith(str(DOWNLOADS_PATH)) and not any(x in event.src_path for x in ['Profession_Hubs', 'ARCHIVE_PROJET', '.orchestrator', 'STAGING_ENVIRONMENT']):
            asyncio.create_task(self.queue.put(event.src_path))
            logging.info(f"Queued file: {event.src_path}")

async def process_files(handler):
    while True:
        file_path = await handler.queue.get()
        try:
            await process_file(file_path)
        except Exception as e:
            logging.error(f"Error processing {file_path}: {e}")
        handler.queue.task_done()

async def process_file(file_path):
    path = Path(file_path)
    if not path.exists():
        return

    # Read content (first 1000 chars for classification)
    try:
        with open(path, 'r', errors='ignore') as f:
            content = f.read(1000)
    except:
        content = str(path)  # Fallback to filename

    # Classify profession using local AI
    embedding = model.encode(content)
    # Simple classification (in real, compare to centroids)
    if "justice" in content.lower() or "gov" in content.lower():
        profession = "CEO"
    elif "education" in content.lower() or "book" in content.lower():
        profession = "PROF"
    else:
        profession = "DEVOPS"
    
    # Determine category
    ext = path.suffix.lower()
    if ext in [.pdf, .doc, .docx, .txt]:
        category = documents
    elif ext in [.jpg, .png, .gif]:
        category = images
    elif ext in [.zip, .tar, .gz]:
        category = archives
    else:
        category = other

    target_dir = PROFESSION_HUBS[profession]
    target_dir.mkdir(parents=True, exist_ok=True)
    target = target_dir / path.name

    shutil.move(str(path), str(target))
    logging.info(f"Moved {path} to {profession} hub")
    
    # Update metadata
    metadata = load_metadata()
    metadata['files'].append({'name': str(target), 'category': category, 'embedding': embedding.tolist()})
    save_metadata(metadata)

async def main():
    handler = FileHandler()
    observer = Observer()
    observer.schedule(handler, str(DOWNLOADS_PATH), recursive=True)
    observer.start()

    # Start processing task
    asyncio.create_task(process_files(handler))

    try:
        await asyncio.Event().wait()  # Run forever
    except KeyboardInterrupt:
        observer.stop()
    observer.join()

if __name__ == "__main__":
    asyncio.run(main())