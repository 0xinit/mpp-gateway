import { custom } from "mppx/proxy"
import { mppx } from "../mppx.js"

const env = process.env

export function tradingServices() {
  const services = []

  if (env.ALPACA_API_KEY && env.ALPACA_API_SECRET) {
    const alpacaBase = env.ALPACA_PAPER !== "false"
      ? "https://paper-api.alpaca.markets"
      : "https://api.alpaca.markets"

    services.push(
      custom("alpaca", {
        baseUrl: alpacaBase,
        title: "Alpaca",
        description: "Stock and crypto trading, positions, and portfolio management.",
        headers: {
          "APCA-API-KEY-ID": env.ALPACA_API_KEY,
          "APCA-API-SECRET-KEY": env.ALPACA_API_SECRET,
        },
        routes: {
          "POST /v2/orders": mppx.charge({ amount: "0.05" }),
          "GET /v2/orders": mppx.charge({ amount: "0.005" }),
          "GET /v2/orders/:id": mppx.charge({ amount: "0.005" }),
          "DELETE /v2/orders": mppx.charge({ amount: "0.02" }),
          "DELETE /v2/orders/:id": mppx.charge({ amount: "0.02" }),
          "GET /v2/positions": mppx.charge({ amount: "0.005" }),
          "GET /v2/positions/:symbol": mppx.charge({ amount: "0.005" }),
          "GET /v2/account": true,
          "GET /v2/assets": mppx.charge({ amount: "0.005" }),
          "GET /v2/assets/:id": mppx.charge({ amount: "0.005" }),
          "GET /v2/account/portfolio/history": mppx.charge({ amount: "0.01" }),
        },
      }),
    )
  }

  if (env.MASSIVE_API_KEY) {
    services.push(
      custom("massive", {
        baseUrl: "https://api.massive.com",
        title: "Massive",
        description: "Real-time and historical market data — stocks, options, futures, forex, crypto, and economy.",
        mutate: (req) => {
          req.headers.set("Authorization", `Bearer ${env.MASSIVE_API_KEY}`)
          return req
        },
        routes: {
          // Stocks
          "GET /v2/aggs/ticker/:ticker/range/:multiplier/:timespan/:from/:to": mppx.charge({ amount: "0.01" }),
          "GET /v2/aggs/ticker/:ticker/prev": mppx.charge({ amount: "0.005" }),
          "GET /v2/snapshot/locale/us/markets/stocks/tickers": mppx.charge({ amount: "0.02" }),
          "GET /v2/snapshot/locale/us/markets/stocks/tickers/:ticker": mppx.charge({ amount: "0.005" }),
          "GET /v3/reference/tickers": mppx.charge({ amount: "0.005" }),
          "GET /v3/reference/tickers/:ticker": mppx.charge({ amount: "0.005" }),
          "GET /v2/last/trade/:ticker": mppx.charge({ amount: "0.005" }),
          "GET /v1/open-close/:ticker/:date": mppx.charge({ amount: "0.005" }),
          "GET /v3/trades/:ticker": mppx.charge({ amount: "0.01" }),
          "GET /v3/quotes/:ticker": mppx.charge({ amount: "0.01" }),
          // Fundamentals & filings
          "GET /vX/reference/financials": mppx.charge({ amount: "0.02" }),
          "GET /v3/reference/dividends": mppx.charge({ amount: "0.01" }),
          "GET /v3/reference/splits": mppx.charge({ amount: "0.01" }),
          // Options
          "GET /v3/reference/options/contracts": mppx.charge({ amount: "0.01" }),
          "GET /v3/reference/options/contracts/:optionsTicker": mppx.charge({ amount: "0.005" }),
          "GET /v3/snapshot/options/:underlyingAsset": mppx.charge({ amount: "0.02" }),
          // Crypto
          "GET /v2/aggs/grouped/locale/global/market/crypto/:date": mppx.charge({ amount: "0.01" }),
          "GET /v1/last/crypto/:from/:to": mppx.charge({ amount: "0.005" }),
          // Forex
          "GET /v1/conversion/:from/:to": mppx.charge({ amount: "0.005" }),
          // Economy
          "GET /v1/indicators/economy/treasury-yields": mppx.charge({ amount: "0.01" }),
          "GET /v1/indicators/economy/inflation": mppx.charge({ amount: "0.01" }),
          // News
          "GET /v2/reference/news": mppx.charge({ amount: "0.005" }),
          // Technical indicators
          "GET /v1/indicators/sma/:ticker": mppx.charge({ amount: "0.01" }),
          "GET /v1/indicators/ema/:ticker": mppx.charge({ amount: "0.01" }),
          "GET /v1/indicators/rsi/:ticker": mppx.charge({ amount: "0.01" }),
          "GET /v1/indicators/macd/:ticker": mppx.charge({ amount: "0.01" }),
          // Market status
          "GET /v1/marketstatus/now": true,
          "GET /v3/reference/exchanges": true,
        },
      }),
    )
  }

  if (env.IEX_API_TOKEN) {
    services.push(
      custom("iex", {
        baseUrl: "https://cloud.iexapis.com",
        title: "IEX Cloud",
        description: "Stock quotes, financials, earnings, and market news.",
        mutate: (req) => {
          const url = new URL(req.url)
          url.searchParams.set("token", env.IEX_API_TOKEN!)
          return new Request(url, req)
        },
        routes: {
          "GET /stable/stock/:symbol/quote": mppx.charge({ amount: "0.005" }),
          "GET /stable/stock/:symbol/chart/:range": mppx.charge({ amount: "0.01" }),
          "GET /stable/stock/:symbol/financials": mppx.charge({ amount: "0.01" }),
          "GET /stable/stock/:symbol/earnings/:last": mppx.charge({ amount: "0.01" }),
          "GET /stable/stock/:symbol/news": mppx.charge({ amount: "0.005" }),
          "GET /stable/stock/:symbol/company": mppx.charge({ amount: "0.005" }),
          "GET /stable/stock/:symbol/stats": mppx.charge({ amount: "0.005" }),
          "GET /stable/stock/market/list/:listType": mppx.charge({ amount: "0.005" }),
        },
      }),
    )
  }

  return services
}
