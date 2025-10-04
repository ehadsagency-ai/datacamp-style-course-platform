import os
from webdav3.client import Client
from loguru import logger

# Proton Drive WebDAV credentials (use environment variables for security)
WEBDAV_HOST = os.getenv('PROTON_WEBDAV_HOST', 'https://webdav.proton.me')
USERNAME = os.getenv('PROTON_USERNAME')
PASSWORD = os.getenv('PROTON_PASSWORD')

if not USERNAME or not PASSWORD:
    raise ValueError("Set PROTON_USERNAME and PROTON_PASSWORD environment variables")

options = {
    'webdav_hostname': WEBDAV_HOST,
    'webdav_login': USERNAME,
    'webdav_password': PASSWORD
}

client = Client(options)
client.verify = False  # For self-signed certs if needed

logger.add("proton_sync.log", rotation="1 MB")

def upload_file(local_path, remote_path):
    """Upload a file to Proton Drive"""
    try:
        client.upload_sync(local_path=local_path, remote_path=remote_path)
        logger.info(f"Uploaded {local_path} to {remote_path}")
    except Exception as e:
        logger.error(f"Failed to upload {local_path}: {e}")

def download_file(remote_path, local_path):
    """Download a file from Proton Drive"""
    try:
        client.download_sync(remote_path=remote_path, local_path=local_path)
        logger.info(f"Downloaded {remote_path} to {local_path}")
    except Exception as e:
        logger.error(f"Failed to download {remote_path}: {e}")

def list_files(remote_path='/'):
    """List files in a remote directory"""
    try:
        files = client.list(remote_path)
        return files
    except Exception as e:
        logger.error(f"Failed to list {remote_path}: {e}")
        return []

def sync_folder(local_folder, remote_folder):
    """Sync a local folder to remote folder (basic upload)"""
    for root, dirs, files in os.walk(local_folder):
        for file in files:
            local_path = os.path.join(root, file)
            relative_path = os.path.relpath(local_path, local_folder)
            remote_path = os.path.join(remote_folder, relative_path).replace('\\', '/')
            upload_file(local_path, remote_path)

if __name__ == '__main__':
    # Example usage
    sync_folder('/Users/deo_metoyer/Downloads/ARCHIVE_PROJET', 'archive_projet')
