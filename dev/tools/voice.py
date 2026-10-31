"""增量补合成神经语音（和现有声音相同：Kokoro jf_gongitsune）。
用法（在仓库根目录）：
  node dev/tools/need.js index.html > /tmp/need.json          # 找出还没有语音的句子/词
  python3 dev/tools/voice.py --need /tmp/need.json            # 合成缺的句子
  python3 dev/tools/voice.py --missing missing.json           # 合成 App 里“缺语音清单”里的词句
  python3 dev/tools/voice.py --scripts                        # 为听力/阅读原文里的词补合成
然后 python3 dev/build.py 重新打包并推送。已经合成过的不会重做。
需要：pip install kokoro-onnx misaki[ja] fugashi unidic-lite numpy；ffmpeg；
模型文件放在 $KOKORO_DIR（kokoro-v1.0.onnx、voices-v1.0.bin，见 kokoro-onnx 的 release）。"""
import argparse, hashlib, json, os, re, subprocess, sys, wave, pathlib
import numpy as np
root = pathlib.Path(__file__).resolve().parents[2]; man_p = root/'dev/tools/manifest.json'
man = json.loads(man_p.read_text()) if man_p.exists() else {'tts':{}, 'wtts':{}}
ap = argparse.ArgumentParser(); ap.add_argument('--need'); ap.add_argument('--missing'); ap.add_argument('--scripts', action='store_true'); ap.add_argument('--limit', type=int, default=10**9)
a = ap.parse_args()
KD = os.environ.get('KOKORO_DIR', '/tmp/ttsm')
from kokoro_onnx import Kokoro
from misaki import ja
k = Kokoro(KD+'/kokoro-v1.0.onnx', KD+'/voices-v1.0.bin'); g2p = ja.JAG2P()
def known():
    # 已经在 App 里有语音的文本（从当前 index.html 读出）
    out = subprocess.run(['node', '-e', """const {JSDOM}=require('jsdom');const fs=require('fs');
const d=new JSDOM(fs.readFileSync('%s/index.html','utf8'),{runScripts:'dangerously',url:'http://localhost/'});
setTimeout(()=>{const D=d.window.DATA;console.log(JSON.stringify({tts:Object.keys(D.tts),wtts:Object.keys(D.wtts||{})}));process.exit(0)},500)""" % root], capture_output=True, text=True, cwd=root/'dev/tools').stdout
    return json.loads(out.strip().splitlines()[-1])
kn = known(); have_t = set(kn['tts']); have_w = set(kn['wtts'])
def synth(text, speed, key):
    clean = re.sub(r'\s+', '、', text.replace('／', '。').replace('「', '、').replace('」', '、').replace('（', '、').replace('）', '、').strip())
    ph = g2p(clean); ph = ph[0] if isinstance(ph, tuple) else ph
    s, sr = k.create(ph[:500], voice='jf_gongitsune', speed=speed, lang='ja', is_phonemes=True)
    h = hashlib.md5(key.encode()).hexdigest()[:10]; f = 'tts/%s.mp3' % h; wav = '/tmp/_v_%s.wav' % h
    w = wave.open(wav, 'wb'); w.setnchannels(1); w.setsampwidth(2); w.setframerate(sr); w.writeframes((np.clip(s, -1, 1)*32767).astype(np.int16).tobytes()); w.close()
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-ar', '24000', '-ac', '1', '-b:a', '48k', str(root/f)], check=True); os.remove(wav)
    return f
sent, words = [], {}
if a.need: sent += json.load(open(a.need))['need'] if isinstance(json.load(open(a.need)), dict) else json.load(open(a.need))
if a.missing:
    for t in json.load(open(a.missing)):
        (words.__setitem__(t, t) if len(t) <= 6 else sent.append(t))
if a.scripts:
    from fugashi import Tagger
    tg = Tagger(); kan = re.compile(r'[一-鿿々]')
    hira = lambda x: ''.join(chr(ord(c)-0x60) if 'ァ' <= c <= 'ヶ' else c for c in x)
    txt = subprocess.run(['node', '-e', """const {JSDOM}=require('jsdom');const fs=require('fs');
const d=new JSDOM(fs.readFileSync('%s/index.html','utf8'),{runScripts:'dangerously',url:'http://localhost/'});
setTimeout(()=>{const D=d.window.DATA;console.log(JSON.stringify((D.lq||[]).map(x=>x.s).concat(Object.values(D.rdp||{}))));process.exit(0)},500)""" % root], capture_output=True, text=True, cwd=root/'dev/tools').stdout
    for t in json.loads(txt.strip().splitlines()[-1]):
        t = re.sub(r'\s+', ' ', re.sub(r'([^\x00-\x7f])\s+(?=[^\x00-\x7f])', r'\1', t))
        for tk in tg(t):
            if kan.search(tk.surface):
                words.setdefault(tk.surface, hira(getattr(tk.feature, 'kana', None) or tk.surface))
n = 0
for t in dict.fromkeys(sent):
    if t in have_t or t in man['tts'] or n >= a.limit: continue
    man['tts'][t] = synth(t, 0.95, t); n += 1
    if n % 50 == 0: man_p.write_text(json.dumps(man, ensure_ascii=False)); print('句子', n, flush=True)
for w, r in words.items():
    if w in have_w or w in have_t or w in man['wtts'] or n >= a.limit: continue
    try: man['wtts'][w] = synth(r, 1.12, 'w:'+w); n += 1
    except Exception as e: print('跳过', w, e)
    if n % 100 == 0: man_p.write_text(json.dumps(man, ensure_ascii=False)); print('词', n, flush=True)
man_p.write_text(json.dumps(man, ensure_ascii=False))
(root/'dev/src/data_n.js').write_text("(function(){DATA.tts=Object.assign(DATA.tts||{},%s);DATA.wtts=Object.assign(DATA.wtts||{},%s);})();\n" % (json.dumps(man['tts'], ensure_ascii=False), json.dumps(man['wtts'], ensure_ascii=False)))
print('完成，新增', n, '条。请运行 python3 dev/build.py')
