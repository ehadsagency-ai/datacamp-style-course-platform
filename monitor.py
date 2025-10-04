import tkinter as tk
from tkinter import ttk, messagebox
import threading
import time
from pathlib import Path
import os

DOWNLOADS_PATH = Path("/Users/deo_metoyer/Downloads")

def get_status():
    status = {}
    # File counts
    for prof in ["CEO", "PROF", "DEVOPS"]:
        path = DOWNLOADS_PATH / f"Profession_Hubs/{prof}/incoming"
        status[f"{prof} Files"] = len(list(path.glob("*"))) if path.exists() else 0
    
    # Archive count
    archive_path = DOWNLOADS_PATH / "ARCHIVE_PROJET"
    status["Archived Projects"] = len(list(archive_path.glob("*"))) if archive_path.exists() else 0
    
    # Processes (placeholder, psutil not available)
    status["Web Orchestrator"] = "Check manually"
    status["Offline Automator"] = "Check manually"
    
    return status

class MonitorApp:
    def __init__(self, root):
        self.root = root
        self.root.title("Downloads Orchestrator Monitor")
        self.root.geometry("400x500")
        self.root.attributes("-topmost", True)  # Always on top
        
        self.labels = {}
        self.status_frame = ttk.Frame(root)
        self.status_frame.pack(pady=10)

        # Create labels
        for key in ["CEO Files", "PROF Files", "DEVOPS Files", "Archived Projects", "Web Orchestrator", "Offline Automator"]:
            ttk.Label(self.status_frame, text=f"{key}:").grid(row=len(self.labels), column=0, sticky="w", padx=5)
            self.labels[key] = ttk.Label(self.status_frame, text="Loading...")
            self.labels[key].grid(row=len(self.labels)-1, column=1, sticky="w", padx=5)

        # API Keys section
        self.key_frame = ttk.Frame(root)
        self.key_frame.pack(pady=10)
        ttk.Label(self.key_frame, text="API Keys:").grid(row=0, column=0, columnspan=2)

        self.key_entries = {}
        keys = ["PROTON_USERNAME", "PROTON_PASSWORD", "MANUS_API_KEY", "USER_ROLE"]
        for i, key in enumerate(keys, 1):
            ttk.Label(self.key_frame, text=f"{key}:").grid(row=i, column=0, sticky="w", padx=5)
            entry = ttk.Entry(self.key_frame, show="*" if "PASSWORD" in key else "")
            entry.grid(row=i, column=1, padx=5)
            entry.insert(0, os.getenv(key, ""))
            self.key_entries[key] = entry

        self.save_button = ttk.Button(self.key_frame, text="Save Keys", command=self.save_keys)
        self.save_button.grid(row=len(keys)+1, column=0, columnspan=2, pady=5)
        
        # Key bindings
        self.root.bind('<Key>', self.handle_key)

        # Instructions
        ttk.Label(root, text="Press 'r' to refresh, 'q' to quit").pack(pady=5)

        # Update thread
        self.update_thread = threading.Thread(target=self.update_loop, daemon=True)
        self.update_thread.start()
    
    def update_loop(self):
        while True:
            status = get_status()
            for key, value in status.items():
                self.labels[key].config(text=str(value))
            time.sleep(5)  # Update every 5 seconds

    def handle_key(self, event):
        if event.char == 'q':
            self.root.quit()
        elif event.char == 'r':
            self.update_status()

    def update_status(self):
        status = get_status()
        for key, value in status.items():
            self.labels[key].config(text=str(value))

    def save_keys(self):
        env_file = DOWNLOADS_PATH / ".orchestrator" / ".env"
        env_file.parent.mkdir(parents=True, exist_ok=True)
        with open(env_file, 'w') as f:
            for key, entry in self.key_entries.items():
                f.write(f"{key}={entry.get()}\n")
        messagebox.showinfo("Saved", "API keys saved to .env file. Restart apps to apply.")

if __name__ == "__main__":
    root = tk.Tk()
    app = MonitorApp(root)
    root.mainloop()