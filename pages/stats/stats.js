/**
 * 学习统计
 * 近 7 天柱状图、打卡热力图、熟练度分布与各模块完成度。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const wordsData = require('../../data/words.js')

Page({
  data: {
    stats: null,
    days: [],
    weeks: [],
    levels: [],
    levelLabels: ['未学', '1 级', '2 级', '3 级', '4 级', '5 级', '6 级'],
    modules: [],
    exams: [],
    fish: 0,
    bookProgress: []
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const state = store.getState()
    const stats = store.getStatsView()
    const heat = store.getHeatmap(8)
    const weeks = []
    for (let i = 0; i < 8; i++) {
      weeks.push({ key: 'w' + i, cells: heat.slice(i * 7, i * 7 + 7) })
    }

    const maxLevel = Math.max(1, stats.levels.reduce((m, n) => Math.max(m, n), 0))
    const levels = stats.levels.map((count, index) => ({
      index: index,
      count: count,
      percent: Math.round((count / maxLevel) * 100)
    }))

    const modules = [
      {
        name: '阅读闯关',
        emoji: '📖',
        done: state.readings.finished.length,
        total: 3,
        color: 'green'
      },
      {
        name: '影子跟读',
        emoji: '🎧',
        done: Object.keys(state.listenings.best).length,
        total: 3,
        color: 'blue'
      },
      {
        name: '情景对话',
        emoji: '💬',
        done: state.dialogues.finished.length,
        total: 4,
        color: 'pink'
      },
      {
        name: '词根拼图',
        emoji: '🧩',
        done: state.puzzle.cleared.length,
        total: 12,
        color: 'purple'
      }
    ].map((m) => Object.assign({}, m, { percent: util.percent(m.done, m.total) }))

    const exams = state.exam.history.slice(0, 3).map((e) => ({
      date: util.formatDate(e.at, 'MM-DD HH:mm'),
      score: e.score,
      correct: e.correct,
      total: e.total
    }))

    const bookProgress = wordsData.books.map((b) => {
      const p = store.getBookProgress(wordsData.getBook(b.id), b.id)
      return {
        id: b.id,
        name: b.name,
        emoji: b.emoji,
        learned: p.learned,
        total: p.total,
        percent: p.percent
      }
    })

    this.setData({
      stats: stats,
      days: stats.days,
      weeks: weeks,
      levels: levels,
      modules: modules,
      exams: exams,
      fish: state.wallet.fish,
      bookProgress: bookProgress
    })
  },

  goPlan() {
    wx.navigateTo({ url: '/pages/plan/plan' })
  },

  goWrongbook() {
    wx.navigateTo({ url: '/pages/wrongbook/wrongbook' })
  }
})
