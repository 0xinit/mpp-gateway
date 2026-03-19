import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function communicationServices() {
  const services = []

  if (env.TWILIO_ACCOUNT_SID && env.TWILIO_AUTH_TOKEN) {
    const credentials = btoa(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`)
    services.push(
      custom("twilio", {
        baseUrl: "https://api.twilio.com",
        title: "Twilio",
        description: "SMS, voice calls, and messaging APIs.",
        mutate: (req) => {
          req.headers.set("Authorization", `Basic ${credentials}`)
          return req
        },
        routes: {
          "POST /2010-04-01/Accounts/:sid/Messages.json": mppx.charge({ amount: "0.01" }),
          "GET /2010-04-01/Accounts/:sid/Messages.json": mppx.charge({ amount: "0.005" }),
          "POST /2010-04-01/Accounts/:sid/Calls.json": mppx.charge({ amount: "0.02" }),
          "GET /2010-04-01/Accounts/:sid/Calls.json": mppx.charge({ amount: "0.005" }),
          "GET /2010-04-01/Accounts/:sid/Usage/Records.json": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.SENDGRID_API_KEY) {
    services.push(
      custom("sendgrid", {
        baseUrl: "https://api.sendgrid.com",
        title: "SendGrid",
        description: "Transactional and marketing email delivery.",
        bearer: env.SENDGRID_API_KEY,
        routes: {
          "POST /v3/mail/send": mppx.charge({ amount: "0.005" }),
          "GET /v3/messages": mppx.charge({ amount: "0.005" }),
          "GET /v3/stats": mppx.charge({ amount: "0.005" }),
          "GET /v3/templates": mppx.charge({ amount: "0.005" }),
          "POST /v3/templates": mppx.charge({ amount: "0.01" }),
          "GET /v3/suppression/bounces": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.POSTMARK_SERVER_TOKEN) {
    services.push(
      custom("postmark", {
        baseUrl: "https://api.postmarkapp.com",
        title: "Postmark",
        description: "Transactional email with delivery tracking.",
        headers: {
          "X-Postmark-Server-Token": env.POSTMARK_SERVER_TOKEN,
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        routes: {
          "POST /email": mppx.charge({ amount: "0.005" }),
          "POST /email/batch": mppx.charge({ amount: "0.02" }),
          "GET /messages/outbound": mppx.charge({ amount: "0.005" }),
          "GET /stats/outbound": mppx.charge({ amount: "0.005" }),
          "GET /bounces": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.VONAGE_API_KEY && env.VONAGE_API_SECRET) {
    services.push(
      custom("vonage", {
        baseUrl: "https://api.vonage.com",
        title: "Vonage",
        description: "SMS, voice, and messaging APIs.",
        mutate: (req) => {
          req.headers.set("Authorization", `Basic ${btoa(`${env.VONAGE_API_KEY}:${env.VONAGE_API_SECRET}`)}`)
          return req
        },
        routes: {
          "POST /v1/messages": mppx.charge({ amount: "0.01" }),
          "POST /v1/calls": mppx.charge({ amount: "0.02" }),
          "GET /v1/calls": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.AGENTMAIL_API_KEY) {
    services.push(
      custom("agentmail", {
        baseUrl: "https://mpp.api.agentmail.to",
        title: "AgentMail",
        description: "Email inboxes for AI agents — send, receive, threads, and domains.",
        bearer: env.AGENTMAIL_API_KEY,
        routes: {
          "POST /v0/inboxes": mppx.charge({ amount: "0.02" }),
          "GET /v0/inboxes": mppx.charge({ amount: "0.005" }),
          "GET /v0/inboxes/:inbox_id": mppx.charge({ amount: "0.005" }),
          "PATCH /v0/inboxes/:inbox_id": mppx.charge({ amount: "0.005" }),
          "DELETE /v0/inboxes/:inbox_id": mppx.charge({ amount: "0.005" }),
          "POST /v0/inboxes/:inbox_id/messages/send": mppx.charge({ amount: "0.01" }),
          "GET /v0/inboxes/:inbox_id/messages": mppx.charge({ amount: "0.005" }),
          "GET /v0/inboxes/:inbox_id/messages/:message_id": mppx.charge({ amount: "0.005" }),
          "POST /v0/inboxes/:inbox_id/messages/:message_id/reply": mppx.charge({ amount: "0.01" }),
          "GET /v0/inboxes/:inbox_id/threads": mppx.charge({ amount: "0.005" }),
          "GET /v0/inboxes/:inbox_id/threads/:thread_id": mppx.charge({ amount: "0.005" }),
          "POST /v0/inboxes/:inbox_id/drafts": mppx.charge({ amount: "0.01" }),
          "POST /v0/inboxes/:inbox_id/drafts/:draft_id/send": mppx.charge({ amount: "0.01" }),
          "POST /v0/domains": mppx.charge({ amount: "0.01" }),
          "GET /v0/domains": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  return services
}
