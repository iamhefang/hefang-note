#[tauri::command]
pub fn show_note_menu(x: f64, y: f64, window: tauri::Window) {
    // let menu = Menu::with_items([MenuEntry::CustomItem(CustomMenuItem::new(
    //     "rename-note",
    //     "重命名",
    // ))]);
    println!("显示右键菜单:x={},y={},window={}", x, y, window.label());
}
