const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on('console', msg => console.log('BROWSER CONSOLE:', msg.text()));

  let requests = [];
  page.on('request', request => {
    const url = request.url();
    if (url.includes('p2fk.io/ipfs/') || url.includes('filebase.io') || url.includes('pinata.cloud')) {
        requests.push(url);
    }
  });

  await page.goto('http://localhost:3000');
  await page.waitForTimeout(3000);

  const initialRequests = requests.length;
  console.log(`Requests to IPFS gateways so far: ${initialRequests}`);

  requests = [];

  const cid = 'QmUTLRsqsmboBwZtMsakHuXUbrjydMXhutJEwesGNP2Atc';
  await page.evaluate((cid) => window.markCidStale(cid), cid);

  await page.evaluate((cid) => {
    const img = document.createElement('img');
    const url = `https://p2fk.io/ipfs/${cid}`;
    img.dataset.cands = JSON.stringify([url, `https://ipfs.filebase.io/ipfs/${cid}`]);
    // NO src attribute here. This simulates the new behavior.
    document.body.appendChild(img);
  }, cid);

  await page.waitForTimeout(3000);

  const subsequentRequests = requests.length;
  console.log(`Requests to IPFS gateways for explicitly stale CID: ${subsequentRequests}`);

  if (subsequentRequests > 0) {
      console.log("WARNING: IPFS gateways were hit again for a stale CID. The frontend might still be trying to fetch them.");
  } else {
      console.log("SUCCESS: No gateway requests made for stale CID. Caching/Stale tracking is working.");
  }

  await browser.close();
})();
