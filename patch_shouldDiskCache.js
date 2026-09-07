const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const replacements = [
  {
    search: `function shouldDiskCacheMediaUrl(raw=''){
  try{
    const u=new URL(raw);
    if(!/^https?:$/i.test(u.protocol)) return false;
    if(u.pathname.includes('/ipfs/')) return true;
    return /\\.ipfs\\./i.test(u.hostname);
  }catch{
    return false;
  }
}`,
    replace: `function shouldDiskCacheMediaUrl(raw=''){
  try{
    const u=new URL(raw);
    if(!/^https?:$/i.test(u.protocol)) return false;
    if(u.pathname.includes('/ipfs/')) return true;
    return /\\.ipfs\\./i.test(u.hostname);
  }catch{
    return false;
  }
}
function filterStaleCandidates(cands) {
  return cands.filter(src => {
    const cid = extractCidFromUrl(src);
    return !(cid && isCidStale(cid));
  });
}`
  },
  {
    search: `function mediaElementCandidates(el){
  const out=[],seen=new Set();
  const add=v=>{
    const t=norm(v);
    if(!t||seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  add(el?.dataset?.cacheSource||'');
  add(el?.getAttribute?.('src')||'');
  add(el?.src||'');
  try{
    const cands=JSON.parse(el?.dataset?.cands||'[]');
    if(Array.isArray(cands)) cands.forEach(add);
  }catch{}
  return out.filter(shouldDiskCacheMediaUrl);
}`,
    replace: `function mediaElementCandidates(el){
  const out=[],seen=new Set();
  const add=v=>{
    const t=norm(v);
    if(!t||seen.has(t)) return;
    seen.add(t);
    out.push(t);
  };
  add(el?.dataset?.cacheSource||'');
  add(el?.getAttribute?.('src')||'');
  add(el?.src||'');
  try{
    const cands=JSON.parse(el?.dataset?.cands||'[]');
    if(Array.isArray(cands)) cands.forEach(add);
  }catch{}
  return filterStaleCandidates(out.filter(shouldDiskCacheMediaUrl));
}`
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
