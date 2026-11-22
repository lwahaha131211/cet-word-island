/**
 * 词书页 · 选择词书、查看掌握情况、进入学习/复习/拼图
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const audio = require('../../utils/audio.js')
const wordsData = require('../../data/words.js')

const PAGE_SIZE = 60

Page({
  data: {
    books: wordsData.books,
    bookId: 'cet4',
    book: null,
    progress: { total: 0, learned: 0, mastered: 0, due: 0, percent: 0 },
    filtered: [],
    filteredTotal: 0,
    hasMore: false,
    filter: 'all',
    keyword: '',
    filters: [
      { key: 'all', label: '全部' },
      { key: 'new', label: '未学' },
      { key: 'learning', label: '学习中' },
      { key: 'mastered', label: '已掌握' }
    ],
    detail: null,
    showDetail: false,
    showPhonetic: true,
    detailWordSize: 52
  },

  onLoad(options) {
    const bookId = options && options.book === 'cet6' ? 'cet6' : 'cet4'
    this.setData({ bookId: bookId })
    this.refresh()
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setSelected(1)
    }
    this.refresh()
  },

  onUnload() {
    if (this.searchTimer) clearTimeout(this.searchTimer)
  },

  onReachBottom() {
    this.loadMore()
  },

  refresh() {
    const bookId = this.data.bookId
    const book = wordsData.books.filter((b) => b.id === bookId)[0] || wordsData.books[0]
    const raw = wordsData.getBook(bookId)
    const progress = store.getBookProgress(raw, bookId)
    this.allWords = raw.map((w) => {
      const r = store.getRecord(w.id)
      const level = r ? r.level : 0
      return {
        id: w.id,
        word: w.word,
        phonetic: w.phonetic,
        cn: w.cn,
        pos: w.pos,
        level: level,
        statusText: !r ? '未学' : level >= 4 ? '已掌握' : '学习中',
        statusClass: !r ? 'tag' : level >= 4 ? 'tag-green' : 'tag-orange'
      }
    })
    this.setData({
      book: book,
      progress: progress,
      showPhonetic: store.getState().settings.showPhonetic
    })
    this.setFiltered(this.applyFilter(this.allWords, this.data.filter, this.data.keyword), true)
  },

  /** 仅向视图层投递一页数据，避免 3000+ 词条一次性渲染 */
  setFiltered(full, reset) {
    this.filteredFull = full
    let visible
    if (reset) {
      visible = full.slice(0, PAGE_SIZE)
    } else {
      const start = this.data.filtered.length
      visible = this.data.filtered.concat(full.slice(start, start + PAGE_SIZE))
    }
    this.setData({
      filtered: visible,
      filteredTotal: full.length,
      hasMore: visible.length < full.length
    })
  },

  loadMore() {
    if (!this.data.hasMore) return
    this.setFiltered(this.filteredFull, false)
  },

  applyFilter(list, filter, keyword) {
    const kw = (keyword || '').trim().toLowerCase()
    return list.filter((w) => {
      let ok = true
      if (filter === 'new') ok = w.level === 0 && w.statusText === '未学'
      else if (filter === 'learning') ok = w.statusText === '学习中'
      else if (filter === 'mastered') ok = w.statusText === '已掌握'
      if (!ok) return false
      if (!kw) return true
      return w.word.toLowerCase().indexOf(kw) >= 0 || w.cn.indexOf(kw) >= 0
    })
  },

  switchBook(e) {
    const id = e.currentTarget.dataset.id
    if (id === this.data.bookId) return
    this.setData({ bookId: id, keyword: '' })
    this.refresh()
  },

  onFilter(e) {
    const key = e.currentTarget.dataset.key
    this.setData({ filter: key })
    this.setFiltered(this.applyFilter(this.allWords, key, this.data.keyword), true)
  },

  onSearch(e) {
    const kw = e.detail.value
    this.setData({ keyword: kw })
    if (this.searchTimer) clearTimeout(this.searchTimer)
    this.searchTimer = setTimeout(() => {
      this.setFiltered(this.applyFilter(this.allWords, this.data.filter, kw), true)
    }, 180)
  },

  clearSearch() {
    if (this.searchTimer) clearTimeout(this.searchTimer)
    this.setData({ keyword: '' })
    this.setFiltered(this.applyFilter(this.allWords, this.data.filter, ''), true)
  },

  openWord(e) {
    const id = e.currentTarget.dataset.id
    const word = wordsData.getById(id)
    if (!word) return
    const record = store.getRecord(id)
    const detail = Object.assign({}, word, {
      seen: record ? record.seen : 0,
      right: record ? record.right : 0,
      level: record ? record.level : 0,
      levelText: util.levelText(record ? record.level : 0)
    })
    const length = Math.max(4, word.word.length)
    this.setData({
      detail: detail,
      detailWordSize: Math.max(26, Math.min(52, Math.floor(560 / length))),
      showDetail: true
    })
  },

  closeDetail() {
    this.setData({ showDetail: false })
  },

  speak() {
    if (!this.data.detail) return
    if (!this.data.detail.phonetic) {
      wx.showToast({ title: '暂无音标', icon: 'none' })
      return
    }
    audio.playWord(this.data.detail.word)
    wx.showToast({
      title: this.data.detail.phonetic,
      icon: 'none',
      duration: 1200
    })
  },

  startStudy() {
    const remain = this.allWords.filter((w) => w.statusText === '未学').length
    if (remain === 0) {
      wx.showToast({ title: '这本词书的新词已学完，去复习吧', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/study/study?book=' + this.data.bookId })
  },

  startReview() {
    const due = store.getDueWords(wordsData.getBook(this.data.bookId), 40)
    if (!due.length) {
      wx.showToast({ title: '暂时没有到期单词，先学点新词吧', icon: 'none' })
      return
    }
    wx.navigateTo({ url: '/pages/review/review?book=' + this.data.bookId })
  },

  startPuzzle() {
    wx.navigateTo({ url: '/pages/puzzle/puzzle' })
  },

  onShareAppMessage() {
    return {
      title: '词灵岛四六级词书：' + (this.data.book ? this.data.book.name : ''),
      path: '/pages/books/books'
    }
  },

  noop() {}
})
