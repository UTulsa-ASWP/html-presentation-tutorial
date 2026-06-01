# Brainstorm

## Chosen Concept

Build a standalone **Search Algorithm Workbench**: a browser-only interactive artifact for teaching how search algorithms explore a problem space.

The workbench should improve on a basic animation by borrowing the strongest teaching patterns from the GA workbench:

- Run, pause, step, reset, and speed controls.
- Tunable problem settings.
- Visible algorithm state, not just final answers.
- Live metrics while the algorithm runs.
- A trace/history panel for comparing recent runs.
- Contextual guide text near the controls.

The first version should not clone the full GA application. It should focus on a tighter classroom workflow:

1. Pick an algorithm.
2. Pick or generate a problem.
3. Step through the algorithm manually or auto-run it.
4. Watch the frontier/current node/visited set update.
5. Compare recent runs using small metrics.

## Core Teaching Shape

Use two complementary problem types:

- **Array search** for linear search and binary search.
- **Grid search** for breadth-first search and depth-first search.

This gives the demo a useful contrast:

- Linear search checks items one by one.
- Binary search narrows a sorted interval.
- BFS expands evenly and finds shortest paths in an unweighted grid.
- DFS follows one branch deeply and may find a path without finding the shortest one.

## Proposed Interaction Model

### Global Controls

- Algorithm selector: Linear, Binary, BFS, DFS.
- Run / pause.
- Step.
- Reset.
- Speed control.
- Regenerate problem.

### Array Mode

Shown for linear and binary search:

- Array cells rendered as a row of values.
- Target value control.
- Current inspected cell highlighted.
- Binary search shows low, mid, high markers.
- Status line explains the current decision.

### Grid Mode

Shown for BFS and DFS:

- Grid of cells with walls, start, goal, frontier, visited, and final path.
- User can regenerate obstacles.
- Optional wall editing by clicking cells if time allows.
- Queue/stack preview shows the pending frontier.
- Status line explains the next expansion.

### Metrics

For every run:

- Steps taken.
- Nodes/items visited.
- Frontier size.
- Found/not found.
- Path length for grid algorithms.

### Run History

Keep a small in-page log of recent runs:

- Algorithm.
- Problem type/settings.
- Steps.
- Visited count.
- Result.

This gives a lightweight comparison feature inspired by the GA experiment panel without building full preset banks or repeated statistical experiments.

## Alternatives Considered

### Full Experiment Workbench

Rejected for the first pass. A full preset/experiment system would be powerful but would shift too much effort into state management and away from the algorithm visualization itself.

### Slide Deck With Embedded Widgets

Rejected for the first pass. The tutorial suite supports slide decks, but this artifact is better as a direct workbench: instructors can still present from it, and students can interact with it more naturally.

### Binary Search Only

Rejected because the user asked for a search algorithm demo, and the GA reference suggests a broader workbench-like artifact. Binary search alone would be polished but too narrow.

### Include A* and Dijkstra

Deferred. They are valuable, but they introduce weighted costs, heuristics, and priority queues. BFS/DFS already show core frontier behavior and leave room for future iteration.

## Scope Boundaries

Build in this iteration:

- Standalone `index.html`.
- Local `assets/styles.css`.
- Local `assets/script.js`.
- Four algorithms: linear search, binary search, BFS, DFS.
- Manual stepping and auto-run.
- Speed control.
- Live visualization and metrics.
- Lightweight run history.
- Fully offline operation.

Do not build in this iteration:

- Full saved preset management.
- Downloadable traces.
- Multi-repetition experiment runner.
- External charting library.
- Persistent local storage.
- Weighted graph algorithms.
- Authentication, server, or build tooling.

## Security-Relevant Boundaries

The artifact is static and local. There is no backend, authentication, remote fetch, or stored sensitive data.

Boundaries to keep clean:

- User-controlled values such as target numbers, grid size, and obstacle density should be clamped and validated.
- UI updates should use DOM text APIs instead of injecting unsanitized HTML.
- No remote resources should be referenced.
- No user data should be transmitted.

## Open Design Decision

The only remaining meaningful product decision is whether to include direct grid editing in the first version. Recommendation: include simple click-to-toggle walls if implementation stays small, because it makes BFS/DFS much more teachable. If it starts to complicate reset/history behavior, defer it.
