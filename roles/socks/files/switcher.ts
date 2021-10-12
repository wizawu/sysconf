import { spawnSync } from "child_process"
import * as store from "./store"

export function select(upstream: string): store.Backend {
  if (/\d$/.test(upstream)) return store.backendList[0]
  const result = store.selectDomain(upstream)
  if (result) {
    setTimeout(() => {
      const { err0, err1 } = store.countConnErr(upstream)
      const { spd0, spd1 } = store.averageSpeed(upstream)
      if (result.prefer === 0 && err0 > err1 && (spd0 < spd1 || spd1 === null)) {
        store.updateDomain(upstream, 1, "TWEAK")
      }
      if (result.prefer === 1 && err1 > err0 && (spd1 < spd0 || spd0 === null)) {
        store.updateDomain(upstream, 0, "TWEAK")
      }
    }, 0)
    return store.backendList[result.prefer]
  } else {
    let prefer = 1
    for (const t of [2, 3, 5]) {
      const child = spawnSync("curl", `-I -L -k -m 0.${t} http://${upstream}/`.split(" "))
      if (child.status === 0) {
        prefer = 0
        break
      }
    }
    store.updateDomain(upstream, prefer, "INIT")
    return store.backendList[prefer]
  }
}
