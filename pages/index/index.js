/**
 * 首页 · 学习岛
 * 汇总今日任务、词灵状态、剧情进度与八个特色玩法入口。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const quotes = require('../../data/quotes.js')
const wordsData = require('../../data/words.js')

const FEATURES = [
  { icon: '🧩', name: '词根拼图', desc: '拆词记忆', url: '/pages/puzzle/puzzle', color: 'purple' },
  { icon: '🎧', name: '影子跟读', desc: '听说训练', url: '/pages/listening/listening', color: 'blue' },
  { icon: '📖', name: '阅读闯关', desc: '真题精读', url: '/pages/reading/reading', color: 'green' },
  { icon: '💬', name: '情景对话', desc: '角色扮演', url: '/pages/dialogue/dialogue', color: 'pink' },
  { icon: '✍️', name: '写作工坊', desc: '即时诊断', url: '/pages/writing/writing', color: 'orange' },
  { icon: '🩺', name: '错题病历', desc: '对症下药', url: '/pages/wrongbook/wrongbook', color: 'red' },
  { icon: '🌷', name: '知识花园', desc: '单词开花', url: '/pages/garden/garden', color: 'green' },
  { icon: '⏱️', name: '模拟考场', desc: '全真计时', url: '/pages/exam/exam', color: 'blue' }
]

Page({
  data: {
    greeting: '',
    dateText: '',
    nickname: '',
    avatar: '',
    fish: 0,
    streak: 0,
    daysLeft: 0,
    examDateText: '',
    pet: null,
    done: 0,
    target: 30,
    todayPercent: 0,
    dueCount: 0,
    tasks: [],
    tasksDone: 0,
    features: FEATURES,
    chapter: null,
    quote: null,
    stats: null,
    accuracy: 0
  },

  onLoad() {
    this.refresh()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setSelected(0)
    }
    this.refresh()
  },

  refresh() {
    const state = store.getState()
    const today = store.getToday()
    const pet = store.getPetView()
    const tasks = store.getTasks()
    const stats = store.getStatsView()
    const chapters = store.getChapters()
    const chapter = chapters.filter((c) => !c.finished)[0] || chapters[chapters.length - 1]
    const profile = state.profile
    const target = Math.max(10, profile.dailyNew + profile.dailyReview)
    const done = today.newWords + today.reviews
    const due = store.getBookProgress(wordsData.all, 'all').due
    const accuracy = stats.accuracy

    this.setData({
      greeting: util.greeting(),
      dateText: util.formatDate(new Date(), 'MM月DD日') + ' · ' + util.weekdayCN(new Date()),
      nickname: profile.nickname,
      avatar: profile.avatar,
      fish: state.wallet.fish,
      streak: state.stats.streak,
      daysLeft: util.daysUntil(profile.examDate),
      examDateText: profile.examDate,
      pet: pet,
      done: done,
      target: target,
      todayPercent: util.percent(done, target),
      dueCount: due,
      tasks: tasks,
      tasksDone: tasks.filter((t) => t.done).length,
      chapter: chapter,
      quote: util.dailyQuote(quotes),
      stats: stats,
      accuracy: accuracy
    })
  },

  goStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  },

  goReview() {
    wx.navigateTo({ url: '/pages/review/review' })
  },

  goUrl(e) {
    const url = e.currentTarget.dataset.url
    if (url) wx.navigateTo({ url: url })
  },

  goPet() {
    wx.switchTab({ url: '/pages/pet/pet' })
  },

  goChapters() {
    wx.navigateTo({ url: '/pages/chapters/chapters' })
  },

  goPlan() {
    wx.navigateTo({ url: '/pages/plan/plan' })
  },

  onClaim(e) {
    const id = e.currentTarget.dataset.id
    const res = store.claimTask(id)
    if (res.ok) {
      wx.showToast({ title: res.msg, icon: 'none' })
      store.vibrate('light')
      this.refresh()
    } else {
      wx.showToast({ title: res.msg, icon: 'none' })
    }
  },

  onShareAppMessage() {
    return {
      title: '我在词灵岛养了一群吃单词的小精灵，一起来打卡四六级！',
      path: '/pages/index/index'
    }
  }
})
