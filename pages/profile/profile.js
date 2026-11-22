/**
 * 我的 · 个人中心
 * 资料编辑、学习概览与各功能入口。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const quotes = require('../../data/quotes.js')

const AVATARS = ['🐣', '🦊', '🐼', '🐸', '🐙', '🦄', '🐯', '🐨']
const MENU = [
  { icon: '🎯', name: '备考计划', desc: '倒计时与每日配速', url: '/pages/plan/plan', color: 'orange' },
  { icon: '📊', name: '学习统计', desc: '数据、热力图与模块完成度', url: '/pages/stats/stats', color: 'blue' },
  { icon: '🏅', name: '成就墙', desc: '收集属于你的徽章', url: '/pages/achievements/achievements', color: 'yellow' },
  { icon: '🩺', name: '错题病历本', desc: '按错因生成复习处方', url: '/pages/wrongbook/wrongbook', color: 'pink' },
  { icon: '🌷', name: '知识花园', desc: '看看单词开出的花', url: '/pages/garden/garden', color: 'green' },
  { icon: '📜', name: '剧情闯关', desc: '词灵岛主线故事', url: '/pages/chapters/chapters', color: 'purple' }
]

Page({
  data: {
    profile: null,
    level: 1,
    stats: null,
    achCount: 0,
    achTotal: 0,
    gardenCount: 0,
    wrongCount: 0,
    fish: 0,
    joinDays: 1,
    quote: null,
    menu: MENU,
    showEdit: false,
    tempName: '',
    tempAvatar: '🐣',
    avatars: AVATARS,
    version: '1.0.0'
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setSelected(3)
    }
    this.refresh()
  },

  refresh() {
    const state = store.getState()
    const profile = state.profile
    const achievements = store.getAchievements()
    const joinDays = Math.max(1, Math.ceil((Date.now() - profile.joinedAt) / 86400000))
    this.setData({
      profile: profile,
      level: store.getPetLevel(),
      stats: store.getStatsView(),
      achCount: achievements.filter((a) => a.unlocked).length,
      achTotal: achievements.length,
      gardenCount: store.getGardenView().count,
      wrongCount: store.getWrongStats().total,
      fish: state.wallet.fish,
      joinDays: joinDays,
      quote: util.dailyQuote(quotes)
    })
  },

  openEdit() {
    this.setData({
      showEdit: true,
      tempName: this.data.profile.nickname,
      tempAvatar: this.data.profile.avatar
    })
  },

  closeEdit() {
    this.setData({ showEdit: false })
  },

  chooseAvatar(e) {
    this.setData({ tempAvatar: e.currentTarget.dataset.avatar })
  },

  onNameInput(e) {
    this.setData({ tempName: e.detail.value })
  },

  saveProfile() {
    const name = (this.data.tempName || '').trim()
    if (!name) {
      wx.showToast({ title: '昵称不能为空', icon: 'none' })
      return
    }
    const state = store.getState()
    state.profile.nickname = name.slice(0, 12)
    state.profile.avatar = this.data.tempAvatar
    store.save()
    this.setData({ showEdit: false })
    this.refresh()
    wx.showToast({ title: '资料已更新', icon: 'none' })
  },

  goUrl(e) {
    const url = e.currentTarget.dataset.url
    if (url) wx.navigateTo({ url: url })
  },

  goSettings() {
    wx.navigateTo({ url: '/pages/settings/settings' })
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  },

  goStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  },

  onShareAppMessage() {
    return {
      title: '词灵岛 · 四六级卡通英语学习，边养伙伴边背单词',
      path: '/pages/index/index'
    }
  },

  noop() {}
})
