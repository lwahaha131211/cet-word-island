/**
 * 词灵岛 · 核心逻辑自检（开发辅助）
 * 运行：node tools/selftest.js
 * 通过 mock wx 存储，验证学习记录、复习调度、宠物、花园、任务、
 * 成就、剧情、模考与统计等模块的运行结果。
 */
const assert = require('assert')

const storage = {}
global.wx = {
  getStorageSync(key) {
    return storage[key]
  },
  setStorageSync(key, value) {
    storage[key] = JSON.parse(JSON.stringify(value))
  },
  showToast() {},
  vibrateShort() {}
}

const store = require('../utils/store.js')
const util = require('../utils/util.js')
const planUtil = require('../utils/plan.js')
const wordsData = require('../data/words.js')
const writingData = require('../data/writing.js')

let checks = 0

function ok(cond, msg) {
  checks += 1
  assert.ok(cond, msg)
}

function eq(a, b, msg) {
  checks += 1
  assert.strictEqual(a, b, msg + '（实际 ' + a + '，期望 ' + b + '）')
}

/* 1. 初始化 */
store.init()
eq(store.getState().stats.totalLearned, 0, '初始学习数为 0')
eq(store.getToday().newWords, 0, '初始今日新词为 0')
eq(store.getTasks().length, 4, '每日任务数量')

/* 2. 提交单词：连续 4 次「认识」升到 4 级并开花 */
const w1 = wordsData.cet4[0]
for (let i = 0; i < 4; i++) {
  store.submitWord(w1, 2)
}
const rec1 = store.getRecord(w1.id)
eq(rec1.level, 4, '连续认识达到 4 级')
ok(rec1.nextAt > Date.now(), '下次复习时间被推后')
eq(store.getState().garden.plots.length, 1, '掌握后花园开出一朵花')
eq(store.getState().stats.totalLearned, 1, '新词计数只加一次')
eq(store.getToday().newWords, 1, '今日新词只加一次')
ok(store.getState().wallet.fish > 20, '学习获得小鱼干')

/* 3. 不认识：降级并进入待复习 */
store.submitWord(wordsData.cet4[1], 0)
eq(store.getRecord(wordsData.cet4[1].id).level, 0, '不认识降为 0 级')
const r2 = store.getRecord(wordsData.cet4[1].id)
r2.nextAt = Date.now() - 1000
store.save()
eq(store.getDueWords(wordsData.cet4, 10).length, 1, '到期单词可被取出')

/* 4. 错题病历 */
store.addWrong(wordsData.cet4[1].id, '形近混淆', {
  word: wordsData.cet4[1].word,
  cn: wordsData.cet4[1].cn
})
eq(store.getWrongStats().total, 1, '错题进入病历本')
eq(store.getWrongStats().byReason['形近混淆'], 1, '错因统计正确')
store.resolveWrong(wordsData.cet4[1].id)
eq(store.getWrongStats().total, 0, '标记掌握后病历清零')

/* 5. 伙伴养成 */
const pet = store.getPetView()
ok(pet.level >= 1, '伙伴等级可用')
ok(pet.hunger >= 0 && pet.hunger <= 100, '饱食度在合法区间')
const feed = store.feedPet()
ok(feed.ok, '喂食成功')
eq(store.getStages().length, 5, '进化阶段数量')
ok(store.getStages()[0].unlocked, '第一阶段已解锁')

const collection = store.getPetCollection()
eq(collection.length, 5, '伙伴物种数量')
eq(collection[0].owned, true, '初始伙伴已拥有')
eq(collection[0].active, true, '初始伙伴为当前伙伴')
ok(!collection[1].owned, '未达门槛时第二位伙伴锁定')
ok(!store.switchPet('ink').ok, '锁定伙伴不能切换')

/* 6. 每日任务与成就 */
const beforeFish = store.getState().wallet.fish
const claimed = store.claimTask('new')
ok(!claimed.ok, '任务未完成时不能领取')
for (let i = 2; i < 12; i++) {
  store.submitWord(wordsData.cet4[i], 2)
}
const tasks = store.getTasks()
const newTask = tasks.filter((t) => t.id === 'new')[0]
ok(newTask.done, '学习 10 个新词后任务完成')
const claim = store.claimTask('new')
ok(claim.ok, '任务完成后可领取')
ok(store.getState().wallet.fish >= beforeFish, '领取后小鱼干增加')

const achievements = store.getAchievements()
ok(achievements.length >= 20, '成就数量不少于 20')
ok(achievements.filter((a) => a.unlocked).length >= 2, '已解锁成就数量')
ok(store.getMetricValue('learned') >= 11, '学习指标统计')

/* 7. 剧情解锁 */
store.syncChapters()
const chapters = store.getChapters()
ok(chapters[0].unlocked, '第一章默认解锁')
ok(!chapters[1].unlocked, '未达门槛时第二章保持锁定')
ok(!!chapters[0].story && chapters[0].story.length >= 3, '章节包含剧情文本')
store.finishChapter('ch1')
eq(store.getChapters()[0].finished, true, '章节可被标记完成')

/* 8. 花园与装饰 */
for (let i = 12; i < 20; i++) {
  for (let k = 0; k < 4; k++) store.submitWord(wordsData.cet4[i], 2)
}
const garden = store.getGardenView()
ok(garden.count >= 5, '花园花朵持续增加')
ok(garden.decor.indexOf('butterfly') >= 0, '5 朵花解锁蝴蝶装饰')
ok(!!garden.nextDecor, '存在下一装饰目标')
store.syncChapters()
ok(store.getChapters()[1].unlocked, '累计 20 词后解锁第二章')

/* 8.1 多伙伴解锁与切换 */
ok(store.getPetCollection().filter((p) => p.owned).length >= 2, '累计 20 词解锁第二位伙伴')
const switched = store.switchPet('ink')
ok(switched.ok, '已解锁伙伴可以切换')
eq(store.getPetView().species, 'ink', '切换后当前伙伴正确')
eq(store.getStages().length, 5, '切换后进化图鉴正常')
const inkFeed = store.feedPet()
ok(inkFeed.ok, '新伙伴可以喂食')
store.switchPet('sprout')
eq(store.getPetView().species, 'sprout', '可以切回初始伙伴')

/* 8.2 全部伙伴与最终进化 */
const petState = store.getState()
petState.stats.totalLearned = 200
const unlockedPets = store.unlockPets()
ok(unlockedPets.length >= 3, '高词汇量解锁剩余伙伴')
eq(store.getPetCollection().filter((p) => p.owned).length, 5, '五只伙伴全部收集')
ok(store.switchPet('fox').ok, '可以切换到焰狐')
petState.pets.owned.fox.exp = 1200
petState.pets.owned.fox.level = store.getPetLevel(1200, 'fox')
const foxStages = store.getStages('fox')
eq(foxStages.length, 5, '焰狐进化段数')
ok(foxStages[4].unlocked, '高等级解锁最终形态')
ok(foxStages[4].current, '最终形态为当前形态')
const foxView = store.getPetView()
ok(['天焰狐', '赤焰狐'].indexOf(foxView.stage.name) >= 0, '最终形态名称正确')
ok(foxView.branch === 'a' || foxView.branch === 'b', '最终分支已确定')
const foxBranches = store.getPetBranches('fox')
eq(foxBranches.length, 2, '焰狐两条进化分支')
eq(foxBranches.filter((b) => b.selected).length, 1, '只有一条分支被选中')
ok(store.getVocabProfile().total > 0, '词汇结构画像已生成')
store.switchPet('sprout')

/* 9. 模考与统计 */
store.saveExamResult({
  score: 500,
  correct: 15,
  wrong: 5,
  total: 20,
  minutes: 12
})
eq(store.getState().exam.history.length, 1, '模考记录保存')
ok(store.getAchievements().filter((a) => a.id === 'score_425')[0].unlocked, '425 分成就解锁')
const stats = store.getStatsView()
eq(stats.days.length, 7, '近 7 天统计')
ok(stats.accuracy > 0, '正确率计算')
eq(store.getHeatmap(8).length, 56, '热力图 56 格')

/* 10. 工具函数 */
let optionOk = true
wordsData.all.forEach((w) => {
  const built = util.buildOptions(w, wordsData.all, 4)
  const texts = built.options.map((o) => o.text)
  const unique = {}
  texts.forEach((t) => {
    unique[t] = true
  })
  if (texts.length !== 4 || Object.keys(unique).length !== 4) optionOk = false
  if (texts[built.answer] !== w.cn) optionOk = false
})
ok(optionOk, '四选一选项始终唯一且答案正确')

const analysis = util.analyzeWriting(writingData.essays[0].sample)
ok(analysis.score >= 60, '范文诊断得分合理')
ok(analysis.advice.length > 0, '诊断给出建议')
ok(analysis.wordCount > 100, '范文词数统计')

const shadow = util.scoreShadowing('This is a test sentence for shadowing.', 3)
ok(shadow.score > 0 && shadow.stars >= 2, '跟读评分可用')

const plan = planUtil.buildPlan(
  { examDate: util.formatDate(Date.now() + 30 * 86400000, 'YYYY-MM-DD'), dailyNew: 15, targetScore: 500 },
  { total: 75, learned: 20, mastered: 5 }
)
ok(plan.totalDays >= 29 && plan.totalDays <= 31, '备考倒计时计算')
ok(plan.schedule.length > 0, '生成每日安排')
ok(planUtil.getPhases({ examDate: util.formatDate(Date.now() + 30 * 86400000, 'YYYY-MM-DD') }).length === 3, '备考三阶段')

/* 11. 拼图关卡可解性 */
const normal = (s) => (s || '').toLowerCase().replace(/[^a-z]/g, '')
const puzzleWords = wordsData.all.filter((w) => {
  if (!w.roots || w.roots.length < 2) return false
  return normal(w.roots.map((r) => r.t).join('')) === normal(w.word)
})
ok(puzzleWords.length >= 12, '可拼图单词数量充足（实际 ' + puzzleWords.length + '）')

/* 12. 重置 */
store.resetAll()
eq(store.getState().stats.totalLearned, 0, '重置后学习数据清空')
eq(store.getState().wallet.fish, 20, '重置后小鱼干恢复初始值')

console.log('==============================================')
console.log(' 词灵岛核心逻辑自检')
console.log('==============================================')
console.log(' ✅ 通过 ' + checks + ' 项断言')
console.log(' 可拼图单词：' + puzzleWords.length + ' 个')
console.log(' 成就总数：' + achievements.length + ' 个')
console.log(' 初始状态、学习调度、宠物、花园、任务、')
console.log(' 成就、剧情、模考、统计与工具函数均正常。')
