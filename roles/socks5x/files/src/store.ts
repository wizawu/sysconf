import nanoid58 from "nanoid-base58"
import * as Database from "better-sqlite3"

export const backendList: Backend[] = [
    { _id: 0, host: "127.0.0.1", port: 1080 },
    { _id: 1, host: "127.0.0.1", port: 1085 },
]

export const db = new Database("sqlite.db")

db.exec(`
    create table if not exists domain(
        domain text,
        prefer short,
        time long,
        primary key (domain)
    )
`)

db.exec(`
    create table if not exists history(
        history_id text,
        domain text,
        choose short,
        duration long,
        traffic long,
        error text,
        time long,
        primary key (history_id)
    )
`)

export function selectDomain(domain: string) {
    return db.prepare(`
        select * from domain where domain = @domain
    `).get({ domain })
}

export function updateDomain(domain: string, prefer: number) {
    db.exec(`
        replace into domain(domain, prefer, time) values(
            '${domain}', ${prefer}, ${Date.now()}
        )
    `)
}

export function createHistory(domain: string, choose: number, duration: number, traffic: number, error?: string) {
    db.prepare(`
        replace into history(time, history_id, domain, choose, duration, traffic, error)
            values(
                ${Date.now()}, '${nanoid58(20)}', '${domain}',
                ${choose}, ${duration}, ${traffic},
                @error
            )
    `).run({ error: error || "" })
}

export function countConnErr(domain: string) {
    db.exec(`delete from history where time < ${Date.now() - 30 * 86400 * 1000}`)
    return db.prepare(`
        select
            sum(case when choose = 0 then 1 else 0 end) as error0,
            sum(case when choose = 1 then 1 else 0 end) as error1
        from history
        where domain = @domain and duration < 32000 and traffic < 32 and error > ''
    `).get({ domain })
}

export function countReadErr(domain: string, prefer: number) {
    db.exec(`delete from history where time < ${Date.now() - 30 * 86400 * 1000}`)
    return db.prepare(`
        select
            sum(case when error = '' then 1 else 0 end) as ok,
            sum(case when error > '' then 1 else 0 end) as fail
        from history
        where domain = @domain and choose = @prefer and traffic > 32
    `).get({ domain, prefer })
}
