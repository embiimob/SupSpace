const fs = require('fs');
let content = fs.readFileSync('index.html', 'utf8');

const replacements = [
  {
    search: `function renderAttachEl(token){
  const wrap=document.createElement('div');
  const info=attachmentPreviewCandidates(token),preview=info.urls[0]||'',attrs=mediaAttrs(info.urls);
  if(preview&&info.kind==='image'){wrap.className='tweet-media';wrap.innerHTML=\`<img \${attrs} alt="Attachment">\`;}
  else if(preview&&info.kind==='audio'){wrap.className='tweet-media';wrap.innerHTML=\`<audio controls \${attrs}></audio>\`;}
  else if(preview&&info.kind==='video'){wrap.className='tweet-media';wrap.innerHTML=\`<video controls playsinline webkit-playsinline preload="auto" \${attrs} style="width:100%"></video>\`;}
  else if(preview&&info.kind==='embed'){wrap.className='tweet-media tweet-media-embed';wrap.innerHTML=\`<iframe src="\${esc(preview)}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe>\`;}
  else if(preview&&info.kind==='link'){wrap.className='link-card-slot';wrap.dataset.url=preview;loadLinkCards(wrap.parentElement||wrap);}
  else if(preview){wrap.className='tweet-media-file';wrap.innerHTML=\`📎 <a href="\${esc(preview)}" target="_blank" rel="noopener">\${esc(info.raw.slice(0,60))}</a>\`;}
  else{wrap.className='tweet-media-file';wrap.innerHTML=\`📎 <span class="mono">\${esc(info.raw.slice(0,80))}</span>\`;}
  return wrap;
}`,
    replace: `function renderAttachEl(token){
  const wrap=document.createElement('div');
  const info=attachmentPreviewCandidates(token),preview=info.urls[0]||'',attrs=mediaAttrs(info.urls);
  if(preview&&info.kind==='image'){wrap.className='tweet-media';wrap.innerHTML=\`<img \${attrs} alt="Attachment" \${extractCidFromUrl(preview)?\`src="\${FALLBACK_AVI}"\`:''}>\`;}
  else if(preview&&info.kind==='audio'){wrap.className='tweet-media';wrap.innerHTML=\`<audio controls \${attrs}></audio>\`;}
  else if(preview&&info.kind==='video'){wrap.className='tweet-media';wrap.innerHTML=\`<video controls playsinline webkit-playsinline preload="auto" \${attrs} style="width:100%"></video>\`;}
  else if(preview&&info.kind==='embed'){wrap.className='tweet-media tweet-media-embed';wrap.innerHTML=\`<iframe src="\${esc(preview)}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe>\`;}
  else if(preview&&info.kind==='link'){wrap.className='link-card-slot';wrap.dataset.url=preview;loadLinkCards(wrap.parentElement||wrap);}
  else if(preview){wrap.className='tweet-media-file';wrap.innerHTML=\`📎 <a href="\${esc(preview)}" target="_blank" rel="noopener">\${esc(info.raw.slice(0,60))}</a>\`;}
  else{wrap.className='tweet-media-file';wrap.innerHTML=\`📎 <span class="mono">\${esc(info.raw.slice(0,80))}</span>\`;}
  return wrap;
}`
  },
  {
      search: `  const mediaHtml=[];
  [...attachments,...root.files.map(f=>\`\${root.txId}/\${f}\`),...links].forEach(tok=>{
    const info=attachmentPreviewCandidates(tok),preview=info.urls[0]||'',attrs=mediaAttrs(info.urls);
    if(preview&&info.kind==='image') mediaHtml.push(\`<div class="tweet-media"><img \${attrs} alt=""></div>\`);
    else if(preview&&info.kind==='audio') mediaHtml.push(\`<div class="tweet-media"><audio controls \${attrs}></audio></div>\`);
    else if(preview&&info.kind==='video') mediaHtml.push(\`<div class="tweet-media"><video controls playsinline webkit-playsinline preload="auto" \${attrs} style="width:100%"></video></div>\`);
    else if(preview&&info.kind==='embed') mediaHtml.push(\`<div class="tweet-media tweet-media-embed"><iframe src="\${esc(preview)}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe></div>\`);
    else if(preview&&info.kind==='link') mediaHtml.push(\`<div class="link-card-slot" data-url="\${esc(preview)}"></div>\`);
    else if(preview) mediaHtml.push(\`<div class="tweet-media-file">📎 <a href="\${esc(preview)}" target="_blank" rel="noopener">\${esc(tok.slice(0,60))}</a></div>\`);
  });`,
      replace: `  const mediaHtml=[];
  [...attachments,...root.files.map(f=>\`\${root.txId}/\${f}\`),...links].forEach(tok=>{
    const info=attachmentPreviewCandidates(tok),preview=info.urls[0]||'',attrs=mediaAttrs(info.urls);
    if(preview&&info.kind==='image') mediaHtml.push(\`<div class="tweet-media"><img \${attrs} alt="" \${extractCidFromUrl(preview)?\`src="\${FALLBACK_AVI}"\`:''}></div>\`);
    else if(preview&&info.kind==='audio') mediaHtml.push(\`<div class="tweet-media"><audio controls \${attrs}></audio></div>\`);
    else if(preview&&info.kind==='video') mediaHtml.push(\`<div class="tweet-media"><video controls playsinline webkit-playsinline preload="auto" \${attrs} style="width:100%"></video></div>\`);
    else if(preview&&info.kind==='embed') mediaHtml.push(\`<div class="tweet-media tweet-media-embed"><iframe src="\${esc(preview)}" frameborder="0" allowfullscreen allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" loading="lazy"></iframe></div>\`);
    else if(preview&&info.kind==='link') mediaHtml.push(\`<div class="link-card-slot" data-url="\${esc(preview)}"></div>\`);
    else if(preview) mediaHtml.push(\`<div class="tweet-media-file">📎 <a href="\${esc(preview)}" target="_blank" rel="noopener">\${esc(tok.slice(0,60))}</a></div>\`);
  });`
  },
  {
      search: `  S.composeAttachments.forEach((tok,i)=>{
    const item=document.createElement('div');item.className='cm-attach-item';
    const info=attachmentPreviewCandidates(tok),preview=info.urls[0]||'',attrs=mediaAttrs(info.urls);
    if(preview&&info.kind==='image') item.innerHTML=\`<img \${attrs} alt=""><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    else if(preview&&info.kind==='audio') item.innerHTML=\`<audio controls \${attrs}></audio><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    else if(preview&&info.kind==='video') item.innerHTML=\`<video controls playsinline webkit-playsinline preload="auto" \${attrs} style="max-height:100px;width:100%"></video><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    else if(info.kind==='retweet') item.innerHTML=\`<div class="cm-attach-text">🔁 \${esc(norm(tok).slice(0,60))}</div><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    else item.innerHTML=\`<div class="cm-attach-text">\${esc(norm(tok).slice(0,60))}</div><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    prev.appendChild(item);
  });`,
      replace: `  S.composeAttachments.forEach((tok,i)=>{
    const item=document.createElement('div');item.className='cm-attach-item';
    const info=attachmentPreviewCandidates(tok),preview=info.urls[0]||'',attrs=mediaAttrs(info.urls);
    if(preview&&info.kind==='image') item.innerHTML=\`<img \${attrs} alt="" \${extractCidFromUrl(preview)?\`src="\${FALLBACK_AVI}"\`:''}><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    else if(preview&&info.kind==='audio') item.innerHTML=\`<audio controls \${attrs}></audio><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    else if(preview&&info.kind==='video') item.innerHTML=\`<video controls playsinline webkit-playsinline preload="auto" \${attrs} style="max-height:100px;width:100%"></video><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    else if(info.kind==='retweet') item.innerHTML=\`<div class="cm-attach-text">🔁 \${esc(norm(tok).slice(0,60))}</div><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    else item.innerHTML=\`<div class="cm-attach-text">\${esc(norm(tok).slice(0,60))}</div><button class="cm-attach-rm" onclick="removeAttach(\${i})">✕</button>\`;
    prev.appendChild(item);
  });`
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
