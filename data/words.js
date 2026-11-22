/**
 * 词灵岛 · 四六级词库
 * 精选 75 词包含音标、词性、中文释义、例句、词根拆解与记忆提示；
 * 全量词库由 cet4-full.js / cet6-full.js 提供，合并后共 3924 个唯一词条。
 */
const cet4 = [
  {
    id: 'c4-001', word: 'abandon', phonetic: '/əˈbændən/', pos: 'v.', cn: '放弃；抛弃；遗弃',
    en: 'They had to abandon the plan because of the storm.',
    cnSent: '由于暴风雨，他们不得不放弃这个计划。',
    roots: [{ t: 'a-', m: '去，离开' }, { t: 'band', m: '束缚' }, { t: '-on', m: '动词后缀' }],
    tip: 'a + band（乐队）+ on：乐队解散了，只好「放弃」演出。', tag: '高频'
  },
  {
    id: 'c4-002', word: 'absorb', phonetic: '/əbˈzɔːb/', pos: 'v.', cn: '吸收；理解；使全神贯注',
    en: 'Plants absorb water through their roots.',
    cnSent: '植物通过根部吸收水分。',
    roots: [{ t: 'ab-', m: '离开' }, { t: 'sorb', m: '吸入' }],
    tip: 'ab + sorb（吸）：把水「吸走」，就是吸收。', tag: '高频'
  },
  {
    id: 'c4-003', word: 'abstract', phonetic: '/ˈæbstrækt/', pos: 'n./adj.', cn: '摘要；抽象的',
    en: 'The abstract of the paper is only two hundred words.',
    cnSent: '这篇论文的摘要只有两百字。',
    roots: [{ t: 'abs-', m: '离开' }, { t: 'tract', m: '拉' }],
    tip: '从正文里「拉」出来的部分，就是摘要。', tag: '核心'
  },
  {
    id: 'c4-004', word: 'academic', phonetic: '/ˌækəˈdemɪk/', pos: 'adj.', cn: '学术的；学业的',
    en: 'Her academic performance improved a lot this term.',
    cnSent: '她这学期的学业表现进步很大。',
    roots: [{ t: 'academ', m: '学院' }, { t: '-ic', m: '形容词后缀' }],
    tip: '学院（academy）里的 → 学术的。', tag: '核心'
  },
  {
    id: 'c4-005', word: 'access', phonetic: '/ˈækses/', pos: 'n./v.', cn: '通道；使用权；访问',
    en: 'Students can access the online library for free.',
    cnSent: '学生可以免费访问在线图书馆。',
    roots: [{ t: 'ac-', m: '朝向' }, { t: 'cess', m: '走' }],
    tip: 'ac + cess（走）：走过去，就能「进入」。', tag: '高频'
  },
  {
    id: 'c4-006', word: 'accompany', phonetic: '/əˈkʌmpəni/', pos: 'v.', cn: '陪伴；伴随；为…伴奏',
    en: 'I will accompany you to the bookstore.',
    cnSent: '我会陪你去书店。',
    roots: [{ t: 'ac-', m: '朝向' }, { t: 'company', m: '同伴' }],
    tip: '去做别人的 company（同伴）→ 陪伴。', tag: '核心'
  },
  {
    id: 'c4-007', word: 'accomplish', phonetic: '/əˈkʌmplɪʃ/', pos: 'v.', cn: '完成；实现',
    en: 'She accomplished the task ahead of time.',
    cnSent: '她提前完成了任务。',
    roots: [{ t: 'ac-', m: '朝向' }, { t: 'compl', m: '填满' }, { t: '-ish', m: '动词后缀' }],
    tip: '把事情「填满」→ 完成。', tag: '核心'
  },
  {
    id: 'c4-008', word: 'accurate', phonetic: '/ˈækjərət/', pos: 'adj.', cn: '准确的；精确的',
    en: 'Please give me an accurate answer.',
    cnSent: '请给我一个准确的答案。',
    roots: [{ t: 'ac-', m: '朝向' }, { t: 'cur', m: '关心' }, { t: '-ate', m: '形容词后缀' }],
    tip: '仔细「关心」每个细节 → 准确。', tag: '高频'
  },
  {
    id: 'c4-009', word: 'adapt', phonetic: '/əˈdæpt/', pos: 'v.', cn: '适应；改编',
    en: 'It takes time to adapt to a new environment.',
    cnSent: '适应新环境需要时间。',
    roots: [{ t: 'ad-', m: '去' }, { t: 'apt', m: '适合' }],
    tip: '使得「适合」新环境 → 适应。', tag: '高频'
  },
  {
    id: 'c4-010', word: 'adequate', phonetic: '/ˈædɪkwət/', pos: 'adj.', cn: '足够的；适当的',
    en: 'The room is adequate for two people.',
    cnSent: '这个房间住两个人足够了。',
    roots: [{ t: 'ad-', m: '去' }, { t: 'equ', m: '相等' }, { t: '-ate', m: '形容词后缀' }],
    tip: '数量「相等」→ 刚好够用。', tag: '核心'
  },
  {
    id: 'c4-011', word: 'adjust', phonetic: '/əˈdʒʌst/', pos: 'v.', cn: '调整；适应',
    en: 'You can adjust the seat to a comfortable position.',
    cnSent: '你可以把座椅调到舒服的位置。',
    roots: [{ t: 'ad-', m: '去' }, { t: 'just', m: '正好' }],
    tip: '调到「正好」的位置 → 调整。', tag: '高频'
  },
  {
    id: 'c4-012', word: 'admire', phonetic: '/ədˈmaɪə(r)/', pos: 'v.', cn: '钦佩；欣赏',
    en: 'I admire her courage to speak in public.',
    cnSent: '我钦佩她当众发言的勇气。',
    roots: [{ t: 'ad-', m: '朝向' }, { t: 'mir', m: '惊奇' }, { t: '-e', m: '动词词尾' }],
    tip: '看到就「惊叹」→ 钦佩。', tag: '核心'
  },
  {
    id: 'c4-013', word: 'adopt', phonetic: '/əˈdɒpt/', pos: 'v.', cn: '采用；收养',
    en: 'The company decided to adopt a new policy.',
    cnSent: '公司决定采用一项新政策。',
    roots: [{ t: 'ad-', m: '去' }, { t: 'opt', m: '选择' }],
    tip: '「选中」了就用 → 采用。', tag: '高频'
  },
  {
    id: 'c4-014', word: 'advance', phonetic: '/ədˈvɑːns/', pos: 'v./n.', cn: '前进；进步；预先的',
    en: 'Technology continues to advance at a fast pace.',
    cnSent: '科技继续快速发展。',
    roots: [{ t: 'ad-', m: '朝向' }, { t: 'vanc', m: '前' }, { t: '-e', m: '词尾' }],
    tip: '一直向前走 → 前进。', tag: '高频'
  },
  {
    id: 'c4-015', word: 'affect', phonetic: '/əˈfekt/', pos: 'v.', cn: '影响；感动',
    en: 'Lack of sleep can affect your memory.',
    cnSent: '睡眠不足会影响你的记忆力。',
    roots: [{ t: 'af-', m: '朝向' }, { t: 'fect', m: '做' }],
    tip: '对别人「做」点什么 → 影响。注意与 effect（名词）区分。', tag: '易混'
  },
  {
    id: 'c4-016', word: 'afford', phonetic: '/əˈfɔːd/', pos: 'v.', cn: '买得起；负担得起',
    en: 'We cannot afford a new car this year.',
    cnSent: '今年我们买不起新车。',
    roots: [{ t: 'af-', m: '朝向' }, { t: 'ford', m: '拿出' }],
    tip: '拿得出钱 → 负担得起。', tag: '高频'
  },
  {
    id: 'c4-017', word: 'agriculture', phonetic: '/ˈæɡrɪkʌltʃə(r)/', pos: 'n.', cn: '农业；农学',
    en: 'Agriculture is still important in this region.',
    cnSent: '农业在这个地区仍然很重要。',
    roots: [{ t: 'agri', m: '田地' }, { t: 'cult', m: '耕种' }, { t: '-ure', m: '名词后缀' }],
    tip: '耕种田地 → 农业。', tag: '核心'
  },
  {
    id: 'c4-018', word: 'alter', phonetic: '/ˈɔːltə(r)/', pos: 'v.', cn: '改变；修改',
    en: 'Nothing can alter the fact that he lied.',
    cnSent: '什么也无法改变他撒谎的事实。',
    roots: [{ t: 'alter', m: '其他的' }],
    tip: '变成「其他」的样子 → 改变。', tag: '核心'
  },
  {
    id: 'c4-019', word: 'ambitious', phonetic: '/æmˈbɪʃəs/', pos: 'adj.', cn: '有抱负的；有野心的',
    en: 'She is ambitious and works late every day.',
    cnSent: '她很有抱负，每天都工作到很晚。',
    roots: [{ t: 'ambi-', m: '周围' }, { t: 'it', m: '走' }, { t: '-ious', m: '形容词后缀' }],
    tip: '为了目标到处奔走 → 有抱负的。', tag: '核心'
  },
  {
    id: 'c4-020', word: 'analyze', phonetic: '/ˈænəlaɪz/', pos: 'v.', cn: '分析；解析',
    en: 'We need to analyze the data before making a decision.',
    cnSent: '做决定前我们需要分析数据。',
    roots: [{ t: 'ana-', m: '分开' }, { t: 'lyz', m: '松开' }, { t: '-e', m: '词尾' }],
    tip: '把整体「拆开」来看 → 分析。', tag: '高频'
  },
  {
    id: 'c4-021', word: 'ancient', phonetic: '/ˈeɪnʃənt/', pos: 'adj.', cn: '古代的；古老的',
    en: 'The museum displays ancient Chinese pottery.',
    cnSent: '博物馆展出中国古代陶器。',
    roots: [{ t: 'anci', m: '以前' }, { t: '-ent', m: '形容词后缀' }],
    tip: '以前的 → 古代的。', tag: '核心'
  },
  {
    id: 'c4-022', word: 'annual', phonetic: '/ˈænjuəl/', pos: 'adj.', cn: '每年的；年度的',
    en: 'The annual meeting will be held in May.',
    cnSent: '年会将在五月举行。',
    roots: [{ t: 'ann', m: '年' }, { t: '-ual', m: '形容词后缀' }],
    tip: 'ann（年）→ 每年的。', tag: '核心'
  },
  {
    id: 'c4-023', word: 'anticipate', phonetic: '/ænˈtɪsɪpeɪt/', pos: 'v.', cn: '预料；期望',
    en: 'We anticipate a rise in prices next month.',
    cnSent: '我们预计下个月物价会上涨。',
    roots: [{ t: 'anti-', m: '前' }, { t: 'cip', m: '拿' }, { t: '-ate', m: '动词后缀' }],
    tip: '提前「拿到」消息 → 预料。', tag: '核心'
  },
  {
    id: 'c4-024', word: 'anxiety', phonetic: '/æŋˈzaɪəti/', pos: 'n.', cn: '焦虑；担心',
    en: 'Exam anxiety keeps many students awake.',
    cnSent: '考试焦虑让许多学生睡不着。',
    roots: [{ t: 'anx', m: '焦虑' }, { t: '-iety', m: '名词后缀' }],
    tip: '心里发紧的感觉 → 焦虑。', tag: '高频'
  },
  {
    id: 'c4-025', word: 'apparent', phonetic: '/əˈpærənt/', pos: 'adj.', cn: '明显的；表面上的',
    en: 'It was apparent that she was very tired.',
    cnSent: '很明显她非常疲惫。',
    roots: [{ t: 'ap-', m: '朝向' }, { t: 'par', m: '出现' }, { t: '-ent', m: '形容词后缀' }],
    tip: '出现在眼前 → 明显的。', tag: '核心'
  },
  {
    id: 'c4-026', word: 'appeal', phonetic: '/əˈpiːl/', pos: 'v./n.', cn: '吸引；呼吁；上诉',
    en: 'The cartoon appeals to children of all ages.',
    cnSent: '这部动画片吸引各个年龄段的孩子。',
    roots: [{ t: 'ap-', m: '朝向' }, { t: 'peal', m: '驱动' }],
    tip: '把人心「驱动」过去 → 吸引。', tag: '高频'
  },
  {
    id: 'c4-027', word: 'appreciate', phonetic: '/əˈpriːʃieɪt/', pos: 'v.', cn: '感激；欣赏；升值',
    en: 'I really appreciate your help.',
    cnSent: '我非常感激你的帮助。',
    roots: [{ t: 'ap-', m: '朝向' }, { t: 'preci', m: '价格' }, { t: '-ate', m: '动词后缀' }],
    tip: '给出很高的「价格」→ 欣赏、感激。', tag: '高频'
  },
  {
    id: 'c4-028', word: 'approach', phonetic: '/əˈprəʊtʃ/', pos: 'n./v.', cn: '方法；接近',
    en: 'A new approach to learning English is needed.',
    cnSent: '需要一种新的英语学习方法。',
    roots: [{ t: 'ap-', m: '朝向' }, { t: 'proach', m: '靠近' }],
    tip: '不断靠近目标的方式 → 方法。', tag: '高频'
  },
  {
    id: 'c4-029', word: 'appropriate', phonetic: '/əˈprəʊpriət/', pos: 'adj.', cn: '合适的；恰当的',
    en: 'Wear appropriate clothes for the interview.',
    cnSent: '面试要穿合适的衣服。',
    roots: [{ t: 'ap-', m: '朝向' }, { t: 'propri', m: '自己的' }, { t: '-ate', m: '形容词后缀' }],
    tip: '属于自己的场合 → 合适的。', tag: '高频'
  },
  {
    id: 'c4-030', word: 'approve', phonetic: '/əˈpruːv/', pos: 'v.', cn: '批准；赞成',
    en: 'The manager will approve the budget tomorrow.',
    cnSent: '经理明天会批准这份预算。',
    roots: [{ t: 'ap-', m: '朝向' }, { t: 'prove', m: '证明' }],
    tip: '证明可行 → 批准。', tag: '核心'
  },
  {
    id: 'c4-031', word: 'argue', phonetic: '/ˈɑːɡjuː/', pos: 'v.', cn: '争论；主张',
    en: 'They often argue about money.',
    cnSent: '他们经常为钱争吵。',
    roots: [{ t: 'argu', m: '争论' }, { t: '-e', m: '词尾' }],
    tip: 'argue 本身就是「争论」。', tag: '核心'
  },
  {
    id: 'c4-032', word: 'arise', phonetic: '/əˈraɪz/', pos: 'v.', cn: '出现；产生；起身',
    en: 'Problems may arise during the test.',
    cnSent: '测试过程中可能会出现问题。',
    roots: [{ t: 'a-', m: '向上' }, { t: 'rise', m: '升起' }],
    tip: '问题「升起」来 → 出现。', tag: '高频'
  },
  {
    id: 'c4-033', word: 'arrange', phonetic: '/əˈreɪndʒ/', pos: 'v.', cn: '安排；排列',
    en: 'Please arrange the books by size.',
    cnSent: '请按大小排列这些书。',
    roots: [{ t: 'ar-', m: '朝向' }, { t: 'range', m: '排列' }],
    tip: '把东西排成 range（行列）→ 安排。', tag: '核心'
  },
  {
    id: 'c4-034', word: 'artificial', phonetic: '/ˌɑːtɪˈfɪʃl/', pos: 'adj.', cn: '人造的；人工的',
    en: 'Artificial intelligence is changing our lives.',
    cnSent: '人工智能正在改变我们的生活。',
    roots: [{ t: 'arti', m: '技艺' }, { t: 'fic', m: '做' }, { t: '-ial', m: '形容词后缀' }],
    tip: '用技艺「做」出来的 → 人造的。', tag: '高频'
  },
  {
    id: 'c4-035', word: 'assess', phonetic: '/əˈses/', pos: 'v.', cn: '评估；估价',
    en: 'Teachers assess students in many ways.',
    cnSent: '老师用多种方式评估学生。',
    roots: [{ t: 'as-', m: '朝向' }, { t: 'sess', m: '坐' }],
    tip: '坐在旁边「评判」→ 评估。', tag: '核心'
  },
  {
    id: 'c4-036', word: 'assist', phonetic: '/əˈsɪst/', pos: 'v.', cn: '协助；帮助',
    en: 'Volunteers assist the elderly in the community.',
    cnSent: '志愿者帮助社区里的老人。',
    roots: [{ t: 'as-', m: '朝向' }, { t: 'sist', m: '站' }],
    tip: '站在旁边搭把手 → 协助。', tag: '核心'
  },
  {
    id: 'c4-037', word: 'assume', phonetic: '/əˈsjuːm/', pos: 'v.', cn: '假定；承担',
    en: 'Do not assume that everyone agrees with you.',
    cnSent: '不要以为每个人都同意你。',
    roots: [{ t: 'as-', m: '朝向' }, { t: 'sum', m: '拿' }, { t: '-e', m: '词尾' }],
    tip: '先「拿」过来当真的 → 假定。', tag: '高频'
  },
  {
    id: 'c4-038', word: 'attach', phonetic: '/əˈtætʃ/', pos: 'v.', cn: '附上；连接；重视',
    en: 'Please attach your photo to the form.',
    cnSent: '请把照片附在表格上。',
    roots: [{ t: 'at-', m: '朝向' }, { t: 'tach', m: '钉' }],
    tip: '把照片「钉」上去 → 附上。', tag: '核心'
  },
  {
    id: 'c4-039', word: 'attempt', phonetic: '/əˈtempt/', pos: 'n./v.', cn: '尝试；企图',
    en: 'He made an attempt to climb the mountain.',
    cnSent: '他尝试攀登这座山。',
    roots: [{ t: 'at-', m: '朝向' }, { t: 'tempt', m: '尝试' }],
    tip: '向目标试一试 → 尝试。', tag: '核心'
  },
  {
    id: 'c4-040', word: 'attitude', phonetic: '/ˈætɪtjuːd/', pos: 'n.', cn: '态度；看法',
    en: 'A positive attitude makes learning easier.',
    cnSent: '积极的态度让学习更轻松。',
    roots: [{ t: 'atti', m: '姿态' }, { t: '-tude', m: '名词后缀' }],
    tip: '摆出来的姿态 → 态度。', tag: '高频'
  },
  {
    id: 'c4-041', word: 'attract', phonetic: '/əˈtrækt/', pos: 'v.', cn: '吸引；引起',
    en: 'The bright colors attract children.',
    cnSent: '鲜艳的颜色吸引孩子。',
    roots: [{ t: 'at-', m: '朝向' }, { t: 'tract', m: '拉' }],
    tip: '把目光「拉」过来 → 吸引。', tag: '高频'
  },
  {
    id: 'c4-042', word: 'authority', phonetic: '/ɔːˈθɒrəti/', pos: 'n.', cn: '权威；当局；权限',
    en: 'The local authority is responsible for the park.',
    cnSent: '当地政府负责这个公园。',
    roots: [{ t: 'author', m: '创始者' }, { t: '-ity', m: '名词后缀' }],
    tip: '有创始权的人 → 权威。', tag: '核心'
  },
  {
    id: 'c4-043', word: 'available', phonetic: '/əˈveɪləbl/', pos: 'adj.', cn: '可获得的；有空的',
    en: 'The book is available in the school library.',
    cnSent: '这本书在学校图书馆可以借到。',
    roots: [{ t: 'a-', m: '朝向' }, { t: 'vail', m: '价值' }, { t: '-able', m: '可…的' }],
    tip: '能产生价值的 → 可获得的。', tag: '高频'
  },
  {
    id: 'c4-044', word: 'avoid', phonetic: '/əˈvɔɪd/', pos: 'v.', cn: '避免；躲开',
    en: 'Try to avoid using the phone before bed.',
    cnSent: '睡前尽量不要玩手机。',
    roots: [{ t: 'a-', m: '离开' }, { t: 'void', m: '空' }],
    tip: '把空处让开 → 避免。', tag: '高频'
  },
  {
    id: 'c4-045', word: 'aware', phonetic: '/əˈweə(r)/', pos: 'adj.', cn: '意识到的；知道的',
    en: 'Are you aware of the new rules?',
    cnSent: '你知道新规定吗？',
    roots: [{ t: 'a-', m: '朝向' }, { t: 'ware', m: '注意' }],
    tip: '注意到了 → 意识到的。', tag: '高频'
  },
  {
    id: 'c4-046', word: 'balance', phonetic: '/ˈbæləns/', pos: 'n./v.', cn: '平衡；余额',
    en: 'It is hard to balance study and rest.',
    cnSent: '很难平衡学习和休息。',
    roots: [{ t: 'ba', m: '两' }, { t: 'lance', m: '秤盘' }],
    tip: '两个秤盘一样重 → 平衡。', tag: '核心'
  },
  {
    id: 'c4-047', word: 'barrier', phonetic: '/ˈbæriə(r)/', pos: 'n.', cn: '障碍；屏障',
    en: 'Language can be a barrier to communication.',
    cnSent: '语言可能成为沟通的障碍。',
    roots: [{ t: 'barr', m: '栏杆' }, { t: '-ier', m: '名词后缀' }],
    tip: '拦住去路的栏杆 → 障碍。', tag: '核心'
  },
  {
    id: 'c4-048', word: 'benefit', phonetic: '/ˈbenɪfɪt/', pos: 'n./v.', cn: '益处；受益',
    en: 'Daily reading will benefit your writing.',
    cnSent: '每天阅读对写作有益。',
    roots: [{ t: 'bene', m: '好' }, { t: 'fit', m: '做' }],
    tip: '做好事带来的东西 → 益处。', tag: '高频'
  },
  {
    id: 'c4-049', word: 'boost', phonetic: '/buːst/', pos: 'v./n.', cn: '提升；促进',
    en: 'A good breakfast can boost your energy.',
    cnSent: '一顿好早餐能让你精力充沛。',
    roots: [{ t: 'boost', m: '向上推' }],
    tip: '读起来像「补」，补充能量 → 提升。', tag: '高频'
  },
  {
    id: 'c4-050', word: 'brief', phonetic: '/briːf/', pos: 'adj./n.', cn: '简短的；摘要',
    en: 'He gave a brief introduction to the project.',
    cnSent: '他对项目做了简短的介绍。',
    roots: [{ t: 'brev', m: '短' }, { t: '-f', m: '词尾' }],
    tip: 'brev（短）→ 简短的。', tag: '核心'
  }
]

const cet6 = [
  {
    id: 'c6-001', word: 'abolish', phonetic: '/əˈbɒlɪʃ/', pos: 'v.', cn: '废除；取消',
    en: 'The country decided to abolish the old law.',
    cnSent: '这个国家决定废除旧法律。',
    roots: [{ t: 'ab-', m: '去掉' }, { t: 'abol', m: '消灭' }, { t: '-ish', m: '动词后缀' }],
    tip: '彻底「去掉」→ 废除。', tag: '六级'
  },
  {
    id: 'c6-002', word: 'abrupt', phonetic: '/əˈbrʌpt/', pos: 'adj.', cn: '突然的；生硬的',
    en: 'The meeting came to an abrupt end.',
    cnSent: '会议突然结束了。',
    roots: [{ t: 'ab-', m: '离开' }, { t: 'rupt', m: '断裂' }],
    tip: '突然「断」掉 → 突然的。', tag: '六级'
  },
  {
    id: 'c6-003', word: 'absurd', phonetic: '/əbˈsɜːd/', pos: 'adj.', cn: '荒谬的；可笑的',
    en: 'It is absurd to blame the weather for your mistake.',
    cnSent: '把错误归咎于天气是荒谬的。',
    roots: [{ t: 'ab-', m: '偏离' }, { t: 'surd', m: '聋' }],
    tip: '说了也「听不见」→ 荒谬的。', tag: '六级'
  },
  {
    id: 'c6-004', word: 'accelerate', phonetic: '/əkˈseləreɪt/', pos: 'v.', cn: '加速；促进',
    en: 'The car accelerated as it left the city.',
    cnSent: '汽车出城后加速了。',
    roots: [{ t: 'ac-', m: '朝向' }, { t: 'celer', m: '快' }, { t: '-ate', m: '动词后缀' }],
    tip: '使变「快」→ 加速。', tag: '六级'
  },
  {
    id: 'c6-005', word: 'accommodate', phonetic: '/əˈkɒmədeɪt/', pos: 'v.', cn: '容纳；提供住宿；适应',
    en: 'The hotel can accommodate three hundred guests.',
    cnSent: '这家酒店可以容纳三百位客人。',
    roots: [{ t: 'ac-', m: '朝向' }, { t: 'commod', m: '方便' }, { t: '-ate', m: '动词后缀' }],
    tip: '为客人提供「方便」→ 容纳。', tag: '六级'
  },
  {
    id: 'c6-006', word: 'accumulate', phonetic: '/əˈkjuːmjəleɪt/', pos: 'v.', cn: '积累；堆积',
    en: 'Dust accumulated on the old books.',
    cnSent: '旧书上积满了灰尘。',
    roots: [{ t: 'ac-', m: '朝向' }, { t: 'cumul', m: '堆' }, { t: '-ate', m: '动词后缀' }],
    tip: '一点点「堆」起来 → 积累。', tag: '六级'
  },
  {
    id: 'c6-007', word: 'acknowledge', phonetic: '/əkˈnɒlɪdʒ/', pos: 'v.', cn: '承认；致谢',
    en: 'He acknowledged that he had made a mistake.',
    cnSent: '他承认自己犯了错误。',
    roots: [{ t: 'ac-', m: '朝向' }, { t: 'knowledge', m: '知道' }],
    tip: '公开表示「知道」→ 承认。', tag: '六级'
  },
  {
    id: 'c6-008', word: 'advocate', phonetic: '/ˈædvəkeɪt/', pos: 'v./n.', cn: '提倡；拥护者',
    en: 'Many teachers advocate reading aloud every day.',
    cnSent: '许多老师提倡每天大声朗读。',
    roots: [{ t: 'ad-', m: '朝向' }, { t: 'voc', m: '喊' }, { t: '-ate', m: '动词后缀' }],
    tip: '为某事「发声」→ 提倡。', tag: '六级'
  },
  {
    id: 'c6-009', word: 'aesthetic', phonetic: '/iːsˈθetɪk/', pos: 'adj.', cn: '审美的；美学的',
    en: 'The design has both aesthetic and practical value.',
    cnSent: '这个设计既有审美价值又实用。',
    roots: [{ t: 'aesthet', m: '感觉' }, { t: '-ic', m: '形容词后缀' }],
    tip: '对美的「感觉」→ 审美的。', tag: '六级'
  },
  {
    id: 'c6-010', word: 'aggravate', phonetic: '/ˈæɡrəveɪt/', pos: 'v.', cn: '加重；恶化',
    en: 'Staying up late will aggravate your headache.',
    cnSent: '熬夜会加重你的头痛。',
    roots: [{ t: 'ag-', m: '朝向' }, { t: 'grav', m: '重' }, { t: '-ate', m: '动词后缀' }],
    tip: '使负担变「重」→ 加重。', tag: '六级'
  },
  {
    id: 'c6-011', word: 'ambiguous', phonetic: '/æmˈbɪɡjuəs/', pos: 'adj.', cn: '模棱两可的；含糊的',
    en: 'His answer was ambiguous and confused everyone.',
    cnSent: '他的回答模棱两可，把大家都弄糊涂了。',
    roots: [{ t: 'ambi-', m: '两边' }, { t: 'ag', m: '走' }, { t: '-ous', m: '形容词后缀' }],
    tip: '两边都能「走」→ 模棱两可的。', tag: '六级'
  },
  {
    id: 'c6-012', word: 'amend', phonetic: '/əˈmend/', pos: 'v.', cn: '修订；修改',
    en: 'The committee voted to amend the rules.',
    cnSent: '委员会投票修改规则。',
    roots: [{ t: 'a-', m: '朝向' }, { t: 'mend', m: '修补' }],
    tip: '把漏洞「补」上 → 修订。', tag: '六级'
  },
  {
    id: 'c6-013', word: 'analogy', phonetic: '/əˈnælədʒi/', pos: 'n.', cn: '类比；相似',
    en: 'The teacher drew an analogy between the heart and a pump.',
    cnSent: '老师把心脏比作水泵。',
    roots: [{ t: 'ana-', m: '按照' }, { t: 'log', m: '说' }, { t: '-y', m: '名词后缀' }],
    tip: '按比例来「说」→ 类比。', tag: '六级'
  },
  {
    id: 'c6-014', word: 'anonymous', phonetic: '/əˈnɒnɪməs/', pos: 'adj.', cn: '匿名的；无名的',
    en: 'The donation was made by an anonymous reader.',
    cnSent: '这笔捐款来自一位匿名读者。',
    roots: [{ t: 'an-', m: '无' }, { t: 'onym', m: '名字' }, { t: '-ous', m: '形容词后缀' }],
    tip: '没有名字 → 匿名的。', tag: '六级'
  },
  {
    id: 'c6-015', word: 'applaud', phonetic: '/əˈplɔːd/', pos: 'v.', cn: '鼓掌；称赞',
    en: 'The audience applauded for a long time.',
    cnSent: '观众鼓掌了很久。',
    roots: [{ t: 'ap-', m: '朝向' }, { t: 'plaud', m: '拍手' }],
    tip: '把手拍响 → 鼓掌。', tag: '六级'
  },
  {
    id: 'c6-016', word: 'arbitrary', phonetic: '/ˈɑːbɪtrəri/', pos: 'adj.', cn: '武断的；任意的',
    en: 'The decision seemed arbitrary and unfair.',
    cnSent: '这个决定显得武断又不公平。',
    roots: [{ t: 'arbit', m: '裁决' }, { t: '-rary', m: '形容词后缀' }],
    tip: '凭个人「裁决」→ 武断的。', tag: '六级'
  },
  {
    id: 'c6-017', word: 'articulate', phonetic: '/ɑːˈtɪkjuleɪt/', pos: 'v./adj.', cn: '清晰表达；善于表达的',
    en: 'She is able to articulate her ideas clearly.',
    cnSent: '她能够清楚地表达自己的想法。',
    roots: [{ t: 'articul', m: '关节' }, { t: '-ate', m: '动词后缀' }],
    tip: '把话像「关节」一样接起来 → 清晰表达。', tag: '六级'
  },
  {
    id: 'c6-018', word: 'ascend', phonetic: '/əˈsend/', pos: 'v.', cn: '上升；攀登',
    en: 'The balloon slowly ascended into the sky.',
    cnSent: '气球缓缓升上天空。',
    roots: [{ t: 'a-', m: '向上' }, { t: 'scend', m: '爬' }],
    tip: '向上「爬」→ 上升。', tag: '六级'
  },
  {
    id: 'c6-019', word: 'aspire', phonetic: '/əˈspaɪə(r)/', pos: 'v.', cn: '渴望；追求',
    en: 'She aspires to become a translator.',
    cnSent: '她渴望成为一名翻译。',
    roots: [{ t: 'a-', m: '朝向' }, { t: 'spir', m: '呼吸' }],
    tip: '向着目标「呼吸」→ 渴望。', tag: '六级'
  },
  {
    id: 'c6-020', word: 'assert', phonetic: '/əˈsɜːt/', pos: 'v.', cn: '断言；维护',
    en: 'He asserted that the plan would work.',
    cnSent: '他断言这个计划会奏效。',
    roots: [{ t: 'as-', m: '朝向' }, { t: 'sert', m: '连接' }],
    tip: '把观点「接」上去 → 断言。', tag: '六级'
  },
  {
    id: 'c6-021', word: 'attribute', phonetic: '/əˈtrɪbjuːt/', pos: 'v./n.', cn: '归因于；属性',
    en: 'She attributes her success to daily practice.',
    cnSent: '她把成功归因于每天练习。',
    roots: [{ t: 'at-', m: '朝向' }, { t: 'tribut', m: '给予' }, { t: '-e', m: '词尾' }],
    tip: '把原因「给」出去 → 归因于。', tag: '六级'
  },
  {
    id: 'c6-022', word: 'authentic', phonetic: '/ɔːˈθentɪk/', pos: 'adj.', cn: '真正的；可信的',
    en: 'This is an authentic Italian restaurant.',
    cnSent: '这是一家地道的意大利餐厅。',
    roots: [{ t: 'aut', m: '自己' }, { t: 'hent', m: '来源' }, { t: '-ic', m: '形容词后缀' }],
    tip: '出自本人 → 真正的。', tag: '六级'
  },
  {
    id: 'c6-023', word: 'avert', phonetic: '/əˈvɜːt/', pos: 'v.', cn: '避免；转移',
    en: 'Quick action averted a serious accident.',
    cnSent: '迅速的行动避免了一场严重事故。',
    roots: [{ t: 'a-', m: '离开' }, { t: 'vert', m: '转' }],
    tip: '把灾难「转」开 → 避免。', tag: '六级'
  },
  {
    id: 'c6-024', word: 'bewilder', phonetic: '/bɪˈwɪldə(r)/', pos: 'v.', cn: '使困惑；使迷失',
    en: 'The complicated form bewildered the applicants.',
    cnSent: '复杂的表格让申请者不知所措。',
    roots: [{ t: 'be-', m: '使' }, { t: 'wilder', m: '迷路' }],
    tip: '让人「迷路」→ 使困惑。', tag: '六级'
  },
  {
    id: 'c6-025', word: 'bias', phonetic: '/ˈbaɪəs/', pos: 'n./v.', cn: '偏见；使有偏见',
    en: 'The report shows a clear bias against small shops.',
    cnSent: '这份报告明显对小商铺有偏见。',
    roots: [{ t: 'bias', m: '斜' }],
    tip: '看「歪」了 → 偏见。', tag: '六级'
  }
]

cet4.forEach((w) => {
  w.book = 'cet4'
})
cet6.forEach((w) => {
  w.book = 'cet6'
})

/* ============================================================
 * 全量词库合并
 * cet4-full.js / cet6-full.js 为开源词库生成的紧凑数组，
 * 结构：[单词, 音标, 中文释义, 词性]。
 * 精选词（含例句、词根、记忆提示）优先保留，全量词只补充词义。
 * 同一单词只归属一本词书，避免统计重复。
 * ============================================================ */
const fullCet4 = require('./cet4-full.js')
const fullCet6 = require('./cet6-full.js')
const usedWords = {}

cet4.forEach((w) => {
  usedWords[w.word.toLowerCase()] = true
})
cet6.forEach((w) => {
  usedWords[w.word.toLowerCase()] = true
})

function appendFullWords(list, rows, book) {
  let added = 0
  rows.forEach((row, index) => {
    const word = row[0]
    if (usedWords[word]) return
    usedWords[word] = true
    list.push({
      id: book + '-f' + index,
      word: word,
      phonetic: row[1],
      cn: row[2],
      pos: row[3] || '',
      en: '',
      cnSent: '',
      roots: [],
      tip: '',
      tag: book === 'cet4' ? '四级' : '六级',
      book: book
    })
    added += 1
  })
  return added
}

appendFullWords(cet4, fullCet4, 'cet4')
appendFullWords(cet6, fullCet6, 'cet6')

function byWord(a, b) {
  const x = a.word.toLowerCase()
  const y = b.word.toLowerCase()
  return x < y ? -1 : x > y ? 1 : 0
}
cet4.sort(byWord)
cet6.sort(byWord)

const all = cet4.concat(cet6)
const byId = {}
all.forEach((w) => {
  byId[w.id] = w
})

const BOOKS = [
  {
    id: 'cet4',
    name: '四级全量词',
    short: 'CET-4',
    emoji: '🐣',
    color: 'orange',
    desc: '大学英语四级全量核心词汇',
    total: cet4.length
  },
  {
    id: 'cet6',
    name: '六级全量词',
    short: 'CET-6',
    emoji: '🦊',
    color: 'purple',
    desc: '大学英语六级全量进阶词汇',
    total: cet6.length
  }
]

function getById(id) {
  return byId[id] || null
}

function getBook(id) {
  return id === 'cet6' ? cet6 : cet4
}

module.exports = {
  cet4: cet4,
  cet6: cet6,
  all: all,
  books: BOOKS,
  getById: getById,
  getBook: getBook
}
