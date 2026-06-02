# Building the DP Explainer — Condensed Transcript

*A condensed record of the two `llm-dev:cycle` sessions that produced the
Differential Privacy Explainer (the worked example narrated in Deck 2).*

**Source transcripts** (in `CYB-4203-6203/.archive/transcripts/`):
- `20260408-grade-assignments-and-start-dp-presentation.json` (conv #74) — the DP
  portion only; the grading work that opened that session is omitted.
- `20260408-dp-explainer-deck-expansion-and-deploy.json` (conv #75) — in full.

**How to read this:** the user's (Dallas's) messages are reproduced **verbatim** in
blockquotes. Claude's responses are **summarized** to one or two lines that capture the
decision or the work done, not the full prose. A handful of immediate re-sends (where
the same message was sent twice, the second time expanded) are collapsed to the fuller
version with a note.

---

## Session 1 — Start DP, run the cycle (conv #74)

**You:**
> Fantastic. All right next I'd like to run an llm-dev cycle to develop an interactive demo that I can present in class tomorrow to illustrate privacy-enhancing and security technologies, specifically: differential privacy and federated learning. Let's talk about options and feasibility.

*Claude:* Set up the cycle and ran **Phase 1 (Review)** — first iteration, so loaded
context and wrote `review.md` — then opened **Phase 2 (Brainstorm)** with a design
question.

**You:**
> So this could be something where we create an app and we get student participation through scanning a QR code on their phones or something and then voting or interacting at different phases of the demo. Could be just a demo where I do it on screen, although I would like for them to be engaged through participation somehow. Lots of options to brainstorm.

*Claude:* Brainstormed a two-part **"Privacy Lab"** — DP ("students *are* the data") +
FL ("students *are* the federation") — weighed multi-device architectures (local
server / ngrok / Firebase), flagged FL as the much harder build, and proposed a
static-frontend + cloud-state design.

**You:**
> For Differential Privacy - what are some other questions that could gather data used in real machine learning applications? I can see where you're going with sleep hours, screen time, and unread emails - but rather than unread emails, how about 'late or missing assignments', or something that might resonate more with students? What functions might a machine learning model with this type of data serve? Recommendation? Classification?

*Claude:* Proposed a realistic **"student success / retention-risk prediction"**
scenario (sleep, screen time, late/missing assignments → at-risk classification),
deliberately uncomfortable to make the privacy tension land.

**You:**
> Help me understand what differential privacy helps to protect against, and then let's think again about how to demonstrate a real-world use case

*Claude:* Explained DP's threat model — re-identification from *query results*
(differencing, linkage, membership-inference attacks), the ε guarantee, and real
deployments (Census, Apple, Google). Argued the demo should show **attack-then-defense**,
not just "we add noise."

**You:**
> I like this framing. What's a real-world example of a dataset that might be publicly available that could be cross-referenced with data from the questions that students answer in class?

*Claude:* Pointed to voter-registration records (the Sweeney attack) and, more
relatably, the university directory / social media / **LMS data** — emphasizing the
"trusted data-holder combines datasets it already has" angle.

**You:**
> Hmmm... I'm thinking that this may not demonstrate what I'm trying to show. Can you search for existing DP and FL demo apps online? Rather than recreating the wheel, maybe there are online resources or repositories that we could repurpose

*Claude:* Searched and tabulated existing DP tools (ViP, **DP Tetris**, **CT Census**,
OpenDP Wizard) and FL tools (FL Playground, PAIR Explorable, Google comic, InFL-UX);
offered three paths — curated tour / thin wrapper / full custom.

**You:**
*(A shorter first draft of this was sent moments earlier; this is the expanded version.)*
> Some of the resources that you gathered are pretty good, but I'd like you to find more.
>
> For DP, I especially like the Tetris game demo and the real 2020 census impact on Connecticut towns.  The Tetris demo is fun to play and demonstrates DP intuitively. The census impact website shows how demographics within communities are modified by applying DP, and includes a letter of objection filed by the demographic reporting group who created the website that describes some of their objections and problems with using differential privacy.
>
> I think what's missing here is a step-by-step explainer of the basics of DP that illustrates the general problem and describes the components of the DP framework. I think we need to pivot to developing an interactive artifact that students won't necessarily be able to use, but that I can run from the podium. I may not be able to connect my laptop, so we should plan to publish it as a GitHub page or in some other way.
>
> For FL - the resources look good - I'm checking them out now, and I'll have more for you soon.

*Claude:* Reframed the scope to a **self-contained, instructor-driven interactive
explainer of DP fundamentals**, published to a URL (podium, no laptop link). Searched
for more explainers (PAIR, LEAP/xDP, programming-dp, Desfontaines) and confirmed the
clean "problem → definition → mechanism → tradeoff" walkthrough was a genuine gap —
*that* would be the artifact, with DP Tetris and CT Census flanking it.

**You:**
*(A shorter first draft of this was sent moments earlier; this is the expanded version.)*
> I just found a really good podcast on Spotify called 'Privacy Tech Evolution: From k-Anonymity to Differential Privacy' - it's from a content creator channel called Rapid Synthesis, and the podcast is generated by NotebookLM.
>
> I'd like to follow the general progression of this podcast to teach the DP section of the presentation. I've copy-pasted the transcript into course_materials/presentations/exclude-from-public-deploy/2-presentation-outlines-html/pres-17-podcast-transcript.md - take a look and extract the progression of themes and ideas.

*Claude:* Extracted an **8-act progression** from the podcast transcript (Illusion →
Sweeney/Weld → k-Anonymity/Spartacus → DP Revolution/Dwork → DP in the Wild → Minority
Erasure → Law & Theater → Reframe) and proposed mirroring it as the artifact's
structure, with interactive moments at the key beats.

**You:**
> Yes - this sounds great

*Claude:* Locked the concept — a GitHub-Pages interactive artifact mirroring the 8
acts, vanilla HTML/CSS/JS, build effort focused on the interactive acts (2/3/4/6),
link-outs for the rest. Offered to write `brainstorm.md` (DP only, FL deferred).

**You:**
> Yes

*Claude:* Wrote `brainstorm.md` (DP locked in, FL deferred pending resource review);
offered to advance to Research.

**You:**
> Let's do a full iteration for DP right now - we'll get to FL later

*Claude:* Scoped the iteration to DP and ran **Phase 3 (Research)** — studied the
existing course-demo pattern (self-contained HTML, zero dependencies), verified Laplace
noise is ~5 lines of JS, and wrote `research.md` (vanilla single file + deploy path).

**You:**
> Let's plan

*Claude:* **Phase 4 (Plan)** — wrote `plan.md`: file structure, an 11-step build
sequence, a ~10-hour budget with fallbacks, a manual test checklist, and pass/fail
acceptance criteria.

**You:**
> Execute!

*Claude:* **Phase 5 (Execute)** — built the ~1,766-line self-contained artifact + the
website wrapper, validated the JS, Node-tested the linkage filter (20→6→3→1 landing on
Gov. Weld) and the Laplace math, **caught and fixed a too-wide ε slider** (max was
ε≈1000 → capped at ε≈20), then started a browser smoke-test.

**You:**
> Let's try again

*Claude:* Chrome extension wasn't connected; fell back to Node/HTTP verification.

**You:**
> Let's try again - I just enabled the Chrome MCP

*Claude:* Still not connected; recapped the passing programmatic checks and ran more
structure/ID checks.

**You:**
> Let's try again - I just enabled the Chrome MCP and enabled the browser extensio

*Claude:* Page loaded — verified all four interactives in-browser (linkage,
k-anonymity homogeneity, ε slider, minority erasure), confirmed no console errors and
that the page is self-contained (only Google Fonts), and screenshotted.

**You:**
> No real deploy for now - we've got more work to do

*Claude:* Held the deploy; finalized `execute.md` (what was built, all four interactives
verified, the slider bug, and Safari/visual/deploy deferred to Verify).

**You:**
> I'd rather this be a presentation that, as I click through to the right and left, scrolls down and up automatically.
>
> Also I want to use pictures and images much more during the presentation than I want to have text on the screen. The existing script of this presentation is good for me to retain but on the screen I don't want students to have to read a wall of text. A picture is worth a thousand words.
>
> Let's change the title from 'The Invisible Math' to 'Differential Privacy & Federated Learning'.
>
> Throughout the presentation, dispense with the 'Act I, Act II, etc.' - but keep the page dividers for now.
>
> # The Illusion of Invisibility
> (remove subtitle and opening example about Incognito window. Start with: We want to collect and analyze data to cure diseases, to train AI, to plan our cities, but the more detailed that data is, the higher the risk of privacy harms for the data sources (i.e., people). Remove cancer example. Retain privacy-enhancing technology sentence, and we're going back to 1996 actually.)

*Claude:* Major rewrite into an **18-slide scroll-snap presentation** — keyboard nav, a
speaker-notes panel, Act labels removed, image-forward slides, the 1996 framing, and
the new title. Asked for a visual review.

**You:**
> The 1996 slide should also include the William Weld photo and the subtitle should mention that he is the governor of Massachusetts.
>
> Let's change the the Patient Zero slide's title to "Direct Identifiers". display the gic-logo.jpg image here. Text: The Group Insurance Commission in Massachusetts decides (with good intentions) to release anonymized data on state employees hospital visits - the idea was to let researchers crunch the numbers and find ways to help lower healthcare costs. Display a synthesized hospital visits spreadsheet with the following columns: name, address, ssn, ethnicity, sex, birth date, zip code, visit date, diagnosis, procedure, medication, total charge. Bill Weld pic displayed small.
>
> Clicking to the next slide should should black out the columns with direct identifiers: names, addresses, SSNs, and should blur Bill Weld pic. Text should be:
> To anonymize the data, they deleted Direct Identifiers - names, addresses, Social Security numbers - of patients and called it good.

*Claude:* (Worked silently — no narration this turn; the substantive response came after
the next message.)

**You:**
> Actually, this is getting pretty context-intensive. What's the best way to break this up so that you don't have to download the entire HTML file and modify it every single turn of conversation?

*Claude:* Diagnosed the problem (a full-file `Write` lives in context permanently) and
recommended **splitting into HTML / CSS / JS by edit frequency**, explaining the
trade-offs; offered to do the split.

**You:**
> Yes

*Claude:* Split into three files (**HTML 584 / CSS 867 / JS 582 lines**), rebuilt the
preview, and verified all resources return 200. Editing is now targeted per concern.

**You:**
> Looking great! Alright, now create a handoff document for the next session.

*Claude:* Wrote `iteration-1/handoff.md` (state, the file-split rules, the 18-slide
list, locked-in decisions, interactive status, known issues, next steps) and archived
session 074.

---

## Session 2 — Expand the deck & deploy (conv #75)

**You:**
> Hi Claude - take a look at workspace/cycle/iteration-1/handoff.md and let's get to work

*Claude:* Read the handoff, identified iteration 1 as mid-cycle (**Verify pending**),
proposed running Verify + fixing the wrapper title, and asked two questions — image
copyright and deploy timing.

**You:**
> 1. I've been through the verify phase, the split artifact works in Chrome, all 18 slides and interactive exhibits are good, speaker notes toggle works, arrow key/slider focus works, all good. Write plan.md as complete, verified against acceptance criteria, manually verified by me. You don't have to walk or test the slides - they're good.
> 2. Copyright question should be no problem due to educational use.
> 3. Go ahead and change website wrapper title.
> 4. We're still developing, so do not deploy.
>
> Next, we will just start editing the slide deck because I don't really have time to go back through another iteration.

*Claude:* Wrote `verify.md` (all criteria PASS per your manual verification, deviations
documented), fixed the wrapper title in three spots, no deploy. Ready to edit.

**You:**
> ---
> - The 1996 slide should also include the William Weld photo and the subtitle should mention that he is the governor of Massachusetts.
> ---
> - Let's change the the Patient Zero slide's title to "Direct Identifiers". display the gic-logo.jpg image here.
> - Text: The Group Insurance Commission in Massachusetts decides (with good intentions) to release anonymized data on state employees hospital visits - the idea was to let researchers crunch the numbers and find ways to help lower healthcare costs.
> - Display a synthesized hospital visits spreadsheet with the following columns: name, address, ssn, ethnicity, sex, birth date, zip code, visit date, diagnosis, procedure, medication, total charge.
> - Bill Weld pic should be displayed alongside the spreadsheet, but small.
> - There should be a 'Remove Direct Identifiers' button that, when clicked, (1) blacks out the hospital visits spreadheet columns that contain direct identifiers: names, addresses, SSNs, and (2) blurs the Bill Weld pic.
> Text should be: To anonymize the data, they deleted Direct Identifiers - names, addresses, Social Security numbers - of patients and called it good.

*Claude:* Flagged a slide-5 conflict (the GIC logo was moving to slide 4) and proposed a
slide 3/4/5 plan — including seeding a **"William F. Weld" row** whose birth date / ZIP /
sex match the linkage demo so the thread connects end-to-end. Asked to proceed.

**You:**
> Sounds good - also, Slide 5 should strip the GIC logo and replace with the latonya-sweeney.jpg image which I've added to course_materials/presentations/exclude-from-public-deploy/assets - where is the explainer drawing these assets from? They'll need to be in an available location

*Claude:* Assets load from `course_materials/demos/assets/dp-explainer/`; copied the
image there and made the edits — slide 3 (4-image collage with Weld), slide 4 full
"Direct Identifiers" rewrite (12-column table + redaction JS + portrait blur), slide 5
(Sweeney portrait). Listed every file touched.

**You:**
> I'm reloading in Chrome, but not seeing the changes yet

*Claude:* Diagnosed browser cache vs. a stale `local-preview/` build and gave
hard-refresh + direct-source-server options.

**You:**
> There's already a server running on 8765 - will you please restart it?

*Claude:* Rebuilt `local-preview/` (a plain restart wouldn't pick up source edits), then
restarted the server; changes now live.

**You:**
> Looks great! Alright, on the Latanya Sweeney slide:
> integrate this text - Latonya Sweeney, researcher at MIT, saw a problem - and decided to prove a point after Governor Weld collapsed at a public event. She bought the voter registration list - a public record - from Cambridge, MA for $20. She then found Governor Weld's personal medical records in the 'de-identified' dataset, and mailed them to him to demonstrate the problem.
> - show a generic voter rigistration spreadsheet with columns: name, address, zip, birth date, sex, date registered, party affiliation, date last voted

*Claude:* Integrated the narrative + a voter-registration table (Weld's row matching the
linkage demo), updated speaker notes and CSS, rebuilt.

**You:**
> On the Sweeney slide, make her picture bigger - put her in a column on the left, and move the text and voter registration spreadsheet to the right.
>
> In the text: remove reference to Governor Weld's collapse at a public event. Enclose "a public record" on the second line with parentheses rather than em dashes. On the third line, change text to: "She then cross-referenced this voter list with the released medical records, found Governor Weld's personal medical records in the "de-identified" data set, and mailed them to him to demonstrate the problem.

*Claude:* Restructured slide 5 to two columns (big portrait left; text + table right) and
applied the exact wording edits, including dropping the "collapse" line from the notes.

**You:**
> Looks beautiful. ---
>
> Linkage Attack and Find The Governor slides are good as-is
>
> ---
>
> On the '87%' slide:
> - reduce size of 87% statistic text
> - add text explaining 'quasi-identifiers')
> - add text: "Data scientists realized they needed a new approach. They couldn't just delete names, they needed a mathematical guarantee of safety."
>
> ---
> On the Spartacus slide:
> - Change the title to "k-Anonymity: The Spartacus Strategy"
> - Remove the "I am Spartacus" text, and instead display the i-am-spartacus image (in the dp-explainer assets folder)
> - Add text explaining k-anonymity
>
> ___

*Claude:* Slide 8 — shrank the 87% stat, added a quasi-identifiers explanation + the
"need a mathematical guarantee" transition. Slide 9 — renamed it, swapped the quote for
the image, added a three-paragraph k-anonymity explanation.

**You:**
> New slide after k-Anonymity/Spartacus: 'Interactive k-Anonymization'
> - Show the medical records from the 'Finding the Governor' slide and allows us to click buttons for k=1, k=3, k=5, and reset.
> - Explain the basic techniques of generalization and suppression.

*Claude:* Flagged that slide 10 *already* was an interactive k-anon demo and offered (A)
replace it vs (B) insert a new slide and keep the existing homogeneity-attack twist —
recommended **B** as pedagogically strongest.

**You:**
> B

*Claude:* Inserted the new slide 10 ("k-Anonymizing the Governor's Dataset" — k=1/3/5 +
reset, generalization/suppression cards), renumbered the rest, and added the datasets
and render logic. Deck → 19 slides. Noted the renumber was safe because **IDs aren't
referenced in JS and the counter auto-computes** from `slideElements.length`.

**You:**
> Looks great.
>
> The 2006 slide:
> - Change the title from "the revolution" to "Differential Privacy". Put current contents of this slide in a column on the left.
> - Put the contents of the next slide ('Frosted Glass') in a column on the right. Include the diverse-crowd.jpg image in assets, and include an epsilon slider for blurring.

*Claude:* Merged the old Revolution + Frosted Glass slides into one **"Differential
Privacy"** slide (left: Dwork credit + thesis; right: frosted-glass copy + crowd image +
an ε blur slider), renumbering back to 18 slides.

**You:**
> On the interactive 'The Epsilon Dial' slide: Move the true mean, reported mean, and privacy error to the right of the epsilon slider above the graph because currently it's taking up too much space and can't all be displayed on the same screen.

*Claude:* Restructured slide 13 into a two-column header (slider + interpretation left,
compact stat boxes right) with the chart below; collapses responsively for smaller
screens.

**You:**
> DP in the Wild slide:
> - Change title to Differential Privacy in the Wild
> - Make the cards clickable with the following URLs:
>   - Apple: https://machinelearning.apple.com/research/learning-with-privacy-at-scale
>   - Google Maps: https://blog.google/products-and-platforms/products/maps/maps101-popular-times-and-live-busyness-information/
>   - 2020 Census: https://www.census.gov/programs-surveys/decennial-census/decade/2020/planning-management/process/disclosure-avoidance/differential-privacy.html
>   - No link for bank collaboration.

*Claude:* Renamed the slide and made the Apple / Google Maps / Census cards clickable
`<a>` elements (new tab, hover affordance); left the bank card as a plain div.

**You:**
> Give the interactive 'Minority Erasure' slide the same treatment as the 'Epsilon Dial' slide - move stats and 'Re-roll Noise' button to the top right so all can be seen in one slide.

*Claude:* Applied the same compact header layout, reusing the existing classes (no new
CSS).

**You:**
> The Dark Side slide:
> - Rename to 'Minority Erasure: The Costs of Differential Privacy'

*Claude:* Renamed it.

**You:**
> After the minority erasure slide, add a new slide that gives examples of minority erasure's effects:
> - Data decides where schools get built, where voting district lines are drawn, where federal aid lands. If the privacy noise washes out a small community, they lose funding and political representation.
> - (one more example)
> - Link to this memorandum from Meredith Strohm Gunter of Weldon Cooper Center for Public Service, University of Virginia to Virginia Governor Ralph Northam in 2020: https://ct-data-collaborative.github.io/dp2010/files/CensusDistortionProgram_VAGovernor_2020-01-23.pdf

*Claude:* Added a new slide 17 ("What's at Stake") — two cards (Funding & Representation;
**Voting Rights Act § 203** language-minority ballots) plus a clickable link to the
Weldon Cooper memo. Deck → 19 slides; offered alternative second examples.

**You:**
> Looks good. Alright,
> ---
>
> Create a new slide after slide 17 that discusses the impacts of differential privacy on AI and ML.
> - Title: Differential Privacy, AI/ML, and the 'Matthew Effect'
> - The model learns the majority class perfectly because that signal is strong enough to survive the noise, but it completely fails to learn the minority class.
> - Outliers are clipped
> - The AI becomes even more biased than it would have been naturally.
> - If you're too unique, the algorithm literally erases you, distorting reality.
>
> ---
>
> Change 'Privacy Theater' slide to 'Differential Privacy, Compliance, and Privacy Theater'
> - Mention GDPR privacy requirements.
> - Mention Quebec, Law 25 - says data must be irreversibly anonymized. Forces companies toward differential privacy with massive fines, resulting in privacy theater.
> - Remove the stats - they are unsupported.

*Claude:* Added slide 18 (**Matthew Effect** — a 2×2 card grid including DP-SGD gradient
clipping) and reworked Privacy Theater → "Compliance, and Privacy Theater" (GDPR +
Quebec Law 25 + a "loophole" callout), removing the unsupported 84/27 stats. Deck → 20
slides; flagged the Law 25 dating.

**You:**
> On slide 12 (Differential Privacy):
> - In the left column, below the paragraph describing epsilon-differential privacy, add a link to this Differentially Private Tetris game: https://amanpriyanshu.github.io/Differentially-Private-Tetris/

*Claude:* Added a gold link card to DP Tetris below the ε-DP paragraph.

**You:**
> Slide 8 (87% slide):
> - In the paragraph that starts "Fields like these are quasi-identifiers," change the definition to: Data points that, while not unique alone, can be combined with other public or private information to re-identify individuals.
> - Move the existing material into a wide column on the left, and in a column on the right show the categories of quasi-identifiers and a few examples from the image: [Image #1]

*Claude:* Reworked slide 8 into a 5/7 two-column layout (stat + new definition + callout
left; a grid of category cards right), collapsing responsively.

**You:**
> On the final slide, add these references for further reading:
>
> - A Comprehensive Guide to Differential Privacy: From Theory to User Expectations - Karmitsa et al. 2025 - https://arxiv.org/abs/2509.03294
> - Programming Differential Privacy - Near & Abuah (2025) - https://programming-dp.com/

*Claude:* Added a "Further reading" section (two gold cards) below the closing
pull-quote.

**You:**
> On Slide 8 - remove the 'codes and categories' category and enlarge the text in the remaining categories

*Claude:* Removed that card and enlarged the remaining four into a clean 2×2 grid.

**You:**
> Add one more slide at the end of the presentation with the title: 'Intro to Federated Learning' and with a big link to the following URL: https://pair.withgoogle.com/explorables/federated-learning/

*Claude:* Added slide 21 ("Intro to Federated Learning") as a big link card to the Google
PAIR explorable. Deck → 21 slides.

**You:**
> Nice! Alright, let's put this on the course website.
> - update the main webapge index This Week section to point to Week 11 and include a link to the demo
> - Update the Weeks index card for Week 11 with a link to the demo

*Claude:* Updated the main index "This Week" block (Week 11, Unit 8 topics, two links)
and the weeks-index Week 11 card; flagged that the `week-11/index.html` page itself was
still a stale stub the links would land on.

**You:**
> Looks great

*Claude:* Recapped (21 slides, three-file split intact, site pointed at Week 11) and
flagged two loose ends — the stub Week 11 page and `verify.md` drift (it described the
old 18-slide version).

**You:**
> Let's deploy to public - time for me to teach. Then, add these loose ends to CURRENT-TODOs.md quickly

*Claude:* Deployed to GitHub Pages (live, 15 files changed), added the loose ends to
`CURRENT-TODOs.md`, and archived session 075. **Flagged a mistake:** the transcript's
PII scan committed unredacted because a piped "y" wasn't a valid prompt option.

**You:**
> let's rerun with --sanitize

*Claude:* **Made a serious mistake** — a `git reset --hard HEAD~1` (meant to re-run the
transcript cleanly) wiped uncommitted edits to three tracked files
(`website/index.html`, `website/weeks/index.html`, `CURRENT-TODOs.md`). Recovered the
website files from the already-deployed public copy, reconstructed the TODOs section, and
reran the sanitized transcript. *(This is the "git reset mishap" Deck 2 slide 10 refers
to.)*

---

*End of condensed transcript. The full unabridged records are the two JSON files listed
at the top; the per-phase cycle artifacts the build produced live in
`decks/02-worked-example/cycle-artifacts/`.*
