const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');

console.log(html.split('tabBar.innerHTML=`<button class="tab-btn active">Posts</button>`;')[1].substring(0, 1000));
