import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function financeServices() {
  const services = []

  if (env.STRIPE_SECRET_KEY) {
    services.push(
      custom("stripe", {
        baseUrl: "https://api.stripe.com",
        title: "Stripe",
        description: "Payments, invoices, subscriptions, and payouts.",
        bearer: env.STRIPE_SECRET_KEY,
        routes: {
          "POST /v1/payment_intents": mppx.charge({ amount: "0.05" }),
          "GET /v1/payment_intents": mppx.charge({ amount: "0.005" }),
          "GET /v1/payment_intents/:id": mppx.charge({ amount: "0.005" }),
          "POST /v1/charges": mppx.charge({ amount: "0.05" }),
          "GET /v1/charges": mppx.charge({ amount: "0.005" }),
          "POST /v1/invoices": mppx.charge({ amount: "0.02" }),
          "GET /v1/invoices": mppx.charge({ amount: "0.005" }),
          "POST /v1/invoices/:id/send": mppx.charge({ amount: "0.01" }),
          "POST /v1/customers": mppx.charge({ amount: "0.01" }),
          "GET /v1/customers": mppx.charge({ amount: "0.005" }),
          "GET /v1/customers/:id": mppx.charge({ amount: "0.005" }),
          "POST /v1/subscriptions": mppx.charge({ amount: "0.05" }),
          "GET /v1/subscriptions": mppx.charge({ amount: "0.005" }),
          "POST /v1/payouts": mppx.charge({ amount: "0.10" }),
          "GET /v1/payouts": mppx.charge({ amount: "0.005" }),
          "POST /v1/refunds": mppx.charge({ amount: "0.02" }),
          "GET /v1/balance": mppx.charge({ amount: "0.005" }),
          "POST /v1/products": mppx.charge({ amount: "0.01" }),
          "POST /v1/prices": mppx.charge({ amount: "0.01" }),
          // Stripe Climate
          "GET /v1/climate/products": mppx.charge({ amount: "0.005" }),
          "GET /v1/climate/products/:id": mppx.charge({ amount: "0.005" }),
          "POST /v1/climate/orders": mppx.charge({ amount: "0.10" }),
          "GET /v1/climate/orders": mppx.charge({ amount: "0.005" }),
          "GET /v1/climate/orders/:id": mppx.charge({ amount: "0.005" }),
          "POST /v1/climate/orders/:id/cancel": mppx.charge({ amount: "0.02" }),
        },
      }),
    )
  }

  if (env.PLAID_CLIENT_ID && env.PLAID_SECRET) {
    const plaidEnv = env.PLAID_ENV ?? "sandbox"
    const plaidBase =
      plaidEnv === "production"
        ? "https://production.plaid.com"
        : plaidEnv === "development"
          ? "https://development.plaid.com"
          : "https://sandbox.plaid.com"

    services.push(
      custom("plaid", {
        baseUrl: plaidBase,
        title: "Plaid",
        description: "Bank account linking, balances, and transaction history.",
        headers: {
          "PLAID-CLIENT-ID": env.PLAID_CLIENT_ID,
          "PLAID-SECRET": env.PLAID_SECRET,
          "Content-Type": "application/json",
        },
        routes: {
          "POST /link/token/create": mppx.charge({ amount: "0.005" }),
          "POST /accounts/balance/get": mppx.charge({ amount: "0.01" }),
          "POST /transactions/get": mppx.charge({ amount: "0.02" }),
          "POST /transactions/sync": mppx.charge({ amount: "0.02" }),
          "POST /identity/get": mppx.charge({ amount: "0.02" }),
          "POST /auth/get": mppx.charge({ amount: "0.02" }),
          "POST /item/get": mppx.charge({ amount: "0.005" }),
          "POST /institutions/get_by_id": mppx.charge({ amount: "0.005" }),
          "POST /institutions/search": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.WISE_API_TOKEN) {
    services.push(
      custom("wise", {
        baseUrl: "https://api.transferwise.com",
        title: "Wise",
        description: "International transfers, FX rates, and multi-currency accounts.",
        bearer: env.WISE_API_TOKEN,
        routes: {
          "POST /v1/quotes": mppx.charge({ amount: "0.01" }),
          "GET /v1/quotes/:id": mppx.charge({ amount: "0.005" }),
          "POST /v1/transfers": mppx.charge({ amount: "0.10" }),
          "GET /v1/transfers/:id": mppx.charge({ amount: "0.005" }),
          "GET /v1/exchange-rates": mppx.charge({ amount: "0.005" }),
          "POST /v1/accounts": mppx.charge({ amount: "0.01" }),
          "GET /v4/profiles": mppx.charge({ amount: "0.005" }),
          "GET /v4/profiles/:profileId/balances": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.MERCURY_API_TOKEN) {
    services.push(
      custom("mercury", {
        baseUrl: "https://api.mercury.com",
        title: "Mercury",
        description: "Business banking — accounts, balances, and transactions.",
        bearer: env.MERCURY_API_TOKEN,
        routes: {
          "GET /api/v1/accounts": mppx.charge({ amount: "0.005" }),
          "GET /api/v1/accounts/:id": mppx.charge({ amount: "0.005" }),
          "GET /api/v1/accounts/:id/transactions": mppx.charge({ amount: "0.01" }),
          "POST /api/v1/accounts/:id/transactions": mppx.charge({ amount: "0.10" }),
        },
      }),
    )
  }

  if (env.SQUARE_ACCESS_TOKEN) {
    services.push(
      custom("square", {
        baseUrl: "https://connect.squareup.com",
        title: "Square",
        description: "Payments, invoices, orders, and catalog management.",
        bearer: env.SQUARE_ACCESS_TOKEN,
        routes: {
          "POST /v2/payments": mppx.charge({ amount: "0.05" }),
          "GET /v2/payments": mppx.charge({ amount: "0.005" }),
          "GET /v2/payments/:id": mppx.charge({ amount: "0.005" }),
          "POST /v2/invoices": mppx.charge({ amount: "0.02" }),
          "GET /v2/invoices": mppx.charge({ amount: "0.005" }),
          "POST /v2/orders": mppx.charge({ amount: "0.02" }),
          "GET /v2/catalog/list": mppx.charge({ amount: "0.005" }),
          "POST /v2/customers": mppx.charge({ amount: "0.01" }),
          "GET /v2/customers": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  return services
}
