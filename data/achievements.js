/**
 * 词灵岛 · 成就定义
 * metric 对应 utils/store.js 中的 getMetricValue 指标，target 为达成阈值。
 */
module.exports = [
  { id: 'first_word', name: '启程之星', emoji: '🌱', desc: '学习第一个单词', metric: 'learned', target: 1 },
  { id: 'learned_10', name: '小小词汇家', emoji: '📖', desc: '累计学习 10 个单词', metric: 'learned', target: 10 },
  { id: 'learned_50', name: '词海航行者', emoji: '🚢', desc: '累计学习 50 个单词', metric: 'learned', target: 50 },
  { id: 'learned_200', name: '词汇收藏家', emoji: '🏛️', desc: '累计学习 200 个单词', metric: 'learned', target: 200 },
  { id: 'streak_3', name: '三日不辍', emoji: '🔥', desc: '连续打卡 3 天', metric: 'streak', target: 3 },
  { id: 'streak_7', name: '一周同行', emoji: '🌈', desc: '连续打卡 7 天', metric: 'streak', target: 7 },
  { id: 'streak_30', name: '月度传说', emoji: '👑', desc: '连续打卡 30 天', metric: 'streak', target: 30 },
  { id: 'review_100', name: '复习达人', emoji: '🔁', desc: '累计复习 100 次', metric: 'reviews', target: 100 },
  { id: 'correct_100', name: '神射手', emoji: '🎯', desc: '累计答对 100 题', metric: 'correct', target: 100 },
  { id: 'minutes_600', name: '十小时专注', emoji: '⏳', desc: '累计学习 600 分钟', metric: 'minutes', target: 600 },
  { id: 'garden_5', name: '初开花园', emoji: '🌷', desc: '知识花园盛开 5 朵花', metric: 'garden', target: 5 },
  { id: 'garden_20', name: '花海主人', emoji: '🌻', desc: '知识花园盛开 20 朵花', metric: 'garden', target: 20 },
  { id: 'pet_5', name: '伙伴行者', emoji: '🐾', desc: '伙伴达到 5 级', metric: 'petLevel', target: 5 },
  { id: 'puzzle_10', name: '拼图巧手', emoji: '🧩', desc: '通关 10 个词根拼图', metric: 'puzzle', target: 10 },
  { id: 'chapter_1', name: '故事开端', emoji: '📜', desc: '完成第 1 个剧情章节', metric: 'chapters', target: 1 },
  { id: 'chapter_6', name: '岛屿守护者', emoji: '🏆', desc: '完成全部剧情章节', metric: 'chapters', target: 6 },
  { id: 'exam_1', name: '首战考场', emoji: '📝', desc: '完成 1 次模拟考试', metric: 'exam', target: 1 },
  { id: 'score_425', name: '过线啦', emoji: '🎉', desc: '模拟考达到 425 分', metric: 'bestScore', target: 425 },
  { id: 'score_500', name: '高分选手', emoji: '💎', desc: '模拟考达到 500 分', metric: 'bestScore', target: 500 },
  { id: 'fish_200', name: '小鱼干富翁', emoji: '🐟', desc: '持有 200 条小鱼干', metric: 'fish', target: 200 }
]
