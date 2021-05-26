import { spawnSync } from "child_process"
import * as store from "./store"

export function select(upstream: string): Backend {
  if (/\d$/.test(upstream)) return store.backendList[0]
  const result = store.selectDomain(upstream)
  if (result) {
    setTimeout(() => {
      const { ok, fail } = store.countReadErr(upstream, result.prefer)
      if (ok < fail) {
        store.updateDomain(upstream, 1 - result.prefer, "READ_ERROR")
      } else if (ok - fail < Date.now()) {
        const { error0, error1 } = store.countConnErr(upstream)
        if (error0 > error1) {
          store.updateDomain(upstream, 1, "CONNECT_ERROR")
        } else if (error0 < error1) {
          store.updateDomain(upstream, 0, "CONNECT_ERROR")
        }
      }
    }, 0)
    return store.backendList[result.prefer]
  } else {
    let prefer = 1
    for (const t of [2, 3, 5]) {
      const child = spawnSync("curl", `-I -L -m 0.${t} http://${upstream}/`.split(" "))
      if (child.status === 0) {
        prefer = 0
        break
      }
    }
    store.updateDomain(upstream, prefer, "INIT")
    return store.backendList[prefer]
  }
}
