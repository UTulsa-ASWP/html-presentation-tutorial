'use strict';
// Adversarial gap-closing: assert the three Execute-flagged items directly.
const fs=require('fs');
const { JSDOM } = require('jsdom');
const html=fs.readFileSync('/mnt/user-data/outputs/cycle/iteration-3/pathfinding-race.html','utf8');
let pass=0, fail=0; const ok=(c,m)=>{ if(c)pass++; else {fail++; console.log('  FAIL:',m);} };
let rafCb=null, clock=0;
const dom=new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,beforeParse(w){
  const D=(o,k,v)=>{try{Object.defineProperty(o,k,{value:v,configurable:true,writable:true});}catch(e){}};
  D(w.performance,'now',()=>clock); D(w,'requestAnimationFrame',cb=>{rafCb=cb;return 1;}); D(w,'cancelAnimationFrame',()=>{rafCb=null;}); }});
const { window }=dom; const doc=window.document;
window.addEventListener('error',e=>{console.log('  WINDOW ERROR:',e.message);fail++;});
const $=id=>doc.getElementById(id);
const study=()=>$('study');

(async function(){
  await new Promise(r=>{ if(doc.readyState!=='loading') r(); else window.addEventListener('DOMContentLoaded',r); });

  console.log('GAP 1 — panel-title click enters study focused on that algorithm');
  // panels order: bfs, dijkstra, greedy, astar
  doc.querySelectorAll('.panel')[1].querySelector('.pname').click();   // dijkstra
  ok(study().hidden===false, 'panel-title click opened study');
  ok(study().querySelector('.study-title').textContent==='Dijkstra', 'focused on Dijkstra via panel click');
  ok($('panels').style.display==='none', 'race hidden after panel-click entry');

  console.log('GAP 2 — blurb text matches the focused algorithm');
  ok(study().querySelector('.study-blurb').textContent.indexOf('cheapest-known')>=0, 'Dijkstra blurb shown');
  doc.querySelectorAll('.panel'); study().querySelector('.thumb[data-mode="greedy"]').click();
  ok(study().querySelector('.study-blurb').textContent.indexOf('closest to the goal')>=0, 'Greedy blurb shown after switch');
  study().querySelector('.thumb[data-mode="astar"]').click();
  ok(study().querySelector('.study-blurb').textContent.indexOf('g + h')>=0, 'A* blurb shown after switch');

  console.log('GAP 3 — grid cursors (node + neighbor) render during stepping');
  // focused on A*; step into the neighbor loop
  let sawNode=false, sawNb=false;
  for (let i=0;i<6;i++){ $('step').click();
    if (study().querySelectorAll('.focusgrid .grid .cell.cur-node').length>0) sawNode=true;
    if (study().querySelectorAll('.focusgrid .grid .cell.cur-nb').length>0) sawNb=true; }
  ok(sawNode, 'node-being-expanded cursor (cur-node) rendered');
  ok(sawNb, 'neighbor-under-inspection cursor (cur-nb) rendered');
  // exactly one of each at a time
  ok(study().querySelectorAll('.focusgrid .grid .cell.cur-node').length<=1, 'at most one node cursor at a time');

  console.log('\n'+(fail===0?'GAP-CLOSING: ALL PASS':'GAP-CLOSING: FAILURES')+'  pass='+pass+' fail='+fail);
  process.exit(fail===0?0:1);
})();
