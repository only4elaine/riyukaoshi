"""把 dev/src 打包成根目录的 index.html（用法：python3 dev/build.py）"""
import json, pathlib, time
here = pathlib.Path(__file__).resolve().parent; s = here/'src'; o = here.parent
files = ['data_a.js','data_b.js','data_c.js','data_f.js','data_d.js','data_e.js','data_g.js','data_h.js','data_i.js','data_j.js','data_k.js','data_l.js','data_lessons.js','data_m.js','data_n.js']
data = ''.join((s/f).read_text() for f in files if (s/f).exists())
t = (s/'template.html').read_text()
t = t.replace('/*CSS*/', (s/'style.css').read_text()).replace('/*DATA*/', data).replace('/*APP*/', (s/'app.js').read_text())
t = t.replace('BUILDID', time.strftime('%m%d-%H%M'))
(o/'index.html').write_text(t)
print('built', len(t))
