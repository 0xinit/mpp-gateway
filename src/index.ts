import { createServer } from "node:http"
import { proxy, serviceCount } from "./proxy.js"

const port = Number(process.env.PORT) || 3000

const server = createServer(proxy.listener)

server.listen(port, () => {
  console.log(`\n  MPP Gateway running at http://localhost:${port}`)
  console.log(`  ${serviceCount} services loaded\n`)
  console.log(`  Discovery:  http://localhost:${port}/discover`)
  console.log(`  LLMs:       http://localhost:${port}/llms.txt`)
  console.log(`  All routes: http://localhost:${port}/discover/all.md\n`)
})
