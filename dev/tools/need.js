// 找出还没有预合成语音的候选文本：node need.js index.html > need.json
const {JSDOM}=require('jsdom');const fs=require('fs');
const file=process.argv[2]||'index.html';
const d=new JSDOM(fs.readFileSync(file,'utf8'),{runScripts:'dangerously',url:'http://localhost/'});
setTimeout(()=>{const D=d.window.DATA,out=new Set(),skip=new Set(['tts','wtts','lem','audio','rt','gl','sf','lq','lqzh','cz','rdp','rdpzh','extr','qz','ox','expl']);
 const have=new Set(Object.keys(D.tts).concat(Object.keys(D.wtts||{})));
 const bad=/[=→，状态做好形含义结尾；：。、（）]/;
 function add(t){t=String(t).replace(/\s+/g,' ').trim();if(t.length<2||t.length>90||!/[぀-ヿ]/.test(t)||/[=→，状态做好形含义结尾；]/.test(t))return;out.add(t);}
 function walk(v,dep){if(dep>7)return;if(typeof v==='string'){v.split(/[／\n]/).forEach(x=>{const m=x.trim().replace(/^[男女ＭＦMF]\s*[:：]\s*/,'');if(m&&!/[一-鿿]{4,}[的了是]/.test(m))add(m);});}else if(Array.isArray(v))v.forEach(x=>walk(x,dep+1));else if(v&&typeof v==='object')Object.keys(v).forEach(k=>{if(!skip.has(k))walk(v[k],dep+1)});}
 Object.keys(D).forEach(k=>{if(!skip.has(k))walk(D[k],0)});
 // 真题填空还原句
 (D.orig||[]).forEach(o=>{if(o.q&&o.o)add(String(o.q).replace('（　）',o.o[o.a]).replace(/\n/g,'').replace(/[【】]/g,''));});
 const SIMP=/[这为说时还没与让给将从发现动后开关买点样种经习书车门问话们个么吗吧见觉两头兴爱实应总产业东乐仅众优伤传价务厂历县参双变听员图团场坏块声处备奖妈宝对导层岁带师广张强归当忆战户断显术杂极构检残毕汉汤爷独猫电画异疗盖监确礼离称稳类纪纳线组细织终结绝络绍续综罢职联脑舍虽设认议许论证评译试诗该详语误请读谁谈调谢负败贤质购贯费资赛赶迁连进远选递逻郑酿钟钱铁铺银锋长闭闪间闹队阶际陈险随难领频题颜风飞饭饮饱馆马驾验鱼鸟鸡黑也]|同类|搭配|用于|不可/;
 const hira=t=>(t.match(/[\u3040-\u309f]/g)||[]).length/t.length;
 const need=[...out].filter(t=>!have.has(t)&&(t.length>=7||/。/.test(t))&&!/[「」（）＋]/.test(t)&&!SIMP.test(t)&&hira(t)>=0.25).map(t=>t.replace(/^\d+\s+/,'')).filter((t,i,a)=>a.indexOf(t)===i&&!have.has(t));
 console.log(JSON.stringify({have:have.size,cand:out.size,need}));process.exit(0)},500);
