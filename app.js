const STORAGE_KEY = "devnotes_state_v2";
const HISTORY_LIMIT = 10;

const markdownInput = document.getElementById("markdownInput");
const preview = document.getElementById("preview");
const copyStatus = document.getElementById("copyStatus");
const statsBadge = document.getElementById("statsBadge");
const renderBadge = document.getElementById("renderBadge");
const noteSelect = document.getElementById("noteSelect");
const historySelect = document.getElementById("historySelect");
const themeToggleBtn = document.getElementById("themeToggleBtn");

const templates = {
  code: "\n```js\nfunction greet(name) {\n  return `Hello, \\${name}!`;\n}\n```\n",
  link: "[Link text](https://example.com)",
  table: "\n| Name | Role |\n| ---- | ---- |\n| Sinem | Developer |\n",
  tasks: "\n- [ ] First task\n- [x] Completed task\n",
  footnote: "\nHere is a statement with a footnote.[^1]\n\n[^1]: Footnote text.\n",
};

const starterMarkdown = `# Welcome to DevNotes

Write Markdown on the left. See live HTML preview on the right.

## Example

- Real-time parsing
- Local autosave
- One-click HTML copy
`;

let state = loadState();
let showRawHtml = false;
let latestRenderedHtml = "";
let findCursor = 0;
let saveTimeoutId;
let renderTimeoutId;
const hljsTheme = document.getElementById("hljsTheme");

marked.setOptions({
  gfm: true,
  breaks: true,
  highlight(code, language) {
    if (language && hljs.getLanguage(language)) {
      return hljs.highlight(code, { language }).value;
    }
    return hljs.highlightAuto(code).value;
  },
});

function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.notes && Object.keys(parsed.notes).length > 0 && parsed.activeNoteId) {
        if (!parsed.notes[parsed.activeNoteId]) {
          parsed.activeNoteId = Object.keys(parsed.notes)[0];
        }
        if (parsed.theme === "navy") parsed.theme = "dark";
        if (parsed.theme === "pink") parsed.theme = "bright";
        parsed.theme = parsed.theme === "dark" ? "dark" : "bright";
        return parsed;
      }
    }
  } catch (error) {
    console.warn("State load failed.", error);
  }
  return {
    activeNoteId: "note-1",
    theme: "bright",
    notes: {
      "note-1": { name: "My Note", content: starterMarkdown, history: [] },
    },
  };
}

function saveState() {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn("State save failed.", error);
  }
}

function getActiveNote() {
  return state.notes[state.activeNoteId];
}

function setCopyStatus(message, kind = "") {
  copyStatus.textContent = message;
  copyStatus.dataset.state = kind;
  setTimeout(() => {
    copyStatus.textContent = "";
    copyStatus.dataset.state = "";
  }, 2000);
}

function updateStats(text) {
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const chars = text.length;
  const readMinutes = Math.max(1, Math.ceil(words / 200));
  statsBadge.textContent = `${words} words • ${chars} chars • ${readMinutes} min read`;
}

function sanitizeAndRender(htmlOutput) {
  const safe = DOMPurify.sanitize(htmlOutput);
  latestRenderedHtml = safe;
  if (showRawHtml) {
    preview.textContent = safe;
    return;
  }
  preview.innerHTML = safe;
  preview.querySelectorAll("pre code").forEach((block) => hljs.highlightElement(block));
}

function renderMarkdown(markdownText) {
  const doRender = () => {
    const startedAt = performance.now();
    const htmlOutput = marked.parse(markdownText ?? "");
    sanitizeAndRender(htmlOutput);
    const elapsed = performance.now() - startedAt;
    renderBadge.textContent = `Render ${Math.round(elapsed)}ms`;
    renderBadge.dataset.slow = elapsed > 100 ? "yes" : "no";
  };

  clearTimeout(renderTimeoutId);
  if ((markdownText || "").length > 5000) {
    renderTimeoutId = setTimeout(doRender, 120);
  } else {
    doRender();
  }
}

function refreshNoteSelect() {
  noteSelect.innerHTML = "";
  Object.entries(state.notes).forEach(([id, note]) => {
    const opt = document.createElement("option");
    opt.value = id;
    opt.textContent = note.name;
    if (id === state.activeNoteId) opt.selected = true;
    noteSelect.appendChild(opt);
  });
}

function refreshHistorySelect() {
  const note = getActiveNote();
  historySelect.innerHTML = "";
  const empty = document.createElement("option");
  empty.value = "";
  empty.textContent = "Select snapshot";
  historySelect.appendChild(empty);
  note.history.forEach((entry, idx) => {
    const opt = document.createElement("option");
    opt.value = String(idx);
    opt.textContent = `${new Date(entry.ts).toLocaleTimeString()} (${entry.content.length} chars)`;
    historySelect.appendChild(opt);
  });
}

function pushHistory(content) {
  const note = getActiveNote();
  const last = note.history[note.history.length - 1];
  if (last && last.content === content) return;
  note.history.push({ ts: Date.now(), content });
  if (note.history.length > HISTORY_LIMIT) note.history.shift();
}

function persistAndRefresh() {
  saveState();
  refreshNoteSelect();
  refreshHistorySelect();
}

function updateEditorFromState() {
  const note = getActiveNote();
  markdownInput.value = note.content;
  renderMarkdown(note.content);
  updateStats(note.content);
  refreshHistorySelect();
}

function onMarkdownInput(event) {
  const text = event.target.value;
  getActiveNote().content = text;
  updateStats(text);
  renderMarkdown(text);
  clearTimeout(saveTimeoutId);
  saveTimeoutId = setTimeout(() => {
    pushHistory(text);
    persistAndRefresh();
  }, 200);
}

async function copyText(text, successMsg) {
  try {
    await navigator.clipboard.writeText(text);
    setCopyStatus(successMsg, "success");
  } catch (error) {
    setCopyStatus("Copy failed", "error");
    console.warn("Clipboard failed.", error);
  }
}

function downloadFile(filename, content, mimeType) {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function insertAtCursor(prefix, suffix = "", fallback = "") {
  const start = markdownInput.selectionStart;
  const end = markdownInput.selectionEnd;
  const value = markdownInput.value;
  const selected = value.slice(start, end) || fallback;
  const next = `${value.slice(0, start)}${prefix}${selected}${suffix}${value.slice(end)}`;
  markdownInput.value = next;
  markdownInput.dispatchEvent(new Event("input"));
  markdownInput.focus();
}

function onToolbarClick(event) {
  const btn = event.target.closest(".toolbar-btn");
  if (!btn) return;
  if (btn.dataset.wrap) {
    insertAtCursor(btn.dataset.wrap, btn.dataset.wrap, "text");
  } else if (btn.dataset.insert) {
    insertAtCursor(btn.dataset.insert, "", "");
  } else if (btn.dataset.template) {
    insertAtCursor(templates[btn.dataset.template] || "", "", "");
  }
}

function findNext() {
  const q = document.getElementById("findInput").value;
  if (!q) return;
  const text = markdownInput.value.toLowerCase();
  const needle = q.toLowerCase();
  const from = Math.max(0, findCursor);
  let idx = text.indexOf(needle, from);
  if (idx === -1) idx = text.indexOf(needle, 0);
  if (idx === -1) {
    setCopyStatus("No matches", "error");
    return;
  }
  markdownInput.focus();
  markdownInput.setSelectionRange(idx, idx + q.length);
  findCursor = idx + q.length;
}

function resetFindCursor() {
  findCursor = 0;
}

function createNote() {
  const name = prompt("New note name:", `Note ${Object.keys(state.notes).length + 1}`);
  if (!name) return;
  const id = `note-${Date.now()}`;
  state.notes[id] = { name, content: "", history: [] };
  state.activeNoteId = id;
  persistAndRefresh();
  updateEditorFromState();
}

function renameNote() {
  const note = getActiveNote();
  const name = prompt("Rename note:", note.name);
  if (!name) return;
  note.name = name;
  persistAndRefresh();
}

function deleteNote() {
  if (Object.keys(state.notes).length === 1) return setCopyStatus("Keep at least one note", "error");
  if (!confirm("Delete current note?")) return;
  delete state.notes[state.activeNoteId];
  state.activeNoteId = Object.keys(state.notes)[0];
  persistAndRefresh();
  updateEditorFromState();
}

function exportMd() {
  const note = getActiveNote();
  const safeName = note.name.replace(/\s+/g, "-").toLowerCase();
  downloadFile(`${safeName || "note"}.md`, note.content, "text/markdown");
}

function importMd(file) {
  const reader = new FileReader();
  reader.onload = () => {
    const content = String(reader.result || "");
    getActiveNote().content = content;
    pushHistory(content);
    persistAndRefresh();
    updateEditorFromState();
  };
  reader.readAsText(file);
}

function restoreHistory() {
  if (historySelect.value === "") return;
  const idx = Number(historySelect.value);
  if (!Number.isInteger(idx)) return;
  const note = getActiveNote();
  const snapshot = note.history[idx];
  if (!snapshot) return;
  note.content = snapshot.content;
  persistAndRefresh();
  updateEditorFromState();
}

function toggleTheme() {
  state.theme = state.theme === "bright" ? "dark" : "bright";
  document.body.dataset.theme = state.theme;
  themeToggleBtn.textContent = state.theme === "bright" ? "Dark Mode" : "Bright Mode";
  hljsTheme.href =
    state.theme === "dark"
      ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css"
      : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css";
  renderMarkdown(markdownInput.value);
  saveState();
}

function toggleRawPreview() {
  showRawHtml = !showRawHtml;
  document.getElementById("toggleRawBtn").textContent = showRawHtml ? "Rendered" : "Raw HTML";
  renderMarkdown(markdownInput.value);
}

function toggleFullscreen() {
  document.body.classList.toggle("preview-fullscreen");
}

function onKeydown(event) {
  const mod = event.metaKey || event.ctrlKey;
  if (!mod) return;
  if (event.key.toLowerCase() === "s") {
    event.preventDefault();
    exportMd();
  } else if (event.key.toLowerCase() === "f") {
    event.preventDefault();
    document.getElementById("findInput").focus();
  } else if (event.shiftKey && event.key.toLowerCase() === "c") {
    event.preventDefault();
    copyText(latestRenderedHtml, "HTML copied");
  }
}

function init() {
  document.body.dataset.theme = state.theme || "bright";
  themeToggleBtn.textContent = document.body.dataset.theme === "bright" ? "Dark Mode" : "Bright Mode";
  hljsTheme.href =
    document.body.dataset.theme === "dark"
      ? "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/atom-one-dark.min.css"
      : "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.11.1/styles/github.min.css";

  refreshNoteSelect();
  updateEditorFromState();

  markdownInput.addEventListener("input", onMarkdownInput);
  markdownInput.addEventListener("keydown", (event) => {
    if (event.key === "Tab") {
      event.preventDefault();
      insertAtCursor("  ");
    }
  });
  document.getElementById("copyHtmlBtn").addEventListener("click", () => copyText(latestRenderedHtml, "HTML copied"));
  document.getElementById("copyMarkdownBtn").addEventListener("click", () => copyText(markdownInput.value, "Markdown copied"));
  document.getElementById("copyPreviewTextBtn").addEventListener("click", () => copyText(preview.innerText, "Preview text copied"));
  document.getElementById("downloadHtmlBtn").addEventListener("click", () => downloadFile("devnotes-preview.html", latestRenderedHtml, "text/html"));
  document.getElementById("exportMdBtn").addEventListener("click", exportMd);
  document.getElementById("importMdInput").addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    if (file) importMd(file);
    event.target.value = "";
  });
  document.getElementById("newNoteBtn").addEventListener("click", createNote);
  document.getElementById("renameNoteBtn").addEventListener("click", renameNote);
  document.getElementById("deleteNoteBtn").addEventListener("click", deleteNote);
  noteSelect.addEventListener("change", (event) => {
    state.activeNoteId = event.target.value;
    saveState();
    updateEditorFromState();
  });
  document.getElementById("restoreHistoryBtn").addEventListener("click", restoreHistory);
  document.getElementById("findNextBtn").addEventListener("click", findNext);
  document.getElementById("findInput").addEventListener("input", resetFindCursor);
  document.addEventListener("click", onToolbarClick);
  document.getElementById("toggleRawBtn").addEventListener("click", toggleRawPreview);
  document.getElementById("previewFullscreenBtn").addEventListener("click", toggleFullscreen);
  themeToggleBtn.addEventListener("click", toggleTheme);
  window.addEventListener("keydown", onKeydown);
}

init();
