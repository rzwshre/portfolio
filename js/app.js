(function () {
  var D = window.PORTFOLIO;
  var SHOW_METERS = true;   // set false for a plain skill list
  var METER_STEPS = 4;      // 3–6
  var C4 = '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';
  var MUTED = function (p) { return "color: color-mix(in srgb, var(--color-text) " + p + "%, transparent);"; };
  var MICRO = "font-size: 10px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600;";
  var H = "font-family: var(--font-heading); font-weight: 600; text-transform: uppercase; letter-spacing: 0.02em;";
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var $ = function (id) { return document.getElementById(id); };
  var tag = function (t) { return '<span class="tag tag-outline">' + esc(t) + "</span>"; };

  // Nav
  $("nav").outerHTML = D.NAV.map(function (n) {
    return '<a class="nav-link" data-target="' + n.id + '" href="' + n.href + '" style="display: flex; align-items: baseline; gap: 6px; font-size: 11px; line-height: 14px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; text-decoration: none; padding-bottom: 4px; color: var(--color-text); border-bottom: 1px solid transparent;">' +
      '<span style="font-variant-numeric: tabular-nums; opacity: 0.55;">' + n.num + "</span><span>" + esc(n.label) + "</span></a>";
  }).join("");
  $("footer-nav").outerHTML = D.NAV.map(function (n) {
    return '<a href="' + n.href + '" style="font-size: 13px; line-height: 20px;">' + esc(n.label) + "</a>";
  }).join("");
  document.querySelectorAll("[data-now-updated]").forEach(function (el) { el.textContent = D.NOW_UPDATED; });

  // Skills
  $("skills-grid").innerHTML = D.SKILLS.map(function (g) {
    return '<div class="blueprint" style="padding: 24px;"><i class="corner br"></i>' +
      '<span style="display: block; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; color: var(--color-accent-700); font-variant-numeric: tabular-nums;">' + esc(g.num) + "</span>" +
      '<h3 style="' + H + ' font-size: 24px; line-height: 1.1; margin: 8px 0 0;">' + esc(g.title) + "</h3>" +
      '<p style="font-size: 14px; line-height: 21px; margin: 8px 0 22px; ' + MUTED(70) + '">' + esc(g.note) + "</p>" +
      '<ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 15px;">' +
      g.items.map(function (s) {
        var segs = "";
        for (var i = 0; i < METER_STEPS; i++) segs += '<span style="flex: 1; height: 6px; border: 1px solid var(--color-accent-500); background: ' + (i < D.TIERS[s.tier] ? "var(--color-accent)" : "transparent") + ';"></span>';
        return '<li style="display: grid; gap: 7px;"><span style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px;">' +
          '<span style="font-size: 15px; line-height: 20px;">' + esc(s.name) + "</span>" +
          '<span style="' + MICRO + " white-space: nowrap; " + MUTED(62) + '">' + s.tier + "</span></span>" +
          (SHOW_METERS ? '<span style="display: flex; gap: 4px;" aria-hidden="true">' + segs + "</span>" : "") + "</li>";
      }).join("") + "</ul></div>";
  }).join("");

  // Projects
  $("projects-grid").innerHTML = D.PROJECTS.map(function (p, i) {
    return '<button type="button" data-open="p' + i + '" class="blueprint hov-card" style="appearance: none; text-align: left; font: inherit; color: inherit; background: transparent; cursor: pointer; padding: 22px; display: grid; align-content: start; transition: background 0.15s ease;"><i class="corner br"></i>' +
      '<span style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; color: var(--color-accent-700); font-variant-numeric: tabular-nums;"><span>' + p.num + " · " + esc(p.kind) + '</span><span style="' + MUTED(58) + '">' + esc(p.year) + "</span></span>" +
      '<span style="display: block; ' + H + ' font-size: 26px; line-height: 1.08; margin-top: 16px;">' + esc(p.title) + "</span>" +
      '<span style="display: block; font-size: 14px; line-height: 22px; margin-top: 10px; ' + MUTED(78) + '">' + esc(p.teaser) + "</span>" +
      '<span style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 18px;">' + p.tags.map(tag).join("") + "</span>" +
      '<span style="display: flex; align-items: center; gap: 8px; margin-top: 20px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; color: var(--color-accent-700);"><span style="display: block; width: 26px; height: 1px; background: currentColor;"></span>Open sheet</span></button>';
  }).join("");

  // Timeline
  $("timeline-rail").insertAdjacentHTML("beforeend", D.TIMELINE.map(function (e, i) {
    var dot = e.kind.indexOf("Full-time") === 0 ? "var(--color-accent)" : "var(--color-bg)";
    return '<button type="button" data-open="t' + i + '" class="blueprint hov-card" style="position: relative; appearance: none; text-align: left; font: inherit; color: inherit; background: transparent; cursor: pointer; width: 278px; flex: 0 0 278px; padding: 20px; display: grid; align-content: start; transition: background 0.15s ease;">' + C4 +
      '<span style="position: absolute; top: -24px; left: 19px; width: 1px; height: 23px; background: var(--color-accent);"></span>' +
      '<span style="position: absolute; top: -27px; left: 16px; width: 7px; height: 7px; border: 1px solid var(--color-accent); background: ' + dot + ';"></span>' +
      '<span style="display: block; font-family: var(--font-heading); font-weight: 600; font-size: 21px; line-height: 1; letter-spacing: 0.02em; font-variant-numeric: tabular-nums; color: var(--color-accent-700);">' + esc(e.span) + "</span>" +
      '<span style="display: block; ' + MICRO + " margin-top: 11px; " + MUTED(62) + '">' + esc(e.kind) + "</span>" +
      '<span style="display: block; ' + H + ' font-size: 22px; line-height: 1.1; margin-top: 7px;">' + esc(e.role) + "</span>" +
      '<span style="display: block; font-size: 14px; line-height: 20px; margin-top: 4px; ' + MUTED(78) + '">' + esc(e.org) + "</span>" +
      '<span style="display: block; font-size: 13px; line-height: 20px; margin-top: 12px; ' + MUTED(70) + '">' + esc(e.teaser) + "</span>" +
      '<span style="display: flex; align-items: center; gap: 8px; margin-top: 18px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; color: var(--color-accent-700);"><span style="display: block; width: 22px; height: 1px; background: currentColor;"></span>Open sheet</span></button>';
  }).join(""));

  // Now
  var CELL = "min-width: 0; border-right: 1px solid var(--color-divider); border-bottom: 1px solid var(--color-divider);";
  $("now-cells").innerHTML = D.NOW.map(function (n) {
    return '<div style="flex: 1 1 220px; padding: 22px; ' + CELL + '">' +
      '<span style="display: block; ' + MICRO + ' color: var(--color-accent-700);">' + esc(n.label) + "</span>" +
      '<span style="display: block; ' + H + ' font-size: 21px; line-height: 1.1; margin-top: 10px;">' + esc(n.title) + "</span>" +
      '<span style="display: block; font-size: 13px; line-height: 20px; margin-top: 8px; ' + MUTED(72) + '">' + esc(n.note) + "</span></div>";
  }).join("");

  // Gear
  $("gear-cells").innerHTML = D.GEAR.map(function (g) {
    return '<div style="flex: 1 1 260px; padding: 24px 22px; ' + CELL + '">' +
      '<span style="display: flex; align-items: baseline; justify-content: space-between; gap: 12px; ' + MICRO + ' color: var(--color-accent-700); font-variant-numeric: tabular-nums;"><span>' + g.num + " · " + esc(g.role) + '</span><span style="' + MUTED(58) + '">' + esc(g.form) + "</span></span>" +
      '<span style="display: block; ' + H + ' font-size: 22px; line-height: 1.1; margin-top: 12px;">' + esc(g.name) + "</span>" +
      '<ul style="list-style: none; margin: 16px 0 0; padding: 0; display: grid; gap: 8px;">' + g.specs.map(function (s) {
        return '<li style="display: flex; gap: 12px; font-size: 13px; line-height: 19px;"><span style="min-width: 62px; flex: 0 0 auto; ' + MICRO + " " + MUTED(58) + ' padding-top: 3px;">' + esc(s[0]) + '</span><span style="' + MUTED(82) + '">' + esc(s[1]) + "</span></li>";
      }).join("") + "</ul>" +
      '<span style="display: block; font-size: 13px; line-height: 20px; margin-top: 16px; ' + MUTED(70) + '">' + esc(g.note) + "</span></div>";
  }).join("");
  $("desk-cells").innerHTML = D.DESK.map(function (d) {
    return '<div style="flex: 1 1 260px; padding: 20px 22px; ' + CELL + '">' +
      '<span style="display: block; ' + MICRO + ' color: var(--color-accent-700); font-variant-numeric: tabular-nums;">' + d.num + " · " + esc(d.label) + "</span>" +
      '<span style="display: block; ' + H + ' font-size: 20px; line-height: 1.1; margin-top: 10px;">' + esc(d.name) + "</span>" +
      '<span style="display: block; font-size: 13px; line-height: 20px; margin-top: 8px; ' + MUTED(72) + '">' + esc(d.note) + "</span></div>";
  }).join("");

  // Sheet modal
  var sheet = $("sheet"), lastTrigger = null;
  var LBL = "display: block; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; color: var(--color-accent-700);";
  var RULE = '<hr style="height: 1px; border: 0; background: var(--color-divider); margin: 10px 0 16px;">';
  function openSheet(src, trigger, key) {
    if (!trigger || !sheet.contains(trigger)) lastTrigger = trigger;
    var grp = key[0] === "p" ? D.PROJECTS : D.TIMELINE, cur = +key.slice(1);
    var index = '<nav class="journal-index" aria-label="Entries"><span class="journal-head">' + (key[0] === "p" ? "Jobs · Projects" : "Jobs · Record") + '<b>' + String(grp.length).padStart(2, "0") + '</b></span>' +
      grp.map(function (g, i) {
        var t = g.role ? g.role + " — " + g.org : g.title;
        return '<button type="button" class="journal-item' + (i === cur ? " is-on" : "") + '" data-open="' + key[0] + i + '"' + (i === cur ? ' aria-current="true"' : "") + '><span class="ji-num">' + g.num + '</span><span class="ji-t">' + esc(t) + '</span><span class="ji-k">' + esc(g.kind) + "</span></button>";
      }).join("") + "</nav>";
    var title = src.role ? src.role + " — " + src.org : src.title;
    sheet.innerHTML =
      '<div style="position: sticky; top: 0; z-index: 2; background: var(--color-bg); border-bottom: 1px solid var(--color-divider);"><div style="max-width: 1560px; margin: 0 auto; padding: 18px clamp(18px, 5vw, 56px); display: flex; align-items: center; justify-content: space-between; gap: 20px;">' +
      '<span style="font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; color: var(--color-accent-700); font-variant-numeric: tabular-nums;">' + src.num + " · " + esc(src.kind) + "</span>" +
      '<button type="button" data-close aria-label="Close" class="blueprint hov-close" style="appearance: none; cursor: pointer; background: transparent; color: inherit; width: 56px; height: 56px; display: grid; place-items: center; flex: 0 0 auto; transition: background 0.15s ease;">' + C4 +
      '<svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square" aria-hidden="true"><path d="M5 5 19 19M19 5 5 19"></path></svg><span class="cy-tip" aria-hidden="true">Esc</span></button></div></div>' +
      '<div class="journal" style="max-width: 1560px; margin: 0 auto; padding: clamp(28px, 5vh, 56px) clamp(18px, 5vw, 56px) clamp(56px, 10vh, 104px);">' + index + '<article class="journal-body">' +
      '<h2 id="sheet-title" style="' + H + ' font-size: clamp(34px, 6vw, 72px); line-height: 1.04; letter-spacing: 0.01em; margin: 0; margin-left: -0.052em;">' + esc(title) + "</h2>" +
      '<p style="font-size: clamp(16px, 1.8vw, 19px); line-height: 1.6; max-width: 62ch; margin: 22px 0 0; ' + MUTED(82) + '">' + esc(src.summary) + "</p>" +
      '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(170px, 1fr)); margin-top: 28px; border-top: 1px solid var(--color-divider); border-left: 1px solid var(--color-divider);">' +
      src.meta.map(function (m) {
        return '<div style="padding: 16px 18px; border-right: 1px solid var(--color-divider); border-bottom: 1px solid var(--color-divider);"><span style="display: block; ' + MICRO + " " + MUTED(58) + '">' + esc(m[0]) + '</span><span style="display: block; font-family: var(--font-heading); font-weight: 600; font-size: 19px; line-height: 1.2; letter-spacing: 0.02em; margin-top: 6px;">' + esc(m[1]) + "</span></div>";
      }).join("") + "</div>" +
      '<div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: clamp(28px, 4vw, 56px); margin-top: clamp(36px, 5vh, 56px);">' +
      '<div><span style="' + LBL + '">The problem</span>' + RULE + '<p style="font-size: 15px; line-height: 25px; margin: 0; ' + MUTED(80) + '">' + esc(src.problem) + "</p></div>" +
      '<div><span style="' + LBL + '">What I did</span>' + RULE + '<ul style="list-style: none; margin: 0; padding: 0; display: grid; gap: 14px;">' +
      src.bullets.map(function (b, i) {
        return '<li style="display: grid; grid-template-columns: 26px 1fr; gap: 10px; font-size: 15px; line-height: 24px; ' + MUTED(82) + '"><span style="font-size: 11px; letter-spacing: 0.08em; font-weight: 600; font-variant-numeric: tabular-nums; color: var(--color-accent-700); padding-top: 5px;">' + String(i + 1).padStart(2, "0") + "</span><span>" + esc(b) + "</span></li>";
      }).join("") + "</ul></div></div>" +
      '<div class="blueprint" style="margin-top: clamp(40px, 6vh, 64px); padding: 24px; display: grid; gap: 10px;">' + C4 +
      '<span style="' + LBL + '">Outcome</span><span style="font-family: var(--font-heading); font-weight: 600; font-size: clamp(22px, 2.6vw, 30px); line-height: 1.2; letter-spacing: 0.02em;">' + esc(src.outcome) + "</span></div>" +
      '<div style="display: flex; flex-wrap: wrap; gap: 6px; margin-top: 28px;">' + src.tags.map(tag).join("") + "</div>" +
      '<button type="button" data-close class="btn btn-ghost" style="margin-top: clamp(36px, 5vh, 56px); min-height: 42px; padding: 0 22px;">Close sheet</button></article></div>';
    sheet.hidden = false;
    sheet.scrollTop = 0;
    document.body.style.overflow = "hidden";
    sheet.querySelector("[data-close]").focus();
  }
  var closing = false;
  function closeSheet() {
    if (sheet.hidden || closing) return;
    function done() {
      closing = false;
      sheet.classList.remove("cy-closing");
      sheet.hidden = true;
      sheet.innerHTML = "";
      document.body.style.overflow = "";
      if (lastTrigger) lastTrigger.focus({ preventScroll: true });
    }
    if (matchMedia("(prefers-reduced-motion: reduce)").matches) return done();
    closing = true;
    sheet.classList.remove("cy-open"); void sheet.offsetWidth;
    sheet.classList.add("cy-closing");
    var t = setTimeout(done, 450);
    sheet.addEventListener("animationend", function h(ev) { if (ev.target !== sheet) return; sheet.removeEventListener("animationend", h); clearTimeout(t); done(); });
  }
  document.addEventListener("click", function (e) {
    var o = e.target.closest("[data-open]");
    if (o) {
      var key = o.getAttribute("data-open");
      var src = key[0] === "p" ? D.PROJECTS[+key.slice(1)] : D.TIMELINE[+key.slice(1)];
      openSheet(src, o, key);
      return;
    }
    if (e.target.closest("[data-close]")) closeSheet();
  });
  document.addEventListener("keydown", function (e) {
    if (sheet.hidden) return;
    if (e.key === "Escape") closeSheet();
    if (e.key === "Tab") {
      var f = sheet.querySelectorAll("button, a[href]");
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Theme toggle
  var btn = $("theme-toggle");
  function syncIcon() {
    var dark = window.Theme.get() === "dark";
    btn.querySelector('[data-icon="sun"]').hidden = !dark;
    btn.querySelector('[data-icon="moon"]').hidden = dark;
    var label = dark ? "Switch to light" : "Switch to dark";
    btn.setAttribute("aria-label", label); btn.title = label;
  }
  syncIcon();
  var mq = window.Theme.followSystem;
  function onScheme(e) { window.Theme.apply(e.matches ? "dark" : "light"); syncIcon(); }
  if (mq) mq.addEventListener("change", onScheme);
  btn.addEventListener("click", function () {
    if (mq) { mq.removeEventListener("change", onScheme); mq = null; }
    window.Theme.set(window.Theme.get() === "dark" ? "light" : "dark");
    syncIcon();
  });

  // Mobile display-settings popup
  var tmBtn = $("theme-menu-btn"), tmPanel = $("theme-tools");
  function setMenu(open) {
    var isOpen = tmPanel.classList.contains("is-open");
    tmBtn.setAttribute("aria-expanded", open ? "true" : "false");
    if (open) { tmPanel.classList.remove("is-closing"); tmPanel.classList.add("is-open"); return; }
    if (!isOpen) return;
    if (matchMedia("(prefers-reduced-motion: reduce)").matches || innerWidth > 700) { tmPanel.classList.remove("is-open", "is-closing"); return; }
    tmPanel.classList.add("is-closing");
    setTimeout(function () { if (tmPanel.classList.contains("is-closing")) tmPanel.classList.remove("is-open", "is-closing"); }, 260);
  }
  tmBtn.addEventListener("click", function (e) { e.stopPropagation(); setMenu(!tmPanel.classList.contains("is-open")); });
  document.addEventListener("click", function (e) { if (tmPanel.classList.contains("is-open") && !$("theme-menu").contains(e.target)) setMenu(false); });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape" && tmPanel.classList.contains("is-open")) { setMenu(false); tmBtn.focus(); } });
  window.addEventListener("resize", function () { if (innerWidth > 700) setMenu(false); });

  // Palette switcher
  var palBox = $("palette"), PALS = window.Theme.palettes;
  Object.keys(PALS).forEach(function (k) {
    var b = document.createElement("button");
    b.type = "button"; b.className = "pal-opt"; b.setAttribute("role", "radio");
    b.setAttribute("data-pal", k); b.title = PALS[k].label; b.setAttribute("aria-label", PALS[k].label + " palette");
    b.innerHTML = '<span style="background:' + PALS[k].swatch + '"></span>';
    palBox.appendChild(b);
  });
  function syncPal() {
    var cur = window.Theme.getPalette();
    palBox.querySelectorAll(".pal-opt").forEach(function (b) { b.setAttribute("aria-checked", b.getAttribute("data-pal") === cur ? "true" : "false"); });
  }
  syncPal();
  palBox.addEventListener("click", function (e) {
    var b = e.target.closest(".pal-opt"); if (!b) return;
    window.Theme.setPalette(b.getAttribute("data-pal")); syncPal();
  });

  // Keyboard: digit keys jump to nav link by index (outside inputs)
  document.addEventListener("keydown", function (e) {
    if (e.ctrlKey || e.metaKey || e.altKey || e.defaultPrevented) return;
    var t = e.target, tag = t && t.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || (t && t.isContentEditable)) return;
    if (!sheet.hidden) return;
    if (!/^[0-9]$/.test(e.key)) return;
    var navLinks = document.querySelectorAll(".nav-link");
    if (e.key === "0") { e.preventDefault(); if (window.cyJump) window.cyJump("top"); else window.scrollTo({ top: 0, behavior: "smooth" }); return; }
    var l = navLinks[+e.key - 1]; if (!l) return;
    e.preventDefault();
    l.click();
    l.classList.remove("key-hit"); void l.offsetWidth; l.classList.add("key-hit");
  });
  document.querySelectorAll(".nav-link").forEach(function (l, i) { if (i < 9) { l.setAttribute("aria-keyshortcuts", String(i + 1)); l.title = "Press " + (i + 1); } });

  // Scroll-spy
  // Active = last section whose top has passed just under the header.
  var links = document.querySelectorAll(".nav-link"), hdr = document.querySelector("header"), spyRaf = 0;
  var spyEls = D.NAV.map(function (n) { return $(n.id); }).filter(Boolean);
  function spy() {
    spyRaf = 0;
    var line = hdr.getBoundingClientRect().bottom + 24, cur = null;
    spyEls.forEach(function (el) { if (el.getBoundingClientRect().top <= line) cur = el.id; });
    if (innerHeight + scrollY >= document.documentElement.scrollHeight - 4 && spyEls.length) cur = spyEls[spyEls.length - 1].id;
    links.forEach(function (l) { l.classList.toggle("is-active", l.getAttribute("data-target") === cur); });
  }
  window.addEventListener("scroll", function () { if (!spyRaf) spyRaf = requestAnimationFrame(spy); }, { passive: true });
  window.addEventListener("resize", spy);
  window.navSpy = spy;
  spy();
})();
