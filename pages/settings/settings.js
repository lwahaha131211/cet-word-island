/**
 * 设置
 * 学习偏好、提醒时间与本地数据管理。
 */
const store = require('../../utils/store.js')

Page({
  data: {
    settings: null,
    storage: 0,
    version: '1.0.0'
  },

  onShow() {
    const state = store.getState()
    let storage = 0
    try {
      const info = wx.getStorageInfoSync()
      storage = info.currentSize || 0
    } catch (e) {}
    this.setData({
      settings: state.settings,
      storage: storage
    })
  },

  onSwitch(e) {
    const key = e.currentTarget.dataset.key
    const value = e.detail.value
    const state = store.getState()
    state.settings[key] = value
    store.save()
    this.setData({ settings: state.settings })
  },

  onReminder(e) {
    const value = e.detail.value
    const state = store.getState()
    state.settings.reminder = value
    store.save()
    this.setData({ settings: state.settings })
    wx.showToast({ title: '提醒时间已设为 ' + value, icon: 'none' })
  },

  clearData() {
    wx.showModal({
      title: '清除学习数据',
      content: '将删除本机所有学习记录、伙伴养成进度与错题本，且无法恢复。确定继续吗？',
      confirmText: '清除',
      confirmColor: '#FF5C5C',
      success: (res) => {
        if (!res.confirm) return
        store.resetAll()
        wx.showToast({ title: '已恢复初始状态', icon: 'none' })
        setTimeout(() => {
          wx.reLaunch({ url: '/pages/index/index' })
        }, 600)
      }
    })
  },

  goAbout() {
    wx.navigateTo({ url: '/pages/about/about' })
  }
})
