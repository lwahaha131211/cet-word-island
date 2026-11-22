/**
 * 词灵岛 · 四六级卡通英语学习小程序
 * 应用入口：初始化本地学习数据，记录设备信息，维护每日学习状态。
 */
const store = require('./utils/store.js')

App({
  globalData: {
    appName: '词灵岛',
    version: '1.0.0',
    systemInfo: null,
    statusBarHeight: 20,
    // 页面间临时传递的学习结果
    lastSession: null
  },

  onLaunch() {
    // 初始化本地状态（含版本迁移与默认值补齐）
    store.init()

    try {
      const info = wx.getSystemInfoSync()
      this.globalData.systemInfo = info
      this.globalData.statusBarHeight = info.statusBarHeight || 20
    } catch (e) {
      console.warn('获取系统信息失败', e)
    }

    // 刷新宠物心情与每日任务
    store.touchOpen()
    store.ensureDaily()
  },

  onShow() {
    store.ensureDaily()
  },

  onError(err) {
    console.error('[词灵岛] 运行异常：', err)
  }
})
