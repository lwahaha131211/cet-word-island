/**
 * 智能复习页
 * 从间隔复习队列中取到期单词，以四选一测验形式检测，
 * 答对升级熟练度，答错降级并写入错题病历本。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const wordsData = require('../../data/words.js')

Page({
  data: {
    bookId: 'all',
    queue: [],
    total: 0,
    index: 0,
    word: null,
    wordSize: 80,
    options: [],
    answer: 0,
    selected: -1,
    answered: false,
    isCorrect: false,
    progress: 0,
    phase: 'quiz',
    stats: { correct: 0, wrong: 0 },
    wrongList: [],
    result: null
  },

  onLoad(options) {
    const bookId = options && options.book ? options.book : 'all'
    this.setData({ bookId: bookId })
    this.buildQueue()
    this.startedAt = Date.now()
    this.minutesAdded = false
  },

  onUnload() {
    this.finishMinutes()
  },

  buildQueue() {
    let pool = []
    if (this.data.bookId === 'cet6') pool = wordsData.cet6
    else if (this.data.bookId === 'cet4') pool = wordsData.cet4
    else pool = wordsData.all

    let due = store.getDueWords(pool, 20)
    // 没有到期词时，用已学词做一次巩固练习
    if (!due.length) {
      due = pool
        .filter((w) => !!store.getRecord(w.id))
        .slice(0, 10)
    }

    if (!due.length) {
      this.setData({ phase: 'empty', queue: [], total: 0 })
      return
    }

    this.setData({
      phase: 'quiz',
      queue: due,
      total: due.length,
      index: 0,
      stats: { correct: 0, wrong: 0 },
      wrongList: [],
      result: null
    })
    this.loadQuestion(0)
    this.startedAt = Date.now()
    this.minutesAdded = false
  },

  loadQuestion(i) {
    const word = this.data.queue[i]
    if (!word) return
    const built = util.buildOptions(word, wordsData.all, 4)
    const options = built.options.map((o, i) => Object.assign({}, o, { letter: 'ABCD'[i] }))
    const len = Math.max(4, word.word.length)
    this.setData({
      word: word,
      wordSize: Math.max(30, Math.min(80, Math.floor(620 / len))),
      options: options,
      answer: built.answer,
      selected: -1,
      answered: false,
      isCorrect: false,
      progress: Math.round(((i + 1) / this.data.queue.length) * 100)
    })
  },

  speak() {
    if (!this.data.word) return
    if (!this.data.word.phonetic) {
      wx.showToast({ title: '暂无音标', icon: 'none', duration: 900 })
      return
    }
    wx.showToast({ title: this.data.word.phonetic, icon: 'none', duration: 900 })
  },

  select(e) {
    if (this.data.answered) return
    const idx = Number(e.currentTarget.dataset.index)
    const correct = idx === this.data.answer
    const word = this.data.word
    const stats = Object.assign({}, this.data.stats)
    const wrongList = this.data.wrongList.slice()

    if (correct) {
      stats.correct += 1
      store.vibrate('light')
    } else {
      stats.wrong += 1
      wrongList.push({ word: word.word, cn: word.cn })
      store.addWrong(word.id, '遗忘', { word: word.word, cn: word.cn })
    }

    store.submitWord(word, correct ? 2 : 0)
    this.setData({
      selected: idx,
      answered: true,
      isCorrect: correct,
      stats: stats,
      wrongList: wrongList
    })
  },

  next() {
    const nextIndex = this.data.index + 1
    if (nextIndex >= this.data.total) {
      this.finish()
      return
    }
    this.setData({ index: nextIndex })
    this.loadQuestion(nextIndex)
  },

  finish() {
    this.finishMinutes()
    const s = this.data.stats
    const total = s.correct + s.wrong
    const accuracy = total ? Math.round((s.correct / total) * 100) : 0
    this.setData({
      phase: 'done',
      result: {
        total: total,
        correct: s.correct,
        wrong: s.wrong,
        accuracy: accuracy,
        exp: total * 8,
        comment:
          accuracy >= 85
            ? '记忆很牢固，伙伴给你比了个心。'
            : accuracy >= 60
            ? '大部分都记得，错词再看一遍就更稳了。'
            : '错词已进入病历本，按处方复习效果更好。'
      }
    })
  },

  finishMinutes() {
    if (this.minutesAdded || !this.startedAt) return
    const minutes = (Date.now() - this.startedAt) / 60000
    if (minutes >= 0.5) store.addMinutes(minutes)
    this.minutesAdded = true
  },

  again() {
    this.buildQueue()
  },

  goStudy() {
    wx.redirectTo({ url: '/pages/study/study?book=' + (this.data.bookId === 'all' ? 'cet4' : this.data.bookId) })
  },

  goWrongbook() {
    wx.redirectTo({ url: '/pages/wrongbook/wrongbook' })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  back() {
    const pages = getCurrentPages()
    if (pages.length > 1) wx.navigateBack()
    else wx.switchTab({ url: '/pages/index/index' })
  }
})
