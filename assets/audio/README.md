# 音频资源说明

小程序不内置英文 TTS。若需要单词与听力发音，请将音频文件放在本目录：

```
assets/audio/abandon.mp3
assets/audio/absorb.mp3
...
```

命名规则：单词小写 + `.mp3`，例如 `abandon.mp3`。

然后在 `utils/audio.js` 中把 `hasAudio` 的返回值改为 `true`：

```js
function hasAudio(word) {
  return !!word
}
```

单词学习页、词书详情页的喇叭按钮会自动尝试播放对应音频。
听力材料目前使用模拟播放进度，接入真实音频时可在 `pages/listening/listening.js`
的 `togglePlay` 中替换为 `wx.createInnerAudioContext()` 播放整段材料。

注意：微信小程序主包体积上限为 2 MB，音频较多时建议上传到 CDN，
或使用分包 / 云存储，并在 `audio.js` 中改为网络地址。
