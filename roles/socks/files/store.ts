import * as Database from "better-sqlite3"
import * as LoggerFactory from "log4js"
import { customAlphabet as nanoid } from "nanoid"
import { spawnSync } from "child_process"

export interface Backend {
  _id: number
  host: string
  port: number
}

export const backendList: Backend[] = [
  { _id: 0, host: "127.0.0.1", port: 1080 },
  { _id: 1, host: "127.0.0.1", port: 1081 },
]

export const db = new Database("sqlite.db")
const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")

let online = true
setInterval(() => {
  const child = spawnSync("curl", "-I -m 5 http://166.111.4.100/".split(" "))
  online = child.status === 0
  if (!online) {
    log.warn("I am offline")
    db.exec(`delete from history where time < ${Date.now() - 30 * 86400 * 1000}`)
    db.exec("VACUUM")
  }
}, 5000)

db.exec(`
  create table if not exists site(
    site text,
    prefer short,
    time long,
    reason text,
    primary key (site)
  )
`)

db.exec(`
  create table if not exists history(
    history_id text,
    site text,
    choose short,
    duration long,
    traffic long,
    speed real default 0,
    error text,
    time long,
    primary key (history_id)
  )
`)

db.exec("create index if not exists history_idx_site_traffic on history(site, traffic)")
db.exec("create index if not exists history_idx_time on history(time)")

export function allDomains(): string[] {
  const result = db.prepare("select * from site").all()
  return result.map(it => it.site)
}

export function selectDomain(site: string): Record<string, any> {
  const start = Date.now()
  const result = db.prepare("select * from site where site = @site").get({ site })
  if (Date.now() - start > 1) log.warn(`slow query: ${Date.now() - start}ms`)
  return result
}

export function updateDomain(site: string, prefer: number, reason: string): void {
  if (!online) return
  db.exec(`
    replace into site(site, prefer, time, reason) values(
      '${site}', ${prefer}, ${Date.now()}, '${reason}'
    )
  `)
}

export function createHistory(
  site: string,
  choose: number,
  duration: number,
  traffic: number,
  speed: number,
  error?: string,
): void {
  if (!online) return
  const now = Date.now()
  const id = (now + nanoid("0123456789", 10)()).substr(0, 20)
  db.prepare(
    `
    replace into history(time, history_id, site, choose, duration, traffic, speed, error)
    values(${now}, '${id}', '${site}', ${choose}, ${duration}, ${traffic}, ${speed}, @error)
    `,
  ).run({ error: error || "" })
}

export function measure(site: string): Record<string, number> {
  return db
    .prepare(
      `
      select
        count(case when choose = 0 and traffic <= 26 then 1 else null end) as err0,

        count(case when choose = 1 and traffic <= 26 then 1 else null end) as err1,

        count(case when choose = 0 and speed > 0 then 1 else null end) /
        sum(case when choose = 0 and speed > 0 then 1/speed else 0 end) as spd0,

        count(case when choose = 1 and speed > 0 then 1 else null end) /
        sum(case when choose = 1 and speed > 0 then 1/speed else 0 end) as spd1,

        count(case when choose = 0 and speed = 0 then 1 else null end) as blk0,

        count(case when choose = 1 and speed = 0 then 1 else null end) as blk1,

        max(case when choose = 0 then speed else 0 end) as bw0,

        max(case when choose = 1 then speed else 0 end) as bw1
      from history
      where site = @site
      `,
    )
    .get({ site })
}
