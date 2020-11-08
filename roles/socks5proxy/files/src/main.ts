import * as net from "net"

import { log, select, preferAnother } from "./service"

let server = net.createServer()
let lastUpstream = ""

server.on("connection", conn => {
    let client: net.Socket | null = null
    let upstream: string | null = null
    let clientData1: Buffer | null = null
    let clientData2: Buffer | null = null
    conn.on("error", e => {
        log.error(`Router error (${upstream}): ${e.message}`)
        preferAnother(upstream!)
    })
    conn.on("data", data => {
        if (upstream === null) {
            upstream = ""
            clientData1 = data
            conn.write(Buffer.from([5, 0]))
        } else if (upstream.length === 0) {
            upstream = data.slice(5, -2).toString()
            clientData2 = data
            let backend = select(upstream)
            let contentLength = 0
            client = net.createConnection(backend, () => {
                if (upstream !== lastUpstream) {
                    log.debug(`Select backend :${backend.port} for ${upstream}`)
                }
                lastUpstream = upstream!
                setTimeout(() => {
                    if (contentLength <= 16) {
                        log.warn(`Content length (${upstream}): ${contentLength}`)
                        preferAnother(upstream!)
                    }
                }, 5000)
            })
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
            client.on("error", e => {
                log.error(`Backend error (${upstream}): ${e.message}`)
            })
        } else {
            client?.write(data)
        }
    })
})

server.listen(1090, "127.0.0.1", () => log.info("Listening on 1090"))
