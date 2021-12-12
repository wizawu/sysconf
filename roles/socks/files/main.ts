import * as LoggerFactory from "log4js"
import * as net from "net"

import * as store from "./store"
import * as switcher from "./switcher"

const server = net.createServer()
const stats = { open: 0, end: 0, error: 0, timeout: 0 }
const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

setInterval(() => log.info(stats), 60000)

server.on("connection", conn => {
  stats.open += 1
  const startTime = Date.now()
  let client: net.Socket | null = null
  let upstream: string | null = null
  let backend: store.Backend | null = null
  let clientData1: Buffer | null = null
  let clientData2: Buffer | null = null
  let contentLength = 0
  let maxSpeed = 0

  conn.on("end", () => {
    stats.end += 1
    if (upstream !== null && backend !== null) {
      store.createHistory(upstream, backend._id, Date.now() - startTime, contentLength, maxSpeed, "")
    }
  })
  conn.on("error", e => {
    stats.error += 1
    if (upstream !== null && backend !== null) {
      store.createHistory(upstream, backend._id, Date.now() - startTime, contentLength, maxSpeed, e.message)
    }
  })
  conn.on("data", data => {
    if (upstream === null) {
      upstream = ""
      clientData1 = data
      conn.write(Buffer.from([5, 0]))
    } else if (upstream.length === 0) {
      upstream = data.slice(5, -2).toString()
      clientData2 = data
      backend = switcher.select(upstream)
      client = net.createConnection(backend, () => 0)
      setTimeout(() => {
        if (contentLength <= 26) {
          stats.timeout += 1
          store.createHistory(upstream!, backend!._id, Date.now() - startTime, 0, maxSpeed, "Connection timeout")
          conn.destroy()
          log.warn(`disconnect ${upstream}`)
        }
      }, 5000)
      client.on("connect", () => {
        client?.write(clientData1)
      })
      client.on("data", data => {
        if (Date.now() - startTime > 30000 && conn.destroyed) {
          client?.destroy()
        }
        if (clientData2 === null) {
          contentLength += data.length
          maxSpeed = Math.max(contentLength / (Date.now() - startTime), maxSpeed)
          conn.write(data)
        } else {
          client?.write(clientData2)
          clientData2 = null
        }
      })
      client.on("end", () => {
        store.createHistory(upstream!, backend!._id, Date.now() - startTime, contentLength, maxSpeed, "")
      })
      client.on("error", e => {
        store.createHistory(upstream!, backend!._id, Date.now() - startTime, contentLength, maxSpeed, e.message)
      })
    } else {
      client?.write(data)
    }
  })
})

server.listen(1090, "127.0.0.1", () => log.info("Listening on 1090"))
