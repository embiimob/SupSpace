// Test what happens if the txid has spaces or mixed case
const profile = { urls: { "PIN": " 0x95239F3e8f395bB787EC9A0f475E830C6848FDFD " } };
const norm = (s) => (s||'').trim();
const TXID_RE = /^[0-9a-fA-F]{64}$/;

const pinTxids = Object.entries(profile.urls||{})
    .filter(([k,v]) => k.trim().toLowerCase() === 'pin' && TXID_RE.test(v.trim()))
    .map(([k,v]) => v.trim().toLowerCase());

console.log(pinTxids);
