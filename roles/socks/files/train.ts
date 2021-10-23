import * as fs from "fs"
import * as LoggerFactory from "log4js"
import brain from "brain.js"

const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

const data = [
  ...JSON.parse(fs.readFileSync("./data.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.17c9e.json", "utf-8")),
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
  log.debug(output.toFixed(16) + " - " + site)
  writeData(site, args)
  return output < 0.5 ? 0 : 1
}

const mark: Record<string, number> = {}
data.forEach(it => (mark[it.site] = it.prefer))
function writeData(site: string, args: [number, number, number, number, number, number]): void {
  if (mark[site] === undefined) return
  const file = `data.${Date.now().toString(16).substr(0, 5)}.json`
  fs.appendFileSync(
    file,
    JSON.stringify({
      site,
      err0: args[0],
      err1: args[1],
      spd0: args[2],
      spd1: args[3],
      bw0: args[4],
      bw1: args[5],
      prefer: mark[site],
    }) + ",\n"
  )
  delete mark[site]
}
