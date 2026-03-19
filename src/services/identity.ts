import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function identityServices() {
  const services = []

  if (env.AUTH0_DOMAIN && env.AUTH0_MGMT_TOKEN) {
    services.push(
      custom("auth0", {
        baseUrl: `https://${env.AUTH0_DOMAIN}`,
        title: "Auth0",
        description: "Identity platform — user management, SSO, and access control.",
        bearer: env.AUTH0_MGMT_TOKEN,
        routes: {
          "POST /api/v2/users": mppx.charge({ amount: "0.02" }),
          "GET /api/v2/users": mppx.charge({ amount: "0.005" }),
          "GET /api/v2/users/:id": mppx.charge({ amount: "0.005" }),
          "PATCH /api/v2/users/:id": mppx.charge({ amount: "0.01" }),
          "DELETE /api/v2/users/:id": mppx.charge({ amount: "0.01" }),
          "GET /api/v2/roles": mppx.charge({ amount: "0.005" }),
          "POST /api/v2/roles": mppx.charge({ amount: "0.01" }),
          "GET /api/v2/connections": mppx.charge({ amount: "0.005" }),
          "GET /api/v2/organizations": mppx.charge({ amount: "0.005" }),
          "POST /api/v2/organizations": mppx.charge({ amount: "0.02" }),
        },
      }),
    )
  }

  if (env.CLERK_SECRET_KEY) {
    services.push(
      custom("clerk", {
        baseUrl: "https://api.clerk.com",
        title: "Clerk",
        description: "Authentication and user management with embeddable UI components.",
        bearer: env.CLERK_SECRET_KEY,
        routes: {
          "POST /v1/users": mppx.charge({ amount: "0.02" }),
          "GET /v1/users": mppx.charge({ amount: "0.005" }),
          "GET /v1/users/:userId": mppx.charge({ amount: "0.005" }),
          "PATCH /v1/users/:userId": mppx.charge({ amount: "0.01" }),
          "DELETE /v1/users/:userId": mppx.charge({ amount: "0.01" }),
          "POST /v1/organizations": mppx.charge({ amount: "0.02" }),
          "GET /v1/organizations": mppx.charge({ amount: "0.005" }),
          "GET /v1/organizations/:orgId": mppx.charge({ amount: "0.005" }),
          "POST /v1/invitations": mppx.charge({ amount: "0.01" }),
          "GET /v1/sessions": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.WORKOS_API_KEY) {
    services.push(
      custom("workos", {
        baseUrl: "https://api.workos.com",
        title: "WorkOS",
        description: "Enterprise SSO, directory sync, and admin portal.",
        bearer: env.WORKOS_API_KEY,
        routes: {
          "GET /user_management/users": mppx.charge({ amount: "0.005" }),
          "POST /user_management/users": mppx.charge({ amount: "0.02" }),
          "GET /user_management/users/:id": mppx.charge({ amount: "0.005" }),
          "GET /sso/connections": mppx.charge({ amount: "0.005" }),
          "GET /sso/connections/:id": mppx.charge({ amount: "0.005" }),
          "GET /directory_sync/directories": mppx.charge({ amount: "0.005" }),
          "GET /directory_sync/directories/:id/users": mppx.charge({ amount: "0.005" }),
          "GET /directory_sync/directories/:id/groups": mppx.charge({ amount: "0.005" }),
          "POST /portal/generate_link": mppx.charge({ amount: "0.01" }),
        },
      }),
    )
  }

  return services
}
