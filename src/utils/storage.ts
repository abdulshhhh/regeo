const PREFIX = 'regeo_'

export const storage = {
  get<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(PREFIX + key)
      return item ? JSON.parse(item) : null
    } catch {
      return null
    }
  },
  set<T>(key: string, value: T): void {
    try {
      localStorage.setItem(PREFIX + key, JSON.stringify(value))
    } catch { /* empty */ }
  },
  remove(key: string): void {
    localStorage.removeItem(PREFIX + key)
  },
  clear(): void {
    Object.keys(localStorage)
      .filter(k => k.startsWith(PREFIX))
      .forEach(k => localStorage.removeItem(k))
  }
}
