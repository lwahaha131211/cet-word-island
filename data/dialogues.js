/**
 * 词灵岛 · 情景对话（角色扮演式）
 * 每个 turn：NPC 说一句话，学习者在 3 个回应中选择最得体的一项。
 * score = 10 为最佳回应，分数会累计为本次表现评级。
 */
module.exports = [
  {
    id: 'd1',
    title: '在图书馆借书',
    cnTitle: 'Borrowing a Book',
    emoji: '📚',
    scene: 'library',
    desc: '练习借书、出示证件、续借等常用表达。',
    turns: [
      {
        npc: { en: 'Good morning! How can I help you today?', cn: '早上好！今天需要什么帮助？' },
        options: [
          { en: 'I would like to borrow this book, please.', cn: '我想借这本书。', score: 10 },
          { en: 'I want borrow book.', cn: '我想借书。（语法错误）', score: 3 },
          { en: 'Where is the exit?', cn: '出口在哪里？', score: 0 }
        ],
        tip: '用 I would like to... 提出请求，比 I want 更礼貌。'
      },
      {
        npc: { en: 'May I see your student card?', cn: '可以看一下你的学生卡吗？' },
        options: [
          { en: 'Sure, here you are.', cn: '当然，给你。', score: 10 },
          { en: 'Why do you need it?', cn: '你为什么要看？', score: 4 },
          { en: 'No, I forgot it.', cn: '不，我忘带了。', score: 2 }
        ],
        tip: '递东西时说 Here you are 是最自然的表达。'
      },
      {
        npc: { en: 'This book is due in two weeks. Would you like to renew it online?', cn: '这本书两周后到期，你想在线续借吗？' },
        options: [
          { en: 'Yes, how do I renew it?', cn: '想，我该怎么续借？', score: 10 },
          { en: 'No, I will finish it tonight.', cn: '不用，我今晚就能看完。', score: 7 },
          { en: 'Two weeks is too short.', cn: '两周太短了。', score: 3 }
        ],
        tip: '接受提议并追问操作方式，能让对话继续推进。'
      },
      {
        npc: { en: 'You can renew it once on the library website. Anything else?', cn: '你可以在图书馆网站续借一次。还有别的事吗？' },
        options: [
          { en: 'No, that is all. Thank you!', cn: '没有了，谢谢你！', score: 10 },
          { en: 'I do not have a computer.', cn: '我没有电脑。', score: 6 },
          { en: 'Give me another book.', cn: '再给我一本书。', score: 2 }
        ],
        tip: '结束对话时用 That is all, thank you 简洁得体。'
      }
    ],
    keyPhrases: ['borrow', 'due', 'renew', 'student card', 'Here you are']
  },
  {
    id: 'd2',
    title: '咖啡店点单',
    cnTitle: 'Ordering Coffee',
    emoji: '☕',
    scene: 'cafe',
    desc: '练习点单、选择冷热、堂食外带与付款。',
    turns: [
      {
        npc: { en: 'Hi there! What can I get for you?', cn: '你好！想喝点什么？' },
        options: [
          { en: 'A medium latte, please.', cn: '一杯中杯拿铁，谢谢。', score: 10 },
          { en: 'I want coffee.', cn: '我要咖啡。', score: 5 },
          { en: 'What is your name?', cn: '你叫什么名字？', score: 0 }
        ],
        tip: '点单时说清品类和杯型，A medium latte, please 最清楚。'
      },
      {
        npc: { en: 'Would you like it hot or iced?', cn: '你要热的还是冰的？' },
        options: [
          { en: 'Iced, please. It is quite warm today.', cn: '冰的，今天挺热的。', score: 10 },
          { en: 'Hot.', cn: '热的。', score: 6 },
          { en: 'Whatever.', cn: '随便。', score: 1 }
        ],
        tip: '加上一点原因（It is quite warm today）会让表达更自然。'
      },
      {
        npc: { en: 'For here or to go?', cn: '堂食还是外带？' },
        options: [
          { en: 'To go, please. I am heading to class.', cn: '外带，我要去上课。', score: 10 },
          { en: 'Here.', cn: '这里。', score: 6 },
          { en: 'Yes.', cn: '是的。', score: 0 }
        ],
        tip: 'For here or to go 是固定问法，回答 To go 或 For here。'
      },
      {
        npc: { en: 'That will be fifteen yuan. We will call your name when it is ready.', cn: '一共十五元，做好后我们会叫你的名字。' },
        options: [
          { en: 'Great, thanks. My name is Alex.', cn: '好的，谢谢。我叫 Alex。', score: 10 },
          { en: 'Fifteen? That is expensive.', cn: '十五？太贵了。', score: 3 },
          { en: 'Can I pay later?', cn: '可以晚点付吗？', score: 1 }
        ],
        tip: '店员需要名字时，主动报上名字并道谢即可。'
      }
    ],
    keyPhrases: ['medium', 'latte', 'iced', 'to go', 'for here']
  },
  {
    id: 'd3',
    title: '求职面试',
    cnTitle: 'A Job Interview',
    emoji: '💼',
    scene: 'office',
    desc: '练习自我介绍、求职动机、抗压能力与反问环节。',
    turns: [
      {
        npc: { en: 'Thanks for coming in. Could you tell me a little about yourself?', cn: '感谢你前来面试。能简单介绍一下自己吗？' },
        options: [
          { en: 'I am a senior majoring in English, and I enjoy working with people.', cn: '我是英语专业大四学生，喜欢与人打交道。', score: 10 },
          { en: 'Everything is on my resume.', cn: '简历上都写了。', score: 4 },
          { en: 'I need a job.', cn: '我需要一份工作。', score: 2 }
        ],
        tip: '自我介绍用「身份 + 专业 + 与岗位相关的特点」结构最稳。'
      },
      {
        npc: { en: 'What makes you interested in this position?', cn: '你为什么对这个岗位感兴趣？' },
        options: [
          { en: 'Your focus on education matches my goal of becoming a teacher.', cn: '贵公司对教育的专注与我想成为老师的目标一致。', score: 10 },
          { en: 'The salary looks good.', cn: '薪水看起来不错。', score: 5 },
          { en: 'I do not know.', cn: '我不知道。', score: 0 }
        ],
        tip: '把公司特点与个人目标连接起来，比只谈薪水更有说服力。'
      },
      {
        npc: { en: 'How do you handle pressure?', cn: '你如何应对压力？' },
        options: [
          { en: 'I make a to-do list and focus on one task at a time.', cn: '我会列清单，一次专注一件事。', score: 10 },
          { en: 'I never feel pressure.', cn: '我从来没有压力。', score: 2 },
          { en: 'I usually panic.', cn: '我通常会慌。', score: 0 }
        ],
        tip: '回答压力题要给具体方法，而不是否认压力。'
      },
      {
        npc: { en: 'Do you have any questions for us?', cn: '你有什么问题想问我们吗？' },
        options: [
          { en: 'Yes, what does a typical day look like for this role?', cn: '有，这个岗位典型的一天是怎样的？', score: 10 },
          { en: 'When can I start?', cn: '我什么时候能入职？', score: 6 },
          { en: 'No, I just want the job.', cn: '没有，我只是想要这份工作。', score: 2 }
        ],
        tip: '反问岗位日常，既显示兴趣，也能帮你判断是否合适。'
      }
    ],
    keyPhrases: ['major in', 'position', 'handle pressure', 'to-do list', 'typical day']
  },
  {
    id: 'd4',
    title: '机场问路',
    cnTitle: 'Finding the Gate',
    emoji: '✈️',
    scene: 'airport',
    desc: '练习问路、乘坐摆渡车与确认时间。',
    turns: [
      {
        npc: { en: 'Excuse me, you look lost. Do you need help?', cn: '打扰一下，你好像迷路了，需要帮忙吗？' },
        options: [
          { en: 'Yes, I am looking for Gate 23.', cn: '是的，我在找 23 号登机口。', score: 10 },
          { en: 'Where am I?', cn: '我在哪儿？', score: 5 },
          { en: 'No, I live here.', cn: '不，我住在这儿。', score: 0 }
        ],
        tip: '直接说明目的地，比笼统提问更高效。'
      },
      {
        npc: { en: 'Gate 23 is in Terminal 2. You will need to take the shuttle bus.', cn: '23 号登机口在 2 号航站楼，你需要坐摆渡车。' },
        options: [
          { en: 'How often does the shuttle run?', cn: '摆渡车多久一班？', score: 10 },
          { en: 'Can I walk there?', cn: '我可以走过去吗？', score: 6 },
          { en: 'I hate buses.', cn: '我讨厌公交车。', score: 1 }
        ],
        tip: '听到交通方式后，追问频率或时间是最实用的回应。'
      },
      {
        npc: { en: 'It runs every ten minutes, right outside Door 5.', cn: '每十分钟一班，就在 5 号门外。' },
        options: [
          { en: 'Thank you. How long does the ride take?', cn: '谢谢。车程要多久？', score: 10 },
          { en: 'Is it free?', cn: '是免费的吗？', score: 7 },
          { en: 'Okay. Goodbye.', cn: '好的，再见。', score: 3 }
        ],
        tip: '确认车程时间，能帮助你判断是否赶得上登机。'
      },
      {
        npc: { en: 'About eight minutes. You had better hurry, boarding starts in twenty.', cn: '大约八分钟。你最好快点，二十分钟后开始登机。' },
        options: [
          { en: 'Thanks for the help. I will run!', cn: '谢谢帮忙，我跑过去！', score: 10 },
          { en: 'No rush, I have time.', cn: '不急，我有时间。', score: 2 },
          { en: 'Can you come with me?', cn: '你能陪我一起去吗？', score: 4 }
        ],
        tip: '得到紧急提醒后，道谢并表明行动，是得体的收尾。'
      }
    ],
    keyPhrases: ['Gate', 'Terminal', 'shuttle bus', 'every ten minutes', 'boarding']
  }
]
