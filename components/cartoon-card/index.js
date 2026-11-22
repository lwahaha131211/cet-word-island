/**
 * 卡通卡片容器：统一的描边、硬阴影与胶带装饰
 */
Component({
  options: {
    multipleSlots: true,
    addGlobalClass: true
  },
  properties: {
    title: { type: String, value: '' },
    emoji: { type: String, value: '' },
    extra: { type: String, value: '' },
    color: { type: String, value: '' },
    tape: { type: Boolean, value: false },
    pad: { type: String, value: '' }
  }
})
