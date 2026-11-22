/**
 * 词灵岛 · 内容数据校验（开发辅助）
 * 运行：node tools/datacheck.js
 * 校验词库、阅读、听力、对话、写作、剧情与成就数据的完整性与合法性。
 */
const assert = require('assert')
const words = require('../data/words.js')
const readings = require('../data/readings.js')
const listenings = require('../data/listenings.js')
const dialogues = require('../data/dialogues.js')
const writing = require('../data/writing.js')
const chapters = require('../data/chapters.js')
const achievements = require('../data/achievements.js')
const quotes = require('../data/quotes.js')
const pets = require('../data/pets.js')

let checks = 0
function ok(cond, msg) {
  checks += 1
  assert.ok(cond, msg)
}

/* 词库 */
const ids = {}
const wordSet = {}
ok(words.all.length >= 3000, '词条数量充足（' + words.all.length + '）')
words.all.forEach((w) => {
  ok(!!w.id && !ids[w.id], '单词 ID 唯一：' + w.id)
  ids[w.id] = true
  ok(!wordSet[w.word], '单词不重复：' + w.word)
  wordSet[w.word] = true
  ok(!!w.word && /^[a-z][a-z\s-]*$/.test(w.word), '单词拼写合法：' + w.word)
  ok(!!w.phonetic && w.phonetic.charAt(0) === '/', '音标格式：' + w.word)
  ok(!!w.cn, '释义完整：' + w.word)
  ok(!w.pos || /^[a-z./]+\.$/.test(w.pos), '词性格式：' + w.word)
  if (w.en) {
    ok(/[.!?]$/.test(w.en), '英文例句完整：' + w.word)
    ok(!!w.cnSent, '例句译文完整：' + w.word)
  }
  ok(Array.isArray(w.roots), '词根字段：' + w.word)
  w.roots.forEach((r) => {
    ok(!!r.t && !!r.m, '词根碎片完整：' + w.word)
  })
  ok(w.book === 'cet4' || w.book === 'cet6', '词书标记：' + w.word)
})
ok(words.cet4.length >= 2000 && words.cet6.length >= 1000, '两级词书均有完整内容')
ok(words.all.filter((w) => w.en).length >= 70, '保留带例句与词根的精选词')

/* 阅读 */
ok(readings.length === 3, '阅读篇数')
readings.forEach((r) => {
  ok(r.passage.length >= 2, '阅读段落：' + r.id)
  ok(r.questions.length === 3, '阅读题数：' + r.id)
  ok(r.keyWords.length === 3, '阅读生词：' + r.id)
  r.questions.forEach((q) => {
    ok(q.options.length === 4, '阅读选项数量：' + r.id)
    ok(q.answer >= 0 && q.answer < q.options.length, '阅读答案下标：' + r.id)
    ok(!!q.explain, '阅读解析：' + r.id)
  })
})

/* 听力 */
ok(listenings.length === 3, '听力篇数')
listenings.forEach((l) => {
  ok(l.sentences.length >= 5, '听力句数：' + l.id)
  l.sentences.forEach((s) => {
    ok(!!s.en && !!s.cn, '听力逐句译文：' + l.id)
  })
  ok(l.questions.length === 3, '听力题数：' + l.id)
  l.questions.forEach((q) => {
    ok(q.options.length === 4, '听力选项数量：' + l.id)
    ok(q.answer >= 0 && q.answer < q.options.length, '听力答案下标：' + l.id)
  })
})

/* 对话 */
ok(dialogues.length === 4, '对话场景数')
dialogues.forEach((d) => {
  ok(d.turns.length === 4, '对话轮数：' + d.id)
  ok(d.keyPhrases.length >= 4, '关键表达：' + d.id)
  d.turns.forEach((t) => {
    ok(t.options.length === 3, '每轮三个回应：' + d.id)
    ok(!!t.tip, '回应提示：' + d.id)
    const best = t.options.filter((o) => o.score === 10)
    ok(best.length === 1, '每轮恰有一个最佳回应：' + d.id)
  })
})

/* 写作 */
ok(writing.essays.length === 4, '作文题数')
writing.essays.forEach((e) => {
  ok(e.outline.length === 3, '作文提纲：' + e.id)
  ok(e.keyPhrases.length >= 4, '作文关键词：' + e.id)
  const sampleWords = e.sample.split(/\s+/).length
  ok(sampleWords >= 120, '范文词数：' + e.id + '（' + sampleWords + '）')
})
ok(writing.translations.length === 4, '翻译题数')
writing.translations.forEach((t) => {
  ok(!!t.zh && !!t.ref, '翻译原文与参考译文：' + t.id)
  ok(t.points.length >= 3, '翻译采分点：' + t.id)
})

/* 剧情 */
ok(chapters.length === 6, '章节数量')
let lastNeed = -1
chapters.forEach((c) => {
  ok(c.need >= lastNeed, '章节门槛递增：' + c.id)
  lastNeed = c.need
  ok(c.story.length >= 3, '章节剧情：' + c.id)
  ok(!!c.title && !!c.desc && !!c.emoji, '章节信息：' + c.id)
})

/* 成就 */
ok(achievements.length === 20, '成就数量')
const achIds = {}
const metrics = ['learned', 'streak', 'reviews', 'correct', 'minutes', 'garden', 'petLevel', 'puzzle', 'chapters', 'exam', 'bestScore', 'fish']
achievements.forEach((a) => {
  ok(!achIds[a.id], '成就 ID 唯一：' + a.id)
  achIds[a.id] = true
  ok(metrics.indexOf(a.metric) >= 0, '成就指标合法：' + a.id)
  ok(a.target > 0, '成就目标正数：' + a.id)
})

/* 每日一句 */
ok(quotes.length >= 6, '每日一句数量')
quotes.forEach((q) => {
  ok(!!q.en && !!q.cn && !!q.author, '每日一句完整')
})

/* 原创伙伴 */
ok(pets.list.length === 5, '伙伴物种数量')
const petIds = {}
pets.list.forEach((sp) => {
  ok(!petIds[sp.id], '伙伴 ID 唯一：' + sp.id)
  petIds[sp.id] = true
  ok(!!sp.name && !!sp.title && !!sp.emoji, '伙伴名称完整：' + sp.id)
  ok(!!sp.tagline && !!sp.desc, '伙伴设定完整：' + sp.id)
  ok(sp.stages.length === 5, '伙伴进化段数：' + sp.id)
  ok(Array.isArray(sp.branches) && sp.branches.length === 2, '伙伴最终分支：' + sp.id)
  const branchKeys = {}
  sp.branches.forEach((b) => {
    ok(!!b.key && !branchKeys[b.key], '分支 key 唯一：' + sp.id)
    branchKeys[b.key] = true
    ok(!!b.name && !!b.color && !!b.accent, '分支形态完整：' + sp.id)
    ok(['prefix', 'suffix', 'root', 'verbAdj', 'noun', 'long', 'adj'].indexOf(b.metric) >= 0, '分支指标合法：' + sp.id)
  })
  let lastLevel = 0
  sp.stages.forEach((st) => {
    ok(st.level > lastLevel, '进化等级递增：' + sp.id)
    lastLevel = st.level
    ok(!!st.name && !!st.color && !!st.accent, '进化形态完整：' + sp.id)
  })
  ok(sp.unlock.learned >= 0, '伙伴解锁门槛：' + sp.id)
})

console.log('==============================================')
console.log(' 词灵岛内容数据校验')
console.log('==============================================')
console.log(' ✅ 通过 ' + checks + ' 项检查')
console.log(' 词条：' + words.all.length + '（四级 ' + words.cet4.length + ' / 六级 ' + words.cet6.length + '）')
console.log(' 阅读：' + readings.length + ' 篇 / 听力：' + listenings.length + ' 段 / 对话：' + dialogues.length + ' 个')
console.log(' 作文：' + writing.essays.length + ' 篇 / 翻译：' + writing.translations.length + ' 段 / 剧情：' + chapters.length + ' 章')
console.log(' 伙伴：' + pets.list.length + ' 只 × ' + pets.list[0].stages.length + ' 段进化 × 2 条最终分支')
console.log(' 成就：' + achievements.length + ' 项 / 每日一句：' + quotes.length + ' 条')
