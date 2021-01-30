import { spawnSync } from "child_process"
import * as store from "./store"

export function select(upstream: string): Backend {
    if (/\d$/.test(upstream)) return store.backendList[0]
    let result = store.selectDomain(upstream)
    if (result) {
        setTimeout(() => {
            let { error0, error1 } = store.countConnErr(upstream)
            if (error0 > error1) {
                store.updateDomain(upstream, 1)
            } else if (error0 < error1) {
                store.updateDomain(upstream, 0)
            } else {
                let { ok, fail } = store.countReadErr(upstream, result.prefer)
                if (ok < fail) store.updateDomain(upstream, 1 - result.prefer)
            }
        }, 0)
        return store.backendList[result.prefer]
    } else {
        let child = spawnSync("curl", `-I -L -m 0.5 http://${upstream}/`.split(" "))
        let prefer = child.status === 0 ? 0 : 1
        store.updateDomain(upstream, prefer)
        return store.backendList[prefer]
    }
}
