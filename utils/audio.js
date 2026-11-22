/**
 * 词灵岛 · 发音模块
 * 小程序不内置英文 TTS，因此约定：把 mp3 放入 assets/audio/ 目录，
 * 文件名与单词一致（小写），即可自动播放。
 * 未内置音频时不报错，由页面展示音标与音波动画作为提示。
 */
let ctx = null
let currentWord = ''
const appStore = require('./store.js')

function getContext() {
  if (ctx) return ctx
  try {
    ctx = wx.createInnerAudioContext()
    ctx.obeyMuteSwitch = false
    ctx.volume = 1
  } catch (e) {
    ctx = null
  }
  return ctx
}

function hasAudio(word) {
  // 当前示例工程未内置音频文件，返回 false 走音标提示分支。
  // 接入真实音频后：return true
  return !!(word && false)
}

/**
 * 播放单词发音
 * @param {String} word 单词
 * @param {Function} onState 播放状态回调 (playing:Boolean)
 */
function playWord(word, onState) {
  const w = (word || '').toLowerCase()
  const settings = appStore.getState().settings
  if (!settings.sound || !w || !hasAudio(w)) {
    if (typeof onState === 'function') onState(false)
    return false
  }
  const audio = getContext()
  if (!audio) return false
  try {
    if (currentWord !== w) {
      audio.stop()
      currentWord = w
    }
    audio.src = '/assets/audio/' + w + '.mp3'
    audio.play()
    if (typeof onState === 'function') onState(true)
    audio.onEnded(() => {
      if (typeof onState === 'function') onState(false)
    })
    audio.onError(() => {
      if (typeof onState === 'function') onState(false)
    })
    return true
  } catch (e) {
    if (typeof onState === 'function') onState(false)
    return false
  }
}

function stop() {
  if (ctx) {
    try {
      ctx.stop()
    } catch (e) {}
  }
}

module.exports = {
  playWord: playWord,
  stop: stop,
  hasAudio: hasAudio
}
