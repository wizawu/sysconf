import { spawnSync } from "child_process"

import * as store from "./store"
import * as train from "./train"

export function select(upstream: string): store.Backend {
  if (/\d$/.test(upstream)) return store.backendList[0]
  const result = store.selectDomain(upstream)
  if (result) {
    setTimeout(() => {
      const { err0, err1 } = store.countConnErr(upstream)
      const { spd0, spd1, bw0, bw1 } = store.measure(upstream)
      const next = train.classify(upstream, [err0, err1, spd0, spd1, bw0, bw1])
      if (Number(result.prefer) !== next) {
        store.updateDomain(upstream, next, "TRAIN")
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
