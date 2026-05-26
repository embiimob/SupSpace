const profile = { urls: { "PIN": " 0x95239F3e8f395bB787EC9A0f475E830C6848FDFD ".trim().replace(/^0x/i, '') } };
const norm = (s) => (s||'').trim();
const TXID_RE = /^[0-9a-fA-F]{64}$/;

const getPinValue = (v) => {
    let cleaned = v.trim().toLowerCase();
    if (cleaned.startsWith('0x')) {
        cleaned = cleaned.slice(2);
    }
    return cleaned;
};

const pinTxids = Object.entries(profile.urls||{})
    .filter(([k,v]) => k.trim().toLowerCase() === 'pin' && TXID_RE.test(getPinValue(v)))
    .map(([k,v]) => getPinValue(v));

console.log(pinTxids);
