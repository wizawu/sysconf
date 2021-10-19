import * as fs from "fs"
import * as LoggerFactory from "log4js"
import brain from "brain.js"

const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

const data = JSON.parse(fs.readFileSync("./data.json", "utf-8"))
const net = new brain.NeuralNetwork()
net.train(
  data.map(it => ({
    input: [it.err0, it.err1, it.spd0, it.spd1],
    output: [it.prefer],
  }))
)

export function classify(site: string, args: [number, number, number, number]): number {
  const output: number = net.run(args)[0]
  log.debug(output.toFixed(16) + " - " + site)
  return output < 0.5 ? 0 : 1
}
