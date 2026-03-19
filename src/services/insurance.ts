import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function insuranceServices() {
  const services = []

  if (env.LEMONADE_API_KEY) {
    services.push(
      custom("lemonade", {
        baseUrl: "https://api.lemonade.com",
        title: "Lemonade",
        description: "Insurance quotes, policy creation, and claims management.",
        bearer: env.LEMONADE_API_KEY,
        routes: {
          "POST /api/v1/quotes": mppx.charge({ amount: "0.02" }),
          "GET /api/v1/quotes/:id": mppx.charge({ amount: "0.005" }),
          "POST /api/v1/policies": mppx.charge({ amount: "0.10" }),
          "GET /api/v1/policies/:id": mppx.charge({ amount: "0.005" }),
          "POST /api/v1/claims": mppx.charge({ amount: "0.05" }),
          "GET /api/v1/claims/:id": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.ROOT_API_KEY) {
    const rootBase = env.ROOT_ENV === "sandbox"
      ? "https://sandbox.root.co.za/v1"
      : "https://api.root.co.za/v1"

    services.push(
      custom("root-insurance", {
        baseUrl: rootBase,
        title: "Root Insurance",
        description: "Embedded insurance — quotes, applications, policies, and claims.",
        bearer: env.ROOT_API_KEY,
        routes: {
          "POST /quotes": mppx.charge({ amount: "0.02" }),
          "GET /quotes/:id": mppx.charge({ amount: "0.005" }),
          "POST /applications": mppx.charge({ amount: "0.05" }),
          "GET /applications/:id": mppx.charge({ amount: "0.005" }),
          "GET /policies": mppx.charge({ amount: "0.005" }),
          "GET /policies/:id": mppx.charge({ amount: "0.005" }),
          "POST /claims": mppx.charge({ amount: "0.05" }),
          "GET /claims/:id": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.LENDFLOW_API_KEY) {
    services.push(
      custom("lendflow", {
        baseUrl: "https://api.lendflow.com",
        title: "Lendflow",
        description: "Embedded lending, credit decisioning, and loan origination.",
        bearer: env.LENDFLOW_API_KEY,
        routes: {
          "POST /v1/applications": mppx.charge({ amount: "0.10" }),
          "GET /v1/applications/:id": mppx.charge({ amount: "0.005" }),
          "GET /v1/applications": mppx.charge({ amount: "0.005" }),
          "POST /v1/credit-decisions": mppx.charge({ amount: "0.10" }),
          "GET /v1/credit-decisions/:id": mppx.charge({ amount: "0.005" }),
          "POST /v1/offers": mppx.charge({ amount: "0.05" }),
        },
      }),
    )
  }

  if (env.CODAT_API_KEY) {
    const credentials = btoa(`${env.CODAT_API_KEY}:`)
    services.push(
      custom("codat", {
        baseUrl: "https://api.codat.io",
        title: "Codat",
        description: "Unified accounting, banking, and commerce data for underwriting.",
        mutate: (req) => {
          req.headers.set("Authorization", `Basic ${credentials}`)
          return req
        },
        routes: {
          "POST /companies": mppx.charge({ amount: "0.02" }),
          "GET /companies": mppx.charge({ amount: "0.005" }),
          "GET /companies/:companyId": mppx.charge({ amount: "0.005" }),
          "GET /companies/:companyId/data/balanceSheet": mppx.charge({ amount: "0.02" }),
          "GET /companies/:companyId/data/profitAndLoss": mppx.charge({ amount: "0.02" }),
          "GET /companies/:companyId/data/accounts": mppx.charge({ amount: "0.01" }),
          "GET /companies/:companyId/data/invoices": mppx.charge({ amount: "0.01" }),
          "GET /companies/:companyId/data/bankAccounts": mppx.charge({ amount: "0.01" }),
        },
      }),
    )
  }

  return services
}
