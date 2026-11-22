/**
 * 词灵岛 · 页面冒烟测试（开发辅助）
 * 运行：node tools/pagesmoke.js
 * 通过 mock Page / wx，依次加载 20 个页面并触发主要交互，
 * 检查生命周期与事件处理是否存在运行时异常。
 */
const path = require('path')

const storage = {}
const noop = function () {}

const recorder = {
  start: noop,
  stop: noop,
  onStop: noop,
  onError: noop
}

global.wx = {
  getStorageSync(key) {
    return storage[key]
  },
  setStorageSync(key, value) {
    storage[key] = JSON.parse(JSON.stringify(value))
  },
  getSystemInfoSync() {
    return { statusBarHeight: 20, windowWidth: 375, windowHeight: 667 }
  },
  getStorageInfoSync() {
    return { currentSize: 24 }
  },
  showToast: noop,
  showLoading: noop,
  hideLoading: noop,
  showModal(options) {
    if (options && options.success) options.success({ confirm: true, cancel: false })
  },
  navigateTo: noop,
  switchTab: noop,
  redirectTo: noop,
  reLaunch: noop,
  navigateBack: noop,
  vibrateShort: noop,
  setClipboardData(options) {
    if (options && options.success) options.success({})
  },
  createInnerAudioContext() {
    return { play: noop, stop: noop, onEnded: noop, onError: noop, src: '' }
  },
  getRecorderManager() {
    return recorder
  },
  getSetting(options) {
    if (options && options.success) options.success({ authSetting: { 'scope.record': true } })
  },
  authorize(options) {
    if (options && options.success) options.success({})
  },
  openSetting: noop
}

global.getCurrentPages = function () {
  return [{}, {}]
}

let captured = null
global.Page = function (config) {
  captured = config
}
global.Component = function (config) {
  captured = config
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function createInstance(config) {
  const inst = {}
  Object.keys(config).forEach((key) => {
    inst[key] = config[key]
  })
  inst.data = clone(config.data || {})
  inst.setData = function (patch, cb) {
    Object.keys(patch).forEach((key) => {
      inst.data[key] = patch[key]
    })
    if (cb) cb()
  }
  inst.getTabBar = function () {
    return { setSelected: noop }
  }
  return inst
}

function loadPage(relative) {
  captured = null
  const full = path.join(__dirname, '..', relative)
  delete require.cache[require.resolve(full)]
  require(full)
  if (!captured) throw new Error('页面未调用 Page()')
  return createInstance(captured)
}

const results = []

function step(name, fn) {
  try {
    fn()
    results.push({ name: name, ok: true })
  } catch (e) {
    results.push({ name: name, ok: false, error: e && e.message ? e.message : String(e) })
  }
}

/* 让 store 先初始化 */
const store = require('../utils/store.js')
store.init()

/* 1. 首页 */
step('首页 · 加载与刷新', () => {
  const p = loadPage('pages/index/index.js')
  p.onLoad()
  p.onShow()
  p.onClaim({ currentTarget: { dataset: { id: 'new' } } })
  p.goPet()
})

/* 2. 词书 */
step('词书 · 切换、搜索、详情', () => {
  const p = loadPage('pages/books/books.js')
  p.onLoad({ book: 'cet4' })
  p.onShow()
  p.switchBook({ currentTarget: { dataset: { id: 'cet6' } } })
  p.onSearch({ detail: { value: 'ab' } })
  p.onFilter({ currentTarget: { dataset: { key: 'all' } } })
  const first = p.data.filtered[0]
  if (first) p.openWord({ currentTarget: { dataset: { id: first.id } } })
  p.speak()
  p.closeDetail()
  p.startStudy()
  p.startReview()
  p.noop()
})

/* 3. 单词学习：完整走完一组 */
step('单词学习 · 翻卡与三档自评', () => {
  const p = loadPage('pages/study/study.js')
  p.onLoad({ book: 'cet4' })
  p.flip()
  p.speak()
  let guard = 0
  while (p.data.phase === 'learn' && guard < 30) {
    p.flip()
    p.choose({ currentTarget: { dataset: { q: guard % 3 } } })
    guard += 1
  }
  if (p.data.phase !== 'done') throw new Error('学习流程未进入结算，phase=' + p.data.phase)
  p.again()
  p.onUnload()
})

/* 4. 智能复习：答完一组 */
step('智能复习 · 答题与结算', () => {
  const p = loadPage('pages/review/review.js')
  p.onLoad({ book: 'all' })
  let guard = 0
  while (p.data.phase === 'quiz' && guard < 40) {
    p.select({ currentTarget: { dataset: { index: 0 } } })
    p.next()
    guard += 1
  }
  if (p.data.phase !== 'done') throw new Error('复习流程未进入结算，phase=' + p.data.phase)
  p.again()
  p.onUnload()
})

/* 5. 词根拼图：完成一关 */
step('词根拼图 · 拼接与判定', () => {
  const p = loadPage('pages/puzzle/puzzle.js')
  p.onLoad()
  p.hint()
  const level = p.data.level
  if (!level) throw new Error('未生成拼图关卡')
  level.roots.forEach((root) => {
    const piece = p.data.pool.filter((x) => x.correct && !x.used && x.t === root.t)[0]
    if (piece) p.tapPiece({ currentTarget: { dataset: { uid: piece.uid } } })
  })
  p.check()
  if (!p.data.showResult) throw new Error('正确拼写未判定通过')
  p.next()
  p.noop()
})

/* 6. 影子跟读：直接做题并结算 */
step('影子跟读 · 材料切换与听力题', () => {
  const p = loadPage('pages/listening/listening.js')
  p.onLoad({ id: 'l1' })
  p.togglePlay()
  p.pausePlay()
  p.playSentence({ currentTarget: { dataset: { index: 0 } } })
  p.toggleScript()
  p.selectMaterial({ currentTarget: { dataset: { id: 'l2' } } })
  p.startQuiz()
  if (p.data.phase !== 'quiz') throw new Error('未进入听力题')
  let guard = 0
  while (p.data.phase === 'quiz' && guard < 10) {
    p.chooseQuiz({ currentTarget: { dataset: { index: 0 } } })
    p.nextQuiz()
    guard += 1
  }
  if (p.data.phase !== 'done') throw new Error('听力流程未结算')
  p.restart()
  p.onUnload()
})

/* 7. 阅读闯关 */
step('阅读闯关 · 阅读与答题', () => {
  const p = loadPage('pages/reading/reading.js')
  p.onLoad({ id: 'r1' })
  p.showWord({ currentTarget: { dataset: { index: 0 } } })
  p.speakWord()
  p.closeWord()
  p.startQuiz()
  let guard = 0
  while (p.data.phase === 'quiz' && guard < 10) {
    p.choose({ currentTarget: { dataset: { index: 1 } } })
    p.next()
    guard += 1
  }
  if (p.data.phase !== 'done') throw new Error('阅读流程未结算')
  p.retry()
  p.onUnload()
})

/* 8. 情景对话 */
step('情景对话 · 四轮角色扮演', () => {
  const p = loadPage('pages/dialogue/dialogue.js')
  p.onLoad({ id: 'd1' })
  let guard = 0
  while (p.data.phase === 'chat' && guard < 8) {
    p.choose({ currentTarget: { dataset: { index: 0 } } })
    p.nextTurn()
    guard += 1
  }
  if (p.data.phase !== 'done') throw new Error('对话流程未结算')
  p.speakLine({ currentTarget: { dataset: { index: 0 } } })
  p.restart()
})

/* 9. 写作工坊 */
step('写作工坊 · 输入与切换', () => {
  const p = loadPage('pages/writing/writing.js')
  p.onLoad()
  p.onInput({ detail: { value: 'Reading classics is important for students. It helps us think deeply and express ideas clearly.' } })
  p.switchTab({ currentTarget: { dataset: { tab: 'trans' } } })
  p.onTransInput({ detail: { value: 'Tea is a common drink in China.' } })
  p.toggleRef()
  p.selectTranslation({ currentTarget: { dataset: { index: 1 } } })
  p.switchTab({ currentTarget: { dataset: { tab: 'essay' } } })
  p.toggleSample()
  p.onUnload()
})

/* 10. 知识花园 */
step('知识花园 · 渲染与详情', () => {
  const p = loadPage('pages/garden/garden.js')
  p.onShow()
  if (p.data.plots.length) {
    p.openPlot({ currentTarget: { dataset: { index: 0 } } })
    p.closeDetail()
  }
  p.noop()
})

/* 11. 备考计划 */
step('备考计划 · 修改与保存', () => {
  const p = loadPage('pages/plan/plan.js')
  p.onLoad()
  p.increase()
  p.decrease()
  p.onTargetChange({ detail: { value: 1 } })
  p.save()
})

/* 12. 学习统计 */
step('学习统计 · 刷新', () => {
  const p = loadPage('pages/stats/stats.js')
  p.onShow()
  if (!p.data.stats) throw new Error('统计数据为空')
})

/* 13. 成就墙 */
step('成就墙 · 筛选', () => {
  const p = loadPage('pages/achievements/achievements.js')
  p.onShow()
  p.onFilter({ currentTarget: { dataset: { key: 'locked' } } })
  p.onFilter({ currentTarget: { dataset: { key: 'all' } } })
})

/* 14. 错题病历 */
step('错题病历 · 展开与治愈', () => {
  const p = loadPage('pages/wrongbook/wrongbook.js')
  p.onShow()
  if (p.data.view.length) {
    const item = p.data.view[0]
    p.toggle({ currentTarget: { dataset: { id: item.id } } })
    p.resolve({ currentTarget: { dataset: { wordid: item.wordId } } })
  }
})

/* 15. 模拟考场 */
step('模拟考场 · 全流程', () => {
  const p = loadPage('pages/exam/exam.js')
  p.onLoad()
  p.onShow()
  p.start()
  for (let i = 0; i < 20; i++) {
    p.choose({ currentTarget: { dataset: { index: i % 4 } } })
    p.next()
  }
  p.toggleSheet()
  p.jump({ currentTarget: { dataset: { index: 3 } } })
  p.finish()
  if (p.data.phase !== 'done') throw new Error('模考未结算')
  p.onUnload()
})

/* 16. 剧情章节 */
step('剧情章节 · 打开与完成', () => {
  const p = loadPage('pages/chapters/chapters.js')
  p.onShow()
  const chapter = p.data.chapters.filter((c) => c.unlocked)[0]
  if (!chapter) throw new Error('没有已解锁章节')
  p.openChapter({ currentTarget: { dataset: { id: chapter.id } } })
  p.complete()
  p.noop()
})

/* 17. 伙伴小窝 */
step('伙伴小窝 · 切换、互动与换装', () => {
  const p = loadPage('pages/pet/pet.js')
  p.onShow()
  if (p.data.branches.length !== 2) throw new Error('进化分支数据异常')
  if (!p.data.profile) throw new Error('词汇结构画像为空')
  if (p.data.collection.length > 1) {
    p.switchPet({ currentTarget: { dataset: { id: 'ink' } } })
    p.switchPet({ currentTarget: { dataset: { id: 'sprout' } } })
  }
  p.feed()
  p.onPetTap()
  p.openWardrobe()
  p.chooseAccessory({ currentTarget: { dataset: { id: 'none' } } })
  p.closeWardrobe()
  p.noop()
})

/* 18. 我的 */
step('我的 · 编辑资料', () => {
  const p = loadPage('pages/profile/profile.js')
  p.onShow()
  p.openEdit()
  p.onNameInput({ detail: { value: '测试昵称' } })
  p.chooseAvatar({ currentTarget: { dataset: { avatar: '🦊' } } })
  p.saveProfile()
  p.noop()
})

/* 19. 设置 */
step('设置 · 开关与提醒', () => {
  const p = loadPage('pages/settings/settings.js')
  p.onShow()
  p.onSwitch({ currentTarget: { dataset: { key: 'sound' } }, detail: { value: false } })
  p.onReminder({ detail: { value: '21:30' } })
})

/* 20. 关于 */
step('关于 · 加载与复制', () => {
  const p = loadPage('pages/about/about.js')
  p.onLoad()
  p.copyInfo()
})

/* 汇总 */
const failed = results.filter((r) => !r.ok)
console.log('==============================================')
console.log(' 词灵岛页面冒烟测试')
console.log('==============================================')
results.forEach((r) => {
  console.log((r.ok ? ' ✅ ' : ' ❌ ') + r.name + (r.ok ? '' : ' :: ' + r.error))
})
console.log('----------------------------------------------')
console.log(' 通过 ' + (results.length - failed.length) + ' / ' + results.length + ' 个页面')
if (failed.length) process.exitCode = 1
