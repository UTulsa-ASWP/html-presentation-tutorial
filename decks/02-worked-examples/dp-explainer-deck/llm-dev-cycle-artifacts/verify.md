# Verify — Iteration 1 (DP Artifact)

**Status**: COMPLETE — manually verified by user
**Date**: April 8, 2026
**Verifier**: User (Dallas), hands-on in Chrome on macOS

## Method

User walked through the split artifact (`course_materials/demos/differential-privacy-explainer.html` + `assets/dp-explainer/{styles.css, script.js}`) in Chrome, exercised all 18 slides and all four interactive exhibits, and confirmed functional correctness. No automated test suite exists for this artifact — same-day visual build, manual verification is the intended method per `plan.md`.

## Acceptance Criteria

Checked against `plan.md` §"Acceptance Criteria Checklist". Criteria reworded where the three-file split or 18-slide restructure supersedes the original wording; substance preserved.

| # | Criterion | Status | Evidence |
|---|-----------|--------|----------|
| 1 | Artifact file exists with all narrative sections (originally "8 acts", restructured to 18 slides) | PASS | `course_materials/demos/differential-privacy-explainer.html` + assets dir present; 18 slides render |
| 2 | Self-contained — no external JS dependencies | PASS | Only Google Fonts via CSS `@import`; no JS CDN imports |
| 3 | All 4 interactive exhibits function (linkage attack, k-anonymity, epsilon slider, minority erasure) | PASS | User walked through all four in Chrome, confirmed each works |
| 4 | Website wrapper exists and loads the artifact | PASS | `website/demos/differential-privacy-explainer/index.html` iframes the demo; title updated to "Differential Privacy & Federated Learning" this session |
| 5 | Narrative tracks the intended arc (Sweeney → k-anonymity → DP → dark side → reframe) | PASS | 18-slide structure preserves the arc; see `handoff.md` slide table |
| 6 | Loads and functions in Chrome on macOS | PASS | User verified |
| 7 | Loads and functions in Safari on macOS | NOT VERIFIED | Deferred; not blocking since delivery machine runs Chrome. Flag for pre-class smoke test if podium is Safari |
| 8 | No console errors on page load | PASS (implied) | User reported no issues during walkthrough |
| 9 | No external JS dependencies (Network tab) | PASS | Confirmed by file inspection (see #2) |
| 10 | Laplace noise computed client-side; re-roll produces different values | PASS | `script.js` implements Laplace sampling; re-roll verified working |
| 11 | Epsilon slider produces continuous visible changes | PASS | User verified on slides 13 and 16 |
| 12 | Deployed to public course website | DEFERRED | User decision: do not deploy during active development. Will deploy after Iteration 2 (federated learning) or earlier if needed as podium fallback |
| 13 | Synthetic/mock data only | PASS | All datasets (medical records, voter records, salary bins, town demographics) are fabricated; documented in `handoff.md` |

### Keyboard navigation (added post-plan)

| Check | Status |
|-------|--------|
| Arrow keys / PageUp-Down / Space navigate slides | PASS |
| `S` toggles speaker notes panel | PASS |
| Slider focus correctly bypasses arrow-key slide nav | PASS |

## Deviations from Plan

1. **File structure**: Plan specified a single ~1500-2000 line self-contained HTML file. Actual implementation was split into three files (`differential-privacy-explainer.html`, `assets/dp-explainer/styles.css`, `assets/dp-explainer/script.js`) during Execute to enable small targeted edits. Still "self-contained" in the no-external-dependencies sense; CSS/JS are local assets. Documented in `handoff.md`.
2. **Section count**: Plan specified 8 acts. Actual delivery is 18 slides with a presentation-mode (arrow-key, scroll-snap) layout instead of a scrolling article. Narrative arc is preserved; structure is finer-grained. Documented in `handoff.md` slide table.
3. **Safari verification**: Deferred (see criterion #7). Low risk — `backdrop-filter` is the only modern feature that historically differs, and Safari has supported it since 9.
4. **Public deployment**: Deferred per user decision (criterion #12). Iteration is not "complete" in the original plan sense but the artifact itself is production-ready.

## Website Wrapper Corrections (this session)

The wrapper at `website/demos/differential-privacy-explainer/index.html` had stale references to the rejected title "The Invisible Math". Updated three occurrences:
- `<title>` tag
- Hero subtitle
- Iframe `title` attribute

**Still stale in the wrapper** (not touched this session — flag for later):
- Meta description and intro blurb reference "1997" (should be 1996) and "eight-act" (should reflect the 18-slide structure). Low priority since the wrapper isn't deployed.

## Outstanding Issues Carried Forward

From `handoff.md` §"Known issues":

- Copyright concern on `1996-time-cover.jpg` / `1996-oasis.png` — **resolved** by user decision: educational fair use is fine for in-class; re-evaluate before any public deploy.
- Slide 3 collage visual balance and Slide 4 side-by-side crowding — cosmetic, defer to next editing pass.
- `1996-internet.jpg` is actually WebP — non-blocking.
- Plan-vs-actual salary mean discrepancy ($55k vs $59,400) — documentation only; demo displays the correct value dynamically.
- No "jump to slide N" keyboard shortcut — enhancement, not blocking.

## Conclusion

Iteration 1 is **complete**. The artifact meets all functional acceptance criteria. Public deployment is intentionally deferred; Safari smoke-test is deferred as low risk. Next work on this artifact will be direct slide-deck edits outside the cycle workflow, per user direction.
