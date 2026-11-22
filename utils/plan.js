/**
 * 词灵岛 · 备考计划生成器
 * 根据考试日期、目标分数与当前词汇量，生成逐日学习安排。
 */
const util = require('./util.js')

/**
 * @param {Object} profile { examDate, dailyNew, targetScore }
 * @param {Object} progress { total, learned, mastered }
 * @returns {Object} { days, totalDays, todayTask, schedule }
 */
function buildPlan(profile, progress) {
  const totalDays = Math.max(1, util.daysUntil(profile.examDate))
  const dailyNew = Math.max(5, Number(profile.dailyNew) || 15)
  const remain = Math.max(0, progress.total - progress.learned)
  const reviewPerDay = Math.min(60, Math.max(15, Math.round((progress.learned || 0) * 0.25)))
  const needDays = Math.ceil(remain / dailyNew)

  const schedule = []
  const showDays = Math.min(totalDays, 14)
  for (let i = 0; i < showDays; i++) {
    const date = new Date(Date.now() + i * 86400000)
    const isToday = i === 0
    const newCount = remain > 0 ? Math.min(dailyNew, Math.max(0, remain - i * dailyNew)) : 0
    let stage = '基础积累'
    if (totalDays - i <= 14) stage = '冲刺模考'
    else if (totalDays - i <= 30) stage = '真题强化'
    else if (i > 0 && i % 7 === 0) stage = '周复盘'
    schedule.push({
      index: i + 1,
      date: util.formatDate(date, 'MM月DD日'),
      week: util.weekdayCN(date),
      isToday: isToday,
      newWords: newCount,
      reviewWords: Math.min(reviewPerDay, progress.learned || 0),
      stage: stage,
      done: false
    })
  }

  // 按剩余天数均摊，给出每日节奏建议
  let pace = '节奏轻松'
  if (totalDays > 0 && remain / totalDays > 25) pace = '节奏紧张，建议提高每日新词'
  else if (totalDays > 0 && remain / totalDays > 15) pace = '节奏适中，保持每日打卡'

  return {
    totalDays: totalDays,
    dailyNew: dailyNew,
    remain: remain,
    reviewPerDay: reviewPerDay,
    needDays: needDays,
    onTrack: needDays <= totalDays,
    pace: pace,
    schedule: schedule
  }
}

/** 根据剩余天数给出三个阶段的建议 */
function getPhases(profile) {
  const days = Math.max(1, util.daysUntil(profile.examDate))
  const phases = [
    {
      key: 'base',
      name: '基础积累',
      emoji: '🌱',
      desc: '主攻高频词，建立第一轮记忆',
      days: Math.max(0, days - 30),
      color: 'green'
    },
    {
      key: 'boost',
      name: '真题强化',
      emoji: '🔥',
      desc: '真题精练，查漏补缺',
      days: Math.min(30, Math.max(0, days - 14)),
      color: 'orange'
    },
    {
      key: 'sprint',
      name: '冲刺模考',
      emoji: '🚀',
      desc: '全真模考，稳定手感',
      days: Math.min(14, days),
      color: 'pink'
    }
  ]
  return phases
}

module.exports = {
  buildPlan: buildPlan,
  getPhases: getPhases
}
