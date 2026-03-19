import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function infrastructureServices() {
  const services = []

  if (env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY && env.AWS_S3_BUCKET) {
    const region = env.AWS_REGION ?? "us-east-1"
    const bucket = env.AWS_S3_BUCKET

    services.push(
      custom("s3", {
        baseUrl: `https://${bucket}.s3.${region}.amazonaws.com`,
        title: "AWS S3",
        description: "Object storage — upload, download, and manage files.",
        rewriteRequest: async (req) => {
          // S3 requires AWS Signature V4 — for the hackathon we pass
          // pre-signed URLs or use IAM role-based auth on the host.
          // The headers below work when running on an EC2/ECS instance with an IAM role.
          req.headers.set("x-amz-content-sha256", "UNSIGNED-PAYLOAD")
          return req
        },
        routes: {
          "PUT /:key": mppx.charge({ amount: "0.01" }),
          "GET /:key": mppx.charge({ amount: "0.005" }),
          "DELETE /:key": mppx.charge({ amount: "0.005" }),
          "HEAD /:key": mppx.charge({ amount: "0.002" }),
          "GET /": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.CLOUDFLARE_ACCOUNT_ID && env.CLOUDFLARE_API_TOKEN) {
    const accountId = env.CLOUDFLARE_ACCOUNT_ID
    services.push(
      custom("cloudflare-r2", {
        baseUrl: "https://api.cloudflare.com/client/v4",
        title: "Cloudflare R2",
        description: "Zero-egress object storage via Cloudflare API.",
        bearer: env.CLOUDFLARE_API_TOKEN,
        routes: {
          [`GET /accounts/${accountId}/r2/buckets`]: mppx.charge({ amount: "0.005" }),
          [`POST /accounts/${accountId}/r2/buckets`]: mppx.charge({ amount: "0.02" }),
          [`GET /accounts/${accountId}/r2/buckets/:bucket`]: mppx.charge({ amount: "0.005" }),
          [`DELETE /accounts/${accountId}/r2/buckets/:bucket`]: mppx.charge({ amount: "0.01" }),
          [`PUT /accounts/${accountId}/r2/buckets/:bucket/objects/:key`]: mppx.charge({ amount: "0.01" }),
          [`GET /accounts/${accountId}/r2/buckets/:bucket/objects/:key`]: mppx.charge({ amount: "0.005" }),
          [`DELETE /accounts/${accountId}/r2/buckets/:bucket/objects/:key`]: mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.VERCEL_API_TOKEN) {
    services.push(
      custom("vercel", {
        baseUrl: "https://api.vercel.com",
        title: "Vercel",
        description: "Deployments, projects, and domain management.",
        bearer: env.VERCEL_API_TOKEN,
        routes: {
          "POST /v13/deployments": mppx.charge({ amount: "0.10" }),
          "GET /v6/deployments": mppx.charge({ amount: "0.005" }),
          "GET /v13/deployments/:id": mppx.charge({ amount: "0.005" }),
          "DELETE /v13/deployments/:id": mppx.charge({ amount: "0.02" }),
          "GET /v9/projects": mppx.charge({ amount: "0.005" }),
          "POST /v10/projects": mppx.charge({ amount: "0.05" }),
          "GET /v9/projects/:idOrName": mppx.charge({ amount: "0.005" }),
          "GET /v2/domains": mppx.charge({ amount: "0.005" }),
          "POST /v5/domains": mppx.charge({ amount: "0.05" }),
        },
      }),
    )
  }

  if (env.RAILWAY_API_TOKEN) {
    services.push(
      custom("railway", {
        baseUrl: "https://backboard.railway.com",
        title: "Railway",
        description: "Cloud infrastructure — deploy apps, databases, and services.",
        bearer: env.RAILWAY_API_TOKEN,
        routes: {
          "POST /graphql/v2": mppx.charge({ amount: "0.02" }),
        },
      }),
    )
  }

  if (env.GITHUB_TOKEN) {
    services.push(
      custom("github", {
        baseUrl: "https://api.github.com",
        title: "GitHub",
        description: "Repositories, issues, pull requests, actions, and code search.",
        headers: {
          Authorization: `Bearer ${env.GITHUB_TOKEN}`,
          Accept: "application/vnd.github+json",
          "X-GitHub-Api-Version": "2022-11-28",
        },
        routes: {
          // Repos
          "GET /user/repos": mppx.charge({ amount: "0.005" }),
          "POST /user/repos": mppx.charge({ amount: "0.02" }),
          "GET /repos/:owner/:repo": mppx.charge({ amount: "0.005" }),
          "GET /repos/:owner/:repo/contents/:path": mppx.charge({ amount: "0.005" }),
          // Issues
          "GET /repos/:owner/:repo/issues": mppx.charge({ amount: "0.005" }),
          "POST /repos/:owner/:repo/issues": mppx.charge({ amount: "0.01" }),
          "PATCH /repos/:owner/:repo/issues/:issue_number": mppx.charge({ amount: "0.01" }),
          "POST /repos/:owner/:repo/issues/:issue_number/comments": mppx.charge({ amount: "0.01" }),
          // Pull requests
          "GET /repos/:owner/:repo/pulls": mppx.charge({ amount: "0.005" }),
          "POST /repos/:owner/:repo/pulls": mppx.charge({ amount: "0.02" }),
          "GET /repos/:owner/:repo/pulls/:pull_number": mppx.charge({ amount: "0.005" }),
          "POST /repos/:owner/:repo/pulls/:pull_number/reviews": mppx.charge({ amount: "0.02" }),
          // Commits & branches
          "GET /repos/:owner/:repo/commits": mppx.charge({ amount: "0.005" }),
          "GET /repos/:owner/:repo/branches": mppx.charge({ amount: "0.005" }),
          // Actions
          "GET /repos/:owner/:repo/actions/runs": mppx.charge({ amount: "0.005" }),
          "POST /repos/:owner/:repo/actions/workflows/:workflow_id/dispatches": mppx.charge({ amount: "0.02" }),
          // Search
          "GET /search/code": mppx.charge({ amount: "0.01" }),
          "GET /search/repositories": mppx.charge({ amount: "0.01" }),
          "GET /search/issues": mppx.charge({ amount: "0.01" }),
          // Users
          "GET /user": true,
          "GET /users/:username": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  return services
}
