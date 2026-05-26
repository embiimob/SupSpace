const fs = require('fs');

const { JSDOM } = require('jsdom');
const html = fs.readFileSync('/app/index.html', 'utf8');

const dom = new JSDOM(html, { runScripts: "outside-only" });
// We won't fully emulate the browser but we can check if our syntax is correct and everything works conceptually.
// Actually, since we modified index.html, we can run a simple syntax check:
