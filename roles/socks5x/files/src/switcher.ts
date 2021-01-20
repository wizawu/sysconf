import { spawnSync } from "child_process"
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
        let child = spawnSync("curl", `-I -m 0.5 http://${upstream}/`.split(" "))
        let prefer = child.status === 0 ? 0 : 1
        store.updateDomain(upstream, prefer)
        return store.backendList[prefer]
    }
}
