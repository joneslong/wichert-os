use tracing::info;
use tracing_subscriber::{EnvFilter, fmt};
use tracing_subscriber::prelude::*; // macht .with(...) verfügbar

fn main() {
  // Zentrales Logging (keine Konkurrenz zum plugin-log)
  tracing_subscriber::registry()
    .with(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
    .with(fmt::layer())
    .init();

  info!("Wichert OS (Tauri v2.8.4) startet…");

  tauri::Builder::default()
    // Einziger Plugin aktuell: Opener (für externes Öffnen)
    .plugin(tauri_plugin_opener::init())
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
