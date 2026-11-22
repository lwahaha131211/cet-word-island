/**
 * 剧情闯关 · 词灵岛主线
 * 累计词汇量达到章节门槛后解锁，阅读剧情并完成章节可获得小鱼干。
 */
const store = require('../../utils/store.js')

Page({
  data: {
    chapters: [],
    totalLearned: 0,
    finishedCount: 0,
    active: null,
    showStory: false
  },

  onShow() {
    this.refresh()
  },

  refresh() {
    const state = store.getState()
    const chapters = store.getChapters()
    this.setData({
      chapters: chapters,
      totalLearned: state.stats.totalLearned,
      finishedCount: chapters.filter((c) => c.finished).length
    })
  },

  openChapter(e) {
    const id = e.currentTarget.dataset.id
    const chapter = this.data.chapters.filter((c) => c.id === id)[0]
    if (!chapter) return
    if (!chapter.unlocked) {
      wx.showToast({
        title: '再学 ' + (chapter.need - this.data.totalLearned) + ' 个单词解锁',
        icon: 'none'
      })
      return
    }
    this.setData({ active: chapter, showStory: true })
  },

  closeStory() {
    this.setData({ showStory: false })
  },

  complete() {
    if (!this.data.active) return
    store.finishChapter(this.data.active.id)
    wx.showToast({ title: '章节完成，小鱼干 +25', icon: 'none' })
    this.setData({ showStory: false })
    this.refresh()
  },

  goStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  },

  noop() {}
})
