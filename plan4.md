1. **Fix Profile links & Handle Pins on Feed**
   - The user requested two main fixes in `index.html`:
     - Don't display profile links if their label is "pin".
     - URLs that start with `@` should redirect using `openUserProfile(URN)` rather than a standard `href` that goes to `supspace.io/@URN`.
   - On the profile feed, display pinned tweets at the top.
     - A pinned tweet is any link with label "pin" and a valid txid as its value.
     - If the txid is signed by the profile's creator (which usually matches `profile.creators[0]` or `profile.addr`), display it as a normal pinned tweet.
     - If not, display it as a retweet to give a "pinned experience".
     - "Pin as many as are on the profile card".

2. **Actions in `index.html`**:
   - In `buildProfilePageEl()`, modify `linksHtml` map function to:
     - Filter out keys that equal "pin" (case insensitive).
     - If `v.startsWith('@')`, map to a link with `onclick="openUserProfile('${esc(v.slice(1))}')"` and `href="javascript:void(0)"`.
   - In `renderProfileWithPagination()`, load and insert the pinned tweets after appending `pageEl`:
     - Extract `pinTxids` from `profile.urls`.
     - Reverse them to prepend correctly.
     - Fetch each `pinRoot` using `fetchSingleRoot(txid)`.
     - Build `el` based on the condition `pinRoot.fromAddr === profile.creators[0] || pinRoot.addr`. If it matches, normal `buildTweetEl(pinRoot)`. If it doesn't match, wrap it in a mock retweet root.
     - Append to the top of `feedWrap`. Add to `seen` set to avoid duplicates when paginating.

3. **Pre Commit Steps**:
   - Ensure the required checks run successfully.

4. **Submit**:
   - Commit the changes and open PR.
