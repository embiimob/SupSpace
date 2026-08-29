# SupSpace

SupSpace is a local-first, single-file web app (`index.html`) for reading, composing, and interacting with Sup!? social content — posts, profiles, threads, polls, and more — using the p2fk protocol.

- p2fk.io: https://p2fk.io
- SupSpace repository: https://github.com/embiimob/SupSpace
- Live demo: https://supspace.io
- SupRadio (audio): https://suprad.io
- SupTV (video): https://suptv.io

SupSpace is software you run yourself, not a hosted social media company.

## What SupSpace is

SupSpace is a **censorship-resistant** social platform client. When you run it locally — by opening `index.html` directly in your browser — no third party can deplatform your feed, suppress your posts, or block accounts you follow. All social data lives on the Bitcoin testnet3 blockchain and is retrieved through the open p2fk.io API. Point `API_BASE` at your own p2fk node to remove even that dependency.

SupSpace is not a company. There is no central server, no account system, and no operator. Your identity **is** your private key.

## What SupSpace does

SupSpace currently has two main roles:

1. **Reader/feed mode**
   Browses the Sup!? social graph: home feed (posts from followed addresses), community feed, profile pages, thread views, hashtag/keyword search, and mentions.
2. **Composer mode (Compose)**
   Lets you create signed p2fk-compatible posts from the browser using a built-in **testnet3 legacy wallet flow** — including text posts, IPFS/on-chain file attachments, hashtags, @mentions, comments, and lightweight polls.

## Quick start

1. Clone this repo.
2. Open `index.html` in a browser from your cloned repository directory.
3. Import or generate a testnet3 WIF private key in the **Wallet** panel.
4. Open **✎ Compose** to post, or browse feeds directly — no key required to read.

## Posting flow (Compose)

1. **Import/unlock wallet**
   - Uses built-in wallet mode only (`🔑 Built-in (testnet3 legacy)`).
   - Accepts **testnet3 legacy WIF** private keys.
   - Derives a legacy testnet3 sender address (your Sup!? identity).
2. **Create post content**
   - Enter message text (hashtags, @mentions, and poll options supported).
   - Optionally attach an IPFS file (URN, gateway link, or CID-bearing URL) or an on-chain file reference.
   - SupSpace validates attachment reachability and canonicalizes IPFS URNs to `IPFS:<cid>/<filename.ext>`.
3. **Build sendmany payload**
   - Converts post body into DiscoBall/p2fk sendmany-compatible recipient outputs.
   - Signs the required payload hash in-browser.
4. **Build and broadcast BTC tx (testnet3)**
   - Pulls confirmed UTXOs.
   - Estimates fee rate.
   - Builds/signs legacy P2PKH tx.
   - Broadcasts raw hex.

## Testnet3 wallet-like behavior (important)

SupSpace's built-in wallet behavior is intentionally constrained:

- **Network:** testnet3 only (`USE_P2FK_MAINNET = false` by default)
- **Address type:** legacy P2PKH
- **Key type:** WIF private key import/unlock
- **Change model:** two deterministic change addresses are derived from the same root WIF
- **Routing rule:** when a derived change address is the source of selected UTXOs, change is sent to the *opposite* derived address
- **Consolidation support:** change UTXOs can be consolidated back to main address from Compose controls

This keeps the posting flow recoverable from a single root WIF while separating change paths.

### ⚠️ Back up your private key

Your WIF private key **is** your Sup!? identity. If you lose it, you lose access to your address, your profile claim, and any funds on that address. There is no password reset, no recovery email, and no support team.

- Export and store your WIF in a safe, offline location before you do anything else.
- Never share it with anyone or paste it into untrusted software.
- The built-in wallet encrypts the key in `localStorage` with a passphrase — but `localStorage` is not a substitute for a proper backup.

### 🔑 Keys are portable across the Sup ecosystem

The same testnet3 WIF private key works across all Sup apps:

| App | URL | What you can post |
| --- | --- | --- |
| **SupSpace** | https://supspace.io | Social posts, polls, threads, profiles |
| **SupRadio** | https://suprad.io | Audio / music content |
| **SupTV** | https://suptv.io | Video content |

Import the same WIF in any of these apps and your identity (address and profile) is unified across all three. Posts from any app appear in the shared p2fk social graph.

## API calls SupSpace uses and why

### p2fk API (read/search/social graph)

| Endpoint | Purpose in SupSpace |
| --- | --- |
| `GET /GetPublicMessagesByAddress/<address>?mainnet=false` | Pulls posts for a profile timeline or feed address. |
| `GET /GetProfileByAddress/<address>?mainnet=false` | Resolves a Sup!? profile (name, avatar, bio) from an address. |
| `GET /GetProfileByURN/<urn>?mainnet=false` | Resolves a profile from a Sup!? URN handle. |
| `GET /root/<txid>/Root.json` | Fast cached root lookup for direct txid deep-links (`?q=<txid>`). |
| `GET /GetRootByTransactionID/<txid>?mainnet=false` | Fetches a single post/thread root by transaction ID. |
| `GET /GetKnownProfilesBySearchString?searchString=<q>&mainnet=false` | Searches for profiles by name/handle. |
| `GET /GetKnownRootsBySearchString?searchString=*<q>*&mainnet=false&showSystemFiles=false` | Searches posts/content by keyword/hashtag (`searchString=*` for broad cached feed queries). |
| `GET /GetPublicAddressByKeyword/<keyword>?mainnet=false` | Resolves a keyword-channel address. |

### testnet3 chain API (wallet/tx side via mempool.space)

`MEMPOOL_API` default: `https://mempool.space/testnet/api`

| Endpoint | Purpose in SupSpace |
| --- | --- |
| `GET /address/<addr>` | Reads confirmed/unconfirmed balance stats for wallet panels. |
| `GET /address/<addr>/utxo` | Fetches spendable UTXOs (only called if confirmed balance > 0). |
| `GET /v1/fees/recommended` | Gets fee estimates (falls back to default fee rate if unavailable). |
| `POST /tx` (body=`raw tx hex`) | Broadcasts signed legacy transaction for post send or consolidation. |

### IPFS/gateway checks

| Behavior | Purpose in SupSpace |
| --- | --- |
| `HEAD` request to candidate gateway URL (CID-only) | Validates that an attachment URL/URN resolves before adding to post, using only the IPFS CID root URL. |

## Key configuration constants

In `index.html`, adjust:

- `API_BASE` (default: `https://p2fk.io`)
- `MEMPOOL_API` (default: `https://mempool.space/testnet/api`)
- `IPFS_GWS` (gateway list used for media resolution/verification)

## Security and usage notes

- Treat the built-in wallet as a convenience feature for **testnet3** posting workflow, not a production custody solution.
- Use your own trusted API/gateway endpoints if you need stronger privacy/censorship resistance. Running a local p2fk node and pointing `API_BASE` at it eliminates reliance on any third-party infrastructure.
- Public gateways and public APIs can see request metadata; self-hosting reduces third-party visibility.
- The app is fully self-contained in a single HTML file — you can audit every line of code before running it.
