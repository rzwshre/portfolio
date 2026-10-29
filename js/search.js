/* Custom in-page find (Ctrl/Cmd+F). Searches the open sheet, or the page. */
(function () {
  var box = document.createElement("div");
  box.className = "cy-find"; box.hidden = true;
  box.setAttribute("role", "search");
  box.innerHTML =
    '<span class="cf-tag">Scan</span>' +
    '<input type="text" spellcheck="false" autocomplete="off" placeholder="Search this page" aria-label="Search this page">' +
    '<span class="cf-count" aria-live="polite">0/0</span>' +
    '<button type="button" data-dir="-1" aria-label="Previous match"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M6 15l6-6 6 6"/></svg></button>' +
    '<button type="button" data-dir="1" aria-label="Next match"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M6 9l6 6 6-6"/></svg></button>' +
    '<button type="button" data-x aria-label="Close search"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"><path d="M6 6l12 12M18 6 6 18"/></svg></button>' +
    '<span class="cf-esc" aria-hidden="true">Esc</span>';
  document.body.appendChild(box);
  var input = box.querySelector("input"), count = box.querySelector(".cf-count");
  var sheet = document.getElementById("sheet");
  var hits = [], idx = -1, timer;

  function scope() { return sheet && !sheet.hidden ? sheet : document.querySelector(".cy-page") || document.body; }
  function clear() {
    hits.forEach(function (m) { var p = m.parentNode; if (!p) return; p.replaceChild(document.createTextNode(m.textContent), m); p.normalize(); });
    hits = []; idx = -1;
  }
  function visible(el) { return !!(el.offsetParent || el.getClientRects().length); }
  function run() {
    clear();
    var q = input.value.trim().toLowerCase();
    if (q.length < 2) { render(); return; }
    var root = scope(), nodes = [];
    var w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, { acceptNode: function (n) {
      var p = n.parentElement;
      if (!p || !n.nodeValue.trim() || p.closest("script, style, svg, .cy-find, [aria-hidden='true'], [hidden]")) return NodeFilter.FILTER_REJECT;
      if (root !== sheet && sheet && sheet.contains(p)) return NodeFilter.FILTER_REJECT;
      return n.nodeValue.toLowerCase().indexOf(q) > -1 && visible(p) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
    } });
    while (w.nextNode()) nodes.push(w.currentNode);
    nodes.forEach(function (n) {
      var text = n.nodeValue, low = text.toLowerCase(), at = 0, i, frag = document.createDocumentFragment();
      while ((i = low.indexOf(q, at)) > -1) {
        if (i > at) frag.appendChild(document.createTextNode(text.slice(at, i)));
        var m = document.createElement("mark"); m.className = "cy-hit"; m.textContent = text.slice(i, i + q.length);
        frag.appendChild(m); hits.push(m); at = i + q.length;
      }
      if (at < text.length) frag.appendChild(document.createTextNode(text.slice(at)));
      n.parentNode.replaceChild(frag, n);
    });
    idx = hits.length ? 0 : -1;
    render(true);
  }
  function render(jump) {
    count.textContent = (hits.length ? idx + 1 : 0) + "/" + hits.length;
    box.classList.toggle("is-miss", input.value.trim().length >= 2 && !hits.length);
    hits.forEach(function (m, i) { m.classList.toggle("is-on", i === idx); });
    if (jump && idx > -1) reveal(hits[idx]);
  }
  function reveal(m) {
    var sc = sheet && !sheet.hidden ? sheet : null, r = m.getBoundingClientRect();
    if (r.top > 110 && r.bottom < innerHeight - 40) return;
    var y = r.top - innerHeight * 0.38;
    if (sc) sc.scrollTo({ top: sc.scrollTop + y, behavior: "auto" });
    else window.scrollTo({ top: scrollY + y, behavior: "auto" });
    // horizontal rails
    var rail = m.closest(".rail, .journal-index");
    if (rail && rail.scrollWidth > rail.clientWidth) {
      var rr = rail.getBoundingClientRect(), mr = m.getBoundingClientRect();
      if (mr.left < rr.left || mr.right > rr.right) rail.scrollLeft += mr.left - rr.left - rr.width / 3;
    }
  }
  function step(d) {
    if (!hits.length) return;
    idx = (idx + d + hits.length) % hits.length;
    render(true);
    if (window.Sfx) window.Sfx.play("click");
  }
  function open() {
    box.hidden = false; box.classList.remove("is-closing"); void box.offsetWidth; box.classList.add("is-open");
    input.focus(); input.select();
    if (input.value.trim()) run();
  }
  function close() {
    if (box.hidden) return;
    clear(); render();
    box.classList.add("is-closing");
    setTimeout(function () { if (box.classList.contains("is-closing")) { box.hidden = true; box.classList.remove("is-open", "is-closing"); } }, 220);
  }
  window.addEventListener("keydown", function (e) {
    if ((e.ctrlKey || e.metaKey) && !e.altKey && (e.key === "f" || e.key === "F")) {
      e.preventDefault(); e.stopImmediatePropagation(); open(); return;
    }
    if (box.hidden || box.classList.contains("is-closing")) return;
    if (e.key === "Escape") { e.preventDefault(); e.stopImmediatePropagation(); close(); return; }
    if (e.target === input) {
      if (e.key === "Enter") { e.preventDefault(); step(e.shiftKey ? -1 : 1); }
      e.stopImmediatePropagation();
    }
  }, true);
  input.addEventListener("input", function () { clearTimeout(timer); timer = setTimeout(run, 120); });
  box.addEventListener("click", function (e) {
    var b = e.target.closest("button"); if (!b) return;
    if (b.hasAttribute("data-x")) close(); else step(+b.getAttribute("data-dir"));
    if (!b.hasAttribute("data-x")) input.focus();
  });
  // Sheet opened/closed underneath: results are stale
  if (sheet) new MutationObserver(function () { if (!box.hidden) { clear(); setTimeout(run, 60); } })
    .observe(sheet, { attributes: true, attributeFilter: ["hidden"] });
})();
