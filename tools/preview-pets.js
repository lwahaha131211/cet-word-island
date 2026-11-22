/**
 * 开发辅助：生成五只伙伴的静态预览页，便于检查 CSS 造型
 * 运行：node tools/preview-pets.js
 */
const fs = require('fs')
const path = require('path')
const pets = require('../data/pets.js')

const ROOT = path.join(__dirname, '..')
let css = fs.readFileSync(path.join(ROOT, 'components/pet-avatar/index.wxss'), 'utf8')
css = css.replace(/(\d+(?:\.\d+)?)rpx/g, (m, n) => n + 'px')

function face(species, happy) {
  return `<div class="face face-${species}">
    <div class="eye eye-l"><div class="glint"></div></div>
    <div class="eye eye-r"><div class="glint"></div></div>
    <div class="blush blush-l"></div>
    <div class="blush blush-r"></div>
    <div class="mouth ${happy ? 'is-happy' : 'is-sad'}"></div>
  </div>`
}

function petBody(species, stage) {
  if (species === 'sprout') {
    return `<div class="sprout-stem"></div>
      <div class="sprout-leaf sprout-leaf-l"></div>
      <div class="sprout-leaf sprout-leaf-r"></div>
      <div class="sprout-body body"></div>
      <div class="sprout-foot sprout-foot-l"></div>
      <div class="sprout-foot sprout-foot-r"></div>
      ${stage >= 2 ? '<div class="sprout-spark">✦</div>' : ''}`
  }
  if (species === 'ink') {
    return `<div class="ink-tail"></div>
      <div class="ink-ear ink-ear-l"></div>
      <div class="ink-ear ink-ear-r"></div>
      <div class="ink-body body"></div>
      <div class="ink-drip ink-drip-1"></div>
      <div class="ink-drip ink-drip-2"></div>
      ${stage >= 1 ? '<div class="ink-horn ink-horn-l"></div><div class="ink-horn ink-horn-r"></div>' : ''}
      ${stage >= 3 ? '<div class="ink-aura"></div>' : ''}`
  }
  if (species === 'whale') {
    return `<div class="whale-spout"><div class="spout-drop"></div></div>
      <div class="whale-tail"></div>
      <div class="whale-fin whale-fin-l"></div>
      <div class="whale-fin whale-fin-r"></div>
      <div class="whale-body body"></div>
      <div class="whale-belly"></div>
      ${stage >= 2 ? '<div class="whale-star">✦</div>' : ''}
      ${stage >= 4 ? '<div class="whale-ring"></div>' : ''}`
  }
  if (species === 'turtle') {
    return `<div class="turtle-leg turtle-leg-1"></div>
      <div class="turtle-leg turtle-leg-2"></div>
      <div class="turtle-leg turtle-leg-3"></div>
      <div class="turtle-leg turtle-leg-4"></div>
      <div class="turtle-tail"></div>
      <div class="turtle-shell"></div>
      <div class="turtle-gear"><div class="gear-core"></div></div>
      <div class="turtle-head"></div>
      ${stage >= 2 ? '<div class="turtle-antenna"><div class="antenna-dot"></div></div>' : ''}`
  }
  return `<div class="fox-tail fox-tail-1"></div>
    ${stage >= 2 ? '<div class="fox-tail fox-tail-2"></div>' : ''}
    ${stage >= 4 ? '<div class="fox-tail fox-tail-3"></div>' : ''}
    <div class="fox-ear fox-ear-l"></div>
    <div class="fox-ear fox-ear-r"></div>
    <div class="fox-body body"></div>
    <div class="fox-muzzle"></div>
    ${stage >= 3 ? '<div class="fox-ember">✦</div>' : ''}`
}

function card(species, stageIndex, branchKey) {
  let stage = species.stages[stageIndex]
  if (branchKey && species.branches) {
    const branch = species.branches.filter((b) => b.key === branchKey)[0]
    if (branch) stage = Object.assign({}, stage, branch)
  }
  return `<div class="card">
    <div class="stage-label">${species.name} · ${stage.name}</div>
    <div class="pet-wrap" style="width:220px;height:220px;">
      <div class="pet-scale">
        <div class="pet species-${species.id} stage-${stageIndex} branch-${branchKey || ''}" style="--pc:${stage.color};--pa:${stage.accent};">
          <div class="pet-shadow"></div>
          ${petBody(species.id, stageIndex)}
          ${face(species.id, true)}
          ${branchKey ? '<div class="branch-mark">' + (branchKey === 'a' ? '◆' : '✧') + '</div>' : ''}
        </div>
      </div>
    </div>
    <div class="level">Lv.${stageIndex === 0 ? 1 : stage.level}${branchKey ? ' · 分支 ' + branchKey.toUpperCase() : ''}</div>
  </div>`
}

const rows = []
rows.push('<h2>初始形态（Lv.1）</h2><div class="grid">')
pets.list.forEach((sp) => rows.push(card(sp, 0)))
rows.push('</div><h2>最终分支 A（Lv.12）</h2><div class="grid">')
pets.list.forEach((sp) => rows.push(card(sp, 4, 'a')))
rows.push('</div><h2>最终分支 B（Lv.12）</h2><div class="grid">')
pets.list.forEach((sp) => rows.push(card(sp, 4, 'b')))
rows.push('</div>')

const html = `<!DOCTYPE html>
<html lang="zh-CN"><head><meta charset="utf-8">
<title>伙伴造型预览</title>
<style>
body { margin:0; padding:24px; background:#FFF7E8; color:#3B2E2A; font-family:"Microsoft YaHei",sans-serif; }
* { box-sizing:border-box; }
h2 { font-size:18px; margin:16px 0 10px; }
.grid { display:flex; gap:14px; }
.card { width:236px; padding:12px 8px 10px; background:#FFFDF7; border:3px solid #3B2E2A; border-radius:18px; box-shadow:0 6px 0 rgba(59,46,42,.15); text-align:center; }
.stage-label { font-size:14px; font-weight:700; margin-bottom:2px; }
.level { font-size:12px; color:#9A8A78; }
${css}
</style></head><body>
${rows.join('\n')}
</body></html>`

const out = path.join(ROOT, 'docs', '伙伴造型预览.html')
fs.writeFileSync(out, html, 'utf8')
console.log('已生成 ' + out)
