/**
 * 写作工坊
 * 写作：命题作文 + 实时字数 + 四维诊断（篇幅、句式、衔接、词汇）
 * 翻译：段落翻译 + 采分点 + 参考译文对照
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const writingData = require('../../data/writing.js')

Page({
  data: {
    tab: 'essay',
    essays: writingData.essays,
    translations: writingData.translations,
    essayIndex: 0,
    essay: null,
    translationIndex: 0,
    translation: null,
    text: '',
    wordCount: 0,
    result: null,
    showSample: false,
    showRef: false,
    transText: '',
    minutes: 0,
    diagnosing: false
  },

  onLoad() {
    this.setData({
      essay: writingData.essays[0],
      translation: writingData.translations[0]
    })
    this.startedAt = Date.now()
    this.timer = setInterval(() => {
      this.setData({ minutes: Math.floor((Date.now() - this.startedAt) / 60000) })
    }, 10000)
  },

  onUnload() {
    if (this.timer) clearInterval(this.timer)
    const minutes = (Date.now() - (this.startedAt || Date.now())) / 60000
    if (minutes >= 1) store.addMinutes(minutes)
  },

  switchTab(e) {
    const tab = e.currentTarget.dataset.tab
    this.setData({ tab: tab })
  },

  selectEssay(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.setData({
      essayIndex: index,
      essay: this.data.essays[index],
      text: '',
      wordCount: 0,
      result: null,
      showSample: false
    })
    this.startedAt = Date.now()
  },

  selectTranslation(e) {
    const index = Number(e.currentTarget.dataset.index)
    this.setData({
      translationIndex: index,
      translation: this.data.translations[index],
      transText: '',
      showRef: false
    })
  },

  onInput(e) {
    const text = e.detail.value
    const words = text.trim() ? text.trim().split(/\s+/).filter((w) => /[a-zA-Z]/.test(w)).length : 0
    this.setData({ text: text, wordCount: words })
  },

  onTransInput(e) {
    this.setData({ transText: e.detail.value })
  },

  toggleSample() {
    this.setData({ showSample: !this.data.showSample })
  },

  toggleRef() {
    this.setData({ showRef: !this.data.showRef })
  },

  /** 本地启发式诊断，不依赖网络 */
  diagnose() {
    if (this.data.wordCount < 20) {
      wx.showToast({ title: '至少写 20 个词再诊断哦', icon: 'none' })
      return
    }
    this.setData({ diagnosing: true })
    const result = util.analyzeWriting(this.data.text)
    const minutes = Math.max(1, Math.round((Date.now() - this.startedAt) / 60000))
    store.saveWriting(result.score)
    store.logActivity({
      exp: 15 + Math.round(result.score / 10),
      fish: 6,
      minutes: minutes,
      correct: 1
    })
    setTimeout(() => {
      this.setData({ result: result, diagnosing: false })
      wx.showToast({ title: '诊断完成', icon: 'none' })
    }, 500)
  },

  resetText() {
    this.setData({ text: '', wordCount: 0, result: null })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  }
})
