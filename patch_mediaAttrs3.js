const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const replacements = [
  {
    search: `function mediaAttrs(urls=[]){
  const [first,...rest]=urls.filter(Boolean);
  if(!first) return '';
  const cid = extractCidFromUrl(first);
  if (cid) return \`data-cands="\${esc(JSON.stringify([first, ...rest]))}" onerror="media_fallback(this)" src="\${FALLBACK_AVI}"\`;
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
