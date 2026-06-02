'use strict';
const fs=require('fs');
const { JSDOM } = require('jsdom');
const html=fs.readFileSync('/mnt/user-data/outputs/cycle/iteration-2/pathfinding-race.html','utf8');
let pass=0, fail=0; const ok=(c,m)=>{ if(c)pass++; else {fail++; console.log('  FAIL:',m);} };
let rafCb=null, clock=0;
const dom=new JSDOM(html, { runScripts:'dangerously', pretendToBeVisual:true,
  beforeParse(w){ const D=(o,k,v)=>{try{Object.defineProperty(o,k,{value:v,configurable:true,writable:true});}catch(e){}};
    D(w.performance,'now',()=>clock); D(w,'requestAnimationFrame',cb=>{rafCb=cb;return 1;}); D(w,'cancelAnimationFrame',()=>{rafCb=null;}); }});
const { window }=dom; const doc=window.document;
window.addEventListener('error',e=>{console.log('  WINDOW ERROR:',e.message);fail++;});
function pump(dt){ clock+=dt; const cb=rafCb; rafCb=null; if(cb) cb(clock); }
const $=id=>doc.getElementById(id);
function mouse(el,t){ el.dispatchEvent(new window.MouseEvent(t,{bubbles:true})); }
const cellAt=(p,r,c)=>doc.querySelectorAll('.panel')[p].querySelector('.cell[data-r="'+r+'"][data-c="'+c+'"]');
function paint(tool,list){ $('tool-'+tool).click(); list.forEach(([r,c])=>{ mouse(cellAt(0,r,c),'mousedown'); doc.dispatchEvent(new window.MouseEvent('mouseup',{bubbles:true})); }); }
const study=()=>$('study');
const activeKey=()=>{ const a=study().querySelector('.pl.active'); return a?a.getAttribute('data-key'):null; };
const studyCell=(r,c)=>study().querySelector('.focusgrid .grid').children[r*25+c];

(async function run(){
  await new Promise(r=>{ if(doc.readyState!=='loading') r(); else window.addEventListener('DOMContentLoaded',r); });

  console.log('DEFAULT: study off');
  ok(study().hidden===true, 'study hidden by default');
  ok($('studytoggle').getAttribute('aria-pressed')==='false', 'toggle not pressed');
  ok($('panels').style.display!=='none', 'race panels visible by default');

  console.log('TOGGLE ON: study scaffold');
  $('studytoggle').click();
  ok(study().hidden===false, 'study visible after toggle');
  ok($('panels').style.display==='none', 'race panels hidden in study');
  ok(study().querySelectorAll('.pl').length===10, 'pseudocode has 10 lines ('+study().querySelectorAll('.pl').length+')');
  ok(study().querySelectorAll('.thumb').length===4, 'four thumbnails');
  ok(study().querySelectorAll('.ctable tr').length===5, 'comparison table: header + 4 rows');
  ok(study().querySelector('.thumb[data-mode="astar"]').getAttribute('aria-pressed')==='true', 'default focus = A*');

  console.log('LINE-BY-LINE: Step walks the program counter');
  const seq=[];
  for (let i=0;i<8;i++){ $('step').click(); seq.push(activeKey()); }
  console.log('   sequence:', seq.join(' -> '));
  ok(JSON.stringify(seq)===JSON.stringify(['init','pop','goal','mark','for','cost','improve','push']),
     'active-line sequence is init..push');
  ok(study().querySelector('.narration').textContent.length>0, 'narration populated');
  ok(studyCell(8,2).className.indexOf('closed')>=0, 'start cell closed after pop');
  // after the 'push' step, some neighbor cell is open
  ok(study().querySelectorAll('.focusgrid .grid .cell.open').length>0, 'a frontier cell is open after push');

  console.log('DIVERGENCE: annotations change with focus');
  const aPop=study().querySelector('.pl[data-key="pop"] .annot').textContent;
  ok(study().querySelector('.pl[data-key="pop"]').className.indexOf('diverge')>=0, 'pop line marked divergent');
  ok(aPop.indexOf('A*')>=0, 'A* pop annotation shown ("'+aPop+'")');
  study().querySelector('.thumb[data-mode="bfs"]').click();
  const bPop=study().querySelector('.pl[data-key="pop"] .annot').textContent;
  ok(bPop.indexOf('OLDEST')>=0 && bPop!==aPop, 'switching to BFS updates pop annotation ("'+bPop+'")');
  ok(study().querySelector('.ctable tr.focusrow td.algo').textContent==='BFS', 'comparison table row highlights BFS');

  console.log('FULL STUDY RUN via Play (focused A*)');
  study().querySelector('.thumb[data-mode="astar"]').click();
  $('speed').value=100; $('speed').dispatchEvent(new window.Event('input'));
  $('play').click(); let g=0; while($('play').textContent.indexOf('Replay')<0 && g++<8000) pump(100000);
  ok(g<8000, 'study run completed');
  ok(study().querySelectorAll('.focusgrid .grid .cell.path').length>0, 'final path drawn on focused grid');
  ok(study().querySelector('.study-stat').textContent.indexOf('cost')>=0, 'study stat shows cost on completion');

  console.log('NO-PATH IN STUDY (seal the goal)');
  $('studytoggle').click();                       // back to race to edit
  ok(study().hidden===true && $('panels').style.display!=='none', 'toggled back to race');
  $('clear').click();
  paint('wall',[[7,22],[9,22],[8,21],[8,23]]);
  $('studytoggle').click();                        // re-enter study (A*)
  $('speed').value=100; $('speed').dispatchEvent(new window.Event('input'));
  $('play').click(); g=0; while($('play').textContent.indexOf('Replay')<0 && g++<8000) pump(100000);
  ok(g<8000, 'study no-path run terminated');
  ok(study().querySelector('.study-stat').textContent.indexOf('no path')>=0, 'study reports no path');
  ok(study().querySelector('.narration').textContent.toLowerCase().indexOf('unreachable')>=0, 'narration explains unreachable');

  console.log('TOGGLE OFF: race still works');
  $('studytoggle').click();
  ok($('panels').style.display!=='none' && study().hidden===true, 'race restored');
  $('clear').click();
  $('play').click(); g=0; while($('play').textContent.indexOf('Replay')<0 && g++<3000) pump(100000);
  ok(g<3000, 'race runs to completion after leaving study');

  console.log('\n'+(fail===0?'STUDY INTEGRATION: ALL PASS':'STUDY INTEGRATION: FAILURES')+'  pass='+pass+' fail='+fail);
  process.exit(fail===0?0:1);
})();
