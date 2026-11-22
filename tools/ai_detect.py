# -*- coding: utf-8 -*-
"""词灵岛 源代码-全量.txt 离线自检：溯源 / AI 痕迹 / 重复度 / 提交版合规。
运行：python tools/ai_detect.py
只读取文件，不修改任何源码。
"""
import os, re, json, collections, difflib, itertools

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SRC = os.path.join(ROOT, 'docs', '源代码-全量.txt')
SUBMIT = os.path.join(ROOT, 'docs', '源代码-软著提交版.html')
SKIP_DIRS = {'node_modules', '.git', 'docs', 'tools'}
EXTS = {'.js', '.json', '.wxml', '.wxss'}
OMIT = {'data/cet4-full.js', 'data/cet6-full.js'}
SOFTWARE = '词灵岛四六级英语学习软件'
VERSION = 'V1.0.0'

# ---------- 复刻 export-source.js 的折行逻辑 ----------
def dw(ch):
    return 2 if ord(ch) > 0x2e80 else 1

def wrap(line, maxw=86):
    if not line:
        return ['']
    out, cur, w = [], '', 0
    for ch in line:
        c = dw(ch)
        if w + c > maxw:
            out.append(cur)
            cur, w = ch, c
        else:
            cur += ch
            w += c
    if cur:
        out.append(cur)
    return out

def walk_files():
    out = []
    def rec(d, rel=''):
        for name in sorted(os.listdir(d)):
            full = os.path.join(d, name)
            r = (rel + '/' + name) if rel else name
            if os.path.isdir(full):
                if name not in SKIP_DIRS:
                    rec(full, r)
            elif os.path.splitext(name)[1] in EXTS:
                if r not in OMIT:
                    out.append((r, full))
    rec(ROOT)
    return out

def expected_lines():
    lines = []
    for rel, full in walk_files():
        lines += ['/* ============================================================',
                  ' * 文件：' + rel,
                  ' * 软件：' + SOFTWARE + ' ' + VERSION,
                  ' * ============================================================ */']
        content = open(full, encoding='utf-8').read().replace('\r\n', '\n')
        lines += content.split('\n')
        lines.append('')
    out = []
    for l in lines:
        out += wrap(l)
    return out

# ---------- 读取被检文件 ----------
doc = open(SRC, encoding='utf-8').read().split('\n')
if doc and doc[-1] == '':
    doc.pop()
exp = expected_lines()

print('=' * 62)
print('一、真实性溯源（复刻导出管线逐行重建）')
print('=' * 62)
print('被检文件行数      :', len(doc))
print('重建期望行数      :', len(exp))
same = sum(1 for a, b in itertools.zip_longest(doc, exp) if a == b)
print('逐行完全一致      : %d / %d  (%.2f%%)' % (same, max(len(doc), len(exp)),
      100.0 * same / max(len(doc), len(exp))))
first_bad = next((i for i, (a, b) in enumerate(itertools.zip_longest(doc, exp)) if a != b), None)
print('首个不一致位置    :', first_bad if first_bad is not None else '无')
if first_bad is not None:
    print('   实际:', repr(doc[first_bad][:90]) if first_bad < len(doc) else '<文件结束>')
    e = exp[first_bad] if first_bad < len(exp) else '<缺失>'
    print('   期望:', repr(e[:90]))

# 分段
seg_starts = [i for i, l in enumerate(doc) if l.startswith('/* ====') and
              i + 1 < len(doc) and doc[i + 1].startswith(' * 文件：')]
segments = []
for k, s in enumerate(seg_starts):
    e = seg_starts[k + 1] if k + 1 < len(seg_starts) else len(doc)
    name = doc[s + 1].replace(' * 文件：', '').strip()
    segments.append((name, s, e))
print('文件分段数        :', len(segments), '（导出脚本声明 %d 个源文件）' % len(walk_files()))
ext_cnt = collections.Counter(os.path.splitext(n)[1] for n, _, _ in segments)
print('分段扩展名分布    :', dict(ext_cnt))

# ---------- 行构成 ----------
blank = [l for l in doc if not l.strip()]
comment = [l for l in doc if l.strip() and (
    l.strip().startswith('//') or l.strip().startswith('/*') or
    l.strip().startswith('*') or l.strip().startswith('<!--'))]
code = [l for l in doc if l.strip() and l not in comment]
print()
print('=' * 62)
print('二、行构成与注释指标（AI 痕迹主证）')
print('=' * 62)
print('总行 %d | 空行 %d (%.1f%%) | 整行注释 %d (%.1f%%) | 其他行 %d' % (
    len(doc), len(blank), 100.0 * len(blank) / len(doc),
    len(comment), 100.0 * len(comment) / len(doc), len(code)))
hdr = sum(1 for l in doc if l.startswith(' * 文件：') or l.startswith(' * 软件：'))
sep = sum(1 for l in doc if re.match(r'^/\* [-=]{4,}', l))
section = sum(1 for l in doc if re.match(r'^/\* -{4,}.*-{4,} \*/', l))
jsdoc = sum(1 for l in doc if l.strip().startswith('/**'))
inline = sum(1 for l in doc if re.search(r'\S+\s+// ', l) and not l.strip().startswith('//'))
print('文件头模板行      :', hdr, '（%d 个文件 × 4 行块）' % len(segments))
print('长等号分隔注释    :', sep, ' | 节标题 /* ---- xxx ---- */ :', section)
print('JSDoc /** 块起始  :', jsdoc, ' | 行尾注释行 :', inline)

# 中文注释
zh_comment = [l for l in comment if re.search(r'[\u4e00-\u9fa5]', l)]
print('含中文的注释行    : %d / %d (%.1f%%)' % (len(zh_comment), len(comment),
      100.0 * len(zh_comment) / max(1, len(comment))))

# AI 套话 / 模板措辞
AI_WORDS = ['旨在', '赋能', '一站式', '高效', '便捷', '智能化', '优雅', '简洁',
            '稳健', '合理', '统一', '确保', '避免', '便于', '自动', '根据',
            '返回', '用于', '初始化', '获取', '处理', '计算', '判断', '刷新',
            '维护', '兼容', '默认值', '异常', '失败', '状态', '数据', '当前']
cnt = collections.Counter()
for l in zh_comment:
    for w in AI_WORDS:
        if w in l:
            cnt[w] += 1
print('注释高频模板词    :', cnt.most_common(12))

# 注释是否「解释显而易见」
trivial = re.compile(r'(返回|获取|设置|初始化|处理|计算|判断|渲染|刷新|根据).{0,12}(描述|结果|列表|状态|数据|值|信息|进度|内容)$')
triv = [l for l in zh_comment if trivial.search(l.strip(' /*'))]
print('「解释显而易见」型注释:', len(triv), '例:', [x.strip()[:34] for x in triv[:4]])

# ---------- 代码结构 ----------
print()
print('=' * 62)
print('三、代码结构与命名指标')
print('=' * 62)
all_src = '\n'.join(doc)
funcs = re.findall(r'^\s*(?:async\s+)?function\s+([A-Za-z_$][\w$]*)\s*\(', all_src, re.M)
arrow = len(re.findall(r'=>\s*\{', all_src))
page_obj = len(re.findall(r'^\s*Page\(\{', all_src, re.M))
comp_obj = len(re.findall(r'^\s*Component\(\{', all_src, re.M))
setdata = len(re.findall(r'\bsetData\s*\(', all_src))
try_c = len(re.findall(r'\btry\s*\{', all_src))
catch_c = len(re.findall(r'\bcatch\s*\(', all_src))
console_c = len(re.findall(r'\bconsole\.(log|warn|error|info)\s*\(', all_src))
dvor = len(re.findall(r'\|\|', all_src))
todo = len(re.findall(r'\b(TODO|FIXME|XXX|HACK|DEBUG)\b', all_src))
print('function 定义      :', len(funcs), ' 去重:', len(set(funcs)))
print('箭头函数块         :', arrow, ' | Page():', page_obj, ' Component():', comp_obj, ' setData:', setdata)
print('try / catch        :', try_c, '/', catch_c, ' | console.*:', console_c, ' | || 默认值:', dvor)
print('TODO/FIXME/DEBUG   :', todo)
print('示例函数名         :', funcs[:18])

# 标识符
ids = re.findall(r'\b[A-Za-z_$][A-Za-z0-9_$]{2,}\b', all_src)
uniq = set(ids)
pinyin = re.compile(r'^(zao|lidao|chutu|gaishu|fugai|cun\w+|jl|qian|zai|shuchu|baocun|daoru|daochu)$')
py = [x for x in uniq if pinyin.match(x)]
short = [x for x in uniq if len(x) <= 2]
print('唯一标识符         :', len(uniq), ' | 拼音缩写类:', len(py), py[:8], ' | 单/双字母:', len(short))
print('平均标识符长度     : %.1f' % (sum(len(x) for x in uniq) / max(1, len(uniq))))

# 中文 UI 串 / 颜色 / 版本
zh_str = re.findall(r"'([^'\n]*[\u4e00-\u9fa5][^'\n]*)'|\"([^\"\n]*[\u4e00-\u9fa5][^\"\n]*)\"", all_src)
zh_str = [a or b for a, b in zh_str]
colors = set(re.findall(r'#[0-9A-Fa-f]{6}\b', all_src))
print('中文字符串常量     :', len(zh_str), ' | 十六进制颜色值:', len(colors))
print('版本号出现 V1.0.0  :', all_src.count('V1.0.0'), " '1.0.0':", all_src.count("'1.0.0'"))

# 敏感信息
SENS = re.compile(r'(appid|AppID|secret|Secret|privateKey|private_key|api[_-]?key|token|password|pwd|mch|证书|密钥)', re.I)
sens = [(i + 1, l.strip()[:100]) for i, l in enumerate(doc) if SENS.search(l)]
print('疑似敏感配置行     :', len(sens))
for i, l in sens[:6]:
    print('   L%-6d %s' % (i, l))

# ---------- 重复度 ----------
print()
print('=' * 62)
print('四、内部重复度')
print('=' * 62)
def norm(s):
    return re.sub(r'\s+', ' ', s).strip()
nl = [norm(l) for l in doc]
for N in (5, 8, 12):
    win = collections.defaultdict(list)
    for i in range(len(nl) - N + 1):
        w = tuple(nl[i:i + N])
        if sum(1 for x in w if len(x) >= 8) >= 3:
            win[w].append(i)
    dup = {k: v for k, v in win.items() if len(v) > 1}
    hit = sum(len(v) for v in dup.values())
    print('N=%-2d 合格窗口 %5d | 重复窗口组 %4d | 涉及行次 %5d (%.2f%%) | 最长重复块起点 %s' % (
        N, sum(1 for w in win), len(dup), hit, 100.0 * hit / max(1, len(nl) - N + 1),
        max(dup.items(), key=lambda kv: len(kv[1]))[1][:3] if dup else '-'))

# 最长连续完全相同行块（相邻重复段）
best, run, at = 0, 0, 0
for i in range(1, len(nl)):
    if nl[i] == nl[i - 1] and len(nl[i]) >= 10:
        run += 1
        if run > best:
            best, at = run, i - run
    else:
        run = 0
print('最长连续相同单行重复:', best, '次')

# ---------- 提交版合规 ----------
print()
print('=' * 62)
print('五、软著提交版 HTML 合规')
print('=' * 62)
if os.path.exists(SUBMIT):
    h = open(SUBMIT, encoding='utf-8').read()
    pages = re.findall(r'<div class="page">(.*?)</div>\s*(?=<div class="page">|</body>)', h, re.S)
    print('page 块数          :', h.count('<div class="page">'))
    pres = re.findall(r'<pre>(.*?)</pre>', h, re.S)
    print('pre 块数           :', len(pres))
    if pres:
        counts = [len(p.split('\n')) for p in pres]
        print('每页行数           : 首 %d / 末 %d / 最小 %d / 最大 %d' % (
            counts[0], counts[-1], min(counts), max(counts)))
        allp = '\n'.join(pres)
        import html as htmlmod
        allp = htmlmod.unescape(allp)
        pl = allp.split('\n')
        b = sum(1 for x in pl if not x.strip())
        c = sum(1 for x in pl if x.strip() and (x.strip().startswith('//') or
                x.strip().startswith('/*') or x.strip().startswith('*') or
                x.strip().startswith('<!--')))
        print('提交版总行 %d | 空行 %d (%.1f%%) | 注释行 %d (%.1f%%) | 有效代码行 %d (%.1f%%)' % (
            len(pl), b, 100.0 * b / len(pl), c, 100.0 * c / len(pl),
            len(pl) - b - c, 100.0 * (len(pl) - b - c) / len(pl)))
    print('页眉含软件名+版本  :', SOFTWARE in h and VERSION in h)
    print('含「中间部分略」标记:', '中间部分源代码略' in h)
    print('末页尾部 3 行      :', [x[:70] for x in pres[-1].split('\n')[-3:]] if pres else '-')
else:
    print('未找到提交版 HTML')

# ---------- 词库 / 第三方数据 ----------
print()
print('=' * 62)
print('六、第三方词库与许可证线索')
print('=' * 62)
for f in ['data/cet4-full.js', 'data/cet6-full.js', 'data/words.js']:
    p = os.path.join(ROOT, f)
    if os.path.exists(p):
        t = open(p, encoding='utf-8').read()
        head = '\n'.join(t.splitlines()[:6])
        print('%-22s %7d 字节 | 头部: %s' % (f, os.path.getsize(p),
              ' / '.join(x.strip() for x in head.splitlines() if x.strip())[:150]))
print('GPL 提及（全项目 js/md）:', sum(
    1 for dp, ds, fs in os.walk(ROOT) for fn in fs
    if fn.endswith(('.js', '.md')) and 'GPL' in open(os.path.join(dp, fn), encoding='utf-8', errors='ignore').read()))
print()
print('=' * 62)
print('检测完成（离线部分）')
print('=' * 62)
