/**
 * 关于
 * 产品介绍、软件信息与使用声明。
 */
const store = require('../../utils/store.js')

Page({
  data: {
    version: '1.0.0',
    pet: null,
    features: [
      { emoji: '🐣', name: '伙伴养成', desc: '5 只原创伙伴、30 种形态，词汇结构决定最终进化分支' },
      { emoji: '🧩', name: '词根拼图', desc: '把单词拆成词根词缀，再动手拼回去' },
      { emoji: '🌷', name: '知识花园', desc: '每掌握一个词，就有一朵花在花园盛开' },
      { emoji: '🎧', name: '影子跟读', desc: '录音跟读评分，把听力与口语一起练' },
      { emoji: '🩺', name: '错题病历', desc: '按错因分类，自动生成复习处方' },
      { emoji: '📜', name: '剧情闯关', desc: '解锁词灵岛章节，让词汇量推动故事' }
    ],
    info: [
      { label: '软件名称', value: '词灵岛四六级英语学习软件' },
      { label: '版本号', value: 'V1.0.0' },
      { label: '运行平台', value: '微信小程序' },
      { label: '开发语言', value: 'JavaScript / WXML / WXSS' },
      { label: '适用人群', value: '备考大学英语四、六级的学生' }
    ]
  },

  onLoad() {
    this.setData({ pet: store.getPetView() })
  },

  copyInfo() {
    const lines = this.data.info.map((i) => i.label + '：' + i.value).join('\n')
    wx.setClipboardData({
      data: lines,
      success: () => wx.showToast({ title: '软件信息已复制', icon: 'none' })
    })
  },

  goHome() {
    wx.switchTab({ url: '/pages/index/index' })
  },

  onShareAppMessage() {
    return {
      title: '词灵岛 · 让四六级单词长成一座会发光的小岛',
      path: '/pages/index/index'
    }
  }
})
