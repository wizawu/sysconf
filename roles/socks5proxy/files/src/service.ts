import * as Database from "better-sqlite3"
import * as LoggerFactory from "log4js"
import * as http from "http"

interface Backend {
    _id: number
    host: string
    port: number
}

export const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"
const backends: Backend[] = [{
    _id: 0,
    host: "127.0.0.1",
    port: 1080
}, {
    _id: 1,
    host: "127.0.0.1",
    port: 1085
}]

const db = new Database("test.db", { versbose: console.log })
db.exec(`
    create table if not exists domain(
        domain text,
        prefer short,
        time long,
        primary key (domain)
    )
`)

export function select(upstream: string): Backend {
    if (/\d$/.test(upstream)) return backends[0]
    let result = db.prepare(`
        select * from domain where domain = @domain
    `).get({ domain: upstream })
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
                log.error(`Ping ${upstream}: ${e.message}`)
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
    let result = db.prepare(`
        select * from domain where domain = @domain
    `).get({ domain: parent })
    if (result) {
        return backends[result.prefer]
    } else {
        return backends[0]
    }
}

export function updateDomain(domain: string, prefer: number) {
    db.exec(`
        replace into domain(domain, prefer, time) values(
            '${domain}', ${prefer}, ${Date.now()}
        )
    `)
}

export function preferAnother(domain: string, prefer?: number) {
    db.exec(`
        update domain set prefer = ${prefer === undefined ? "1 - prefer" : prefer}
        where domain = '${domain}'
    `)
}
