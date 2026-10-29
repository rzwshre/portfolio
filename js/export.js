(function () {
  var D = window.PORTFOLIO;
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); };
  var C4 = '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>';
  document.querySelectorAll("[data-now-updated]").forEach(function (el) { el.textContent = D.NOW_UPDATED; });

  document.getElementById("x-skills").outerHTML = D.SKILLS.map(function (g) {
    return '<div style="margin-bottom: 14px;"><span style="display: block; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; font-weight: 600; color: var(--color-accent-700);">' + esc(g.title) + '</span>' +
      '<p style="font-size: 14px; line-height: 22px; margin: 5px 0 0;">' + g.items.map(function (s) { return esc(s.name) + " (" + s.tier + ")"; }).join("  ·  ") + "</p></div>";
  }).join("");

  document.getElementById("x-sheets").outerHTML = D.PROJECTS.concat(D.TIMELINE).map(function (s) {
    var title = s.role ? s.role + " — " + s.org : s.title;
    return '<article data-sheet class="blueprint" style="padding: 20px; margin-bottom: 18px;">' + C4 +
      '<span style="display: flex; flex-wrap: wrap; gap: 4px 12px; font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; font-weight: 600; color: var(--color-accent-700);"><span>' + s.num + " · " + esc(s.kind) + "</span></span>" +
      '<h3 style="font-family: var(--font-heading); font-weight: 600; text-transform: uppercase; font-size: 24px; line-height: 1.15; letter-spacing: 0.02em; margin: 8px 0 0;">' + esc(title) + "</h3>" +
      '<p style="font-size: 14px; line-height: 22px; margin: 8px 0 0;">' + esc(s.summary) + "</p>" +
      '<p style="font-size: 13px; line-height: 20px; margin: 8px 0 0; color: color-mix(in srgb, var(--color-text) 72%, transparent);">' + s.meta.map(function (m) { return esc(m[0]) + ": " + esc(m[1]); }).join("  ·  ") + "</p>" +
      '<ul style="margin: 10px 0 0; padding-left: 18px; display: grid; gap: 5px;">' + s.bullets.map(function (b) { return '<li style="font-size: 14px; line-height: 21px;">' + esc(b) + "</li>"; }).join("") + "</ul>" +
      '<p style="font-size: 13px; line-height: 20px; margin: 10px 0 0;"><strong>Outcome:</strong> ' + esc(s.outcome) + "</p></article>";
  }).join("");

  var P = 'style="font-size: 14px; line-height: 22px; margin: 0 0 6px;"';
  document.getElementById("x-gear").outerHTML =
    D.GEAR.map(function (g) { return "<p " + P + "><strong>" + esc(g.name) + "</strong> — " + g.specs.map(function (s) { return esc(s[0] + " " + s[1]); }).join(", ") + "</p>"; }).join("") +
    D.DESK.map(function (d) { return "<p " + P + "><strong>" + esc(d.name) + "</strong> — " + esc(d.label) + "</p>"; }).join("");
})();
