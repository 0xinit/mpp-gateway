import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function onrampServices() {
  const services = []

  if (env.MOONPAY_API_KEY) {
    services.push(
      custom("moonpay", {
        baseUrl: "https://api.moonpay.com",
        title: "MoonPay",
        description: "Fiat-to-crypto on-ramp — buy and sell crypto with cards and bank transfers.",
        mutate: (req) => {
          const url = new URL(req.url)
          url.searchParams.set("apiKey", env.MOONPAY_API_KEY!)
          return new Request(url, req)
        },
        routes: {
          "GET /v3/currencies": mppx.charge({ amount: "0.005" }),
          "GET /v3/currencies/:code": mppx.charge({ amount: "0.005" }),
          "GET /v4/buy_quote": mppx.charge({ amount: "0.01" }),
          "GET /v4/sell_quote": mppx.charge({ amount: "0.01" }),
          "POST /v4/transactions": mppx.charge({ amount: "0.10" }),
          "GET /v4/transactions/:id": mppx.charge({ amount: "0.005" }),
          "GET /v3/ip_address": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.TRANSAK_API_KEY) {
    services.push(
      custom("transak", {
        baseUrl: "https://api.transak.com",
        title: "Transak",
        description: "Crypto on/off ramp with global coverage and compliance.",
        headers: {
          "X-API-KEY": env.TRANSAK_API_KEY,
          Accept: "application/json",
        },
        routes: {
          "GET /api/v2/currencies/crypto-currencies": mppx.charge({ amount: "0.005" }),
          "GET /api/v2/currencies/fiat-currencies": mppx.charge({ amount: "0.005" }),
          "GET /api/v2/currencies/price": mppx.charge({ amount: "0.01" }),
          "POST /api/v2/orders": mppx.charge({ amount: "0.10" }),
          "GET /api/v2/orders/:id": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.BRIDGE_API_KEY) {
    services.push(
      custom("bridge", {
        baseUrl: "https://api.bridge.xyz",
        title: "Bridge",
        description: "Stablecoin orchestration and fiat-to-crypto infrastructure by Stripe.",
        headers: {
          "Api-Key": env.BRIDGE_API_KEY,
          Accept: "application/json",
        },
        routes: {
          "POST /v0/transfers": mppx.charge({ amount: "0.10" }),
          "GET /v0/transfers/:id": mppx.charge({ amount: "0.005" }),
          "GET /v0/transfers": mppx.charge({ amount: "0.005" }),
          "POST /v0/customers": mppx.charge({ amount: "0.02" }),
          "GET /v0/customers/:id": mppx.charge({ amount: "0.005" }),
          "GET /v0/supported/chains": true,
          "GET /v0/supported/currencies": true,
          "POST /v0/liquidity_networks/quotes": mppx.charge({ amount: "0.01" }),
        },
      }),
    )
  }

  if (env.BVNK_API_KEY) {
    services.push(
      custom("bvnk", {
        baseUrl: "https://api.bvnk.com",
        title: "BVNK",
        description: "Multi-currency treasury and stablecoin settlement for business.",
        bearer: env.BVNK_API_KEY,
        routes: {
          "POST /api/v1/pay/summary": mppx.charge({ amount: "0.05" }),
          "GET /api/v1/pay/summary/:uuid": mppx.charge({ amount: "0.005" }),
          "PUT /api/v1/pay/summary/:uuid": mppx.charge({ amount: "0.02" }),
          "GET /api/v1/merchant/balances": mppx.charge({ amount: "0.005" }),
          "GET /api/v1/currency/supported": true,
        },
      }),
    )
  }

  return services
}
