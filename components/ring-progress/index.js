/**
 * 环形进度：使用 conic-gradient 绘制，无需 canvas
 */
Component({
  options: {
    addGlobalClass: true
  },
  properties: {
    percent: { type: Number, value: 0 },
    size: { type: Number, value: 160 },
    color: { type: String, value: '#FF9F1C' },
    value: { type: String, value: '' },
    label: { type: String, value: '' },
    track: { type: String, value: '#F1E7D8' }
  },
  data: {
    ringStyle: '',
    innerSize: 0
  },
  observers: {
    'percent, size, color, track': function () {
      this.refresh()
    }
  },
  lifetimes: {
    attached() {
      this.refresh()
    }
  },
  methods: {
    refresh() {
      const p = Math.max(0, Math.min(100, Number(this.data.percent) || 0))
      const size = Number(this.data.size) || 160
      const deg = Math.round(p * 3.6)
      this.setData({
        ringStyle:
          'width:' + size + 'rpx;height:' + size + 'rpx;background:conic-gradient(' +
          this.data.color + ' ' + deg + 'deg,' + this.data.track + ' ' + deg + 'deg);',
        innerSize: size - 26
      })
    }
  }
})
