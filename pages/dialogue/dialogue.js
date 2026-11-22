/**
 * 情景对话 · 角色扮演
 * NPC 逐句发问，学习者在三个回应中选择最得体的一项，
 * 系统根据回应质量累计得分，结束后给出评级与关键表达。
 */
const store = require('../../utils/store.js')
const util = require('../../utils/util.js')
const dialogues = require('../../data/dialogues.js')

Page({
  data: {
    scenes: dialogues.map((d) => ({ id: d.id, title: d.title, emoji: d.emoji })),
    activeId: 'd1',
    scene: null,
    turns: [],
    turnIndex: 0,
    transcript: [],
    options: [],
    chosen: -1,
    answered: false,
    feedback: null,
    score: 0,
    maxScore: 0,
    phase: 'chat',
    scrollTo: '',
    result: null
  },

  onLoad(options) {
    const id = options && options.id ? options.id : 'd1'
    this.loadScene(id)
  },

  loadScene(id) {
    const scene = dialogues.filter((d) => d.id === id)[0] || dialogues[0]
    const turns = scene.turns.map((t) => {
      const copy = Object.assign({}, t)
      copy.options = util.shuffle(t.options).map((o, i) => Object.assign({}, o, { letter: 'ABC'[i] }))
      return copy
    })
    const first = turns[0]
    const transcript = [
      { id: 'msg_0', role: 'npc', en: first.npc.en, cn: first.npc.cn }
    ]
    this.setData({
      activeId: scene.id,
      scene: scene,
      turns: turns,
      turnIndex: 0,
      transcript: transcript,
      options: first.options,
      chosen: -1,
      answered: false,
      feedback: null,
      score: 0,
      maxScore: turns.length * 10,
      phase: 'chat',
      result: null,
      scrollTo: 'msg_0'
    })
  },

  selectScene(e) {
    const id = e.currentTarget.dataset.id
    if (id === this.data.activeId) return
    this.loadScene(id)
  },

  choose(e) {
    if (this.data.answered) return
    const idx = Number(e.currentTarget.dataset.index)
    const option = this.data.options[idx]
    if (!option) return
    const transcript = this.data.transcript.slice()
    transcript.push({
      id: 'msg_' + transcript.length,
      role: 'me',
      en: option.en,
      cn: option.cn
    })
    const score = this.data.score + option.score
    this.setData({
      chosen: idx,
      answered: true,
      feedback: option,
      score: score,
      transcript: transcript,
      scrollTo: 'msg_' + (transcript.length - 1)
    })
    if (option.score >= 10) store.vibrate('light')
  },

  nextTurn() {
    const next = this.data.turnIndex + 1
    if (next >= this.data.turns.length) {
      this.finish()
      return
    }
    const turn = this.data.turns[next]
    const transcript = this.data.transcript.slice()
    transcript.push({
      id: 'msg_' + transcript.length,
      role: 'npc',
      en: turn.npc.en,
      cn: turn.npc.cn
    })
    this.setData({
      turnIndex: next,
      transcript: transcript,
      options: turn.options,
      chosen: -1,
      answered: false,
      feedback: null,
      scrollTo: 'msg_' + (transcript.length - 1)
    })
  },

  finish() {
    const rate = this.data.maxScore ? this.data.score / this.data.maxScore : 0
    const stars = rate >= 0.9 ? 3 : rate >= 0.65 ? 2 : 1
    const comment =
      rate >= 0.9
        ? '表达自然又得体，像在当地生活了很久。'
        : rate >= 0.65
        ? '基本能完成交流，注意礼貌用语会更地道。'
        : '先把关键句型记住，再回来挑战一次吧。'
    const correct = Math.round(this.data.score / 10)
    store.logActivity({
      exp: 20 + correct * 4,
      fish: 10,
      correct: correct,
      wrong: Math.max(0, this.data.turns.length - correct),
      minutes: 3,
      quizzes: this.data.turns.length
    })
    store.markFinished('dialogues', this.data.scene.id)
    this.setData({
      phase: 'done',
      result: {
        score: this.data.score,
        max: this.data.maxScore,
        stars: stars,
        comment: comment,
        rate: Math.round(rate * 100)
      }
    })
  },

  restart() {
    this.loadScene(this.data.activeId)
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  speakLine(e) {
    const index = Number(e.currentTarget.dataset.index)
    const line = this.data.transcript[index]
    if (!line) return
    wx.showToast({ title: line.en, icon: 'none', duration: 1600 })
  }
})
