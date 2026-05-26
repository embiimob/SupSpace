const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');

const match = html.match(/async function renderProfileWithPagination\([^)]*\)\{([\s\S]*?)const seen=new Set/);
if (match) {
    console.log(match[0].length);
    console.log(match[0]);
}
