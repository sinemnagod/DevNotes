# DevNotes Task List

## 1) Project Setup (P0)

- [x] Initialize project structure (`index.html`, `styles.css`, `app.js`).
- [x] Add required libraries: `marked.js`, `highlight.js`, Tailwind CSS, `@tailwindcss/typography`.
- [x] Configure base dark-mode UI theme and typography defaults.

**Acceptance Criteria**
- App runs locally in browser without build errors.
- All required libraries are loaded and usable.
- Default theme is clean, dark, and readable.

---

## 2) Core Editor Experience (P0)

- [x] Build dual-pane layout:
  - Left pane: Markdown input textarea/editor.
  - Right pane: live rendered HTML preview.
- [x] Implement real-time Markdown parsing with `marked.js`.
- [x] Ensure updates happen while typing (no save/convert button).

**Acceptance Criteria**
- Typing Markdown updates preview instantly.
- Split layout is visually clear and stable.
- No manual action is required to render HTML.

---

## 3) Performance & Architecture (P0)

- [x] Keep parsing/render latency under 100ms for normal note sizes.
- [x] Keep logic fully client-side (no backend dependency).

**Acceptance Criteria**
- Typing feels responsive without noticeable lag.
- App works fully offline after assets are available.

---

## 4) Clipboard Workflow (P1)

- [x] Add "Copy HTML" button to copy generated HTML source.
- [x] Add success/failure user feedback (toast/message/state change).
- [ ] (Optional) Add "Copy Preview Text" for rendered output portability.

**Acceptance Criteria**
- Clicking button copies current generated HTML correctly.
- User gets clear visual confirmation of copy result.

---

## 5) Local Persistence (P1)

- [x] Save Markdown input to `localStorage` on change (debounced if needed).
- [x] Restore saved content on page load.
- [x] Handle empty/corrupt local data safely.

**Acceptance Criteria**
- Refresh/reopen restores previous session content.
- No crash if storage is unavailable or malformed.

---

## 6) Code Block Highlighting (P2)

- [x] Integrate `highlight.js` with Markdown code blocks.
- [x] Apply consistent dark-compatible code theme.

**Acceptance Criteria**
- Fenced code blocks are syntax-highlighted in preview.
- Highlighting remains readable in dark mode.

---

## 7) Responsive Layout (P2)

- [x] Implement responsive behavior for tablet and desktop.
- [x] Define breakpoints and pane behavior (side-by-side vs stacked if needed).
- [x] Ensure controls remain accessible and usable at all target sizes.

**Acceptance Criteria**
- App is usable on tablet and desktop without broken layout.
- Input, preview, and copy action are always reachable.

---

## 8) UX Polish & Demo Readiness (P2)

- [x] Refine spacing, contrast, and readability for distraction-free usage.
- [x] Add placeholder/sample Markdown for first-time experience.
- [x] Add minimal error handling around parsing and clipboard APIs.

**Acceptance Criteria**
- Interface looks polished and consistent.
- First-time user can understand and use app in under 5 seconds.

---

## 9) Validation Checklist (Release Gate)

- [x] User can paste Markdown and copy HTML in under 5 seconds.
- [x] Data persists through refresh/browser restart.
- [x] Rendering remains responsive and under performance target.
- [x] Final demo path works end-to-end without manual fixes.
