/**
 * 词灵岛 · 四六级词库构建脚本（开发辅助）
 * 运行：node tools/build-vocab.js
 * 读取 tools/tmp/cet4_raw.json / cet6_raw.json，
 * 生成 data/cet4-full.js 与 data/cet6-full.js 紧凑数组。
 *
 * 数据来源：开源词库项目 qwerty-learner（GPL-3.0）
 * 注意：GPL-3.0 具有传染性，生成的数据仅用于本地学习演示；
 * 对外发布前请替换为已授权词库，或按 GPL-3.0 合规开源。
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const TMP = path.join(__dirname, 'tmp')

function normalizePhone(word) {
  let phone = String(word || '').trim()
  if (!phone) return ''
  phone = phone.replace(/\u200b/g, '').replace(/'/g, 'ˈ').replace(/\s+/g, ' ')
  if (phone.charAt(0) !== '/') phone = '/' + phone
  if (phone.charAt(phone.length - 1) !== '/') phone = phone + '/'
  return phone
}

function normalizeCn(item) {
  const trans = Array.isArray(item.trans) ? item.trans : []
  let text = trans.join('；')
  text = text
    .replace(/\s*([，；、。：！？])\s*/g, '$1')
    .replace(/\s+/g, ' ')
    .trim()
  return text
}

function extractPos(item) {
  const trans = Array.isArray(item.trans) ? item.trans : []
  const text = trans.join(' ')
  const found = []
  const re = /\((n|v|vt|vi|adj|adv|prep|conj|pron|num|art|int|aux|abbr)\.?\)/gi
  let m
  while ((m = re.exec(text))) {
    let p = m[1].toLowerCase()
    if (p === 'vt' || p === 'vi') p = 'v'
    if (found.indexOf(p) === -1) found.push(p)
  }
  return found.length ? found.join('/') + '.' : ''
}

function cleanCn(item) {
  let text = normalizeCn(item)
  text = text.replace(/\s*\((n|v|vt|vi|adj|adv|prep|conj|pron|num|art|int|aux|abbr)\.?\)\s*/gi, '')
  return text.replace(/[；;]\s*$/g, '').trim()
}

function build(rawFile, outFile, posMap) {
  const raw = JSON.parse(fs.readFileSync(path.join(TMP, rawFile), 'utf8'))
  const rows = []
  const seen = {}
  raw.forEach((item) => {
    const word = String(item.name || '').trim().toLowerCase()
    if (!word || seen[word]) return
    const cn = cleanCn(item)
    if (!cn) return
    seen[word] = true
    let phone = item.usphone || item.ukphone || ''
    rows.push([word, normalizePhone(phone), cn, extractPos(item) || (posMap && posMap[word]) || ''])
  })
  rows.sort((a, b) => (a[0] < b[0] ? -1 : a[0] > b[0] ? 1 : 0))

  const lines = []
  lines.push('/**')
  lines.push(' * 词灵岛 · 四六级词库（自动生成，请勿手工编辑）')
  lines.push(' * 数据来源：qwerty-learner（GPL-3.0，仅用于本地演示）')
  lines.push(' * 结构：[单词, 音标, 中文释义, 词性]')
  lines.push(' * 共 ' + rows.length + ' 条')
  lines.push(' */')
  lines.push('module.exports = [')
  rows.forEach((r, index) => {
    lines.push('  ' + JSON.stringify(r) + (index < rows.length - 1 ? ',' : ''))
  })
  lines.push(']')
  lines.push('')
  fs.writeFileSync(path.join(ROOT, 'data', outFile), lines.join('\n'), 'utf8')
  console.log(outFile + ': ' + rows.length + ' 条')
  return rows
}

const c6 = build('cet6_raw.json', 'cet6-full.js')
const posMap = {}
c6.forEach((r) => {
  if (r[3]) posMap[r[0]] = r[3]
})
const c4 = build('cet4_raw.json', 'cet4-full.js', posMap)

const all = {}
c4.forEach((r) => {
  all[r[0]] = true
})
const c6Only = c6.filter((r) => !all[r[0]])
console.log('四级：' + c4.length)
console.log('六级原始：' + c6.length + '，去重后新增：' + c6Only.length)
console.log('合并唯一词：' + (c4.length + c6Only.length))
