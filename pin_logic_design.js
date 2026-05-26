/*
The links in the profile card:
- url display label "pin" with txid as value:
  - If txid signed by profile creator address -> pinned tweet, displayed as first tweet(s) on profile feed.
  - If not signed by profile creator address -> show like a retweet.
  - "pin as many as are on the profile card."
  - "only pin them on the social feed. do not display the pinned labels and values as links in the profile card."
- Normal link url values that are @handles:
  - Not interpreted correctly if it starts with @.
  - The link should direct them to that profile @URN (like clicking on a profile link in any thread).
  - Instead of browsing to supspace.io/@URN, it should call openUserProfile('URN').

Let's fix `linksHtml` logic first.
*/
