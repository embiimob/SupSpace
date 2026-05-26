const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');

console.log(html.split('function buildProfilePageEl')[1].substring(0, 1500));
