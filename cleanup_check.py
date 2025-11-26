import os
import shutil
import time

def get_mtime(path):
    return os.path.getmtime(path)

source_dir = 'Wedding-Planner'
target_dir = '.'
files_to_move = []

for root, dirs, files in os.walk(source_dir):
    if 'node_modules' in root or '.git' in root or 'build' in root:
        continue
        
    for file in files:
        src_path = os.path.join(root, file)
        rel_path = os.path.relpath(src_path, source_dir)
        dest_path = os.path.join(target_dir, rel_path)
        
        if os.path.exists(dest_path):
            src_mtime = get_mtime(src_path)
            dest_mtime = get_mtime(dest_path)
            
            # If source is newer by more than 1 second (to avoid precision issues)
            if src_mtime > dest_mtime + 1:
                files_to_move.append((src_path, dest_path, "NEWER"))
        else:
            files_to_move.append((src_path, dest_path, "MISSING"))

print(f"Found {len(files_to_move)} files to rescue.")
for src, dest, reason in files_to_move:
    print(f"[{reason}] {src} -> {dest}")
