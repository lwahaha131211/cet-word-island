/**
 * 词灵岛 · 通用工具函数
 * 日期、随机、选项生成、写作诊断、跟读评分等纯函数集合。
 */

const LINK_WORDS = [
  'however', 'therefore', 'moreover', 'furthermore', 'in addition', 'besides',
  'consequently', 'nevertheless', 'meanwhile', 'whereas', 'although', 'though',
  'despite', 'in conclusion', 'as a result', 'for instance', 'for example',
  'on the one hand', 'on the other hand', 'in contrast', 'what is more',
  'firstly', 'secondly', 'finally', 'above all', 'to sum up'
]

const COMMON_WORDS = [
  'the', 'and', 'that', 'have', 'for', 'not', 'with', 'you', 'this', 'but',
  'his', 'from', 'they', 'say', 'her', 'she', 'will', 'one', 'all', 'would',
  'there', 'their', 'what', 'out', 'about', 'who', 'get', 'which', 'when',
  'make', 'can', 'like', 'time', 'just', 'him', 'know', 'take', 'people',
  'into', 'year', 'your', 'good', 'some', 'could', 'them', 'see', 'other',
  'than', 'then', 'now', 'look', 'only', 'come', 'its', 'over', 'think',
  'also', 'back', 'after', 'use', 'two', 'how', 'our', 'work', 'first',
  'well', 'way', 'even', 'new', 'want', 'because', 'any', 'these', 'give',
  'day', 'most', 'us', 'is', 'are', 'was', 'were', 'be', 'been', 'has',
  'had', 'do', 'does', 'did', 'a', 'an', 'of', 'in', 'to', 'it', 'on',
  'at', 'by', 'as', 'or', 'if', 'so', 'no', 'my', 'me', 'we', 'he', 'she'
]

function padZero(n) {
  return n < 10 ? '0' + n : '' + n
}

function formatDate(ts, fmt) {
  const d = ts instanceof Date ? ts : new Date(ts || Date.now())
  const map = {
    YYYY: d.getFullYear(),
    MM: padZero(d.getMonth() + 1),
    DD: padZero(d.getDate()),
    HH: padZero(d.getHours()),
    mm: padZero(d.getMinutes()),
    ss: padZero(d.getSeconds())
  }
  const pattern = fmt || 'YYYY-MM-DD'
  return pattern.replace(/YYYY|MM|DD|HH|mm|ss/g, (k) => map[k])
}

function weekdayCN(ts) {
  const d = ts instanceof Date ? ts : new Date(ts || Date.now())
  return ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'][d.getDay()]
}

function greeting() {
  const h = new Date().getHours()
  if (h < 6) return '夜深了，伙伴在等你'
  if (h < 11) return '早上好，开启今天的词海航行'
  if (h < 14) return '中午好，来背几个单词吧'
  if (h < 18) return '下午好，保持专注'
  if (h < 22) return '晚上好，今天也要打卡哦'
  return '晚安，睡前复习效果更好'
}

/** 计算距目标日期还有几天（当天为 0） */
function daysUntil(dateStr) {
  if (!dateStr) return 0
  const parts = dateStr.split('-')
  const target = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]))
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())
  return Math.round((target.getTime() - today.getTime()) / 86400000)
}

function shuffle(arr) {
  const a = arr.slice()
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    const tmp = a[i]
    a[i] = a[j]
    a[j] = tmp
  }
  return a
}

function sample(arr, n) {
  return shuffle(arr).slice(0, n)
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function percent(part, total) {
  if (!total) return 0
  return Math.max(0, Math.min(100, Math.round((part / total) * 100)))
}

function formatDuration(minutes) {
  const m = Math.round(minutes || 0)
  if (m < 60) return m + ' 分钟'
  const h = Math.floor(m / 60)
  const rest = m % 60
  return rest > 0 ? h + ' 小时 ' + rest + ' 分' : h + ' 小时'
}

function truncate(str, len) {
  if (!str) return ''
  return str.length > len ? str.slice(0, len) + '…' : str
}

/** 根据中文释义生成四选一题目 */
function buildOptions(word, pool, count) {
  const n = count || 4
  const correct = word.cn
  const used = {}
  used[correct] = true
  const wrong = []
  shuffle(pool).forEach((w) => {
    if (wrong.length >= n - 1) return
    if (!w || w.id === word.id) return
    if (!w.cn || used[w.cn]) return
    used[w.cn] = true
    wrong.push(w.cn)
  })
  const fallback = ['放弃；抛弃', '大量的；广阔的', '促进；推动', '明显的；显著的', '减少；降低']
  let i = 0
  while (wrong.length < n - 1) {
    if (!used[fallback[i]]) {
      used[fallback[i]] = true
      wrong.push(fallback[i])
    }
    i++
  }
  const options = shuffle(
    wrong.concat([correct]).map((text, index) => ({
      text: text,
      key: 'opt_' + index
    }))
  )
  let answer = 0
  options.forEach((o, idx) => {
    if (o.text === correct) answer = idx
  })
  return { options: options, answer: answer }
}

/** 取当天固定的一句英文 */
function dailyQuote(quotes) {
  const list = quotes || []
  if (!list.length) return null
  const seed = new Date().getFullYear() * 1000 + new Date().getMonth() * 40 + new Date().getDate()
  return list[seed % list.length]
}

/** 英文写作诊断：从词数、句式、连接词、词汇丰富度四个维度给分 */
function analyzeWriting(text) {
  const raw = (text || '').trim()
  const words = raw ? raw.split(/\s+/).filter((w) => /[a-zA-Z]/.test(w)) : []
  const sentences = raw
    ? raw
        .split(/[.!?]+/)
        .map((s) => s.trim())
        .filter((s) => s.length > 0)
    : []
  const wordCount = words.length
  const sentenceCount = sentences.length
  const avgLen = sentenceCount ? Math.round(wordCount / sentenceCount) : 0
  const lower = raw.toLowerCase()

  const usedLinks = []
  LINK_WORDS.forEach((l) => {
    if (lower.indexOf(l) >= 0 && usedLinks.length < 8) usedLinks.push(l)
  })

  const clean = words.map((w) => w.toLowerCase().replace(/[^a-z']/g, '')).filter(Boolean)
  const unique = {}
  clean.forEach((w) => {
    unique[w] = true
  })
  const uniqueCount = Object.keys(unique).length
  const uniqueRate = wordCount ? uniqueCount / wordCount : 0

  let longWords = 0
  clean.forEach((w) => {
    if (w.length >= 8 && COMMON_WORDS.indexOf(w) === -1) longWords += 1
  })
  const longRate = wordCount ? longWords / wordCount : 0

  let score = 0
  if (wordCount >= 120) score += 30
  else if (wordCount >= 100) score += 24
  else if (wordCount >= 80) score += 18
  else if (wordCount >= 50) score += 10
  else score += Math.round(wordCount / 6)

  if (sentenceCount >= 8) score += 15
  else if (sentenceCount >= 5) score += 12
  else if (sentenceCount >= 3) score += 8
  else score += 3

  if (avgLen >= 12 && avgLen <= 22) score += 15
  else if (avgLen > 8) score += 9
  else score += 4

  score += Math.min(15, usedLinks.length * 3)
  score += Math.min(15, Math.round(uniqueRate * 40))
  score += Math.min(10, Math.round(longRate * 80))
  score = clamp(score, 0, 100)

  const advice = []
  if (wordCount < 100) advice.push('篇幅偏短：四级作文建议 120 词左右，可补充一个具体例子。')
  if (sentenceCount < 5) advice.push('句式偏单一：尝试加入定语从句、状语从句，让句子有长有短。')
  if (avgLen > 24) advice.push('句子过长：适当拆分为短句，避免语法失控。')
  if (usedLinks.length < 3) advice.push('衔接不足：可使用 however / therefore / in addition 等连接词。')
  if (uniqueRate < 0.55 && wordCount > 40) advice.push('重复用词较多：尝试用同义替换，例如 important → crucial。')
  if (longRate < 0.08 && wordCount > 60) advice.push('词汇偏基础：可加入 2-3 个四六级高频词提升表达。')
  if (!advice.length) advice.push('整体结构完整、表达流畅，继续保持这种写作节奏。')

  let grade = '继续加油'
  if (score >= 85) grade = '优秀'
  else if (score >= 70) grade = '良好'
  else if (score >= 55) grade = '合格'

  return {
    wordCount: wordCount,
    sentenceCount: sentenceCount,
    avgLen: avgLen,
    uniqueCount: uniqueCount,
    uniqueRate: Math.round(uniqueRate * 100),
    links: usedLinks,
    longWords: longWords,
    score: score,
    grade: grade,
    advice: advice
  }
}

/** 影子跟读评分：结合语速与文本匹配度给出星级（示例算法） */
function scoreShadowing(text, durationSec) {
  const words = (text || '').split(/\s+/).filter(Boolean).length
  const dur = Math.max(1, Number(durationSec) || 1)
  const wpm = Math.round((words / dur) * 60)
  let score = 60
  if (wpm >= 90 && wpm <= 170) score += 25
  else if (wpm >= 70 && wpm < 90) score += 15
  else if (wpm > 170 && wpm <= 200) score += 12
  else score += 5
  if (dur > 1.2) score += 8
  if (words >= 6) score += 5
  score = clamp(score, 55, 98)
  let stars = 3
  if (score >= 90) stars = 5
  else if (score >= 80) stars = 4
  else if (score >= 70) stars = 3
  else stars = 2
  return { score: score, stars: stars, wpm: wpm, duration: dur }
}

/** 错因 → 复习处方 */
function prescription(reason) {
  const map = {
    形近混淆: '把易混词放在同一张对比卡上，先看词根再看尾缀，连续 3 天各复习一次。',
    音近听错: '跟读标准发音 5 遍，边读边在纸上写音标，重点区分重音位置。',
    遗忘: '按 10 分钟 → 1 天 → 2 天的间隔重新见面，并在例句中回忆词义。',
    语境误解: '回到原句，用「谁 + 做了什么 + 结果」复述句意，再判断词义。'
  }
  return map[reason] || map['遗忘']
}

/** 根据熟练度返回描述 */
function levelText(level) {
  if (level >= 5) return '已掌握'
  if (level >= 4) return '较熟练'
  if (level >= 2) return '学习中'
  if (level >= 1) return '刚认识'
  return '未学习'
}

module.exports = {
  LINK_WORDS: LINK_WORDS,
  padZero: padZero,
  formatDate: formatDate,
  weekdayCN: weekdayCN,
  greeting: greeting,
  daysUntil: daysUntil,
  shuffle: shuffle,
  sample: sample,
  clamp: clamp,
  percent: percent,
  formatDuration: formatDuration,
  truncate: truncate,
  buildOptions: buildOptions,
  dailyQuote: dailyQuote,
  analyzeWriting: analyzeWriting,
  scoreShadowing: scoreShadowing,
  prescription: prescription,
  levelText: levelText
}
