use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct GmailToken {
  pub access_token: Option<String>,
  pub refresh_token: Option<String>,
  pub expires_at: Option<i64>,
  pub scope: Option<String>,
  pub token_type: Option<String>,
}

// Stubs ohne anyhow – immer erfolgreich
pub async fn read_token() -> Result<GmailToken, ()> { Ok(GmailToken::default()) }
pub async fn write_token(_tok: &GmailToken) -> Result<(), ()> { Ok(()) }
