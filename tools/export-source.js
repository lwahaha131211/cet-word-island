/**
 * 词灵岛 · 软著源代码导出工具
 * 运行：node tools/export-source.js
 * 生成：
 *   docs/源代码-全量.txt        原创源代码（不含第三方词库数据）
 *   docs/源代码-软著提交版.html 前 30 页 + 后 30 页，每页 50 行，可直接打印为 PDF
 */
const fs = require('fs')
const path = require('path')

const ROOT = path.join(__dirname, '..')
const OUT_DIR = path.join(ROOT, 'docs')
const SKIP_DIRS = ['node_modules', '.git', 'docs', 'tools']
const EXTS = ['.js', '.json', '.wxml', '.wxss']
const SOFTWARE = '词灵岛四六级英语学习软件'
const VERSION = 'V1.0.0'
const PAGE_LINES = 50
const PAGES_EACH_SIDE = 30
// 第三方词库数据不纳入软著源代码文档，避免把他人数据当作原创代码提交
const OMIT_FILES = ['data/cet4-full.js', 'data/cet6-full.js']

if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true })

function walk(dir, out) {
  fs.readdirSync(dir)
    .sort()
    .forEach((name) => {
      const full = path.join(dir, name)
      const stat = fs.statSync(full)
      if (stat.isDirectory()) {
        if (SKIP_DIRS.indexOf(name) === -1) walk(full, out)
      } else if (EXTS.indexOf(path.extname(full)) >= 0) {
        out.push(full)
      }
    })
  return out
}

const files = walk(ROOT, []).filter((file) => {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  return OMIT_FILES.indexOf(rel) === -1
})
const rawLines = []
let totalCodeLines = 0

files.forEach((file) => {
  const rel = path.relative(ROOT, file).replace(/\\/g, '/')
  rawLines.push('/* ============================================================')
  rawLines.push(' * 文件：' + rel)
  rawLines.push(' * 软件：' + SOFTWARE + ' ' + VERSION)
  rawLines.push(' * ============================================================ */')
  const content = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n')
  const fileLines = content.split('\n')
  totalCodeLines += fileLines.length
  fileLines.forEach((line) => rawLines.push(line))
  rawLines.push('')
})

/* 按显示宽度折行：中文按 2 个字符宽度计算，避免打印时自动换行撑破页面 */
function displayWidth(ch) {
  const code = ch.codePointAt(0)
  return code > 0x2e80 ? 2 : 1
}

function wrapLine(line, maxWidth) {
  if (!line) return ['']
  const chars = Array.from(line)
  const out = []
  let current = ''
  let width = 0
  chars.forEach((ch) => {
    const w = displayWidth(ch)
    if (width + w > maxWidth) {
      out.push(current)
      current = ch
      width = w
    } else {
      current += ch
      width += w
    }
  })
  if (current) out.push(current)
  return out
}

const lines = []
rawLines.forEach((line) => {
  wrapLine(line, 86).forEach((part) => lines.push(part))
})

fs.writeFileSync(path.join(OUT_DIR, '源代码-全量.txt'), lines.join('\n'), 'utf8')

const totalLines = lines.length
const totalPages = Math.ceil(totalLines / PAGE_LINES)
const windowLines = PAGES_EACH_SIDE * PAGE_LINES

let selected
let mode
if (totalLines <= windowLines * 2) {
  selected = lines.slice()
  mode = '全部源代码'
} else {
  const head = lines.slice(0, windowLines)
  const tail = lines.slice(totalLines - windowLines)
  selected = head.concat(['', '/* …… 中间部分源代码略 …… */', ''], tail).slice(0, windowLines * 2)
  mode = '前 30 页 + 后 30 页'
}

const pages = []
for (let i = 0; i < selected.length; i += PAGE_LINES) {
  pages.push(selected.slice(i, i + PAGE_LINES))
}

function escapeHtml(str) {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const pageHtml = pages
  .map((pageLines, index) => {
    return (
      '<div class="page">' +
      '<div class="doc-header"><span>' + SOFTWARE + ' ' + VERSION + '</span>' +
      '<span>第 ' + (index + 1) + ' 页 / 共 ' + pages.length + ' 页</span></div>' +
      '<pre>' + escapeHtml(pageLines.join('\n')) + '</pre>' +
      '</div>'
    )
  })
  .join('\n')

const html =
  '<!DOCTYPE html>\n<html lang="zh-CN">\n<head>\n<meta charset="utf-8">\n' +
  '<title>' + SOFTWARE + ' 源代码（软著提交版）</title>\n' +
  '<style>\n' +
  '@page { size: A4; margin: 16mm 14mm; }\n' +
  'body { margin: 0; background: #fff; color: #000; font-family: "Consolas", "Courier New", monospace; }\n' +
  '.page { page-break-after: always; width: 100%; }\n' +
  '.page:last-child { page-break-after: auto; }\n' +
  '.doc-header { display: flex; justify-content: space-between; font-family: "Microsoft YaHei", sans-serif; font-size: 10pt; border-bottom: 1px solid #000; padding-bottom: 4px; margin-bottom: 8px; }\n' +
  'pre { margin: 0; font-size: 8pt; line-height: 1.5; white-space: pre; }\n' +
  '</style>\n</head>\n<body>\n' +
  pageHtml +
  '\n</body>\n</html>\n'

fs.writeFileSync(path.join(OUT_DIR, '源代码-软著提交版.html'), html, 'utf8')

console.log('==============================================')
console.log(' 软著源代码导出完成')
console.log('==============================================')
console.log(' 导出模式   : ' + mode)
console.log(' 源文件数量 : ' + files.length)
console.log(' 第三方数据 : 已排除 cet4-full.js / cet6-full.js')
console.log(' 源代码行数 : ' + totalCodeLines)
console.log(' 合并总行数 : ' + totalLines + '（约 ' + totalPages + ' 页）')
console.log(' 提交版页数 : ' + pages.length + ' 页 × ' + PAGE_LINES + ' 行')
console.log(' 输出文件   : docs/源代码-全量.txt')
console.log('              docs/源代码-软著提交版.html')
