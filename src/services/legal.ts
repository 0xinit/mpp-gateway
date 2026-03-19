import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function legalServices() {
  const services = []

  if (env.DOCUSIGN_ACCESS_TOKEN && env.DOCUSIGN_ACCOUNT_ID) {
    const docuBase = env.DOCUSIGN_ENV === "demo"
      ? "https://demo.docusign.net/restapi"
      : "https://na4.docusign.net/restapi"
    const accountId = env.DOCUSIGN_ACCOUNT_ID

    services.push(
      custom("docusign", {
        baseUrl: docuBase,
        title: "DocuSign",
        description: "Electronic signatures — send, sign, and manage documents.",
        bearer: env.DOCUSIGN_ACCESS_TOKEN,
        routes: {
          [`POST /v2.1/accounts/${accountId}/envelopes`]: mppx.charge({ amount: "0.10" }),
          [`GET /v2.1/accounts/${accountId}/envelopes`]: mppx.charge({ amount: "0.005" }),
          [`GET /v2.1/accounts/${accountId}/envelopes/:envelopeId`]: mppx.charge({ amount: "0.005" }),
          [`GET /v2.1/accounts/${accountId}/envelopes/:envelopeId/documents`]: mppx.charge({ amount: "0.005" }),
          [`GET /v2.1/accounts/${accountId}/envelopes/:envelopeId/documents/:documentId`]: mppx.charge({ amount: "0.01" }),
          [`GET /v2.1/accounts/${accountId}/envelopes/:envelopeId/recipients`]: mppx.charge({ amount: "0.005" }),
          [`PUT /v2.1/accounts/${accountId}/envelopes/:envelopeId`]: mppx.charge({ amount: "0.02" }),
        },
      }),
    )
  }

  if (env.NOTARIZE_API_KEY) {
    services.push(
      custom("notarize", {
        baseUrl: "https://api.notarize.com",
        title: "Notarize",
        description: "Online notarization — document upload, transaction management.",
        bearer: env.NOTARIZE_API_KEY,
        routes: {
          "POST /v1/transactions": mppx.charge({ amount: "0.50" }),
          "GET /v1/transactions/:id": mppx.charge({ amount: "0.005" }),
          "GET /v1/transactions": mppx.charge({ amount: "0.005" }),
          "POST /v1/documents": mppx.charge({ amount: "0.10" }),
          "GET /v1/documents/:id": mppx.charge({ amount: "0.01" }),
        },
      }),
    )
  }

  return services
}
