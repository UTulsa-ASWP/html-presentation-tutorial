# Research

## Stack Selection

Use a fully static, no-dependency stack:

- `index.html` for structure.
- `assets/styles.css` for layout, visual states, and responsive behavior.
- `assets/script.js` for simulation state, algorithms, controls, rendering, and run history.

This matches the tutorial suite constraints:

- No framework.
- No build step.
- No CDN.
- No network.
- Opens directly from `file://`.

## Dependency Decision

No external runtime dependencies are needed.

Reasons:

- Linear search, binary search, BFS, and DFS are small enough to implement directly and inspect.
- Canvas/SVG libraries are unnecessary; DOM grid/cell rendering is sufficient and more accessible for this scale.
- Charting libraries are unnecessary; the first version only needs live metrics and a compact run history table.
- Avoiding dependencies makes the artifact robust for offline classrooms.

Because there are no third-party packages, there is no package audit to run. The relevant security check is instead a static resource check for remote references such as `https://`, CDN URLs, and web font imports.

## Technical Decisions

### Rendering

Use DOM elements rather than canvas.

Rationale:

- Easier to style states with CSS classes.
- Easier to expose labels and accessible text.
- Easier for students/instructors to inspect in browser dev tools.
- Grid sizes are small enough that DOM performance is not a concern.

### State Model

Use a single app state object with:

- Selected algorithm.
- Array problem data.
- Grid problem data.
- Active run state.
- Timer ID for auto-run.
- Metrics.
- Run history.

Each algorithm should expose a common stepping interface:

```text
reset -> initializes algorithm state
step -> advances one algorithm action and returns status
```

The renderer reads state and updates the DOM after each step.

### Algorithm Behavior

Linear search:

- Inspect cells from left to right.
- Stop when target is found or the array is exhausted.

Binary search:

- Require sorted array data.
- Track `low`, `mid`, and `high`.
- Narrow the search interval after each comparison.

BFS:

- Use a queue.
- Explore grid neighbors in a stable order.
- Track visited cells and parent links.
- Reconstruct path when the goal is reached.

DFS:

- Use a stack.
- Explore grid neighbors in a stable order.
- Track visited cells and parent links.
- Reconstruct first found path, which is not guaranteed shortest.

### Controls

Use native controls:

- `<select>` for algorithm choice.
- Buttons for run/pause, step, reset, regenerate.
- Range input for speed.
- Number/range controls for target and obstacle density.

Clamp all numeric input in JavaScript before using it.

### Persistence

Do not persist state in this iteration.

The GA workbench persists progress and settings locally, but local storage adds extra edge cases around stale schemas and reset behavior. Lightweight in-memory history is enough for the first version.

### Accessibility

- Buttons should have clear text labels.
- Algorithm state should be visible in text, not only color.
- Grid and array cells should include labels or `aria-label` values.
- Avoid requiring keyboard shortcuts for core use.

## Security Posture

The artifact is low-risk because it is static and local.

Security-relevant practices:

- Use `textContent` for dynamic labels and status messages.
- Do not use `innerHTML` for user-controlled values.
- Clamp inputs such as target values and obstacle density.
- Do not fetch remote resources.
- Do not store or transmit user data.

## Verification Strategy

Manual/browser verification:

- Open `index.html` directly in a browser.
- Confirm all four algorithms reset, step, auto-run, and finish.
- Confirm changing algorithms switches the correct visualization mode.
- Confirm metrics and run history update.
- Confirm grid wall toggling, if implemented, does not allow blocking start/goal cells.
- Confirm responsive layout at desktop and narrow widths.

Static checks:

- Search the artifact for remote references: `https?://`, `cdn`, `googleapis`.
- Run a JavaScript syntax check with `node --check assets/script.js`.

Optional lightweight automated check:

- If needed, create a temporary local script using a DOM-capable test environment only if already available. Do not add dependencies just for this iteration.
