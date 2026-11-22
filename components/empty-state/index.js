/**
 * 空状态占位
 */
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    emoji: { type: String, value: '🫧' },
    title: { type: String, value: '这里还空空的' },
    desc: { type: String, value: '' }
  }
})
