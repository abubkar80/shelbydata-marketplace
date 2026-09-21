# ShelbyData — Shelbynet dataset browser

A TypeScript/React dapp that uploads files to the [Shelby Network](https://shelby.xyz) on **Shelbynet**, registers them with the official Shelby/Aptos TypeScript SDKs, and lets you browse committed blobs by wallet address.

This is a Web3 engineering sample: wallet connect, blob encode/register/upload/commit, and a small discovery UI. It is **not** a production marketplace, does **not** include custom Move or Solidity contracts, and does **not** implement paid listings or contributor payouts.

---

## What I built

- **Upload flow** — Petra signs two Shelbynet transactions (register blob, then commit object). App code reads files as `Uint8Array`. A Vite Buffer polyfill is included because `@shelby-protocol/sdk` still references Node `Buffer` in the browser bundle.
- **Listing metadata** — name, description, category, tags, and license are packed into the on-chain blob name so they survive without a backend database.
- **Dashboard** — lists committed objects for the connected wallet.
- **Marketplace** — search any Shelbynet address and filter results by category/text using that stored metadata.

## How to navigate

1. **Upload** (`/upload`) — connect Petra, drop a file, fill metadata, approve both signatures.
2. **Dashboard** (`/dashboard`) — see blobs owned by the connected account.
3. **Marketplace** (`/marketplace`) — paste an uploader address (your own after upload) and filter the public listing.

Home (`/`) is a short explanation of that loop.

---

## Live demo / video

No hosted demo URL is included. Run locally with the steps below.

A walkthrough video is optional; add a Loom (or similar) link here if you record one.

---

## Stack (honest)

| Layer | What this repo uses |
|---|---|
| UI | React 18 + Vite + TypeScript + Tailwind CSS + React Router v6 |
| Wallet | `@aptos-labs/wallet-adapter-react` + Petra (AIP-62) |
| Chain / storage SDKs | `@aptos-labs/ts-sdk` **5.2.1** and `@shelby-protocol/sdk` **0.9.1** (browser) |
| Contracts | Shelby protocol contracts on Shelbynet, via the SDK. **No custom Solidity, and no app-owned Move modules in this repo.** |

Network is **Shelbynet** (`Network.SHELBYNET`), not Aptos public testnet.

---

## What this app does *not* do

- Measure or guarantee “~70% cheaper egress” — that is a Shelby protocol marketing claim, not something this UI computes.
- Pay contributors ShelbyUSD per read, run a storefront checkout, or settle dataset sales.
- Provide a global search index of every blob on the network (you search by uploader address).
- Deploy itself. Clone and run, or deploy your own preview if you want a public URL.

---

## Getting started

### Prerequisites

| Requirement | Details |
|---|---|
| Node.js | v18+ |
| Petra Wallet | [petra.app](https://petra.app) — switch the network to **Shelbynet** |
| API keys | Client keys from [geomi.dev](https://geomi.dev) (runtime only) |
| Test tokens | APT from the [Aptos faucet](https://aptos.dev/network/faucet) and ShelbyUSD via [Shelby Discord](https://discord.com/invite/shelbyserves) |

### Installation

```bash
git clone https://github.com/abubkar80/shelbydata-marketplace
cd shelbydata-marketplace

npm install
cp .env.example .env
# Optional for `npm run build`. Required to talk to Shelby/Aptos at runtime:
# edit .env and set VITE_SHELBY_API_KEY and VITE_APTOS_API_KEY

npm run dev
```

Open `http://localhost:5173`.

`npm install && npm run build` is expected to succeed from the **repo root** with no API keys committed.

### Environment variables

Copy `.env.example` → `.env`. Both variables are Vite-exposed client keys (not server secrets). Use a **Client** key from Geomi; the same key can be used for both if you only have one.

```
VITE_SHELBY_API_KEY=
VITE_APTOS_API_KEY=
```

Never commit a filled `.env`.

### Getting API keys

1. Create an account at [geomi.dev](https://geomi.dev)
2. Create an API resource for **Shelbynet / Testnet** as documented by Geomi
3. Create a **Client** key and paste it into `.env`

---

## Architecture (what the code actually calls)

```
Browser
  ├── Petra (Shelbynet)
  ├── @aptos-labs/wallet-adapter-react
  │     signAndSubmitTransaction()
  │       1. blob_metadata::register_blob
  │       2. blob_metadata::commit_object
  └── @shelby-protocol/sdk/browser
        generateCommitments(Uint8Array)
        rpc.putBlobChunksets()
        index.listObjectsByPrefix()
```

Direct download URL pattern:

```
https://shelby.shelbynet.shelby.xyz/shelby/v1/blobs/<uploader-address>/<blob-name>
```

---

## Project structure

```
shelbydata-marketplace/          # app lives at repo root
├── src/
│   ├── components/              # Layout, Upload, Dashboard, Marketplace
│   ├── hooks/useShelby.ts       # encode → register → put → commit
│   ├── lib/                     # clients, address helpers, metadata packing
│   ├── pages/
│   └── providers/
├── .env.example
├── LICENSE
├── package-lock.json
└── README.md
```

---

## License

MIT. See `LICENSE`.

---

## Resources

- [Shelby Protocol docs](https://docs.shelby.xyz/protocol)
- [Shelby Explorer (Shelbynet)](https://explorer.shelby.xyz/shelbynet)
- [Aptos faucet](https://aptos.dev/network/faucet)
- [Geomi API keys](https://geomi.dev)
- [Shelby Discord](https://discord.com/invite/shelbyserves)
- [Petra Wallet](https://petra.app)
