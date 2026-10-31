# 开发说明
- 源码在 `dev/src/`，打包：`python3 dev/build.py`（生成根目录 index.html，页脚版本号自动更新）。
- 补语音：见 `dev/tools/voice.py` 开头的说明。以后补充新真题/新句子后：
  1. `node dev/tools/need.js index.html > /tmp/need.json`
  2. `python3 dev/tools/voice.py --need /tmp/need.json --scripts`
  3. `python3 dev/build.py`，提交并推送。
- App 里“设置 → 复制缺语音的词句清单”可导出你实际点过却没有语音的词句，用 `--missing` 补合成。
