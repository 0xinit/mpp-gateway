import { Proxy } from "mppx/proxy"
import { allServices } from "./services/index.js"

const services = allServices()

export const proxy = Proxy.create({
  title: "MPP Gateway",
  description:
    "41 APIs behind Machine Payments Protocol — communications, finance, trading, KYC, accounting, infrastructure, identity, e-commerce, and more.",
  services,
})

export const serviceCount = services.length
