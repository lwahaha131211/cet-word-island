/**
 * 成就墙
 * 展示全部成就的解锁状态与完成进度。
 */
const store = require('../../utils/store.js')

Page({
  data: {
    list: [],
    view: [],
    filter: 'all',
    unlockedCount: 0,
    total: 0,
    percent: 0,
    filters: [
      { key: 'all', label: '全部' },
      { key: 'unlocked', label: '已解锁' },
      { key: 'locked', label: '未解锁' }
    ]
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const list = store.getAchievements()
    const unlockedCount = list.filter((a) => a.unlocked).length
    this.setData({
      list: list,
      unlockedCount: unlockedCount,
      total: list.length,
      percent: Math.round((unlockedCount / list.length) * 100)
    })
    this.applyFilter(this.data.filter)
  },

  applyFilter(filter) {
    const list = this.data.list.filter((a) => {
      if (filter === 'unlocked') return a.unlocked
      if (filter === 'locked') return !a.unlocked
      return true
    })
    this.setData({ filter: filter, view: list })
  },

  onFilter(e) {
    this.applyFilter(e.currentTarget.dataset.key)
  },

  goStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  }
})
