import * as http from "http"
import * as store from "./store"

export function select(upstream: string): Backend {
    if (/\d$/.test(upstream)) return store.backendList[0]
    let result = store.selectDomain(upstream)
    if (result) {
        let stats = store.countErrors(upstream)
        if (stats.error0 > stats.error1) {
            store.updateDomain(upstream, 1)
            return store.backendList[1]
        } else if (stats.error0 < stats.error1) {
            store.updateDomain(upstream, 0)
            return store.backendList[0]
        } else {
            return store.backendList[result.prefer]
        }
    } else {
        http.request(`http://${upstream}`, {
            method: "HEAD",
            path: "/",
            timeout: 2000,
        }, res => {
            res.on("data", () => { })
            res.on("end", () => {
                store.updateDomain(upstream, 0)
            })
        }).on("error", e => {
            store.updateDomain(upstream, 1)
        }).on("timeout", () => {
            store.updateDomain(upstream, 1)
        }).end()
        return store.selectParent(upstream)
    }
}
