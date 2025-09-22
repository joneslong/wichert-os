mod gmail_token;
mod gmail;
mod drive_token;
mod drive_oauth;
mod drive_api;

use tracing_subscriber::{EnvFilter, fmt, prelude::*};

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
  // Einheitliches Logging über tracing_subscriber
  tracing_subscriber::registry()
    .with(fmt::layer())
    .with(EnvFilter::try_from_default_env().unwrap_or_else(|_| EnvFilter::new("info")))
    .init();

  tauri::Builder::default()
    // KEIN tauri_plugin_log mehr!
    .plugin(tauri_plugin_opener::init())
    .invoke_handler(tauri::generate_handler![
      // Gmail
      gmail::gmail_start_device_code,
      gmail::gmail_poll_device_code,
      gmail::gmail_list_messages,
      gmail::gmail_get_message,
      // Drive
      drive_oauth::drive_start_auth,
      drive_api::drive_check,
      drive_api::drive_upload_snapshot,
      drive_api::drive_download_latest,
    ])
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}

