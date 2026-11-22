/**
 * 影子跟读 · 听说训练
 * 1. 选择材料，模拟播放并显示波形进度；
 * 2. 逐句跟读，调用录音接口采集时长并给出示例评分；
 * 3. 完成听力理解题，汇总本次成绩。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const listenings = require('../../data/listenings.js')

Page({
  data: {
    materials: listenings,
    activeId: 'l1',
    material: null,
    phase: 'listen',
    playing: false,
    playingIndex: -1,
    playProgress: 0,
    playTimeText: '00:00',
    totalTimeText: '00:00',
    showScript: true,
    sentenceScores: {},
    shadowAvg: 0,
    shadowCount: 0,
    recording: false,
    recIndex: -1,
    recSeconds: 0,
    quizIndex: 0,
    quizSelected: -1,
    quizAnswered: false,
    quizCorrect: 0,
    quizTotal: 0,
    quizQuestion: null,
    result: null
  },

  onLoad(options) {
    const id = options && options.id ? options.id : 'l1'
    this.initRecorder()
    this.selectMaterialById(id)
    this.startedAt = Date.now()
    this._active = true
  },

  onUnload() {
    this._active = false
    this.stopTimers()
    this.stopRecordSilently()
    if (!this.finished) {
      const minutes = (Date.now() - (this.startedAt || Date.now())) / 60000
      if (minutes >= 0.5) store.addMinutes(minutes)
    }
  },

  onHide() {
    this.stopTimers()
    this.setData({ playing: false })
  },

  initRecorder() {
    try {
      this.recorder = wx.getRecorderManager()
      this.recorder.onStop(() => this.handleRecordStop())
      this.recorder.onError(() => {
        this.setData({ recording: false, recIndex: -1 })
        wx.showToast({ title: '录音失败，请检查麦克风权限', icon: 'none' })
      })
    } catch (e) {
      this.recorder = null
    }
  },

  selectMaterialById(id) {
    const material = listenings.filter((m) => m.id === id)[0] || listenings[0]
    const totalWords = material.sentences.reduce((n, s) => n + s.en.split(/\s+/).length, 0)
    const seconds = Math.max(12, Math.round((totalWords / 2.4) * 10) / 10)
    this.totalSeconds = seconds
    this.setData({
      activeId: material.id,
      material: material,
      phase: 'listen',
      playing: false,
      playingIndex: -1,
      playProgress: 0,
      playTimeText: '00:00',
      totalTimeText: util.formatDate(new Date(seconds * 1000), 'mm:ss'),
      sentenceScores: {},
      shadowAvg: 0,
      shadowCount: 0,
      recording: false,
      recIndex: -1,
      quizIndex: 0,
      quizCorrect: 0,
      quizAnswered: false,
      quizSelected: -1
    })
    this.stopTimers()
  },

  selectMaterial(e) {
    const id = e.currentTarget.dataset.id
    if (id === this.data.activeId) return
    this.selectMaterialById(id)
  },

  toggleScript() {
    this.setData({ showScript: !this.data.showScript })
  },

  /** 模拟整段播放（示例工程用于演示流程与波形动画） */
  togglePlay() {
    if (this.data.playing) {
      this.pausePlay()
      return
    }
    this.playStart = Date.now()
    this.playBase = (this.data.playProgress / 100) * this.totalSeconds
    this.setData({ playing: true })
    this.playTimer = setInterval(() => {
      const elapsed = (Date.now() - this.playStart) / 1000 + this.playBase
      const percent = Math.min(100, Math.round((elapsed / this.totalSeconds) * 100))
      const shown = Math.min(this.totalSeconds, elapsed)
      this.setData({
        playProgress: percent,
        playTimeText: util.formatDate(new Date(shown * 1000), 'mm:ss')
      })
      if (percent >= 100) {
        this.pausePlay()
        this.setData({ playProgress: 100, playTimeText: this.data.totalTimeText })
      }
    }, 200)
  },

  pausePlay() {
    if (this.playTimer) {
      clearInterval(this.playTimer)
      this.playTimer = null
    }
    this.setData({ playing: false })
  },

  playSentence(e) {
    const index = Number(e.currentTarget.dataset.index)
    const sentence = this.data.material.sentences[index]
    if (!sentence) return
    if (this.playSentenceTimer) clearTimeout(this.playSentenceTimer)
    this.setData({ playingIndex: index })
    const ms = Math.max(1200, sentence.en.split(/\s+/).length * 420)
    this.playSentenceTimer = setTimeout(() => {
      this.setData({ playingIndex: -1 })
    }, ms)
    wx.showToast({ title: '正在示范第 ' + (index + 1) + ' 句', icon: 'none', duration: 700 })
  },

  /* ---------------- 录音跟读 ---------------- */
  startShadow(e) {
    if (this.data.recording) {
      this.stopRecord()
      return
    }
    const index = Number(e.currentTarget.dataset.index)
    if (!this.recorder) {
      wx.showToast({ title: '当前环境不支持录音', icon: 'none' })
      return
    }
    const self = this
    this.ensureRecordAuth(() => {
      self.beginRecord(index)
    })
  },

  ensureRecordAuth(cb) {
    wx.getSetting({
      success: (res) => {
        const auth = res.authSetting || {}
        if (auth['scope.record'] === false) {
          wx.showModal({
            title: '需要麦克风权限',
            content: '跟读评分需要使用麦克风，请在设置中开启。',
            confirmText: '去设置',
            success: (r) => {
              if (r.confirm) wx.openSetting({})
            }
          })
          return
        }
        if (auth['scope.record'] === true) {
          cb()
          return
        }
        wx.authorize({
          scope: 'scope.record',
          success: cb,
          fail: () => wx.showToast({ title: '未获得麦克风权限', icon: 'none' })
        })
      },
      fail: cb
    })
  },

  beginRecord(index) {
    this.recIndex = index
    this.recStart = Date.now()
    this.setData({ recording: true, recIndex: index, recSeconds: 0 })
    this.recTimer = setInterval(() => {
      this.setData({ recSeconds: Math.floor((Date.now() - this.recStart) / 1000) })
    }, 500)
    try {
      this.recorder.start({
        duration: 60000,
        sampleRate: 16000,
        numberOfChannels: 1,
        encodeBitRate: 48000,
        format: 'mp3'
      })
    } catch (err) {
      this.setData({ recording: false, recIndex: -1 })
      wx.showToast({ title: '录音启动失败', icon: 'none' })
    }
  },

  stopRecord() {
    if (!this.recorder) return
    try {
      this.recorder.stop()
    } catch (e) {
      this.setData({ recording: false, recIndex: -1 })
    }
  },

  stopRecordSilently() {
    if (this.data.recording && this.recorder) {
      try {
        this.recorder.stop()
      } catch (e) {}
    }
    if (this.recTimer) {
      clearInterval(this.recTimer)
      this.recTimer = null
    }
  },

  handleRecordStop() {
    if (this.recTimer) {
      clearInterval(this.recTimer)
      this.recTimer = null
    }
    if (this.recIndex < 0) {
      this.setData({ recording: false, recIndex: -1 })
      return
    }
    const index = this.recIndex
    const seconds = Math.max(1, Math.round((Date.now() - this.recStart) / 100) / 10)
    const sentence = this.data.material.sentences[index]
    const scored = util.scoreShadowing(sentence.en, seconds)
    const scores = Object.assign({}, this.data.sentenceScores)
    scores[index] = {
      score: scored.score,
      stars: scored.stars,
      wpm: scored.wpm,
      duration: scored.duration
    }
    const keys = Object.keys(scores)
    let total = 0
    keys.forEach((k) => {
      total += scores[k].score
    })
    this.recIndex = -1
    this.setData({
      recording: false,
      recIndex: -1,
      recSeconds: 0,
      sentenceScores: scores,
      shadowCount: keys.length,
      shadowAvg: keys.length ? Math.round(total / keys.length) : 0
    })
    if (this._active) {
      wx.showToast({
        title: '跟读评分 ' + scored.score + ' 分 · ' + scored.wpm + ' 词/分',
        icon: 'none',
        duration: 1600
      })
    }
  },

  /* ---------------- 听力题 ---------------- */
  startQuiz() {
    if (this.data.shadowCount === 0) {
      wx.showModal({
        title: '还没有跟读',
        content: '跟读一句可以获得更完整的训练反馈，也可以直接进入听力题。',
        confirmText: '直接做题',
        cancelText: '先跟读',
        success: (res) => {
          if (res.confirm) this.beginQuiz()
        }
      })
      return
    }
    this.beginQuiz()
  },

  beginQuiz() {
    const q = this.data.material.questions[0]
    this.setData({
      phase: 'quiz',
      quizIndex: 0,
      quizCorrect: 0,
      quizTotal: this.data.material.questions.length,
      quizQuestion: q,
      quizOptions: q.options.map((text, i) => ({ text: text, letter: 'ABCD'[i] })),
      quizSelected: -1,
      quizAnswered: false
    })
    this.quizStart = Date.now()
  },

  chooseQuiz(e) {
    if (this.data.quizAnswered) return
    const idx = Number(e.currentTarget.dataset.index)
    const correct = idx === this.data.quizQuestion.answer
    this.setData({
      quizSelected: idx,
      quizAnswered: true,
      quizCorrect: this.data.quizCorrect + (correct ? 1 : 0)
    })
    if (correct) store.vibrate('light')
  },

  nextQuiz() {
    const next = this.data.quizIndex + 1
    if (next >= this.data.quizTotal) {
      this.finish()
      return
    }
    this.setData({
      quizIndex: next,
      quizQuestion: this.data.material.questions[next],
      quizOptions: this.data.material.questions[next].options.map((text, i) => ({ text: text, letter: 'ABCD'[i] })),
      quizSelected: -1,
      quizAnswered: false
    })
  },

  finish() {
    this.finished = true
    const total = this.data.quizTotal
    const correct = this.data.quizCorrect
    const accuracy = total ? Math.round((correct / total) * 100) : 0
    const exp = 15 + this.data.shadowCount * 5 + correct * 8
    store.saveListeningScore(this.data.material.id, this.data.shadowAvg)
    store.logActivity({
      exp: exp,
      fish: 8,
      correct: correct,
      wrong: total - correct,
      minutes: Math.max(1, Math.round((Date.now() - (this.startedAt || Date.now())) / 60000)),
      quizzes: total
    })
    this.setData({
      phase: 'done',
      result: {
        shadowAvg: this.data.shadowAvg,
        shadowCount: this.data.shadowCount,
        correct: correct,
        total: total,
        accuracy: accuracy,
        exp: exp,
        stars: this.data.shadowAvg >= 90 ? 5 : this.data.shadowAvg >= 80 ? 4 : this.data.shadowAvg >= 70 ? 3 : 2
      }
    })
    this.stopTimers()
  },

  restart() {
    this.finished = false
    this.selectMaterialById(this.data.activeId)
    this.startedAt = Date.now()
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  stopTimers() {
    if (this.playTimer) {
      clearInterval(this.playTimer)
      this.playTimer = null
    }
    if (this.playSentenceTimer) {
      clearTimeout(this.playSentenceTimer)
      this.playSentenceTimer = null
    }
    if (this.recTimer) {
      clearInterval(this.recTimer)
      this.recTimer = null
    }
  }
})
