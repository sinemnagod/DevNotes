# PRD: Markdown-to-HTML "DevNotes" Generator

**Status:** Draft / MVP Phase  
**Author:** Sinem Doğan  
**Target Audience:** Technical writers, students, and developers needing rapid HTML snippets.

---

## 1. Problem Statement

Developers and technical students often need to convert raw Markdown notes into styled HTML for blogs, documentation, or internal wikis. Existing online tools are either cluttered with ads, lack real-time preview, or don't offer a "one-click" copy-to-clipboard feature for the generated code, leading to friction in the documentation workflow.

## 2. Goals & Objectives

- **Speed:** Provide an instant, zero-latency conversion from Markdown to HTML.
- **Portability:** Enable users to copy the raw HTML code or the rendered preview instantly.
- **Persistence:** Ensure user data is saved locally so progress isn't lost on accidental refreshes or browser crashes.

## 3. Target User (Persona)

The **"Appreneur" Student** or **Junior Developer** who needs to turn class notes, README drafts, or project reports into professional-looking snippets for their portfolio.

---

## 4. Functional Requirements (MVP)

| Feature                 | Description                                                                  | Priority |
| :---------------------- | :--------------------------------------------------------------------------- | :------- |
| **Dual-Pane Editor**    | A split-screen UI with raw text input (Left) and a rendered preview (Right). | **P0**   |
| **Real-time Parsing**   | Input parsed to HTML instantly via `marked.js` with no save button required. | **P0**   |
| **Copy to Clipboard**   | A button to copy the generated HTML source code to the user's clipboard.     | **P1**   |
| **Local Persistence**   | Use `localStorage` to save the current text buffer across browser sessions.  | **P1**   |
| **Syntax Highlighting** | Code blocks within the preview are highlighted using `highlight.js`.         | **P2**   |
| **Responsive Design**   | The app must be usable on tablets and desktops via flexible grid layout.     | **P2**   |

---

## 5. Non-Functional Requirements

- **Performance:** Parsing latency must remain under **100ms** to prevent typing lag.
- **UX/UI:** Clean, distraction-free "Dark Mode" interface to reduce eye strain during long sessions.
- **Architecture:** 100% Client-side logic for maximum speed and zero hosting overhead.

---

## 6. Technical Stack

- **Frontend:** Vanilla JavaScript (ES6+) or React.js.
- **Styling:** Tailwind CSS + `@tailwindcss/typography` (for standardized `prose` styling).
- **Parsing Engine:** `marked.js`.
- **Code Highlighting:** `highlight.js`.

---

## 7. Success Metrics

- **Time to Value:** User can paste a Markdown snippet and copy HTML in under **5 seconds**.
- **Reliability:** 100% data retention via `localStorage` during the grading demonstration.
