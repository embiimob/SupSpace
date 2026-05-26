const urls = {
    "twitter": "https://twitter.com/embii4u",
    "pin": "0x95239F3e8f395bB787EC9A0f475E830C6848FDFD",
    "Sup Release of XEN03": "@xen03"
};

const esc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#039;');

const linksHtml = Object.entries(urls||{}).map(([k,v])=> {
    if (k.toLowerCase() === 'pin') {
        // don't show pinned links here
        return '';
    } else if (v.startsWith('@')) {
        return `<a href="javascript:void(0);" onclick="openUserProfile('${esc(v.slice(1))}')" style="color:var(--accent);">🔗 ${esc(k)}</a>`;
    } else {
        return `<a href="${esc(v)}" target="_blank" rel="noopener" style="color:var(--accent);">🔗 ${esc(k)}</a>`;
    }
}).filter(Boolean).join(' ');

console.log(linksHtml);
