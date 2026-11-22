/**
 * 词灵岛 · 写作与翻译题库
 */
const essays = [
  {
    id: 'w1',
    title: 'The Benefits of Reading Classics',
    cnTitle: '阅读经典的好处',
    level: 'CET-4',
    direction: 'Write an essay on the benefits of reading classics. You should write at least 120 words but no more than 180 words.',
    outline: ['经典作品为什么值得反复阅读', '阅读经典对语言与思维的影响', '你的阅读建议'],
    keyPhrases: ['classic literature', 'stand the test of time', 'broaden one\'s horizons', 'critical thinking', 'a lifelong habit'],
    sample: 'Reading classics is often considered old-fashioned in an age of short videos. However, great books have stood the test of time for a reason. They record how people love, struggle and grow, so they speak to every generation.\n\nFirst, classics enrich our language. Their careful sentences and vivid descriptions give us better words to express complicated feelings. Second, they train our thinking. When we follow a character through a difficult choice, we practice seeing the world from another point of view. This is exactly what critical thinking requires.\n\nTherefore, I suggest reading ten pages of a classic every night instead of scrolling through short videos. Do not worry if the language is hard at first. A classic is not a race but a conversation, and it is always waiting for you to return.'
  },
  {
    id: 'w2',
    title: 'Online Learning: Advantages and Challenges',
    cnTitle: '线上学习的利与弊',
    level: 'CET-4',
    direction: 'Write an essay discussing the advantages and challenges of online learning. You should write at least 120 words but no more than 180 words.',
    outline: ['线上学习带来的便利', '线上学习面临的挑战', '如何扬长避短'],
    keyPhrases: ['flexible schedule', 'self-discipline', 'interaction', 'distraction', 'combine online and offline'],
    sample: 'Online learning has become a normal part of campus life. Its advantages are obvious: students can watch lectures at any time, slow down a difficult part, and save the time spent travelling between buildings.\n\nHowever, it also brings challenges. Without a fixed classroom, learning depends heavily on self-discipline. A notification or a short video can easily pull attention away. Moreover, face-to-face interaction is reduced, which makes it harder to ask questions and feel connected.\n\nIn my view, the key is to combine online and offline learning wisely. We can use online courses for review and repetition, while keeping discussions and group work in the classroom. With a clear plan and a quiet desk, online learning can be a powerful tool rather than a distraction.'
  },
  {
    id: 'w3',
    title: 'Should College Students Take Part-time Jobs?',
    cnTitle: '大学生该不该做兼职',
    level: 'CET-6',
    direction: 'Write an essay on whether college students should take part-time jobs. You should write at least 150 words but no more than 200 words.',
    outline: ['兼职的积极意义', '兼职可能带来的问题', '你的观点与建议'],
    keyPhrases: ['part-time job', 'practical experience', 'time management', 'academic performance', 'strike a balance'],
    sample: 'Whether college students should take part-time jobs has long been debated. Supporters argue that a part-time job offers practical experience which no textbook can provide. Students learn how to communicate with customers, manage their time and take responsibility for their own work.\n\nNevertheless, the risks should not be ignored. Working long hours may leave little energy for classes, and some jobs offer low pay with little real training. For students who already struggle with time management, a part-time job could easily damage their academic performance.\n\nIn my opinion, the answer depends on the individual. A part-time job is worthwhile when it is related to one\'s major and limited to weekends. Before taking it, students should ask themselves one question: will this job help me grow, or simply keep me busy? The ability to strike a balance is itself an important lesson.'
  },
  {
    id: 'w4',
    title: 'How AI Is Changing the Way We Learn',
    cnTitle: 'AI 如何改变学习方式',
    level: 'CET-6',
    direction: 'Write an essay on how artificial intelligence is changing the way students learn. You should write at least 150 words but no more than 200 words.',
    outline: ['AI 在学习中的具体应用', '可能产生的依赖与风险', '学生应如何应对'],
    keyPhrases: ['artificial intelligence', 'personalized practice', 'over-reliance', 'independent thinking', 'a double-edged sword'],
    sample: 'Artificial intelligence is quietly reshaping the classroom. With a single question, students can receive explanations, summaries and personalized practice. Language learners, in particular, benefit from tools that correct pronunciation and suggest better expressions at any hour of the day.\n\nYet every convenience carries a cost. When answers arrive too easily, the habit of thinking may weaken. Students may finish homework without understanding it, and the confidence they gain may be borrowed rather than earned. In this sense, AI is a double-edged sword.\n\nThe wise response is neither to refuse the tool nor to depend on it. We should use AI for practice and feedback, but keep the essential work -- questioning, reasoning and creating -- in our own hands. A tool becomes valuable only when the person using it remains awake.'
  }
]

const translations = [
  {
    id: 't1',
    title: '中国茶文化',
    zh: '茶是中国人日常生活中最常见的饮品之一。中国饮茶的历史可以追溯到几千年前。对许多人来说，泡茶不仅是一种习惯，更是一种让心静下来的方式。近年来，越来越多的年轻人开始学习传统茶艺，他们希望在一杯茶里找到属于自己的慢时光。',
    ref: 'Tea is one of the most common drinks in the daily life of Chinese people. The history of tea drinking in China can be traced back thousands of years. For many people, making tea is not only a habit but also a way to calm the mind. In recent years, more and more young people have begun to learn traditional tea art, hoping to find their own slow moments in a cup of tea.',
    points: ['追溯到：be traced back to', '不仅……更……：not only... but also...', '让心静下来：calm the mind', '茶艺：tea art']
  },
  {
    id: 't2',
    title: '中国高铁',
    zh: '中国高铁运营里程居世界首位。高铁把许多原本需要一整天的旅程缩短到了几个小时，让人们可以在一天之内往返于不同的城市。它不仅改变了人们的出行方式，也促进了沿线地区的经济发展。如今，乘坐高铁出行已经成为许多中国人的首选。',
    ref: 'China ranks first in the world in terms of high-speed railway mileage. High-speed trains have shortened many journeys that once took a whole day to just a few hours, allowing people to travel between cities within a single day. It has not only changed the way people travel but also promoted the economic development of the areas along the lines. Today, travelling by high-speed train has become the first choice for many Chinese people.',
    points: ['运营里程：operating mileage', '居世界首位：rank first in the world', '把……缩短到……：shorten... to...', '沿线地区：areas along the lines']
  },
  {
    id: 't3',
    title: '终身学习',
    zh: '在快速变化的时代，终身学习不再是一句口号，而是每个人都需要具备的能力。学校教给我们的知识很快就会过时，真正重要的是保持好奇心和学习的习惯。无论是阅读一本新书，还是学习一项新技能，每一次学习都会让我们看到更大的世界。',
    ref: 'In an era of rapid change, lifelong learning is no longer a slogan but a capability that everyone needs. The knowledge taught in school quickly becomes outdated, and what really matters is keeping curiosity and the habit of learning. Whether it is reading a new book or learning a new skill, every learning experience allows us to see a bigger world.',
    points: ['终身学习：lifelong learning', '口号：slogan', '过时：outdated', '无论……还是……：whether... or...']
  },
  {
    id: 't4',
    title: '传统节日',
    zh: '传统节日是中华文化的重要组成部分。春节、端午节和中秋节不仅承载着丰富的历史记忆，也为家人团聚提供了机会。随着时代的发展，节日的庆祝方式不断变化，但人们对团圆的向往从未改变。保护和传承传统节日，就是保护我们共同的文化根脉。',
    ref: 'Traditional festivals are an important part of Chinese culture. The Spring Festival, the Dragon Boat Festival and the Mid-Autumn Festival not only carry rich historical memories but also provide opportunities for family reunions. With the development of the times, the ways of celebration keep changing, but people\'s longing for reunion has never changed. To protect and pass on traditional festivals is to protect our shared cultural roots.',
    points: ['重要组成部分：an important part of', '承载：carry', '家人团聚：family reunion', '文化根脉：cultural roots']
  }
]

module.exports = {
  essays: essays,
  translations: translations
}
