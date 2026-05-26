const fs = require('fs');
const html = fs.readFileSync('/app/index.html', 'utf8');

// The issue states: "a profile url display label that says pin with a transaction id as it's value should be treated as a pinned tweet and be displayed as their first tweet on their profile feed if the transaction id was signed by the profile's creator address...if not it should show like a retweet... this would allow them to have a pinned experience.... pin as many as are on the profile card. only pin them on the social feed. do not display the pinned labels and values as links in the profile card."
