use std::path::Path;

#[tauri::command]
pub fn is_directory(path: &str) -> bool {
    return Path::new(path).is_dir();
}
