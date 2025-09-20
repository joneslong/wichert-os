use tracing::{info, warn, error};
use tracing_subscriber::{EnvFilter, fmt};

fn main() {
  tracing_subscriber::registry()
    .with(EnvFilter::from_default_env().add_directive("info".parse().unwrap()))
    .with(fmt::layer())
    .init();

  info!("Wichert OS (Tauri) startet…");

  tauri::Builder::default()
    .setup(|_app| {
      info!("setup ok");
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
