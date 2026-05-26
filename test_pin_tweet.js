const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');

// I want to see the first part of renderProfileWithPagination where we can inject pinned tweets
console.log(html.split('async function renderProfileWithPagination')[1].substring(0, 1500));
