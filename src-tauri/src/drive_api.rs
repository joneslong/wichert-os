#[tauri::command]
pub async fn drive_check(_token_ep: String, _client_id: String) -> Result<String, String> {
  Ok("disconnected".into())
}

#[tauri::command]
pub async fn drive_upload_snapshot(
  _token_ep: String,
  _client_id: String,
  _api_base: String,
  _filename: String,
  _content: String
) -> Result<(), String> {
  Ok(())
}

#[tauri::command]
pub async fn drive_download_latest(
  _token_ep: String,
  _client_id: String,
  _api_base: String,
  _name_prefix: String
) -> Result<String, String> {
  Ok(r#"{"createdAt":0,"data":{"contacts":[],"pipeline":[],"tasks":[],"emails":[]}}"#.into())
}
