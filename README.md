# ZedKr

**Monetize any API endpoint with x402 payments in seconds, not minutes.**

ZedKr leverages the **x402-stacks protocol** to transform any existing API endpoint into a pay-per-use service with STX payments. Built on the Stacks blockchain, ZedKr makes API monetization as simple as sharing a URL—no code changes, no complex integrations, just instant x402-powered monetization.

---

## The Problem

### Traditional API Monetization is Broken

**For Developers:**
- Complex payment integrations take weeks to implement
- High transaction fees eat into revenue
- No support for micropayments
- Requires account management, subscriptions, and billing infrastructure
- Incompatible with machine-to-machine (M2M) payments for AI agents

**For API Consumers:**
- Manual payment flows break automation
- Account creation friction
- Credit card requirements exclude global users
- No programmatic payment discovery

**The Result:** Most APIs remain free or use clunky subscription models, leaving money on the table and limiting innovation.

---

## The Solution: x402-Stacks Powered Monetization

### What is x402?

x402-stacks is an open payment standard built around **HTTP 402 Payment Required**—a status code that enables services to charge for access directly over HTTP using the Stacks blockchain. It's designed for:

- **Machine-to-machine payments** - AI agents can autonomously pay for API access
- **Agent-to-agent interactions** - AI agents can directly interact with your APIs using private key authentication
- **OpenClaw ready** - Generate skill files for OpenClaw bots to use your APIs automatically
- **Micropayments** - Pay-per-use models without high fees
- **Programmatic payments** - No accounts, no sessions, just HTTP requests
- **STX-native** - Built specifically for the Stacks ecosystem

### How ZedKr Uses x402

ZedKr is built entirely on the **x402-stacks v2 protocol** (Coinbase x402 compatible). Here's how it works:

1. **You register your API** - Point to your existing endpoint, set a price in STX
2. **ZedKr generates a monetized URL** - `https://zedkr.up.railway.app/{username}/{apiName}/{endpoint}` (custom domains coming soon - connect your own domain for branded endpoints)
3. **x402 middleware handles payments** - Every request requires STX payment via x402
4. **Payments go directly to your wallet** - No intermediaries, instant settlement
5. **x402scan discovery** - Your API is automatically discoverable by buyers and AI agents

**The magic:** Your existing API endpoint becomes x402-powered without any code changes. ZedKr handles all the x402 protocol complexity—payment verification, transaction settlement, and request proxying—so you don't have to.

---

## How It Works

**1. Connect Your Wallet** - Link your Stacks wallet (no accounts needed)

**2. Point to Your API** - Enter your existing endpoint URL and set a price in STX

**3. Get Your x402 URL** - ZedKr generates `https://zedkr.up.railway.app/yourname/api/endpoint` (custom domains coming soon)

**4. Start Earning** - Every request requires STX payment via x402. Payments go directly to your wallet.

**That's it.** Your API is now x402-powered. Users make requests with x402-compatible clients, payments are verified on-chain, and you track everything in real-time.

---

## x402-Stacks Integration

### Protocol Details

ZedKr implements the full **x402-stacks v2 specification**:

- **HTTP 402 Payment Required** - Standard status code for payment enforcement
- **x402-stacks v2** - Coinbase x402 compatible protocol
- **CAIP-2 network identifiers** - Industry-standard network format
- **Base64-encoded headers** - Clean, standardized payment headers
- **x402-stacks facilitator** - Payment verification and settlement service

### Payment Flow

```
1. Client requests: GET https://zedkr.up.railway.app/username/api/endpoint
2. Backend responds: 402 Payment Required
   - Includes payment-required header (base64-encoded)
   - Contains payment details: amount, payTo, network
3. Client signs payment with Stacks wallet
4. Client retries with payment-signature header
5. Backend verifies via x402-stacks facilitator
6. Facilitator settles payment on Stacks blockchain
7. Backend proxies request to original API
8. Response includes payment-response header with transaction details
```

### x402scan Registration

Every ZedKr endpoint automatically supports x402scan registration:

- **Schema endpoint:** `https://zedkr.up.railway.app/x402/{username}/{apiName}/{endpointPath}`
- **Returns:** Full x402 v2 schema with outputSchema
- **Discovery:** Register on scan.stacksx402.com for AI agent discovery
- **Compatibility:** Works with all x402-compatible tools and services

---

## Key Features

### ⚡ Instant x402 Monetization
- Transform any API endpoint into an x402-powered service
- No code changes to your existing API
- Set up in under 60 seconds
- Full x402-stacks v2 protocol support

### 💰 Direct STX Payments
- Payments go directly from caller to developer wallet
- Verified and settled via x402-stacks facilitator
- Real-time settlement on Stacks blockchain
- No intermediaries, no platform fees

### 🔒 Blockchain-Verified Security
- All payments verified on Stacks blockchain
- Replay attack protection via transaction hashes
- Stateless payment verification
- Trustless, transparent transactions

### 📊 Real-Time Analytics
- Track every API call with payment details
- Revenue analytics and trends
- Success/failure rates
- Latency monitoring
- Per-endpoint statistics

### 🌐 x402scan Integration
- Automatic API discovery
- x402 schema generation
- Programmatic API registry
- AI agent compatible

### 🎯 Zero Configuration
- Beautiful dashboard UI
- Simple point-and-click setup
- Real-time monitoring
- No technical expertise required

### 🤖 OpenClaw & AI Agent Ready
- Generate OpenClaw skill files directly from your dashboard
- Download ready-to-use skill.md files for your bots
- Private key authentication enables agent-to-agent interactions
- AI agents can autonomously discover and pay for API access
- Upload skill files to OpenClaw to make your APIs accessible to AI agents

---

## Why This Matters

### The x402 Revolution

ZedKr's ease of use is driving widespread x402 adoption across the API ecosystem. By making it possible to monetize any endpoint in seconds—with zero code changes—we're removing the biggest barrier to x402 integration.

**The Impact:**
- **API services are integrating x402** because it's now as simple as pointing to an endpoint
- **No complex implementations** - ZedKr handles all the x402 protocol complexity
- **Instant monetization** - Transform any API into a pay-per-use service immediately
- **Custom domains coming soon** - Connect your own domain instead of using zedkr.up.railway.app URLs

This simplicity is why more and more API services are choosing x402-powered monetization over traditional payment methods.

### Use Cases

**API Developers:**
- Monetize existing APIs without code changes
- Accept micropayments for usage-based services
- Enable AI agents with programmatic payment support
- Track revenue with real-time analytics

**AI Agents & Automation:**
- Programmatically discover and pay for APIs
- No account creation required
- Stateless integration perfect for autonomous agents
- x402-native built for machine-to-machine payments
- **OpenClaw Ready** - Generate skill files for OpenClaw bots to automatically use your APIs
- **Agent-to-Agent** - AI agents can directly interact with your APIs using private key authentication

**Content Creators:**
- Monetize premium data with pay-per-use API access
- Direct wallet-to-wallet transactions
- Global accessibility without credit card requirements
- Instant setup to start earning in seconds

---

## Getting Started

### Prerequisites
- A Stacks wallet (Hiro Wallet, Xverse, or any Stacks-compatible wallet)
- Some STX for testing (get testnet STX from faucet)
- An existing API endpoint you want to monetize

### Quick Start

**1. Connect Your Wallet**
- Visit ZedKr and connect your Stacks wallet
- Your wallet address becomes your account

**2. Create Your First API**
- Click "Create API Project"
- Enter your API name and endpoint URL
- Set your price in STX
- Click "Create"

**3. Share Your Monetized URL**
- Copy your generated URL: `https://zedkr.up.railway.app/yourname/api/endpoint`
- **Coming Soon:** Connect your own custom domain for branded API endpoints
- Share it with users or register on x402scan
- Start earning STX!

### Making Paid Requests

**Using x402-Compatible Client:**
```javascript
import { wrapAxiosWithPayment, privateKeyToAccount } from 'x402-stacks';

const account = privateKeyToAccount(privateKey, 'testnet');
const api = wrapAxiosWithPayment(axios.create(), account);

// Payment handled automatically via x402 protocol
const response = await api.get('https://zedkr.up.railway.app/username/api/endpoint');
```

**The x402 protocol handles:**
- Payment requirement detection
- Wallet signing
- Payment verification
- Transaction settlement
- Request forwarding

---

## x402scan Discovery

Once your endpoint is live, register it with x402scan:

1. Visit your schema endpoint: `https://zedkr.up.railway.app/x402/{username}/{apiName}/{endpointPath}`
2. Copy the URL
3. Submit to [scan.stacksx402.com](https://scan.stacksx402.com)
4. Your API is now discoverable by buyers and AI agents

x402scan will:
- Validate your x402 schema
- Index your API for discovery
- Enable programmatic API finding
- Support AI agent integration

---

## Architecture Overview

### Request Flow

```
Client → ZedKr URL → x402 Payment Check → Stacks Blockchain Verification → Original API → Response
```

**Details:**
1. Client requests monetized URL
2. ZedKr checks for x402 payment signature
3. If missing, returns 402 Payment Required with payment instructions
4. Client signs payment with Stacks wallet
5. Payment verified via x402-stacks facilitator
6. Transaction settled on Stacks blockchain
7. Request proxied to original API
8. Response forwarded to client with payment confirmation

### Data Flow

- **Frontend** - User interface for creating and managing APIs
- **Backend** - x402 payment handling and request proxying
- **Database** - Stores API configurations and call logs
- **Stacks Blockchain** - Payment verification and settlement
- **x402-stacks Facilitator** - Payment verification service

---

## Security

- **Wallet-based authentication** - No passwords, no accounts, just your Stacks wallet
- **Blockchain verification** - All payments verified on Stacks blockchain
- **x402 protocol security** - Built-in replay protection and signature verification
- **HTTPS only** - All endpoints require secure connections
- **Stateless payments** - No session management, every request is independent

---

## Contributing

We welcome contributions! Please see our contributing guidelines for details.

---

## License

MIT License - see LICENSE file for details

---

## Support

- **Documentation:** [docs.zedkr.com](https://docs.zedkr.com)
- **Discord:** [discord.gg/zedkr](https://discord.gg/zedkr)
- **Twitter:** [@zedkr](https://twitter.com/zedkr)

---

**Built on x402-stacks v2 • Powered by Stacks Blockchain**
