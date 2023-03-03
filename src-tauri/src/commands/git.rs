use git2::{build::CheckoutBuilder, Repository};
use tauri::AppHandle;

#[tauri::command]
pub fn git_clone(url: String, app_handle: AppHandle) {
    if let Some(mut repo_path) = app_handle.path_resolver().app_data_dir() {
        repo_path.push("data");
        if let Ok(repo) = Repository::clone(url.as_str(), repo_path) {
            let mut builder = CheckoutBuilder::default();
            repo.checkout_head(Option::Some(&mut builder)).unwrap();
        }
    }
}
