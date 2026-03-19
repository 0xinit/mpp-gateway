import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function accountingServices() {
  const services = []

  if (env.QUICKBOOKS_ACCESS_TOKEN && env.QUICKBOOKS_REALM_ID) {
    const qbBase = env.QUICKBOOKS_ENV === "sandbox"
      ? "https://sandbox-quickbooks.api.intuit.com"
      : "https://quickbooks.api.intuit.com"
    const realmId = env.QUICKBOOKS_REALM_ID

    services.push(
      custom("quickbooks", {
        baseUrl: qbBase,
        title: "QuickBooks",
        description: "Accounting — invoices, payments, customers, and financial reports.",
        bearer: env.QUICKBOOKS_ACCESS_TOKEN,
        routes: {
          [`POST /v3/company/${realmId}/invoice`]: mppx.charge({ amount: "0.02" }),
          [`GET /v3/company/${realmId}/invoice/:id`]: mppx.charge({ amount: "0.005" }),
          [`POST /v3/company/${realmId}/payment`]: mppx.charge({ amount: "0.02" }),
          [`GET /v3/company/${realmId}/payment/:id`]: mppx.charge({ amount: "0.005" }),
          [`POST /v3/company/${realmId}/customer`]: mppx.charge({ amount: "0.01" }),
          [`GET /v3/company/${realmId}/customer/:id`]: mppx.charge({ amount: "0.005" }),
          [`GET /v3/company/${realmId}/companyinfo/${realmId}`]: mppx.charge({ amount: "0.005" }),
          [`POST /v3/company/${realmId}/query`]: mppx.charge({ amount: "0.01" }),
        },
      }),
    )
  }

  if (env.XERO_ACCESS_TOKEN) {
    services.push(
      custom("xero", {
        baseUrl: "https://api.xero.com",
        title: "Xero",
        description: "Cloud accounting — invoices, contacts, and bank transactions.",
        bearer: env.XERO_ACCESS_TOKEN,
        routes: {
          "GET /api.xro/2.0/Invoices": mppx.charge({ amount: "0.005" }),
          "POST /api.xro/2.0/Invoices": mppx.charge({ amount: "0.02" }),
          "GET /api.xro/2.0/Invoices/:id": mppx.charge({ amount: "0.005" }),
          "GET /api.xro/2.0/Contacts": mppx.charge({ amount: "0.005" }),
          "POST /api.xro/2.0/Contacts": mppx.charge({ amount: "0.01" }),
          "GET /api.xro/2.0/BankTransactions": mppx.charge({ amount: "0.005" }),
          "GET /api.xro/2.0/Accounts": mppx.charge({ amount: "0.005" }),
          "GET /api.xro/2.0/Organisation": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.RAMP_API_KEY) {
    services.push(
      custom("ramp", {
        baseUrl: "https://api.ramp.com",
        title: "Ramp",
        description: "Corporate cards, expense management, and spend tracking.",
        bearer: env.RAMP_API_KEY,
        routes: {
          "GET /developer/v1/transactions": mppx.charge({ amount: "0.005" }),
          "GET /developer/v1/transactions/:id": mppx.charge({ amount: "0.005" }),
          "GET /developer/v1/cards": mppx.charge({ amount: "0.005" }),
          "POST /developer/v1/cards": mppx.charge({ amount: "0.02" }),
          "GET /developer/v1/departments": mppx.charge({ amount: "0.005" }),
          "GET /developer/v1/users": mppx.charge({ amount: "0.005" }),
          "GET /developer/v1/reimbursements": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.BILLCOM_API_KEY) {
    const billBase = env.BILLCOM_ENV === "sandbox"
      ? "https://api-sandbox.bill.com"
      : "https://api.bill.com"

    services.push(
      custom("billcom", {
        baseUrl: billBase,
        title: "Bill.com",
        description: "Accounts payable/receivable automation and vendor payments.",
        bearer: env.BILLCOM_API_KEY,
        routes: {
          "POST /v3/invoices": mppx.charge({ amount: "0.02" }),
          "GET /v3/invoices": mppx.charge({ amount: "0.005" }),
          "GET /v3/invoices/:id": mppx.charge({ amount: "0.005" }),
          "POST /v3/bills": mppx.charge({ amount: "0.02" }),
          "GET /v3/bills": mppx.charge({ amount: "0.005" }),
          "POST /v3/payments": mppx.charge({ amount: "0.10" }),
          "GET /v3/payments": mppx.charge({ amount: "0.005" }),
          "GET /v3/vendors": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  return services
}
