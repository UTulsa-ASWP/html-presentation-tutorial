# Plan

## File Structure

Build the artifact in the cycle workspace root:

```text
html-presentation-tutorial/search-alg-demos/generated-by-codex-5.5/
├── index.html
├── assets/
│   ├── styles.css
│   └── script.js
└── iteration-1/
    ├── review.md
    ├── brainstorm.md
    ├── research.md
    ├── plan.md
    ├── execute.md
    └── verify.md
```

## Build Sequence

### 1. Create Static Shell

Create `index.html` with:

- Header/title area.
- Main workbench layout.
- Control panel.
- Visualization panel.
- State inspector.
- Metrics panel.
- Run history table.
- Guide panel.
- Local stylesheet and script references only.

### 2. Add Visual Design

Create `assets/styles.css` with:

- Responsive layout.
- Distinct but restrained palette.
- Stable dimensions for array cells, grid cells, controls, and history rows.
- Visual states for current, visited, frontier, path, walls, start, goal, found, and missed.
- Narrow-screen layout that stacks panels without overlap.

### 3. Implement State and Initialization

Create `assets/script.js` with:

- Central app state.
- DOM lookup helpers.
- Initial array and grid problem generation.
- Algorithm selection behavior.
- Input clamping.
- Render loop.

### 4. Implement Array Algorithms

Implement:

- Linear search reset/step.
- Binary search reset/step.
- Array rendering.
- Target controls.
- Low/mid/high markers for binary search.
- Current decision/status text.

### 5. Implement Grid Algorithms

Implement:

- Grid generation with walls.
- Start and goal placement.
- Optional click-to-toggle walls, excluding start and goal.
- BFS reset/step using a queue.
- DFS reset/step using a stack.
- Parent tracking and path reconstruction.
- Frontier/visited/path rendering.

### 6. Implement Run Controls

Implement:

- Run/pause timer.
- Step button.
- Reset button.
- Regenerate button.
- Speed slider.
- Algorithm-dependent control visibility.
- Disable unsafe changes only when auto-running, or pause automatically before applying changes.

### 7. Implement Metrics and History

Implement:

- Live metrics for steps, visited count, frontier size, result, and path length.
- Recent run history appended when an algorithm finishes.
- Clear enough labels to compare recent runs.
- History capped to a small number of rows.

### 8. Add Guide Copy and Accessibility Details

Add:

- Short in-app guide sections.
- Button labels that do not rely on icons.
- `aria-label` values for generated cells where useful.
- Textual status that mirrors color-coded state.

### 9. Verify Locally

Run:

- `node --check assets/script.js`
- Remote reference search over `index.html` and `assets/`.
- Manual browser smoke test by opening `index.html` directly or serving the folder only if needed.

## Testing Strategy

### Static Tests

- JavaScript syntax check with Node.
- Remote-reference search for `https?://`, `cdn`, and `googleapis`.

### Manual Functional Tests

- Linear search can find an existing target.
- Linear search reports not found for an absent target.
- Binary search narrows low/mid/high and finds an existing target.
- Binary search reports not found for an absent target.
- BFS finds a path when one exists and reports path length.
- DFS finds a path when one exists and records visited/path metrics.
- Step, run/pause, reset, regenerate, and speed controls work.
- Run history receives one row per completed run.
- Switching algorithms resets the correct visualization without stale state.
- Grid wall editing never changes start or goal cells.
- Layout remains usable at desktop and narrow widths.

### Security / Offline Tests

- No remote resources.
- No dependency install required.
- Dynamic user-controlled values are written with text APIs rather than HTML injection.
- Numeric inputs are clamped.

## Acceptance Criteria

- [ ] `index.html`, `assets/styles.css`, and `assets/script.js` exist in the artifact root.
- [ ] The artifact opens directly from `file://` with no build step.
- [ ] No external resource references are present.
- [ ] Four algorithms are available: linear search, binary search, BFS, and DFS.
- [ ] Each algorithm supports reset, single-step, and auto-run.
- [ ] Speed control changes auto-run cadence.
- [ ] Array algorithms visibly show inspected cells and binary low/mid/high state.
- [ ] Grid algorithms visibly show start, goal, walls, frontier, visited cells, and final path.
- [ ] Live metrics update while stepping/running.
- [ ] Completed runs are recorded in a recent-run history.
- [ ] The UI explains the current algorithm decision in text.
- [ ] JavaScript passes `node --check`.
- [ ] The artifact is responsive enough for desktop and mobile/narrow browser widths.

## Risks

- The UI could become too dense if array and grid modes share too many panels. Mitigation: hide irrelevant controls by mode.
- DFS path behavior may appear "worse" than BFS without explanation. Mitigation: guide text and status copy should state DFS is not shortest-path guaranteed.
- Run history could be misleading across regenerated problems. Mitigation: include mode/settings summary in each row.
