/**
 * 词灵岛 · 工程自检脚本（开发辅助）
 * 运行：node tools/validate.js
 * 校验 JSON、JS 语法、WXML 标签闭合、页面文件完整性与路由引用。
 */
const fs = require('fs')
const path = require('path')
const vm = require('vm')

const ROOT = path.join(__dirname, '..')
const SKIP = ['node_modules', '.git', 'tools', 'docs']
const VOID_TAGS = [
  'input', 'image', 'switch', 'icon', 'progress', 'checkbox', 'radio',
  'slider', 'import', 'include', 'wxs', 'camera', 'live-player',
  'live-pusher', 'map', 'canvas', 'ad'
]
const errors = []
const stats = { js: 0, json: 0, wxml: 0, wxss: 0, lines: 0, files: 0 }

function walk(dir, out) {
  fs.readdirSync(dir).forEach((name) => {
    const full = path.join(dir, name)
    const stat = fs.statSync(full)
    if (stat.isDirectory()) {
      if (SKIP.indexOf(name) === -1) walk(full, out)
    } else {
      out.push(full)
    }
  })
  return out
}

const files = walk(ROOT, [])
const rel = (f) => path.relative(ROOT, f).replace(/\\/g, '/')

files.forEach((file) => {
  const ext = path.extname(file)
  const content = fs.readFileSync(file, 'utf8')
  stats.files += 1
  stats.lines += content.split(/\r?\n/).length

  if (ext === '.js') {
    stats.js += 1
    try {
      new vm.Script(content, { filename: file })
    } catch (e) {
      errors.push('JS 语法错误 ' + rel(file) + ' :: ' + e.message)
    }
  } else if (ext === '.json') {
    stats.json += 1
    try {
      JSON.parse(content)
    } catch (e) {
      errors.push('JSON 解析失败 ' + rel(file) + ' :: ' + e.message)
    }
  } else if (ext === '.wxml') {
    stats.wxml += 1
    checkWxml(file, content)
  } else if (ext === '.wxss') {
    stats.wxss += 1
    checkWxss(file, content)
  }
})

function checkWxss(file, content) {
  const open = (content.match(/{/g) || []).length
  const close = (content.match(/}/g) || []).length
  if (open !== close) {
    errors.push('WXSS 花括号不匹配 ' + rel(file) + ' :: {' + open + ' }' + close)
  }
}

function tokenizeTags(src) {
  const out = []
  let i = 0
  while (i < src.length) {
    if (src[i] === '<') {
      if (src.substr(i, 4) === '<!--') {
        const end = src.indexOf('-->', i)
        i = end === -1 ? src.length : end + 3
        continue
      }
      let j = i + 1
      let quote = null
      while (j < src.length) {
        const c = src[j]
        if (quote) {
          if (c === quote) quote = null
        } else if (c === '"' || c === "'") {
          quote = c
        } else if (c === '>') {
          break
        }
        j++
      }
      out.push(src.slice(i, j + 1))
      i = j + 1
    } else {
      i++
    }
  }
  return out
}

function checkWxml(file, content) {
  const tags = tokenizeTags(content)
  const stack = []
  tags.forEach((tag) => {
    const m = tag.match(/^<\s*(\/?)\s*([a-zA-Z][\w-]*)/)
    if (!m) return
    const closing = m[1] === '/'
    const name = m[2]
    const selfClose = /\/\s*>$/.test(tag)
    if (closing) {
      const last = stack.pop()
      if (last !== name) {
        errors.push(
          'WXML 标签闭合异常 ' + rel(file) + ' :: 期望 </' + (last || '空') + '>，实际 </' + name + '>'
        )
      }
    } else if (!selfClose && VOID_TAGS.indexOf(name) === -1) {
      stack.push(name)
    }
  })
  if (stack.length) {
    errors.push('WXML 存在未闭合标签 ' + rel(file) + ' :: ' + stack.join(','))
  }
}

/* 页面完整性 */
let appJson = {}
try {
  appJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'app.json'), 'utf8'))
} catch (e) {
  errors.push('app.json 无法读取')
}

const pages = appJson.pages || []
pages.forEach((p) => {
  ;['.js', '.wxml', '.wxss', '.json'].forEach((ext) => {
    const file = path.join(ROOT, p + ext)
    if (!fs.existsSync(file)) errors.push('页面文件缺失 ' + p + ext)
  })
})

/* 路由引用 */
const pageSet = {}
pages.forEach((p) => {
  pageSet['/' + p] = true
})
const routeRe = /url:\s*['"](\/pages\/[^'"?]+)/g
files.forEach((file) => {
  if (path.extname(file) !== '.js') return
  const content = fs.readFileSync(file, 'utf8')
  let m
  while ((m = routeRe.exec(content))) {
    if (!pageSet[m[1]]) {
      errors.push('未注册的路由 ' + m[1] + ' （' + rel(file) + '）')
    }
  }
})

/* 组件引用 */
const using = appJson.usingComponents || {}
Object.keys(using).forEach((name) => {
  const p = using[name]
  const base = path.join(ROOT, p)
  ;['.js', '.json', '.wxml', '.wxss'].forEach((ext) => {
    if (!fs.existsSync(base + ext)) {
      errors.push('组件文件缺失 ' + p + ext)
    }
  })
})

/* WXML 事件处理函数必须存在于对应 JS */
files.forEach((file) => {
  if (path.extname(file) !== '.wxml') return
  const jsFile = file.replace(/\.wxml$/, '.js')
  if (!fs.existsSync(jsFile)) return
  const wxml = fs.readFileSync(file, 'utf8')
  const js = fs.readFileSync(jsFile, 'utf8')
  const re = /(?:bind|catch)[a-z]+="([A-Za-z_$][\w$]*)"/g
  let m
  while ((m = re.exec(wxml))) {
    const fn = m[1]
    const fnRe = new RegExp('(^|[^\\w$])' + fn + '\\s*\\(')
    if (!fnRe.test(js)) {
      errors.push('缺少事件处理函数 ' + fn + ' （' + rel(file) + '）')
    }
  }
  const urlRe = /data-url="(\/pages\/[^"{}]+)"/g
  while ((m = urlRe.exec(wxml))) {
    if (!pageSet[m[1]]) {
      errors.push('未注册的页面路径 ' + m[1] + ' （' + rel(file) + '）')
    }
  }
})

/* TabBar 页面必须已注册 */
if (appJson.tabBar && appJson.tabBar.list) {
  appJson.tabBar.list.forEach((item) => {
    if (!pageSet['/' + item.pagePath]) {
      errors.push('TabBar 页面未注册 ' + item.pagePath)
    }
  })
  if (!fs.existsSync(path.join(ROOT, 'custom-tab-bar/index.js'))) {
    errors.push('custom-tab-bar 组件缺失')
  }
}

/* 输出结果 */
console.log('==============================================')
console.log(' 词灵岛工程自检')
console.log('==============================================')
console.log(' 文件总数 : ' + stats.files)
console.log(' JS 文件  : ' + stats.js)
console.log(' JSON 文件: ' + stats.json)
console.log(' WXML 文件: ' + stats.wxml)
console.log(' WXSS 文件: ' + stats.wxss)
console.log(' 代码行数 : ' + stats.lines)
console.log(' 页面数量 : ' + pages.length)
console.log('----------------------------------------------')

if (errors.length) {
  console.log('发现 ' + errors.length + ' 个问题：')
  errors.forEach((e, i) => console.log(' ' + (i + 1) + '. ' + e))
  process.exitCode = 1
} else {
  console.log('✅ 全部检查通过')
}
