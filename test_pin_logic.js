const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');

const match = html.match(/function buildProfilePageEl\([^)]*\)\{([\s\S]*?)return wrap;\s*\}/);
if (match) {
    console.log(match[0].substring(0, 1000));
}
