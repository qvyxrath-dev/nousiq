var tg = window.Telegram && window.Telegram.WebApp;
if (tg) { try { tg.ready(); tg.expand(); tg.setBackgroundColor("#f2f3f8"); tg.setHeaderColor("#f2f3f8"); } catch(e){} }
var TU = tg && tg.initDataUnsafe && tg.initDataUnsafe.user;
var BOT = "https://t.me/nousiq_bot"; // ссылка на твоего бота
var KEY = "nous", S = load(), app = document.getElementById("app");
function load(){ try{ var s = JSON.parse(localStorage.getItem(KEY)); if (s) return s; }catch(e){} return {name:"",photo:"",results:[],plan:null}; }
function save(){ try{ localStorage.setItem(KEY, JSON.stringify(S)); }catch(e){} }
function $(id){ return document.getElementById(id); }
function esc(s){ return String(s).replace(/[&<>"]/g, function(c){ return {"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]; }); }
function toast(t){ var d = document.createElement("div"); d.className = "toast"; d.textContent = t; document.body.appendChild(d); setTimeout(function(){ d.remove(); }, 2000); }
var I = {
scan:'<path d="M4 8V6a2 2 0 0 1 2-2h2M16 4h2a2 2 0 0 1 2 2v2M20 16v2a2 2 0 0 1-2 2h-2M8 20H6a2 2 0 0 1-2-2v-2"/><circle cx="12" cy="10" r="2.5"/><path d="M7.5 17c.8-2 2.6-3 4.5-3s3.7 1 4.5 3"/>',
cal:'<rect x="4" y="5" width="16" height="15" rx="3"/><path d="M8 3v4M16 3v4M4 10h16"/>',
chart:'<path d="M4 4v16h16"/><path d="M7 15l4-4 3 3 5-6"/>',
share:'<path d="M12 15V4M8 8l4-4 4 4"/><path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6"/>',
home:'<path d="M4 11l8-7 8 7v8a1 1 0 0 1-1 1h-4v-6H9v6H5a1 1 0 0 1-1-1z"/>',
user:'<circle cx="12" cy="8" r="4"/><path d="M4 20c1-4 4-6 8-6s7 2 8 6"/>',
chev:'<path d="M9 5l7 7-7 7"/>',
bars:'<rect x="4" y="13" width="4" height="7" rx="1"/><rect x="10" y="8" width="4" height="12" rx="1"/><rect x="16" y="3" width="4" height="17" rx="1"/>',
spark:'<path d="M10 4l1.6 4.4L16 10l-4.4 1.6L10 16l-1.6-4.4L4 10l4.4-1.6z"/><path d="M18 14l.8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8z"/>',
msg:'<path d="M12 4a8 8 0 0 0-6.9 12L4 20l4.2-1.1A8 8 0 1 0 12 4z"/>',
trash:'<path d="M5 7h14M10 7V5h4v2M7 7l1 13h8l1-13M10 11v6M14 11v6"/>',
back:'<path d="M15 5l-7 7 7 7"/>'
};
function ic(n,s){ s = s || 26; return '<svg width="'+s+'" height="'+s+'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">'+I[n]+'</svg>'; }
var AGES = ["До 12 лет", "12–17 лет", "18–35 лет", "36+ лет"];
var tick = null;
function rng(seed){ return function(){ seed = (seed * 1664525 + 1013904223) % 4294967296; return seed / 4294967296; }; }
function pick(r, a){ return a[Math.floor(r() * a.length)]; }
function shuffle(r, a){ a = a.slice(); for (var i = a.length - 1; i > 0; i--){ var j = Math.floor(r() * (i + 1)), x = a[i]; a[i] = a[j]; a[j] = x; } return a; }
function makeRule(r, tier){
var k = pick(r, tier === 0 ? [1, 2, 3] : tier < 3 ? [1, 2, 3, 3] : [3, 3, 3, 1, 2]);
if (k < 3) return {k: k, v: shuffle(r, [0, 1, 2])};
return {k: 3, a: pick(r, [1, 2]), b: pick(r, [1, 2]), c: Math.floor(r() * 3)};
}
function val(u, row, col){ return u.k === 0 ? u.c : u.k === 1 ? u.v[row] : u.k === 2 ? u.v[col] : (u.a * row + u.b * col + u.c) % 3; }
function puzzle(r, tier){
var vary = shuffle(r, [0, 1, 2, 3]).slice(0, Math.min(4, tier + 1));
var rules = [0, 1, 2, 3].map(function(n){ return vary.indexOf(n) > -1 ? makeRule(r, tier) : {k: 0, c: Math.floor(r() * 3)}; });
var cells = [];
for (var row = 0; row < 3; row++) for (var col = 0; col < 3; col++) cells.push(rules.map(function(u){ return val(u, row, col); }));
var ans = cells[8], key = function(c){ return c.join(""); }, pool = [], seen = {};
seen[key(ans)] = 1;
function add(c){ var s = key(c); if (!seen[s]){ seen[s] = 1; pool.push(c); } }
for (var n = 0; n < 4; n++) for (var v = 0; v < 3; v++) if (v !== ans[n]){ var c1 = ans.slice(); c1[n] = v; add(c1); }
for (var i = 0; i < 14; i++){ var c2 = ans.slice(); c2[Math.floor(r() * 4)] = Math.floor(r() * 3); c2[Math.floor(r() * 4)] = Math.floor(r() * 3); add(c2); }
var opts = shuffle(r, shuffle(r, pool).slice(0, 5).concat([ans]));
return {cells: cells, opts: opts, a: opts.map(key).indexOf(key(ans))};
}
function makeTest(ag){
var r = rng(Date.now() % 1000003 + 11), qs = [], off = ag === "До 12 лет" ? 1 : 0;
for (var i = 0; i < 60; i++) qs.push(puzzle(r, Math.max(0, Math.min(4, Math.floor(i / 12) - off))));
return {qs: qs, i: 0, s: 0, end: Date.now() + 30 * 60 * 1000};
}
function cellSvg(c){
var rad = [13, 9, 6.5][c[1]];
var pos = [[[30, 30]], [[18, 30], [42, 30]], [[30, 17], [17, 42], [43, 42]]][c[1]];
var col = ["#14453b", "#e0892b", "#5b4bd6"][c[2]], f = c[3] === 0 ? "#fff" : col, fo = c[3] === 1 ? .35 : 1, s = "";
pos.forEach(function(p){
var x = p[0], y = p[1];
s += c[0] === 0 ? '<circle cx="' + x + '" cy="' + y + '" r="' + rad + '"'
: c[0] === 1 ? '<rect x="' + (x - rad * .9) + '" y="' + (y - rad * .9) + '" width="' + (rad * 1.8) + '" height="' + (rad * 1.8) + '"'
: '<polygon points="' + x + ',' + (y - rad) + ' ' + (x + rad) + ',' + (y + rad * .8) + ' ' + (x - rad) + ',' + (y + rad * .8) + '"';
s += ' fill="' + f + '" fill-opacity="' + fo + '" stroke="' + col + '" stroke-width="2" stroke-linejoin="round"/>';
});
return '<svg viewBox="0 0 60 60">' + s + '</svg>';
}
var LABELS = ["Есть куда расти","Средний диапазон","Выше среднего","Высокий результат"];
var REC = ["Начни с числовых рядов и простой логики, по 10 минут в день.","Укрепляй логические выводы и внимание: ряды, аналогии, задачи на скорость.","Добавь сложные задачи: многошаговые ряды, логические цепочки, чтение.","Поддерживай форму: сложные головоломки, новые навыки, регулярное чтение."];
var TH = [
["Числовые ряды","Реши {1} числовых рядов и объясни закономерность вслух."],
["Логика","Разбери {1} логических задач «если… то…» и найди ошибки в рассуждениях."],
["Память","Запомни {2} слов или цифр, повтори через час и вечером."],
["Внимание и скорость","Реши {3} примеров на скорость и побей вчерашнее время."],
["Пространство","Реши {1} головоломок: пазл, танграм или лабиринт."],
["Чтение и слова","Прочитай {1} страниц и выпиши 3 новых слова с примерами."]
];
function band(iq){ return iq < 85 ? 0 : iq < 100 ? 1 : iq < 115 ? 2 : 3; }
function last(){ return S.results[S.results.length-1]; }
function uname(){ return S.name || (TU ? TU.first_name : "Гость"); }
function av(sz){ var src = (TU && TU.photo_url) || ""; return '<div class="av" style="width:'+sz+'px;height:'+sz+'px">' + (src ? '<img src="'+esc(src)+'" alt="">' : esc(uname().charAt(0).toUpperCase())) + '</div>'; }
function task(d, g){
if (d % 7 === 0) return ["День отдыха ума","Прогуляйся 10 минут без телефона и запиши 3 вещи, которые узнал за неделю."];
if (d === 30 || d === 60) return ["Контрольный анализ","Пройди анализ снова во вкладке «Анализ» и сравни с прошлым результатом."];
var n = 3 + Math.floor((d-1)/6), t = TH[(d-1) % 6];
return [t[0], t[1].replace(/\{(\d+)\}/g, function(_,k){ return n*k; })];
}
var view = "home", after = null, age = "", T = null, goal = 10, selDay = 0;
function go(v){ view = v; render(); window.scrollTo(0,0); }
var TAB = {home:"home",analysis:"analysis",test:"analysis",loading:"analysis",result:"analysis",course:"course",profile:"profile",tiers:"profile",how:"profile"};
function navHtml(){
return '<nav>' + [["home","Главная"],["analysis","Анализ","scan"],["course","Курс","cal"],["profile","Профиль","user"]].map(function(t){
return '<button data-go="'+t[0]+'" class="'+(TAB[view]===t[0]?'on':'')+'">'+ic(t[2]||t[0])+t[1]+'</button>'; }).join('') + '</nav>';
}
function render(){
clearInterval(tick);
after = null;
var h = ({home:home,analysis:analysis,test:test,loading:loading,result:result,course:course,profile:profile,tiers:tiers,how:how})[view]();
app.innerHTML = h + ((view==="test"||view==="loading") ? "" : navHtml());
app.querySelectorAll("[data-go]").forEach(function(b){ b.onclick = function(){ act(b.dataset.go); }; });
if (after) after();
}
function act(a){
if (a === "share") return share();
if (a === "sharebot") return share(true);
if (a === "chat") return chat();
if (a === "reset"){ S.plan = null; selDay = 0; save(); toast("Курс сброшен"); return render(); }
if (a === "wipe"){ if (confirm("Удалить результаты и курс на этом телефоне?")){ S = {name:"",photo:"",results:[],plan:null}; save(); toast("Данные удалены"); render(); } return; }
if (a === "result" && !last()){ toast("Сначала пройди анализ"); return go("analysis"); }
go(a);
}
function share(bot){
var r = last(); if (!r && !bot) return toast("Сначала пройди анализ");
var t = r && !bot ? "Мой балл IQ: " + r.iq + ". Проверь свой в «Ноус»" : "Проверь свою логику в «Ноус». Это бесплатно";
if (tg && tg.openTelegramLink) tg.openTelegramLink("https://t.me/share/url?url="+encodeURIComponent(BOT)+"&text="+encodeURIComponent(t));
else if (navigator.share) navigator.share({text:t,url:BOT}).catch(function(){});
else { try{ navigator.clipboard.writeText(t+" "+BOT); toast("Текст скопирован"); }catch(e){ toast(t); } }
}
function home(){
var r = last(), p = S.plan, left = p ? 60 - p.done.length : 60;
var ring = '<div class="ring"><svg viewBox="0 0 112 112"><circle cx="56" cy="56" r="50" fill="none" stroke="rgba(255,255,255,.4)" stroke-width="10" stroke-dasharray="1.8 4.2"/></svg><strong>'+left+'</strong><small>дней</small></div>';
after = function(){
var b = $("bn"), ds = document.querySelectorAll(".dots i");
b.onscroll = function(){ var k = Math.round(b.scrollLeft / b.clientWidth); ds.forEach(function(d,j){ d.className = j===k ? "on" : ""; }); };
};
return '<div class="user" data-go="profile">'+av(56)+'<span class="un">'+esc(uname())+'</span>'+ic("chev",20)+'</div>' +
'<div class="card hero"><div><div class="mute">Твой балл IQ</div><div class="score'+(r?'':' empty')+'">'+(r?r.iq:'?.?')+'</div><div class="mute sm">Бесплатно, займёт около 30 минут</div><button class="btn" data-go="analysis">'+ic("scan",22)+'Пройти анализ</button></div></div>' +
'<div class="quick">' + [["scan","Анализ","analysis"],["cal","Курс","course"],["chart","Результат","result"],["share","Поделиться","share"]].map(function(q,i){
return '<button class="q'+(i?'':' dark')+'" data-go="'+q[2]+'"><i>'+ic(q[0])+'</i>'+q[1]+'</button>'; }).join('') + '</div>' +
'<div class="bans" id="bn">' +
'<div class="ban" data-go="course"><div><b>Курс на 60 дней</b><span>Каждый день одно задание под твои индивидуальные цели</span></div>'+ring+'</div>' +
'<div class="ban" data-go="analysis"><div><b>Узнай свой балл</b><span>60 заданий на логику. Результат сохранится на устройстве</span></div><div class="ring"><strong>'+(r?r.iq:'?')+'</strong><small>IQ</small></div></div>' +
'<div class="ban" data-go="share"><div><b>Поделись результатом</b><span>Отправь друзьям и сравните баллы</span></div><div class="ring">'+ic("share",56)+'</div></div>' +
'</div><div class="dots"><i class="on"></i><i></i><i></i></div>' +
'<h2>Сегодня</h2><div class="two">' +
'<button class="t" data-go="course"><div class="h">'+ic("cal",22)+'Курс</div><div><b>Собери план под свои цели</b><p>Бесплатно · 60 дней</p></div></button>' +
'<button class="t" data-go="result"><div class="h">'+ic("chart",22)+'Потенциал</div><div><b style="font-size:40px">'+(r?'до '+Math.min(145,r.iq+10):'?.?')+'</b><p>'+(r?'Цель на 60 дней':'Покажем после анализа')+'</p></div></button></div>';
}
