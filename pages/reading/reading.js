/**
 * 阅读闯关
 * 限时阅读 + 生词点查 + 逐题解析，完成后记录用时与正确率。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const audio = require('../../utils/audio.js')
const readings = require('../../data/readings.js')

Page({
  data: {
    readings: readings.map((r) => ({ id: r.id, title: r.title, emoji: r.emoji })),
    activeId: 'r1',
    article: null,
    phase: 'read',
    elapsedText: '0 分钟',
    quizIndex: 0,
    quizQuestion: null,
    quizOptions: [],
    quizSelected: -1,
    quizAnswered: false,
    quizCorrect: 0,
    result: null,
    showWord: false,
    wordInfo: null
  },

  onLoad(options) {
    const id = options && options.id ? options.id : 'r1'
    this.loadArticle(id)
    this.startedAt = Date.now()
  },

  onUnload() {
    this.stopTimer()
    if (this.data.phase !== 'done' && this.startedAt) {
      const minutes = (Date.now() - this.startedAt) / 60000
      if (minutes >= 1) store.addMinutes(minutes)
    }
  },

  loadArticle(id) {
    const article = readings.filter((r) => r.id === id)[0] || readings[0]
    this.setData({
      activeId: article.id,
      article: article,
      phase: 'read',
      quizIndex: 0,
      quizCorrect: 0,
      quizSelected: -1,
      quizAnswered: false,
      result: null,
      showWord: false
    })
    this.startedAt = Date.now()
    this.startTimer()
  },

  startTimer() {
    this.stopTimer()
    this.timer = setInterval(() => {
      const minutes = Math.floor((Date.now() - this.startedAt) / 60000)
      this.setData({ elapsedText: minutes + ' 分钟' })
    }, 5000)
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  selectArticle(e) {
    const id = e.currentTarget.dataset.id
    if (id === this.data.activeId) return
    this.loadArticle(id)
  },

  showWord(e) {
    const index = Number(e.currentTarget.dataset.index)
    const word = this.data.article.keyWords[index]
    if (!word) return
    this.setData({ showWord: true, wordInfo: word })
  },

  closeWord() {
    this.setData({ showWord: false })
  },

  speakWord() {
    if (!this.data.wordInfo) return
    audio.playWord(this.data.wordInfo.word)
    wx.showToast({ title: this.data.wordInfo.word, icon: 'none' })
  },

  startQuiz() {
    this.stopTimer()
    const q = this.data.article.questions[0]
    this.setData({
      phase: 'quiz',
      quizIndex: 0,
      quizQuestion: q,
      quizOptions: q.options.map((text, i) => ({ text: text, letter: 'ABCD'[i] })),
      quizSelected: -1,
      quizAnswered: false
    })
  },

  choose(e) {
    if (this.data.quizAnswered) return
    const idx = Number(e.currentTarget.dataset.index)
    const correct = idx === this.data.quizQuestion.answer
    this.setData({
      quizSelected: idx,
      quizAnswered: true,
      quizCorrect: this.data.quizCorrect + (correct ? 1 : 0)
    })
    if (correct) store.vibrate('light')
  },

  next() {
    const next = this.data.quizIndex + 1
    if (next >= this.data.article.questions.length) {
      this.finish()
      return
    }
    const q = this.data.article.questions[next]
    this.setData({
      quizIndex: next,
      quizQuestion: q,
      quizOptions: q.options.map((text, i) => ({ text: text, letter: 'ABCD'[i] })),
      quizSelected: -1,
      quizAnswered: false
    })
  },

  finish() {
    const total = this.data.article.questions.length
    const correct = this.data.quizCorrect
    const accuracy = total ? Math.round((correct / total) * 100) : 0
    const minutes = Math.max(1, Math.round((Date.now() - this.startedAt) / 60000))
    const exp = 12 + correct * 10
    store.logActivity({
      correct: correct,
      wrong: total - correct,
      minutes: minutes,
      quizzes: total,
      exp: exp,
      fish: 8
    })
    store.markFinished('readings', this.data.article.id)
    this.setData({
      phase: 'done',
      result: {
        total: total,
        correct: correct,
        accuracy: accuracy,
        minutes: minutes,
        exp: exp,
        comment:
          accuracy === 100
            ? '全对！这篇文章的生词已经被你拿下了。'
            : accuracy >= 60
            ? '理解得不错，回看错题所在的段落会更牢。'
            : '别灰心，先把关键生词过一遍，再读一次文章。'
      }
    })
    this.stopTimer()
  },

  retry() {
    this.loadArticle(this.data.activeId)
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  noop() {}
})
