Plan:
1. Fix `linksHtml` logic in `buildProfilePageEl`:
   Search:
   ```javascript
   const linksHtml=Object.entries(profile.urls||{}).map(([k,v])=>`<a href="\${esc(v)}" target="_blank" rel="noopener" style="color:var(--accent);">🔗 \${esc(k)}</a>`).join(' ');
   ```
   Replace:
   ```javascript
   const linksHtml=Object.entries(profile.urls||{}).map(([k,v])=>{
     if(k.toLowerCase()==='pin') return '';
     if(v.startsWith('@')) return \`<a href="javascript:void(0)" onclick="openUserProfile('\${esc(v.slice(1))}')" style="color:var(--accent);">🔗 \${esc(k)}</a>\`;
     return \`<a href="\${esc(v)}" target="_blank" rel="noopener" style="color:var(--accent);">🔗 \${esc(k)}</a>\`;
   }).filter(Boolean).join(' ');
   ```

2. Add pinned tweets parsing in `renderProfileWithPagination`.
   Search:
   ```javascript
  const pageEl=buildProfilePageEl(profile,official,initialPosts,ownProfile,postCache);
  container.appendChild(pageEl);
  const feedWrap=pageEl.querySelector('[data-profile-feed="1"]');
   ```
   Replace:
   ```javascript
  const pageEl=buildProfilePageEl(profile,official,initialPosts,ownProfile,postCache);
  container.appendChild(pageEl);
  const feedWrap=pageEl.querySelector('[data-profile-feed="1"]');
  if(!feedWrap||isBlockedAddr(profile.addr)) return;
  // Handle pinned tweets
  const pinTxids = Object.entries(profile.urls||{}).filter(([k,v])=>k.toLowerCase()==='pin'&&v.length===64).map(([k,v])=>v.toLowerCase());
  for (const pinTxid of pinTxids) {
    try {
      const pinRoot = await fetchSingleRoot(pinTxid);
      if (pinRoot && pinRoot.txId) {
        const pCache = await buildSenderProfileCache([pinRoot], postCache);
        Object.assign(postCache, pCache||{});

        let el;
        if (pinRoot.fromAddr === profile.creators?.[0] || pinRoot.fromAddr === profile.addr) {
           el = buildTweetEl(pinRoot, {profileCache: postCache});
        } else {
           // Show like a retweet
           const fakeRtRoot = {
               txId: pinRoot.txId + '_rt', // fake id so seen set doesn't skip if we see it later
               fromAddr: profile.addr,
               message: `<<${pinRoot.txId}>>`,
               files: [],
               blockDate: pinRoot.blockDate // keep date or leave blank
           };
           el = buildTweetEl(fakeRtRoot, {profileCache: postCache});
        }
        el.style.borderLeft = '3px solid var(--accent)'; // Optional: some visual indicator of pinning
        const empty=feedWrap.querySelector('.feed-empty');
        if(empty) empty.remove();
        feedWrap.insertBefore(el, feedWrap.firstChild);
        // Maybe ensure we don't duplicate it in the main feed
      }
    } catch (e) {}
  }
   ```
   Wait, if we do `feedWrap.insertBefore(el, feedWrap.firstChild)`, it will insert them in reverse order unless we reverse `pinTxids`. We should probably insert them sequentially, or just use `prepend()` backwards, or just build an array of elements and prepend them. Let's do `pinTxids.reverse()` to prepend them correctly, or better yet, loop forward and insert before the original first child.

Let's check the exact search and replace block for `renderProfileWithPagination`.

Actually, `feedWrap.innerHTML='<div class="feed-empty">No posts yet.</div>';` is done *inside* `buildProfilePageEl`.
If we modify `feedWrap` after `buildProfilePageEl`, that works.

But we have `if(!feedWrap||isBlockedAddr(profile.addr)) return;` right after `container.appendChild(pageEl);` in `renderProfileWithPagination`.

Let's refine the replace for `renderProfileWithPagination`:
```javascript
<<<<<<< SEARCH
  const feedWrap=pageEl.querySelector('[data-profile-feed="1"]');
  if(!feedWrap||isBlockedAddr(profile.addr)) return;
  const seen=new Set(initialPosts.map(r=>r?.txId).filter(Boolean));
=======
  const feedWrap=pageEl.querySelector('[data-profile-feed="1"]');
  if(!feedWrap||isBlockedAddr(profile.addr)) return;

  const seen=new Set(initialPosts.map(r=>r?.txId).filter(Boolean));

  // Handle pinned tweets
  const pinTxids = Object.entries(profile.urls||{}).filter(([k,v])=>k.toLowerCase()==='pin'&&TXID_RE.test(v)).map(([k,v])=>v.toLowerCase());
  for (let i=pinTxids.length-1; i>=0; i--) {
    const pinTxid = pinTxids[i];
    try {
      const pinRoot = await fetchSingleRoot(pinTxid);
      if (pinRoot && pinRoot.txId) {
        seen.add(pinRoot.txId);
        const pCache = await buildSenderProfileCache([pinRoot], postCache);
        Object.assign(postCache, pCache||{});

        let el;
        const profileCreator = norm(profile.creators?.[0] || profile.addr);
        if (norm(pinRoot.fromAddr) === profileCreator) {
           el = buildTweetEl(pinRoot, {profileCache: postCache});
        } else {
           const fakeRtRoot = {
               txId: 'pin_' + pinRoot.txId,
               fromAddr: profile.addr,
               message: `<<${pinRoot.txId}>>`,
               files: []
           };
           el = buildTweetEl(fakeRtRoot, {profileCache: postCache});
        }

        // visual indicator for pin
        const pinIndicator = document.createElement('div');
        pinIndicator.style.cssText = 'font-size:0.8rem;color:var(--muted);margin-bottom:4px;display:flex;align-items:center;gap:4px;padding-left:12px;padding-top:8px;';
        pinIndicator.innerHTML = '📌 Pinned';
        el.insertBefore(pinIndicator, el.firstChild);

        const empty=feedWrap.querySelector('.feed-empty');
        if(empty) empty.remove();
        feedWrap.insertBefore(el, feedWrap.firstChild);
      }
    } catch (e) {}
  }
>>>>>>> REPLACE
```
