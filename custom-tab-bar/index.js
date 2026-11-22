/**
 * 自定义底部导航：悬浮胶囊式卡通 TabBar
 * 各 Tab 页面在 onShow 中调用 getTabBar().setSelected(index) 同步高亮。
 */
Component({
  data: {
    selected: 0,
    list: [
      { pagePath: 'pages/index/index', text: '小岛', icon: '🏝️', color: '#FF9F1C' },
      { pagePath: 'pages/books/books', text: '词书', icon: '📖', color: '#2EC4B6' },
      { pagePath: 'pages/pet/pet', text: '小窝', icon: '🐣', color: '#FF86AE' },
      { pagePath: 'pages/profile/profile', text: '我的', icon: '🎒', color: '#9B7EDE' }
    ]
  },
  methods: {
    setSelected(index) {
      if (this.data.selected !== index) {
        this.setData({ selected: index })
      }
    },
    onTap(e) {
      const index = Number(e.currentTarget.dataset.index)
      const item = this.data.list[index]
      if (!item) return
      if (index === this.data.selected) return
      wx.switchTab({
        url: '/' + item.pagePath,
        success: () => {
          this.setData({ selected: index })
        }
      })
    }
  }
})
