1. **Fix `linksHtml` logic in `buildProfilePageEl`:**
   - Filter out entries where the key is "pin" (case-insensitive).
   - If the value starts with `@`, render it as a link that calls `openUserProfile(v.slice(1))` instead of a normal href.
   - Example:
     ```javascript
     const linksHtml=Object.entries(profile.urls||{}).map(([k,v])=>{
       if(k.toLowerCase()==='pin') return '';
       if(v.startsWith('@')) return `<a href="javascript:void(0)" onclick="openUserProfile('${esc(v.slice(1))}')" style="color:var(--accent);">🔗 ${esc(k)}</a>`;
       return `<a href="${esc(v)}" target="_blank" rel="noopener" style="color:var(--accent);">🔗 ${esc(k)}</a>`;
     }).filter(Boolean).join(' ');
     ```

2. **Implement pinned tweets logic in `renderProfileWithPagination`:**
   - Before rendering the feed, check `profile.urls` for any key equal to "pin" (case-insensitive) where the value is a valid txid.
   - Fetch the pinned roots using `fetchSingleRoot`.
   - To show like a pinned tweet if signed by the profile creator, or like a retweet otherwise, we can adjust how we render them or how we fetch them. Actually, wait. "show like a retweet... this would allow them to have a pinned experience". If the txid is signed by the profile creator address, it should be treated as a pinned tweet. If not, it should show like a retweet.
   - Wait, `buildTweetEl` handles rendering. We can just add a `isPinned: true` to the root object (or pass an option) if it's signed by the creator, otherwise we can wrap it in a retweet quote slot or something? No, a retweet in this system is just a tweet with a retweet reference. Wait! "show like a retweet" might mean rendering it as a normal quote if not signed by them?
   - Actually, how does the app currently show retweets? `buildTweetEl` checks `hasRetweetRef` and `appendRetweetQuote`. If we want to show it as a retweet, maybe we just wrap the txid in a fake "Retweeted" message or use `isPinned: true` for CSS.
   - Let's look at `buildTweetEl` again.
