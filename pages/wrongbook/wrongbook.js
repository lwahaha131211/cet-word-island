/**
 * 错题病历本
 * 按错因归类，自动生成复习处方；确认掌握后可将病历标记为已治愈。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const wordsData = require('../../data/words.js')

const REASON_COLOR = {
  形近混淆: 'orange',
  音近听错: 'blue',
  遗忘: 'red',
  语境误解: 'purple'
}

Page({
  data: {
    list: [],
    view: [],
    filter: 'all',
    filters: [],
    stats: { total: 0, byReason: {} },
    expanded: '',
    resolvedCount: 0
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const raw = store.getWrongList()
    const stats = store.getWrongStats()
    const list = raw
      .filter((w) => !w.resolved)
      .map((w) => {
        const word = wordsData.getById(w.wordId)
        return {
          id: w.id,
          wordId: w.wordId,
          word: w.word || (word ? word.word : '未知单词'),
          phonetic: word ? word.phonetic : '',
          cn: w.cn || (word ? word.cn : ''),
          pos: word ? word.pos : '',
          en: word ? word.en : '',
          tip: word ? word.tip : '',
          reason: w.reason,
          color: REASON_COLOR[w.reason] || 'red',
          count: w.count,
          dateText: util.formatDate(w.at, 'MM月DD日'),
          prescription: util.prescription(w.reason)
        }
      })

    const filters = [
      { key: 'all', label: '全部', count: stats.total }
    ].concat(
      store.REASONS.map((r) => ({
        key: r,
        label: r,
        count: stats.byReason[r] || 0
      }))
    )

    this.setData({
      list: list,
      stats: stats,
      filters: filters,
      resolvedCount: raw.filter((w) => w.resolved).length
    })
    this.applyFilter(this.data.filter)
  },

  applyFilter(key) {
    const view = this.data.list.filter((w) => key === 'all' || w.reason === key)
    this.setData({ filter: key, view: view })
  },

  onFilter(e) {
    this.applyFilter(e.currentTarget.dataset.key)
  },

  toggle(e) {
    const id = e.currentTarget.dataset.id
    this.setData({ expanded: this.data.expanded === id ? '' : id })
  },

  resolve(e) {
    const wordId = e.currentTarget.dataset.wordid
    store.resolveWrong(wordId)
    wx.showToast({ title: '已标记为掌握', icon: 'none' })
    this.refresh()
  },

  goReview() {
    wx.navigateTo({ url: '/pages/review/review' })
  },

  goStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  }
})
