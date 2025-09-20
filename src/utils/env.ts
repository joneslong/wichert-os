export function isTauri(): boolean {
  return typeof (window as any).__TAURI__ !== "undefined";
}
