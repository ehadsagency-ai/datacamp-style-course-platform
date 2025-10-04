import tkinter as tk
from tkinter import ttk, messagebox
import configparser
import requests
import json
import os

# Manus API config
MANUS_API_URL = "https://api.manus.ai/v1/tasks"
MANUS_API_KEY = "sk-SHYldu5tbm8DhGdutjXiWm2F61WSSR_BctfSIwOVwsccChfvl-sUBjM11hZUWp3poBiA6TKig_Y0eH4g2AX44Bt9zalc"

def get_manus_advice():
    prompt = "Provide concise advice to optimize Downloads data management for an AI database. Focus on organization, categorization, and scalability."
    payload = {"instructions": prompt, "attachments": []}
    headers = {"Authorization": f"Bearer {MANUS_API_KEY}", "Content-Type": "application/json"}
    try:
        response = requests.post(MANUS_API_URL, json=payload, headers=headers, timeout=30)
        response.raise_for_status()
        task_id = response.json().get("task_id")
        if task_id:
            for _ in range(12):
                import time
                time.sleep(5)
                status_response = requests.get(f"{MANUS_API_URL}/{task_id}", headers=headers, timeout=10)
                if status_response.status_code == 200:
                    data = status_response.json()
                    if data.get("status") == "completed":
                        return data.get("result", data.get("output", "No advice available."))
        return "Default: Organize by category, remove duplicates, use AI for naming."
    except:
        return "Error fetching advice. Check API."

def get_manus_propositions():
    return [
        "Apply icon 📐 to College-de-France folders for math content.",
        "Merge PDFs Mystères into subcategories based on content.",
        "Add metadata tags to files for better AI indexing."
    ]

def validate_proposition(prop, index):
    if messagebox.askyesno("Validate", f"Apply: {prop}?"):
        messagebox.showinfo("Applied", f"Proposition {index+1} validated and applied.")
        # Execute action here
    else:
        messagebox.showinfo("Rejected", f"Proposition {index+1} rejected.")

def save_config():
    config = configparser.ConfigParser()
    config.read('downloads_config.ini')
    
    manus_key = manus_key_entry.get()
    cloud_user = cloud_user_entry.get()
    cloud_pass = cloud_pass_entry.get()
    
    if not all([manus_key, cloud_user, cloud_pass]):
        messagebox.showerror("Erreur", "Tous les champs doivent être remplis !")
        return
    
    config['MANUS'] = {'API_KEY': manus_key}
    config['CLOUD'] = {'USERNAME': cloud_user, 'PASSWORD': cloud_pass}
    
    with open('downloads_config.ini', 'w') as f:
        config.write(f)
    
    progress['value'] = 0
    root.update()
    for i in range(101):
        progress['value'] = i
        root.update()
        root.after(10)
    
    messagebox.showinfo("Succès", "Configuration sauvegardée !")
    root.destroy()

# Dark mode
dark_bg = "#2e2e2e"
dark_fg = "white"
light_bg = "#4e4e4e"

root = tk.Tk()
root.title("Downloads Management - Opencode Dark Mode")
root.geometry("500x600")
root.configure(bg=dark_bg)

# Advice
advice = get_manus_advice()
ttk.Label(root, text="AI Advice:", font=("Helvetica", 14, "bold"), background=dark_bg, foreground=dark_fg).pack(pady=10)
advice_text = tk.Text(root, height=3, width=50, font=("Helvetica", 10), bg=light_bg, fg=dark_fg)
advice_text.insert(tk.END, advice)
advice_text.config(state=tk.DISABLED)
advice_text.pack(pady=5)

# Propositions
propositions = get_manus_propositions()
ttk.Label(root, text="Validate Plans:", font=("Helvetica", 14, "bold"), background=dark_bg, foreground=dark_fg).pack(pady=10)
prop_frame = tk.Frame(root, bg=dark_bg)
prop_frame.pack(pady=5)
for i, prop in enumerate(propositions):
    tk.Label(prop_frame, text=f"{i+1}. {prop}", font=("Helvetica", 10), bg=dark_bg, fg=dark_fg, wraplength=400, justify="left").pack(anchor="w", pady=2)
    ttk.Button(prop_frame, text="✓ Apply", command=lambda idx=i, p=prop: validate_proposition(p, idx)).pack(pady=2)

# Config fields
ttk.Label(root, text="API Key:", font=("Helvetica", 12)).pack(pady=10)
manus_key_entry = ttk.Entry(root, width=40, show="*")
manus_key_entry.pack()

ttk.Label(root, text="Cloud User:", font=("Helvetica", 12)).pack(pady=5)
cloud_user_entry = ttk.Entry(root, width=40)
cloud_user_entry.pack()

ttk.Label(root, text="Cloud Pass:", font=("Helvetica", 12)).pack(pady=5)
cloud_pass_entry = ttk.Entry(root, width=40, show="*")
cloud_pass_entry.pack()

progress = ttk.Progressbar(root, orient="horizontal", length=300, mode="determinate")
progress.pack(pady=20)

ttk.Button(root, text="Save Config", command=save_config).pack(pady=10)

root.mainloop()