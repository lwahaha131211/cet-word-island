/**
 * 模拟考场
 * 20 道词汇题、15 分钟倒计时、答题卡跳转，交卷后按 710 分制估分。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const wordsData = require('../../data/words.js')

const EXAM_TOTAL = 20
const EXAM_SECONDS = 15 * 60
const PASS_LINE = 425

function formatTime(sec) {
  const s = Math.max(0, sec)
  const m = Math.floor(s / 60)
  const r = s % 60
  return (m < 10 ? '0' + m : m) + ':' + (r < 10 ? '0' + r : r)
}

Page({
  data: {
    phase: 'intro',
    history: [],
    total: EXAM_TOTAL,
    seconds: EXAM_SECONDS,
    timeText: '15:00',
    index: 0,
    questions: [],
    answers: [],
    selected: -1,
    answeredCount: 0,
    showSheet: false,
    result: null,
    passLine: PASS_LINE,
    lastScore: 0
  },

  onLoad() {
    this.refreshHistory()
  },

  onShow() {
    if (this.data.phase === 'exam' && !this.timer) {
      this.startTimer()
    }
  },

  onUnload() {
    this.stopTimer()
  },

  onHide() {
    this.stopTimer()
  },

  refreshHistory() {
    const state = store.getState()
    const history = state.exam.history.slice(0, 5).map((e, index) => ({
      id: String(e.at) + '_' + index,
      date: util.formatDate(e.at, 'MM-DD HH:mm'),
      score: e.score,
      correct: e.correct,
      total: e.total,
      pass: e.score >= PASS_LINE
    }))
    this.setData({
      history: history,
      lastScore: history.length ? history[0].score : 0
    })
  },

  start() {
    const pool = util.shuffle(wordsData.all).slice(0, EXAM_TOTAL)
    const questions = pool.map((word) => {
      const built = util.buildOptions(word, wordsData.all, 4)
      return {
        id: word.id,
        word: word,
        options: built.options.map((o, i) => ({ text: o.text, letter: 'ABCD'[i] })),
        answer: built.answer,
        size: Math.max(28, Math.min(68, Math.floor(600 / Math.max(4, word.word.length))))
      }
    })
    const answers = []
    for (let i = 0; i < questions.length; i++) answers.push(-1)
    this.setData({
      phase: 'exam',
      questions: questions,
      answers: answers,
      index: 0,
      qIndex: 0,
      selected: -1,
      answeredCount: 0,
      timeLeft: EXAM_SECONDS,
      timeText: formatTime(EXAM_SECONDS),
      showSheet: false,
      result: null
    })
    this.startTimer()
  },

  startTimer() {
    this.stopTimer()
    this.timer = setInterval(() => {
      const left = this.data.timeLeft - 1
      if (left <= 0) {
        this.setData({ timeLeft: 0, timeText: '00:00' })
        this.stopTimer()
        wx.showToast({ title: '时间到，自动交卷', icon: 'none' })
        this.finish()
        return
      }
      this.setData({ timeLeft: left, timeText: formatTime(left) })
    }, 1000)
  },

  stopTimer() {
    if (this.timer) {
      clearInterval(this.timer)
      this.timer = null
    }
  },

  choose(e) {
    const idx = Number(e.currentTarget.dataset.index)
    const answers = this.data.answers.slice()
    answers[this.data.index] = idx
    let count = 0
    answers.forEach((a) => {
      if (a >= 0) count += 1
    })
    this.setData({
      answers: answers,
      selected: idx,
      answeredCount: count
    })
  },

  prev() {
    if (this.data.index <= 0) return
    const index = this.data.index - 1
    this.setData({ index: index, qIndex: index, selected: this.data.answers[index] })
  },

  next() {
    if (this.data.index >= this.data.total - 1) return
    const index = this.data.index + 1
    this.setData({ index: index, qIndex: index, selected: this.data.answers[index] })
  },

  toggleSheet() {
    this.setData({ showSheet: !this.data.showSheet })
  },

  jump(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.setData({
      index: index,
      qIndex: index,
      selected: this.data.answers[index],
      showSheet: false
    })
  },

  confirmSubmit() {
    const unanswered = this.data.total - this.data.answeredCount
    if (unanswered > 0) {
      wx.showModal({
        title: '还有 ' + unanswered + ' 题未作答',
        content: '确定现在交卷吗？',
        confirmText: '交卷',
        success: (res) => {
          if (res.confirm) this.finish()
        }
      })
      return
    }
    this.finish()
  },

  finish() {
    if (this.data.phase !== 'exam') return
    this.stopTimer()
    const questions = this.data.questions
    const answers = this.data.answers
    let correct = 0
    const wrongList = []
    questions.forEach((q, i) => {
      if (answers[i] === q.answer) {
        correct += 1
      } else {
        wrongList.push({
          word: q.word.word,
          cn: q.word.cn,
          chosen: answers[i] >= 0 ? q.options[answers[i]].text : '未作答',
          answer: q.options[q.answer].text
        })
        store.addWrong(q.word.id, '遗忘', { word: q.word.word, cn: q.word.cn })
      }
    })
    const score = Math.round((correct / questions.length) * 710)
    const minutes = Math.round((EXAM_SECONDS - this.data.timeLeft) / 60)
    store.saveExamResult({
      score: score,
      correct: correct,
      wrong: questions.length - correct,
      total: questions.length,
      minutes: minutes
    })
    this.setData({
      phase: 'done',
      result: {
        score: score,
        correct: correct,
        total: questions.length,
        wrong: questions.length - correct,
        accuracy: Math.round((correct / questions.length) * 100),
        minutes: minutes,
        pass: score >= PASS_LINE,
        wrongList: wrongList,
        comment:
          score >= 500
            ? '状态很不错，保持这个节奏去考场。'
            : score >= PASS_LINE
            ? '已经过线，继续巩固错题会更稳。'
            : '先把错词过一遍，再来一次会进步很快。'
      }
    })
    this.refreshHistory()
  },

  restart() {
    this.start()
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  goWrongbook() {
    wx.navigateTo({ url: '/pages/wrongbook/wrongbook' })
  },

  goStats() {
    wx.navigateTo({ url: '/pages/stats/stats' })
  },

  noop() {}
})
