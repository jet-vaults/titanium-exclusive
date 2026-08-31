// Edge cache helpers built on the Workers Cache API.
// Keys are synthetic URLs under the current host so entries are scoped per deployment host.

export async function cachedJson(ctx, key, ttl, loader) {
  const cache = caches.default;
  const req = new Request(`https://edge-cache.local/${encodeURIComponent(key)}`);
  const hit = await cache.match(req);
  if (hit) {
    try { return await hit.json(); } catch { /* fall through to reload */ }
  }
  const data = await loader();
  if (data !== undefined) {
    const res = new Response(JSON.stringify(data), {
      headers: { 'content-type': 'application/json', 'cache-control': `public, max-age=${ttl}` },
    });
    const put = cache.put(req, res);
    if (ctx && ctx.waitUntil) ctx.waitUntil(put); else await put;
  }
  return data;
}
