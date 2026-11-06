function analysis(){
after = function(){
app.querySelectorAll("[data-age]").forEach(function(b){ b.onclick = function(){ age = b.dataset.age; render(); }; });
$("st").onclick = function(){ if (!age) return toast("Выбери возраст"); T = makeTest(age); go("test"); };
};
return '<h1>Анализ</h1><div class="card"><div class="mute">Твой возраст</div><div class="chips">' +
AGES.map(function(k){ return '<button class="chip'+(k===age?' on':'')+'" data-age="'+k+'">'+k+'</button>'; }).join('') + '</div>' +
'<div class="mute sm" style="margin-bottom:14px">Бесплатно, займёт около 30 минут: 60 заданий с картинками, идёт таймер</div><button class="btn" id="st">Начать анализ</button></div>';
}
function test(){
var d = T.qs[T.i];
after = function(){
var done = false, tm = $("tm");
function upd(){
var left = Math.max(0, Math.round((T.end - Date.now()) / 1000));
tm.textContent = Math.floor(left / 60) + ":" + ("0" + (left % 60)).slice(-2);
if (left <= 0){ clearInterval(tick); go("loading"); }
}
function next(){ T.i++; go(T.i < T.qs.length ? "test" : "loading"); }
upd(); tick = setInterval(upd, 1000);
app.querySelectorAll(".op").forEach(function(b){ b.onclick = function(){
if (done) return; done = true; b.classList.add("sel");
if (+b.dataset.k === d.a) T.s++;
setTimeout(next, 250);
}; });
$("sk").onclick = function(){ if (!done){ done = true; next(); } };
};
var m = '<div class="mat">';
for (var k = 0; k < 8; k++) m += '<div class="mc">' + cellSvg(d.cells[k]) + '</div>';
m += '<div class="mc q">?</div></div>';
return '<div class="tbar"><span class="mute">Задание ' + (T.i + 1) + ' из ' + T.qs.length + '</span><b id="tm" class="timer"></b></div>' +
'<div class="bar"><i style="width:' + (T.i / T.qs.length * 100) + '%"></i></div>' +
'<p class="note" style="margin:0 0 14px;text-align:center">Выбери фигуру, которая продолжит последовательность</p>' + m +
'<div class="os">' + d.opts.map(function(c, k){ return '<button class="op" data-k="' + k + '" aria-label="Вариант ' + (k + 1) + '">' + cellSvg(c) + '</button>'; }).join("") + '</div>' +
'<button class="btn ghost full" id="sk">Пропустить</button>';
}
function loading(){
after = function(){ setTimeout(function(){
S.results.push({iq:70+T.s, s:T.s, n:T.qs.length, age:age, date:new Date().toLocaleDateString("ru-RU")});
save(); go("result");
}, 1800); };
return '<div class="center"><div class="spin"></div><h1 style="margin:0 0 8px">Считаем результат…</h1><p class="mute">Это займёт пару секунд</p></div>';
}
function result(){
var r = last(); if (!r){ view = "analysis"; return analysis(); }
var b = band(r.iq);
return '<h1>Результат</h1><div class="card"><div class="mute">Твой балл IQ</div><div class="big">'+r.iq+'</div><div class="lab">'+LABELS[b]+'</div>' +
'<div class="mute sm">Верных ответов: '+r.s+' из '+r.n+' · '+esc(r.age)+'</div><p class="note">Это развлекательная оценка по короткому тесту, а не клинический IQ-тест. Точный результат даёт только психолог.</p></div>' +
'<div class="card"><div class="mute">Потенциал</div><div style="font-size:26px;font-weight:700;margin:6px 0">Цель на 60 дней: до '+Math.min(145,r.iq+10)+'</div><p class="note" style="margin-bottom:0">'+REC[b]+'</p></div>' +
'<div class="row"><button class="btn full" data-go="course">Курс</button><button class="btn ghost full" data-go="share">Поделиться</button></div>' +
(S.results.length > 1 ? '<div class="card" style="margin-top:16px"><div class="mute" style="margin-bottom:6px">История</div>' + S.results.slice(-5).reverse().map(function(x){ return '<div class="hist"><span>'+x.date+'</span><b>'+x.iq+'</b></div>'; }).join('') + '</div>' : '');
}
function course(){
var r = last();
if (!r) return '<h1>Курс</h1><div class="card"><b style="font-size:24px">Собери план под свои цели</b><p class="note">Курс строится по твоему результату. Сначала пройди анализ.</p><button class="btn" data-go="analysis">Пройти анализ</button></div>';
var p = S.plan;
if (!p){
after = function(){
app.querySelectorAll("[data-g]").forEach(function(b){ b.onclick = function(){ goal = +b.dataset.g; render(); }; });
$("cs").onclick = function(){ S.plan = {goal:goal,done:[]}; selDay = 0; save(); render(); };
};
return '<h1>Курс</h1><div class="card"><b style="font-size:24px">Курс на 60 дней</b><p class="note">Твой балл: '+r.iq+'. Выбери цель: на сколько баллов хочешь вырасти. От цели зависит время занятий в день.</p><div class="chips">' +
[5,10,15].map(function(g){ return '<button class="chip'+(g===goal?' on':'')+'" data-g="'+g+'">+'+g+'</button>'; }).join('') +
'</div><p class="note">Рост IQ курс не гарантирует: это ежедневная тренировка мышления.</p><button class="btn" id="cs">Начать курс</button></div>';
}
var n = p.done.length, cur = Math.min(60, n+1), d = selDay || cur, tk = task(d, p.goal), m = p.goal===5?10:p.goal===10?15:20;
var isDone = p.done.indexOf(d) > -1;
after = function(){
app.querySelectorAll("[data-d]").forEach(function(b){ b.onclick = function(){ selDay = +b.dataset.d; render(); }; });
var f = $("fin"); if (f) f.onclick = function(){ p.done.push(d); selDay = 0; save(); render(); toast(p.done.length===60 ? "Курс пройден!" : "День выполнен"); };
};
var grid = ''; for (var i = 1; i <= 60; i++){
var st = p.done.indexOf(i) > -1 ? 'done' : i === cur ? 'cur' : '';
grid += '<button class="d '+st+(i===d?' sel':'')+'" '+(i>cur?'disabled':'data-d="'+i+'"')+'>'+i+'</button>';
}
var C = 2*Math.PI*40;
return '<h1>Курс</h1><div class="card head"><div class="pr"><svg width="96" height="96" viewBox="0 0 96 96"><circle cx="48" cy="48" r="40" fill="none" stroke="#e4e6ec" stroke-width="9"/><circle cx="48" cy="48" r="40" fill="none" stroke="#14453b" stroke-width="9" stroke-linecap="round" stroke-dasharray="'+C+'" stroke-dashoffset="'+C*(1-n/60)+'"/></svg><b>'+Math.round(n/60*100)+'%</b></div>' +
'<div><b style="font-size:22px">Пройдено '+n+' из 60</b><p class="note" style="margin:6px 0 0">Цель: '+r.iq+' → '+Math.min(145,r.iq+p.goal)+'</p></div></div>' +
'<div class="card"><div class="mute">День '+d+' · ~'+m+' минут</div><div style="font-size:24px;font-weight:700;margin:6px 0 8px">'+tk[0]+'</div><p style="font-size:17px;line-height:1.5">'+tk[1]+'</p>' +
(isDone ? '<button class="btn full" disabled>Выполнено</button>' : d === cur && n < 60 ? '<button class="btn full" id="fin">Выполнено</button>' : '') + '</div>' +
'<div class="card"><div class="mute">Все дни</div><div class="days">'+grid+'</div></div>';
}
function row(ico, col, title, sub, a, cls){
return '<button class="it' + (cls ? ' ' + cls : '') + '" data-go="' + a + '"><span class="ico" style="background:' + col + '">' + ic(ico, 22) + '</span><span class="tt"><b>' + title + '</b>' + (sub ? '<small>' + sub + '</small>' : '') + '</span><span class="ch">' + ic("chev", 18) + '</span></button>';
}
function profile(){
var r = last(), p = S.plan, day = p ? Math.min(60, p.done.length + 1) : 0;
var sub = TU ? (TU.username ? '@' + esc(TU.username) + ' · ' : '') + 'ID ' + TU.id : 'Открой через Telegram, чтобы войти';
var src = TU && TU.photo_url;
after = function(){
$("pn").onclick = function(){
var v = prompt("Как тебя называть?", uname());
if (v !== null){ S.name = v.trim().slice(0, 24); save(); render(); }
};
};
return '<div class="pf"><div class="pav">' + (src ? '<img src="' + esc(src) + '" alt="">' : esc(uname().charAt(0).toUpperCase())) + '</div>' +
'<div class="pn" id="pn">' + esc(uname()) + '</div><div class="pu">' + sub + '</div></div>' +
'<div class="stats"><div><b>' + (r ? r.iq : "—") + '</b><span>балл</span></div><div><b>' + S.results.length + '</b><span>анализов</span></div><div><b>' + day + '</b><span>день курса</span></div></div>' +
'<div class="list">' + row("chart", "#2fc15a", "Мой результат", r ? "Последний балл: " + r.iq : "Анализа ещё нет", "result") +
row("share", "#0a84ff", "Поделиться ботом", "Анализ бесплатный для всех", "sharebot") + '</div>' +
'<div class="list">' + row("bars", "#5b4bd6", "Шкала тиров", "", "tiers") + row("spark", "#0f7a62", "Как считается балл", "", "how") + row("msg", "#2bb0f0", "Чат с ботом", "", "chat") + '</div>' +
'<div class="list">' + (p ? row("cal", "#a1a6b1", "Сбросить курс", "Начать 60 дней заново", "reset", "gray") : "") +
row("trash", "#a1a6b1", "Удалить мои данные", S.results.length || p ? "Результаты и курс на этом телефоне" : "На этом телефоне данных нет", "wipe", "gray") + '</div>' +
'<div class="foot">NOUS · всё бесплатно</div>';
}
function tiers(){
var r = last(), b = r ? band(r.iq) : -1, R = [["70–84", "0–14"], ["85–99", "15–29"], ["100–114", "30–44"], ["115–130", "45–60"]];
return '<button class="btn ghost sm" data-go="profile">' + ic("back", 18) + 'Назад</button><h1>Шкала тиров</h1><div class="card">' +
'<div class="tr h"><span>Тир</span><span>Балл</span><span>Верных</span></div>' +
LABELS.map(function(l, i){ return '<div class="tr' + (i === b ? ' me' : '') + '"><span>' + l + '</span><span>' + R[i][0] + '</span><span>' + R[i][1] + '</span></div>'; }).join("") +
'</div><p class="note">' + (r ? "Твой тир выделен жирным. Твой балл: " + r.iq + "." : "Пройди анализ, чтобы увидеть свой тир.") + '</p>';
}
function how(){
var s = ["В тесте 60 заданий-матриц и 30 минут. В каждой матрице скрыта одна фигура, нужно выбрать подходящую из шести.",
"За каждый верный ответ начисляется 1 очко. Пропущенные и неотвеченные задания очков не дают.",
"Балл = 70 + число верных ответов. Он лежит в диапазоне от 70 до 130.",
"Если отвечать наугад, в среднем получится около 10 верных, то есть примерно 80 баллов.",
"Задания создаются заново при каждом прохождении. Детям до 12 лет попадаются более простые.",
"Фото и внешность в расчёте не участвуют."];
return '<button class="btn ghost sm" data-go="profile">' + ic("back", 18) + 'Назад</button><h1>Как считается балл</h1><div class="card">' +
s.map(function(x, i){ return '<p style="font-size:17px;line-height:1.5;margin-bottom:12px"><b>' + (i + 1) + '.</b> ' + x + '</p>'; }).join("") +
'</div><p class="note">Это развлекательная оценка, а не клинический тест: у нас нет возрастных норм. Точный IQ определяет только психолог.</p>';
}
function chat(){
if (/ВСТАВЬ/.test(BOT)) return toast("Укажи ссылку на бота в файле");
if (tg && tg.openTelegramLink) tg.openTelegramLink(BOT); else window.open(BOT, "_blank");
}
render();
