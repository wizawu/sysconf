import { spawnSync } from "child_process"
import * as LoggerFactory from "log4js"
import * as store from "./store"

const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")

export function select(upstream: string): store.Backend {
  if (/\d$/.test(upstream)) return store.backendList[0]
  const result = store.selectDomain(upstream)
  if (result) {
    setTimeout(() => {
      let { ok, fail } = store.countReadErr(upstream, result.prefer)
      ok = ok || 0
      fail = fail || 0
      if (ok > 0.001 && fail > 0.001) {
        store.updateDomain(upstream, 1 - result.prefer, "READ_ERROR")
      } else if (!ok) {
        log.debug(`Read error: ${upstream} ${ok} ${fail}`)
        let { err0, err1 } = store.countConnErr(upstream)
        err0 = err0 || 0
        err1 = err1 || 0
        log.debug(`Conn error: ${upstream} ${err0} ${err1}`)
        if (err0 > err1) {
          store.updateDomain(upstream, 1, "CONNECT_ERROR")
        } else {
          store.updateDomain(upstream, 0, "CONNECT_ERROR")
        }
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
