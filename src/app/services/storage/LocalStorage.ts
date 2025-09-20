import { IStorage } from './IStorage';

export class LocalStorage implements IStorage {
  async get<T>(key: string): Promise<T | null> {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) as T : null;
  }
  async set<T>(key: string, value: T): Promise<void> {
    localStorage.setItem(key, JSON.stringify(value));
  }
  async remove(key: string): Promise<void> {
    localStorage.removeItem(key);
  }
  async keys(): Promise<string[]> {
    return Object.keys(localStorage);
  }
}
