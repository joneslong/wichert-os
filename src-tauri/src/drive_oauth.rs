// WICHTIG: das Attribut erzeugt das __cmd__ Symbol
#[tauri::command]
pub async fn drive_start_auth(
  _client_id: String,
  _scope: String,
  _auth_ep: String,
  _token_ep: String
) -> Result<(), String> {
  Ok(())
}
