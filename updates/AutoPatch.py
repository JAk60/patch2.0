import os
import shutil

def update_files(update_folder, code_root):
    skip_folders = set(['venv', 'node_modules', 'public', 'static', 'tasks', 'uploads', 'reportsjson_data'])
    updated_files = set()

    for root, dirs, files in os.walk(code_root):
        # Exclude skip folders from the search
        dirs[:] = [d for d in dirs if d not in skip_folders]

        for file_name in files:
            if file_name in os.listdir(update_folder):
                update_path = os.path.join(update_folder, file_name)
                target_path = os.path.join(root, file_name)
                shutil.copy(update_path, target_path)
                updated_files.add(file_name)

    return updated_files

if __name__ == "__main__":
    update_folder = "updates"  # Folder containing the updated files
    code_root = "Netra"  # Root folder of your codebase

    updated_files = update_files(update_folder, code_root)
    
    if updated_files:
        print("The following files have been updated:")
        for file_path in updated_files:
            print(file_path)
    else:
        print("No files were updated.")
