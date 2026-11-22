/**
 * 伙伴小窝
 * 5 只原创伙伴、每只 5 段进化 + 2 条最终分支；喂食、抚摸、换装、切换伙伴。
 */
const store = require('../../utils/store.js')

const ACCESSORIES = [
  { id: 'none', name: '不戴配饰', emoji: '🚫', level: 1 },
  { id: 'hat', name: '学士帽', emoji: '🎩', level: 3 },
  { id: 'scarf', name: '暖暖围巾', emoji: '🧣', level: 5 },
  { id: 'crown', name: '伙伴王冠', emoji: '👑', level: 8 },
  { id: 'wings', name: '星光翅膀', emoji: '✨', level: 12 }
]

Page({
  data: {
    pet: null,
    collection: [],
    nextPet: null,
    ownedCount: 0,
    fish: 0,
    expPercent: 0,
    stages: [],
    branches: [],
    profile: null,
    accessories: [],
    showWardrobe: false,
    hearts: false,
    todayLearned: 0,
    totalLearned: 0
  },

  onShow() {
    if (typeof this.getTabBar === 'function' && this.getTabBar()) {
      this.getTabBar().setSelected(2)
    }
    this.refresh()
  },

  refresh() {
    const state = store.getState()
    const pet = store.getPetView()
    const collection = store.getPetCollection()
    const stages = store.getStages()
    const branches = store.getPetBranches()
    const profile = store.getVocabProfile()
    const accessories = ACCESSORIES.map((a) => {
      const unlocked = pet.unlocked.indexOf(a.id) >= 0
      const active = pet.accessory === a.id
      return {
        id: a.id,
        name: a.name,
        emoji: a.emoji,
        level: a.level,
        unlocked: unlocked,
        active: active,
        statusText: unlocked ? (active ? '正在佩戴' : '点击佩戴') : 'Lv.' + a.level + ' 解锁'
      }
    })
    this.setData({
      pet: pet,
      collection: collection,
      nextPet: collection.filter((p) => !p.owned)[0] || null,
      ownedCount: collection.filter((p) => p.owned).length,
      fish: state.wallet.fish,
      expPercent: Math.round((pet.expInLevel / pet.expNeed) * 100),
      stages: stages,
      branches: branches,
      profile: profile,
      accessories: accessories,
      todayLearned: store.getToday().newWords,
      totalLearned: state.stats.totalLearned
    })
  },

  switchPet(e) {
    const id = e.currentTarget.dataset.id
    const res = store.switchPet(id)
    if (!res.ok) {
      wx.showToast({ title: res.msg, icon: 'none' })
      return
    }
    this.setData({ hearts: true })
    setTimeout(() => {
      this.setData({ hearts: false })
    }, 900)
    wx.showToast({ title: res.msg, icon: 'none' })
    this.refresh()
  },

  onPetTap() {
    const res = store.petPet()
    this.setData({ hearts: true })
    setTimeout(() => {
      this.setData({ hearts: false })
    }, 1200)
    wx.showToast({ title: res.msg, icon: 'none' })
    this.refresh()
  },

  feed() {
    const res = store.feedPet()
    wx.showToast({ title: res.msg, icon: 'none' })
    if (res.ok) {
      store.vibrate('light')
      this.refresh()
    }
  },

  openWardrobe() {
    this.setData({ showWardrobe: true })
  },

  closeWardrobe() {
    this.setData({ showWardrobe: false })
  },

  chooseAccessory(e) {
    const id = e.currentTarget.dataset.id
    const item = this.data.accessories.filter((a) => a.id === id)[0]
    if (!item) return
    if (!item.unlocked) {
      wx.showToast({ title: this.data.pet.name + ' Lv.' + item.level + ' 解锁', icon: 'none' })
      return
    }
    store.setAccessory(id)
    this.refresh()
    wx.showToast({ title: '换好啦', icon: 'none' })
  },

  goGarden() {
    wx.navigateTo({ url: '/pages/garden/garden' })
  },

  goStudy() {
    wx.navigateTo({ url: '/pages/study/study' })
  },

  noop() {}
})
