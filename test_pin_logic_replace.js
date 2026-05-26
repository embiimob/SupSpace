const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');
const search = `  art.innerHTML=\`
    <img class="tweet-avi" \${aviAttrs} alt="\${esc(displayName)}" onclick="openProfileTarget('\${esc(profileTarget)}','\${profileNavMode}')">
    <div class="tweet-body">
      <div class="tweet-header">
        <span class="tweet-name" onclick="openProfileTarget('\${esc(profileTarget)}','\${profileNavMode}')">\${esc(displayName)}</span>
        \${handle?\`<span class="tweet-handle">@\${esc(handle)}</span>\`:\`\`}
        \${root.blockDate?\`<span class="tweet-time">· \${fmtRel(root.blockDate)}</span>\`:\`\`}
        \${pendingBadge}
      </div>`;

if (html.includes(search)) {
    console.log("MATCH FOUND for buildTweetEl");
} else {
    console.log("MATCH NOT FOUND for buildTweetEl");
    console.log("Actual text:");
    console.log(html.substring(html.indexOf('art.innerHTML=`')-50, html.indexOf('art.innerHTML=`')+500));
}
