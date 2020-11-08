import * as http from "http"
import * as diskdb from "diskdb"
import * as LoggerFactory from "log4js"

interface Backend {
    _id: number
    host: string
    port: number
}

export const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"
let db = diskdb.connect("db", ["domains"])
let backends: Backend[] = [{
    _id: 0,
    host: "127.0.0.1",
    port: 1080
}, {
    _id: 1,
    host: "127.0.0.1",
    port: 1085
}]

setInterval(() => {
    db.domains.find({}).forEach(it => {
        if (Date.now() - (it.time || 0) > 30 * 86400 * 1000) {
            db.domains.remove({ _id: it._id })
            log.warn("Purge " + it.domain)
        }
    })
}, 3600 * 1000)

export function select(upstream: string): Backend {
    if (/\d$/.test(upstream)) return backends[0]
    let result = db.domains.findOne({ domain: upstream })
    if (result) {
        return backends[result.prefer]
    } else {
        http.request(`http://${upstream}`, {
            method: "HEAD",
            path: "/",
            timeout: 2000,
        }, res => {
            res.on("data", () => { })
            res.on("end", () => {
                if (res.statusCode === 200) updateDomain(upstream, 0)
            })
        })
            .on("error", e => {
                log.error(`Test ${upstream}: ${e.message}`)
                updateDomain(upstream, 1)
            })
            .on("timeout", () => {
                updateDomain(upstream, 1)
            })
            .end()
        return selectParent(upstream)
    }
}

function selectParent(upstream: string): Backend {
    let parent = upstream.split(".").slice(1).join(".")
    let result = db.domains.findOne({ domain: parent })
    if (result) {
        return backends[result.prefer]
    } else {
        return backends[0]
    }
}

export function updateDomain(domain: string, prefer: number) {
    db.domains.update(
        { domain },
        { domain, prefer, time: Date.now() },
        { upsert: true }
    )
}

export function preferAnother(domain: string) {
    let record = db.domains.findOne({ domain })
    if (record) {
        db.domains.update(
            { domain },
            { prefer: 1 - record.prefer },
            { upsert: false }
        )
    }
}
