const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const replacements = [
  {
    search: `const DEFAULT_IPFS_GWS = ['https://p2fk.io/ipfs/','https://ipfs.filebase.io/ipfs/','https://gateway.pinata.cloud/ipfs/'];
const IPFS_SETTINGS_KEY = 'sup_ipfs_settings_v1';
const MEDIA_CACHE_NAME = 'supspace_media_cache_v1';
let IPFS_GWS = [...DEFAULT_IPFS_GWS];
const IPFS_PATH_RE = /^\\/?ipfs\\/([a-zA-Z0-9]+)(?:\\/(.*))?$/i;`,
    replace: `const DEFAULT_IPFS_GWS = ['https://p2fk.io/ipfs/','https://ipfs.filebase.io/ipfs/','https://gateway.pinata.cloud/ipfs/'];
const IPFS_SETTINGS_KEY = 'sup_ipfs_settings_v1';
const MEDIA_CACHE_NAME = 'supspace_media_cache_v1';
const STALE_CIDS_KEY = 'sup_stale_cids_v1';
let IPFS_GWS = [...DEFAULT_IPFS_GWS];
let staleCids;
try { staleCids = new Set(JSON.parse(localStorage.getItem(STALE_CIDS_KEY) || '[]')); } catch { staleCids = new Set(); }
window.staleCids = staleCids;
function markCidStale(cid) { if (!cid) return; staleCids.add(cid); try { localStorage.setItem(STALE_CIDS_KEY, JSON.stringify([...staleCids])); } catch {} }
window.markCidStale = markCidStale;
function isCidStale(cid) { return cid ? staleCids.has(cid) : false; }
window.isCidStale = isCidStale;
const IPFS_PATH_RE = /^\\/?ipfs\\/([a-zA-Z0-9]+)(?:\\/(.*))?$/i;`
  },
  {
    search: `window.clearCacheAndSettings=async function(){
  const st=$('cacheSettingsStatus');
  showStatus(st,'Clearing cache and gateway settings…','info');
  try{
    if(typeof caches!=='undefined') await caches.delete(MEDIA_CACHE_NAME);
    for(const objUrl of mediaObjectUrlCache.values()){
      try{URL.revokeObjectURL(objUrl);}catch{}
    }
    mediaObjectUrlCache.clear();
    localStorage.removeItem(IPFS_SETTINGS_KEY);
    IPFS_GWS=[...DEFAULT_IPFS_GWS];`,
    replace: `window.clearCacheAndSettings=async function(){
  const st=$('cacheSettingsStatus');
  showStatus(st,'Clearing cache and gateway settings…','info');
  try{
    if(typeof caches!=='undefined') await caches.delete(MEDIA_CACHE_NAME);
    for(const objUrl of mediaObjectUrlCache.values()){
      try{URL.revokeObjectURL(objUrl);}catch{}
    }
    mediaObjectUrlCache.clear();
    localStorage.removeItem(IPFS_SETTINGS_KEY);
    localStorage.removeItem(STALE_CIDS_KEY);
    staleCids.clear();
    IPFS_GWS=[...DEFAULT_IPFS_GWS];`
  },
  {
    search: `function extractIpfsParts(v){
  const input=norm(v);if(!input) return null;
  if(/^ipfs:/i.test(input)){const b=input.replace(/^ipfs:/i,'').replace(/^\\/+/,'');const[cr,...ps]=b.split(/[\\\\/]+/).filter(Boolean);const cid=norm(cr||'');return CID_RE.test(cid)?{cid,path:ps.join('/')}:null;}
  const loose=input.match(/(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[1-9A-HJ-NP-Za-km-z]{20,})(?:[\\\\/]+([^<>]+))?/i);
  if(loose) return{cid:loose[1],path:norm(loose[2]||'')};
  try{const u=new URL(input);const hs=norm(u.hostname).split('.ipfs.');if(hs.length>1&&CID_RE.test(hs[0]))return{cid:hs[0],path:norm(u.pathname).replace(/^\\/+/,'')};const pm=norm(u.pathname).match(IPFS_PATH_RE);if(pm)return{cid:pm[1],path:norm(pm[2]||'')};}catch{}
  return null;
}`,
    replace: `function extractIpfsParts(v){
  const input=norm(v);if(!input) return null;
  if(/^ipfs:/i.test(input)){const b=input.replace(/^ipfs:/i,'').replace(/^\\/+/,'');const[cr,...ps]=b.split(/[\\\\/]+/).filter(Boolean);const cid=norm(cr||'');return CID_RE.test(cid)?{cid,path:ps.join('/')}:null;}
  const loose=input.match(/(Qm[1-9A-HJ-NP-Za-km-z]{44}|bafy[1-9A-HJ-NP-Za-km-z]{20,})(?:[\\\\/]+([^<>]+))?/i);
  if(loose) return{cid:loose[1],path:norm(loose[2]||'')};
  try{const u=new URL(input);const hs=norm(u.hostname).split('.ipfs.');if(hs.length>1&&CID_RE.test(hs[0]))return{cid:hs[0],path:norm(u.pathname).replace(/^\\/+/,'')};const pm=norm(u.pathname).match(IPFS_PATH_RE);if(pm)return{cid:pm[1],path:norm(pm[2]||'')};}catch{}
  return null;
}
function extractCidFromUrl(url) {
  const p = extractIpfsParts(url);
  return p ? p.cid : null;
}`
  },
  {
    search: `function mediaAttrs(urls=[]){
  const [first,...rest]=urls.filter(Boolean);
  if(!first) return '';
  if(!rest.length) return \`src="\${esc(first)}"\`;
  return \`src="\${esc(first)}" data-cands="\${esc(JSON.stringify(rest))}" onerror="media_fallback(this)"\`;
}`,
    replace: `function mediaAttrs(urls=[]){
  const [first,...rest]=urls.filter(Boolean);
  if(!first) return '';
  const cid = extractCidFromUrl(first);
  if (cid) return \`data-cands="\${esc(JSON.stringify([first, ...rest]))}" onerror="media_fallback(this)"\`;
  if(!rest.length) return \`src="\${esc(first)}"\`;
  return \`src="\${esc(first)}" data-cands="\${esc(JSON.stringify(rest))}" onerror="media_fallback(this)"\`;
}`
  },
  {
    search: `function profileImgAttrs(ref){
  const cands=profileImgCandidates(ref);
  if(!cands.length) return \`src="\${FALLBACK_AVI}"\`;
  const [first,...rest]=cands;
  const fallbacks=[...rest,FALLBACK_AVI];
  return\`src="\${esc(first)}" data-cands="\${esc(JSON.stringify(fallbacks))}" onerror="pi_err(this)"\`;
}`,
    replace: `function profileImgAttrs(ref){
  const cands=profileImgCandidates(ref);
  if(!cands.length) return \`src="\${FALLBACK_AVI}"\`;
  const [first,...rest]=cands;
  const fallbacks=[...rest,FALLBACK_AVI];
  const cid = extractCidFromUrl(first);
  if (cid) return \`src="\${FALLBACK_AVI}" data-cands="\${esc(JSON.stringify([first,...fallbacks]))}" onerror="pi_err(this)"\`;
  return\`src="\${esc(first)}" data-cands="\${esc(JSON.stringify(fallbacks))}" onerror="pi_err(this)"\`;
}`
  },
  {
    search: `async function hydrateMediaElementFromDiskCache(el){
  if(!el||typeof el!=='object') return;
  if(el.dataset?.cacheHydrated==='1') return;
  const token=(mediaHydrateToken.get(el)||0)+1;
  mediaHydrateToken.set(el,token);
  const cands=mediaElementCandidates(el);
  if(!cands.length) return;
  for(const src of cands){
    try{
      const cached=await mediaObjectUrlFromCache(src);
      if(mediaHydrateToken.get(el)!==token) return;
      el.dataset.cacheHydrated='1';
      el.dataset.cacheSource=src;
      if(norm(el.src)!==norm(cached)) el.src=cached;
      return;
    }catch{}
  }
}`,
    replace: `async function hydrateMediaElementFromDiskCache(el){
  if(!el||typeof el!=='object') return;
  if(el.dataset?.cacheHydrated==='1') return;
  const token=(mediaHydrateToken.get(el)||0)+1;
  mediaHydrateToken.set(el,token);
  const cands=mediaElementCandidates(el);
  if(!cands.length) return;
  let hasCid = false;
  let failedCid = null;
  for(const src of cands){
    const cid = extractCidFromUrl(src);
    if (cid) {
      hasCid = true;
      failedCid = cid;
      if (isCidStale(cid)) continue;
    }
    try{
      const cached=await mediaObjectUrlFromCache(src);
      if(mediaHydrateToken.get(el)!==token) return;
      el.dataset.cacheHydrated='1';
      el.dataset.cacheSource=src;
      if(norm(el.src)!==norm(cached)) el.src=cached;
      return;
    }catch{}
  }
  if (hasCid && failedCid) {
    markCidStale(failedCid);
  }
}`
  },
  {
    search: `async function primeVideoElementDiskCache(el){
  if(!el||typeof el!=='object'||el.tagName!=='VIDEO') return;
  const cands=mediaElementCandidates(el);
  if(!cands.length) return;
  const existing=norm(el.dataset?.cacheSource||'');
  if(el.dataset?.cacheHydrated==='1'&&existing&&cands.includes(existing)) return;
  for(const src of cands){
    try{
      await primeMediaUrlInDiskCache(src);
      el.dataset.cacheHydrated='1';
      el.dataset.cacheSource=src;
      return;
    }catch{}
  }
}`,
    replace: `async function primeVideoElementDiskCache(el){
  if(!el||typeof el!=='object'||el.tagName!=='VIDEO') return;
  const cands=mediaElementCandidates(el);
  if(!cands.length) return;
  const existing=norm(el.dataset?.cacheSource||'');
  if(el.dataset?.cacheHydrated==='1'&&existing&&cands.includes(existing)) return;
  let hasCid = false;
  let failedCid = null;
  for(const src of cands){
    const cid = extractCidFromUrl(src);
    if (cid) {
      hasCid = true;
      failedCid = cid;
      if (isCidStale(cid)) continue;
    }
    try{
      await primeMediaUrlInDiskCache(src);
      el.dataset.cacheHydrated='1';
      el.dataset.cacheSource=src;
      return;
    }catch{}
  }
  if (hasCid && failedCid) markCidStale(failedCid);
}`
  },
  {
    search: `async function hydrateVideoElementFromDiskCache(el){
  if(!el||typeof el!=='object'||el.tagName!=='VIDEO') return false;
  if(el.dataset?.cacheHydrated==='1'&&el.dataset?.cacheSource) return true;
  if(Number(el.currentTime||0)>0||Number(el.readyState||0)>0) return false;
  const cands=mediaElementCandidates(el);
  if(!cands.length) return false;
  for(const src of cands){
    try{
      const cached=await mediaCachedObjectUrlOnly(src);
      if(!cached) continue;
      el.dataset.cacheHydrated='1';
      el.dataset.cacheSource=src;
      if(norm(el.src)!==norm(cached)) el.src=cached;
      return true;
    }catch{}
  }
  return false;
}`,
    replace: `async function hydrateVideoElementFromDiskCache(el){
  if(!el||typeof el!=='object'||el.tagName!=='VIDEO') return false;
  if(el.dataset?.cacheHydrated==='1'&&el.dataset?.cacheSource) return true;
  if(Number(el.currentTime||0)>0||Number(el.readyState||0)>0) return false;
  const cands=mediaElementCandidates(el);
  if(!cands.length) return false;
  let hasCid = false;
  let failedCid = null;
  for(const src of cands){
    const cid = extractCidFromUrl(src);
    if (cid) {
      hasCid = true;
      failedCid = cid;
      if (isCidStale(cid)) continue;
    }
    try{
      const cached=await mediaCachedObjectUrlOnly(src);
      if(!cached) continue;
      el.dataset.cacheHydrated='1';
      el.dataset.cacheSource=src;
      if(norm(el.src)!==norm(cached)) el.src=cached;
      return true;
    }catch{}
  }
  if (hasCid && failedCid) markCidStale(failedCid);
  return false;
}`
  },
  {
    search: `function scanNodeForMediaHydration(node){
  if(!node) return;
  if(node.nodeType===1&&/^IMG$/.test(node.tagName)) queueMediaElementHydration(node);
  if(node.nodeType===1&&/^VIDEO$/.test(node.tagName)) bindVideoDiskCachePrime(node);
  if(typeof node.querySelectorAll==='function'){
    node.querySelectorAll('img').forEach(queueMediaElementHydration);
    node.querySelectorAll('video').forEach(bindVideoDiskCachePrime);
  }
}`,
    replace: `function scanNodeForMediaHydration(node){
  if(!node) return;
  if(node.nodeType===1&&/^(IMG|AUDIO)$/.test(node.tagName)) queueMediaElementHydration(node);
  if(node.nodeType===1&&/^VIDEO$/.test(node.tagName)) bindVideoDiskCachePrime(node);
  if(typeof node.querySelectorAll==='function'){
    node.querySelectorAll('img, audio').forEach(queueMediaElementHydration);
    node.querySelectorAll('video').forEach(bindVideoDiskCachePrime);
  }
}`
  },
  {
    search: `function initMediaDiskCacheHydration(){
  scanNodeForMediaHydration(document.body);
  const mo=new MutationObserver(muts=>{
    muts.forEach(m=>{
      if(m.type==='attributes'&&m.target&&/^IMG$/.test(m.target.tagName)){
        if(m.attributeName==='src'){
          const nextSrc=norm(m.target.getAttribute('src')||m.target.src||'');
          if(/^blob:/i.test(nextSrc)&&norm(m.target.dataset?.cacheSource||'')){
            m.target.dataset.cacheHydrated='1';
            return;
          }
          m.target.dataset.cacheHydrated='';
        }
        queueMediaElementHydration(m.target);
        return;
      }`,
    replace: `function initMediaDiskCacheHydration(){
  scanNodeForMediaHydration(document.body);
  const mo=new MutationObserver(muts=>{
    muts.forEach(m=>{
      if(m.type==='attributes'&&m.target&&/^(IMG|AUDIO)$/.test(m.target.tagName)){
        if(m.attributeName==='src'){
          const nextSrc=norm(m.target.getAttribute('src')||m.target.src||'');
          if(/^blob:/i.test(nextSrc)&&norm(m.target.dataset?.cacheSource||'')){
            m.target.dataset.cacheHydrated='1';
            return;
          }
          m.target.dataset.cacheHydrated='';
        }
        queueMediaElementHydration(m.target);
        return;
      }`
  },
  {
    search: `    // Stagger src assignments to avoid flooding IPFS gateways (200ms per item)
    setTimeout(()=>{if(img)img.src=it.url;},relIdx*200);
  });`,
    replace: `    // Stagger src assignments to avoid flooding IPFS gateways (200ms per item)
    setTimeout(()=>{if(img&&!extractCidFromUrl(it.url))img.src=it.url;},relIdx*200);
  });`
  },
  {
    search: `    const prev=$('peImgPreview'),img=$('peImgPreviewImg');
    if(prev)prev.classList.remove('hidden');
    if(img){
      const cands=profileImgCandidates(norm_.canonical);
      img.src=cands[0]||norm_.preview||norm_.canonical;
      img.dataset.cands=JSON.stringify([...cands.slice(1),FALLBACK_AVI]);
      img.onerror=()=>window.pi_err(img);
    }`,
    replace: `    const prev=$('peImgPreview'),img=$('peImgPreviewImg');
    if(prev)prev.classList.remove('hidden');
    if(img){
      const cands=profileImgCandidates(norm_.canonical);
      img.src=FALLBACK_AVI;
      img.dataset.cands=JSON.stringify([...cands,FALLBACK_AVI]);
      img.onerror=()=>window.pi_err(img);
    }`
  },
  {
    search: `    const prev=$('peImgPreview'),img=$('peImgPreviewImg');
    if(prev) prev.classList.remove('hidden');
    if(img){
      const cands=profileImgCandidates(uploaded.canonical);
      img.src=cands[0]||uploaded.preview||uploaded.canonical;
      img.dataset.cands=JSON.stringify([...cands.slice(1),FALLBACK_AVI]);
      img.onerror=()=>window.pi_err(img);
    }
    setChip($('peImgBadge'),'Valid','good');
    showStatus(st,'Uploaded and pinned for 1 hour. Preview may take time to appear—please wait before posting. Files over a few MB can take much longer.','warn');
    const previewReady=await waitForIpfsIo(cid);
    if(previewReady){
      if(img){
        const cands=profileImgCandidates(uploaded.canonical);
        img.src=cands[0]||uploaded.preview||uploaded.canonical;
      }
      showStatus(st,\`Preview ready on IPFS · Image set: \${uploaded.canonical.slice(0,80)}\`,'good');
    }
  }catch(e){`,
    replace: `    const prev=$('peImgPreview'),img=$('peImgPreviewImg');
    if(prev) prev.classList.remove('hidden');
    if(img){
      const cands=profileImgCandidates(uploaded.canonical);
      img.src=FALLBACK_AVI;
      img.dataset.cands=JSON.stringify([...cands,FALLBACK_AVI]);
      img.onerror=()=>window.pi_err(img);
    }
    setChip($('peImgBadge'),'Valid','good');
    showStatus(st,'Uploaded and pinned for 1 hour. Preview may take time to appear—please wait before posting. Files over a few MB can take much longer.','warn');
    const previewReady=await waitForIpfsIo(cid);
    if(previewReady){
      showStatus(st,\`Preview ready on IPFS · Image set: \${uploaded.canonical.slice(0,80)}\`,'good');
    }
  }catch(e){`
  }
];

let ok = true;
for (const [i, rep] of replacements.entries()) {
    if (!content.includes(rep.search)) {
        console.error(`Missing replacement search at index ${i}`);
        ok = false;
    }
    content = content.replace(rep.search, rep.replace);
}
if (ok) {
    fs.writeFileSync('index.html', content, 'utf8');
    console.log('Successfully patched index.html');
}
