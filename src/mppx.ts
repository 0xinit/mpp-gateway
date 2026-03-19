import "dotenv/config"
import { Mppx, tempo } from "mppx/server"
import { createClient, http } from "viem"
import { tempo as tempoMainnet, tempoModerato } from "viem/chains"

const testnet = process.env.TEMPO_TESTNET !== "false"

// Mainnet USDC: 0x20c000000000000000000000b9537d11c60e8b50
// Testnet PathUSD: 0x20c0000000000000000000000000000000000000
const defaultCurrency = testnet
  ? "0x20c0000000000000000000000000000000000000"
  : "0x20c000000000000000000000b9537d11c60e8b50"

const currency = (process.env.PAYMENT_CURRENCY ?? defaultCurrency) as `0x${string}`
const recipient = (process.env.PAY_TO ??
  "0x000000000000000000000000000000000000dEaD") as `0x${string}`

const chain = testnet ? tempoModerato : tempoMainnet
const rpcUrl = process.env.TEMPO_RPC_URL ?? (testnet
  ? "https://rpc.moderato.tempo.xyz"
  : "https://rpc.tempo.xyz")

export const mppx = Mppx.create({
  methods: [
    tempo({
      currency,
      recipient,
      testnet,
      getClient: () => createClient({ chain, transport: http(rpcUrl) }),
    }),
  ],
  secretKey: process.env.MPP_SECRET_KEY ?? "dev-secret-change-me",
})
