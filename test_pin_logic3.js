const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');

const match = html.match(/async function renderProfileWithPagination\([^)]*\)\{([\s\S]*?)clr\(container\);/);
if (match) {
    console.log(match[0]);
}
