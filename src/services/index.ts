import { communicationServices } from "./communications.js"
import { financeServices } from "./finance.js"
import { tradingServices } from "./trading.js"
import { kycServices } from "./kyc.js"
import { accountingServices } from "./accounting.js"
import { onrampServices } from "./onramp.js"
import { insuranceServices } from "./insurance.js"
import { infrastructureServices } from "./infrastructure.js"
import { identityServices } from "./identity.js"
import { ecommerceServices } from "./ecommerce.js"
import { legalServices } from "./legal.js"

export function allServices() {
  return [
    ...communicationServices(),
    ...financeServices(),
    ...tradingServices(),
    ...kycServices(),
    ...accountingServices(),
    ...onrampServices(),
    ...insuranceServices(),
    ...infrastructureServices(),
    ...identityServices(),
    ...ecommerceServices(),
    ...legalServices(),
  ]
}
