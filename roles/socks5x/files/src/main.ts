import * as LoggerFactory from "log4js"
import * as net from "net"

import * as store from "./store"
import * as switcher from "./switcher"

const server = net.createServer()
const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

server.on("connection", conn => {
    let startTime = Date.now()
    let client: net.Socket | null = null
    let upstream: string | null = null
    let backend: Backend | null = null
    let clientData1: Buffer | null = null
    let clientData2: Buffer | null = null
    let contentLength = 0

    conn.on("end", () => {
        if (upstream !== null && backend !== null) {
            store.createHistory(upstream, backend._id, Date.now() - startTime, contentLength, "")
        }
    })
    conn.on("error", e => {
        if (upstream !== null && backend !== null) {
            store.createHistory(upstream, backend._id, Date.now() - startTime, contentLength, e.message)
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
            client.on("connect", () => {
                client?.write(clientData1)
            })
            client.on("data", data => {
                if (clientData2 === null) {
                    contentLength += data.length
                    conn.write(data)
                } else {
                    client?.write(clientData2)
                    clientData2 = null
                }
            })
            client.on("end", () => {
                store.createHistory(upstream!!, backend!._id, Date.now() - startTime, contentLength, "")
            })
            client.on("error", e => {
                store.createHistory(upstream!!, backend!._id, Date.now() - startTime, contentLength, e.message)
            })
        } else {
            client?.write(data)
        }
    })
})

server.listen(1090, "127.0.0.1", () => log.info("Listening on 1090"))
