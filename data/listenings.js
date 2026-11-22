/**
 * 词灵岛 · 听力与影子跟读材料
 * 每段材料包含逐句原文、译文和听力理解题。
 */
module.exports = [
  {
    id: 'l1',
    title: 'On Campus',
    cnTitle: '校园问路',
    emoji: '🎧',
    level: 'CET-4',
    scene: 'campus',
    intro: '一段关于语言实验室位置的校园对话。',
    sentences: [
      { en: 'Excuse me, do you know where the language lab is?', cn: '打扰一下，你知道语言实验室在哪里吗？' },
      { en: 'Sure. Go straight ahead, turn left at the cafeteria, and it is on the second floor.', cn: '当然。一直往前走，在食堂左转，它就在二楼。' },
      { en: 'Is it open on Saturday mornings?', cn: '周六上午开门吗？' },
      { en: 'Yes, from nine to twelve. But you need to bring your student card.', cn: '开的，从九点到十二点。不过你需要带学生卡。' },
      { en: 'Thanks a lot. I have a listening test next week.', cn: '太感谢了，我下周有听力考试。' },
      { en: 'Good luck! The lab has some great practice materials.', cn: '祝你好运！实验室有一些很好的练习材料。' }
    ],
    questions: [
      {
        q: 'Where does the woman want to go?',
        options: ['The cafeteria', 'The language lab', 'The library', 'The second gate'],
        answer: 1,
        explain: '女士一开始就问 language lab 的位置。'
      },
      {
        q: 'When is the lab open on Saturday?',
        options: ['From eight to ten', 'From nine to twelve', 'From ten to two', 'It is closed'],
        answer: 1,
        explain: '回答是 from nine to twelve。'
      },
      {
        q: 'What does the woman need to bring?',
        options: ['Her student card', 'Her passport', 'A notebook', 'An umbrella'],
        answer: 0,
        explain: '男士提醒 you need to bring your student card。'
      }
    ]
  },
  {
    id: 'l2',
    title: 'Campus Weather Report',
    cnTitle: '校园天气播报',
    emoji: '⛅',
    level: 'CET-4',
    scene: 'weather',
    intro: '周五校园天气播报，注意下午和周末的变化。',
    sentences: [
      { en: 'Good morning, everyone. This is your campus weather report for Friday.', cn: '大家早上好，这是周五的校园天气播报。' },
      { en: 'The day will start sunny, with a temperature of about eighteen degrees.', cn: '今天白天以晴开场，气温大约十八度。' },
      { en: 'In the afternoon, clouds will move in from the west, and there is a sixty percent chance of rain after four o\'clock.', cn: '下午云层会从西边移入，四点以后有百分之六十的降雨概率。' },
      { en: 'If you are going to the sports meeting, please take an umbrella.', cn: '如果你要去参加运动会，请带一把伞。' },
      { en: 'The weekend will be cooler, with strong winds on Sunday.', cn: '周末会更凉，周日有大风。' },
      { en: 'Next week, warmer weather is expected to return.', cn: '预计下周暖空气会回归。' }
    ],
    questions: [
      {
        q: 'What will the weather be like in the afternoon?',
        options: ['Sunny and warm', 'Cloudy with a chance of rain', 'Snowy and cold', 'Windy and dry'],
        answer: 1,
        explain: '下午云层移入，四点后有 60% 降雨概率。'
      },
      {
        q: 'What is the advice for students going to the sports meeting?',
        options: ['Wear sunglasses', 'Take an umbrella', 'Bring a coat', 'Arrive early'],
        answer: 1,
        explain: '播报明确说 please take an umbrella。'
      },
      {
        q: 'What will Sunday be like?',
        options: ['Rainy', 'Sunny', 'Windy', 'Snowy'],
        answer: 2,
        explain: 'with strong winds on Sunday，周日有大风。'
      }
    ]
  },
  {
    id: 'l3',
    title: 'Library Notice',
    cnTitle: '图书馆通知',
    emoji: '📢',
    level: 'CET-4',
    scene: 'library',
    intro: '图书馆闭馆维修期间的借还书安排。',
    sentences: [
      { en: 'Attention, please. The main library will be closed this Thursday for electrical repairs.', cn: '请注意，主图书馆本周四因电力维修闭馆。' },
      { en: 'During the closure, the reading rooms on the first floor will remain open, but the book stacks will not be available.', cn: '闭馆期间，一楼阅览室仍然开放，但书库无法使用。' },
      { en: 'If you need to return books, please use the drop box outside the north entrance.', cn: '如需还书，请使用北门外面的还书箱。' },
      { en: 'All borrowed books will be automatically renewed for one week.', cn: '所有已借图书将自动续借一周。' },
      { en: 'We apologize for any inconvenience and expect to reopen at eight on Friday morning.', cn: '对由此带来的不便我们深表歉意，预计周五早上八点重新开放。' }
    ],
    questions: [
      {
        q: 'Why will the main library be closed?',
        options: ['For cleaning', 'For electrical repairs', 'For a holiday', 'For a book fair'],
        answer: 1,
        explain: '通知开头说明 for electrical repairs。'
      },
      {
        q: 'How can students return books during the closure?',
        options: [
          'Give them to a librarian.',
          'Use the drop box outside the north entrance.',
          'Send them by mail.',
          'Keep them until Friday.'
        ],
        answer: 1,
        explain: '通知建议使用北门外的还书箱。'
      },
      {
        q: 'What will happen to borrowed books?',
        options: [
          'They must be returned on Thursday.',
          'They will be renewed for one week.',
          'They will be collected by staff.',
          'They will be charged a fee.'
        ],
        answer: 1,
        explain: '所有借出的书会自动续借一周。'
      }
    ]
  }
]
