import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function ecommerceServices() {
  const services = []

  if (env.SHOPIFY_SHOP_DOMAIN && env.SHOPIFY_ACCESS_TOKEN) {
    services.push(
      custom("shopify", {
        baseUrl: `https://${env.SHOPIFY_SHOP_DOMAIN}/admin/api/2024-10`,
        title: "Shopify",
        description: "E-commerce — products, orders, customers, and inventory.",
        headers: {
          "X-Shopify-Access-Token": env.SHOPIFY_ACCESS_TOKEN,
          "Content-Type": "application/json",
        },
        routes: {
          "GET /products.json": mppx.charge({ amount: "0.005" }),
          "POST /products.json": mppx.charge({ amount: "0.02" }),
          "GET /products/:id.json": mppx.charge({ amount: "0.005" }),
          "PUT /products/:id.json": mppx.charge({ amount: "0.01" }),
          "GET /orders.json": mppx.charge({ amount: "0.005" }),
          "POST /orders.json": mppx.charge({ amount: "0.05" }),
          "GET /orders/:id.json": mppx.charge({ amount: "0.005" }),
          "GET /customers.json": mppx.charge({ amount: "0.005" }),
          "POST /customers.json": mppx.charge({ amount: "0.01" }),
          "GET /customers/:id.json": mppx.charge({ amount: "0.005" }),
          "GET /inventory_levels.json": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.PRINTFUL_API_KEY) {
    services.push(
      custom("printful", {
        baseUrl: "https://api.printful.com",
        title: "Printful",
        description: "Print-on-demand — products, orders, and fulfillment.",
        bearer: env.PRINTFUL_API_KEY,
        routes: {
          "GET /products": mppx.charge({ amount: "0.005" }),
          "GET /products/:id": mppx.charge({ amount: "0.005" }),
          "POST /orders": mppx.charge({ amount: "0.10" }),
          "GET /orders": mppx.charge({ amount: "0.005" }),
          "GET /orders/:id": mppx.charge({ amount: "0.005" }),
          "POST /orders/estimate-costs": mppx.charge({ amount: "0.01" }),
          "GET /countries": true,
          "GET /tax/rates": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  if (env.MAPBOX_ACCESS_TOKEN) {
    services.push(
      custom("mapbox", {
        baseUrl: "https://api.mapbox.com",
        title: "Mapbox",
        description: "Geocoding, directions, isochrones, and map data.",
        mutate: (req) => {
          const url = new URL(req.url)
          url.searchParams.set("access_token", env.MAPBOX_ACCESS_TOKEN!)
          return new Request(url, req)
        },
        routes: {
          "GET /geocoding/v5/mapbox.places/:query.json": mppx.charge({ amount: "0.005" }),
          "GET /directions/v5/mapbox/driving/:coordinates": mppx.charge({ amount: "0.01" }),
          "GET /directions/v5/mapbox/walking/:coordinates": mppx.charge({ amount: "0.01" }),
          "GET /directions/v5/mapbox/cycling/:coordinates": mppx.charge({ amount: "0.01" }),
          "GET /isochrone/v1/mapbox/:profile/:coordinates": mppx.charge({ amount: "0.01" }),
          "GET /optimized-trips/v1/mapbox/driving/:coordinates": mppx.charge({ amount: "0.02" }),
        },
      }),
    )
  }

  return services
}
