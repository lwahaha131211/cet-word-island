/**
 * 词灵岛 · 原创伙伴图鉴
 * 5 个物种，每个物种 5 段进化 + 2 条最终分支，学习累计词汇量解锁。
 * stage.level 为进入该形态所需的伙伴等级（每 100 点成长值升 1 级）。
 */
const PETS = [
  {
    id: 'sprout',
    name: '芽芽',
    title: '词灵·芽芽',
    emoji: '🌱',
    tagline: '从单词里发芽的小灵体',
    desc: '在词海的礁石缝里醒来，靠记住的单词长出新叶。它相信每一个词都会在某天开花。',
    lines: [
      '今天也让叶子多长一片吧。',
      '你念单词的时候，我的叶子会发亮。',
      '把不会的词交给我，我把它埋进土里。'
    ],
    unlock: { learned: 0, text: '初始伙伴' },
    color: '#FFD166',
    accent: '#6FD39B',
    stages: [
      { level: 1, name: '初芽', color: '#FFD166', accent: '#6FD39B', desc: '刚冒头，只有两片软软的子叶。' },
      { level: 3, name: '叶童', color: '#FFD166', accent: '#7BDCB5', desc: '学会跟着你念单词，叶子会轻轻摇。' },
      { level: 5, name: '风芽', color: '#A8E6CF', accent: '#2EC4B6', desc: '能乘着风在岛上来回跑。' },
      { level: 8, name: '星叶', color: '#C3A6FF', accent: '#9B7EDE', desc: '叶片上开始出现细小的星纹。' },
      { level: 12, name: '词灵王', color: '#FFB1C8', accent: '#FF86AE', desc: '整座词灵岛的叶子都会为它亮起。' }
    ],
    branches: [
      {
        key: 'a', name: '星叶王', color: '#7BDCB5', accent: '#FFD166',
        desc: '词根在你手里长成星脉，叶片能照亮整片词海。',
        metric: 'root', hint: '词根掌握更多'
      },
      {
        key: 'b', name: '词灵王', color: '#FFB1C8', accent: '#FF86AE',
        desc: '后缀与词义连成花冠，整座岛的叶子为它亮起。',
        metric: 'suffix', hint: '后缀掌握更多'
      }
    ]
  },
  {
    id: 'ink',
    name: '乌乌',
    title: '墨团·乌乌',
    emoji: '🖋️',
    tagline: '把遗忘写成墨点的小猫',
    desc: '从一本旧词典的墨迹里凝成，喜欢把错词舔成墨点再吞掉。它说，忘记不是消失，只是换了一种颜色。',
    lines: [
      '错词别扔，给我蘸墨吃。',
      '我尾巴尖上那滴墨，是你昨天忘掉的词。',
      '安静一点，我在听你拼写。'
    ],
    unlock: { learned: 20, text: '累计学习 20 词解锁' },
    color: '#4B5563',
    accent: '#A78BFA',
    stages: [
      { level: 1, name: '墨滴', color: '#6B7280', accent: '#A78BFA', desc: '一小团会呼吸的墨。' },
      { level: 3, name: '墨团', color: '#4B5563', accent: '#A78BFA', desc: '长出猫耳，开始追着错词跑。' },
      { level: 5, name: '墨耳', color: '#374151', accent: '#8B5CF6', desc: '能听见你心里没读出来的音。' },
      { level: 8, name: '墨影', color: '#312E81', accent: '#A78BFA', desc: '走过的地方会留下会发光的字。' },
      { level: 12, name: '墨龙', color: '#111827', accent: '#C4B5FD', desc: '尾巴扫过，整页错题重新排成诗。' }
    ],
    branches: [
      {
        key: 'a', name: '墨影', color: '#1E1B4B', accent: '#A78BFA',
        desc: '前缀在你身边凝成暗影，走过的路会浮出词根。',
        metric: 'prefix', hint: '前缀掌握更多'
      },
      {
        key: 'b', name: '墨龙', color: '#111827', accent: '#C4B5FD',
        desc: '后缀拉成长尾，一扫就能把错题排成诗。',
        metric: 'suffix', hint: '后缀掌握更多'
      }
    ]
  },
  {
    id: 'whale',
    name: '泡泡',
    title: '云鲸·泡泡',
    emoji: '🐋',
    tagline: '把单词装进云朵的鲸',
    desc: '在岛的上空游动，喷出的水雾会变成小小的单词云。它见过很多半途而废的人，所以总说：慢一点也没关系。',
    lines: [
      '今天想背几个词？我驮你上去。',
      '云里藏着你上周复习过的词。',
      '别急，慢慢来，海很大。'
    ],
    unlock: { learned: 60, text: '累计学习 60 词解锁' },
    color: '#7FB8FF',
    accent: '#4EA8DE',
    stages: [
      { level: 1, name: '泡泡', color: '#A5D8FF', accent: '#4EA8DE', desc: '一团会吐泡泡的云。' },
      { level: 3, name: '云鲸', color: '#7FB8FF', accent: '#4EA8DE', desc: '长出小鳍，能在云层里打滚。' },
      { level: 5, name: '星鲸', color: '#9B7EDE', accent: '#C3A6FF', desc: '背鳍上挂着几颗小星星。' },
      { level: 8, name: '天鲸', color: '#C3A6FF', accent: '#9B7EDE', desc: '游过夜空时，会留下一道浅浅的词河。' },
      { level: 12, name: '穹鲸', color: '#E0D4FF', accent: '#FFD166', desc: '它的歌声能让整座岛的单词一起发光。' }
    ],
    branches: [
      {
        key: 'a', name: '星潮鲸', color: '#6D8BFF', accent: '#FFD166',
        desc: '动词与形容词变成潮汐，它驮着整片词海起落。',
        metric: 'verbAdj', hint: '动词/形容词掌握更多'
      },
      {
        key: 'b', name: '穹鲸', color: '#E0D4FF', accent: '#FFD166',
        desc: '名词在它体内结成星群，歌声让全岛单词发亮。',
        metric: 'noun', hint: '名词掌握更多'
      }
    ]
  },
  {
    id: 'turtle',
    name: '咔哒',
    title: '齿轮龟·咔哒',
    emoji: '🐢',
    tagline: '把记忆拧进齿轮的机械龟',
    desc: '壳里有一枚旧齿轮，每复习一次就转一格。它从不漏掉任何一次复习，也不嘲笑任何一个记得慢的人。',
    lines: [
      '咔哒。该复习了。',
      '慢没关系，我记得住。',
      '我的壳里有很多小格子，专门放你差点忘掉的词。'
    ],
    unlock: { learned: 120, text: '累计学习 120 词解锁' },
    color: '#84A98C',
    accent: '#FFD166',
    stages: [
      { level: 1, name: '齿轮蛋', color: '#A3B18A', accent: '#FFD166', desc: '壳还没长硬，齿轮先转了起来。' },
      { level: 3, name: '咔哒龟', color: '#84A98C', accent: '#FFD166', desc: '每走一步，壳里就咔哒一声。' },
      { level: 5, name: '机械龟', color: '#6B9080', accent: '#FFB86B', desc: '齿轮外露，开始自动整理错题。' },
      { level: 8, name: '时光龟', color: '#52796F', accent: '#FFD166', desc: '壳上的刻度能显示你哪天忘了复习。' },
      { level: 12, name: '星轨龟', color: '#355070', accent: '#FFD166', desc: '沿着星轨爬行，把遗忘的间隔一一校准。' }
    ],
    branches: [
      {
        key: 'a', name: '星轨龟', color: '#355070', accent: '#FFD166',
        desc: '词根在壳上连成星轨，每一步都能校准遗忘的间隔。',
        metric: 'root', hint: '词根掌握更多'
      },
      {
        key: 'b', name: '时轮龟', color: '#52796F', accent: '#FFB86B',
        desc: '长词在齿轮里变成刻度，慢一点也能走到最远处。',
        metric: 'long', hint: '长词掌握更多'
      }
    ]
  },
  {
    id: 'fox',
    name: '阿燎',
    title: '焰狐·阿燎',
    emoji: '🦊',
    tagline: '尾巴点着学习火苗的小狐狸',
    desc: '在篝火边捡到你丢掉的决心，尾巴上的火苗会随连续打卡变旺。它最怕的不是冷，是你说明天再学。',
    lines: [
      '火苗还亮着，别停。',
      '今天的连续打卡，我替你守着。',
      '尾巴借你烤烤手，继续背。'
    ],
    unlock: { learned: 200, text: '累计学习 200 词解锁' },
    color: '#FF9F1C',
    accent: '#FF5C5C',
    stages: [
      { level: 1, name: '火星', color: '#FFB86B', accent: '#F07A16', desc: '一小簇不肯灭的火星。' },
      { level: 3, name: '焰尾', color: '#FF9F1C', accent: '#F07A16', desc: '长出一条会摇的火焰尾。' },
      { level: 5, name: '赤狐', color: '#F07A16', accent: '#FF5C5C', desc: '火苗变成赤色，跑起来像一道光。' },
      { level: 8, name: '九尾', color: '#FF6B4A', accent: '#FFD166', desc: '尾巴分出三条，火光照亮整片山谷。' },
      { level: 12, name: '天焰狐', color: '#FF4D2E', accent: '#FFD166', desc: '九尾齐开，能把整本词书烧成灰烬里的星。' }
    ],
    branches: [
      {
        key: 'a', name: '天焰狐', color: '#FF4D2E', accent: '#FFD166',
        desc: '形容词与副词变成金色火焰，九尾齐开照亮整座岛。',
        metric: 'adj', hint: '形容词掌握更多'
      },
      {
        key: 'b', name: '赤焰狐', color: '#B91C1C', accent: '#FFB86B',
        desc: '名词沉进赤色火心，它能一口报出整本书的名字。',
        metric: 'noun', hint: '名词掌握更多'
      }
    ]
  }
]

const byId = {}
PETS.forEach((p) => {
  byId[p.id] = p
})

function getById(id) {
  return byId[id] || PETS[0]
}

module.exports = {
  list: PETS,
  getById: getById
}
