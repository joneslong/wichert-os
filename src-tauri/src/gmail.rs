use serde_json::json;
use base64::Engine; // wichtig: trait importieren!

#[tauri::command]
pub async fn gmail_start_device_code(_client_id: String, _scope: String, _device_endpoint: String)
-> Result<serde_json::Value, String> {
  Ok(json!({
    "device_code": "stub-device-code",
    "user_code": "ABCD-EFGH",
    "verification_url": "https://example.com/verify",
    "expires_in": 600,
    "interval": 5
  }))
}

#[tauri::command]
pub async fn gmail_poll_device_code(
  _client_id: String,
  _client_secret: Option<String>,
  _token_endpoint: String,
  _device_code: String,
  _interval_secs: i64
) -> Result<(), String> {
  Ok(())
}

#[tauri::command]
pub async fn gmail_list_messages(_api_base: String) -> Result<serde_json::Value, String> {
  Ok(json!({ "messages": [] }))
}

#[tauri::command]
pub async fn gmail_get_message(_api_base: String, _id: String) -> Result<serde_json::Value, String> {
  // einfacher Plaintext-Body (base64url)
  let body = base64::engine::general_purpose::URL_SAFE_NO_PAD.encode("Hello from stub");
  Ok(json!({
    "id": "stub",
    "payload": {
      "mimeType": "text/plain",
      "body": { "data": body }
    }
  }))
}
