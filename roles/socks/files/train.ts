import * as fs from "fs"
import * as LoggerFactory from "log4js"
import brain from "brain.js"

const pulse: Record<string, number> = {}
const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

const data = [
  ...JSON.parse(fs.readFileSync("./data.0.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.1.json", "utf-8")),
]

const net = new brain.NeuralNetwork()
if (fs.existsSync("model.json")) {
  const model = fs.readFileSync("model.json", "utf8")
  net.fromJSON(JSON.parse(model))
}

export function train() {
  net.train(
    data.map(it => ({
      input: [it.err0 || 0, it.err1 || 0, it.spd0 || 0, it.spd1 || 0, it.bd0 || it.spd0 || 0, it.bd1 || it.spd1 || 0],
      output: [it.prefer],
    }))
  )
  fs.writeFileSync("model.json", JSON.stringify(net.toJSON(), null, 2))
}

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
    log.debug(output.toFixed(6) + " - " + site)
  }
  return output < 0.5 ? 0 : 1
}

// Generate training data
export function writeData(i: number): void {
  const store = require("./store")
  const mark: Record<string, number> = {}
  data.forEach(it => (mark[it.site] = it.prefer))
  const buffer: string[] = []
  Object.keys(mark)
    .concat(blackList)
    .forEach(site => {
      const { err0, err1 } = store.countConnErr(site)
      const { spd0, spd1, bw0, bw1 } = store.measure(site)
      buffer.push(
        JSON.stringify({
          site,
          err0,
          err1,
          spd0,
          spd1,
          bw0,
          bw1,
          prefer: mark[site] === undefined ? 1 : mark[site],
        })
      )
    })
  fs.appendFileSync(`data.${i}.json`, "[" + buffer.join(",\n") + "]")
}

const blackList = [
  "360yield.com",
  "3lift.com",
  "4dex.io",
  "a-mo.net",
  "adaptv.advertising.com",
  "addthis.com",
  "adform.net",
  "adnxs.com",
  "ads.stickyadstv.com",
  "ads.yahoo.com",
  "adsrvr.org",
  "advertising.com",
  "agkn.com",
  "amazon-adsystem.com",
  "analytics.yahoo.com",
  "aniview.com",
  "api.github.com",
  "avatars.githubusercontent.com",
  "baidu.com",
  "betweendigital.com",
  "bh.contextweb.com",
  "bidswitch.net",
  "bing.com",
  "c.bing.com",
  "camo.githubusercontent.com",
  "casalemedia.com",
  "clarity.ms",
  "cm.mgid.com",
  "collector.githubapp.com",
  "contextweb.com",
  "criteo.com",
  "dotomi.com",
  "doubleclick.net",
  "endpoint1.collection.us2.sumologic.com",
  "eus.rubiconproject.com",
  "everesttech.net",
  "exelator.com",
  "facebook.com",
  "github.com",
  "github.githubassets.com",
  "go.sonobi.com",
  "google.co.jp",
  "google.com",
  "gstatic.com",
  "hm.baidu.com",
  "id5-sync.com",
  "justpremium.com",
  "kargo.com",
  "lijit.com",
  "mathtag.com",
  "mgid.com",
  "omnitagjs.com",
  "op.gg",
  "openx.net",
  "outbrain.com",
  "prebid.a-mo.net",
  "pubmatic.com",
  "rfihub.com",
  "richaudience.com",
  "rlcdn.com",
  "rubiconproject.com",
  "sharethrough.com",
  "smaato.net",
  "smartadserver.com",
  "tapad.com",
  "teads.tv",
  "tpmn.co.kr",
  "tremorhub.com",
  "wcs.naver.com",
  "www.clarity.ms",
  "www.op.gg",
  "yahoo.com",
]
