#![cfg_attr(
    all(not(debug_assertions), target_os = "windows"),
    windows_subsystem = "windows"
)]

pub mod commands;
pub mod utils;

use commands::fs::is_directory;
use tauri::{
    App, AppHandle, CustomMenuItem, GlobalShortcutManager, GlobalWindowEvent, Manager, Menu,
    SystemTray, SystemTrayEvent, SystemTrayMenu, SystemTrayMenuItem, WindowMenuEvent,
};
use utils::consts::{
    EVENT_TOGGLE_LOCK, EVENT_TOGGLE_SETTINGS, MENU_ID_QUIT, MENU_ID_TOGGLE_LOCK,
    MENU_ID_TOGGLE_SETTINGS, MENU_ID_TOGGLE_VISIBLE,
};

use crate::commands::{fs::save_file, git::git_clone, menu::show_note_menu};
#[derive(Clone, serde::Serialize)]
struct Payload {}
fn main() {
    tauri::Builder::default()
        .menu(build_window_menu())
        .system_tray(build_system_tray_menu())
        .on_menu_event(on_menu_event)
        .on_system_tray_event(on_system_tray_event)
        .on_window_event(on_window_event)
        .invoke_handler(tauri::generate_handler![
            is_directory,
            git_clone,
            show_note_menu,
            save_file
        ])
        .setup(setup)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn build_window_menu() -> Menu {
    if cfg!(target_os = "macos") {
        use tauri::{AboutMetadata, MenuItem, Submenu};
        let app_menu = Submenu::new(
            "app",
            Menu::new()
                .add_native_item(MenuItem::About(
                    "何方笔记".to_string(),
                    AboutMetadata::default(),
                ))
                .add_item(CustomMenuItem::new("check-update", "检查更新"))
                .add_native_item(MenuItem::Separator)
                .add_item(CustomMenuItem::new("settings", "设置...").accelerator("Command+,"))
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Services)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Hide)
                .add_native_item(MenuItem::HideOthers)
                .add_native_item(MenuItem::ShowAll)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Quit),
        );
        let edit_menu = Submenu::new(
            "编辑",
            Menu::new()
                .add_native_item(MenuItem::Undo)
                .add_native_item(MenuItem::Redo)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::Copy)
                .add_native_item(MenuItem::Cut)
                .add_native_item(MenuItem::Paste)
                .add_native_item(MenuItem::Separator)
                .add_native_item(MenuItem::SelectAll),
        );
        Menu::new().add_submenu(app_menu).add_submenu(edit_menu)
    } else {
        Menu::with_items([])
    }
}

fn on_menu_event(event: WindowMenuEvent) {
    match event.menu_item_id() {
        "settings" => {
            println!("Setting menu clicked: {}", event.window().label());
            event
                .window()
                .emit(EVENT_TOGGLE_SETTINGS, Payload {})
                .unwrap();
        }
        _ => {}
    }
}

fn build_system_tray_menu() -> SystemTray {
    let toggle_visible = CustomMenuItem::new(MENU_ID_TOGGLE_VISIBLE.to_string(), "显示/隐藏");
    let toggle_lock = CustomMenuItem::new(MENU_ID_TOGGLE_LOCK.to_string(), "锁定/解锁");
    let toggle_settings_modal = CustomMenuItem::new(MENU_ID_TOGGLE_SETTINGS.to_string(), "设置");
    let quit = CustomMenuItem::new(MENU_ID_QUIT.to_string(), "退出");

    SystemTray::new().with_menu(
        SystemTrayMenu::new()
            .add_item(toggle_lock)
            .add_item(toggle_visible)
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(toggle_settings_modal)
            .add_native_item(SystemTrayMenuItem::Separator)
            .add_item(quit),
    )
}

fn on_system_tray_event(app: &AppHandle, event: SystemTrayEvent) {
    match event {
        SystemTrayEvent::LeftClick { .. } => {
            if let Some(window) = app.get_window("main") {
                window.show().unwrap();
                window.set_focus().unwrap();
            }
        }
        SystemTrayEvent::MenuItemClick { id, .. } => {
            let id_str = id.as_str();
            let window = app.get_window("main").unwrap();
            match id_str {
                MENU_ID_QUIT => app.exit(0),
                MENU_ID_TOGGLE_VISIBLE => {
                    if window.is_visible().unwrap() {
                        window.minimize().unwrap();
                    } else {
                        window.show().unwrap();
                        window.current_monitor().unwrap();
                        window.set_focus().unwrap();
                    }
                }
                MENU_ID_TOGGLE_LOCK => {
                    window.show().unwrap();
                    window.emit(EVENT_TOGGLE_LOCK, Payload {}).unwrap();
                }
                MENU_ID_TOGGLE_SETTINGS => {
                    window.show().unwrap();
                    window.emit(EVENT_TOGGLE_SETTINGS, Payload {}).unwrap();
                }
                _ => {
                    println!("未监听的菜单事件: {}", id)
                }
            }
        }
        _ => {}
    }
}

fn on_window_event(event: GlobalWindowEvent) {
    match event.event() {
        tauri::WindowEvent::CloseRequested { api, .. } => {
            api.prevent_close();
            event.window().minimize().unwrap();
        }
        _others => {
            println!("未监听的窗口事件: {:?}", _others)
        }
    }
}

fn setup(app: &mut App) -> Result<(), Box<dyn std::error::Error>> {
    if cfg!(not(target_os = "macos")) {
        if let Some(window) = app.get_window("main") {
            window.set_decorations(false).unwrap();
            window_shadows::set_shadow(&window, true).expect("Unsupported platform!");
        }
    }
    Ok(())
}
