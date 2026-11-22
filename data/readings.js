/**
 * 词灵岛 · 阅读闯关题库
 * 每篇包含原文、生词提示与 3 道理解题。
 */
module.exports = [
  {
    id: 'r1',
    title: 'The Library at Midnight',
    cnTitle: '午夜图书馆',
    emoji: '🌙',
    level: 'CET-4',
    minutes: 6,
    passage: [
      'At eleven o\'clock, the campus library is almost empty. Only the third floor is still lit, where a small group of students gather every night. They call themselves the "Midnight Readers". There is no teacher, no attendance, and no credit. They simply read for one hour and then share one sentence they liked.',
      'The idea started with a shy freshman named Lin. She found that she could not focus in her dormitory, so she began coming to the library at night. One week later, a classmate joined her. By the end of the term, twelve students were meeting regularly. They discovered that reading together made difficult texts less frightening. When someone stopped, the others would gently remind them.',
      'The group has no rules except one: no phones on the table. "We are not against technology," Lin explains. "We just want one hour that belongs to ourselves." In a busy term, that hour has become the most valuable part of their week.'
    ],
    keyWords: [
      { word: 'attendance', cn: '出勤；到场' },
      { word: 'regularly', cn: '定期地；经常地' },
      { word: 'valuable', cn: '有价值的' }
    ],
    questions: [
      {
        q: 'Why did Lin begin going to the library at night?',
        options: [
          'She had no place in her dormitory.',
          'She could not focus in her dormitory.',
          'She wanted to meet her teachers.',
          'The library gave her credit.'
        ],
        answer: 1,
        explain: '第二段明确提到 she could not focus in her dormitory，所以她选择晚上去图书馆。'
      },
      {
        q: 'What is the only rule of the Midnight Readers?',
        options: [
          'No talking during reading.',
          'No phones on the table.',
          'Read one book every week.',
          'Arrive before eleven o\'clock.'
        ],
        answer: 1,
        explain: '第三段 "no rules except one: no phones on the table" 直接给出答案。'
      },
      {
        q: 'What can we infer about the group?',
        options: [
          'It is organized by the university.',
          'It helps students win scholarships.',
          'It gives students a quiet hour of their own.',
          'It refuses to use any technology.'
        ],
        answer: 2,
        explain: 'Lin 说 "one hour that belongs to ourselves"，说明这个小组的价值在于属于自己的安静时光。'
      }
    ]
  },
  {
    id: 'r2',
    title: 'In Praise of Being Bored',
    cnTitle: '为无聊辩护',
    emoji: '☁️',
    level: 'CET-6',
    minutes: 7,
    passage: [
      'We treat boredom as a problem to be solved. The moment a queue forms or a bus is late, our hands reach for a phone. Yet a growing number of psychologists suggest that boredom is not an enemy but a signal. It tells us that our attention is free, and that the mind is ready to wander.',
      'Wandering, it turns out, is useful. When we are bored, the brain does not switch off; it starts connecting unrelated ideas. Some of the best ideas in history came to people who had nothing else to do. Newton was resting under a tree. Archimedes was sitting in a bath.',
      'This does not mean we should throw away our phones. It means we could leave a few empty minutes in a day. Let the bus be late. Let the queue move slowly. In that small space, the mind may begin to play -- and play is where learning quietly happens.'
    ],
    keyWords: [
      { word: 'boredom', cn: '无聊；厌倦' },
      { word: 'psychologist', cn: '心理学家' },
      { word: 'unrelated', cn: '不相关的' }
    ],
    questions: [
      {
        q: 'What do some psychologists think of boredom?',
        options: [
          'It is a mental disease.',
          'It is a signal worth listening to.',
          'It is a habit we should break.',
          'It is a waste of time.'
        ],
        answer: 1,
        explain: '第一段 "boredom is not an enemy but a signal"，说明无聊是一个信号。'
      },
      {
        q: 'What happens in the brain when we are bored?',
        options: [
          'It switches off completely.',
          'It connects unrelated ideas.',
          'It becomes slower and slower.',
          'It stops learning new things.'
        ],
        answer: 1,
        explain: '第二段 "it starts connecting unrelated ideas" 是解题关键。'
      },
      {
        q: 'What does the author suggest readers do?',
        options: [
          'Give up smartphones completely.',
          'Fill every minute with tasks.',
          'Leave some empty minutes in a day.',
          'Take more baths and walks.'
        ],
        answer: 2,
        explain: '作者在最后一段建议 "leave a few empty minutes in a day"，并非完全抛弃手机。'
      }
    ]
  },
  {
    id: 'r3',
    title: 'The City That Drinks Rain',
    cnTitle: '喝雨水的城市',
    emoji: '🌧️',
    level: 'CET-6',
    minutes: 7,
    passage: [
      'In the coastal city of Xiamen, rain used to be a nuisance: streets flooded, traffic stopped, and water ran into the sea. Today, the same rain is collected, filtered, and stored under parks and school playgrounds. The city calls these hidden tanks "water banks".',
      'The system is simple. Rainwater flows through small channels into underground rooms filled with sand and gravel. Layers of stone slow the water down and clean it naturally. Pumps then send it back to gardens, toilets, and street cleaners. During heavy storms, the tanks also hold water that would otherwise flood the roads.',
      'Engineers admit that water banks cannot solve every problem. They are expensive to build and need regular cleaning. But in a city where fresh water is limited, they turn a threat into a resource. As one engineer puts it, "We cannot stop the rain. We can only decide what to do with it."'
    ],
    keyWords: [
      { word: 'nuisance', cn: '麻烦事；讨厌的东西' },
      { word: 'filter', cn: '过滤' },
      { word: 'resource', cn: '资源' }
    ],
    questions: [
      {
        q: 'What are "water banks"?',
        options: [
          'Banks that lend money for water projects.',
          'Hidden tanks that store rainwater.',
          'Parks with beautiful fountains.',
          'Walls built to stop sea water.'
        ],
        answer: 1,
        explain: '第一段 "stored under parks... hidden tanks" 说明 water banks 是储存雨水的地下设施。'
      },
      {
        q: 'How is rainwater cleaned in the system?',
        options: [
          'By adding chemicals.',
          'By layers of sand and gravel.',
          'By pumps and machines only.',
          'By sunlight and wind.'
        ],
        answer: 1,
        explain: '第二段提到地下空间填满 sand and gravel，由石层自然净化。'
      },
      {
        q: 'What is the engineers\' attitude toward water banks?',
        options: [
          'Completely disappointed.',
          'Realistic but positive.',
          'Uninterested and careless.',
          'Certain that they solve every problem.'
        ],
        answer: 1,
        explain: '工程师承认局限（昂贵、需清理），但认为它们把威胁变成了资源，态度是务实而积极的。'
      }
    ]
  }
]
