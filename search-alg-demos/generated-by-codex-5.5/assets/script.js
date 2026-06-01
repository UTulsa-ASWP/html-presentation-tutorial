const GRID_SIZE = 12;
const ARRAY_SIZE = 14;
const HISTORY_LIMIT = 8;

const guides = {
  linear: "Linear search checks one item at a time until it finds the target or runs out of cells.",
  binary: "Binary search keeps a sorted interval and compares the target to the middle value.",
  bfs: "Breadth-first search uses a queue, expands evenly, and finds shortest paths in unweighted grids.",
  dfs: "Depth-first search uses a stack, follows one branch deeply, and does not guarantee the shortest path."
};

const names = {
  linear: "Linear search",
  binary: "Binary search",
  bfs: "Breadth-first search",
  dfs: "Depth-first search"
};

const state = {
  algorithm: "linear",
  array: [],
  target: 42,
  grid: [],
  density: 24,
  run: null,
  timer: null,
  history: []
};

const els = {};

document.addEventListener("DOMContentLoaded", () => {
  cacheDom();
  bindEvents();
  regenerateArray();
  regenerateGrid();
  resetRun("Ready. Press Step to inspect the first item.");
});

function cacheDom() {
  [
    "algorithmSelect", "targetInput", "densityInput", "densityValue", "runBtn",
    "stepBtn", "resetBtn", "regenBtn", "speedInput", "speedValue", "arrayControls",
    "gridControls", "guideText", "visualTitle", "resultBadge", "arrayView",
    "gridView", "legend", "statusText", "stepsMetric", "visitedMetric",
    "frontierMetric", "pathMetric", "stateText", "historyBody"
  ].forEach((id) => {
    els[id] = document.getElementById(id);
  });
}

function bindEvents() {
  els.algorithmSelect.addEventListener("change", () => {
    pause();
    state.algorithm = els.algorithmSelect.value;
    resetRun("Algorithm changed. Press Step or Run to begin.");
  });

  els.targetInput.addEventListener("change", () => {
    pause();
    state.target = clamp(Number(els.targetInput.value), 1, 99);
    els.targetInput.value = state.target;
    resetRun("Target changed. Search state reset.");
  });

  els.densityInput.addEventListener("input", () => {
    state.density = clamp(Number(els.densityInput.value), 0, 42);
    els.densityValue.textContent = `${state.density}%`;
  });

  els.densityInput.addEventListener("change", () => {
    pause();
    regenerateGrid();
    resetRun("Grid regenerated with the new wall density.");
  });

  els.speedInput.addEventListener("input", () => {
    els.speedValue.textContent = els.speedInput.value;
    if (state.timer) {
      pause();
      run();
    }
  });

  els.runBtn.addEventListener("click", () => {
    if (state.timer) {
      pause();
    } else {
      run();
    }
  });
  els.stepBtn.addEventListener("click", () => {
    pause();
    stepOnce();
  });
  els.resetBtn.addEventListener("click", () => {
    pause();
    resetRun("Reset complete. Press Step or Run to begin again.");
  });
  els.regenBtn.addEventListener("click", () => {
    pause();
    if (isArrayAlgorithm()) {
      regenerateArray();
    } else {
      regenerateGrid();
    }
    resetRun("Problem regenerated. Press Step or Run to begin.");
  });
}

function regenerateArray() {
  const values = new Set([state.target]);
  while (values.size < ARRAY_SIZE) {
    values.add(randomInt(4, 96));
  }
  state.array = Array.from(values).slice(0, ARRAY_SIZE);
  state.array.sort((a, b) => a - b);
  if (state.algorithm === "linear") {
    shuffle(state.array);
  }
}

function regenerateGrid() {
  const start = key(0, 0);
  const goal = key(GRID_SIZE - 1, GRID_SIZE - 1);
  state.grid = [];
  for (let row = 0; row < GRID_SIZE; row += 1) {
    const cells = [];
    for (let col = 0; col < GRID_SIZE; col += 1) {
      const id = key(row, col);
      cells.push({
        row,
        col,
        wall: id !== start && id !== goal && Math.random() * 100 < state.density
      });
    }
    state.grid.push(cells);
  }
}

function resetRun(message) {
  const algorithm = state.algorithm;
  if (algorithm === "linear") {
    state.run = {
      done: false,
      result: "Ready",
      steps: 0,
      visited: new Set(),
      current: null,
      index: 0,
      foundIndex: null,
      status: message
    };
  } else if (algorithm === "binary") {
    if (!isSorted(state.array)) state.array.sort((a, b) => a - b);
    state.run = {
      done: false,
      result: "Ready",
      steps: 0,
      visited: new Set(),
      current: null,
      low: 0,
      high: state.array.length - 1,
      mid: null,
      foundIndex: null,
      status: message
    };
  } else {
    const start = { row: 0, col: 0 };
    state.run = {
      done: false,
      result: "Ready",
      steps: 0,
      visited: new Set([key(start.row, start.col)]),
      frontier: [start],
      current: null,
      parents: new Map(),
      path: [],
      status: message
    };
  }
  render();
}

function run() {
  if (state.run.done) resetRun("Restarting completed run.");
  els.runBtn.textContent = "Pause";
  state.timer = window.setInterval(() => {
    stepOnce();
    if (state.run.done) pause();
  }, speedDelay());
}

function pause() {
  if (state.timer) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
  if (els.runBtn) els.runBtn.textContent = "Run";
}

function stepOnce() {
  if (state.run.done) return;
  if (state.algorithm === "linear") stepLinear();
  if (state.algorithm === "binary") stepBinary();
  if (state.algorithm === "bfs") stepGraph("queue");
  if (state.algorithm === "dfs") stepGraph("stack");
  if (state.run.done) recordHistory();
  render();
}

function stepLinear() {
  const run = state.run;
  if (run.index >= state.array.length) {
    finish("Missed", `Target ${state.target} was not found after checking every cell.`);
    return;
  }

  run.current = run.index;
  run.visited.add(run.index);
  run.steps += 1;
  const value = state.array[run.index];
  if (value === state.target) {
    run.foundIndex = run.index;
    finish("Found", `Found ${state.target} at index ${run.index}.`);
  } else {
    run.status = `Checked index ${run.index}: ${value} is not ${state.target}. Move right.`;
    run.index += 1;
  }
}

function stepBinary() {
  const run = state.run;
  if (run.low > run.high) {
    finish("Missed", `The interval is empty. Target ${state.target} is not in the array.`);
    return;
  }

  run.mid = Math.floor((run.low + run.high) / 2);
  run.current = run.mid;
  run.visited.add(run.mid);
  run.steps += 1;
  const value = state.array[run.mid];

  if (value === state.target) {
    run.foundIndex = run.mid;
    finish("Found", `Found ${state.target} at middle index ${run.mid}.`);
  } else if (value < state.target) {
    run.status = `${value} is smaller than ${state.target}. Discard the left half.`;
    run.low = run.mid + 1;
  } else {
    run.status = `${value} is larger than ${state.target}. Discard the right half.`;
    run.high = run.mid - 1;
  }
}

function stepGraph(kind) {
  const run = state.run;
  if (run.frontier.length === 0) {
    finish("Missed", "The frontier is empty. No path reaches the goal.");
    return;
  }

  const current = kind === "queue" ? run.frontier.shift() : run.frontier.pop();
  run.current = current;
  run.steps += 1;

  if (current.row === GRID_SIZE - 1 && current.col === GRID_SIZE - 1) {
    run.path = reconstructPath(current);
    finish("Found", `Reached the goal with a path length of ${Math.max(0, run.path.length - 1)}.`);
    return;
  }

  const neighbors = getNeighbors(current);
  neighbors.forEach((next) => {
    const id = key(next.row, next.col);
    if (!run.visited.has(id) && !cellAt(next).wall) {
      run.visited.add(id);
      run.parents.set(id, key(current.row, current.col));
      run.frontier.push(next);
    }
  });

  const frontierName = kind === "queue" ? "queue" : "stack";
  run.status = `Expanded (${current.row}, ${current.col}); added ${neighbors.length} candidates to the ${frontierName}.`;
}

function finish(result, message) {
  state.run.done = true;
  state.run.result = result;
  state.run.status = message;
}

function render() {
  const arrayMode = isArrayAlgorithm();
  els.arrayControls.hidden = !arrayMode;
  els.gridControls.hidden = arrayMode;
  els.arrayView.hidden = !arrayMode;
  els.gridView.hidden = arrayMode;
  els.visualTitle.textContent = names[state.algorithm];
  els.guideText.textContent = guides[state.algorithm];
  els.statusText.textContent = state.run.status;
  renderBadge();
  if (arrayMode) {
    renderArray();
  } else {
    renderGrid();
  }
  renderLegend();
  renderMetrics();
  renderState();
  renderHistory();
}

function renderBadge() {
  const badge = els.resultBadge;
  badge.className = "result-badge";
  badge.textContent = state.run.result;
  if (state.run.result === "Found") badge.classList.add("found");
  if (state.run.result === "Missed") badge.classList.add("missed");
}

function renderArray() {
  const run = state.run;
  els.arrayView.replaceChildren();
  state.array.forEach((value, index) => {
    const cell = document.createElement("div");
    cell.className = "array-cell";
    if (run.visited.has(index)) cell.classList.add("visited");
    if (run.current === index) cell.classList.add("current");
    if (run.foundIndex === index) cell.classList.add("found");
    cell.textContent = value;
    cell.setAttribute("aria-label", `Index ${index}, value ${value}`);

    if (state.algorithm === "binary") {
      const markers = [];
      if (run.low === index) markers.push("low");
      if (run.mid === index) markers.push("mid");
      if (run.high === index) markers.push("high");
      if (markers.length > 0) {
        const marker = document.createElement("span");
        marker.className = "array-marker";
        marker.textContent = markers.join("/");
        cell.appendChild(marker);
      }
    }

    els.arrayView.appendChild(cell);
  });
}

function renderGrid() {
  const run = state.run;
  const frontierKeys = new Set(run.frontier.map((cell) => key(cell.row, cell.col)));
  const pathKeys = new Set(run.path.map((cell) => key(cell.row, cell.col)));
  const currentKey = run.current ? key(run.current.row, run.current.col) : "";

  els.gridView.replaceChildren();
  state.grid.flat().forEach((cellData) => {
    const id = key(cellData.row, cellData.col);
    const cell = document.createElement("button");
    cell.type = "button";
    cell.className = "grid-cell";
    cell.setAttribute("aria-label", `Cell ${cellData.row}, ${cellData.col}`);
    cell.addEventListener("click", () => toggleWall(cellData.row, cellData.col));

    if (cellData.wall) cell.classList.add("wall");
    if (run.visited.has(id)) cell.classList.add("visited");
    if (frontierKeys.has(id)) cell.classList.add("frontier");
    if (pathKeys.has(id)) cell.classList.add("path");
    if (id === currentKey) cell.classList.add("current");
    if (id === key(0, 0)) cell.classList.add("start");
    if (id === key(GRID_SIZE - 1, GRID_SIZE - 1)) cell.classList.add("goal");
    els.gridView.appendChild(cell);
  });
}

function renderLegend() {
  const items = isArrayAlgorithm()
    ? [["current", "Current"], ["visited", "Checked"], ["path", "Found"]]
    : [["start", "Start"], ["goal", "Goal"], ["wall", "Wall"], ["frontier", "Frontier"], ["visited", "Visited"], ["current", "Current"], ["path", "Path"]];
  els.legend.replaceChildren(...items.map(([className, label]) => {
    const item = document.createElement("span");
    item.className = "legend-item";
    const swatch = document.createElement("span");
    swatch.className = `swatch ${className}`;
    const text = document.createElement("span");
    text.textContent = label;
    item.append(swatch, text);
    return item;
  }));
}

function renderMetrics() {
  const run = state.run;
  els.stepsMetric.textContent = String(run.steps);
  els.visitedMetric.textContent = String(run.visited.size);
  els.frontierMetric.textContent = isArrayAlgorithm() ? "-" : String(run.frontier.length);
  els.pathMetric.textContent = run.path ? String(Math.max(0, run.path.length - 1)) : "-";
}

function renderState() {
  const run = state.run;
  if (state.algorithm === "linear") {
    els.stateText.textContent = `target: ${state.target}
next index: ${run.index}
current index: ${formatValue(run.current)}
checked indexes: ${Array.from(run.visited).join(", ") || "none"}`;
  } else if (state.algorithm === "binary") {
    els.stateText.textContent = `target: ${state.target}
low: ${run.low}
mid: ${formatValue(run.mid)}
high: ${run.high}
checked indexes: ${Array.from(run.visited).join(", ") || "none"}`;
  } else {
    const frontier = run.frontier.map((cell) => `(${cell.row},${cell.col})`).slice(0, 10).join(" ");
    els.stateText.textContent = `frontier type: ${state.algorithm === "bfs" ? "queue" : "stack"}
current: ${run.current ? `(${run.current.row},${run.current.col})` : "none"}
frontier: ${frontier || "empty"}
visited cells: ${run.visited.size}
path length: ${run.path ? Math.max(0, run.path.length - 1) : "-"}`;
  }
}

function renderHistory() {
  els.historyBody.replaceChildren();
  if (state.history.length === 0) {
    const row = document.createElement("tr");
    const cell = document.createElement("td");
    cell.colSpan = 4;
    cell.textContent = "No completed runs yet.";
    row.appendChild(cell);
    els.historyBody.appendChild(row);
    return;
  }
  state.history.forEach((entry) => {
    const row = document.createElement("tr");
    [entry.algorithm, entry.result, entry.steps, entry.visited].forEach((value) => {
      const cell = document.createElement("td");
      cell.textContent = String(value);
      row.appendChild(cell);
    });
    els.historyBody.appendChild(row);
  });
}

function recordHistory() {
  const run = state.run;
  state.history.unshift({
    algorithm: names[state.algorithm],
    result: run.result,
    steps: run.steps,
    visited: run.visited.size
  });
  state.history = state.history.slice(0, HISTORY_LIMIT);
}

function toggleWall(row, col) {
  if (state.timer) pause();
  if ((row === 0 && col === 0) || (row === GRID_SIZE - 1 && col === GRID_SIZE - 1)) return;
  const cell = cellAt({ row, col });
  cell.wall = !cell.wall;
  resetRun("Wall edited. Search state reset.");
}

function reconstructPath(goal) {
  const path = [goal];
  let cursor = key(goal.row, goal.col);
  while (state.run.parents.has(cursor)) {
    const parentKey = state.run.parents.get(cursor);
    const [row, col] = parentKey.split(",").map(Number);
    path.push({ row, col });
    cursor = parentKey;
  }
  return path.reverse();
}

function getNeighbors(cell) {
  return [
    { row: cell.row - 1, col: cell.col },
    { row: cell.row, col: cell.col + 1 },
    { row: cell.row + 1, col: cell.col },
    { row: cell.row, col: cell.col - 1 }
  ].filter((next) => (
    next.row >= 0 &&
    next.row < GRID_SIZE &&
    next.col >= 0 &&
    next.col < GRID_SIZE
  ));
}

function speedDelay() {
  const speed = clamp(Number(els.speedInput.value), 1, 10);
  return 900 - speed * 75;
}

function isArrayAlgorithm() {
  return state.algorithm === "linear" || state.algorithm === "binary";
}

function isSorted(values) {
  return values.every((value, index) => index === 0 || values[index - 1] <= value);
}

function cellAt(cell) {
  return state.grid[cell.row][cell.col];
}

function key(row, col) {
  return `${row},${col}`;
}

function clamp(value, min, max) {
  if (Number.isNaN(value)) return min;
  return Math.max(min, Math.min(max, value));
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function shuffle(values) {
  for (let i = values.length - 1; i > 0; i -= 1) {
    const j = randomInt(0, i);
    [values[i], values[j]] = [values[j], values[i]];
  }
}

function formatValue(value) {
  return value === null || value === undefined ? "none" : String(value);
}
