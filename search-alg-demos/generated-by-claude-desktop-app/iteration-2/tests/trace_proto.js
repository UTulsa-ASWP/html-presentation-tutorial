'use strict';
// Research prototype: a SINGLE generator micro-stepper that drives both
// (a) study mode  -> one pseudocode line per .next()
// (b) race mode   -> advance to the next expansion boundary
// Must reproduce iteration-1 engine results exactly (no divergence).

const oracle = require('./engine.js'); // iteration-1 validated engine = ground truth

const DIRS = [[-1,0],[1,0],[0,-1],[0,1]];
const keyOf = c => c.r + ',' + c.c;
function neighbors(maze, cell){ const out=[];
  for (const [dr,dc] of DIRS){ const nr=cell.r+dr,nc=cell.c+dc;
    if (nr<0||nr>=maze.rows||nc<0||nc>=maze.cols) continue;
    const n=maze.grid[nr][nc]; if(!n.wall) out.push(n);} return out; }

class MinHeap{ constructor(){this.a=[];} size(){return this.a.length;}
  push(x){const a=this.a;a.push(x);let i=a.length-1;while(i>0){const p=(i-1)>>1;if(a[p].key<=a[i].key)break;[a[p],a[i]]=[a[i],a[p]];i=p;}}
  pop(){const a=this.a,t=a[0],l=a.pop();if(a.length){a[0]=l;let i=0,n=a.length;for(;;){let L=2*i+1,R=2*i+2,s=i;if(L<n&&a[L].key<a[s].key)s=L;if(R<n&&a[R].key<a[s].key)s=R;if(s===i)break;[a[s],a[i]]=[a[i],a[s]];i=s;}}return t;} }

// PSEUDOCODE LINE IDS (shared skeleton)
// init, while, pop, goal, mark, for, skip, cost, improve, push, endExp, exhausted
function* trace(maze, mode){
  const startK=keyOf(maze.start), goalK=keyOf(maze.end);
  const relaxes = mode==='dijkstra'||mode==='astar';
  const g={}; g[startK]=0; const parent={}, closed={}, inOpen={}; inOpen[startK]=true;
  const start=maze.grid[maze.start.r][maze.start.c];
  const h=c=>Math.abs(c.r-maze.end.r)+Math.abs(c.c-maze.end.c);
  const prio=(k,c)=>mode==='dijkstra'?g[k]:mode==='astar'?g[k]+h(c):h(c);
  let fifo=null,head=0,heap=null;
  if(mode==='bfs') fifo=[start]; else { heap=new MinHeap(); heap.push({key:prio(startK,start),cell:start,k:startK}); }
  yield {line:'init'};
  for(;;){
    // while frontier not empty
    let cur;
    if(mode==='bfs'){ while(head<fifo.length && closed[keyOf(fifo[head])]) head++;
      if(head>=fifo.length){ yield {line:'exhausted'}; return; } cur=fifo[head++]; }
    else { let top; do{ if(heap.size()===0){ yield {line:'exhausted'}; return; } top=heap.pop(); }while(closed[top.k]); cur=top.cell; }
    const curK=keyOf(cur); delete inOpen[curK];
    yield {line:'pop', node:cur};
    if(curK===goalK){ closed[curK]=true; yield {line:'goal', node:cur, hit:true}; return; }
    yield {line:'goal', node:cur, hit:false};
    closed[curK]=true; yield {line:'mark', node:cur};
    const ns=neighbors(maze,cur);
    for(const nb of ns){
      const nk=keyOf(nb);
      yield {line:'for', node:cur, neighbor:nb};
      const seen = closed[nk] || (!relaxes && inOpen[nk]);
      if(closed[nk] || (!relaxes && inOpen[nk])){ yield {line:'skip', node:cur, neighbor:nb}; continue; }
      const tentative = g[curK] + nb.weight;
      yield {line:'cost', node:cur, neighbor:nb, cost:tentative};
      const improved = relaxes ? (!(nk in g) || tentative<g[nk]) : true; // bfs/greedy: unseen reached here => improved
      yield {line:'improve', node:cur, neighbor:nb, improved};
      if(improved){ g[nk]=tentative; parent[nk]=curK; inOpen[nk]=true;
        if(mode==='bfs') fifo.push(nb); else heap.push({key:prio(nk,nb),cell:nb,k:nk});
        yield {line:'push', node:cur, neighbor:nb}; }
    }
    yield {line:'endExp', node:cur};
  }
}

// Race driver: advance to next expansion boundary, collecting deltas
function makeRaceFromTrace(maze, mode){
  const it=trace(maze,mode); let done=false, found=false, visited=0;
  const g={}; // reconstruct via parent captured? Instead, track from yields:
  const parent={}; const gcost={};
  function stepExpansion(){
    if(done) return {opened:[],closedCell:null};
    const opened=[]; let closedCell=null;
    for(;;){ const {value,done:d}=it.next(); if(d){done=true;break;} const s=value;
      if(s.line==='pop'){ closedCell=s.node; visited++; }
      else if(s.line==='goal' && s.hit){ found=true; done=true; break; }
      else if(s.line==='push'){ opened.push(s.neighbor); recordPush(s); }
      else if(s.line==='cost'){ pendingCost=s.cost; pendingNb=s.neighbor; pendingNode=s.node; }
      else if(s.line==='exhausted'){ done=true; break; }
      else if(s.line==='endExp'){ break; }
    }
    return {opened,closedCell};
  }
  let pendingCost=null,pendingNb=null,pendingNode=null;
  function recordPush(s){ const nk=keyOf(s.neighbor); gcost[nk]=pendingCost; parent[nk]=keyOf(s.node); }
  // seed start
  gcost[keyOf(maze.start)]=0;
  return { stepExpansion, isDone:()=>done, isFound:()=>found, visited:()=>visited,
    cost:()=> found? gcost[keyOf(maze.end)] : null,
    path:()=>{ if(!found) return null; const out=[]; let k=keyOf(maze.end);
      while(k!==keyOf(maze.start)){ const [r,c]=k.split(',').map(Number); out.push(maze.grid[r][c]); k=parent[k]; if(k===undefined) return null; }
      out.push(maze.grid[maze.start.r][maze.start.c]); out.reverse(); return out; } };
}

// ---------- equivalence test vs iteration-1 oracle ----------
let pass=0,fail=0; const ok=(c,m)=>{ if(c)pass++; else {fail++;console.log('  FAIL:',m);} };
const MODES=['bfs','dijkstra','greedy','astar'];
function makeMaze(R,C,s,e){ return oracle.makeMaze(R,C,s,e); }

function compare(label, build){
  console.log(label);
  for(const mode of MODES){
    const m1=build(); const o=oracle.makeSearch(m1,mode); let g=0; while(!o.done&&g++<1e5)o.step();
    const m2=build(); const t=makeRaceFromTrace(m2,mode); g=0; while(!t.isDone()&&g++<1e5)t.stepExpansion();
    const op={f:o.found,v:o.visited,c:o.cost(),s:o.steps()};
    const tp={f:t.isFound(),v:t.visited(),c:t.cost(),s:(t.path()?t.path().length-1:null)};
    ok(op.f===tp.f && op.v===tp.v && op.c===tp.c && op.s===tp.s,
       mode+' matches oracle  oracle='+JSON.stringify(op)+' trace='+JSON.stringify(tp));
  }
}

compare('TEST A: weighted fixture', ()=>{ const m=makeMaze(4,5,{r:0,c:0},{r:0,c:4});
  [[0,1],[0,2],[0,3],[2,0],[2,1],[2,2],[2,3]].forEach(([r,c])=>m.grid[r][c].weight=9); return m; });
compare('TEST B: open 15x15', ()=>makeMaze(15,15,{r:7,c:0},{r:7,c:14}));
compare('TEST C: walls diagonal', ()=>{ const m=makeMaze(10,10,{r:0,c:0},{r:9,c:9});
  [[1,1],[2,2],[3,3],[4,4],[5,5]].forEach(([r,c])=>m.grid[r][c].wall=true); return m; });

// ---------- study-mode line trace sanity (A* on tiny grid) ----------
console.log('TEST D: study line trace (first ~14 lines, A* on 3x3)');
{ const m=makeMaze(3,3,{r:0,c:0},{r:2,c:2}); const it=trace(m,'astar'); const seq=[];
  for(let i=0;i<14;i++){ const {value,done}=it.next(); if(done)break; seq.push(value.line); }
  console.log('   ', seq.join(' -> '));
  ok(seq[0]==='init','starts at init');
  ok(seq.includes('pop')&&seq.includes('goal')&&seq.includes('mark')&&seq.includes('for'),'walks pop/goal/mark/for');
}
console.log('\n'+(fail===0?'ALL PASS':'FAILURES')+'  pass='+pass+' fail='+fail);
process.exit(fail===0?0:1);
