/**
 * 词根拼图工坊
 * 将单词拆成词根/词缀碎片，混入干扰项，让学习者按顺序拼回单词。
 * 这是本产品区别于普通背词软件的核心玩法之一。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const wordsData = require('../../data/words.js')

const DISTRACTORS = [
  'un-', 're-', 'pre-', 'dis-', 'sub-', 'inter-', 'en-',
  '-tion', '-ment', '-able', '-ous', '-ive', '-ly', '-al', '-ful', '-less'
]

function normalize(str) {
  return (str || '').toLowerCase().replace(/[^a-z]/g, '')
}

Page({
  data: {
    levels: [],
    total: 0,
    index: 0,
    level: null,
    slots: [],
    pool: [],
    built: [],
    hintUid: '',
    score: 0,
    combo: 0,
    best: 0,
    progress: 0,
    phase: 'play',
    status: 'idle',
    shake: false,
    showResult: false,
    gained: 0,
    lastLevel: null
  },

  onLoad() {
    this.buildLevels()
  },

  /** 仅挑选词根可完整还原单词的条目，保证拼图有唯一解 */
  buildLevels() {
    const list = wordsData.all.filter((w) => {
      if (!w.roots || w.roots.length < 2) return false
      const joined = normalize(w.roots.map((r) => r.t).join(''))
      return joined === normalize(w.word)
    })
    const picked = []
    const step = Math.max(1, Math.floor(list.length / 12))
    for (let i = 0; i < list.length && picked.length < 12; i += step) {
      picked.push(list[i])
    }
    this.setData({
      levels: picked,
      total: picked.length,
      best: store.getState().puzzle.best,
      score: 0,
      combo: 0,
      phase: 'play'
    })
    if (picked.length) this.startLevel(0)
  },

  startLevel(i) {
    const levels = this.data.levels
    const level = levels[i]
    if (!level) return
    const correct = level.roots.map((r, idx) => ({
      uid: 'c' + idx,
      t: r.t,
      correct: true,
      used: false
    }))
    const poolExtra = DISTRACTORS.filter((d) => {
      return !level.roots.some((r) => r.t === d)
    })
    const wrong = util.sample(poolExtra, 2).map((t, idx) => ({
      uid: 'w' + idx + '_' + i,
      t: t,
      correct: false,
      used: false
    }))
    const pool = util.shuffle(correct.concat(wrong))
    const slots = []
    for (let k = 0; k < correct.length; k++) {
      slots.push({ key: 'slot_' + k, piece: null })
    }
    this.setData({
      index: i,
      level: level,
      pool: pool,
      slots: slots,
      built: [],
      status: 'idle',
      shake: false,
      showResult: false,
      hintUid: '',
      usedHint: false,
      progress: Math.round(((i + 1) / levels.length) * 100)
    })
  },

  tapPiece(e) {
    if (this.data.showResult) return
    const uid = e.currentTarget.dataset.uid
    const piece = this.data.pool.filter((p) => p.uid === uid && !p.used)[0]
    if (!piece) return
    if (this.data.built.length >= this.data.slots.length) {
      wx.showToast({ title: '已经拼满啦，检查一下？', icon: 'none' })
      return
    }
    const pool = this.data.pool.map((p) => (p.uid === uid ? Object.assign({}, p, { used: true }) : p))
    const built = this.data.built.concat([piece])
    const slots = this.data.slots.slice()
    slots[built.length - 1] = { key: slots[built.length - 1].key, piece: piece }
    this.setData({
      pool: pool,
      built: built,
      slots: slots,
      hintUid: '',
      status: 'idle'
    })
  },

  undo() {
    if (!this.data.built.length) return
    const built = this.data.built.slice()
    const last = built.pop()
    const pool = this.data.pool.map((p) => (p.uid === last.uid ? Object.assign({}, p, { used: false }) : p))
    const slots = this.data.slots.slice()
    slots[built.length] = { key: slots[built.length].key, piece: null }
    this.setData({ built: built, pool: pool, slots: slots, status: 'idle' })
  },

  clearAll() {
    const pool = this.data.pool.map((p) => Object.assign({}, p, { used: false }))
    const slots = this.data.slots.map((s) => ({ key: s.key, piece: null }))
    this.setData({ built: [], pool: pool, slots: slots, status: 'idle' })
  },

  hint() {
    if (!this.data.level) return
    const nextIndex = this.data.built.length
    const root = this.data.level.roots[nextIndex]
    if (!root) return
    const target = this.data.pool.filter((p) => !p.used && p.t === root.t)[0]
    if (!target) return
    this.setData({ hintUid: target.uid, usedHint: true })
    wx.showToast({ title: '发光的这块就是下一块', icon: 'none' })
  },

  check() {
    if (this.data.built.length < this.data.slots.length) {
      wx.showToast({ title: '还有空位没拼满哦', icon: 'none' })
      return
    }
    const answer = normalize(this.data.built.map((b) => b.t).join(''))
    if (answer === normalize(this.data.level.word)) {
      const gained = Math.max(4, 10 + this.data.combo * 2 - (this.data.usedHint ? 3 : 0))
      const score = this.data.score + gained
      store.savePuzzleResult(score, this.data.level.id)
      store.logActivity({ exp: 12, fish: 4, correct: 1, minutes: 1 })
      store.vibrate('light')
      this.setData({
        status: 'right',
        showResult: true,
        score: score,
        combo: this.data.combo + 1,
        gained: gained,
        usedHint: false,
        lastLevel: this.data.level
      })
      return
    }
    this.setData({ status: 'wrong', combo: 0, shake: true })
    store.vibrate('heavy')
    setTimeout(() => {
      this.setData({ shake: false })
    }, 500)
    wx.showToast({ title: '顺序不对，再想想词根含义', icon: 'none' })
  },

  next() {
    if (this.data.index + 1 >= this.data.total) {
      this.finish()
      return
    }
    this.startLevel(this.data.index + 1)
  },

  finish() {
    const best = Math.max(this.data.best, this.data.score)
    this.setData({
      phase: 'done',
      best: best,
      showResult: false
    })
  },

  restart() {
    this.buildLevels()
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  noop() {}
})
