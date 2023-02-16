import * as fs from "fs"
import * as LoggerFactory from "log4js"
import brain from "brain.js"

const pulse: Record<string, number> = {}
const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

const data = [
  ...JSON.parse(fs.readFileSync("./data.5.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.6.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.7.json", "utf-8")),
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
    })),
    {
      iterations: 30000,
      log: it => log.debug(it),
      logPeriod: 1000,
    }
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
    .concat(whiteList)
    .concat(blackList)
    .forEach(site => {
      const { err0, err1 } = store.countConnErr(site)
      const { spd0, spd1, bw0, bw1 } = store.measure(site)
      if ([err0, err1, spd0, spd1, bw0, bw1].every(it => !it)) {
        if (whiteList.includes(site) || blackList.includes(site)) {
          return log.warn(`no history: ${site}`)
        }
      }
      let prefer = mark[site]
      if (whiteList.includes(site)) {
        prefer = 0
      } else if (blackList.includes(site)) {
        prefer = 1
      }
      buffer.push(JSON.stringify({ site, err0, err1, spd0, spd1, bw0, bw1, prefer }))
    })
  fs.appendFileSync(`data.${i}.json`, "[" + buffer.join(",\n") + "]")
}

const whiteList = [
  "aegis.qq.com",
  "aq.qq.com",
  "at.idqqimg.com",
  "cube.weixinbridge.com",
  "doc.weixin.qq.com",
  "docrp.weixin.qq.com",
  "docs.gtimg.com",
  "docs.qq.com",
  "eclick.baidu.com",
  "fclick.baidu.com",
  "gimg3.baidu.com",
  "gsp0.baidu.com",
  "hectorstatic.baidu.com",
  "himg.bdimg.com",
  "hm.baidu.com",
  "hpd.baidu.com",
  "img.ithome.com",
  "map.baidu.com",
  "mbd.baidu.com",
  "mercury.jd.com",
  "miao.baidu.com",
  "passport.baidu.com",
  "passport.woa.com",
  "pos.baidu.com",
  "pub.idqqimg.com",
  "qpsearch.jd.com",
  "report.idqqimg.com",
  "report.qqweb.qq.com",
  "res.wx.qq.com",
  "s3.ifanr.com",
  "sh.jd.com",
  "sofire.baidu.com",
  "sp0.baidu.com",
  "sp1.baidu.com",
  "ss0.baidu.com",
  "storage.jd.com",
  "t10.baidu.com",
  "t11.baidu.com",
  "t13.baidu.com",
  "t14.baidu.com",
  "t15.baidu.com",
  "t7.baidu.com",
  "t8.baidu.com",
  "t9.baidu.com",
  "tianshu.qq.com",
  "trustrcv.baidu.com",
  "ug.baidu.com",
  "wn.pos.baidu.com",
  "wq.360buyimg.com",
  "wwcdn.weixin.qq.com",
  "www.aiqicha.com",
  "www.baidu.com",
  "www.inwaishe.com",
  "x.jd.com",
  "xin-static.bj.bcebos.com",
  "xinpub.bj.bcebos.com",
  "xinpub.cdn.bcebos.com",
  "zhengxin-pub.cdn.bcebos.com",
]

const blackList = [
  "ads.stickyadstv.com",
  "ads.yahoo.com",
  "alive.github.com",
  "api.github.com",
  "avatars.githubusercontent.com",
  "bh.contextweb.com",
  "bing.com",
  "c.bing.com",
  "camo.githubusercontent.com",
  "cm.mgid.com",
  "eus.rubiconproject.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "github.com",
  "github.githubassets.com",
  "google.com",
  "hub.docker.com",
  "i.stack.imgur.com",
  "id5-sync.com",
  "lh3.googleusercontent.com",
  "mtalk.google.com",
  "ogs.google.com",
  "op.gg",
  "play.google.com",
  "prebid.a-mo.net",
  "raw.githubusercontent.com",
  "stats.g.doubleclick.net",
  "storage.googleapis.com",
  "t0.gstatic.com",
  "t1.gstatic.com",
  "t3.gstatic.com",
  "www.clarity.ms",
  "www.google-analytics.com",
  "www.google.com",
  "www.op.gg",
]
