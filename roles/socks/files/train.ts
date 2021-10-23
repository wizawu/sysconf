import * as fs from "fs"
import * as LoggerFactory from "log4js"
import brain from "brain.js"

const pulse: Record<string, number> = {}
const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

const data = [
  ...JSON.parse(fs.readFileSync("./data.1.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.2.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.3.json", "utf-8")),
]
const net = new brain.NeuralNetwork()
net.train(
  data.map(it => ({
    input: [it.err0 || 0, it.err1 || 0, it.spd0 || 0, it.spd1 || 0, it.bd0 || it.spd0 || 0, it.bd1 || it.spd1 || 0],
    output: [it.prefer],
  }))
)

export function classify(site: string, args: [number, number, number, number, number, number]): number {
  const output: number = net.run([
    args[0] || 0,
    args[1] || 0,
    args[2] || 0,
    args[3] || 0,
    args[4] || 0,
    args[5] || 0,
  ])[0]
  if (Math.floor(Date.now() / 1000) > (pulse[site] || 0)) {
    pulse[site] = Math.floor(Date.now() / 1000)
    log.debug(output.toFixed(16) + " - " + site)
  }
  return output < 0.5 ? 0 : 1
}

// Generate training data
export function writeData(i: number): void {
  const store = require("./store")
  const mark: Record<string, number> = {}
  data.forEach(it => (mark[it.site] = it.prefer))
  Object.keys(mark).forEach(site => {
    const { err0, err1 } = store.countConnErr(site)
    const { spd0, spd1, bw0, bw1 } = store.measure(site)
    fs.appendFileSync(
      `data.${i}.json`,
      JSON.stringify({
        site,
        err0,
        err1,
        spd0,
        spd1,
        bw0,
        bw1,
        prefer: mark[site],
      }) + ",\n"
    )
  })
}
