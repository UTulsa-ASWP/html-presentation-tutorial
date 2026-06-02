'use strict';
const fs=require('fs');
const { JSDOM } = require('jsdom');
const html=fs.readFileSync('/mnt/user-data/outputs/cycle/iteration-1/pathfinding-race.html','utf8');

let pass=0, fail=0; const ok=(c,m)=>{ if(c)pass++; else {fail++; console.log('  FAIL:',m);} };

let rafCb=null, clock=0;
const dom=new JSDOM(html, { runScripts:'dangerously', pretendToBeVisual:true,
  beforeParse(w){
    const D=(o,k,v)=>{ try{ Object.defineProperty(o,k,{value:v,configurable:true,writable:true}); }catch(e){} };
    D(w.performance,'now',()=>clock);
    D(w,'requestAnimationFrame',(cb)=>{ rafCb=cb; return 1; });
    D(w,'cancelAnimationFrame',()=>{ rafCb=null; });
  }});
const { window } = dom; const doc = window.document;
window.addEventListener("error",e=>{console.log("  WINDOW ERROR:",e.message);fail++;});
function pump(dtMs){ clock+=dtMs; const cb=rafCb; rafCb=null; if(cb) cb(clock); }

(async function run(){
 await new Promise(r=>{ if(doc.readyState==="complete"||doc.readyState==="interactive") r(); else window.addEventListener("DOMContentLoaded",r); });
 const $=(id)=>doc.getElementById(id);
const panels=()=>doc.querySelectorAll('.panel');
const cells=(p)=>panels()[p].querySelectorAll('.cell');
const cellAt=(p,r,c)=>panels()[p].querySelector('.cell[data-r="'+r+'"][data-c="'+c+'"]');
const ROWS=17, COLS=25;
function mouse(el,type){ el.dispatchEvent(new window.MouseEvent(type,{bubbles:true})); }
function paint(tool, list){ $('tool-'+tool).click();
  list.forEach(([r,c])=>{ mouse(cellAt(0,r,c),'mousedown'); doc.dispatchEvent(new window.MouseEvent('mouseup',{bubbles:true})); }); }
function stat(p, idx){ return panels()[p].querySelectorAll('.stat .v')[idx].textContent; }
const V=p=>parseInt(stat(p,0),10), C=p=>parseInt(stat(p,1),10), O=p=>stat(p,3);

console.log('STRUCTURE');
ok(panels().length===4, 'four panels built');
ok(cells(0).length===ROWS*COLS, 'panel 0 has ROWS*COLS cells ('+cells(0).length+')');
ok(cellAt(0,8,2).className.indexOf('start')>=0, 'start marker rendered');
ok(cellAt(0,8,22).className.indexOf('end')>=0, 'goal marker rendered');

console.log('PAINTING propagates to all panels + respects endpoints');
paint('wall', [[5,10]]);
ok([0,1,2,3].every(p=>cellAt(p,5,10).className.indexOf('wall')>=0), 'wall painted in all 4 panels');
paint('weight', [[6,10]]);
ok([0,1,2,3].every(p=>cellAt(p,6,10).className.indexOf('weight')>=0), 'mud painted in all 4 panels');
paint('erase', [[5,10]]);
ok([0,1,2,3].every(p=>cellAt(p,5,10).className.indexOf('wall')<0), 'erase cleared wall');
paint('wall', [[8,2]]);
ok(cellAt(0,8,2).className.indexOf('wall')<0, 'cannot paint over start');

console.log('FULL RACE via Play (real rAF path), weighted band maze');
$('clear').click();
let band=[]; for(let r=1;r<ROWS-1;r++){ for(let c=11;c<=13;c++) band.push([r,c]); }
paint('weight', band);
$('speed').value=100; $('speed').dispatchEvent(new window.Event('input'));
$('play').click();
let guard=0; while($('play').textContent.indexOf('Replay')<0 && guard++<5000) pump(10000);
ok(guard<5000, 'race finished via Play');
console.log('   costs:',[0,1,2,3].map(C),' visited:',[0,1,2,3].map(V),' optimal:',[0,1,2,3].map(O));
ok(C(1)===C(3), 'Dijkstra cost == A* cost');
ok(O(1).indexOf('yes')>=0 && O(3).indexOf('yes')>=0, 'Dijkstra & A* optimal=yes');
ok(C(0)>=C(1) && C(2)>=C(1), 'BFS & Greedy cost >= optimal');
ok(C(0)>C(1) || C(2)>C(1), 'at least one of BFS/Greedy strictly costlier (teaching point)');
ok(V(3)<=V(1), 'A* visited <= Dijkstra visited');
ok([0,1,2,3].every(p=>panels()[p].querySelectorAll('.cell.path').length>0), 'final path drawn in every panel');

console.log('STEP path: one expansion each');
$('reset').click();
ok($('play').textContent.indexOf('Play')>=0, 'reset returns to Play');
ok(doc.querySelectorAll('.cell.closed').length===0 && doc.querySelectorAll('.cell.open').length===0, 'reset cleared overlays');
$('step').click();
const v1=[0,1,2,3].map(V);
ok(v1.every(v=>v===1), 'one Step -> visited==1 each ('+v1.join(',')+')');

console.log('NO-PATH: seal the goal');
$('reset').click(); $('clear').click();
paint('wall', [[7,22],[9,22],[8,21],[8,23]]);
$('speed').value=100; $('speed').dispatchEvent(new window.Event('input'));
$('play').click(); guard=0; while($('play').textContent.indexOf('Replay')<0 && guard++<5000) pump(10000);
const statuses=[0,1,2,3].map(p=>panels()[p].querySelector('.pstatus').textContent);
console.log('   statuses:',statuses);
ok(statuses.every(s=>s==='no path'), 'all four report no path');
ok([0,1,2,3].every(p=>stat(p,1)==='\u221e'), 'cost shows infinity');

console.log('\n'+(fail===0?'INTEGRATION: ALL PASS':'INTEGRATION: FAILURES')+'  pass='+pass+' fail='+fail);
process.exit(fail===0?0:1);
})();
