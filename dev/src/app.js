(function(){
'use strict';
var KEY='n2app_v1', INT=[0,1,2,4,7,15], NEW_PER_DAY=15;
/* ===== FSRS-5（默认参数）间隔重复 ===== */
var FW=[0.4072,1.1829,3.1262,15.4722,7.2102,0.5316,1.0651,0.0234,1.616,0.1544,1.0824,1.9813,0.0953,0.2975,2.2042,0.2407,2.9466,0.5034,0.6567],FF=19/81,FC=-0.5;
function fsD0(g){return Math.min(10,Math.max(1,FW[4]-Math.exp(FW[5]*(g-1))+1));}
function fsBox(sb){return sb>=15?5:sb>=8?4:sb>=4?3:sb>=2?2:1;}
function fsrs(o,ok,t){
 var g=ok?3:1,days=Math.ceil((new Date(S.exam+'T00:00:00')-new Date())/86400000);
 if(!o.sb){
  if(o.box>0&&o.due!=null){o.sb=Math.max(1,INT[Math.min(o.box,INT.length-1)]);o.df=5.3;o.lr=o.due-o.sb;}}
 if(!o.sb){o.sb=FW[g-1];o.df=fsD0(g);}
 else{
  var el=Math.max(0,t-(o.lr==null?t:o.lr)),R=Math.pow(1+FF*el/o.sb,FC),D=o.df||5.3,Sn;
  D=D+(-FW[6]*(g-3))*(10-D)/9;D=Math.min(10,Math.max(1,FW[7]*fsD0(4)+(1-FW[7])*D));
  if(ok)Sn=o.sb*(Math.exp(FW[8])*(11-D)*Math.pow(o.sb,-FW[9])*(Math.exp(FW[10]*(1-R))-1)+1);
  else Sn=Math.min(o.sb,FW[11]*Math.pow(D,-FW[12])*(Math.pow(o.sb+1,FW[13])-1)*Math.exp(FW[14]*(1-R)));
  o.sb=Math.max(0.1,Sn);o.df=D;}
 var r=days<=14?0.95:0.9,iv=Math.max(1,Math.round(o.sb/FF*(Math.pow(r,1/FC)-1)));
 if(days>2)iv=Math.min(iv,days-1);
 o.lr=t;o.due=t+(ok?iv:1);o.box=ok?fsBox(o.sb):0;return o;}

var S;
function load(){try{S=JSON.parse(localStorage.getItem(KEY));}catch(e){S=null;}
 if(!S)S={cards:{},wrong:{},log:{},exam:'2026-12-06'};S.stat=S.stat||{};if(!S.rateV2){S.rate=1.0;S.rateV2=1;}S.rate=S.rate||1.0;S.q=S.q||{};S.plan=S.plan||null;
 S.cards=S.cards||{};S.wrong=S.wrong||{};S.log=S.log||{};S.exam=S.exam||'2026-12-06';}
function save(){try{localStorage.setItem(KEY,JSON.stringify(S));}catch(e){}}
function dayNum(){var d=new Date();return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000);}
function $(s,r){return (r||document).querySelector(s);}
function esc(s){return String(s==null?'':s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c];});}
function shuffle(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1));var t=a[i];a[i]=a[j];a[j]=t;}return a;}
function tdState(){var t=dayNum();if(!S.td||S.td.day!==t)S.td={day:t,f:{},clips:null,sb:null};return S.td;}
function flag(k){tdState().f[k]=1;save();}
function isF(k){return !!tdState().f[k];}
function runOf(L,ok,t){var d=t,n=0;if(!ok(L[d]))d=t-1;while(ok(L[d])){n++;d--;}return n;}
function streakInfo(){var L=S.log||{},P=S.perfect||{},t=dayNum(),i;
 var ok=function(v){return (v||0)>=1;},n=runOf(L,ok,t),pn=runOf(P,function(v){return !!v;},t);
 var ks=Object.keys(L).map(Number).filter(function(k){return L[k]>=1;}).sort(function(a,b){return a-b;}),best=0,run=0,prev=null;
 ks.forEach(function(k){run=(prev!==null&&k===prev+1)?run+1:1;if(run>best)best=run;prev=k;});
 var pd=Object.keys(P).filter(function(k){return P[k];}).length,xp=pd*50,bx=0;for(i in L)xp+=L[i]*10;for(i in (S.bonus||{}))bx+=S.bonus[i];xp+=bx;
 var lv=1;while(xp>=50*lv*(lv+1))lv++;
 return {bx:bx,n:n,pn:pn,pd:pd,best:best,days:ks.length,xp:xp,lv:lv,lo:50*(lv-1)*lv,hi:50*lv*(lv+1)};}
var LVN=['见习','初学','入门','渐入佳境','稳扎稳打','N3 选手','N2 冲刺手','N2 熟手','考场老手','合格圈','N2 达人'];

var LVE=['🌱','🌿','🍀','🌸','🌼','🍒','🍓','🍑','🍇','🏆','👑'];
function badgeCtx(){var si=streakInfo(),T=0,i;for(i in S.log)T+=S.log[i];return {si:si,T:T,vb:vbList().length,au:Object.keys(S.aulog||{}).length,kw:(S.kc&&S.kc.wrong)||0,kv:(S.kc&&S.kc.vb)||0};}
var BADGES=[
 {id:'d1',e:'🌱',n:'第一次打卡',t:'完成第一次学习',f:function(c){return c.si.days>=1;}},
 {id:'s3',e:'🔥',n:'三天连胜',t:'连续打卡 3 天',f:function(c){return c.si.best>=3;}},
 {id:'s7',e:'🌶️',n:'一周连胜',t:'连续打卡 7 天',f:function(c){return c.si.best>=7;}},
 {id:'s14',e:'🌋',n:'两周连胜',t:'连续打卡 14 天',f:function(c){return c.si.best>=14;}},
 {id:'s30',e:'☄️',n:'三十天连胜',t:'连续打卡 30 天',f:function(c){return c.si.best>=30;}},
 {id:'p1',e:'⭐',n:'完美一天',t:'第一次完成全部今日任务',f:function(c){return c.si.pd>=1;}},
 {id:'p7',e:'🌟',n:'完美一周',t:'累计 7 个完美日',f:function(c){return c.si.pd>=7;}},
 {id:'p20',e:'💫',n:'完美达人',t:'累计 20 个完美日',f:function(c){return c.si.pd>=20;}},
 {id:'t100',e:'🍪',n:'百题',t:'累计答题 100',f:function(c){return c.T>=100;}},
 {id:'t500',e:'🍰',n:'五百题',t:'累计答题 500',f:function(c){return c.T>=500;}},
 {id:'t1000',e:'🎂',n:'千题',t:'累计答题 1000',f:function(c){return c.T>=1000;}},
 {id:'w30',e:'🍓',n:'错题克星',t:'复习错题 30 次',f:function(c){return c.kw>=30;}},
 {id:'w100',e:'🍒',n:'错题终结者',t:'复习错题 100 次',f:function(c){return c.kw>=100;}},
 {id:'v10',e:'🍯',n:'小蜜罐',t:'生词本收藏 10 个词',f:function(c){return c.vb>=10;}},
 {id:'v50',e:'🐝',n:'词汇蜂巢',t:'生词本收藏 50 个词',f:function(c){return c.vb>=50;}},
 {id:'vr50',e:'🧸',n:'生词常客',t:'复习生词 50 次',f:function(c){return c.kv>=50;}},
 {id:'a30',e:'🎧',n:'耳朵开挂',t:'听完 30 道真题录音',f:function(c){return c.au>=30;}},
 {id:'a100',e:'🎼',n:'听力高手',t:'听完 100 道真题录音',f:function(c){return c.au>=100;}},
 {id:'b200',e:'🎁',n:'加分狂人',t:'额外加分累计 200 XP',f:function(c){return c.si.bx>=200;}}
];
function checkBadges(quiet){try{S.badges=S.badges||{};var c=badgeCtx(),t=dayNum(),nw=[],i;
 BADGES.forEach(function(b){if(!S.badges[b.id]&&b.f(c)){S.badges[b.id]=t;nw.push(b);}});
 for(i=2;i<=c.si.lv;i++){var id='lv'+i;if(!S.badges[id]){S.badges[id]=t;nw.push({e:LVE[Math.min(LVE.length-1,i-1)],n:'升到 Lv.'+i});}}
 if(nw.length){save();if(!quiet&&S.badges._init)vbToast((nw.length>1?'🏅 获得 '+nw.length+' 枚徽章：':'🏅 获得徽章：')+nw.map(function(b){return b.e+' '+b.n;}).join('、'));}
 if(!S.badges._init){S.badges._init=1;save();}}catch(e){}}
function badgesView(){checkBadges(true);var c=badgeCtx(),n=0;
 var h='<h1>🏅 我的徽章</h1><p class=note>做事得徽章：连胜、完美日、答题数、错题和生词复习、听力、额外加分，还有每升一级一枚。灰色的是还没解锁的。</p><div class=g3>';
 BADGES.forEach(function(b){var on=!!S.badges[b.id];if(on)n++;h+='<div class="bdg'+(on?' on':'')+'"><span class=be>'+(on?b.e:'🔒')+'</span><b>'+b.n+'</b><small>'+b.t+'</small></div>';});
 h+='</div><h2>等级</h2><div class=g3>';
 for(var i=1;i<=11;i++){var on2=c.si.lv>=i;h+='<div class="bdg'+(on2?' on':'')+'"><span class=be>'+(on2?LVE[i-1]:'🔒')+'</span><b>Lv.'+i+' '+LVN[i-1]+'</b><small>'+(50*(i-1)*i)+' XP</small></div>';}
 h+='</div><p><a class=btn href="#/home">回首页</a></p>';render(h.replace('我的徽章','我的徽章（'+n+'/'+BADGES.length+'）'));}
function checkPerfect(quiet){try{var t=dayNum();S.perfect=S.perfect||{};if(S.perfect[t])return;
 var TL=taskList();if(TL.length&&TL.every(function(x){return x.done;})){S.perfect[t]=1;save();
  if(!quiet){var si=streakInfo();vbToast('🌟 今日任务全部完成！+50 XP · 完美日连续 '+si.pn+' 天');}}}catch(e){}}
function bump(kind){var t=dayNum(),b=S.log[t]||0;S.log[t]=b+1;
 S.kc=S.kc||{};if(kind)S.kc[kind]=(S.kc[kind]||0)+1;
 if(S.perfect&&S.perfect[t]){var ex=(kind==='wrong'||kind==='vb')?15:10;S.bonus=S.bonus||{};S.bonus[t]=(S.bonus[t]||0)+ex;if(!S._bt||Date.now()-S._bt>4000){S._bt=Date.now();try{vbToast('🎁 额外加分 +'+(10+ex)+' XP');}catch(e){}}}
 if(b===0){setTimeout(function(){var si=streakInfo();vbToast('🔥 今日打卡成功！连胜 '+si.n+' 天'+([3,7,14,30,50,100].indexOf(si.n)>=0?' · 里程碑！':''));},300);}
 setTimeout(function(){checkPerfect(false);checkBadges(false);},900);}

// ---- decks
var DECKS={
 read:{name:'读音（错题）',list:DATA.readings,front:function(c){return c.w;},back:function(c){return '<div class=big>'+esc(c.r)+'</div>'+exHtml(c,c.ctx)+'<div class=note>'+esc(c.note)+'</div>';}},
 vocab:{name:'近义词・词汇',list:DATA.vocab,front:function(c){return c.w;},back:cardBack},
 lexp:{name:'听力表达（先背）',list:DATA.lexp,front:function(c){return c.expr;},back:function(c){return '<div class=big>'+esc(c.zh)+'</div><div class=ex>'+esc(c.line)+'</div>'+(c.lzh?'<div class=note>译：'+esc(c.lzh)+'</div>':'')+'<div class=note>'+(c.o?'📌 真题原句 · '+esc(c.srcx):'✏️ 示例句（非真题原句，是按常见用法编的）')+'</div>'+(c.opts?'<div class=note>原题选项：'+esc(c.opts)+'</div>'+(c.ozh?'<div class=note>译：'+esc(c.ozh)+'</div>':''):'')+'<div>✅ '+esc(c.right)+'</div>'+(c.trap?'<div class=note>⚠️ '+esc(c.trap)+'</div>':'')+(c.tip?'<div class=note>'+esc(c.tip)+'</div>':'');}},
 lwords:{name:'听力词汇',list:DATA.lwords,front:function(c){return c.w;},back:cardBack},
 gram:{name:'语法句型',list:DATA.gram,front:function(c){return c.w;},back:cardBack},
 keigo:{name:'敬语对照',list:DATA.keigo,front:function(c){return c.w;},back:cardBack},
 jita:{name:'自他动词',list:DATA.jita,front:function(c){return c.w;},back:cardBack}
};
function exTr(seg){var n=nz(seg),X=window.DATA&&DATA.extr;if(X&&X[n])return X[n];
 var O=window.DATA&&DATA.orig||[],i,o,f;for(i=0;i<O.length;i++){o=O[i];f=nz(o.q.replace('（　）',o.o[o.a]));if(f===n||(n.length>8&&(f.indexOf(n)>=0||n.indexOf(f)>=0&&f.length>8))){return (DATA.qz&&DATA.qz[o.id])||'';}}return '';}
function exHtml(c,src){var segs=String(src||'').split('／'),h='';segs.forEach(function(g){if(!g)return;var z=(segs.length===1&&c.ext)?c.ext:exTr(g);h+='<div class=ex>'+esc(g)+'</div>'+(z?'<div class=note>译：'+esc(z)+'</div>':'');});return h;}
function cardBack(c){return (c.r?'<div class=big>'+esc(c.r)+'</div>':'')+'<div>'+esc(c.zh)+'</div>'+(c.con?'<div class=note>接续：'+esc(c.con)+'</div>':'')+exHtml(c,c.ex)+(c.o&&c.ex?'<div class=note>📌 真题原句 · '+esc(c.srcx||c.src||'')+'</div>':'')+(c.note?'<div class=note>'+esc(c.note)+'</div>':'')+(c.my?'<div class=note>❌ '+esc(c.my)+'</div>':'');}
function gramHtml(id){var c=null;(DATA.gram||[]).forEach(function(g){if(g.oid===id)c=g;});if(!c)return '';return '<div class=noteb><b>📘 语法要点：'+esc(c.w)+'</b><br>'+esc(c.zh)+(c.con?'<br><span class=note>接续：'+esc(c.con)+'</span>':'')+(c.note?'<br><span class=note>'+esc(c.note)+'</span>':'')+'</div>';}
function deckStat(k){var d=DECKS[k],t=dayNum(),due=0,nw=0;
 d.list.forEach(function(c){var s=S.cards[k+':'+c.id];if(!s)nw++;else if(s.due<=t)due++;});
 return {due:due,nw:nw,total:d.list.length};}

// ---- quiz sets
function buildSets(){
 var sets={};
 sets.qRead={name:'读音测验',items:DATA.readings.map(function(r){
  var opts=shuffle([r.r].concat(r.ds));
  return {id:'qr_'+r.id,q:'「'+r.w+'」怎么读？\n'+r.ctx,o:opts,a:opts.indexOf(r.r),e:r.note,s:r.src};})};
 sets.sBuild={name:'造句・排序（真题）',items:DATA.sort.map(function(x){return {id:x.id,type:'build',zh:x.zh,tk:x.tk,x:[],pre:x.pre,post:x.post,s:x.src+' · '+x.s};})};
 sets.qOrig={name:'错题原题（词汇・语法）',items:DATA.orig.map(function(x){return {id:x.id,q:x.q,o:x.o,a:x.a,e:x.e,wx:DATA.ox[x.id],qz:DATA.qz&&DATA.qz[x.id],pk:x.pick-1,s:x.src+(x.sec?' · '+x.sec:'')+(x.pick?' · 你当时选了 '+x.pick:'')};})};
 sets.qReadComp={name:'错题原题（阅读理解）',items:DATA.rd.map(function(x){return {id:x.id,q:x.q,o:x.o,a:x.a,e:x.e,wx:x.wx,pk:x.pick-1,p:DATA.rdp[x.p],pz:window.DATA.rdpzh&&DATA.rdpzh[x.p],lz:window.DATA.rdqz&&DATA.rdqz[x.id],blank:x.blank,s:x.src+' · '+x.sec+(x.pick?' · 你当时选了 '+x.pick:'')};})};
 sets.qListenWrong={name:'错题原题（听力·配原录音）',items:(DATA.lq||[]).map(function(x){return {id:x.id,q:x.q,o:x.o,a:x.a,e:x.e,wx:x.wx,pk:x.pick?x.pick-1:-1,clip:x.f,hide:x.hide,sc:x.s,lz:window.DATA.lqzh&&DATA.lqzh[x.id],secn:x.secn,s:x.src+(x.pick?' · 你当时选了 '+x.pick:'')};})};
 
 
 sets.qGram={name:'语法填空（真题）',items:DATA.qGram.filter(function(x){return /^\d{4}\./.test(x.s||'');})};
 return sets;}
var SETS=buildSets();
function allItems(){var out=[];for(var k in SETS)SETS[k].items.forEach(function(it){out.push(it);});return out;}

// ---- TTS
var ttsTimer=null;
var jaVoice=null;
function pickVoice(){if(!window.speechSynthesis)return null;var vs=speechSynthesis.getVoices()||[];
 jaVoice=vs.filter(function(v){return /^ja/i.test(v.lang.replace('_','-'));})[0]||null;return jaVoice;}
if(window.speechSynthesis){pickVoice();speechSynthesis.onvoiceschanged=pickVoice;}
function ttsOK(){return !!window.speechSynthesis&&!!(jaVoice||pickVoice());}
function ttsWarn(){
 return '';
 if(ttsOK())return '';
 return '<div class=noteb>⚠️ 这台手机/浏览器没有可用的日语语音，所以听不到声音。<br>iPhone：请用 Safari 打开（不要在微信里打开），并在 设置→辅助功能→朗读内容→声音→日语 下载一个声音。<br>安卓：请用 Chrome，并在 系统设置→文字转语音 里安装日语语音数据。<br>装好后重新打开本页。有真题 mp3 的话，可以改用录音播放。</div>';}
var AUD=null;
function speak(txt,done){
 var fired=false;function fin(){if(fired)return;fired=true;if(done)done();}
 var f=window.DATA&&((DATA.tts&&DATA.tts[txt])||(DATA.wtts&&DATA.wtts[txt]));
 if(f){
  try{
   if(!AUD)AUD=new Audio();
   AUD.onended=fin;
   AUD.onerror=function(){browserSpeak(txt,fin);};
   cachedUrl(f,function(src){
    AUD.src=src;try{AUD.currentTime=0;}catch(e){}AUD.playbackRate=S.rate||1.0;AUD.defaultPlaybackRate=S.rate||1.0;try{AUD.preservesPitch=true;AUD.webkitPreservesPitch=true;}catch(e){}
    var pr=AUD.play();
    if(pr&&pr.catch)pr.catch(function(){browserSpeak(txt,fin);});});
   return;
  }catch(e){}
 }
 browserSpeak(txt,fin);}
function browserSpeak(txt,fin){
 try{if(txt&&String(txt).length<120){S.miss=S.miss||{};if(!S.miss[txt]&&Object.keys(S.miss).length<800){S.miss[txt]=1;save();}}}catch(e){}
 if(!window.speechSynthesis){fin();return;}
 var sp=speechSynthesis.speaking||speechSynthesis.pending;try{speechSynthesis.cancel();speechSynthesis.resume();}catch(e){}
 var u=new SpeechSynthesisUtterance(txt);u.lang='ja-JP';u.rate=(S.rate||1.0)*0.95;
 var v=jaVoice||pickVoice();if(v)u.voice=v;
 u.onend=fin;u.onerror=fin;
 setTimeout(fin,Math.max(3000,txt.length*450));
 if(sp)setTimeout(function(){try{speechSynthesis.speak(u);}catch(e){}},120);else speechSynthesis.speak(u);}
function speakSeq(arr,done){if(window.speechSynthesis)speechSynthesis.cancel();var i=0;
 (function next(){if(i>=arr.length){if(done)done();return;}
  var t=arr[i++];speak(t,function(){ttsTimer=setTimeout(next,700);});})();}
function stopTTS(){clearTimeout(ttsTimer);if(AUD){try{AUD.pause();}catch(e){}}if(window.speechSynthesis)speechSynthesis.cancel();}

// ---- views
function nav(){return '<nav><a href="#/home">🏡 首页</a><a href="#/audio">🎧 听力</a><a href="#" id=rate></a><a href="#/lessons">📖 课程</a><a href="#/wrong">🍓 错题本</a><a href="#/vb">🍯 生词本</a><a href="#/settings">🧸 设置</a></nav>';}
function render(h){stopTTS();app.innerHTML=nav()+'<main>'+h+'</main>';window.scrollTo(0,0);
 var r=document.getElementById('rate');if(r){r.textContent='🐢 '+(S.rate||1.0)+'×';r.onclick=function(e){e.preventDefault();var o=[0.6,0.8,1.0],i=(o.indexOf(S.rate||1.0)+1)%3;S.rate=o[i];save();r.textContent='🐢 '+S.rate+'×';};}}

function aheadN(){var t=dayNum();return S.ahead&&S.ahead.day===t?S.ahead.n:0;}
function bar(p,col){return '<div style="height:10px;background:rgba(120,110,100,.18);border-radius:6px;overflow:hidden;margin:4px 0 10px"><div style="height:10px;border-radius:6px;width:'+Math.max(0,Math.min(100,Math.round(p)))+'%;background:'+(col||'var(--ok)')+'"></div></div>';}
function globalProg(){
 var ps=planStats(),t=dayNum(),rows=[],stableQ=0;
 Object.keys(S.q).forEach(function(i){if(DAILY_IDS[i]&&S.q[i].box>=4)stableQ++;});
 rows.push({n:'真题错题原题（含听力错题、阅读）',a:ps.done,b:ps.total,s:stableQ,sn:'已稳定（间隔≥7天）'});
 var cl=0,cs=0,ct=0,cst=0;
 ['lexp','lwords','read','vocab','gram','keigo','jita'].forEach(function(k){if(!DECKS[k])return;var st=deckStat(k);ct+=st.total;cl+=st.total-st.nw;
  DECKS[k].list.forEach(function(c){var x=S.cards[k+':'+c.id];if(x&&x.box>=4)cst++;});});
 rows.push({n:'背诵卡片（表达·词汇·读音·语法·敬语·自他动词）',a:cl,b:ct,s:cst,sn:'已稳定'});
 var log=S.aulog||{},tot=0,hd=0;DATA.audio.forEach(function(p){p.clips.forEach(function(c){tot++;if(log[p.id+':'+c.k])hd++;});});
 rows.push({n:'听真题录音（已听）',a:hd,b:tot});
 var ls=DATA.lessons||[],lsd=ls.filter(function(x){return S.ls&&S.ls[x.id];}).length;
 rows.push({n:'引导型课程',a:lsd,b:ls.length});
 var deckDays=0;['lexp','lwords','read','vocab','gram','keigo','jita'].forEach(function(k){if(DECKS[k])deckDays=Math.max(deckDays,Math.ceil(deckStat(k).nw/NEW_PER_DAY));});
 var qDays=ps.quota?Math.ceil(ps.unseen.length/ps.quota):0,need=Math.max(deckDays,qDays);
 return {rows:rows,need:need,days:ps.days,ps:ps};}
function estMin(){var P=todayParts(),m=P.nw.length*0.8+P.due.length*0.5,t=0;
 ['lexp','lwords','vocab','read','gram','keigo','jita'].forEach(function(k){if(DECKS[k])t+=deckNeed(k);});
 var cl=(S.td&&S.td.clips||[]).length;return Math.round(m+t*0.4+8*0.6+cl*4);}
function aheadAdd(){
 var t=dayNum(),st=planStats();todayView();
 S.ahead={day:t,n:aheadN()+1};S.aheadTotal=(S.aheadTotal||0)+1;
 var more=st.unseen.filter(function(i){return S.todayNew.ids.indexOf(i)<0;}).slice(0,st.quota);S.todayNew.ids=S.todayNew.ids.concat(more);
 var f=tdState().f;Object.keys(f).forEach(function(k){if(k==='new'||/^c:/.test(k))delete f[k];});
 save();}
function freeRows(){
 function r(href,t,sub){return '<a class=frow href="'+href+'"><b>'+t+'</b>'+(sub?'<span class=note>'+sub+'</span>':'')+'</a>';}
 var h='<div class=g2>'+r('#/vb','🍯 生词本（'+vbList().length+'）','划线收藏的词和表达'+(vbDue().length?' · 今天到期 '+vbDue().length:''));
 h+=r('#/wrong','🍓 错题本',wrongOpen().length+' 题待攻克');
 h+=r('#/audio','🎧 听力真题（原录音）','可看原文、调速、离线下载'+(auDue().length?' · 待重听 '+auDue().length:''));
 h+=r('#/lessons','📖 引导型课程','自他动词 · 敬语 · 动词变形')+'</div>';
 h+='<p class=note style="margin:14px 0 0">单独刷某一类卡片</p><div class=g2>';
 ['lexp','lwords','read','vocab','gram','keigo','jita'].forEach(function(k){if(!DECKS[k])return;var st=deckStat(k);
  h+=r('#/cards/'+k,esc(DECKS[k].name),(st.due?'待复习 '+st.due+' 张':'共 '+st.total+' 张'));});
 h+='</div><p class=note style="margin:14px 0 0">单独做某一套题（全部题）</p><div class=g2>';
 for(var k in SETS)h+=r('#/quiz/'+k,esc(SETS[k].name)+(SETS[k].listen?' 🔊':''),SETS[k].items.length+' 题');
 return h+'</div>';}
function home(){
 var d=Math.ceil((new Date(S.exam+'T00:00:00')-new Date())/86400000);
 var wdue=wrongDue().length,G=globalProg();
 var TL=taskList(),TD=TL.filter(function(x){return x.done;}).length,left=TL.length-TD;
 checkPerfect(true);checkBadges(true);
 var SI=streakInfo(),tl=(S.log[dayNum()]||0),sh='';
 (function(){var t=dayNum(),dots='',wd=['日','一','二','三','四','五','六'],i,P=S.perfect||{};
  for(i=6;i>=0;i--){var dd=t-i,c=(S.log[dd]||0)>=1,pf=!!P[dd];
   dots+='<span class="sdot'+(c?' on':'')+(pf?' gold':'')+(i===0?' today':'')+'"><b>'+(pf?'⭐':(c?'✓':(i===0?'·':'')))+'</b><small>'+wd[new Date(dd*86400000).getUTCDay()]+'</small></span>';}
  var hm='';for(i=34;i>=0;i--){var v=S.log[t-i]||0,lvl=P[t-i]?5:(v>=20?4:v>=10?3:v>=5?2:v>0?1:0);hm+='<i class="hm h'+lvl+'"></i>';}
  var nm=LVN[Math.min(LVN.length-1,SI.lv-1)],pf2=!!(S.perfect&&S.perfect[t]),wd2=wrongDue().length,vd2=vbDue().length,extra='';
  extra='<div class=extra><b>🎁 额外加分</b> <span class=note>'+(pf2?'今日任务已完成，下面每做一题都多加分':'完成今日任务后解锁：之后每做一题多加分')+'</span><div class=g2 style="margin-top:8px">'
   +'<a class="frow'+(pf2?'':' lock')+'" href="#/wrongquiz"><b>🍓 错题复习</b><span class=note>'+(wd2?wd2+' 题到期':'今天没有到期的')+' · 每题 +25 XP</span></a>'
   +'<a class="frow'+(pf2?'':' lock')+'" href="#/vb"><b>🍯 生词复习</b><span class=note>'+(vd2?vd2+' 个到期':'今天没有到期的')+' · 每题 +25 XP</span></a>'
   +'</div><p class=note style="margin:8px 0 0">其他加练每题 +20 XP（平时每题 10）'+(SI.bx?' · 已额外获得 '+SI.bx+' XP':'')+'</p></div>';
  sh='<div class=hero id=streak><div class=hrow><span class=flame>'+(SI.n&&tl?'🔥':(SI.n?'🕯️':'🌙'))+'</span><div class=hmain><b class=big>'+SI.n+' 天连胜</b><div class=note>'+(tl?'今天已打卡 ✓（做了就算）':(SI.n?'今天还没做，做一题就保住连胜':'做一题就开始连胜'))+'</div></div><a class=chip href="#/badges" style="text-decoration:none;color:inherit">'+LVE[Math.min(LVE.length-1,SI.lv-1)]+' Lv.'+SI.lv+' '+nm+' ›</a></div><div class=sweek>'+dots+'</div>'
   +'<div class=todo><div class=trow><b>🍡 今天要做：'+(left?'还剩 '+left+' 项':'全部完成啦 🎉')+'</b><span class=note>'+(left?'共 '+TL.length+' 项 · 约 '+estMin()+' 分钟':'共 '+TL.length+' 项')+'</span></div>'+bar(100*TD/Math.max(1,TL.length),TD===TL.length?'var(--ok)':'')+'<p class=note style="margin:0 0 10px">'+(TD===TL.length&&TL.length?'⭐ 完美日达成，已得 +50 XP':'全部做完得 ⭐ 完美日 +50 XP')+'</p><a class="btn go" href="#/today">'+(left?'开始今天的任务 →':'进去再多做一点 →')+'</a></div>'
   +extra+'<details class=more><summary>📅 打卡记录 · 等级 · 数据</summary><div class=hmap>'+hm+'</div><p class=note style="margin:6px 0 0">'+SI.xp+' XP（再 '+(SI.hi-SI.xp)+' 升级）· 最长连胜 '+SI.best+' 天 · 累计打卡 '+SI.days+' 天<br>⭐ 完美日累计 '+SI.pd+' 天 · 连续 '+SI.pn+' 天 · 每答一题 +10 XP<br><a href="#/badges">🏅 查看全部徽章（'+Object.keys(S.badges||{}).filter(function(k){return k!=="_init";}).length+' 枚）</a></p></details></div>';
  })();
 var h='<h1>N2 冲刺 <button id=howb class="btn small" style="vertical-align:middle;margin-left:8px">每天怎么用</button></h1><div id=howbox class=hide><div class=noteb>1. 打开首页，点“今天要做”；<br>2. 按清单从上往下做：先背卡片 → 做新题 → 做到期复习 → 听录音；<br>3. 清单全部打勾就可以收工；想多做，在今日清单里点“提前做 1 天的量”（每点一次＝多做一天的新内容）；<br>4. 听力/阅读里遇到不会的词，划选加入生词本，到生词本里复习。</div></div><p class=sub>距离考试（'+esc(S.exam)+'）还有 <b>'+(isFinite(d)?d:'?')+'</b> 天'+(S.aheadTotal?' · 已提前做了 <b>'+S.aheadTotal+'</b> 天的量':'')+'</p>';
 h+=sh;
 if(wdue)h+='<a class=card href="#/wrongquiz"><b>🍓 错题到期复习：'+wdue+' 题</b><span>按记忆曲线安排，也包含在今日清单里</span></a>';
 h+='<h2>🌱 全局进度</h2><div class=noteb>';
 var RG=[['#d9a5a0','#e6cfa0'],['#9fb5c2','#a9c2ad'],['#b8a6c4','#e0b9b4'],['#a9c2ad','#e6cfa0']];
 h+='<div class=rings>';
 G.rows.forEach(function(r,i){var p=Math.max(0,Math.min(100,100*r.a/Math.max(1,r.b))),C=2*Math.PI*42,g=RG[i%RG.length],nm=String(r.n).replace(/（.*$/,'');
  h+='<div class=rg><svg viewBox="0 0 100 100" width=118 height=118><defs><linearGradient id=rg'+i+' x1=0 y1=0 x2=1 y2=1><stop offset=0 stop-color="'+g[0]+'"/><stop offset=1 stop-color="'+g[1]+'"/></linearGradient></defs><circle cx=50 cy=50 r=42 fill=none stroke="rgba(120,110,100,.16)" stroke-width=10 /><circle class=rgv cx=50 cy=50 r=42 fill=none stroke="url(#rg'+i+')" stroke-width=10 stroke-linecap=round transform="rotate(-90 50 50)" stroke-dasharray="'+(C*p/100).toFixed(1)+' '+C.toFixed(1)+'"/><text x=50 y=55 text-anchor=middle font-size=20 font-weight=700 fill="currentColor">'+Math.round(p)+'%</text></svg><b>'+esc(nm)+'</b><span class=note>'+r.a+' / '+r.b+(r.s!=null?'<br>'+esc(r.sn)+' '+r.s:'')+'</span></div>';});
 h+='</div>';
 var eta=new Date(Date.now()+G.need*86400000);
 h+='<p>'+(G.need?'按现在每天的节奏，还需 <b>'+G.need+'</b> 天把所有内容至少学一遍（约 '+(eta.getMonth()+1)+'月'+eta.getDate()+'日）':'所有内容都已经学过一遍，接下来以复习为主')+'；考试前还有 '+G.days+' 天，'+(G.days>=G.need?'富余 '+(G.days-G.need)+' 天用来复习巩固。':'<b>时间偏紧，建议每天用“提前做 1 天”追一追。</b>')+'</p>';
 h+='<p class=note>每天的新内容量：原题 '+G.ps.quota+' 题 + 每类卡片 '+NEW_PER_DAY+' 个。复习的内容按 1→2→4→7→15 天的间隔自动回来。</p></div>';
 h+='<h2>🎈 自由练习</h2><div class=noteb>'+freeRows()+'</div>';
 h+=dlBlock(1,'例句和词的朗读（约16MB）');
 h+='<p class=note style="margin-top:24px">版本 BUILDID</p>';
 render(h);dlWire();$('#howb').onclick=function(){var e=$('#howbox');e.className=e.className==='hide'?'':'hide';};}
function freeView(){
 var h='<h1>自由练习</h1><p class=note>这里是全部内容的入口，随便刷；日常进度以首页“今天要做”为准。</p><h2>先背（卡片）</h2><div class=grid>';
 ['lexp','lwords','read','vocab','gram','keigo','jita'].forEach(function(k){var s=deckStat(k);
  h+='<a class=card href="#/cards/'+k+'"><b>'+DECKS[k].name+'</b><span>'+(s.due?'待复习 '+s.due+' 张':'共 '+s.total+' 张')+'</span></a>';});
 h+='</div><h2>再做（测验，全部题）</h2><div class=grid>';
 for(var k in SETS)h+='<a class=card href="#/quiz/'+k+'"><b>'+SETS[k].name+'</b><span>共 '+SETS[k].items.length+' 题'+(SETS[k].listen?' · 🔊':'')+'</span></a>';
 h+='</div>'+dlBlock(1,'例句和词的朗读（约16MB）')+'<p><a class=btn href="#/home">回首页</a></p>';
 render(h);dlWire();}

function TESTSAY(c){return (c.line&&window.DATA&&DATA.tts&&DATA.tts[c.line])?c.line:speakable(c);}
function speakable(c){return String(c.r&&c.r.indexOf('↔')<0&&c.r.indexOf('／')<0?c.r:(c.w||c.expr||'')).replace(/[〜～（）()「」\/／↔]/g,' ');}
function origFill(o){if(String(o.q).indexOf('（　）')<0&&o.sec==='用法')return String(o.o[o.a]);return String(o.q).replace('（　）',o.o[o.a]).replace(/\n/g,'').replace(/[【】]/g,'');}
(function(){var O=DATA.orig||[];(DATA.vocab||[]).forEach(function(c){if(c.oid||!c.ex)return;var n=nz(c.ex);for(var i=0;i<O.length;i++){var f=nz(origFill(O[i]));if(f===n||(n.length>8&&f.indexOf(n)>=0)){c.oid=O[i].id;break;}}});})();
function OQ(c){if(c&&/^j\d+$/.test(c.id))return jitaQ(c);if(c&&c.id&&KQ[c.id])return KQ[c.id];if(!c.oid)return null;var O=DATA.orig||[];for(var i=0;i<O.length;i++)if(O[i].id===c.oid)return O[i];return null;}

var JEX={"j1": "ドアが開いた。／ドアを開けた。", "j2": "窓が閉まっている。／窓を閉めた。", "j3": "電気がついた。／電気をつけた。", "j4": "火が消えた。／火を消した。", "j5": "会議が始まった。／会議を始めた。", "j6": "車が止まった。／車を止めた。", "j7": "財布が落ちた。／財布を落とした。", "j8": "時計が壊れた。／時計を壊した。", "j9": "人口が増える。／人数を増やす。", "j10": "収入が減る。／無駄を減らす。", "j11": "天気が変わる。／予定を変える。", "j12": "日程が決まる。／日程を決める。", "j13": "人が集まる。／切手を集める。", "j14": "鍵が見つかった。／鍵を見つけた。", "j15": "雨が続く。／勉強を続ける。", "j16": "気持ちが伝わる。／気持ちを伝える。", "j17": "荷物が届く。／荷物を届ける。", "j18": "病気が治る。／病気を治す。", "j19": "部屋に入る。／かばんに入れる。", "j20": "家を出る。／手紙を出す。", "j21": "朝早く起きる。／子どもを起こす。", "j22": "洗濯物が乾く。／髪を乾かす。", "j23": "お湯が沸く。／お湯を沸かす。", "j24": "計画が進む。／計画を進める。"};
function jitaParse(c,idx){var ss=String(JEX[c.id]||'').split('／'),m=/^(.+?)(が|を|に)(.+?)。?$/.exec(ss[idx]||'');return m?{n:m[1],p:m[2],t:m[3]}:null;}
function jitaQ(c){
 var n=c._n||0;if(c._jq)return c._jq;
 var L=DATA.jita||[],ws=c.w.split(' ↔ '),zs=String(c.zh).split(' ↔ '),idx=Math.random()<.5?0:1,A=jitaParse(c,idx),B=jitaParse(c,1-idx);
 if(!A||!B)return null;
 var intr=idx===0,V=ws[idx],PV=ws[1-idx],id='jq_'+c.id+'_'+idx+'_'+n,form=Math.random()<.5?'p':'v',o,a,ex,q;
 var P=['が','を','に','で'];
 if(form==='p'){
  o=P.slice();a=P.indexOf(A.p);q=A.n+'（　）'+A.t+'。';
  var tp={'が':'「が」：自动词「'+V+'」表示事物自己发生变化，变化的主体用「が」。','を':(intr?'「を」：移动动词表示离开的起点时用「を」（'+A.n+'を'+A.t+'）。':'「を」：他动词「'+V+'」是人做的动作，被作用的对象用「を」。'),'に':'「に」：表示到达点、目的地（'+A.n+'に'+A.t+'）。','で':'「で」：表示场所、手段、原因，这里不合。'};
  ex=P.map(function(p,i){
   if(i===a)return '✔ '+tp[p];
   if(p==='が')return '「が」标的是自动词的主体；这里「'+V+'」是他动词，对象要用「を」。'+(intr?'':'');
   if(p==='を')return '「を」是他动词的宾语标记；「'+V+'」是自动词，前面不能接「を」（他动词是「'+PV+'」）。';
   if(p==='に')return '「に」表示到达点或时间，不是变化的主体，也不是直接对象。';
   return '「で」表示场所、手段或原因，不能代替主体或对象。';});
  if(a===0)ex[1]='「を」是他动词的宾语标记；「'+V+'」是自动词，前面不能接「を」（他动词是「'+PV+'」）。';
  if(a===1&&!intr)ex[0]='「が」标的是自动词的主体；「'+V+'」是他动词，人对「'+A.n+'」做动作，对象要用「を」（自动词是「'+PV+'」）。';
 }else{
  var pool=shuffle(L.filter(function(x){return x.id!==c.id;})),ds=[],i2,tails={};tails[A.t]=1;tails[B.t]=1;
  for(i2=0;i2<pool.length&&ds.length<2;i2++){var tt=jitaParse(pool[i2],idx);if(tt&&!tails[tt.t]){tails[tt.t]=1;ds.push({t:tt.t,w:pool[i2].w});}}
  o=[A.t,B.t].concat(ds.map(function(d){return d.t;}));a=0;q=A.n+A.p+'（　）。';
  ex=['✔ 「'+A.n+A.p+A.t+'」：'+(intr?'自动词「'+V+'」，事物自己变化，主体用「が」。':'他动词「'+V+'」，人对「'+A.n+'」做动作，对象用「を」。'),
   '「'+B.t+'」是'+(intr?'他动词「'+PV+'」（人做的动作），前面要用「を」，而这里是「'+A.p+'」。':'自动词「'+PV+'」（事物自己变化），前面要用「が」，而这里是「'+A.p+'」。')]
   .concat(ds.map(function(d){return '「'+d.t+'」是另一组动词（'+d.w+'），意思与句子不合。';}));
 }
 DATA.ox=DATA.ox||{};DATA.ox[id]=ex;DATA.qz=DATA.qz||{};DATA.qz[id]=zs[idx]||'';
 c._jk=n;c._jq={id:id,q:q,o:o,a:a,sec:'自他'};return c._jq;}
var KQ={};(function(){var I={"k2": {"q": "（会社で）社長は明日、大阪へ（　）そうです。", "o": ["いらっしゃる", "参る", "伺う", "行く"], "qz": "听说社长明天要去大阪。", "ex": ["✔ 「いらっしゃる」＝「行く」的尊敬语，说社长的动作，抬高对方。", "「参る」＝「行く／来る」的谦让语，只能说自己（己方）的动作；用在社长身上等于贬低对方。", "「伺う」＝谦让语（拜访、询问），同样只能用于自己，而且意思是“拜访”，不是单纯的“去”。", "「行く」＝普通形，没有表达对社长的敬意。"]}, "k3": {"q": "（お客様に）私が明日、お宅へ（　）ます。", "o": ["参り", "いらっしゃい", "お越しになり", "来られ"], "qz": "我明天去府上拜访。", "ex": ["✔ 「参る」＝「来る／行く」的谦让语。自己的动作要用谦让语：「参ります」。", "「いらっしゃる」＝尊敬语，说自己时等于抬高自己，错。", "「お越しになる」＝お＋ます形＋になる，尊敬语，只能说对方的动作。", "「来られる」＝れる形的尊敬语，同样只能说对方的动作。"]}, "k4": {"q": "（お客様に）山田先生は今、研究室に（　）。", "o": ["いらっしゃいます", "おります", "あります", "ございます"], "qz": "山田老师现在在研究室。", "ex": ["✔ 「いらっしゃる」＝「いる」的尊敬语，说山田老师（对方尊敬的人）。", "「おる」＝「いる」的谦让语，用于自己或己方的人；对客人说对方尊敬的人，不能用。", "「ある」用于物品，不能用于人。", "「ございます」＝「ある」的郑重说法，用于物或场所，说人要用「いらっしゃいます」。"]}, "k6": {"q": "（先生に）先生のご著書を（　）ました。", "o": ["拝見し", "ご覧になり", "見られ", "見せ"], "qz": "我拜读了老师的大作。", "ex": ["✔ 「拝見する」＝「見る」的谦让语，自己看对方的东西用谦让语。", "「ご覧になる」＝尊敬语，说的是对方看；这里看的人是“我”。", "「見られる」＝可能／被动，不是这里需要的谦让表达。", "「見せる」＝让别人看，意思相反。"]}, "k7": {"q": "（会議で）来週の予定について、私からご説明（　）ます。", "o": ["いたし", "なさい", "され", "になり"], "qz": "关于下周的安排，由我来说明。", "ex": ["✔ 「いたす」＝「する」的谦让语：「ご説明いたします」，说自己的动作。", "「なさる」＝「する」的尊敬语，只能说对方的动作。", "「される」＝「する」的尊敬形，同样用于对方。", "「ご〜になる」＝尊敬句型，用于对方；而且「ご説明になります」不能用于自己。"]}, "k10": {"q": "（先生に）先生から貴重なお話を（　）ました。", "o": ["いただき", "くださり", "もらい", "差し上げ"], "qz": "我听到了老师宝贵的话。", "ex": ["✔ 「いただく」＝「もらう」的谦让语，「先生から〜いただく」：我从老师那里得到。", "「くださる」＝「くれる」的尊敬语，句型是「先生が〜くださる」，和「先生から」不搭。", "「もらう」＝普通形，对老师不够恭敬。", "「差し上げる」＝「あげる」的谦让语，方向相反（我给对方）。"]}, "k13": {"q": "（先生に）先生に一つ（　）たいことがあるのですが。", "o": ["伺い", "お聞きになり", "聞かれ", "聞き"], "qz": "有一件事想请教老师。", "ex": ["✔ 「伺う」＝「聞く（询问）」的谦让语：「伺いたい」，自己向老师请教。", "「お聞きになる」＝尊敬语，说老师听／问，不能用于自己。", "「聞かれる」＝尊敬／被动形，用于对方，不是自己的动作。", "「聞く」＝普通形，对老师没有敬意。"]}};DATA.ox=DATA.ox||{};DATA.qz=DATA.qz||{};Object.keys(I).forEach(function(k){var x=I[k],id='kq_'+k;DATA.ox[id]=x.ex;DATA.qz[id]=x.qz;KQ[k]={id:id,q:x.q,o:x.o,a:0,sec:'敬語'};});})();
function origFb(o){var it={wx:DATA.ox[o.id],o:o.o,a:o.a,pk:(o.pick||0)-1,qz:DATA.qz&&DATA.qz[o.id]};return (it.qz?'<div class=noteb><b>题干译文：</b><br>'+esc(it.qz)+'</div>':'')+wxHtml(it)+gramHtml(o.id);}
function cards(k,extra){
 var d=DECKS[k],t=dayNum(),due=[],nw=[],seen=[];
 d.list.forEach(function(c){var s=S.cards[k+':'+c.id];if(!s)nw.push(c);else{seen.push(c);if(s.due<=t)due.push(c);}});
 var batch=extra==='review'?seen.sort(function(a,b){return S.cards[k+':'+a.id].box-S.cards[k+':'+b.id].box;}).slice(0,NEW_PER_DAY):shuffle(due).concat(nw.slice(0,NEW_PER_DAY*(1+aheadN())));
 var BS=5,queue=[],total=batch.length,doneN=0;
 function front(c){return d.front(c);}
 function ans(c){var q=OQ(c);if(q)return q.o[q.a];return k==='read'?c.r:(c.zh||c.r||'');}
 function distract(c){
  var q0=OQ(c);if(q0)return q0.o.filter(function(x,i){return i!==q0.a;});
  if(k==='read')return shuffle(c.ds).slice(0,3);
  function pa(x){return k==='read'?x.r:(x.zh||x.r||'');}
  var pool=shuffle(d.list.filter(function(x){return x.id!==c.id&&pa(x)&&pa(x)!==ans(c);}));
  return pool.slice(0,3).map(pa);}
 var MORE="<p><a class=btn href=\"#/today\">回今日任务</a> <button id=m1 class=btn>再学 15 个新的</button> <button id=m2 class=btn>加练已学过的</button></p>";
 function wireMore(){var a=$('#m1'),b=$('#m2');if(a)a.onclick=function(){cards(k);};if(b)b.onclick=function(){cards(k,'review');};}
 function frontHtml(c){return '<div class=front>'+esc(front(c))+'</div>'+(c.r&&k!=='read'?'<div class=rd>'+esc(c.r)+'</div>':'');}
 function learn(items){
  var i=0;
  (function one(){
   if(i>=items.length){test(items.slice(),0);return;}
   var c=items[i];
   render('<h1>'+d.name+' · 学习 <small>'+(i+1)+'/'+items.length+'</small></h1><div class=flash>'+frontHtml(c)+(k==='read'?'<div class=rd>'+esc(c.r)+'</div>':'')+'<div>'+d.back(c)+'</div></div>'+ttsWarn()+'<button id=sp class=btn>🔊 发音</button> '+(i>0?'<button id=pv class=btn>← 上一个</button> ':'')+'<button id=nx class=btn>记住了，下一个</button>');
   var say=speakable(c),ex=c.line||c.ctx||c.ex;
   $('#sp').onclick=function(){speak(say,function(){if(ex)speak(ex);});};
   $('#nx').onclick=function(){i++;one();};
   if($('#pv'))$('#pv').onclick=function(){i--;one();};
  })();}
 function stemEx(c){if(k==='keigo')return '';if(k==='lexp'||k==='lwords'||k==='read'||OQ(c))return '';var e=c.ex||c.ctx;return e?String(e).split('／')[0]:'';}
 function test(list,n){
  if(!list.length){doneN+=0;next();return;}
  var c=list.shift();if(/^j\d+$/.test(c.id))c._jq=null;
  var o=shuffle([ans(c)].concat(distract(c)));
  var LISTEN=(k==='lexp'||k==='lwords');
  var h='<h1>'+d.name+' · 测试</h1><div class=flash>'+(LISTEN?'<div class=front>🔊 ？</div><p class=note>'+(k==='lexp'&&c.line?'先听例句，再选句中那个表达的意思':'先听，再选意思')+'</p>':(OQ(c)?'<p class=q style="text-align:left">'+esc(OQ(c).q).replace(/\n/g,'<br>')+'</p>':(k==='read'&&c.ctx?'<p class=q style="text-align:left">'+esc(c.ctx).replace(esc(c.w),'<u>'+esc(c.w)+'</u>')+'</p>':frontHtml(c))))+'</div><p class=note>'+(OQ(c)?(/^j\d+$/.test(c.id)?'自他动词：选出正确的助词／动词形式':(KQ[c.id]?'敬语：选出正确的说法':'真题原题：选出正确选项')):(k==='read'?'画线词的读法是哪个？':(stemEx(c)?'听例句，选出正确意思':'选出正确意思')))+'</p><div class=opts>';
  o.forEach(function(x,i){h+='<button class=opt data-v="'+esc(x)+'">'+(i+1)+'. '+esc(x)+'</button>';});
  render(h+'</div><div id=fb></div><p><button id=skip class=btn>跳过这个</button></p>');
  $('#skip').onclick=function(){test(list,n);};
  var rp=document.createElement('button');rp.className='btn';rp.id='sp2';rp.textContent='🔊 重听';rp.onclick=function(){var e=stemEx(c);speak(e||TESTSAY(c));};
  if(!OQ(c)&&k!=='read'&&k!=='keigo')document.querySelector('.flash').appendChild(rp);
  if(LISTEN)speak(TESTSAY(c));else if(stemEx(c))speak(stemEx(c));
  [].forEach.call(document.querySelectorAll('.opt'),function(b){b.onclick=function(){
   var ok=b.getAttribute('data-v')===ans(c);
   [].forEach.call(document.querySelectorAll('.opt'),function(x){x.disabled=true;if(x.getAttribute('data-v')===ans(c))x.className+=' right';});
   if(!ok)b.className+=' wrong';
   var key=k+':'+c.id,s=S.cards[key]||{box:0,due:t};
   var first=!c._fail;
   if(ok){ if(first){fsrs(s,true,t);} else {s.box=0;s.due=t+1;} doneN++; }
   else{if(!c._fail)fsrs(s,false,t);c._fail=true;c._n=(c._n||0)+1;s.box=0;if(c._n<2){s.due=t;list.splice(Math.min(3,list.length),0,c);}else{s.due=t+1;}}
   S.cards[key]=s;bump('card');save();var sk=$('#skip');if(sk)sk.style.display='none';
   if(LISTEN){var fl=document.querySelector('.flash');fl.innerHTML=frontHtml(c);fl.appendChild(rp);}
   $('#fb').innerHTML=(ok?'<p class=ok>✔ 正确</p>':'<p class=ng>✘ 正确答案：'+esc(ans(c))+(c._n<2?'（稍后重测一次）':'（明天再出现）')+'</p>')+(OQ(c)?origFb(OQ(c)):'')+'<div class=ex>'+d.back(c)+'</div>'+(k==='keigo'?'':'<button id=sp3 class=btn>🔊 听读音</button> ')+'<button id=nx2 class=btn>继续</button>';
   if($('#sp3'))$('#sp3').onclick=function(){speak(OQ(c)?origFill(OQ(c)):speakable(c),function(){if(k==='read'&&c.ctx)speak(c.ctx);});};
   $('#nx2').onclick=function(){ test(list,n); };
   if(k==='keigo'){}else if(OQ(c))speak(origFill(OQ(c)));else if(!LISTEN)speak(speakable(c));
  };});}
 function next(){
  if(!queue.length){render('<h1>'+d.name+'</h1><p>今天的学习和测试完成 ✓</p><p class=note>答错的会按记忆曲线再次出现。</p><a class=btn href="#/home">返回</a>');return;}
  learn(queue.splice(0,BS));}
 for(var i=0;i<batch.length;i+=BS)queue.push(batch.slice(i,i+BS));
 queue=batch.length?[]:queue;
 var groups=[];for(var j=0;j<batch.length;j+=BS)groups.push(batch.slice(j,j+BS));
 // 每组：学 5 个 -> 测这 5 个 -> 下一组
 var gi=0;
 next=function(){ if(gi>=groups.length){flag('c:'+k);render('<h1>'+d.name+'</h1><p>今天的学习和测试完成 ✓</p><p class=note>答错的会按记忆曲线再次出现。</p>'+MORE+'');wireMore();return;} var g=groups[gi++]; learn(g); };
 if(!batch.length){flag('c:'+k);render('<h1>'+d.name+'</h1><p>今天没有要学的 ✓</p>'+MORE);wireMore();return;}
 next();}

function loadClip(au,url){
 function setSrc(u){au.src=u;}
 if(window.caches){caches.open('n2audio').then(function(ca){return ca.match(url);}).then(function(r){if(r)return r.blob().then(function(b){setSrc(URL.createObjectURL(b));});setSrc(url);}).catch(function(){setSrc(url);});}else setSrc(url);}
function clipHtml(it){
 return '<audio id=au controls preload=auto style="width:100%"></audio><p><button class="btn small" data-r=0.8>0.8×</button><button class="btn small" data-r=1>1×</button><button class="btn small" data-r=1.2>1.2×</button> <button class="btn small" id=b5>⏪ 5秒</button></p>'+(it.hide?'<p class=note>'+esc(it.secn)+'：先听录音，再选（选项在录音里念）。</p>':'<p class=note>'+esc(it.secn)+'</p><p class=q>'+esc(it.q)+'</p>');}
function wireClip(it){
 var au=$('#au');loadClip(au,it.clip);
 [].forEach.call(document.querySelectorAll('[data-r]'),function(b){b.onclick=function(){au.playbackRate=+b.getAttribute('data-r');};});
 $('#b5').onclick=function(){au.currentTime=Math.max(0,au.currentTime-5);};}
function clipAfter(it){
 if(it.hide){[].forEach.call(document.querySelectorAll('.opt'),function(b,n){b.textContent=(n+1)+'. '+it.o[n];});}
 return (it.hide?'<p class=q>'+esc(it.q)+'</p>':'')+(it.sc?'<div class=noteb><b>原文：</b> <span class=note>💡 划选词句可加入生词本</span><br>'+esc(it.sc).replace(/\n/g,'<br>')+'</div>':'');}
function passHtml(it){if(!it.p)return '';var t=esc(it.p).replace(/\n/g,'<br>');if(it.blank)t=t.replace('（ '+it.blank+' ）','<b class=gap>（ '+it.blank+' ）</b>');return '<div class=noteb style="font-size:15px"><p class=note>💡 划选词句可加入生词本</p>'+t+'</div>';}
function qzHtml(it){
 if(it.lz){var z=it.lz,h='<div class=noteb><b>题干与选项译文：</b><br>'+esc(z.q)+'<br>'+z.o.map(function(o,i){return (i+1)+'. '+esc(o)+(i===it.a?' ✔':'');}).join('<br>')+'</div>';
  if(z.s)h+='<div class=noteb><b>原文译文：</b><br>'+esc(z.s).replace(/\n/g,'<br>')+'</div>';if(it.pz)h+='<div class=noteb><b>文章译文：</b><br>'+esc(it.pz).replace(/\n/g,'<br>')+'</div>';return h;}
 if(it.pz)return '<div class=noteb><b>文章译文：</b><br>'+esc(it.pz).replace(/\n/g,'<br>')+'</div>'+(it.qz?'<div class=noteb><b>题干译文：</b><br>'+esc(it.qz)+'</div>':'');
 return it.qz?'<div class=noteb><b>题干译文：</b><br>'+esc(it.qz)+'</div>':'';}
function wxHtml(it){if(!it.wx)return '';return '<div class=noteb><b>各选项解析：</b><br>'+it.wx.map(function(n,i){return (i===it.a?'✔ ':'✘ ')+esc(it.o[i])+(i===it.pk?' <b>（你当时选的）</b>':'')+'<br><span class=note>'+esc(n.replace(/^✔\s*/,''))+'</span>';}).join('<br>')+'</div>';}
function explHtml(id){var x=window.DATA&&DATA.expl&&(DATA.expl[id]||DATA.expl[String(id).replace(/^d(?=s\d)/,'')]);return x?'<div class=noteb><b>讲解：</b>'+esc(x)+'</div>':'';}
var DAILY_SETS=['qOrig','qRead','qReadComp','qListenWrong'];
var DAILY_IDS={};
(function(){DAILY_SETS.forEach(function(k){SETS[k].items.forEach(function(it){DAILY_IDS[it.id]=1;});});})();
var EXAM_FALLBACK='2026-12-06';
function dayOf(str){var p=str.split('-');var d=new Date(+p[0],+p[1]-1,+p[2]);return Math.floor((d.getTime()-d.getTimezoneOffset()*60000)/86400000);}
function isTravel(day){return false;}
function ensurePlan(){
 var ids=Object.keys(DAILY_IDS);
 if(!S.plan)S.plan={order:[]};
 var have={};S.plan.order.forEach(function(i){have[i]=1;});
 var fresh=ids.filter(function(i){return !have[i];});
 if(fresh.length){S.plan.order=S.plan.order.concat(shuffle(fresh));save();}}
function planStats(){
 ensurePlan();
 var t=dayNum(),exam=dayOf(S.exam||EXAM_FALLBACK);
 var unseen=S.plan.order.filter(function(i){return !S.q[i];});
 var wsum=0,d;for(d=t;d<exam;d++)wsum+=isTravel(d)?0.3:1;
 if(wsum<1)wsum=1;
 var w=isTravel(t)?0.3:1;
 var quota=Math.max(unseen.length?1:0,Math.ceil(unseen.length*w/wsum));
 var due=Object.keys(S.q).filter(function(i){var q=S.q[i];return DAILY_IDS[i]&&q.box<5&&q.due<=t;});
 var todayNew=S.q&&S.todayNew&&S.todayNew.day===t?S.todayNew.ids:null;
 return {unseen:unseen,quota:quota,due:due,total:S.plan.order.length,done:S.plan.order.length-unseen.length,days:Math.max(0,exam-t),todayNew:todayNew};}
function todayView(extra){
 var st=planStats(),t=dayNum();
 if(!S.todayNew||S.todayNew.day!==t)S.todayNew={day:t,ids:st.unseen.slice(0,st.quota)};
 if(extra){var more=st.unseen.filter(function(i){return S.todayNew.ids.indexOf(i)<0;}).slice(0,extra);S.todayNew.ids=S.todayNew.ids.concat(more);}
 save();
 var newIds=S.todayNew.ids.filter(function(i){return !S.q[i]||S.q[i].intro===t&&S.q[i].box===0;});
 var ids=st.due.concat(newIds.filter(function(i){return st.due.indexOf(i)<0;}));
 return ids;}
function todayParts(extra){
 var ids=todayView(extra),st=planStats();
 var due=st.due.slice(),nw=ids.filter(function(i){return due.indexOf(i)<0;});
 return {due:due,nw:nw,st:st};}
function pickClips(){
 var td=tdState();
 if(!td.clips){var log=S.aulog||{},all=[];DATA.audio.forEach(function(p){p.clips.forEach(function(c){all.push(p.id+':'+c.k);});});
  td.clips=all.filter(function(k){return !log[k];}).slice(0,3);save();}
 return td.clips;}
function pickSb(){
 var td=tdState();
 if(!td.sb){td.sb=shuffle(SETS.sBuild.items.map(function(i){return i.id;})).slice(0,8);save();}
 return td.sb;}
function wrongOther(){return wrongDue().filter(function(i){return !DAILY_IDS[i];});}
function deckNeed(k){var s=deckStat(k);return s.due+Math.min(s.nw,NEW_PER_DAY*(1+aheadN()));}
function taskList(){
 var P=todayParts(),L=[],t=dayNum();
 var log=S.aulog||{};
 // 学习
 [['lexp','听力表达'],['lwords','听力词汇'],['vocab','词汇'],['read','汉字读音'],['gram','语法句型'],['keigo','敬语'],['jita','自他动词']].forEach(function(a){
  var n=deckNeed(a[0]);if(!DECKS[a[0]])return;
  L.push({g:'学习',id:'c:'+a[0],title:'背 · '+DECKS[a[0]].name,sub:n?('今天 '+n+' 个（先学再测）'):'今天没有要学的',href:'#/cards/'+a[0],done:isF('c:'+a[0])||n===0});});
 var ls=(DATA.lessons||[]).filter(function(x){return !(S.ls&&S.ls[x.id]);})[0];
 if(ls)L.push({g:'学习',id:'lesson',title:'课程 · '+ls.title,sub:ls.sub,href:'#/lesson/'+ls.id,done:isF('lesson')});
 // 做题
 L.push({g:'做题',id:'new',title:'今日新题（错题原题）',sub:P.nw.length?(P.nw.length+' 题 · 已引入 '+P.st.done+'/'+P.st.total):'已完成',href:'#/t/new',done:isF('new')||P.nw.length===0});
 L.push({g:'做题',id:'due',title:'到期复习（按记忆曲线）',sub:P.due.length?(P.due.length+' 题'):'没有到期的',href:'#/t/due',done:isF('due')||P.due.length===0});
 var wo=wrongOther();
 if(wo.length)L.push({g:'做题',id:'wo',title:'错题本到期',sub:wo.length+' 题',href:'#/t/wo',done:isF('wo')});
 var sb=pickSb();L.push({g:'做题',id:'sb',title:'造句/排序练习',sub:sb.length+' 题（中文拼日语）',href:'#/t/sb',done:isF('sb')});
 // 听力
 var cl=pickClips();
 if(cl.length){var left=cl.filter(function(k){return !log[k];}).length;
  L.push({g:'听力',id:'clips',title:'听真题录音',sub:'今天 '+cl.length+' 段，还剩 '+left+' 段（看原文、调速）',href:'#/clip/'+cl.filter(function(k){return !log[k];}).concat(cl)[0].replace(':','/'),done:left===0});}
 var ad=auDue();
 if(ad.length)L.push({g:'听力',id:'au',title:'重听没听懂的',sub:ad.length+' 段',href:'#/audio',done:false});
 return L;}
function runTask(id){
 var P=todayParts();
 if(id==='new'){if(P.nw.length)quiz(null,P.nw,'new');else today();}
 else if(id==='due'){if(P.due.length)quiz(null,P.due,'due');else today();}
 else if(id==='more'){var ids=todayView(10);var extra=ids.filter(function(i){return P.due.indexOf(i)<0&&P.nw.indexOf(i)<0;});quiz(null,ids.length?ids:P.nw,'new');}
 else if(id==='wo'){var w=wrongOther();if(w.length)quiz(null,w,'wo');else today();}
 else if(id==='sb')quiz(null,pickSb(),'sb');
 else today();}
function today(){
 var L=taskList(),dn=L.filter(function(x){return x.done;}).length,st=planStats();
 var h='<h1>今日任务</h1><p class=sub>完成 <b>'+dn+' / '+L.length+'</b> · 约 '+estMin()+' 分钟 · 距考试 '+st.days+' 天 · 原题已引入 '+st.done+'/'+st.total+'（全局进度见首页）</p><div style="height:8px;background:var(--bd);border-radius:4px;overflow:hidden"><div style="height:8px;width:'+Math.round(100*dn/Math.max(1,L.length))+'%;background:var(--ok)"></div></div>';
 var cur='';
 L.forEach(function(x){
  if(x.g!==cur){cur=x.g;h+='<h2>'+x.g+'</h2>';}
  h+='<a class=card style="margin:6px 0;'+(x.done?'opacity:.6;':'border-color:var(--ac);')+'" href="'+x.href+'"><b>'+(x.done?'✅ ':'⬜ ')+esc(x.title)+'</b><span>'+esc(x.sub)+'</span></a>';});
 h+='<h2>还想多做？</h2><p class=note>以“天”为单位：点一次＝提前做明天一天的新内容（新原题 '+st.quota+' 道 + 每类卡片 '+NEW_PER_DAY+' 个）。今天已提前 '+aheadN()+' 天，累计 '+(S.aheadTotal||0)+' 天。</p><p><button id=ahead class=btn>提前做 1 天的量</button> <a class=btn href="#/home">回首页看全局进度</a></p>';
 if(dn===L.length)h='<p class=ok style="font-size:20px">🎉 今天的任务全部完成！</p>'+h;
 render(h);if($('#ahead'))$('#ahead').onclick=function(){aheadAdd();today();};}
function todayOld(extra){
 var ids=todayView(extra);
 if(!ids.length){var st=planStats();render('<h1>今日任务</h1><p>今天的新题和到期复习都做完了 ✓</p><p class=note>已引入 '+st.done+' / '+st.total+' 题，距考试 '+st.days+' 天。</p><p><button id=more class=btn>再多做 10 题新的</button> <a class=btn href="#/home">返回</a></p>');$('#more').onclick=function(){today(10);};return;}
 quiz(null,ids);}
function wrongDue(){var t=dayNum();return Object.keys(S.wrong).filter(function(k){var w=S.wrong[k];return k.indexOf('au:')!==0&&w&&w.box<5&&w.due<=t;});}
function wrongOpen(){return Object.keys(S.wrong).filter(function(k){var w=S.wrong[k];return k.indexOf('au:')!==0&&w&&w.box<5;});}
function auDue(){var t=dayNum();return Object.keys(S.wrong).filter(function(k){var w=S.wrong[k];return k.indexOf('au:')===0&&w&&w.box<5&&w.due<=t;});}
var SECN={1:'问题1 课题理解',2:'问题2 要点理解',3:'问题3 概要理解',4:'问题4 即时应答',5:'问题5 综合理解'};
function getPaper(id){return DATA.audio.filter(function(p){return p.id===id;})[0];}
function audioHome(){
 var h='<h1>听力真题（原录音）</h1><p class=note>每道题已切成单独小段，可反复听、调速、看原文。</p><div class=grid>';
 DATA.audio.forEach(function(p){h+='<a class=card href="#/audio/'+p.id+'"><b>'+p.name+'</b><span>'+p.clips.length+' 段</span></a>';});
 h+='</div><h2>待重听（听不懂的）</h2>';
 var d=auDue();
 if(!d.length)h+='<p class=note>今天没有到期的。</p>';
 d.forEach(function(k){var a=k.split(':');var p=getPaper(a[1]);h+='<a class=btn href="#/clip/'+a[1]+'/'+a[2]+'">'+p.name+' '+a[2]+'</a>';});
 h+=dlBlock(2,'全部真题录音（约76MB）');render(h);dlWire();}
function audioPaper(id){
 var p=getPaper(id);if(!p){audioHome();return;}
 var h='<h1>'+p.name+' 听力</h1><p><button id=dl class=btn>⬇ 离线下载本卷（去台湾前联网点一次）</button> <span id=dlst class=note></span></p>';
 var cur=0;
 p.clips.forEach(function(c){
  if(c.sec!==cur){cur=c.sec;h+='<h2>'+SECN[c.sec]+'</h2>';}
  var w=S.wrong['au:'+p.id+':'+c.k];
  h+='<a class=btn href="#/clip/'+p.id+'/'+c.k+'">'+c.sec+'-'+c.q+(w&&w.box<5?' ⚠':'')+'</a>';});
 render(h);
 $('#dl').onclick=function(){
  if(!window.caches){$('#dlst').textContent='此浏览器不支持离线缓存';return;}
  var n=0;caches.open('n2audio').then(function(ca){
   (function nx(){
    if(n>=p.clips.length){$('#dlst').textContent='已全部下载 ✓';return;}
    var u=p.clips[n].f;
    ca.match(u).then(function(r){ if(r)return; return fetch(u).then(function(rs){if(rs.ok)return ca.put(u,rs);}); }).then(function(){n++;$('#dlst').textContent=n+' / '+p.clips.length;nx();}).catch(function(){$('#dlst').textContent='下载失败，请检查网络后重试（已下 '+n+'）';});
   })();});};}
function splitOpts(c){
 var L=(c.s||'').split('\n'),o=[],rest=[],i;
 if(c.sec!==1&&c.sec!==2)return {o:[],s:c.s||''};
 for(i=0;i<L.length;i++){
  if(i<10&&/^\s*[1-4１-４][\.．]/.test(L[i])&&!/^\s*[1-4１-４][\.．]\s*$/.test(L[i]))o.push(L[i].replace(/([^\x00-\x7f])\s+(?=[^\x00-\x7f])/g,'$1').trim());
  else if(i<10&&o.length&&o.length<4&&i>0&&/^\s*[1-4１-４][\.．]/.test(L[i-1]||'')===false&&o.length&&0){}
  else rest.push(L[i]);}
 if(!o.length)return {o:[],s:c.s||''};
 return {o:o,s:rest.join('\n').replace(/^\s*\.\s*\n/,'')};}
var CZ=null;
function czOf(id,k){if(!CZ){CZ={};var D=window.DATA||{};(D.lq||[]).forEach(function(q){var z=D.lqzh&&D.lqzh[q.id];if(!z)return;var m=/audio\/(\w+)\/([\d-]+)\.mp3/.exec(q.f);if(m)CZ[m[1]+'/'+m[2]]=(z.o&&z.o.length?z.o.map(function(x,i){return (i+1)+'. '+x;}).join('\n')+'\n':'')+(z.s||'');});var X=D.cz||{};for(var kk in X)CZ[kk]=X[kk];}return CZ[id+'/'+k]||'';}
function clipView(id,k){
 var p=getPaper(id),i=p?p.clips.map(function(c){return c.k;}).indexOf(k):-1;
 if(i<0){audioHome();return;}
 var c=p.clips[i],prev=p.clips[i-1],next=p.clips[i+1],sp=splitOpts(c);
 var h='<h1>'+p.name+' '+SECN[c.sec]+' 第'+c.q+'题</h1><audio id=au controls preload=auto style="width:100%"></audio>'+
  '<p><button class="btn small" data-r=0.8>0.8×</button><button class="btn small" data-r=1>1×</button><button class="btn small" data-r=1.2>1.2×</button> <button class="btn small" id=b5>⏪ 5秒</button> <button class="btn small" id=f5>5秒 ⏩</button></p>'+
  (sp.o.length?'<div class=noteb><b>试卷上的选项</b><br>'+sp.o.map(esc).join('<br>')+'</div>':'')+'<p><button id=sc class=btn>显示原文</button></p><div id=scb class=hide><p class=note>💡 用手指划选词句，可加入生词本</p>'+(sp.s?esc(sp.s).replace(/\n/g,'<br>'):'（这一题的原文暂缺）')+(czOf(id,k)?'<div class=noteb lang=zh><b>中文译文</b><br>'+esc(czOf(id,k)).replace(/\n/g,'<br>')+'</div>':'')+'</div>'+
  '<p><button id=ok class="btn good">听懂了</button> <button id=no class="btn bad">没听懂，加入重听</button></p>'+
  '<p>'+(prev?'<a class=btn href="#/clip/'+id+'/'+prev.k+'">← 上一题</a>':'')+' <a class=btn href="#/audio/'+id+'">目录</a> '+(next?'<a class=btn href="#/clip/'+id+'/'+next.k+'">下一题 →</a>':'')+'</p>';
 render(h);
 var au=$('#au');
 function setSrc(url){au.src=url;}
 if(window.caches){caches.open('n2audio').then(function(ca){return ca.match(c.f);}).then(function(r){if(r)return r.blob().then(function(b){setSrc(URL.createObjectURL(b));});setSrc(c.f);}).catch(function(){setSrc(c.f);});}else setSrc(c.f);
 [].forEach.call(document.querySelectorAll('[data-r]'),function(b){b.onclick=function(){au.playbackRate=+b.getAttribute('data-r');};});
 $('#b5').onclick=function(){au.currentTime=Math.max(0,au.currentTime-5);};
 $('#f5').onclick=function(){au.currentTime=au.currentTime+5;};
 $('#sc').onclick=function(){var e=$('#scb');e.className=e.className==='hide'?'noteb':'hide';};
 var key='au:'+id+':'+k;
 $('#ok').onclick=function(){S.aulog=S.aulog||{};S.aulog[id+':'+k]=1;var w=S.wrong[key];if(w){fsrs(w,true,dayNum());}bump('au');save();this.textContent='已记录 ✓';};
 $('#no').onclick=function(){S.aulog=S.aulog||{};S.aulog[id+':'+k]=1;S.wrong[key]={box:0,due:dayNum()};bump('au');save();this.textContent='已加入重听 ✓（明天再出现）';};}

function recordQ(it,ok,failedInSession){
 var t=dayNum(),q=S.q[it.id];
 if(!q){q=S.q[it.id]={box:0,due:t,intro:t};
  if(ok&&!failedInSession){fsrs(q,true,t);}
  else {fsrs(q,false,t);q.box=0;q.due=t+1;}
  return;}
 if(ok&&!failedInSession){fsrs(q,true,t);}
 else {fsrs(q,false,t);q.box=0;q.due=t+1;}
}
function record(it,ok,failedInSession){
 if(DAILY_IDS[it.id])recordQ(it,ok,failedInSession);
 var st=S.stat[it.id]=S.stat[it.id]||{n:0,w:0};st.n++;if(!ok)st.w++;
 var t=dayNum(),w=S.wrong[it.id];
 if(!ok){var nw=w||{};fsrs(nw,false,t);nw.box=0;nw.due=t;S.wrong[it.id]=nw;}
 else if(w){ if(!failedInSession){fsrs(w,true,t);} else {fsrs(w,false,t);w.box=0;w.due=t+1;} }
 bump(w?'wrong':'quiz');save();}
function quiz(setKey,ids,fk){
 var items;
 if(ids){var all=allItems();items=all.filter(function(i){return ids.indexOf(i.id)>=0;});}
 else items=SETS[setKey].items.slice();
 items=items.some(function(i){return i.listen;})?items:shuffle(items);
 var q=items.slice(),total=items.length,score=0,failed={},done=0;
 function show(){
  if(!q.length){if(fk)flag(fk);render('<h1>完成</h1><p class=big>一次答对 '+score+' / '+total+'</p><p class=note>答错的题已加入错题本，会按 1→2→4→7→15 天间隔反复出现，直到稳定。</p><a class=btn href="#/today">回今日任务</a> <a class=btn href="#/home">首页</a> <a class=btn href="#/wrong">错题本</a>');return;}
  var it=q.shift();
  var h='<h1>'+(done+1)+' / '+total+' <small>还剩 '+(q.length+1)+'</small></h1>';
  if(it.type==='build'){buildView(it,h);return;}
  var opts=it.o.map(function(x,i){return {t:x,i:i};});
  if(!it.fixed&&!it.listen&&!it.clip)opts=shuffle(opts);
  if(it.listen){h+='<button id=play class=btn>🔊 播放</button><p class=note>点“播放”听，再作答；答完看原文。</p>'+ttsWarn()+'<div id=txt class=hide>'+esc(it.q)+'</div>';}
  else if(it.clip)h+=clipHtml(it);
  else h+=passHtml(it)+'<p class=q>'+esc(it.q).replace(/\n/g,'<br>')+'</p>';
  h+='<div class=opts>';
  opts.forEach(function(o,n){h+='<button class=opt data-i="'+o.i+'">'+(n+1)+'. '+(it.hide||(it.listen&&!it.fixed)?'选项 '+(n+1):esc(o.t))+'</button>';});
  h+='</div><div id=fb></div>';
  render(h);
  if(it.clip)wireClip(it);
  if(it.listen){var pl=$('#play');pl.onclick=function(){speakSeq(it.tts);};}
  [].forEach.call(document.querySelectorAll('.opt'),function(b){b.onclick=function(){answer(it,+b.getAttribute('data-i'),b);};});}
 function finish(it,ok,fbHtml){
  if(ok){ if(!failed[it.id])score++; } else { failed[it.id]=true; q.splice(Math.min(3,q.length),0,it); }
  record(it,ok,failed[it.id]&&ok);
  if(ok)done++;
  var fs=(!it.listen&&!it.clip&&it.q&&it.o)?(it.q.indexOf('（　）')>=0?String(it.q).replace('（　）',it.o[it.a]).replace(/\n/g,'').replace(/[【】]/g,''):(/【/.test(it.q)&&lsayOK(String(it.q))?String(it.q).replace(/\n/g,'').replace(/[【】]/g,''):'')):'';
  $('#fb').innerHTML=fbHtml+(fs?'<button id=sps class=btn>🔊 播放例句</button> ':'')+'<button id=nx class=btn>下一题</button>';
  if(fs){$('#sps').onclick=function(){speak(fs);};}
  $('#nx').onclick=function(){show();};}
 function answer(it,i,btn){
  var ok=i===it.a;
  [].forEach.call(document.querySelectorAll('.opt'),function(b){b.disabled=true;if(+b.getAttribute('data-i')===it.a)b.className+=' right';});
  if(!ok)btn.className+=' wrong';
  var tx=$('#txt');if(tx)tx.className='note';
  var detail=it.listen&&!it.fixed?'<div class=note>'+it.o.map(function(o,n){return (n+1)+'. '+esc(o);}).join('<br>')+'</div>':'';
  finish(it,ok,(ok?'<p class=ok>✔ 正解</p>':'<p class=ng>✘ 正解：'+esc(it.o[it.a])+'（稍后会再出现）</p>')+detail+'<p class=note>'+esc(it.e)+(it.s?' · '+esc(it.s):'')+'</p>'+(it.clip?clipAfter(it):'')+qzHtml(it)+wxHtml(it)+gramHtml(it.id)+explHtml(it.id));}
 function buildView(it,h){
  var pool=shuffle(it.tk.concat(it.x||[])).map(function(t,i){return {t:t,i:i};});
  var picked=[];
  h+=(it.pre!==undefined?'<p class=q>'+esc(it.pre)+' <span class=gap>＿＿＿＿</span> '+esc(it.post)+'</p>':it.dict?'<button id=play class=btn>🔊 播放</button>'+ttsWarn()+'<p class=note>点播放，听完把句子拼出来</p>':'<p class=q>'+esc(it.zh)+'</p>')+
   '<div id=ans class=ans></div><div id=bank class=bank></div><button id=chk class=btn>检查</button> <button id=clr class=btn>清空</button><div id=fb></div>';
  render(h);
  function draw(){
   $('#ans').innerHTML=picked.map(function(p,n){return '<button class=tile data-n="'+n+'">'+esc(p.t)+'</button>';}).join('')||'<span class=note>点下面的词块组句</span>';
   $('#bank').innerHTML=pool.filter(function(p){return picked.indexOf(p)<0;}).map(function(p){return '<button class=tile data-i="'+p.i+'">'+esc(p.t)+'</button>';}).join('');
   [].forEach.call(document.querySelectorAll('#bank .tile'),function(b){b.onclick=function(){var p=pool.filter(function(x){return x.i===+b.getAttribute('data-i');})[0];picked.push(p);draw();};});
   [].forEach.call(document.querySelectorAll('#ans .tile'),function(b){b.onclick=function(){picked.splice(+b.getAttribute('data-n'),1);draw();};});}
  draw();
  var full=it.tk.join(''),spoken=(it.pre||'')+full+(it.post||'');
  if($('#play'))$('#play').onclick=function(){speak(spoken);};
  
  $('#clr').onclick=function(){picked=[];draw();};
  $('#chk').onclick=function(){
   var ok=picked.map(function(p){return p.t;}).join('')===full;
   $('#chk').disabled=true;$('#clr').disabled=true;
   finish(it,ok,(ok?'<p class=ok>✔ 正解</p>':'<p class=ng>✘ 正确：'+esc(full)+'（稍后会再出现）</p>')+'<div class=noteb><b>整句：</b>'+esc((it.pre||'')+'【'+full+'】'+(it.post||''))+'<br><b>整句译文：</b>'+esc((window.DATA.sortzh&&DATA.sortzh[it.id])||it.zh)+'<br><span class=note>'+esc(it.s)+'</span></div>'+'<p><button id=play2 class=btn>🔊 听整句</button></p>'+explHtml(it.id));
   var p2=$('#play2');if(p2)p2.onclick=function(){speak(spoken);};
   speak(spoken);};}
 show();}

function wrongView(){
 var open=wrongOpen(),due=wrongDue();
 var h='<h1>错题本</h1><p>未稳定 '+open.length+' 题，今天该复习 <b>'+due.length+'</b> 题。</p>';
 if(due.length)h+='<a class=btn href="#/wrongquiz">复习今天到期的</a> ';
 if(open.length)h+='<a class=btn href="#/wrongall">全部重做</a>';
 if(!open.length)h+='<p>目前没有错题。</p>';
 render(h);}

function report(){
 var t=dayNum(),lines=['N2REPORT d'+t+' exam '+S.exam];
 for(var k in SETS){var n=0,w=0;SETS[k].items.forEach(function(it){var s=S.stat[it.id];if(s){n+=s.n;w+=s.w;}});lines.push(k+' '+n+'/'+w+'wrong');}
 var top=Object.keys(S.stat).filter(function(k){return S.stat[k].w>0;}).sort(function(a,b){return S.stat[b].w-S.stat[a].w;}).slice(0,25);
 lines.push('TOP '+top.map(function(k){return k+':'+S.stat[k].w+'/'+S.stat[k].n;}).join(' '));
 lines.push('OPEN '+wrongOpen().join(','));
 var boxes={};Object.keys(S.cards).forEach(function(k){var d=k.split(':')[0];boxes[d]=boxes[d]||[0,0,0,0,0,0];boxes[d][S.cards[k].box]++;});
 lines.push('CARDS '+JSON.stringify(boxes));
 lines.push('DAYS '+JSON.stringify(S.log));
 return lines.join('\n');}

function lessonsView(){
 var h='<h1>引导型课程</h1><div class=grid>';
 DATA.lessons.forEach(function(L){h+='<a class=card href="#/lesson/'+L.id+'"><b>'+esc(L.title)+'</b><span>'+esc(L.sub)+'</span></a>';});
 render(h+'</div>'+dlBlock(1,'课程和卡片里例句、词的朗读（约16MB）'));dlWire();}

function lsayOK(t){return /[\u3040-\u30ff]/.test(t)&&!/[=→，状态做好形含义结尾]/.test(t);}
function lsay(t){return String(t).replace(/[・\/／]/g,'、').replace(/[〜～（）()「」]/g,' ').replace(/\s+/g,' ').trim();}
function lessonView(id){
 var L=DATA.lessons.filter(function(x){return x.id===id;})[0];
 if(!L){lessonsView();return;}
 var h='<h1>'+esc(L.title)+'</h1><p class=sub>'+esc(L.sub)+'</p>';
 L.blocks.forEach(function(b,n){
  if(b.t==='h')h+='<h2>'+esc(b.x)+'</h2>';
  else if(b.t==='p')h+='<p>'+b.x+'</p>';
  else if(b.t==='ul')h+='<ul>'+b.xs.map(function(x){return '<li>'+x+'</li>';}).join('')+'</ul>';
  else if(b.t==='table')h+='<div class=tw><table>'+b.rows.map(function(r,i){return '<tr>'+r.map(function(c){return i?(lsayOK(c)?'<td class=tsp data-say="'+esc(lsay(c))+'">🔊 '+esc(c)+'</td>':'<td>'+esc(c)+'</td>'):'<th>'+esc(c)+'</th>';}).join('')+'</tr>';}).join('')+'</table></div>';
  else if(b.t==='note')h+='<div class=noteb>'+esc(b.x)+'</div>';
  else if(b.t==='think')h+='<div class=think><b>想一想：</b>'+esc(b.q)+'<br><button class="btn small rv" data-n="'+n+'">看答案</button><div class=hide id="a'+n+'">'+esc(b.a)+'</div></div>';
  else if(b.t==='mcq'){h+='<div class=mcq data-n="'+n+'"><p><b>'+esc(b.q)+'</b> <button class="btn small lsp" data-say="'+esc(lsay(b.q.replace('（　）','、')))+'">🔊</button></p>';b.o.forEach(function(o,i){h+='<div class=orow><button class="opt" data-n="'+n+'" data-i="'+i+'">'+esc(o)+'</button><button class="btn small lsp" data-say="'+esc(lsay(o))+'">🔊</button></div>';});h+='<div class=note id="m'+n+'"></div></div>';}
  else if(b.t==='go')h+='<a class=btn href="#/quiz/'+b.set+'">'+esc(b.x)+'</a>';});
 h+='<p><button id=lsdone class="btn good">✔ 这一课学完了</button> <a class=btn href="#/today">回今日任务</a></p>';
 render(h);
 $('#lsdone').onclick=function(){S.ls=S.ls||{};S.ls[id]=1;flag('lesson');this.textContent='已记录 ✓';};
 [].forEach.call(document.querySelectorAll('.tsp,.lsp'),function(b){b.onclick=function(e){e.stopPropagation();speak(b.getAttribute('data-say'));};});
 [].forEach.call(document.querySelectorAll('.rv'),function(b){b.onclick=function(){$('#a'+b.getAttribute('data-n')).className='note';};});
 [].forEach.call(document.querySelectorAll('.mcq .opt'),function(b){b.onclick=function(){
  var n=+b.getAttribute('data-n'),i=+b.getAttribute('data-i'),bl=L.blocks[n];
  $('#m'+n).innerHTML=(i===bl.a?'✔ ':'✘ ')+esc(bl.e);b.className+=(i===bl.a?' right':' wrong');speak(lsay(bl.q.indexOf('（　）')>=0?bl.q.replace('（　）',bl.o[bl.a]):bl.o[bl.a]));};});}

var _blobs={};
function cachedUrl(url,cb){
 if(_blobs[url])return cb(_blobs[url]);
 if(!window.caches)return cb(url);
 caches.open('n2audio').then(function(ca){return ca.match(url);}).then(function(r){if(r)return r.blob().then(function(bl){_blobs[url]=URL.createObjectURL(bl);cb(_blobs[url]);});cb(url);}).catch(function(){cb(url);});}
function dlAll(urls,st,done){
 if(!window.caches){st.textContent='此浏览器不支持离线缓存';return;}
 var n=0,fail=0,i=0,tot=urls.length;
 caches.open('n2audio').then(function(ca){
  function one(){
   if(i>=tot){if(--act===0){st.textContent=fail?('完成，但有 '+fail+' 个失败（请联网重试）'):'已全部下载 ✓（'+tot+' 个）';if(done)done();}return;}
   var u=urls[i++];
   ca.match(u).then(function(r){if(r)return;return fetch(u).then(function(rs){if(rs.ok)return ca.put(u,rs);fail++;});}).catch(function(){fail++;}).then(function(){n++;st.textContent=n+' / '+tot+(fail?'（失败 '+fail+'）':'');one();});}
  var act=3;one();one();one();});}
function cacheCount(urls,cb){
 if(!window.caches)return cb(-1);
 caches.open('n2audio').then(function(ca){var c=0,k=0;urls.forEach(function(u){ca.match(u).then(function(r){if(r)c++;if(++k===urls.length)cb(c);}).catch(function(){if(++k===urls.length)cb(c);});});});}
function ttsUrls(){var o=[],seen={};for(var k in DATA.tts){var u=DATA.tts[k];if(!seen[u]){seen[u]=1;o.push(u);}}return o;}
function wordUrls(){var o=[],seen={};for(var k in (DATA.wtts||{})){var u=DATA.wtts[k];if(!seen[u]){seen[u]=1;o.push(u);}}return o;}
function clipUrls(){var o=[];DATA.audio.forEach(function(p){p.clips.forEach(function(c){o.push(c.f);});});return o;}
function dlBlock(n,label){return '<div class=noteb data-nohl=1><p style="margin:0 0 6px"><b>离线语音</b> <span class=note>（出门没网也能听，联网时点一次）</span></p><p style="margin:0"><button id=dl'+n+' class=btn>⬇ '+label+'</button> <span id=dl'+n+'s class=note></span></p></div>';}
function dlWire(){[['1',ttsUrls],['2',clipUrls],['3',wordUrls]].forEach(function(p){var b=$('#dl'+p[0]);if(!b)return;var u=p[1](),st=$('#dl'+p[0]+'s');
  cacheCount(u,function(c){if(c>=0)st.textContent='已存 '+c+' / '+u.length+(c===u.length?' ✓':'');});
  b.onclick=function(){dlAll(u,st);};});}
function settings(){
 var h='<h1>设置</h1><label>考试日期 <input type=date id=exam value="'+S.exam+'"></label><p><button id=exp class=btn>导出进度</button> <button id=imp class=btn>导入进度</button></p><textarea id=ta rows=5></textarea><p><button id=rep class=btn>复制学习报告（发给 Claude）</button></p><p class=note>离线语音下载按钮在需要的页面里：听力页、生词本、课程页和自由练习页。</p><p><button id=miss class=btn>复制“缺语音的词句清单”（发给 Claude 补合成）</button> <span id=missn class=note></span></p><p class=note>下载完会显示“已全部下载 ✓”。建议在 Wi‑Fi 下进行，下载时不要关页面。iPhone 对网站存储有上限，长期不打开可能被系统清理，出发前再打开确认一次。</p><p><button id=rst class="btn bad">重置</button></p>';
 render(h);
 $('#exam').onchange=function(){S.exam=this.value;save();};
 $('#exp').onclick=function(){$('#ta').value=JSON.stringify(S);};
 var mk=Object.keys(S.miss||{});$('#missn').textContent='目前 '+mk.length+' 条';$('#miss').onclick=function(){var r=JSON.stringify(mk);$('#ta').value=r;try{navigator.clipboard.writeText(r);}catch(e){}$('#ta').select();};
 $('#imp').onclick=function(){try{S=JSON.parse($('#ta').value);save();alert('已导入');}catch(e){alert('格式错误');}};
 $('#rep').onclick=function(){var r=report();$('#ta').value=r;try{navigator.clipboard.writeText(r);}catch(e){}$('#ta').select();};
 $('#rst').onclick=function(){if(confirm('确定重置？')){S=null;try{localStorage.removeItem(KEY);}catch(e){}load();save();route();}};}

/* ===== 生词本 ===== */
function vbList(){S.vb=S.vb||{list:[]};S.vb.list=S.vb.list||[];if(!S.vb.v2&&typeof trFor==='function'&&window.DATA){S.vb.v2=1;S.vb.list.forEach(function(e){e.tr=trFor(e.ctx||'');});save();}return S.vb.list;}
function vbDue(){var t=dayNum();return vbList().filter(function(e){return e.due<=t;});}
function lemOf(w){var L=window.DATA&&DATA.lem;var x=L&&L[String(w).replace(/\s+/g,'')];return x&&x!==w?x:'';}
function vbFind(w){var L=vbList();for(var i=0;i<L.length;i++)if(L[i].w===w)return L[i];return null;}
function vbAdd(w,ctx,m,src,tr){
 var e=vbFind(w),t=dayNum();
 if(e){if(m)e.m=m;if(tr&&!e.tr)e.tr=tr;if(ctx&&ctx.length>(e.ctx||'').length&&ctx.indexOf(w)>=0)e.ctx=ctx;save();return false;}
 vbList().push({id:'w'+Date.now()+Math.floor(Math.random()*1000),w:w,r:vbRead(w),ctx:ctx||w,m:m||glLookup(w)||'',auto:m?0:1,tr:tr||'',src:src||'',add:t,box:0,due:t,n:0,wr:0});save();return true;}
function ctxOf(range,txt){
 var node=range.commonAncestorContainer,el=node.nodeType===3?node.parentNode:node,mn=document.querySelector('main');
 while(el&&el!==mn&&/^(B|U|I|SPAN|A|SMALL|EM|STRONG)$/.test(el.tagName))el=el.parentNode;
 var full=(el&&(el.innerText||el.textContent))||txt,i=full.indexOf(txt);
 if(i<0)return txt;
 var s=0,e=full.length,k,m,re=/[男女ＭＦMF]\s*[:：]/g;
 for(k=i-1;k>=0;k--){if('。！？!?'.indexOf(full.charAt(k))>=0){s=k+1;break;}}
 re.lastIndex=0;while((m=re.exec(full))&&m.index<=i){if(m.index+m[0].length<=i)s=Math.max(s,m.index);}
 for(k=i+txt.length;k<full.length;k++){if('。！？!?'.indexOf(full.charAt(k))>=0){e=k+1;break;}}
 re.lastIndex=i+txt.length;m=re.exec(full);if(m&&m.index<e)e=m.index;
 var c=full.slice(s,e).replace(/([^\x00-\x7f])\s+(?=[^\x00-\x7f])/g,'$1').replace(/\s+/g,' ').replace(/^[ＭＦMF]\s*[:：]\s*/,'').trim();
 if(c.length>140)c=c.slice(Math.max(0,c.indexOf(txt)-50),c.indexOf(txt)+txt.length+60);
 return c;}
var TR=null;
function nz(s){return String(s||'').replace(/[\s\u3000]+/g,'');}
function trInit(){
 TR=[];var D=window.DATA||{};
 (D.lq||[]).forEach(function(x){var z=D.lqzh&&D.lqzh[x.id];if(z&&z.s&&x.s)TR.push({o:nz(x.s),ro:x.s,z:z.s});});
 var R=D.rdp||{},Z=D.rdpzh||{};Object.keys(Z).forEach(function(k){if(R[k])TR.push({o:nz(R[k]),ro:R[k],z:Z[k]});});}
function sentSplit(t){return (t.match(/[^。！？!?\n]+[。！？!?]?/g)||[]).map(function(x){return x.trim();}).filter(Boolean);}
function trFor(sent){
 if(!TR)trInit();var n=nz(sent),e=null,i;
 if(n.length<8)return '';
 for(i=0;i<TR.length;i++)if(TR[i].o.indexOf(n)>=0){e=TR[i];break;}
 if(!e)return '';
 var tre=/(?=[男女MFＭＦ]\s*[:：])/,ot=e.ro.split(tre).filter(function(x){return x.trim();}),zt=e.z.split(/\n(?=[男女]：)|(?=[男女]：)/).filter(function(x){return x.trim();});
 if(ot.length>1&&ot.length===zt.length){for(i=0;i<ot.length;i++)if(nz(ot[i]).indexOf(n)>=0)return zt[i].replace(/\s+/g,' ').trim().slice(0,220);}
 var os=sentSplit(e.ro),zs=sentSplit(e.z.replace(/\n/g,'。')),k=-1;
 for(i=0;i<os.length;i++)if(nz(os[i]).indexOf(n)>=0||n.indexOf(nz(os[i]))>=0&&nz(os[i]).length>3){k=i;break;}
 if(k<0||!zs.length)return '';
 var a=Math.floor(k*zs.length/os.length),b=Math.max(a+1,Math.ceil((k+1)*zs.length/os.length));
 return zs.slice(a,b).join('').slice(0,220);}
var vbCur=null,vbPin=false,vbTimer=null;
function vbBar(){var b=document.getElementById('vbbar');if(b)return b;
 b=document.createElement('div');b.id='vbbar';
 b.innerHTML='<div class=vbrow><b id=vbw></b> <button id=vbx class="btn small">✕</button></div><div class=vbrow><button id=vbadd class="btn good">＋ 加入生词本（自动附带这句话和译文）</button></div>';
 document.body.appendChild(b);
 ['touchstart','mousedown'].forEach(function(ev){b.addEventListener(ev,function(){vbPin=true;});});
 $('#vbx',b).onclick=function(){vbHide();};
 $('#vbadd',b).onclick=function(){
  if(!vbCur)return;
  var isNew=vbAdd(vbCur.w,vbCur.ctx,'',vbCur.src,vbCur.tr);
  vbToast((isNew?'已加入生词本：':'已更新：')+vbCur.w+'（共 '+vbList().length+' 个）');vbHide();vbHL();};
 return b;}
function vbHide(){var b=document.getElementById('vbbar');if(b)b.style.display='none';vbPin=false;vbCur=null;try{window.getSelection().removeAllRanges();}catch(e){}}
function vbToast(t){var d=document.createElement('div');d.className='vbtoast';d.textContent=t;document.body.appendChild(d);setTimeout(function(){d.remove();},2200);}
document.addEventListener('selectionchange',function(){
 var sel=window.getSelection();if(!sel||!sel.rangeCount)return;
 var txt=sel.toString().replace(/\s+/g,' ').trim(),r=sel.getRangeAt(0),mn=document.querySelector('main');
 var inBar=document.getElementById('vbbar')&&document.getElementById('vbbar').contains(document.activeElement);
 if(!txt||txt.length>40||!mn||!mn.contains(r.commonAncestorContainer)||/^(INPUT|TEXTAREA|BUTTON)$/.test((r.commonAncestorContainer.nodeType===3?r.commonAncestorContainer.parentNode:r.commonAncestorContainer).tagName||'')||document.querySelector('[data-nosel]')&&document.querySelector('[data-nosel]').contains(r.commonAncestorContainer)){
  if(!vbPin&&!inBar){clearTimeout(vbTimer);vbTimer=setTimeout(function(){if(!vbPin){var b=document.getElementById('vbbar');if(b&&!b.contains(document.activeElement))b.style.display='none';}},350);}
  return;}
 clearTimeout(vbTimer);
 var h1=document.querySelector('main h1');
 var cx=ctxOf(r,txt);vbCur={w:txt,ctx:cx,tr:trFor(cx),src:h1?h1.textContent.replace(/\s+还剩.*$/,'').replace(/^\d+ \/ \d+\s*/,''):''};
 var b=vbBar();$('#vbw',b).textContent='「'+txt+'」'+(lemOf(txt)?'（原形：'+lemOf(txt)+'）':'')+(vbFind(txt)?'（已在生词本）':'');b.style.display='block';});
function vbHL(){
 var L=vbList();if(!L.length)return;
 var ws=L.map(function(e){return e.w;}).sort(function(a,b){return b.length-a.length;});
 var re=new RegExp(ws.map(function(w){return w.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');}).join('|'),'g');
 var mn=document.querySelector('main');if(!mn||mn.querySelector('[data-nohl]'))return;
 if(obs)obs.disconnect();
 var wk=document.createTreeWalker(mn,NodeFilter.SHOW_TEXT,{acceptNode:function(n){var p=n.parentNode;
  if(!n.nodeValue||!n.nodeValue.trim())return NodeFilter.FILTER_REJECT;
  if(p.closest&&p.closest('button,input,textarea,h1,.vbu,#vbbar,.opt,.tile,[lang=zh]'))return NodeFilter.FILTER_REJECT;
  var hit=re.test(n.nodeValue);re.lastIndex=0;return hit?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT;}});
 var nodes=[],n;while((n=wk.nextNode()))nodes.push(n);
 nodes.forEach(function(n){
  var s=n.nodeValue,fr=document.createDocumentFragment(),last=0,m;re.lastIndex=0;
  while((m=re.exec(s))){if(m.index>last)fr.appendChild(document.createTextNode(s.slice(last,m.index)));
   var u=document.createElement('span');u.className='vbu';u.textContent=m[0];var e=vbFind(m[0]);if(e&&e.m)u.title=e.m;fr.appendChild(u);last=m.index+m[0].length;}
  if(last<s.length)fr.appendChild(document.createTextNode(s.slice(last)));
  n.parentNode.replaceChild(fr,n);});
 if(obs)obs.observe(app,{childList:true,subtree:true});}
var obs=null,obsT=null;
function vbInit(){if(!window.MutationObserver)return;obs=new MutationObserver(function(){clearTimeout(obsT);obsT=setTimeout(vbHL,60);});obs.observe(app,{childList:true,subtree:true});}

var GL=null,GSF=null;
function glInit(){GL={};GSF={};String(window.DATA.gl||'').split('\n').forEach(function(l){var i=l.indexOf('=');if(i>0)GL[l.slice(0,i)]=l.slice(i+1);});
 String(window.DATA.sf||'').split('\n').forEach(function(l){var i=l.indexOf('>');if(i>0)GSF[l.slice(0,i)]=l.slice(i+1);});
 (DATA.vocab||[]).forEach(function(v){if(v.w&&v.zh&&!/[〜~]/.test(v.w))GL[v.w]=v.zh.replace(/（[^）]*）/g,'').replace(/\s+$/,'')||v.zh;});}
function glLookup(sel){
 if(!GL)glInit();
 var key=GL[sel]!=null?sel:(GSF[sel]&&GL[GSF[sel]]!=null?GSF[sel]:null);
 if(key!=null)return GL[key];
 var out=[],seen={},i=0,n=sel.length;
 while(i<n){var hit=null,j;
  for(j=Math.min(n,i+10);j>i;j--){var sub=sel.slice(i,j);
   if(GL[sub]!=null){hit=[sub,GL[sub],j];break;}
   if(GSF[sub]&&GL[GSF[sub]]!=null){hit=[GSF[sub],GL[GSF[sub]],j];break;}}
  if(hit){if(!seen[hit[0]]){seen[hit[0]]=1;out.push(hit);}i=hit[2];}else i++;}
 if(!out.length)return '';
 if(out.length===1)return out[0][1];
 return out.slice(0,3).map(function(h){return h[1].split('；')[0];}).join('＋');}
function vbFill(){var n=0;vbList().forEach(function(e){if(!e.m){var m=glLookup(e.w);if(m){e.m=m;e.auto=1;n++;}}});if(n)save();return n;}
var RT=null;
function kh(c){return c>='\u30a1'&&c<='\u30f6'?String.fromCharCode(c.charCodeAt(0)-0x60):c;}
function vbRead(w){
 if(!/[\u4e00-\u9fff々〆]/.test(w))return '';
 if(!RT){RT={};String(window.DATA.rt||'').split('\n').forEach(function(l){var i=l.indexOf('|');if(i>0)RT[l.slice(0,i)]=l.slice(i+1);});
  (DATA.vocab||[]).forEach(function(v){if(v.w&&v.r&&/^[\u4e00-\u9fff]/.test(v.w)&&!/[〜~（(]/.test(v.w)&&/^[ぁ-ゖー]+$/.test(v.r))RT[v.w]=v.r;});}
 var n=w.length,best=[],i,j;best[0]='';
 for(i=0;i<n;i++){if(best[i]==null)continue;
  for(j=Math.min(n,i+8);j>i;j--){var sub=w.slice(i,j),r=RT[sub];
   if(r!=null){if(best[j]==null)best[j]=best[i]+r;}
   else if(j===i+1){var c=sub;if(/[ぁ-ゖー]/.test(c)||/[ァ-ヺー]/.test(c)){if(best[j]==null)best[j]=best[i]+kh(c);}}}}
 return best[n]!=null?best[n]:'';}
function rdVariants(r){
 var out=[],dk={'か':'が','き':'ぎ','く':'ぐ','け':'げ','こ':'ご','さ':'ざ','し':'じ','す':'ず','せ':'ぜ','そ':'ぞ','た':'だ','ち':'ぢ','て':'で','と':'ど','は':'ば','ひ':'び','ふ':'ぶ','へ':'べ','ほ':'ぼ'},ud={};
 Object.keys(dk).forEach(function(k){ud[dk[k]]=k;});
 var i,c;
 for(i=0;i<r.length;i++){c=r.charAt(i);var m=dk[c]||ud[c];if(m)out.push(r.slice(0,i)+m+r.slice(i+1));
  if(c==='う'&&i>0)out.push(r.slice(0,i)+r.slice(i+1));
  if(/[ぁ-んー]/.test(c)&&c!=='っ'&&c!=='ー'&&i>0&&i<r.length-1&&/[かきくけこさしすせそたちつてとぱぴぷぺぽ]/.test(r.charAt(i+1)))out.push(r.slice(0,i+1)+'っ'+r.slice(i+1));
  if(/[おこそとのほもよろ]/.test(c)&&r.charAt(i+1)!=='う'&&i<r.length-1)out.push(r.slice(0,i+1)+'う'+r.slice(i+1));}
 return shuffle(out.filter(function(x,k){return x!==r&&out.indexOf(x)===k&&!/ぢ|づ|[ゃゅょうんいー]っ|っ$|^っ/.test(x);}));}
function vbPool(kind,exclude){
 var out=[];vbList().forEach(function(e){var v=kind==='w'?e.w:e.m;if(v&&v!==exclude&&out.indexOf(v)<0)out.push(v);});
 (DATA.vocab||[]).forEach(function(v){var x=kind==='w'?v.w:(v.zh||'').replace(/（.*$/,'');if(x&&x.indexOf('〜')<0&&x!==exclude&&out.indexOf(x)<0)out.push(x);});
 return out;}
function vbQuestion(e){
 if(!e.r&&/[\u4e00-\u9fff々〆]/.test(e.w)){e.r=vbRead(e.w);}
 var types=[];if(e.r)types.push('r');if(e.m)types.push('m');
 if(!types.length)return {t:'f'};
 var t=types[(e.n||0)%types.length],ans,ds;
 if(t==='r'){ans=e.r;ds=rdVariants(e.r).slice(0,3);
  if(ds.length<3){var pool=[];vbList().forEach(function(x){if(x.r&&x.r!==ans&&pool.indexOf(x.r)<0)pool.push(x.r);});(DATA.vocab||[]).forEach(function(v){if(v.r&&v.r!==ans&&/^[ぁ-ゖー]+$/.test(v.r)&&Math.abs(v.r.length-ans.length)<=2&&pool.indexOf(v.r)<0)pool.push(v.r);});
   shuffle(pool).forEach(function(x){if(ds.length<3&&ds.indexOf(x)<0)ds.push(x);});}}
 else{ans=e.m;ds=shuffle(vbPool('m',ans)).slice(0,3);}
 var opts=shuffle([ans].concat(ds));
 return {t:t,opts:opts,a:opts.indexOf(ans),q:e.w,
  p:(t==='r'?'选出这个词的读音':'选出这个词的意思')+(e.ctx&&e.ctx!==e.w?'\n出处句：'+e.ctx:'')};}
function vbReview(list){
 vbFill();
 var q=shuffle(list).slice(0,20),total=q.length,right=0,done=0,fl={};
 function step(){
  if(!q.length){render('<h1>生词本复习完成</h1><p class=big>一次答对 '+right+' / '+total+'</p><a class=btn href="#/vb">回生词本</a> <a class=btn href="#/home">首页</a>');return;}
  var e=q.shift(),Q=vbQuestion(e),h='<h1 data-nohl=1>'+(done+1)+' / '+total+' <small>还剩 '+(q.length+1)+'</small></h1><div data-nohl=1 data-nosel=1>';
  if(Q.t==='f')h+='<p class=big>'+esc(e.w)+' <button class="btn small" id=vsw>🔊</button></p><p class=note>没有可出的题目，先自己回忆，再点“看答案”。</p><p><button id=vshow class=btn>看答案</button></p>';
  else{h+='<p class=note>'+esc(Q.p).replace(/\n/g,'<br>')+'</p><p class=q>'+esc(Q.q)+' <button class="btn small" id=vsw>🔊</button></p>'+Q.opts.map(function(o,i){return '<button class="opt btn" data-i="'+i+'">'+(i+1)+'. '+esc(o)+'</button>';}).join('');}
  h+='<div id=vfb></div></div>';render(h);
  if($('#vsw'))$('#vsw').onclick=function(){speak(e.r||e.w);};
  function reveal(ok){
   var t=dayNum();e.n=(e.n||0)+1;
   if(ok){if(!fl[e.id])fsrs(e,true,t);else{e.box=0;e.due=t+1;}right+=(fl[e.id]?0:1);}
   else{e.wr=(e.wr||0)+1;if(!fl[e.id])fsrs(e,false,t);e.box=0;e.due=t+(fl[e.id]?1:0);if(!fl[e.id]){fl[e.id]=1;total++;q.splice(Math.min(3,q.length),0,e);}}
   bump('vb');save();done++;
   $('#vfb').innerHTML=(Q.t==='f'?'':(ok?'<p class=ok>✔ 正解</p>':'<p class=ng>✘ 正解：'+esc(Q.opts[Q.a])+(fl[e.id]&&!ok&&q.indexOf(e)>=0?'（稍后再出现一次）':'')+'</p>'))+
    '<div class=noteb><b>'+esc(e.w)+'</b>'+(e.r?'　【'+esc(e.r)+'】':'')+(lemOf(e.w)?'　<span class=note>原形：'+esc(lemOf(e.w))+'</span>':'')+(e.m?'　'+esc(e.m):'')+'<br><span class=note>'+esc(e.ctx)+'</span>'+(e.tr?'<br><span class=note>译：'+esc(e.tr)+'</span>':'')+(e.src?'<br><span class=note>出处：'+esc(e.src)+'</span>':'')+'</div><p><button id=vsw2 class=btn>🔊 词</button> <button id=vsp class=btn>🔊 听句子</button> <button id=vnx class="btn good">下一个 →</button></p>';
   $('#vsw2').onclick=function(){speak(e.r||e.w);};$('#vsp').onclick=function(){speak(e.ctx);};$('#vnx').onclick=step;}
  if(Q.t==='f'){$('#vshow').onclick=function(){this.style.display='none';$('#vfb').innerHTML='<div class=noteb><b>'+esc(e.w)+'</b><br><span class=note>'+esc(e.ctx)+'</span></div><p><button id=vok class="btn good">想起来了</button> <button id=vng class="btn bad">没想起来</button></p>';$('#vok').onclick=function(){$('#vok').parentNode.innerHTML='';reveal(true);};$('#vng').onclick=function(){$('#vng').parentNode.innerHTML='';reveal(false);};};}
  else{[].forEach.call(document.querySelectorAll('.opt'),function(b){b.onclick=function(){var i=+b.getAttribute('data-i'),ok=i===Q.a;
   [].forEach.call(document.querySelectorAll('.opt'),function(x){x.disabled=true;if(+x.getAttribute('data-i')===Q.a)x.className+=' right';});if(!ok)b.className+=' wrong';reveal(ok);};});}
 }
 step();}
function vbView(){
 vbFill();
 var L=vbList().slice().sort(function(a,b){return b.add-a.add;}),due=vbDue();
 var h='<h1 data-nohl=1>生词本</h1><div data-nohl=1><p>共 <b>'+L.length+'</b> 个，今天到期 <b>'+due.length+'</b> 个。</p><p class=note>在听力原文、阅读文章或讲解里，用手指划选一个词/表达，底部会出现“加入生词本”。已加入的词会在文中划线。复习是选择题：选读音和选意思，交替出现；释义和读音都是自动补的，不对可点“改意思”。</p>';
 if(due.length)h+='<a class=btn id=vgo href="#">复习今天到期的（'+Math.min(due.length,20)+'）</a> ';
 if(L.length)h+='<a class=btn id=vall href="#">随机练习（最多20）</a>';
 h+='<div id=vlist>';
 L.forEach(function(e){h+='<div class=noteb><b>'+esc(e.w)+'</b>'+(e.r?'　【'+esc(e.r)+'】':'')+(lemOf(e.w)?'　<span class=note>原形：'+esc(lemOf(e.w))+'</span>':'')+(e.m?'　'+esc(e.m):'')+'<br><span class=note>'+esc(e.ctx)+(e.tr?'<br>译：'+esc(e.tr):'')+(e.src?' · '+esc(e.src):'')+'</span><br><button class="btn small" data-s="'+e.id+'">🔊</button> <button class="btn small" data-m="'+e.id+'">改意思</button> <button class="btn small" data-d="'+e.id+'">删除</button></div>';});
 h+='</div></div>';
 if(!L.length)h+='<p data-nohl=1>还没有生词。</p>';
 h+=dlBlock(3,'听力和阅读里所有词的朗读（约38MB）');render(h);dlWire();
 if($('#vgo'))$('#vgo').onclick=function(ev){ev.preventDefault();vbReview(due);};
 if($('#vall'))$('#vall').onclick=function(ev){ev.preventDefault();vbReview(vbList());};
 [].forEach.call(document.querySelectorAll('[data-s]'),function(b){b.onclick=function(){var e=vbList().filter(function(x){return x.id===b.getAttribute('data-s');})[0];if(e){var T=Object.assign({},(window.DATA&&DATA.wtts)||{},(window.DATA&&DATA.tts)||{});var wd=T[e.w]?e.w:(T[e.r]?e.r:(e.r||e.w));speak(wd,function(){if(e.ctx&&T[e.ctx])speak(e.ctx);});}};});
 [].forEach.call(document.querySelectorAll('[data-m]'),function(b){b.onclick=function(){var e=vbList().filter(function(x){return x.id===b.getAttribute('data-m');})[0];var v=window.prompt('「'+e.w+'」的意思：',e.m||'');if(v!==null){e.m=v.trim();save();vbView();}};});
 [].forEach.call(document.querySelectorAll('[data-d]'),function(b){b.onclick=function(){var id=b.getAttribute('data-d');if(window.confirm('删除这个生词？')){S.vb.list=vbList().filter(function(x){return x.id!==id;});save();vbView();}};});}

var KEEP={},curHash=null;
function isSess(h){return /^#\/(quiz|cards|t|wrongquiz|wrongall)\//.test(h)||/^#\/(wrongquiz|wrongall)$/.test(h);}
function route(){
 var nh=location.hash||'#/home';
 var mn=document.querySelector('main');
 if(curHash&&curHash!==nh&&isSess(curHash)){
  if(mn&&mn.querySelector('.opt,#nx,#nx2,#chk,#play')){var fr=document.createDocumentFragment();while(mn.firstChild)fr.appendChild(mn.firstChild);KEEP[curHash]=fr;var ks=Object.keys(KEEP);if(ks.length>5)delete KEEP[ks[0]];}
  else delete KEEP[curHash];}
 if(KEEP[nh]&&isSess(nh)){var fr2=KEEP[nh];delete KEEP[nh];render('');document.querySelector('main').appendChild(fr2);curHash=nh;return;}
 curHash=nh;
 var p=nh.slice(2).split('/');
 var v=p[0];
 if(v==='cards'&&DECKS[p[1]])cards(p[1]);
 else if(v==='quiz'&&SETS[p[1]])quiz(p[1]);
 else if(v==='audio'){if(p[1])audioPaper(p[1]);else audioHome();}
 else if(v==='clip')clipView(p[1],p[2]);
 else if(v==='today')today();
 else if(v==='t')runTask(p[1]);
 else if(v==='wrong')wrongView();
 else if(v==='wrongquiz'){var ids=wrongDue();if(ids.length)quiz(null,ids);else wrongView();}
 else if(v==='wrongall'){var ids2=wrongOpen();if(ids2.length)quiz(null,ids2);else wrongView();}
 else if(v==='vb')vbView();else if(v==='badges')badgesView();
 else if(v==='free')home();
 else if(v==='lessons')lessonsView();
 else if(v==='lesson')lessonView(p[1]);
 else if(v==='settings')settings();
 else home();}
window.addEventListener('hashchange',route);
load();vbInit();route();
if('serviceWorker' in navigator&&location.protocol.indexOf('http')===0)navigator.serviceWorker.register('sw.js').catch(function(){});
})();
