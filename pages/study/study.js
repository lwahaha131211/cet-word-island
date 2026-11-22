/**
 * 单词学习页
 * 流程：取新词队列 → 翻卡记忆 → 三档自评（不认识/模糊/认识）
 *       → 调用 store.submitWord 写入间隔复习计划 → 会话结算。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const audio = require('../../utils/audio.js')
const wordsData = require('../../data/words.js')

Page({
  data: {
    bookId: 'cet4',
    bookName: '',
    phase: 'learn',
    queue: [],
    total: 0,
    index: 0,
    word: null,
    wordSize: 92,
    backWordSize: 56,
    flipped: false,
    speaking: false,
    showPhonetic: true,
    progress: 0,
    session: {
      known: 0,
      fuzzy: 0,
      unknown: 0,
      exp: 0
    },
    result: null,
    pet: null,
    achievements: [],
    newPets: [],
    levelUp: false
  },

  onLoad(options) {
    const bookId = options && options.book === 'cet6' ? 'cet6' : 'cet4'
    const book = wordsData.books.filter((b) => b.id === bookId)[0]
    this.setData({
      bookId: bookId,
      bookName: book ? book.name : '四级全量词',
      showPhonetic: store.getState().settings.showPhonetic
    })
    this.startSession()
    this.startedAt = Date.now()
    this.minutesAdded = false
  },

  onUnload() {
    this.finishMinutes()
  },

  /** 根据单词长度计算字号，避免长词溢出卡片 */
  calcWordSize(word) {
    const len = Math.max(3, (word || '').length)
    return {
      wordSize: Math.max(26, Math.min(92, Math.floor(620 / len))),
      backWordSize: Math.max(24, Math.min(56, Math.floor(460 / len)))
    }
  },

  /** 组卷：优先取每日新词目标数量 */
  startSession() {
    const state = store.getState()
    const limit = Math.max(5, state.profile.dailyNew || 15)
    const queue = store.getNewWords(wordsData.getBook(this.data.bookId), limit)
    if (!queue.length) {
      this.setData({
        phase: 'empty',
        total: 0,
        queue: []
      })
      return
    }
    const size = this.calcWordSize(queue[0].word)
    this.setData({
      phase: 'learn',
      queue: queue,
      total: queue.length,
      index: 0,
      word: queue[0],
      wordSize: size.wordSize,
      backWordSize: size.backWordSize,
      flipped: false,
      progress: Math.round((1 / queue.length) * 100),
      session: { known: 0, fuzzy: 0, unknown: 0, exp: 0 },
      result: null,
      achievements: [],
      newPets: [],
      levelUp: false
    })
    this.startedAt = Date.now()
    this.minutesAdded = false
  },

  /** 朗读：示例工程未内置音频，展示音标与音波动画 */
  speak() {
    if (!this.data.word) return
    if (!this.data.word.phonetic) {
      wx.showToast({ title: '暂无音标', icon: 'none' })
      return
    }
    audio.playWord(this.data.word.word)
    this.setData({ speaking: true })
    setTimeout(() => {
      this.setData({ speaking: false })
    }, 1000)
    wx.showToast({
      title: this.data.word.phonetic,
      icon: 'none',
      duration: 1000
    })
  },

  flip() {
    this.setData({ flipped: !this.data.flipped })
  },

  /** 三档自评 */
  choose(e) {
    const quality = Number(e.currentTarget.dataset.q)
    const word = this.data.word
    if (!word) return

    const res = store.submitWord(word, quality)
    if (quality === 0) {
      store.addWrong(word.id, '遗忘', { word: word.word, cn: word.cn })
    }
    if (quality === 2) {
      store.vibrate('light')
    }

    const session = Object.assign({}, this.data.session)
    if (quality === 2) session.known += 1
    else if (quality === 1) session.fuzzy += 1
    else session.unknown += 1
    session.exp += quality === 2 ? 10 : quality === 1 ? 7 : 5

    const achievements = this.data.achievements.slice()
    if (res.newAchievements && res.newAchievements.length) {
      res.newAchievements.forEach((a) => {
        achievements.push(a)
      })
    }

    const newPets = this.data.newPets.slice()
    if (res.newPets && res.newPets.length) {
      res.newPets.forEach((p) => {
        newPets.push(p)
      })
    }

    const nextIndex = this.data.index + 1
    const levelUp = this.data.levelUp || res.levelUp

    if (nextIndex >= this.data.queue.length) {
      this.setData({
        session: session,
        achievements: achievements,
        newPets: newPets,
        levelUp: levelUp
      })
      this.finish()
      return
    }

    const nextWord = this.data.queue[nextIndex]
    const size = this.calcWordSize(nextWord.word)
    this.setData({
      session: session,
      achievements: achievements,
      newPets: newPets,
      levelUp: levelUp,
      index: nextIndex,
      word: nextWord,
      wordSize: size.wordSize,
      backWordSize: size.backWordSize,
      flipped: false,
      progress: Math.round(((nextIndex + 1) / this.data.queue.length) * 100)
    })

    wx.showToast({
      title: quality === 2 ? '记住啦 +10 词力' : quality === 1 ? '模糊，明天再见' : '已加入复习队列',
      icon: 'none',
      duration: 700
    })
  },

  /** 结算 */
  finish() {
    this.finishMinutes()
    const s = this.data.session
    const total = s.known + s.fuzzy + s.unknown
    const accuracy = total ? Math.round((s.known / total) * 100) : 0
    let comment = '今天的单词都喂给伙伴啦，继续保持！'
    if (accuracy >= 85) comment = '状态超好！伙伴开心得转了三圈。'
    else if (accuracy < 50) comment = '别急，明天复习一遍就会更牢。'

    this.setData({
      phase: 'done',
      pet: store.getPetView(),
      result: {
        total: total,
        known: s.known,
        fuzzy: s.fuzzy,
        unknown: s.unknown,
        exp: s.exp,
        accuracy: accuracy,
        comment: comment,
        minutes: Math.max(1, Math.round((Date.now() - (this.startedAt || Date.now())) / 60000))
      }
    })
  },

  finishMinutes() {
    if (this.minutesAdded || !this.startedAt) return
    const minutes = (Date.now() - this.startedAt) / 60000
    if (minutes >= 0.5) {
      store.addMinutes(minutes)
    }
    this.minutesAdded = true
  },

  again() {
    this.startSession()
  },

  goReview() {
    wx.redirectTo({ url: '/pages/review/review?book=' + this.data.bookId })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  back() {
    const pages = getCurrentPages()
    if (pages.length > 1) {
      wx.navigateBack()
    } else {
      wx.switchTab({ url: '/pages/index/index' })
    }
  },

  noop() {}
})
