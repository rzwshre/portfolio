// Cyber layer: HUD, glitch, decrypt text, boot. Runs after app.js on index.html only.
(function () {
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
  var GLYPHS = "ABCDEFGHJKLMNPQRSTUVWXYZ0123456789#$%&/<>=+*";
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };

  // Boot (once per session)
  var booted = false;
  try { booted = sessionStorage.getItem("cy-booted") === "1"; sessionStorage.setItem("cy-booted", "1"); } catch (e) {}
  if (!booted && !reduce) {
    var boot = document.createElement("div");
    boot.className = "cy-boot";
    boot.innerHTML = '<div><span data-b>Jacking in · 00%</span><div class="bar"><i></i></div></div>';
    document.body.appendChild(boot);
    var p = 0, lbl = boot.querySelector("[data-b]"), bar = boot.querySelector("i");
    var t = setInterval(function () {
      p = Math.min(100, p + 7 + Math.random() * 16);
      lbl.textContent = (p < 100 ? "Jacking in · " : "Link established · ") + String(Math.floor(p)).padStart(2, "0") + "%";
      bar.style.width = p + "%";
      if (p >= 100) { clearInterval(t); setTimeout(function () { boot.classList.add("done"); setTimeout(function () { boot.remove(); }, 400); }, 220); }
    }, 70);
  }

  // Scanlines
  var scan = document.createElement("div");
  scan.className = "cy-scan"; scan.setAttribute("aria-hidden", "true");
  document.body.appendChild(scan);

  // Glitch headline
  var h1 = document.querySelector("#top h1");
  if (h1) {
    $$("span", h1).forEach(function (s) { s.classList.add("cy-glitch"); s.setAttribute("data-text", s.textContent); });
    if (!reduce) (function loop() {
      setTimeout(function () { if (typeof live === "function" && !live()) return loop(); h1.classList.add("is-glitching"); setTimeout(function () { h1.classList.remove("is-glitching"); loop(); }, 340); }, 3500 + Math.random() * 4500);
    })();
  }

  // Hero HUD
  var hero = document.getElementById("top");
  if (hero) {
    var C4 = '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';
    var hud = document.createElement("div");
    hud.className = "cy-hud blueprint"; hud.setAttribute("aria-hidden", "true");
    hud.innerHTML = C4 +
      '<div class="hd"><span>Netrunner · Rez</span><span class="live">Live</span></div>' +
      '<div class="row"><span>Loc</span><b>12.97N · 77.59E</b></div>' +
      '<div class="row"><span>Local</span><b data-clock>--:--:--</b></div>' +
      '<div class="row"><span>Session</span><b data-up>00:00:00</b></div>' +
      '<div class="row"><span>Uplink</span><b style="display:inline-flex;gap:8px;align-items:center"><span class="cy-bars"><i></i><i></i><i></i><i></i></span>Stable</b></div>' +
      '<div class="row"><span>Status</span><b>Open to work</b></div>' +
      '<div class="cy-log" data-log></div>';
    hero.appendChild(hud);
    var t0 = Date.now(), clk = hud.querySelector("[data-clock]"), up = hud.querySelector("[data-up]");
    var pad = function (n) { return String(n).padStart(2, "0"); };
    var tick = function () {
      clk.textContent = new Date().toLocaleTimeString("en-GB", { timeZone: "Asia/Kolkata", hour12: false }) + " IST";
      var s = Math.floor((Date.now() - t0) / 1000);
      up.textContent = pad(Math.floor(s / 3600)) + ":" + pad(Math.floor(s / 60) % 60) + ":" + pad(s % 60);
    };
    var heroOn = true;
    new IntersectionObserver(function (es) { heroOn = es[0].isIntersecting; }).observe(hero);
    var live = function () { return heroOn && !document.hidden; };
    tick(); setInterval(function () { if (live()) tick(); }, 1000);
    var LINES = ["> handshake ok", "> mount /work · 6 sheets", "> temporal.workers: green", "> p99 holding", "> ice: none detected", "> scan /record", "> heap nominal", "> awaiting input"];
    var log = hud.querySelector("[data-log]"), li = 0;
    var push = function () {
      var el = document.createElement("span"); el.textContent = LINES[li++ % LINES.length]; log.appendChild(el);
      while (log.children.length > 4) log.removeChild(log.firstChild);
    };
    push(); push();
    if (!reduce) setInterval(function () { if (live()) push(); }, 2600);
  }

  // Section tabs + decrypt titles
  $$("main > section").forEach(function (sec, i) {
    var lbl = sec.querySelector(":scope > span"), hr = sec.querySelector(":scope > hr");
    if (!lbl) return;
    var row = document.createElement("div"); row.className = "cy-tabline";
    sec.insertBefore(row, lbl);
    lbl.classList.add("cy-tab"); row.appendChild(lbl);
    row.appendChild(document.createElement("span"));
    var id = document.createElement("span"); id.className = "cy-id";
    id.textContent = "0x" + (0x3af4 + i * 0x1b7).toString(16).toUpperCase();
    row.appendChild(id);
    if (hr) hr.remove();
  });
  function decrypt(el) {
    if (reduce || el.dataset.cyDone) return; el.dataset.cyDone = "1";
    var final = el.dataset.cyText || (el.dataset.cyText = el.textContent), n = 0, steps = 14;
    clearInterval(el._cyT);
    var t = el._cyT = setInterval(function () {
      n++;
      el.textContent = final.split("").map(function (c, k) {
        if (c === " " || k < (n / steps) * final.length) return c;
        return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }).join("");
      if (n >= steps) { clearInterval(t); el.textContent = final; }
    }, 38);
  }
  var io = new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { decrypt(e.target); io.unobserve(e.target); } });
  }, { threshold: 0.6 });
  $$("main h2").forEach(function (h) { io.observe(h); });

  // Cards
  $$("#projects-grid [data-open]").forEach(function (b) { b.classList.add("cy-card"); });
  $$("#timeline-rail [data-open]").forEach(function (b) { b.classList.add("cy-card", "timeline-card"); });
  $$("#skills-grid li > span[aria-hidden]").forEach(function (m) {
    m.classList.add("cy-meter");
    $$("span", m).forEach(function (s) { if (/var\(--color-accent\)/.test(s.style.background)) s.classList.add("on"); });
  });
  var card = document.querySelector("#contact [style*='aspect-ratio']");
  if (card) card.classList.add("cy-holo");

  // MaxTac-style landing-zone markings
  function lzSvg(code) {
    var ticks = "";
    for (var k = 0; k < 36; k++) { var a = k * 10 * Math.PI / 180, r1 = k % 3 ? 186 : 176, r2 = 192;
      ticks += '<line x1="' + (200 + r1 * Math.cos(a)).toFixed(1) + '" y1="' + (200 + r1 * Math.sin(a)).toFixed(1) + '" x2="' + (200 + r2 * Math.cos(a)).toFixed(1) + '" y2="' + (200 + r2 * Math.sin(a)).toFixed(1) + '"/>'; }
    var chev = "";
    [0, 90, 180, 270].forEach(function (d) { chev += '<g transform="rotate(' + d + ' 200 200)"><path d="M188 52 200 40 212 52M188 66 200 54 212 66" fill="none"/></g>'; });
    return '<svg viewBox="0 0 400 400" aria-hidden="true" stroke="currentColor" fill="none" stroke-width="1.5">' +
      '<g>' + ticks + '</g>' +
      '<circle cx="200" cy="200" r="160" stroke-width="14" stroke-dasharray="30 12" class="lz-ring"/>' +
      '<circle cx="200" cy="200" r="138"/><circle cx="200" cy="200" r="96" stroke-dasharray="4 6"/>' +
      '<path d="M200 112v40M200 248v40M112 200h40M248 200h40"/>' + chev +
      '<path d="M170 168v64M230 168v64M170 200h60" stroke-width="8" stroke-linecap="square"/>' +
      '<text x="200" y="262" text-anchor="middle" fill="currentColor" stroke="none" font-size="12" letter-spacing="3" font-weight="600">' + code + '</text></svg>';
  }
  if (hero) {
    var lzH = document.createElement("div"); lzH.className = "cy-lz cy-lz-hero"; lzH.innerHTML = lzSvg("LZ-01 \u00b7 HOT");
    hero.appendChild(lzH);
  }
  var secs = $$("main > section");
  [[2, "LZ-07", "Zone clear \u00b7 proceed"], [4, "LZ-13", "Restricted airspace \u00b7 authorised traffic only"]].forEach(function (c) {
    var s = secs[c[0]]; if (!s) return;
    var band = document.createElement("div"); band.className = "cy-lzband"; band.setAttribute("aria-hidden", "true");
    band.innerHTML = '<span class="cy-hazard"></span><span class="lzb-mid"><span class="lzb-mark">' + lzSvg("") + '</span><b>' + c[1] + '</b><span>' + c[2] + '</span><i></i><span class="lzb-chev">\u25b8\u25b8\u25b8</span></span><span class="cy-hazard"></span>';
    s.parentNode.insertBefore(band, s);
  });

  // Flowing traces: continue down the page grid, and along section borders + separators
  if (!reduce) (function () {
    var page = document.querySelector(".cy-page"); if (!page) return;
    page.style.position = "relative";
    var layer = document.createElement("div"); layer.className = "cy-flow"; layer.setAttribute("aria-hidden", "true");
    page.insertBefore(layer, page.firstChild);
    function rnd(a, b) { return a + Math.random() * (b - a); }
    function build() {
      var top = hero ? hero.offsetTop + hero.offsetHeight : 0, h = page.offsetHeight - top, w = page.clientWidth;
      layer.style.top = top + "px";
      layer.style.setProperty("--travel-y", h + "px");
      layer.style.setProperty("--travel-x", w + "px");
      layer.innerHTML = "";
      var cols = Math.floor(w / 96), rows = Math.floor(h / 96), used = {};
      for (var i = 0; i < Math.min(6, cols); i++) {
        var c; do { c = 1 + Math.floor(Math.random() * cols); } while (used["c" + c] && Object.keys(used).length < cols);
        used["c" + c] = 1;
        var v = document.createElement("i"); v.className = "fv";
        v.style.cssText = "left:" + (c * 96) + "px;height:" + Math.round(rnd(22, 40)) + "vh;animation-duration:" + rnd(16, 30).toFixed(1) + "s;animation-delay:-" + rnd(0, 30).toFixed(1) + "s";
        layer.appendChild(v);
      }
      for (var j = 0; j < Math.min(5, rows); j++) {
        var r = 1 + Math.floor(Math.random() * rows), y = r * 96 - (top % 96);
        var hz = document.createElement("i"); hz.className = "fh";
        hz.style.cssText = "top:" + y + "px;width:" + Math.round(rnd(20, 34)) + "vw;animation-duration:" + rnd(12, 22).toFixed(1) + "s;animation-delay:-" + rnd(0, 22).toFixed(1) + "s";
        layer.appendChild(hz);
      }
    }
    build();
    var rT; window.addEventListener("resize", function () { clearTimeout(rT); rT = setTimeout(build, 200); });
    window.addEventListener("load", build);

    $$("main > section.blueprint, #contact").forEach(function (s) {
      if (s.querySelector(":scope > .cy-edge")) return;
      var e = document.createElement("span"); e.className = "cy-edge"; e.setAttribute("aria-hidden", "true");
      e.innerHTML = '<i class="et" style="animation-delay:-' + rnd(0, 14).toFixed(1) + 's"></i><i class="eb" style="animation-delay:-' + rnd(0, 14).toFixed(1) + 's"></i><i class="el" style="animation-delay:-' + rnd(0, 18).toFixed(1) + 's"></i><i class="er" style="animation-delay:-' + rnd(0, 18).toFixed(1) + 's"></i>';
      s.appendChild(e);
    });
    $$(".cy-tabline .cy-tab + span").forEach(function (sp) { sp.classList.add("cy-sep"); sp.style.animationDelay = "-" + rnd(0, 6).toFixed(1) + "s"; });
    var ft = document.querySelector("footer[data-page]"); if (ft) ft.classList.add("cy-sep-top");
  })();
  var contact = document.getElementById("contact");
  if (contact) { var clip = document.createElement("div"); clip.className = "cy-lz-clip"; clip.setAttribute("aria-hidden", "true"); var lzC = document.createElement("div"); lzC.className = "cy-lz cy-lz-contact"; lzC.innerHTML = lzSvg(""); clip.appendChild(lzC); contact.style.position = contact.style.position || "relative"; contact.insertBefore(clip, contact.firstChild); }

  // Footer hazard band
  var foot = document.querySelector("footer");
  if (foot) { var hz = document.createElement("span"); hz.className = "cy-hazard"; hz.setAttribute("aria-hidden", "true"); foot.insertBefore(hz, foot.firstChild); }

  // Section jumps: exact offset under the (variable-height) header, masked by a glitch cut
  var header = document.querySelector("header");
  if (header) {
    var syncHdr = function () { header.classList.toggle("is-stuck", scrollY > 8); };
    window.addEventListener("scroll", syncHdr, { passive: true }); syncHdr();
  }
  function jumpTop(el) {
    if (el.id === "top") return 0;
    var off = (header ? header.getBoundingClientRect().height : 0) + 16;
    return Math.max(0, Math.round(el.getBoundingClientRect().top + scrollY - off));
  }
  var jumping = false;
  window.cyJump = function (id) {
    var el = document.getElementById(id); if (!el || jumping) return;
    var y = jumpTop(el);
    if (history.replaceState) history.replaceState(null, "", "#" + id);
    if (reduce || Math.abs(y - scrollY) < 4) { window.scrollTo({ top: y, behavior: "auto" }); if (window.navSpy) window.navSpy(); return; }
    jumping = true;
    if (window.Sfx) window.Sfx.play("click");
    var fx = document.createElement("div"); fx.className = "cy-jump"; fx.setAttribute("aria-hidden", "true");
    var s = "";
    for (var k = 0; k < 7; k++) s += '<span style="top:' + Math.floor(Math.random() * 96) + "%;height:" + (3 + Math.floor(Math.random() * 22)) + "px;animation-delay:" + (k * 0.018).toFixed(3) + 's"></span>';
    fx.innerHTML = s;
    document.body.appendChild(fx);
    var rootEl = document.documentElement;
    rootEl.classList.add("cy-jumping");
    setTimeout(function () {
      rootEl.style.scrollBehavior = "auto";
      window.scrollTo(0, jumpTop(el));
      rootEl.style.scrollBehavior = "";
      if (window.navSpy) window.navSpy();
      var h = el.querySelector("h2"); if (h) { delete h.dataset.cyDone; decrypt(h); }
      el.classList.remove("cy-landed"); void el.offsetWidth; el.classList.add("cy-landed");
    }, 110);
    setTimeout(function () { fx.remove(); rootEl.classList.remove("cy-jumping"); jumping = false; if (window.navSpy) window.navSpy(); }, 300);
    setTimeout(function () { el.classList.remove("cy-landed"); }, 900);
  };
  document.addEventListener("click", function (e) {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    var a = e.target.closest('a[href^="#"]'); if (!a || a.closest("#sheet")) return;
    var id = a.getAttribute("href").slice(1); if (!id || !document.getElementById(id)) return;
    e.preventDefault();
    window.cyJump(id);
  });
  if (location.hash && document.getElementById(location.hash.slice(1))) {
    setTimeout(function () { window.scrollTo(0, jumpTop(document.getElementById(location.hash.slice(1)))); if (window.navSpy) window.navSpy(); }, 60);
  }

  // In-page scrollbar: tracks the page, or the open sheet
  var rail = document.createElement("div"); rail.className = "cy-rail"; rail.setAttribute("aria-hidden", "true");
  var thumb = document.createElement("div"); thumb.className = "cy-rail-thumb"; rail.appendChild(thumb);
  document.body.appendChild(rail);
  var sheetEl = document.getElementById("sheet");
  function scroller() { return sheetEl && !sheetEl.hidden ? sheetEl : document.documentElement; }
  function metrics() {
    var el = scroller(), isDoc = el === document.documentElement;
    var view = isDoc ? innerHeight : el.clientHeight, total = el.scrollHeight, top = isDoc ? scrollY : el.scrollTop;
    var track = rail.clientHeight, th = Math.max(40, Math.round(track * view / total));
    return { el: el, isDoc: isDoc, view: view, total: total, top: top, track: track, th: th, max: total - view };
  }
  var railRaf = 0;
  function drawRail() {
    railRaf = 0;
    var m = metrics();
    rail.hidden = m.max <= 1;
    if (rail.hidden) return;
    thumb.style.height = m.th + "px";
    thumb.style.transform = "translateY(" + Math.round((m.track - m.th) * (m.top / m.max)) + "px)";
  }
  function queue() { if (!railRaf) railRaf = requestAnimationFrame(drawRail); }
  window.addEventListener("scroll", queue, { passive: true });
  window.addEventListener("resize", queue);
  if (sheetEl) {
    sheetEl.addEventListener("scroll", queue, { passive: true });
    new MutationObserver(queue).observe(sheetEl, { attributes: true, attributeFilter: ["hidden"], childList: true });
  }
  if (window.ResizeObserver) new ResizeObserver(queue).observe(document.body);
  function scrollToRatio(m, r) {
    var y = Math.max(0, Math.min(m.max, r * m.max));
    if (m.isDoc) { document.documentElement.style.scrollBehavior = "auto"; window.scrollTo(0, y); document.documentElement.style.scrollBehavior = ""; }
    else m.el.scrollTop = y;
  }
  rail.addEventListener("pointerdown", function (e) {
    if (e.button !== 0) return;
    e.preventDefault();
    var m = metrics(), rect = rail.getBoundingClientRect();
    var tTop = (m.track - m.th) * (m.top / m.max), y = e.clientY - rect.top;
    var grab = (y >= tTop && y <= tTop + m.th) ? y - tTop : m.th / 2;
    if (grab === m.th / 2) scrollToRatio(m, (y - grab) / (m.track - m.th));
    rail.classList.add("is-drag"); rail.setPointerCapture(e.pointerId);
    function move(ev) { var mm = metrics(); scrollToRatio(mm, (ev.clientY - rect.top - grab) / (mm.track - mm.th)); }
    function up() { rail.classList.remove("is-drag"); rail.removeEventListener("pointermove", move); rail.removeEventListener("pointerup", up); rail.removeEventListener("pointercancel", up); }
    rail.addEventListener("pointermove", move); rail.addEventListener("pointerup", up); rail.addEventListener("pointercancel", up);
  });
  drawRail();

  // Horizontal rails: vertical wheel scrolls them sideways while hovered; releases at either end
  function hScroller(t) {
    for (var el = t; el && el !== document.body; el = el.parentElement) {
      if (el.scrollWidth - el.clientWidth > 1) {
        var ox = getComputedStyle(el).overflowX;
        if (ox === "auto" || ox === "scroll") return el;
      }
    }
    return null;
  }
  var hAnim = new WeakMap();
  window.addEventListener("wheel", function (e) {
    if (e.ctrlKey || Math.abs(e.deltaX) > Math.abs(e.deltaY)) return;
    var el = hScroller(e.target);
    if (!el) return;
    var dy = e.deltaMode === 1 ? e.deltaY * 32 : e.deltaMode === 2 ? e.deltaY * el.clientWidth : e.deltaY;
    var max = el.scrollWidth - el.clientWidth, st = hAnim.get(el);
    var cur = st ? st.target : el.scrollLeft;
    if ((dy < 0 && cur <= 0) || (dy > 0 && cur >= max - 1)) return;
    e.preventDefault();
    var target = Math.max(0, Math.min(max, cur + dy));
    if (st) { st.target = target; return; }
    st = { target: target }; hAnim.set(el, st);
    (function step() {
      var d = st.target - el.scrollLeft;
      if (Math.abs(d) < 0.5) { el.scrollLeft = st.target; hAnim.delete(el); return; }
      el.scrollLeft += d * 0.22;
      requestAnimationFrame(step);
    })();
  }, { passive: false });

  // Custom cursor: ring + dot
  if (window.matchMedia && matchMedia("(pointer: fine)").matches) (function () {
    var HOT = "a, button, [data-open], [role=radio], .cy-rail, label, summary";
    var rootEl = document.documentElement, px = -100, py = -100, rx = -100, ry = -100;
    var main = document.createElement("div"); main.className = "cy-cur cy-cur-ring";
    main.innerHTML = '<span class="r cold"></span><span class="r hot"></span><span class="r"></span>';
    var dot = document.createElement("div"); dot.className = "cy-cur cy-cur-dot";
    main.setAttribute("aria-hidden", "true"); document.body.appendChild(main);
    dot.setAttribute("aria-hidden", "true"); document.body.appendChild(dot);
    rootEl.classList.add("cy-cur-on");
    var glitchT = 0;
    function glitch() {
      if (reduce) return;
      main.classList.remove("is-glitch"); void main.offsetWidth; main.classList.add("is-glitch");
      clearTimeout(glitchT); glitchT = setTimeout(function () { main.classList.remove("is-glitch"); }, 240);
    }
    function show(v) { main.classList.toggle("is-in", v); dot.classList.toggle("is-in", v); }
    document.addEventListener("pointermove", function (e) {
      if (e.pointerType !== "mouse") return;
      px = e.clientX; py = e.clientY; show(true);
    }, { passive: true });
    var cur = null;
    function setTarget(el) {
      if (el === cur) return;
      if (cur) cur.classList.remove("cy-target");
      cur = el;
      if (cur) { cur.classList.remove("cy-target"); void cur.offsetWidth; cur.classList.add("cy-target"); }
      main.classList.toggle("is-hover", !!cur);
    }
    document.addEventListener("pointerover", function (e) { setTarget(e.target.closest ? e.target.closest(HOT) : null); });
    document.addEventListener("pointerleave", function () { setTarget(null); });
    if (sheetEl) new MutationObserver(function () { if (cur && !document.contains(cur)) setTarget(null); }).observe(sheetEl, { childList: true, attributes: true, attributeFilter: ["hidden"] });
    document.addEventListener("pointerdown", function () { main.classList.add("is-down"); glitch(); });
    document.addEventListener("pointerup", function () { main.classList.remove("is-down"); });
    document.addEventListener("mouseleave", function () { show(false); setTarget(null); });
    window.addEventListener("blur", function () { show(false); });
    var curRaf = 0;
    function loop() {
      var k = reduce ? 1 : 0.22;
      rx += (px - rx) * k; ry += (py - ry) * k;
      if (Math.abs(px - rx) < 0.3 && Math.abs(py - ry) < 0.3) { rx = px; ry = py; }
      main.style.transform = "translate3d(" + rx + "px," + ry + "px,0)";
      dot.style.transform = "translate3d(" + px + "px," + py + "px,0)";
      curRaf = (rx !== px || ry !== py) ? requestAnimationFrame(loop) : 0;
    }
    document.addEventListener("pointermove", function () { if (!curRaf) curRaf = requestAnimationFrame(loop); }, { passive: true });
  })();

  // HUD refresh whenever theme or palette changes
  var rootEl = document.documentElement, last = rootEl.getAttribute("data-theme") + "|" + rootEl.getAttribute("data-palette"), rTimer;
  new MutationObserver(function () {
    var now = rootEl.getAttribute("data-theme") + "|" + rootEl.getAttribute("data-palette");
    if (now === last || reduce) { last = now; return; }
    last = now;
    if (window.Sfx) window.Sfx.play("sweep");
    var old = document.querySelector(".cy-refresh"); if (old) old.remove();
    var pal = window.Theme && window.Theme.palettes[rootEl.getAttribute("data-palette")];
    var fx = document.createElement("div"); fx.className = "cy-refresh"; fx.setAttribute("aria-hidden", "true");
    var slices = "";
    for (var k = 0; k < 5; k++) slices += '<span class="slice" style="top:' + Math.floor(Math.random() * 92) + "%;height:" + (4 + Math.floor(Math.random() * 30)) + "px;animation-delay:" + (k * 0.04) + 's"></span>';
    fx.innerHTML = '<span class="flash"></span>' + slices + '<span class="band"></span><span class="lbl">HUD reload · ' + (pal ? pal.label : "") + " / " + rootEl.getAttribute("data-theme") + "</span>";
    document.body.appendChild(fx);
    rootEl.classList.remove("cy-refreshing"); void rootEl.offsetWidth; rootEl.classList.add("cy-refreshing");
    if (h1) { h1.classList.add("is-glitching"); setTimeout(function () { h1.classList.remove("is-glitching"); }, 340); }
    $$("main h2").forEach(function (h) {
      var r = h.getBoundingClientRect();
      if (r.bottom > 0 && r.top < innerHeight) { delete h.dataset.cyDone; decrypt(h); }
    });
    clearTimeout(rTimer);
    rTimer = setTimeout(function () { fx.remove(); rootEl.classList.remove("cy-refreshing"); }, 950);
  }).observe(rootEl, { attributes: true, attributeFilter: ["data-theme", "data-palette"] });

  // Modal breach-in + status chip
  var sheet = document.getElementById("sheet");
  if (sheet) new MutationObserver(function () {
    if (sheet.hidden) { sheet.classList.remove("cy-open"); return; }
    if (sheet.classList.contains("cy-open") || sheet.classList.contains("cy-closing")) return;
    void sheet.offsetWidth; sheet.classList.add("cy-open");
    var kicker = sheet.querySelector("div > div > span");
    if (kicker && !kicker.querySelector(".cy-status")) {
      var st = document.createElement("span"); st.className = "cy-status"; st.textContent = "Decrypted";
      kicker.appendChild(st);
    }
    var t = sheet.querySelector("#sheet-title"); if (t) decrypt(t);
  }).observe(sheet, { attributes: true, attributeFilter: ["hidden"] });
  if (sheet) new MutationObserver(function () {
    if (sheet.hidden) return;
    var kicker = sheet.querySelector("div > div > span");
    if (kicker && !kicker.querySelector(".cy-status")) { var st = document.createElement("span"); st.className = "cy-status"; st.textContent = "Decrypted"; kicker.appendChild(st); }
    var t = sheet.querySelector("#sheet-title"); if (t && !t.dataset.cyDone) decrypt(t);
  }).observe(sheet, { childList: true });
})();
