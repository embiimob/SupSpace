const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');

const scriptTags = html.match(/<script>([\s\S]*?)<\/script>/g);
if (scriptTags) {
    for (let i = 0; i < scriptTags.length; i++) {
        const scriptContent = scriptTags[i].replace(/<script>/, '').replace(/<\/script>/, '');
        fs.writeFileSync(`/tmp/script_${i}.js`, scriptContent);
        try {
            require('child_process').execSync(`node -c /tmp/script_${i}.js`);
            console.log(`Script ${i} syntax ok`);
        } catch (e) {
            console.log(`Script ${i} syntax error`);
        }
    }
}
