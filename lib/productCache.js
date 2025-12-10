
const productCache = new Map();
const MAX_CACHE_SIZE = 100; // keep only last 50 products per tab

export function setProductCache(id, product) {
  if (productCache.size >= MAX_CACHE_SIZE) {
    // Remove oldest item (FIFO)
    const firstKey = productCache.keys().next().value;
    productCache.delete(firstKey);
  }
  productCache.set(String(id), product);
}

export function getProductCache(id) {
  return productCache.get(String(id)) || null;
}
