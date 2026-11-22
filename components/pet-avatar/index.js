/**
 * 原创伙伴形象：5 个物种 × 5 段形态，纯 CSS 绘制
 * species: sprout / ink / whale / turtle / fox
 * stage: 0-4
 */
const ACC_MAP = {
  hat: '🎩',
  scarf: '🧣',
  crown: '👑',
  wings: '✨',
  none: ''
}

Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    size: { type: Number, value: 220 },
    species: { type: String, value: 'sprout' },
    color: { type: String, value: '#FFD166' },
    accent: { type: String, value: '#6FD39B' },
    accessory: { type: String, value: 'none' },
    mood: { type: Number, value: 80 },
    stage: { type: Number, value: 0 },
    branch: { type: String, value: '' },
    animate: { type: Boolean, value: true }
  },
  data: {
    scale: 1,
    happy: true,
    accEmoji: ''
  },
  observers: {
    size: function (val) {
      const s = Number(val) || 220
      this.setData({ scale: s / 220 })
    },
    mood: function (val) {
      this.setData({ happy: Number(val) >= 40 })
    },
    accessory: function (val) {
      this.setData({ accEmoji: ACC_MAP[val] || '' })
    }
  },
  lifetimes: {
    attached() {
      this.setData({
        scale: (Number(this.data.size) || 220) / 220,
        happy: Number(this.data.mood) >= 40,
        accEmoji: ACC_MAP[this.data.accessory] || ''
      })
    }
  }
})
