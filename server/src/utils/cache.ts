interface CacheEntry<T> {
  value: T;
  expiresAt: number;
}

export default class SimpleCache<T> {
  private cache = new Map<string, CacheEntry<T>>();

  constructor(private ttl: number) {}

  get(key: string): T | null {
    const entry = this.cache.get(key);
    if (!entry) return null;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return null;
    }

    return entry.value;
  }

  getAll(): Array<T> {
    const now = Date.now();
    const values: Array<T> = [];

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      } else {
        values.push(entry.value);
      }
    }

    return values;
  }

  set(key: string, value: T) {
    const expiresAt = Date.now() + this.ttl;
    this.cache.set(key, {
      value,
      expiresAt,
    });
  }

  has(key: string): boolean {
    const entry = this.cache.get(key);
    if (!entry) return false;

    if (Date.now() > entry.expiresAt) {
      this.cache.delete(key);
      return false;
    }

    return true;
  }

  expire(key: string) {
    const entry = this.cache.get(key);
    if (!entry) return;

    this.cache.set(key, {
      value: entry.value,
      expiresAt: Date.now(),
    });
  }

  purge() {
    const now = Date.now();

    for (const [key, entry] of this.cache.entries()) {
      if (now > entry.expiresAt) {
        this.cache.delete(key);
      }
    }
  }

  clear() {
    this.cache.clear();
  }

  keys(): string[] {
    return [...this.cache.keys()];
  }

  size(): number {
    return this.cache.size;
  }
}
