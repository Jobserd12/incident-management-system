import NodeCache from 'node-cache';

const cache = new NodeCache({
  stdTTL: 300,
  checkperiod: 320
});

export const cacheHelper = {
  async getOrSet(key, callback, ttl = 300) {
    const cached = cache.get(key);
    if (cached) return cached;

    const fresh = await callback();
    cache.set(key, fresh, ttl);
    return fresh;
  },

  invalidate(pattern) {
    const keys = cache.keys();
    const matchingKeys = keys.filter(key => key.includes(pattern));
    cache.del(matchingKeys);
  }
}; 