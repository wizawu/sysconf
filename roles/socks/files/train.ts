import * as fs from "fs"
import * as LoggerFactory from "log4js"
import brain from "brain.js"

const pulse: Record<string, number> = {}
const log = LoggerFactory.getLogger("\t\b\b\b\b\b\b\b")
log.level = "debug"

const data = [
  ...JSON.parse(fs.readFileSync("./data.24.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.25.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.26.json", "utf-8")),
  ...JSON.parse(fs.readFileSync("./data.27.json", "utf-8")),
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
      iterations: 20000,
      log: it => log.debug(it),
      logPeriod: 1000,
      learningRate: 0.1,
    }
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
  Array(...whiteList, ...blackList).forEach(site => {
    const { err0, err1, spd0, spd1, blk0, blk1, bw0, bw1 } = store.measure(site)
    if ([err0, err1, spd0, spd1, blk0, blk1, bw0, bw1].every(it => !it)) {
      return log.warn(`no history: ${site}`)
    }
    let prefer = -1
    if (whiteList.includes(site)) {
      prefer = 0
    } else if (blackList.includes(site)) {
      prefer = 9
    }
    buffer.push(JSON.stringify({ site, err0, err1, spd0, spd1, blk0, blk1, bw0, bw1, prefer }))
  })
  fs.appendFileSync(`data.${i}.json`, "[" + buffer.join(",\n") + "]")
}

const whiteList = [
  "ad.browser.qq.com",
  "aegis.qq.com",
  "ai.jd.com",
  "aq.qq.com",
  "at.idqqimg.com",
  "avatar.ithome.com",
  "awcas.jd.com",
  "b-plus.jd.com",
  "bao.jd.com",
  "btrace.qq.com",
  "bugou.jd.com",
  "cache.soso.com",
  "cart.jd.com",
  "chongzhi.jd.com",
  "cm.l.qq.com",
  "cscssl.jd.com",
  "cube.weixinbridge.com",
  "d.jd.com",
  "dat.ruanmei.com",
  "details.jd.com",
  "diannao.jd.com",
  "digi.ithome.com",
  "discuz.gtimg.cn",
  "dldir1.qq.com",
  "doc.weixin.qq.com",
  "docimg9.docs.qq.com",
  "docrp.weixin.qq.com",
  "docs.gtimg.com",
  "docs.qq.com",
  "eclick.baidu.com",
  "einvoice.jd.com",
  "err.www.mi.com",
  "f-mall.jd.com",
  "fclick.baidu.com",
  "giftcard.jd.com",
  "gimg3.baidu.com",
  "go.buy.mi.com",
  "group.jd.com",
  "gsp0.baidu.com",
  "h5.m.jd.com",
  "h5static.jd.com",
  "hawks.jd.com",
  "hectorstatic.baidu.com",
  "himg.bdimg.com",
  "hm.baidu.com",
  "hpd.baidu.com",
  "hsapi.jd.com",
  "img.ithome.com",
  "iv.jd.com",
  "ivs.jd.com",
  "jdc.jd.com",
  "jdqd.jd.com",
  "jelly.jd.com",
  "jingfen.jd.com",
  "jrclick.jd.com",
  "jscss.360buyimg.com",
  "lp.open.weixin.qq.com",
  "lps.jd.com",
  "m.jd.com",
  "map-ql.jd.com",
  "map.baidu.com",
  "mapi.m.jd.com",
  "mbd.baidu.com",
  "mechrevo.jd.com",
  "mercury.jd.com",
  "mi.com",
  "miao.baidu.com",
  "mp.weixin.qq.com",
  "myapi.ruanmei.com",
  "mygiftcard.jd.com",
  "nuphy.jd.com",
  "odo.jd.com",
  "open.weixin.qq.com",
  "openapi.guanjia.qq.com",
  "order.jd.com",
  "orderop.jd.com",
  "oth.str.beacon.qq.com",
  "passport.baidu.com",
  "passport.woa.com",
  "pay.jd.com",
  "payc.m.jd.com",
  "payrisk.jd.com",
  "pcashier.jd.com",
  "pingjs.qq.com",
  "plogin.m.jd.com",
  "plus.jd.com",
  "pos.baidu.com",
  "prodev.jd.com",
  "pub.idqqimg.com",
  "qdsdk.jd.com",
  "qimg.ithome.com",
  "qpsearch.jd.com",
  "quan.ithome.com",
  "question.jd.com",
  "rel.discuz.soso.com",
  "report.idqqimg.com",
  "report.qqweb.qq.com",
  "res.wx.qq.com",
  "res2.wx.qq.com",
  "rjsb-token-m.jd.com",
  "rms.shop.jd.com",
  "rsc.jd.com",
  "rsp.jd.com",
  "s.pc.qq.com",
  "s1.mi.com",
  "s3.ifanr.com",
  "services.jd.com",
  "sgm-m.jd.com",
  "sgm-static.jd.com",
  "sh.jd.com",
  "sh.jd.com",
  "sofire.baidu.com",
  "sp0.baidu.com",
  "sp1.baidu.com",
  "spu.jd.com",
  "ss0.baidu.com",
  "ssl.captcha.qq.com",
  "static-alias-1.360buyimg.com",
  "stdl.qq.com",
  "storage.jd.com",
  "stream-outside.jd.com",
  "success.jd.com",
  "t10.baidu.com",
  "t11.baidu.com",
  "t13.baidu.com",
  "t14.baidu.com",
  "t15.baidu.com",
  "t7.baidu.com",
  "t8.baidu.com",
  "t9.baidu.com",
  "tianshu.qq.com",
  "tls.jd.com",
  "trade.jd.com",
  "trustrcv.baidu.com",
  "tstp.jd.com",
  "u.jd.com",
  "ug.baidu.com",
  "union-click.jd.com",
  "uranus.jd.com",
  "vfiles.gtimg.cn",
  "wn.pos.baidu.com",
  "work.weixin.qq.com",
  "wq.360buyimg.com",
  "wwcdn.weixin.qq.com",
  "www.aiqicha.com",
  "www.baidu.com",
  "www.inwaishe.com",
  "www.mi.com",
  "x.jd.com",
  "xin-static.bj.bcebos.com",
  "xinpub.bj.bcebos.com",
  "xinpub.cdn.bcebos.com",
  "ydcx.360buyimg.com",
  "yuding.jd.com",
  "zhengxin-pub.cdn.bcebos.com",
  "zt-jshop.jd.com",
]

const blackList = [
  "accounts.google.com",
  "ads.stickyadstv.com",
  "ads.yahoo.com",
  "adservice.google.com",
  "alive.github.com",
  "api.github.com",
  "apis.google.com",
  "avatars.githubusercontent.com",
  "bh.contextweb.com",
  "bing.com",
  "c.bing.com",
  "camo.githubusercontent.com",
  "cdn.staticfile.org",
  "clients2.google.com",
  "cm.mgid.com",
  "eus.rubiconproject.com",
  "feedly.com",
  "fonts.googleapis.com",
  "fonts.gstatic.com",
  "github.com",
  "github.githubassets.com",
  "google.com",
  "history.google.com",
  "hooks.stripe.com",
  "hub.docker.com",
  "i.stack.imgur.com",
  "id.google.com",
  "id5-sync.com",
  "js.stripe.com",
  "lens.google.com",
  "lh3.googleusercontent.com",
  "m.stripe.network",
  "mail.google.com",
  "mtalk.google.com",
  "ogs.google.com",
  "op.gg",
  "pay.google.com",
  "play.google.com",
  "prebid.a-mo.net",
  "raw.githubusercontent.com",
  "s1.feedly.com",
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
