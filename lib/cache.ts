type CacheEntry<T> = {
  data: T;
  expiry: number;
};

const cache = new Map<string, CacheEntry<any>>();

export function getCached<T>(key: string): T | null {
  const entry = cache.get(key);
  if (!entry) return null;
  if (Date.now() > entry.expiry) {
    cache.delete(key);
    return null;
  }
  return entry.data as T;
}

export function setCached<T>(key: string, data: T, ttlSeconds: number = 60): void {
  cache.set(key, {
    data,
    expiry: Date.now() + ttlSeconds * 1000,
  });
}

export function invalidateCache(keyOrPrefix: string): void {
  for (const key of cache.keys()) {
    if (key === keyOrPrefix || key.startsWith(`${keyOrPrefix}:`) || key.startsWith(keyOrPrefix)) {
      cache.delete(key);
    }
  }
}

export function clearAllCache(): void {
  cache.clear();
}
