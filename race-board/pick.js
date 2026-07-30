/* Builds the theme picker from the same registry the board uses, so this page
   can never drift out of sync with what actually ships. Dev tool only. */
(() => {
  "use strict";

  const REG = (typeof RACE_THEMES !== "undefined" && RACE_THEMES) || {};

  // `cars` is built into race.js, not the registry — it's the fallback every
  // broken theme degrades to, so it must appear here even though themes.js has
  // no entry for it. Listed first because it's the default.
  const themes = [{ id: "cars", label: "Race Cars", note: "built-in · fallback" }]
    .concat(Object.keys(REG).map((id) => ({
      id: id,
      label: (REG[id] && REG[id].label) || id,
      note: "",
    })));

  const esc = (s) =>
    String(s == null ? "" : s).replace(/[&<>"]/g, (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

  document.getElementById("grid").innerHTML = themes.map((t) => `
    <a class="card" href="/?theme=${encodeURIComponent(t.id)}">
      <div class="frame">
        <iframe src="/?theme=${encodeURIComponent(t.id)}" scrolling="no" tabindex="-1"
                title="${esc(t.label)} preview"></iframe>
      </div>
      <div class="meta">
        <b>${esc(t.label)}</b>
        ${t.note ? `<em>${esc(t.note)}</em>` : ""}
        <span>?theme=${esc(t.id)}</span>
      </div>
    </a>`).join("");
})();
