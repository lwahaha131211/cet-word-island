/**
 * 知识花园
 * 每掌握一个单词就种下一朵花，花园规模与装饰随学习进度生长。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')

const DECOR_EMOJI = {
  sun: '☀️',
  butterfly: '🦋',
  fence: '🪵',
  lantern: '🏮',
  fountain: '⛲',
  rainbow: '🌈'
}

const DECOR_NAME = {
  sun: '暖阳',
  butterfly: '小蝴蝶',
  fence: '木栅栏',
  lantern: '暖光灯',
  fountain: '许愿喷泉',
  rainbow: '彩虹拱门'
}

Page({
  data: {
    plots: [],
    cells: [],
    count: 0,
    decorList: [],
    nextDecor: null,
    nextPercent: 0,
    stats: null,
    detail: null,
    showDetail: false
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const view = store.getGardenView()
    const cells = view.plots.map((p) => Object.assign({}, p, { empty: false }))
    const min = Math.max(12, Math.ceil((view.plots.length + 1) / 4) * 4)
    const total = Math.min(36, min)
    for (let i = cells.length; i < total; i++) {
      cells.push({ id: 'empty_' + i, empty: true })
    }
    const decorList = view.decor.map((id) => ({
      id: id,
      emoji: DECOR_EMOJI[id] || '✨',
      name: DECOR_NAME[id] || '装饰'
    }))
    const next = view.nextDecor
    this.setData({
      plots: view.plots,
      cells: cells,
      count: view.count,
      decorList: decorList,
      nextDecor: next,
      nextPercent: next ? Math.min(100, Math.round((view.count / next.need) * 100)) : 100,
      stats: store.getStatsView()
    })
  },

  openPlot(e) {
    const index = Number(e.currentTarget.dataset.index)
    const plot = this.data.plots[index]
    if (!plot) return
    this.setData({
      detail: Object.assign({}, plot, {
        dateText: util.formatDate(plot.plantedAt, 'YYYY年MM月DD日')
      }),
      showDetail: true
    })
  },

  closeDetail() {
    this.setData({ showDetail: false })
  },

  goStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  },

  goPet() {
    wx.switchTab({ url: '/pages/pet/pet' })
  },

  noop() {}
})
