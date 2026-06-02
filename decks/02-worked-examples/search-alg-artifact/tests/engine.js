'use strict';
// ---- Pathfinding engine: pure logic, no DOM. Inlined verbatim into the artifact. ----

const DIRS = [[-1,0],[1,0],[0,-1],[0,1]]; // 4-connected
const keyOf = (cell) => cell.r + ',' + cell.c;

function makeMaze(rows, cols, start, end) {
  const grid = [];
  for (let r = 0; r < rows; r++) {
    const row = [];
    for (let c = 0; c < cols; c++) row.push({ r, c, wall: false, weight: 1 });
    grid.push(row);
  }
  return { rows, cols, grid, start, end };
}
function neighbors(maze, cell) {
  const out = [];
  for (const [dr, dc] of DIRS) {
    const nr = cell.r + dr, nc = cell.c + dc;
    if (nr < 0 || nr >= maze.rows || nc < 0 || nc >= maze.cols) continue;
    const n = maze.grid[nr][nc];
    if (n.wall) continue;
    out.push(n);
  }
  return out;
}

class MinHeap {
  constructor() { this.a = []; }
  size() { return this.a.length; }
  push(item) { // item: {key, cell, k}
    const a = this.a; a.push(item); let i = a.length - 1;
    while (i > 0) { const p = (i - 1) >> 1; if (a[p].key <= a[i].key) break;
      const t = a[p]; a[p] = a[i]; a[i] = t; i = p; }
  }
  pop() {
    const a = this.a, top = a[0], last = a.pop();
    if (a.length) { a[0] = last; let i = 0; const n = a.length;
      for (;;) { let l = 2*i+1, rr = 2*i+2, s = i;
        if (l < n && a[l].key < a[s].key) s = l;
        if (rr < n && a[rr].key < a[s].key) s = rr;
        if (s === i) break; const t = a[s]; a[s] = a[i]; a[i] = t; i = s; } }
    return top;
  }
}

const MODES = ['bfs', 'dijkstra', 'greedy', 'astar'];
const EMPTY = { opened: [], closedCell: null };

function makeSearch(maze, mode) {
  const startK = keyOf(maze.start), goalK = keyOf(maze.end);
  const gScore = new Map([[startK, 0]]);
  const cameFrom = new Map();
  const closed = new Set();
  const inOpen = new Set([startK]);
  const relaxes = (mode === 'dijkstra' || mode === 'astar');
  let fifo = null, head = 0, heap = null;
  let visited = 0, done = false, found = false;

  const startCell = maze.grid[maze.start.r][maze.start.c];
  const goalCell = maze.grid[maze.end.r][maze.end.c];
  const h = (cell) => Math.abs(cell.r - maze.end.r) + Math.abs(cell.c - maze.end.c);
  const priority = (k, cell) => mode === 'dijkstra' ? gScore.get(k)
                              : mode === 'astar' ? gScore.get(k) + h(cell)
                              : h(cell); // greedy
  if (mode === 'bfs') fifo = [startCell];
  else { heap = new MinHeap(); heap.push({ key: priority(startK, startCell), cell: startCell, k: startK }); }

  function step() {
    if (done) return EMPTY;
    let cur;
    if (mode === 'bfs') {
      while (head < fifo.length && closed.has(keyOf(fifo[head]))) head++;
      if (head >= fifo.length) { done = true; return EMPTY; }
      cur = fifo[head++];
    } else {
      let top;
      do { if (heap.size() === 0) { done = true; return EMPTY; } top = heap.pop(); }
      while (closed.has(top.k));
      cur = top.cell;
    }
    const curK = keyOf(cur);
    inOpen.delete(curK); closed.add(curK); visited++;
    if (curK === goalK) { done = true; found = true; return { opened: [], closedCell: cur }; }
    const opened = [];
    for (const nb of neighbors(maze, cur)) {
      const nk = keyOf(nb);
      if (closed.has(nk)) continue;
      if (relaxes) {
        const tentative = gScore.get(curK) + nb.weight;
        if (!gScore.has(nk) || tentative < gScore.get(nk)) {
          gScore.set(nk, tentative); cameFrom.set(nk, curK);
          heap.push({ key: priority(nk, nb), cell: nb, k: nk });
          if (!inOpen.has(nk)) { inOpen.add(nk); opened.push(nb); }
        }
      } else { // bfs / greedy: first reach wins
        if (inOpen.has(nk)) continue;
        gScore.set(nk, gScore.get(curK) + nb.weight); // for cost reporting only
        cameFrom.set(nk, curK); inOpen.add(nk); opened.push(nb);
        if (mode === 'bfs') fifo.push(nb); else heap.push({ key: h(nb), cell: nb, k: nk });
      }
    }
    return { opened, closedCell: cur };
  }

  function path() {
    if (!found) return null;
    const out = []; let k = goalK;
    while (k !== startK) { const [r, c] = k.split(',').map(Number); out.push(maze.grid[r][c]);
      k = cameFrom.get(k); if (k === undefined) return null; }
    out.push(startCell); out.reverse(); return out;
  }

  return {
    mode, step, path,
    get done() { return done; }, get found() { return found; },
    get visited() { return visited; },
    cost() { return found ? gScore.get(goalK) : null; },
    steps() { const p = path(); return p ? p.length - 1 : null; },
    isOpen: (cell) => inOpen.has(keyOf(cell)),
    isClosed: (cell) => closed.has(keyOf(cell)),
  };
}

module.exports = { makeMaze, makeSearch, MinHeap, MODES, keyOf, neighbors };
