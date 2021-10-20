import * as fs from "fs"
import * as LoggerFactory from "log4js"
import brain from "brain.js"

const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"))
const net = new brain.NeuralNetwork()
net.train(
  data.map(it => ({
    input: [
      it.err0 === null ? 0 : it.err0,
      it.err1 === null ? 0 : it.err1,
      it.spd0 === null ? -1 : it.spd0,
      it.spd1 === null ? -1 : it.spd1,
    ],
    output: [it.prefer],
  }))
)

export function classify(site: string, args: [number, number, number, number]): number {
  const output: number = net.run([
    args[0] === null ? 0 : args[0],
    args[1] === null ? 0 : args[1],
    args[2] === null ? -1 : args[2],
    args[3] === null ? -1 : args[3],
  ])[0]
  log.debug(output.toFixed(16) + " - " + site)
  writeData(site, args)
  return output < 0.5 ? 0 : 1
}

const mark: Record<string, number> = {}
data.forEach(it => (mark[it.site] = it.prefer))
function writeData(site: string, args: [number, number, number, number]): void {
  if (mark[site] === undefined) return
  const file = `data.${Date.now().toString().substr(0, 6)}.json`
  fs.appendFileSync(
    file,
    JSON.stringify({
      site,
      err0: args[0],
      err1: args[1],
      spd0: args[2],
      spd1: args[3],
      prefer: mark[site],
    }) + ",\n"
  )
  delete mark[site]
}
