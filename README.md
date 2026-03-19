# MPP Gateway

An [MPP](https://mpp.dev)-compliant API gateway that wraps 43 non-MPP services behind Machine Payments Protocol. Pay with stablecoins, access any API — no API keys needed on the client side.

Built for the [MPP Hackathon](https://hackathon.tempo.xyz) by Tempo and Stripe.

## How it works

```
Agent/Client                    MPP Gateway                     Upstream API
     │                              │                               │
     │  GET /stripe/v1/balance      │                               │
     ├─────────────────────────────>│                               │
     │                              │                               │
     │  402 Payment Required        │                               │
     │  WWW-Authenticate: Payment   │                               │
     │<─────────────────────────────┤                               │
     │                              │                               │
     │  GET /stripe/v1/balance      │                               │
     │  Authorization: Payment ...  │                               │
     ├─────────────────────────────>│  GET /v1/balance               │
     │                              │  Authorization: Bearer sk_...  │
     │                              ├──────────────────────────────>│
     │                              │                               │
     │  200 OK                      │  200 OK                       │
     │  Payment-Receipt: ...        │<──────────────────────────────┤
     │<─────────────────────────────┤                               │
```

1. Client requests a route on the gateway
2. Gateway returns `402 Payment Required` with payment challenge
3. Client pays via Tempo stablecoin (automatic with `tempo` CLI or `mppx` SDK)
4. Gateway verifies payment, proxies to upstream API with stored credentials
5. Client receives the response + a `Payment-Receipt` header

## Services (43)

| Category | Services |
|----------|----------|
| **Communications** | Twilio, SendGrid, Postmark, Vonage, AgentMail |
| **Finance** | Stripe, Plaid, Wise, Mercury, Square |
| **Trading / Market Data** | Alpaca, Massive, IEX Cloud |
| **KYC / Compliance** | Persona, Sardine, Alloy, Chainalysis, Elliptic |
| **Accounting** | QuickBooks, Xero, Ramp, Bill.com |
| **On/Off Ramps** | MoonPay, Transak, Bridge, BVNK |
| **Insurance / Lending** | Lemonade, Root Insurance, Lendflow, Codat |
| **Infrastructure** | AWS S3, Cloudflare R2, Vercel, Railway, GitHub |
| **Identity / Auth** | Auth0, Clerk, WorkOS |
| **E-commerce** | Shopify, Printful, Mapbox |
| **Legal** | DocuSign, Notarize |

Services load automatically when their API keys are present in the environment. Missing keys are silently skipped.

### Active for hackathon demo

| Service | Category | Example endpoint |
|---------|----------|-----------------|
| **Stripe** | Finance | `POST /stripe/v1/payment_intents` |
| **Twilio** | Communications | `POST /twilio/2010-04-01/Accounts/:sid/Messages.json` |
| **Plaid** | Finance | `POST /plaid/accounts/balance/get` |
| **Massive** | Market Data | `GET /massive/v3/reference/tickers?ticker=AAPL` |
| **GitHub** | Infrastructure | `GET /github/repos/:owner/:repo` |

## Quick start

```bash
git clone <repo-url>
cd mpp-gateway
npm install
cp .env.example .env
# Fill in your API keys + PAY_TO wallet address
npm run dev
```

```
MPP Gateway running at http://localhost:3000
5 services loaded

Discovery:  http://localhost:3000/discover
LLMs:       http://localhost:3000/llms.txt
All routes: http://localhost:3000/discover/all.md
```

## Test with Tempo CLI

```bash
# Install tempo CLI
curl -fsSL tempo.xyz/install | bash
tempo wallet login

# Free endpoint (no payment)
tempo request -t -X GET http://localhost:3000/massive/v1/marketstatus/now

# Paid endpoint ($0.005 USDC)
tempo request -t -X GET "http://localhost:3000/massive/v3/reference/tickers?ticker=AAPL"
```

## Discovery

The gateway auto-generates MPP-standard discovery endpoints:

| Endpoint | Description |
|----------|-------------|
| `GET /discover` | Service catalog (JSON or markdown) |
| `GET /llms.txt` | LLM-friendly service index |
| `GET /discover/{service}.md` | Per-service routes + pricing |
| `GET /discover/all.md` | Full route listing |

Any MPP client, AI agent, or the Tempo CLI can discover and use services automatically.

## Configuration

### Required environment variables

| Variable | Description |
|----------|-------------|
| `PAY_TO` | Your wallet address to receive payments |
| `MPP_SECRET_KEY` | Secret for signing MPP challenges (`openssl rand -hex 32`) |

### Optional

| Variable | Default | Description |
|----------|---------|-------------|
| `TEMPO_TESTNET` | `true` | `false` for mainnet |
| `PAYMENT_CURRENCY` | Auto (USDC) | Token address for payments |
| `TEMPO_RPC_URL` | Public RPC | Custom Tempo RPC endpoint |
| `PORT` | `3000` | Server port |

See `.env.example` for the full list of service API keys.

## Adding a new service

Each service is ~10 lines in `src/services/<category>.ts`:

```ts
if (env.EXAMPLE_API_KEY) {
  services.push(
    custom("example", {
      baseUrl: "https://api.example.com",
      title: "Example",
      description: "What it does.",
      bearer: env.EXAMPLE_API_KEY,
      routes: {
        "POST /v1/resource": mppx.charge({ amount: "0.01" }),
        "GET /v1/resource": mppx.charge({ amount: "0.005" }),
        "GET /v1/health": true, // free
      },
    }),
  )
}
```

## Stack

- [mppx](https://github.com/wevm/mppx) — TypeScript SDK for Machine Payments Protocol
- [Tempo](https://tempo.xyz) — Payments-first blockchain with sub-second finality
- Node.js + TypeScript

## License

MIT
