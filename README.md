# ShelbyData — Decentralized AI Dataset Marketplace

> A full-stack Web3 application built on the [Shelby Network](https://shelby.xyz) and Aptos blockchain, enabling researchers and developers to store, discover, and monetize AI datasets with cryptographic provenance and real-time hot storage.

---

## 🌐 Live Demo

> Deploy to Vercel/Netlify and paste URL here for submission.

## 📺 Demo Video

> Record a Loom walkthrough and paste URL here.

---

## 🧠 Project Overview

ShelbyData is a decentralized AI dataset marketplace leveraging:

- **Shelby Network** — high-performance blob storage with pay-per-read incentives
- **Aptos Blockchain** — on-chain registration, settlement, and economic coordination  
- **Petra Wallet** — seamless Web3 wallet integration for Shelbynet

### The Problem

AI teams today rely on centralized cloud storage (AWS S3, GCS) for dataset hosting:

- **Egress fees** bleed budgets on large-scale training runs
- **No provenance** — you can't verify where data came from or who consented
- **Single point of failure** — vendor lock-in, takedowns, regional restrictions
- **Contributors aren't rewarded** — data creators receive nothing from downstream usage

### The Solution

ShelbyData replaces centralized cloud storage with the Shelby Network:

| Feature | Centralized Cloud | ShelbyData |
|---|---|---|
| Egress fees | Full price | ~70% cheaper |
| Data provenance | None | Cryptographic proof per read |
| Availability | Vendor-dependent | Decentralized SP network |
| Contributor rewards | None | ShelbyUSD per read |
| Censorship resistance | No | Yes |

---

## 🏗️ Architecture

```
User (Browser)
    │
    ├── Petra Wallet (Aptos Testnet / Shelbynet)
    │
    ├── @aptos-labs/wallet-adapter-react
    │       └── signAndSubmitTransaction()
    │               └── Register blob on-chain (Aptos Smart Contract)
    │
    └── @shelby-protocol/sdk/browser
            ├── createDefaultErasureCodingProvider() → WASM erasure coding
            ├── generateCommitments()               → Merkle root hash
            ├── ShelbyBlobClient.createRegisterBlobPayload()
            └── shelbyClient.rpc.putBlob()          → Upload to SP nodes
```

### Upload Flow (3 Steps)

1. **Encode** — File is split into chunks via erasure coding (WASM). Commitment hashes + Merkle root are generated.
2. **Register** — A transaction is submitted to the Aptos smart contract, registering the blob metadata on-chain.
3. **Upload** — The raw file data is uploaded to Shelby RPC nodes, which verify it against the on-chain registration.

### Download Flow

Files are accessible via a deterministic URL pattern:

```
https://api.testnet.shelby.xyz/shelby/v1/blobs/<uploader-address>/<filename>
```

Or via the SDK:
```typescript
await shelbyClient.coordination.getAccountBlobs({ account: address })
```

---

## 🚀 Getting Started

### Prerequisites

| Requirement | Details |
|---|---|
| Node.js | v18+ |
| Petra Wallet | [petra.app](https://petra.app) — Chrome extension |
| Shelbynet | Switch Petra network to **Shelbynet** |
| API Keys | Acquire from [geomi.dev](https://geomi.dev) |
| Test tokens | APT from [Aptos Faucet](https://aptos.dev/network/faucet) + ShelbyUSD from Discord |

### Installation

```bash
# 1. Clone the repo
git clone https://github.com/your-username/shelbydata-marketplace
cd shelbydata-marketplace

# 2. Install dependencies
npm install

# 3. Set up environment variables
cp .env.example .env
# Edit .env and add your API keys from geomi.dev

# 4. Start the dev server
npm run dev
```

Open `http://localhost:5173` in your browser.

### Getting API Keys

1. Visit [geomi.dev](https://geomi.dev) and create an account
2. Click **"API Resource"** on the overview page
3. Set **Network** to `Testnet`
4. Create a **Client** key (for frontend use)
5. Copy the key into your `.env` as `VITE_SHELBY_API_KEY` and `VITE_APTOS_API_KEY`

### Getting Test Tokens

**APT (gas fees):**
```
https://aptos.dev/network/faucet
```

**ShelbyUSD (upload cost — 1 ShelbyUSD per file):**
- Join the [Shelby Discord](https://discord.com/invite/shelbyserves)
- Request testnet ShelbyUSD in the Discord

---

## 📁 Project Structure

```
shelbydata-marketplace/
├── src/
│   ├── components/
│   │   ├── Layout/          # Header, Footer, Layout wrapper
│   │   ├── Upload/          # 3-step upload form with drag-and-drop
│   │   ├── Dashboard/       # User's uploaded datasets
│   │   ├── Marketplace/     # Dataset card + marketplace browser
│   │   ├── WalletButton.tsx # Petra wallet connect/disconnect
│   │   └── ToastContainer.tsx
│   ├── hooks/
│   │   └── useShelby.ts     # Core Shelby operations hook
│   ├── lib/
│   │   ├── aptosClient.ts   # Aptos SDK singleton
│   │   └── shelbyClient.ts  # Shelby SDK factory + helpers
│   ├── pages/               # Route-level components
│   ├── providers/           # WalletProvider, ToastProvider
│   ├── types/               # TypeScript interfaces and enums
│   └── main.tsx
├── .env.example
├── vite.config.ts
├── tailwind.config.js
└── README.md
```

---

## 🔑 Key Features

### ✅ Wallet Integration
- Petra wallet connect/disconnect with network detection
- Auto-connect support
- Truncated address display + copy to clipboard

### ✅ Dataset Upload (3-Step Flow)
- Drag-and-drop or click-to-browse file selection
- Metadata form: name, description, category, tags, license
- Live terminal log during upload with progress bar
- On-chain TX hash displayed and linked

### ✅ Dashboard
- Lists all datasets uploaded from connected wallet
- Stats: total count, total size, active count
- Per-dataset: size, expiry countdown, format, download/view actions

### ✅ Marketplace Browser
- Search any Aptos address to browse their public datasets
- Filter by filename
- Direct download + raw blob URL access

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 + Vite |
| Styling | Tailwind CSS (custom space-terminal theme) |
| Routing | React Router v6 |
| Blockchain | Aptos Testnet |
| Storage | Shelby Network (Shelbynet) |
| SDK | `@shelby-protocol/sdk` (browser) |
| Wallet | `@aptos-labs/wallet-adapter-react` + Petra |
| Types | TypeScript strict mode |

---

## 🌍 Why This Matters for West Africa

Access to high-quality, affordable AI datasets is one of the biggest barriers for AI researchers and developers across Africa. Centralized platforms are expensive, region-restricted, and offer no monetization for local data contributors.

ShelbyData solves this by:
- **Lowering the cost** of dataset access (70% cheaper egress vs cloud)
- **Rewarding local contributors** with ShelbyUSD for their data
- **Removing geographic restrictions** — decentralized storage has no regions
- **Enabling local AI ecosystems** — Nigerian, Ghanaian, and broader African language datasets can be hosted and monetized here

---

## 📜 License

MIT — free to use, fork, and build upon.

---

## 🔗 Resources

- [Shelby Protocol Docs](https://docs.shelby.xyz/protocol)
- [Shelby Explorer](https://explorer.shelby.xyz/shelbynet)
- [Aptos Testnet Faucet](https://aptos.dev/network/faucet)
- [Geomi API Keys](https://geomi.dev)
- [Shelby Discord](https://discord.com/invite/shelbyserves)
- [Petra Wallet](https://petra.app)

---

Built with ❤️ for the Shelby Network Testnet.
