import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function kycServices() {
  const services = []

  if (env.PERSONA_API_KEY) {
    services.push(
      custom("persona", {
        baseUrl: "https://withpersona.com/api/v1",
        title: "Persona",
        description: "Identity verification, KYC/AML checks, and document verification.",
        headers: {
          Authorization: `Bearer ${env.PERSONA_API_KEY}`,
          "Persona-Version": "2023-01-05",
          Accept: "application/json",
        },
        routes: {
          "POST /inquiries": mppx.charge({ amount: "0.10" }),
          "GET /inquiries/:id": mppx.charge({ amount: "0.005" }),
          "GET /inquiries": mppx.charge({ amount: "0.005" }),
          "POST /accounts": mppx.charge({ amount: "0.02" }),
          "GET /accounts/:id": mppx.charge({ amount: "0.005" }),
          "GET /verifications/:id": mppx.charge({ amount: "0.005" }),
          "GET /reports/:id": mppx.charge({ amount: "0.01" }),
          "POST /reports": mppx.charge({ amount: "0.10" }),
        },
      }),
    )
  }

  if (env.SARDINE_CLIENT_ID && env.SARDINE_SECRET_KEY) {
    const credentials = btoa(`${env.SARDINE_CLIENT_ID}:${env.SARDINE_SECRET_KEY}`)
    services.push(
      custom("sardine", {
        baseUrl: "https://api.sardine.ai",
        title: "Sardine",
        description: "Fraud detection, risk scoring, and device intelligence.",
        mutate: (req) => {
          req.headers.set("Authorization", `Basic ${credentials}`)
          return req
        },
        routes: {
          "POST /v1/risk-score": mppx.charge({ amount: "0.05" }),
          "POST /v1/customers": mppx.charge({ amount: "0.02" }),
          "GET /v1/customers/:id": mppx.charge({ amount: "0.005" }),
          "POST /v1/devices": mppx.charge({ amount: "0.02" }),
        },
      }),
    )
  }

  if (env.ALLOY_API_KEY) {
    const alloyBase = env.ALLOY_ENV === "sandbox"
      ? "https://sandbox.alloy.co"
      : "https://api.alloy.co"

    services.push(
      custom("alloy", {
        baseUrl: alloyBase,
        title: "Alloy",
        description: "Identity decisioning and compliance automation.",
        bearer: env.ALLOY_API_KEY,
        routes: {
          "POST /v1/evaluations": mppx.charge({ amount: "0.10" }),
          "GET /v1/evaluations/:token": mppx.charge({ amount: "0.005" }),
          "POST /v1/entities": mppx.charge({ amount: "0.02" }),
          "GET /v1/entities/:token": mppx.charge({ amount: "0.005" }),
          "PATCH /v1/entities/:token": mppx.charge({ amount: "0.01" }),
        },
      }),
    )
  }

  if (env.CHAINALYSIS_API_KEY) {
    services.push(
      custom("chainalysis", {
        baseUrl: "https://api.chainalysis.com",
        title: "Chainalysis",
        description: "Blockchain transaction screening and sanctions compliance.",
        headers: { Token: env.CHAINALYSIS_API_KEY },
        routes: {
          "POST /api/kyt/v2/users/:userId/transfers": mppx.charge({ amount: "0.05" }),
          "GET /api/kyt/v2/transfers/:transferId": mppx.charge({ amount: "0.01" }),
          "POST /api/risk/v2/entities": mppx.charge({ amount: "0.05" }),
          "GET /api/risk/v2/entities/:address": mppx.charge({ amount: "0.01" }),
        },
      }),
    )
  }

  if (env.ELLIPTIC_API_KEY && env.ELLIPTIC_API_SECRET) {
    services.push(
      custom("elliptic", {
        baseUrl: "https://aml-api.elliptic.co",
        title: "Elliptic",
        description: "Crypto compliance, wallet screening, and transaction risk scoring.",
        headers: {
          "x-access-key": env.ELLIPTIC_API_KEY,
          "x-access-sign": env.ELLIPTIC_API_SECRET,
        },
        routes: {
          "POST /v2/analyses": mppx.charge({ amount: "0.05" }),
          "GET /v2/analyses/:id": mppx.charge({ amount: "0.01" }),
          "POST /v2/wallet/synchronous": mppx.charge({ amount: "0.10" }),
        },
      }),
    )
  }

  return services
}
