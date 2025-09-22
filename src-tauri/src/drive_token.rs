use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize, Clone, Default)]
pub struct DriveToken {
  pub access_token: Option<String>,
  pub refresh_token: Option<String>,
  pub expires_at: Option<i64>,
  pub scope: Option<String>,
  pub token_type: Option<String>,
}

pub async fn read_token() -> Result<DriveToken, ()> { Ok(DriveToken::default()) }
pub async fn write_token(_tok: &DriveToken) -> Result<(), ()> { Ok(()) }
