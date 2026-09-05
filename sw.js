const MEDIA_CACHE_NAME = 'supspace_media_cache_v1';

function shouldCacheRequest(request){
  if(!request||request.method!=='GET') return false;
  if(request.headers?.has('range')) return false;
  let url;
  try{url=new URL(request.url);}catch{return false;}
  if(!/^https?:$/i.test(url.protocol)) return false;
  if(url.pathname.includes('/ipfs/')) return true;
  if(request.destination==='image') return true;
  return false;
}

self.addEventListener('install',event=>{
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate',event=>{
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(!shouldCacheRequest(req)) return;
  event.respondWith((async()=>{
    const cache=await caches.open(MEDIA_CACHE_NAME);
    const hit=await cache.match(req);
    if(hit) return hit;
    try{
      const res=await fetch(req);
      if(res&&(res.ok||res.type==='opaque')) cache.put(req,res.clone()).catch(()=>{});
      return res;
    }catch{
      const fallback=await cache.match(req);
      if(fallback) return fallback;
      throw new Error('Network failed');
    }
  })());
});
