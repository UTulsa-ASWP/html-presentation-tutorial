'use strict';
const { makeMaze, makeSearch, MODES } = require('./engine.js');
let pass = 0, fail = 0;
const ok = (c, m) => { if (c) { pass++; } else { fail++; console.log('  FAIL:', m); } };

function runAll(maze) {
  const res = {};
  for (const mode of MODES) {
    const s = makeSearch(maze, mode);
    let guard = 0;
    while (!s.done && guard++ < 100000) s.step();
    res[mode] = { found: s.found, visited: s.visited, cost: s.cost(), steps: s.steps(),
                  path: s.path() };
  }
  // optimal flag
  const costs = MODES.filter(m => res[m].found).map(m => res[m].cost);
  const min = Math.min(...costs);
  for (const m of MODES) res[m].optimal = res[m].found && res[m].cost === min;
  return res;
}

function setW(maze, cells, w) { for (const [r,c] of cells) maze.grid[r][c].weight = w; }
function setWall(maze, cells) { for (const [r,c] of cells) maze.grid[r][c].wall = true; }

console.log('TEST 1: weighted fixture (matches Research prototype semantics)');
{
  // 4x5, start (0,0) -> end (0,4); mud row blocks the short way
  const maze = makeMaze(4, 5, {r:0,c:0}, {r:0,c:4});
  setW(maze, [[0,1],[0,2],[0,3],[2,0],[2,1],[2,2],[2,3]], 9);
  const r = runAll(maze);
  for (const m of MODES) console.log('  ', m.padEnd(9), JSON.stringify({found:r[m].found,steps:r[m].steps,cost:r[m].cost,visited:r[m].visited,opt:r[m].optimal}));
  ok(r.astar.cost === r.dijkstra.cost, 'A* cost == Dijkstra cost (optimality)');
  ok(r.dijkstra.optimal && r.astar.optimal, 'Dijkstra & A* flagged optimal');
  ok(r.bfs.cost >= r.dijkstra.cost, 'BFS cost >= optimal (ignores weight)');
  ok(r.greedy.cost >= r.dijkstra.cost, 'Greedy cost >= optimal');
  ok(r.bfs.steps <= r.dijkstra.steps, 'BFS uses <= steps than Dijkstra (fewest steps)');
  ok(r.astar.visited <= r.dijkstra.visited, 'A* visits <= Dijkstra');
}

console.log('TEST 2: open grid, A* should visit strictly fewer than Dijkstra');
{
  const maze = makeMaze(15, 15, {r:7,c:0}, {r:7,c:14});
  const r = runAll(maze);
  console.log('   dijkstra.visited =', r.dijkstra.visited, ' astar.visited =', r.astar.visited);
  ok(r.astar.cost === r.dijkstra.cost, 'A* optimal on open grid');
  ok(r.astar.visited < r.dijkstra.visited, 'A* visits strictly fewer on open grid');
}

console.log('TEST 3: no path (goal walled off)');
{
  const maze = makeMaze(5, 5, {r:0,c:0}, {r:4,c:4});
  setWall(maze, [[3,4],[4,3]]); // seal the corner
  const r = runAll(maze);
  for (const m of MODES) ok(r[m].found === false, m + ' reports no path');
  for (const m of MODES) ok(r[m].path === null, m + ' path() is null when unreachable');
}

console.log('TEST 4: path validity (contiguous, no walls, endpoints correct)');
{
  const maze = makeMaze(10, 10, {r:0,c:0}, {r:9,c:9});
  setWall(maze, [[1,1],[2,2],[3,3],[4,4],[5,5]]);
  const r = runAll(maze);
  for (const m of MODES) {
    const p = r[m].path; if (!p) { ok(false, m+' found a path'); continue; }
    let contig = true, nowall = true;
    for (let i=0;i<p.length;i++){ if (p[i].wall) nowall=false;
      if (i>0){ const d=Math.abs(p[i].r-p[i-1].r)+Math.abs(p[i].c-p[i-1].c); if (d!==1) contig=false; } }
    ok(p[0].r===0&&p[0].c===0, m+' path starts at start');
    ok(p[p.length-1].r===9&&p[p.length-1].c===9, m+' path ends at end');
    ok(contig, m+' path is 4-contiguous');
    ok(nowall, m+' path avoids walls');
  }
}

console.log('TEST 5: start == end degenerate case');
{
  const maze = makeMaze(5,5,{r:2,c:2},{r:2,c:2});
  const r = runAll(maze);
  for (const m of MODES) { ok(r[m].found, m+' finds trivial path'); ok(r[m].cost===0, m+' cost 0'); ok(r[m].steps===0, m+' steps 0'); }
}

console.log('\\n' + (fail===0 ? 'ALL PASS' : 'SOME FAILED') + '  pass='+pass+' fail='+fail);
process.exit(fail===0?0:1);
