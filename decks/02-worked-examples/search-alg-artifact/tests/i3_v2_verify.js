'use strict';
const fs = require('fs');
const html = fs.readFileSync('/mnt/user-data/outputs/cycle/iteration-3/pathfinding-race.html','utf8');

// Extract the exact engine source shipped in the artifact.
const startMark = 'var DIRS = [[-1,0],[1,0],[0,-1],[0,1]];';
const endMark = '// quick reachability test';
const s = html.indexOf(startMark), e = html.indexOf(endMark);
if (s<0 || e<0) { console.log('EXTRACT FAIL', s, e); process.exit(2); }
let engineSrc = html.slice(s, e);

// ROWS/COLS are referenced only by reachable(), which we excluded; engine is self-contained.
const sandbox = {};
new Function('exports', engineSrc + '\nexports.makeMaze=makeMaze;exports.makeSearch=makeSearch;exports.neighbors=neighbors;')(sandbox);
const { makeMaze, makeSearch } = sandbox;
const MODES = ['bfs','dijkstra','greedy','astar'];

let pass=0, fail=0; const ok=(c,m)=>{ if(c)pass++; else {fail++; console.log('  FAIL:',m);} };
function runAll(maze){ const res={};
  for (const mode of MODES){ const s=makeSearch(maze,mode); let g=0;
    while(!s.isDone() && g++<100000) s.step();
    res[mode]={found:s.isFound(),visited:s.visited(),cost:s.cost(),steps:s.steps(),path:s.path()}; }
  const costs=MODES.filter(m=>res[m].found).map(m=>res[m].cost); const min=Math.min(...costs);
  for(const m of MODES) res[m].optimal=res[m].found&&res[m].cost===min; return res; }
const setW=(m,cells,w)=>cells.forEach(([r,c])=>m.grid[r][c].weight=w);
const setWall=(m,cells)=>cells.forEach(([r,c])=>m.grid[r][c].wall=true);

console.log('Re-testing the INLINED engine (the code that actually ships):');
{ const maze=makeMaze(4,5,{r:0,c:0},{r:0,c:4});
  setW(maze,[[0,1],[0,2],[0,3],[2,0],[2,1],[2,2],[2,3]],9); const r=runAll(maze);
  for(const m of MODES) console.log('  ',m.padEnd(9),JSON.stringify({steps:r[m].steps,cost:r[m].cost,visited:r[m].visited,opt:r[m].optimal}));
  ok(r.astar.cost===r.dijkstra.cost,'A*==Dijkstra cost');
  ok(r.dijkstra.optimal&&r.astar.optimal,'Dijkstra&A* optimal');
  ok(r.bfs.cost>=r.dijkstra.cost && r.greedy.cost>=r.dijkstra.cost,'BFS/Greedy cost >= optimal');
  ok(r.bfs.steps<=r.dijkstra.steps,'BFS fewest steps'); }
{ const maze=makeMaze(15,15,{r:7,c:0},{r:7,c:14}); const r=runAll(maze);
  ok(r.astar.cost===r.dijkstra.cost,'A* optimal open grid');
  ok(r.astar.visited<r.dijkstra.visited,'A* visits < Dijkstra ('+r.astar.visited+' vs '+r.dijkstra.visited+')'); }
{ const maze=makeMaze(5,5,{r:0,c:0},{r:4,c:4}); setWall(maze,[[3,4],[4,3]]); const r=runAll(maze);
  for(const m of MODES){ ok(r[m].found===false,m+' no path'); ok(r[m].path===null,m+' null path'); } }
{ const maze=makeMaze(10,10,{r:0,c:0},{r:9,c:9}); setWall(maze,[[1,1],[2,2],[3,3],[4,4],[5,5]]); const r=runAll(maze);
  for(const m of MODES){ const p=r[m].path; if(!p){ok(false,m+' path');continue;}
    let contig=true,nowall=true; for(let i=0;i<p.length;i++){ if(p[i].wall)nowall=false;
      if(i>0){const d=Math.abs(p[i].r-p[i-1].r)+Math.abs(p[i].c-p[i-1].c); if(d!==1)contig=false;} }
    ok(p[0].r===0&&p[0].c===0,m+' starts right'); ok(p[p.length-1].r===9&&p[p.length-1].c===9,m+' ends right');
    ok(contig,m+' contiguous'); ok(nowall,m+' avoids walls'); } }
{ const maze=makeMaze(5,5,{r:2,c:2},{r:2,c:2}); const r=runAll(maze);
  for(const m of MODES){ ok(r[m].found,m+' trivial'); ok(r[m].cost===0,m+' cost0'); ok(r[m].steps===0,m+' steps0'); } }
console.log('\n'+(fail===0?'INLINED ENGINE: ALL PASS':'INLINED ENGINE: FAILURES')+'  pass='+pass+' fail='+fail);

console.log('\n--- Static security / offline checks ---');
function check(label, re, shouldBeAbsent){
  const hits=(html.match(re)||[]).length;
  const good = shouldBeAbsent ? hits===0 : hits>0;
  console.log('  ['+(good?'OK':'XX')+'] '+label+' ('+hits+')');
  if(!good) fail++;
}
check('no innerHTML', /innerHTML/g, true);
check('no eval(', /\beval\s*\(/g, true);
check('no new Function (in artifact)', /new\s+Function\s*\(/g, true);
check('no fetch(', /\bfetch\s*\(/g, true);
check('no XMLHttpRequest', /XMLHttpRequest/g, true);
check('no localStorage/sessionStorage', /(localStorage|sessionStorage)/g, true);
check('no external http(s) URL', /https?:\/\/[a-z]/gi, true);
check('no protocol-relative src //cdn', /src\s*=\s*["']\/\//g, true);
process.exit(fail===0?0:1);
