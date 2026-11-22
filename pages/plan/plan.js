/**
 * 备考计划
 * 根据考试日期、每日新词量与目标分数，生成分阶段日程与每日配速。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const planUtil = require('../../utils/plan.js')
const wordsData = require('../../data/words.js')

Page({
  data: {
    examDate: '',
    dailyNew: 15,
    targetScore: 500,
    targetScores: [425, 500, 550, 600],
    targetIndex: 1,
    daysLeft: 60,
    progress: { total: 0, learned: 0, mastered: 0 },
    plan: null,
    phases: [],
    schedule: [],
    today: '',
    phaseName: '',
    changed: false
  },

  onLoad() {
    const state = store.getState()
    const profile = state.profile
    const index = Math.max(0, this.data.targetScores.indexOf(profile.targetScore))
    this.setData({
      examDate: profile.examDate,
      dailyNew: profile.dailyNew,
      targetScore: profile.targetScore,
      targetIndex: index,
      today: util.formatDate(new Date(), 'YYYY-MM-DD')
    })
    this.build()
  },

  build() {
    const state = store.getState()
    const profile = {
      examDate: this.data.examDate,
      dailyNew: this.data.dailyNew,
      targetScore: this.data.targetScore
    }
    const progress = store.getBookProgress(wordsData.all)
    const plan = planUtil.buildPlan(profile, progress)
    const phases = planUtil.getPhases(profile).map((p) => {
      const left = plan.totalDays
      let current = false
      if (p.key === 'sprint' && left <= 14) current = true
      if (p.key === 'boost' && left > 14 && left <= 30) current = true
      if (p.key === 'base' && left > 30) current = true
      return Object.assign({}, p, { current: current, days: Math.max(0, p.days) })
    })
    const schedule = plan.schedule.map((item) => {
      let stageClass = 'green'
      if (item.stage === '真题强化') stageClass = 'orange'
      if (item.stage === '冲刺模考') stageClass = 'pink'
      if (item.stage === '周复盘') stageClass = 'blue'
      return Object.assign({}, item, { stageClass: stageClass })
    })
    this.setData({
      progress: progress,
      plan: plan,
      daysLeft: plan.totalDays,
      phaseName: plan.totalDays <= 14 ? '冲刺模考' : plan.totalDays <= 30 ? '真题强化' : '基础积累',
      phases: phases,
      schedule: schedule
    })
  },

  onDateChange(e) {
    this.setData({ examDate: e.detail.value, changed: true })
    this.build()
  },

  onTargetChange(e) {
    const index = Number(e.detail.value)
    this.setData({
      targetIndex: index,
      targetScore: this.data.targetScores[index],
      changed: true
    })
  },

  decrease() {
    const n = Math.max(5, this.data.dailyNew - 5)
    this.setData({ dailyNew: n, changed: true })
    this.build()
  },

  increase() {
    const n = Math.min(60, this.data.dailyNew + 5)
    this.setData({ dailyNew: n, changed: true })
    this.build()
  },

  save() {
    const state = store.getState()
    state.profile.examDate = this.data.examDate
    state.profile.dailyNew = this.data.dailyNew
    state.profile.targetScore = this.data.targetScore
    store.save()
    this.setData({ changed: false })
    wx.showToast({ title: '计划已保存', icon: 'success' })
  },

  goStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  },

  goExam() {
    wx.navigateTo({ url: '/pages/exam/exam' })
  }
})
