use std::{fs, path::Path};

#[tauri::command]
pub fn is_directory(path: &str) -> bool {
    return Path::new(path).is_dir();
}

#[tauri::command]
pub async fn save_file(path: String, contents: String) {
    async {
        fs::write(path, contents).unwrap();
    }
    .await
}
