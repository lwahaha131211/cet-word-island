/**
 * 词灵岛 · 本地数据仓库
 * ------------------------------------------------------------
 * 采用单一 JSON 快照持久化（wx.setStorageSync），页面只通过本模块
 * 读写学习数据，保证「单词记录、复习计划、词灵成长、知识花园、
 * 成就任务」之间的状态一致。
 *
 * 复习算法：改进版 Leitner / SM-2 简化模型
 *   熟练度 0-6 级，对应下次复习间隔 [10分钟, 1, 2, 4, 7, 15, 30] 天
 *   认识 → 升级 + 间隔后移；模糊 → 保持等级，次日再见；
 *   不认识 → 降级 + 10 分钟后重现。
 */
const chaptersData = require('../data/chapters.js')
const achievementsData = require('../data/achievements.js')
const petsData = require('../data/pets.js')

const STORAGE_KEY = 'CET_ISLAND_STATE_V1'
const DAY = 24 * 60 * 60 * 1000
const MINUTE = 60 * 1000
const SRS_DAYS = [0, 1, 2, 4, 7, 15, 30]
const AGAIN_GAP = 10 * MINUTE

const FLOWER_COLORS = ['#FF86AE', '#FFD166', '#7BDCB5', '#7FB8FF', '#C3A6FF', '#FF9F1C']

// 用于「词汇结构驱动进化」的词缀表（不含连字符，便于直接匹配单词）
const PREFIXES = [
  'un', 're', 'pre', 'dis', 'mis', 'over', 'under', 'inter', 'sub', 'trans',
  'anti', 'auto', 'bi', 'co', 'de', 'en', 'ex', 'im', 'in', 'non',
  'post', 'pro', 'semi', 'super', 'tele', 'ultra', 'multi', 'micro', 'mono', 'poly',
  'hyper', 'hypo', 'extra', 'fore', 'out', 'up', 'down', 'counter', 'mid', 'neo'
]
const SUFFIXES = [
  'tion', 'sion', 'ment', 'ness', 'ity', 'ance', 'ence', 'ship', 'hood', 'ism',
  'ist', 'er', 'or', 'able', 'ible', 'ous', 'ive', 'al', 'ic', 'ly',
  'ful', 'less', 'ify', 'ize', 'ise', 'ate', 'en', 'age', 'ary', 'ory',
  'ent', 'ant', 'ure', 'y'
]

let vocabCache = null

const TASK_POOL = [
  { id: 'new', emoji: '📖', title: '学习 {n} 个新词', metric: 'newWords', target: 10, reward: 20 },
  { id: 'review', emoji: '🔁', title: '复习 {n} 个单词', metric: 'reviews', target: 20, reward: 15 },
  { id: 'focus', emoji: '⏳', title: '专注学习 {n} 分钟', metric: 'minutes', target: 15, reward: 10 },
  { id: 'correct', emoji: '🎯', title: '答对 {n} 道题', metric: 'correct', target: 15, reward: 15 }
]

let state = null

/* ============================================================
 * 基础工具
 * ============================================================ */
function clone(obj) {
  return JSON.parse(JSON.stringify(obj))
}

function pad(n) {
  return n < 10 ? '0' + n : '' + n
}

function dayKey(ts) {
  const d = new Date(typeof ts === 'number' ? ts : Date.now())
  return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate())
}

function todayKey() {
  return dayKey(Date.now())
}

function clamp(n, min, max) {
  return Math.max(min, Math.min(max, n))
}

function hash(str) {
  let h = 0
  for (let i = 0; i < str.length; i++) {
    h = (h * 31 + str.charCodeAt(i)) % 1000000007
  }
  return h
}

function defaultExamDate() {
  // 默认 60 天后考试，方便首次打开即有倒计时
  return dayKey(Date.now() + 60 * DAY)
}

function emptyDay() {
  return { newWords: 0, reviews: 0, minutes: 0, correct: 0, wrong: 0, quizzes: 0 }
}

function defaultState() {
  return {
    version: 1,
    createdAt: Date.now(),
    profile: {
      nickname: '词灵学徒',
      avatar: '🐣',
      examDate: defaultExamDate(),
      targetScore: 500,
      dailyNew: 15,
      dailyReview: 40,
      joinedAt: Date.now()
    },
    settings: {
      sound: true,
      vibrate: true,
      showPhonetic: true,
      reminder: '20:00'
    },
    records: {},
    stats: {
      totalLearned: 0,
      totalReviews: 0,
      totalCorrect: 0,
      totalWrong: 0,
      totalMinutes: 0,
      streak: 0,
      maxStreak: 0,
      lastStudyDay: '',
      days: {}
    },
    wallet: { fish: 20 },
    pets: {
      active: 'sprout',
      owned: {
        sprout: {
          exp: 0,
          hunger: 82,
          mood: 86,
          lastTick: Date.now(),
          lastFedAt: 0,
          lastPlayAt: 0,
          accessory: 'none',
          unlocked: ['none'],
          level: 1
        }
      }
    },
    garden: {
      plots: [],
      decor: ['sun'],
      theme: 'spring'
    },
    achievements: { unlocked: {} },
    wrongbook: [],
    tasks: { date: '', claimed: [] },
    chapters: { unlocked: [], finished: [] },
    puzzle: { best: 0, cleared: [], playCount: 0 },
    exam: { history: [] },
    dialogues: { finished: [] },
    readings: { finished: [] },
    listenings: { best: {} },
    writing: { count: 0, best: 0 },
    lastSession: null
  }
}

function isPlainObject(v) {
  return v && typeof v === 'object' && !Array.isArray(v)
}

/** 用默认值补齐旧版本数据，避免升级后字段缺失 */
function mergeDefaults(target, defaults) {
  const out = isPlainObject(target) ? target : {}
  Object.keys(defaults).forEach((key) => {
    const def = defaults[key]
    if (out[key] === undefined || out[key] === null) {
      out[key] = clone(def)
    } else if (isPlainObject(def) && isPlainObject(out[key])) {
      out[key] = mergeDefaults(out[key], def)
    }
  })
  return out
}

/* ============================================================
 * 生命周期
 * ============================================================ */
function init() {
  let saved = null
  try {
    saved = wx.getStorageSync(STORAGE_KEY)
  } catch (e) {
    console.warn('读取本地数据失败', e)
  }
  if (!saved || typeof saved !== 'object') {
    state = defaultState()
    save()
    return state
  }
  // 旧版本只有单只词灵，迁移到多伙伴结构
  if (saved.pet && !saved.pets) {
    const old = saved.pet
    saved.pets = {
      active: 'sprout',
      owned: {
        sprout: {
          exp: old.exp || 0,
          hunger: typeof old.hunger === 'number' ? old.hunger : 82,
          mood: typeof old.mood === 'number' ? old.mood : 86,
          lastTick: old.lastTick || Date.now(),
          lastFedAt: old.lastFedAt || 0,
          lastPlayAt: old.lastPlayAt || 0,
          accessory: old.accessory || 'none',
          unlocked: Array.isArray(old.unlocked) ? old.unlocked : ['none'],
          level: old.level || 1
        }
      }
    }
    delete saved.pet
  }
  state = mergeDefaults(saved, defaultState())
  state.version = 1
  save()
  return state
}

function getState() {
  if (!state) init()
  return state
}

function save() {
  if (!state) return
  try {
    wx.setStorageSync(STORAGE_KEY, state)
  } catch (e) {
    console.warn('保存本地数据失败', e)
  }
}

function resetAll() {
  state = defaultState()
  save()
  return state
}

/** 打开小程序时刷新当前伙伴的饱食度与心情 */
function touchOpen() {
  const now = Date.now()
  const pet = activePetRecord()
  if (!pet.lastTick) pet.lastTick = now
  const days = Math.floor((now - pet.lastTick) / DAY)
  if (days > 0) {
    pet.hunger = clamp(pet.hunger - days * 6, 12, 100)
    pet.mood = clamp(pet.mood - days * 5, 12, 100)
    pet.lastTick = pet.lastTick + days * DAY
  }
  unlockPets()
  syncPetUnlocks()
  syncChapters()
  save()
}

/** 保证每日任务与统计结构存在 */
function ensureDaily() {
  const s = getState()
  const t = todayKey()
  if (!s.stats.days[t]) {
    s.stats.days[t] = emptyDay()
  }
  if (s.tasks.date !== t) {
    s.tasks.date = t
    s.tasks.claimed = []
  }
  // 只保留最近 180 天明细，控制存储体积
  const keys = Object.keys(s.stats.days)
  if (keys.length > 180) {
    keys.sort()
    keys.slice(0, keys.length - 180).forEach((k) => delete s.stats.days[k])
  }
  save()
  return s.stats.days[t]
}

function getToday() {
  const s = getState()
  return s.stats.days[todayKey()] || emptyDay()
}

/* ============================================================
 * 学习记录与复习调度
 * ============================================================ */
function getRecord(wordId) {
  return getState().records[wordId] || null
}

function isMastered(wordId) {
  const r = getRecord(wordId)
  return !!(r && r.level >= 4)
}

function isDue(wordId, now) {
  const r = getRecord(wordId)
  if (!r) return false
  return r.nextAt <= (now || Date.now())
}

/**
 * 提交一个单词的学习反馈
 * @param {Object} word   单词对象（需含 id / word / book）
 * @param {Number} quality 0 不认识 / 1 模糊 / 2 认识
 * @returns {Object} { record, levelUp, newAchievements }
 */
function submitWord(word, quality) {
  const s = getState()
  const t = todayKey()
  const day = ensureDaily()
  const now = Date.now()
  const id = word.id
  const isNew = !s.records[id]
  const beforeLevel = s.records[id] ? s.records[id].level : 0
  const record = s.records[id] || {
    wordId: id,
    word: word.word,
    book: word.book || 'cet4',
    level: 0,
    seen: 0,
    right: 0,
    wrong: 0,
    firstAt: now,
    lastAt: now,
    nextAt: now
  }

  record.seen += 1
  record.lastAt = now
  if (quality === 2) {
    record.level = clamp(record.level + 1, 0, 6)
    record.right += 1
    record.nextAt = now + SRS_DAYS[record.level] * DAY
  } else if (quality === 1) {
    record.level = clamp(record.level, 0, 6)
    record.nextAt = now + DAY
  } else {
    record.level = clamp(record.level - 1, 0, 6)
    record.wrong += 1
    record.nextAt = now + AGAIN_GAP
  }
  s.records[id] = record

  if (isNew) {
    s.stats.totalLearned += 1
    day.newWords += 1
  } else {
    day.reviews += 1
    s.stats.totalReviews += 1
  }

  if (quality === 2) {
    s.stats.totalCorrect += 1
    day.correct += 1
  } else if (quality === 0) {
    s.stats.totalWrong += 1
    day.wrong += 1
  }

  const petBefore = getPetLevel()
  const gainExp = quality === 2 ? 10 : quality === 1 ? 7 : 5
  addExp(gainExp)
  s.wallet.fish += quality === 2 ? 2 : 1
  const active = activePetRecord()
  active.hunger = clamp(active.hunger - 1, 10, 100)
  active.mood = clamp(active.mood + 1, 10, 100)
  s.lastSession = {
    wordId: id,
    quality: quality,
    at: now
  }
  touchStudy(day)
  if (record.level >= 4) {
    plantWord(word)
  }
  const newPets = unlockPets()
  const newAchievements = checkAchievements()
  save()
  return {
    record: clone(record),
    beforeLevel: beforeLevel,
    levelUp: getPetLevel() > petBefore,
    newAchievements: newAchievements,
    newPets: newPets
  }
}

function touchStudy(day) {
  const s = getState()
  const t = todayKey()
  if (s.stats.lastStudyDay === t) return
  const yesterday = dayKey(Date.now() - DAY)
  s.stats.streak = s.stats.lastStudyDay === yesterday ? s.stats.streak + 1 : 1
  s.stats.maxStreak = Math.max(s.stats.maxStreak, s.stats.streak)
  s.stats.lastStudyDay = t
  if (day && day !== s.stats.days[t]) s.stats.days[t] = day
}

/** 通用行为记账：阅读、听力、测验等 */
function logActivity(payload) {
  const p = payload || {}
  const s = getState()
  const day = ensureDaily()
  if (p.newWords) day.newWords += p.newWords
  if (p.reviews) {
    day.reviews += p.reviews
    s.stats.totalReviews += p.reviews
  }
  if (p.correct) {
    day.correct += p.correct
    s.stats.totalCorrect += p.correct
  }
  if (p.wrong) {
    day.wrong += p.wrong
    s.stats.totalWrong += p.wrong
  }
  if (p.minutes) {
    day.minutes = Math.round((day.minutes + p.minutes) * 10) / 10
    s.stats.totalMinutes = Math.round((s.stats.totalMinutes + p.minutes) * 10) / 10
  }
  if (p.quizzes) day.quizzes += p.quizzes
  if (p.exp) addExp(p.exp)
  if (p.fish) s.wallet.fish += p.fish
  const active = activePetRecord()
  active.hunger = clamp(active.hunger - 1, 10, 100)
  touchStudy(day)
  unlockPets()
  const newly = checkAchievements()
  save()
  return newly
}

function addMinutes(minutes) {
  if (!minutes || minutes <= 0) return
  const s = getState()
  const day = ensureDaily()
  const m = Math.round(minutes * 10) / 10
  day.minutes = Math.round((day.minutes + m) * 10) / 10
  s.stats.totalMinutes = Math.round((s.stats.totalMinutes + m) * 10) / 10
  save()
}

function addExp(exp) {
  const pet = activePetRecord()
  pet.exp += exp
  pet.level = getPetLevel(pet.exp)
  syncPetUnlocks()
}

/** 按用户设置触发触感反馈 */
function vibrate(type) {
  const s = getState()
  if (!s.settings.vibrate) return
  try {
    wx.vibrateShort({ type: type || 'light' })
  } catch (e) {}
}

/* ============================================================
 * 词汇结构分析
 * 词根 / 前缀 / 后缀 / 词性 / 长词分布决定伙伴最终进化分支。
 * ============================================================ */
function analyzeWord(word) {
  const flags = {
    prefix: 0, suffix: 0, root: 0, long: 0,
    noun: 0, verb: 0, adj: 0, adv: 0,
    verbAdj: 0, nounAdj: 0, affix: 0
  }
  if (!word || !word.word) return flags
  const text = word.word.toLowerCase()

  PREFIXES.forEach((p) => {
    if (text.indexOf(p) === 0) flags.prefix = 1
  })
  SUFFIXES.forEach((s) => {
    if (text.length > s.length + 1 && text.slice(-s.length) === s) flags.suffix = 1
  })
  if (word.roots && word.roots.length) flags.root = 1
  if (text.length >= 9) flags.long = 1

  const parts = (word.pos || '')
    .toLowerCase()
    .split('/')
    .map((p) => p.replace(/\./g, '').trim())
    .filter(Boolean)

  if (parts.length) {
    parts.forEach((p) => {
      if (p === 'n') flags.noun = 1
      else if (p === 'v') flags.verb = 1
      else if (p === 'adj') flags.adj = 1
      else if (p === 'adv') flags.adv = 1
    })
  } else {
    // 无词性时按后缀粗略判断，保证全量词也能参与统计
    if (/(tion|sion|ment|ness|ity|ance|ence|ship|hood|ism|ist|age|ure)$/.test(text)) flags.noun = 1
    if (/(ify|ize|ise|ate|en)$/.test(text)) flags.verb = 1
    if (/(ous|ful|less|able|ible|ive|al|ic|ent|ant)$/.test(text)) flags.adj = 1
    if (/ly$/.test(text)) flags.adv = 1
  }

  flags.verbAdj = flags.verb + flags.adj
  flags.nounAdj = flags.noun + flags.adj
  flags.affix = flags.prefix + flags.suffix
  return flags
}

/** 汇总已学词汇的结构画像（按 totalLearned 缓存） */
function getVocabProfile() {
  const s = getState()
  const key = s.stats.totalLearned
  if (vocabCache && vocabCache.key === key) return vocabCache.value

  const wordsData = require('../data/words.js')
  const profile = {
    total: 0, prefix: 0, suffix: 0, root: 0, long: 0,
    noun: 0, verb: 0, adj: 0, adv: 0,
    verbAdj: 0, nounAdj: 0, affix: 0
  }
  Object.keys(s.records).forEach((id) => {
    const word = wordsData.getById(id)
    if (!word) return
    const flags = analyzeWord(word)
    profile.total += 1
    Object.keys(flags).forEach((k) => {
      profile[k] += flags[k]
    })
  })

  const metrics = [
    ['prefix', '前缀'], ['suffix', '后缀'], ['root', '词根'],
    ['noun', '名词'], ['verb', '动词'], ['adj', '形容词'], ['adv', '副词'],
    ['long', '长词'], ['affix', '词缀']
  ]
  let dominant = ['均衡', 0]
  metrics.forEach((m) => {
    if (profile[m[0]] > dominant[1]) dominant = [m[1], profile[m[0]]]
  })
  profile.dominant = dominant[0]
  profile.dominantValue = dominant[1]
  vocabCache = { key: key, value: profile }
  return profile
}

/** 按词汇结构选最终分支：指标高者胜，打平走 a */
function pickPetBranch(species, profile) {
  if (!species || !species.branches || species.branches.length < 2) return ''
  const p = profile || getVocabProfile()
  const a = species.branches[0]
  const b = species.branches[1]
  const va = p[a.metric] || 0
  const vb = p[b.metric] || 0
  return va >= vb ? a.key : b.key
}

/* ============================================================
 * 伙伴养成
 * ============================================================ */
function createPetRecord() {
  return {
    exp: 0,
    hunger: 82,
    mood: 86,
    lastTick: Date.now(),
    lastFedAt: 0,
    lastPlayAt: 0,
    accessory: 'none',
    unlocked: ['none'],
    branch: '',
    level: 1
  }
}

function activePetRecord() {
  const s = getState()
  if (!s.pets.owned[s.pets.active]) {
    s.pets.active = 'sprout'
  }
  if (!s.pets.owned.sprout) {
    s.pets.owned.sprout = createPetRecord()
  }
  const record = s.pets.owned[s.pets.active] || s.pets.owned.sprout
  if (!Array.isArray(record.unlocked)) record.unlocked = ['none']
  if (!record.accessory) record.accessory = 'none'
  if (typeof record.exp !== 'number') record.exp = 0
  if (typeof record.hunger !== 'number') record.hunger = 82
  if (typeof record.mood !== 'number') record.mood = 86
  if (typeof record.branch !== 'string') record.branch = ''
  return record
}

function getSpecies(id) {
  return petsData.getById(id || getState().pets.active)
}

function getPetLevel(exp, speciesId) {
  const s = getState()
  const id = speciesId || s.pets.active
  const record = s.pets.owned[id]
  const total = typeof exp === 'number' ? exp : record ? record.exp : 0
  return Math.max(1, Math.floor(total / 100) + 1)
}

function getPetStage(level, speciesId) {
  const species = getSpecies(speciesId)
  const stages = species.stages
  const lv = level || getPetLevel(undefined, species.id)
  let index = 0
  stages.forEach((st, i) => {
    if (lv >= st.level) index = i
  })

  let stage = stages[index]
  let branch = null
  let branchKey = ''
  if (index === stages.length - 1 && species.branches) {
    const record = getState().pets.owned[species.id]
    branchKey = (record && record.branch) || pickPetBranch(species, getVocabProfile())
    branch = species.branches.filter((b) => b.key === branchKey)[0] || species.branches[0]
    stage = Object.assign({}, stage, {
      name: branch.name,
      color: branch.color,
      accent: branch.accent,
      desc: branch.desc
    })
  }

  return {
    index: index,
    name: stage.name,
    color: stage.color,
    accent: stage.accent,
    desc: stage.desc,
    min: stage.level,
    branchKey: branchKey,
    branchName: branch ? branch.name : '',
    branchHint: branch ? branch.hint : '',
    branch: branch,
    next: stages[index + 1] || null
  }
}

function getPetView() {
  const s = getState()
  const species = getSpecies()
  const record = activePetRecord()
  const level = getPetLevel(record.exp, species.id)
  const stage = getPetStage(level, species.id)
  const lines = species.lines || []
  let say = lines[s.stats.totalLearned % Math.max(1, lines.length)] || species.tagline
  if (record.hunger < 35) say = '肚子咕咕叫啦，喂我一条小鱼干好不好？'
  else if (record.mood < 40) say = '有点无聊，摸摸我的头嘛～'
  else if (s.stats.streak >= 7) say = '连续打卡 ' + s.stats.streak + ' 天，你超棒的！'
  else if (s.stats.totalLearned >= 100) say = '我们已经认识 ' + s.stats.totalLearned + ' 个单词啦！'
  return {
    species: species.id,
    name: species.name,
    title: species.title,
    emoji: species.emoji,
    tagline: species.tagline,
    desc: species.desc,
    level: level,
    exp: record.exp,
    expInLevel: record.exp % 100,
    expNeed: 100,
    hunger: Math.round(record.hunger),
    mood: Math.round(record.mood),
    stage: stage,
    branch: stage.branchKey,
    branchName: stage.branchName,
    branchHint: stage.branchHint,
    accessory: record.accessory,
    unlocked: record.unlocked,
    say: say,
    color: stage.color,
    accent: stage.accent,
    ownedCount: Object.keys(s.pets.owned).length
  }
}

/** 当前伙伴的进化阶段 */
function getStages(speciesId) {
  const species = getSpecies(speciesId)
  const level = getPetLevel(undefined, species.id)
  const currentStage = getPetStage(level, species.id)
  const current = currentStage.index
  const record = getState().pets.owned[species.id]
  let finalBranch = null
  if (species.branches) {
    const key = (record && record.branch) || pickPetBranch(species, getVocabProfile())
    finalBranch = species.branches.filter((b) => b.key === key)[0] || species.branches[0]
  }
  return species.stages.map((st, index) => {
    const isFinal = index === species.stages.length - 1
    const branch = isFinal && finalBranch ? finalBranch : null
    return {
      index: index,
      name: branch ? branch.name : st.name,
      color: branch ? branch.color : st.color,
      accent: branch ? branch.accent : st.accent,
      desc: branch ? branch.desc : st.desc,
      min: st.level,
      unlocked: level >= st.level,
      current: index === current,
      isBranch: !!branch,
      branchHint: branch ? branch.hint : ''
    }
  })
}

function syncPetBranch(record, species) {
  if (!species || !species.branches || record.branch) return false
  if (getPetLevel(record.exp, species.id) < 12) return false
  record.branch = pickPetBranch(species, getVocabProfile())
  return true
}

function syncPetUnlocks() {
  const s = getState()
  const rules = [
    { level: 3, id: 'hat' },
    { level: 5, id: 'scarf' },
    { level: 8, id: 'crown' },
    { level: 12, id: 'wings' }
  ]
  Object.keys(s.pets.owned).forEach((id) => {
    const record = s.pets.owned[id]
    if (!record) return
    const lv = getPetLevel(record.exp, id)
    rules.forEach((r) => {
      if (lv >= r.level && record.unlocked.indexOf(r.id) === -1) {
        record.unlocked.push(r.id)
      }
    })
    const species = petsData.getById(id)
    if (species) syncPetBranch(record, species)
  })
}

function setAccessory(id) {
  const record = activePetRecord()
  if (record.unlocked.indexOf(id) === -1) return false
  record.accessory = id
  save()
  return true
}

/** 解锁新伙伴：按累计学习词汇量 */
function unlockPets() {
  const s = getState()
  const newly = []
  petsData.list.forEach((species) => {
    if (s.stats.totalLearned >= species.unlock.learned && !s.pets.owned[species.id]) {
      s.pets.owned[species.id] = createPetRecord()
      newly.push({
        id: species.id,
        name: species.name,
        title: species.title,
        emoji: species.emoji,
        desc: species.desc,
        unlock: species.unlock
      })
    }
  })
  if (newly.length) save()
  return newly
}

/** 切换当前伙伴 */
function switchPet(id) {
  const s = getState()
  const species = getSpecies(id)
  if (!s.pets.owned[id]) {
    const remain = Math.max(0, species.unlock.learned - s.stats.totalLearned)
    return {
      ok: false,
      msg: '再学习 ' + remain + ' 个单词就能解锁 ' + species.name
    }
  }
  if (s.pets.active === id) {
    return { ok: true, msg: species.name + ' 已经在身边啦' }
  }
  s.pets.active = id
  const record = s.pets.owned[id]
  if (!record.lastTick) record.lastTick = Date.now()
  syncPetUnlocks()
  save()
  return { ok: true, msg: '已切换为 ' + species.name }
}

/** 伙伴图鉴 */
function getPetCollection() {
  const s = getState()
  return petsData.list.map((species) => {
    const owned = !!s.pets.owned[species.id]
    const record = s.pets.owned[species.id]
    const level = owned ? getPetLevel(record.exp, species.id) : 1
    const stage = getPetStage(level, species.id)
    const progress =
      species.unlock.learned <= 0
        ? 100
        : Math.min(100, Math.round((s.stats.totalLearned / species.unlock.learned) * 100))
    const remain = Math.max(0, species.unlock.learned - s.stats.totalLearned)
    return {
      id: species.id,
      name: species.name,
      title: species.title,
      emoji: species.emoji,
      tagline: species.tagline,
      unlock: species.unlock,
      needText: owned ? '' : remain > 0 ? '再学 ' + remain + ' 词解锁' : '达到解锁条件',
      owned: owned,
      active: s.pets.active === species.id,
      level: level,
      stageIndex: stage.index,
      stageName: stage.name,
      stageColor: stage.color,
      branchKey: stage.branchKey,
      branchName: stage.branchName,
      progress: progress
    }
  })
}

/** 当前伙伴的两条最终进化分支与词汇结构指标 */
function getPetBranches(speciesId) {
  const species = getSpecies(speciesId)
  if (!species.branches) return []
  const s = getState()
  const record = s.pets.owned[species.id]
  const level = record ? getPetLevel(record.exp, species.id) : 1
  const profile = getVocabProfile()
  const selected = (record && record.branch) || pickPetBranch(species, profile)
  const values = species.branches.map((b) => profile[b.metric] || 0)
  const max = Math.max(1, values[0] || 0, values[1] || 0)
  return species.branches.map((b, index) => ({
    key: b.key,
    name: b.name,
    color: b.color,
    accent: b.accent,
    desc: b.desc,
    hint: b.hint,
    value: values[index],
    percent: Math.round((values[index] / max) * 100),
    selected: b.key === selected,
    active: level >= 12 && b.key === selected,
    locked: level < 12
  }))
}

/** 喂食：消耗小鱼干，恢复饱食度并获得经验 */
function feedPet() {
  const s = getState()
  const record = activePetRecord()
  const species = getSpecies()
  if (s.wallet.fish < 8) {
    return { ok: false, msg: '小鱼干不够啦，去学习赚一点吧！' }
  }
  if (record.hunger >= 98) {
    return { ok: false, msg: species.name + ' 已经吃得圆滚滚啦～' }
  }
  s.wallet.fish -= 8
  record.hunger = clamp(record.hunger + 18, 0, 100)
  record.mood = clamp(record.mood + 6, 0, 100)
  record.lastFedAt = Date.now()
  const before = getPetLevel()
  addExp(15)
  save()
  return {
    ok: true,
    msg: '咔嚓咔嚓～' + species.name + ' 吃得很开心！',
    levelUp: getPetLevel() > before
  }
}

/** 抚摸互动：有 30 秒冷却，避免刷心情 */
function petPet() {
  const record = activePetRecord()
  const now = Date.now()
  if (now - (record.lastPlayAt || 0) < 30 * 1000) {
    return { ok: false, msg: '它还在回味刚才的摸摸呢～' }
  }
  record.lastPlayAt = now
  record.mood = clamp(record.mood + 10, 0, 100)
  addExp(5)
  save()
  return { ok: true, msg: '它眯起眼睛，蹭了蹭你的手心。' }
}

/* ============================================================
 * 知识花园
 * ============================================================ */
function plantWord(word) {
  const s = getState()
  if (!word || !word.id) return false
  const exists = s.garden.plots.some((p) => p.wordId === word.id)
  if (exists) return false
  if (s.garden.plots.length >= 36) return false
  s.garden.plots.push({
    id: 'plot_' + word.id,
    wordId: word.id,
    word: word.word,
    cn: word.cn,
    color: FLOWER_COLORS[hash(word.id) % FLOWER_COLORS.length],
    plantedAt: Date.now(),
    stage: 3
  })
  const count = s.garden.plots.length
  const decorRules = [
    { need: 3, id: 'butterfly' },
    { need: 6, id: 'fence' },
    { need: 12, id: 'lantern' },
    { need: 20, id: 'fountain' },
    { need: 30, id: 'rainbow' }
  ]
  decorRules.forEach((r) => {
    if (count >= r.need && s.garden.decor.indexOf(r.id) === -1) {
      s.garden.decor.push(r.id)
    }
  })
  save()
  return true
}

function getGardenView() {
  const s = getState()
  const plots = s.garden.plots.slice()
  const colors = {}
  plots.forEach((p) => {
    colors[p.color] = (colors[p.color] || 0) + 1
  })
  return {
    plots: plots,
    count: plots.length,
    decor: s.garden.decor,
    theme: s.garden.theme,
    colors: colors,
    nextDecor: getNextDecor(plots.length)
  }
}

function getNextDecor(count) {
  const rules = [
    { need: 3, id: 'butterfly', name: '小蝴蝶' },
    { need: 6, id: 'fence', name: '木栅栏' },
    { need: 12, id: 'lantern', name: '暖光灯' },
    { need: 20, id: 'fountain', name: '许愿喷泉' },
    { need: 30, id: 'rainbow', name: '彩虹拱门' }
  ]
  for (let i = 0; i < rules.length; i++) {
    if (count < rules[i].need) return rules[i]
  }
  return null
}

/* ============================================================
 * 错题病历本
 * ============================================================ */
const REASONS = ['形近混淆', '音近听错', '遗忘', '语境误解']

function addWrong(wordId, reason, detail) {
  const s = getState()
  if (!wordId) return
  const r = reason && REASONS.indexOf(reason) >= 0 ? reason : '遗忘'
  const exist = s.wrongbook.filter((w) => w.wordId === wordId && !w.resolved)[0]
  if (exist) {
    exist.count += 1
    exist.at = Date.now()
    exist.reason = r
  } else {
    s.wrongbook.unshift({
      id: 'w_' + wordId + '_' + Date.now(),
      wordId: wordId,
      word: detail && detail.word ? detail.word : '',
      cn: detail && detail.cn ? detail.cn : '',
      reason: r,
      detail: detail || null,
      count: 1,
      at: Date.now(),
      resolved: false
    })
  }
  if (s.wrongbook.length > 300) s.wrongbook.length = 300
  save()
}

function resolveWrong(wordId) {
  const s = getState()
  s.wrongbook.forEach((w) => {
    if (w.wordId === wordId) w.resolved = true
  })
  save()
}

function getWrongList() {
  const s = getState()
  const list = s.wrongbook.slice()
  list.sort((a, b) => {
    if (a.resolved !== b.resolved) return a.resolved ? 1 : -1
    return b.at - a.at
  })
  return list
}

function getWrongStats() {
  const list = getWrongList().filter((w) => !w.resolved)
  const map = {}
  REASONS.forEach((r) => {
    map[r] = 0
  })
  list.forEach((w) => {
    map[w.reason] = (map[w.reason] || 0) + 1
  })
  return { total: list.length, byReason: map }
}

/* ============================================================
 * 每日任务
 * ============================================================ */
function getTasks() {
  const s = getState()
  const day = getToday()
  return TASK_POOL.map((t) => {
    const current = Math.min(day[t.metric] || 0, t.target)
    return {
      id: t.id,
      emoji: t.emoji,
      title: t.title.replace('{n}', t.target),
      target: t.target,
      current: Math.round(current),
      reward: t.reward,
      percent: Math.min(100, Math.round((current / t.target) * 100)),
      done: current >= t.target,
      claimed: s.tasks.claimed.indexOf(t.id) >= 0
    }
  })
}

function claimTask(id) {
  const s = getState()
  ensureDaily()
  const task = getTasks().filter((t) => t.id === id)[0]
  if (!task || !task.done || task.claimed) {
    return { ok: false, msg: '任务还没有完成哦' }
  }
  s.tasks.claimed.push(id)
  s.wallet.fish += task.reward
  addExp(10)
  save()
  return { ok: true, msg: '领取成功，获得 ' + task.reward + ' 条小鱼干！' }
}

/* ============================================================
 * 成就系统
 * ============================================================ */
function getMetricValue(metric) {
  const s = getState()
  switch (metric) {
    case 'learned':
      return s.stats.totalLearned
    case 'streak':
      return s.stats.streak
    case 'reviews':
      return s.stats.totalReviews
    case 'correct':
      return s.stats.totalCorrect
    case 'minutes':
      return Math.floor(s.stats.totalMinutes)
    case 'garden':
      return s.garden.plots.length
    case 'petLevel':
      return getPetLevel()
    case 'puzzle':
      return s.puzzle.cleared.length
    case 'chapters':
      return s.chapters.finished.length
    case 'exam':
      return s.exam.history.length
    case 'bestScore':
      return s.exam.history.reduce((m, e) => Math.max(m, e.score || 0), 0)
    case 'fish':
      return s.wallet.fish
    default:
      return 0
  }
}

function getAchievements() {
  const s = getState()
  return achievementsData.map((a) => {
    const cur = getMetricValue(a.metric)
    const unlocked = !!s.achievements.unlocked[a.id]
    return {
      id: a.id,
      name: a.name,
      emoji: a.emoji,
      desc: a.desc,
      metric: a.metric,
      target: a.target,
      current: Math.min(cur, a.target),
      percent: Math.min(100, Math.round((cur / a.target) * 100)),
      unlocked: unlocked,
      unlockedAt: s.achievements.unlocked[a.id] || 0
    }
  })
}

function checkAchievements() {
  const s = getState()
  const newly = []
  syncChapters()
  achievementsData.forEach((a) => {
    if (s.achievements.unlocked[a.id]) return
    if (getMetricValue(a.metric) >= a.target) {
      s.achievements.unlocked[a.id] = Date.now()
      s.wallet.fish += 30
      addExp(20)
      newly.push({ id: a.id, name: a.name, emoji: a.emoji, desc: a.desc })
    }
  })
  return newly
}

/* ============================================================
 * 剧情章节
 * ============================================================ */
function syncChapters() {
  const s = getState()
  const learned = s.stats.totalLearned
  let changed = false
  chaptersData.forEach((c) => {
    if (learned >= c.need && s.chapters.unlocked.indexOf(c.id) === -1) {
      s.chapters.unlocked.push(c.id)
      changed = true
    }
  })
  if (changed) save()
  return s.chapters.unlocked
}

function getChapters() {
  const s = getState()
  return chaptersData.map((c, index) => {
    const unlocked = s.chapters.unlocked.indexOf(c.id) >= 0
    const finished = s.chapters.finished.indexOf(c.id) >= 0
    return {
      id: c.id,
      num: index + 1,
      title: c.title,
      emoji: c.emoji,
      need: c.need,
      desc: c.desc,
      scene: c.scene,
      story: c.story,
      reward: c.reward,
      unlocked: unlocked,
      finished: finished,
      progress: c.need <= 0 ? 100 : Math.min(100, Math.round((s.stats.totalLearned / c.need) * 100))
    }
  })
}

function finishChapter(id) {
  const s = getState()
  if (s.chapters.finished.indexOf(id) === -1) {
    s.chapters.finished.push(id)
    logActivity({ exp: 30, fish: 25, minutes: 5 })
    save()
  }
  return true
}

/* ============================================================
 * 测验 / 考试 / 其它模块
 * ============================================================ */
function saveExamResult(result) {
  const s = getState()
  const item = Object.assign(
    {
      at: Date.now(),
      date: todayKey()
    },
    result
  )
  s.exam.history.unshift(item)
  if (s.exam.history.length > 30) s.exam.history.length = 30
  logActivity({
    correct: result.correct || 0,
    wrong: result.wrong || 0,
    minutes: result.minutes || 0,
    quizzes: result.total || 0,
    exp: 20,
    fish: 10
  })
  save()
  return item
}

function markFinished(kind, id) {
  const s = getState()
  if (!s[kind] || !s[kind].finished) return
  if (s[kind].finished.indexOf(id) === -1) {
    s[kind].finished.push(id)
    s.wallet.fish += 12
    addExp(18)
    save()
  }
}

function saveListeningScore(id, score) {
  const s = getState()
  const best = s.listenings.best[id] || 0
  s.listenings.best[id] = Math.max(best, score)
  save()
}

function savePuzzleResult(score, cleared) {
  const s = getState()
  s.puzzle.playCount += 1
  s.puzzle.best = Math.max(s.puzzle.best, score)
  if (cleared && s.puzzle.cleared.indexOf(cleared) === -1) {
    s.puzzle.cleared.push(cleared)
  }
  save()
}

function saveWriting(score) {
  const s = getState()
  s.writing.count += 1
  s.writing.best = Math.max(s.writing.best, score)
  save()
}

/* ============================================================
 * 统计视图
 * ============================================================ */
function getStatsView() {
  const s = getState()
  const days = []
  for (let i = 6; i >= 0; i--) {
    const key = dayKey(Date.now() - i * DAY)
    const d = s.stats.days[key] || emptyDay()
    const date = new Date(Date.now() - i * DAY)
    days.push({
      key: key,
      label: ['日', '一', '二', '三', '四', '五', '六'][date.getDay()],
      newWords: d.newWords,
      reviews: d.reviews,
      minutes: d.minutes,
      total: d.newWords + d.reviews
    })
  }
  const max = Math.max(10, days.reduce((m, d) => Math.max(m, d.total), 0))
  days.forEach((d) => {
    d.percent = Math.round((d.total / max) * 100)
  })

  const total = s.stats.totalCorrect + s.stats.totalWrong
  const accuracy = total > 0 ? Math.round((s.stats.totalCorrect / total) * 100) : 0

  const levels = [0, 0, 0, 0, 0, 0, 0]
  Object.keys(s.records).forEach((id) => {
    const lv = s.records[id].level
    levels[Math.min(lv, 6)] += 1
  })

  return {
    days: days,
    accuracy: accuracy,
    totalLearned: s.stats.totalLearned,
    streak: s.stats.streak,
    maxStreak: s.stats.maxStreak,
    minutes: Math.round(s.stats.totalMinutes),
    totalReviews: s.stats.totalReviews,
    levels: levels,
    mastered: s.records ? Object.keys(s.records).filter((id) => s.records[id].level >= 4).length : 0,
    fish: s.wallet.fish
  }
}

/** 最近 N 天打卡热力图 */
function getHeatmap(weeks) {
  const s = getState()
  const w = weeks || 8
  const cells = []
  const today = new Date()
  const offset = (today.getDay() + 6) % 7 // 周一为第一天
  const start = new Date(today.getTime() - (w * 7 - 1 - (6 - offset)) * DAY)
  start.setHours(0, 0, 0, 0)
  for (let i = 0; i < w * 7; i++) {
    const d = new Date(start.getTime() + i * DAY)
    const key = dayKey(d.getTime())
    const day = s.stats.days[key]
    const count = day ? day.newWords + day.reviews : 0
    cells.push({
      key: key,
      day: d.getDate(),
      count: count,
      level: count === 0 ? 0 : count < 10 ? 1 : count < 25 ? 2 : count < 50 ? 3 : 4
    })
  }
  return cells
}

function getBookProgress(words, bookId) {
  const s = getState()
  let learned = 0
  let mastered = 0
  let due = 0
  const now = Date.now()
  words.forEach((w) => {
    const r = s.records[w.id]
    if (r) {
      learned += 1
      if (r.level >= 4) mastered += 1
      if (r.nextAt <= now) due += 1
    }
  })
  return {
    total: words.length,
    learned: learned,
    mastered: mastered,
    due: due,
    percent: words.length ? Math.round((learned / words.length) * 100) : 0
  }
}

/** 取得到期复习词（按到期时间升序） */
function getDueWords(words, limit) {
  const now = Date.now()
  return words
    .filter((w) => {
      const r = getState().records[w.id]
      return r && r.nextAt <= now
    })
    .sort((a, b) => getState().records[a.id].nextAt - getState().records[b.id].nextAt)
    .slice(0, limit || 40)
}

/** 取得未学新词：用 ID 哈希做稳定打散，避免每天都从 a 开头 */
function getNewWords(words, limit) {
  const pool = words.filter((w) => !getState().records[w.id])
  pool.sort((a, b) => hash(a.id) - hash(b.id))
  return pool.slice(0, limit || 20)
}

module.exports = {
  STORAGE_KEY: STORAGE_KEY,
  DAY: DAY,
  SRS_DAYS: SRS_DAYS,
  REASONS: REASONS,
  init: init,
  getState: getState,
  save: save,
  resetAll: resetAll,
  clone: clone,
  dayKey: dayKey,
  todayKey: todayKey,
  touchOpen: touchOpen,
  ensureDaily: ensureDaily,
  getToday: getToday,
  getRecord: getRecord,
  isMastered: isMastered,
  isDue: isDue,
  submitWord: submitWord,
  logActivity: logActivity,
  addMinutes: addMinutes,
  addExp: addExp,
  vibrate: vibrate,
  getPetLevel: getPetLevel,
  getPetStage: getPetStage,
  getPetView: getPetView,
  getStages: getStages,
  getPetCollection: getPetCollection,
  getPetBranches: getPetBranches,
  getVocabProfile: getVocabProfile,
  switchPet: switchPet,
  unlockPets: unlockPets,
  feedPet: feedPet,
  petPet: petPet,
  setAccessory: setAccessory,
  plantWord: plantWord,
  getGardenView: getGardenView,
  addWrong: addWrong,
  resolveWrong: resolveWrong,
  getWrongList: getWrongList,
  getWrongStats: getWrongStats,
  getTasks: getTasks,
  claimTask: claimTask,
  getAchievements: getAchievements,
  checkAchievements: checkAchievements,
  getMetricValue: getMetricValue,
  syncChapters: syncChapters,
  getChapters: getChapters,
  finishChapter: finishChapter,
  saveExamResult: saveExamResult,
  markFinished: markFinished,
  saveListeningScore: saveListeningScore,
  savePuzzleResult: savePuzzleResult,
  saveWriting: saveWriting,
  getStatsView: getStatsView,
  getHeatmap: getHeatmap,
  getBookProgress: getBookProgress,
  getDueWords: getDueWords,
  getNewWords: getNewWords
}
