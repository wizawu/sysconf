import * as fs from "fs"
import * as LoggerFactory from "log4js"
import brain from "brain.js"

const pulse: Record<string, number> = {}
const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

const data = [
  ...JSON.parse(fs.readFileSync("./data.30.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.31.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.33.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.35.json", "utf-8")),
]

const net = new brain.NeuralNetwork()
if (fs.existsSync("model.json")) {
  const model = fs.readFileSync("model.json", "utf8")
  net.fromJSON(JSON.parse(model))
}

export function train() {
  net.train(
    data.map(it => ({
      input: [
        it.err0 || 0,
        it.err1 || 0,
        it.spd0 || 0,
        it.spd1 || 0,
        it.blk0 || 0,
        it.blk1 || 0,
        it.bw0 || 0,
        it.bw1 || 0,
      ],
      output: [it.prefer],
    })),
    {
      iterations: 100_000,
      log: it => log.debug(it),
      logPeriod: 1000,
      learningRate: 0.01,
    },
  )
  fs.writeFileSync("model.json", JSON.stringify(net.toJSON(), null, 2))
}

export function classify(site: string, args: [number, number, number, number, number, number, number, number]): number {
  const output: number = net.run([
    args[0] || 0,
    args[1] || 0,
    args[2] || 0,
    args[3] || 0,
    args[4] || 0,
    args[5] || 0,
    args[6] || 0,
    args[7] || 0,
  ])[0]
  if (Math.floor(Date.now() / 1000) > (pulse[site] || 0)) {
    pulse[site] = Math.floor(Date.now() / 1000)
    log.debug(output.toFixed(6) + " - " + site)
  }
  return output < 0.5 ? 0 : 1
}

// Generate training data
export function writeData(i: number): void {
  const store = require("./store")
  const buffer: string[] = []
  store.allDomains().forEach(site => {
    const { err0, err1, spd0, spd1, blk0, blk1, bw0, bw1 } = store.measure(site)
    if ([err0, err1, spd0, spd1, blk0, blk1, bw0, bw1].every(it => !it)) {
      return
    }
    if (whiteList.some(it => it === site || site.endsWith("." + it))) {
      buffer.push(JSON.stringify({ site, err0, err1, spd0, spd1, blk0, blk1, bw0, bw1, prefer: 0 }))
    }
    if (blackList.some(it => it === site || site.endsWith("." + it))) {
      buffer.push(JSON.stringify({ site, err0, err1, spd0, spd1, blk0, blk1, bw0, bw1, prefer: 1 }))
    }
  })
  fs.writeFileSync(`data.${i}.json`, "[" + buffer.join(",\n") + "]")
}

const whiteList = [
  "360buyimg.com",
  "aiqicha.com",
  "alicdn.com",
  "baidu.com",
  "bcebos.com",
  "bdimg.com",
  "csdn.net",
  "csdnimg.cn",
  "gtimg.cn",
  "gtimg.com",
  "idqqimg.com",
  "ifanr.com",
  "inwaishe.com",
  "ithome.com",
  "jd.com",
  "mi.com",
  "qq.com",
  "soso.com",
  "weixinbridge.com",
  "woa.com",
]

const blackList = [
  "adnxs.com",
  "adsrvr.org",
  "amplitude.com",
  "bing.com",
  "clearbit.com",
  "docker.com",
  "doubleclick.net",
  "duckduckgo.com",
  "elastic.co",
  "feedly.com",
  "gettoby.com",
  "github.com",
  "github.io",
  "githubassets.com",
  "githubusercontent.com",
  "google-analytics.com",
  "google.com",
  "googleadservices.com",
  "googleapis.com",
  "googlesyndication.com",
  "gravatar.com",
  "gstatic.com",
  "huggingface.co",
  "lastpass.com",
  "optimizely.com",
  "oracle.com",
  "quora.com",
  "readthedocs.io",
  "stripe.com",
  "yahoo.com",
]
