from flask import Flask, render_template_string, request, jsonify
from flask_cors import CORS
import json
import os
import shutil
from sentence_transformers import SentenceTransformer
from loguru import logger
from proton_sync import sync_folder as proton_sync_folder
from generate_course import get_course_data

app = Flask(__name__)
CORS(app)

USER_ROLE = os.getenv('USER_ROLE', 'admin')  # admin or user

CONFIG_DIR = "/app/.orchestrator/config" if os.getenv('DOCKER') else "/Users/deo_metoyer/Downloads/.orchestrator/config"
METADATA_FILE = "/app/.orchestrator/downloads_metadata.json" if os.getenv('DOCKER') else "/Users/deo_metoyer/Downloads/.orchestrator/downloads_metadata.json"

# Load AI model
model = SentenceTransformer('all-MiniLM-L6-v2')
logger.add("orchestrator.log", rotation="1 MB")

def load_config():
    config_path = os.path.join(CONFIG_DIR, 'config.ini')
    if os.path.exists(config_path):
        with open(config_path, 'r') as f:
            return f.read()
    return ""

def save_config(data):
    os.makedirs(CONFIG_DIR, exist_ok=True)
    with open(os.path.join(CONFIG_DIR, 'config.ini'), 'w') as f:
        f.write(data)

def load_metadata():
    if os.path.exists(METADATA_FILE):
        with open(METADATA_FILE, 'r') as f:
            return json.load(f)
    return {"files": []}

def save_metadata(data):
    with open(METADATA_FILE, 'w') as f:
        json.dump(data, f)

@app.route('/')
def index():
    config = load_config()
    metadata = load_metadata()
    role = USER_ROLE
    categories = {}
    for file in metadata.get('files', []):
        cat = file.get('category', 'uncategorized')
        if cat not in categories:
            categories[cat] = []
        categories[cat].append(file['name'])
    html = """
    <!DOCTYPE html>
    <html>
    <head>
        <title>Downloads Orchestrator</title>
        <style>
            body { font-family: Arial; margin: 20px; background: #f0f0f0; }
            .tab { display: none; }
            .tab.active { display: block; }
            button { margin: 5px; padding: 10px; background: #4CAF50; color: white; border: none; cursor: pointer; }
            button:hover { background: #45a049; }
            textarea { width: 100%; height: 200px; }
        </style>
    </head>
    <body>
        <h1>Downloads Orchestrator</h1>
        <div>
            <button onclick="showTab('professions')">Professions</button>
            <button onclick="showTab('clouds')">Clouds</button>
            <button onclick="showTab('rules')">Rules</button>
            <button onclick="showTab('files')">Files</button>
            <button onclick="showTab('files')">Files</button>
            <button onclick="showTab('config')">Config</button>
        </div>
        
        <div id="files" class="tab">
            <h2>File Management</h2>
            <p>Files by category:</p>
            <ul>
            {% for cat, files in categories.items() %}
            <li>{{ cat }}: {{ files|join(' , ') }}</li>
            {% endfor %}
            </ul>        </div>
        
        <div id="professions" class="tab active">
            <h2>Profession Hubs</h2>
            <p>CEO: Government/Legal/Finance</p>
            <p>PROF: Education/Books/Data</p>
            <p>DEVOPS: Dev/Tools/Identity</p>
            <button onclick="applyProfessionRules()">Apply Rules</button>
        </div>
        
        <div id="files" class="tab">
            <h2>File Management</h2>
            <p>Files by category:</p>
            <ul>
            {% for cat, files in categories.items() %}
            <li>{{ cat }}: {{ files|join(' , ') }}</li>
            {% endfor %}
            </ul>        </div>
        
        <div id="clouds" class="tab">
            <h2>Cloud Sync</h2>
            <p>Proton Drive, Adobe Cloud, Google Drive, OneDrive, Dropbox</p>
            <button onclick="syncClouds()">Sync All</button>
        </div>
        
        <div id="files" class="tab">
            <h2>File Management</h2>
            <p>Files by category:</p>
            <ul>
            {% for cat, files in categories.items() %}
            <li>{{ cat }}: {{ files|join(' , ') }}</li>
            {% endfor %}
            </ul>        </div>
        
        <div id="rules" class="tab">
            <h2>Orchestration Rules</h2>
            <textarea id="rulesText">Default rules: OCR PDFs, archive projects</textarea>
            <br>
            <button onclick="saveRules()">Save Rules</button>
        </div>
        
        <div id="files" class="tab">
            <h2>File Management</h2>
            <p>Files by category:</p>
            <ul>
            {% for cat, files in categories.items() %}
            <li>{{ cat }}: {{ files|join(' , ') }}</li>
            {% endfor %}
            </ul>        </div>
        
        <div id="config" class="tab">
            <h2>Configuration</h2>
            <textarea id="configText">{{ config }}</textarea>
            <br>
            <button onclick="saveConfig()">Save Config</button>
        </div>
        
        <div id="files" class="tab">
            <h2>File Management</h2>
            <p>Files by category:</p>
            <ul>
            {% for cat, files in categories.items() %}
            <li>{{ cat }}: {{ files|join(' , ') }}</li>
            {% endfor %}
            </ul>        </div>
        
        <script>
            function showTab(tabName) {
                var tabs = document.getElementsByClassName('tab');
                for (var i = 0; i < tabs.length; i++) {
                    tabs[i].classList.remove('active');
                }
                document.getElementById(tabName).classList.add('active');
            }
            
            function applyProfessionRules() {
                fetch('/apply_rules', { method: 'POST' })
                .then(response => response.json())
                .then(data => alert(data.message));
            }
            
            function syncClouds() {
                fetch('/sync_clouds', { method: 'POST' })
                .then(response => response.json())
                .then(data => alert(data.message));
            }
            
            function saveRules() {
                var rules = document.getElementById('rulesText').value;
                fetch('/save_rules', { method: 'POST', headers: {'Content-Type': 'text/plain'}, body: rules })
                .then(response => response.json())
                .then(data => alert(data.message));
            }
            
            function saveConfig() {
                var config = document.getElementById('configText').value;
                fetch('/save_config', { method: 'POST', headers: {'Content-Type': 'text/plain'}, body: config })
                .then(response => response.json())
                .then(data => alert(data.message));
            }
        </script>
    </body>
    </html>
    """
    return render_template_string(html, config=config, metadata=metadata, role=role, categories=categories)

@app.route('/apply_rules', methods=['POST'])
def apply_rules():
    downloads_path = "/Users/deo_metoyer/Downloads" if not os.getenv('DOCKER') else "/downloads"
    moved_count = 0
    for root, dirs, files in os.walk(downloads_path):
        if any(x in root for x in ['Profession_Hubs', 'ARCHIVE_PROJET', '.orchestrator', 'STAGING_ENVIRONMENT']):
            continue
        for file in files:
            file_path = os.path.join(root, file)
            try:
                with open(file_path, 'r', errors='ignore') as f:
                    content = f.read(1000)
            except:
                content = file
            embedding = model.encode(content)
            if "justice" in content.lower() or "gov" in content.lower():
                profession = "CEO"
            elif "education" in content.lower() or "book" in content.lower():
                profession = "PROF"
            else:
                profession = "DEVOPS"
            target_dir = os.path.join(downloads_path, "Profession_Hubs", profession, "incoming")
            os.makedirs(target_dir, exist_ok=True)
            shutil.move(file_path, os.path.join(target_dir, file))
            metadata = load_metadata()
            metadata['files'].append({'name': os.path.join(target_dir, file), 'category': 'other', 'embedding': embedding.tolist()})
            save_metadata(metadata)
            moved_count += 1
    return jsonify({"message": f"Rules applied, {moved_count} files moved"})

@app.route('/sync_clouds', methods=['POST'])
def sync_clouds():
    config = load_config()
    synced = []
    if 'proton' in config.lower():
        proton_sync_folder('/Users/deo_metoyer/Downloads/ARCHIVE_PROJET', 'archive_projet')
        synced.append('Proton Drive')
    # Add other clouds here
    message = f"Clouds synced: {' , '.join(synced)}" if synced else "No clouds configured"
    return jsonify({"message": message})

@app.route('/save_rules', methods=['POST'])
def save_rules():
    rules = request.data.decode('utf-8')
    # Save rules to config
    return jsonify({"message": "Rules saved"})

@app.route('/save_config', methods=['POST'])
def save_config_route():
    config = request.data.decode('utf-8')
    save_config(config)
    return jsonify({"message": "Config saved"})

@app.route('/health')
def health():
    return 'OK'

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)

@app.route('/search', methods=['POST'])
def search():
    data = request.get_json()
    query = data.get('query', '') if data else ''
    if not query:
        return jsonify({'results': []})
    query_emb = model.encode(query)
    metadata = load_metadata()
    results = []
    for item in metadata.get('files', []):
        if 'embedding' in item:
            sim = model.similarity(query_emb, item['embedding'])
            if sim > 0.5:  # threshold
                results.append({'file': item['name'], 'similarity': sim})
    results.sort(key=lambda x: x['similarity'], reverse=True)
    return jsonify({'results': results})

@app.route('/api/courses')
def get_courses():
    try:
        courses = get_course_data()
        return jsonify(courses)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
