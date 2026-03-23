# DevNotes

DevNotes is a lightweight, client-side Markdown-to-HTML workspace with live preview, multiple copy/export options, note sessions, and bright/dark themes.

## Features

- Dual-pane editor (Markdown input + rendered preview)
- Real-time parsing with `marked.js`
- Copy generated HTML, Markdown, and preview text
- Download generated HTML, standalone HTML, and print/save PDF
- Import/export `.md` files
- Multi-note session management (create/rename/delete)
- Local persistence with snapshot history restore
- Syntax highlighting for code blocks via `highlight.js`
- Search in editor and formatting toolbar actions
- Raw HTML preview toggle + preview fullscreen mode
- Mobile editor/preview tab switcher
- Scroll sync between editor and preview
- Built-in help dialog for shortcuts
- Keyboard shortcuts for copy/export/find/tab indent
- Responsive UI with bright (pink) and dark (navy) mode toggle

## Tech Stack

- HTML, CSS, Vanilla JavaScript (ES6+)
- Tailwind CSS + Typography plugin (CDN)
- `marked.js`
- `highlight.js`
- `DOMPurify`

## Run Locally

1. Open the project folder.
2. Open `index.html` in your browser.
   - Optional: use VS Code/Cursor Live Server for auto-refresh while editing.

No backend, build tool, or package installation is required for the current MVP.

## Usage

1. Type or paste Markdown into the left panel.
2. View rendered output in the right panel instantly.
3. Use the toolbar for quick formatting/templates (table, task list, footnote, code).
4. Use top actions for copy/export/import and note management.
5. Toggle `Dark Mode` / `Bright Mode` to switch themes.
6. Use `Help` for shortcut reference and mobile `Editor/Preview` tabs on small screens.
7. Refresh and verify content/history restoration.

## Shortcuts

- `Cmd/Ctrl + Shift + C`: Copy generated HTML
- `Cmd/Ctrl + S`: Export current note as `.md`
- `Cmd/Ctrl + F`: Focus find input
- `Cmd/Ctrl + /`: Open help dialog
- `Tab` in editor: Insert indentation
- `Esc`: Close help dialog

## Manual Test Checklist (Demo)

- [ ] Enter headings, lists, links, and code fences; confirm live render.
- [ ] Click `Copy HTML`; paste into a text editor and verify HTML output.
- [ ] Refresh/reopen browser; confirm previous content is restored.
- [ ] Verify code blocks are syntax-highlighted in preview.
- [ ] Resize window to tablet/desktop widths; confirm layout remains usable.
- [ ] Type continuously for several seconds; ensure no visible lag.

## Notes

- App is fully client-side by design.
- External libraries are loaded via CDN in `index.html`.
