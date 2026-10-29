// Runs in <head> so the right theme + palette paint before first render.
(function () {
  var KEY = "abhinav-portfolio-theme", PKEY = "abhinav-portfolio-palette";
  var STEPS = ["100", "200", "300", "400", "500", "600", "700", "800", "900"];
  // light: 100–900 ramp; dark: ground + bright accent steps; hot: the glitch counter-colour
  var PALETTES = {
    red: {
      label: "Red", swatch: "#d9303a",
      light: ["#f9e7e7", "#f0c6c6", "#e29a9a", "#cf5f62", "#b3262e", "#981f27", "#7c1a20", "#5e1418", "#3d0d10"],
      dark: { bg: "#0d0707", surface: "#1a0d0e", text: "#f3e5e3", accent: "#ff4a55", mid: "#ff7c82", hi: "#ffaaae", top: "#ffdadc" },
      hotLight: "oklch(0.55 0.11 200)", hotDark: "oklch(0.85 0.14 195)"
    },
    relic: {
      label: "Relic", swatch: "#2ec9d3",
      light: ["#e1f3f5", "#bfe3e8", "#8ccbd3", "#46a6b3", "#0f7c8a", "#0c6773", "#0a535d", "#083f47", "#052a2f"],
      dark: { bg: "#05090c", surface: "#0b1518", text: "#e0f2f4", accent: "#34d8e0", mid: "#7ce9ee", hi: "#aef2f5", top: "#daf9fa" },
      hotLight: "oklch(0.58 0.21 25)", hotDark: "oklch(0.68 0.23 22)"
    },
    green: {
      label: "Green", swatch: "#5f8f56",
      light: ["#eaf1e7", "#cfdeca", "#a7c2a0", "#779f6e", "#446b3c", "#3a5c33", "#2f4b2a", "#24391f", "#172614"],
      dark: { bg: "#0a0d09", surface: "#131a11", text: "#e6eee2", accent: "#7fae76", mid: "#a3cd99", hi: "#c3e2ba", top: "#e3f2dd" },
      hotLight: "oklch(0.62 0.2 25)", hotDark: "oklch(0.7 0.19 20)"
    }
  };
  var root = document.documentElement;
  function vars(theme, pal) {
    var P = PALETTES[pal] || PALETTES.green, v = {};
    ["--color-accent", "--color-accent-2"].forEach(function (b) {
      v[b] = P.light[4];
      STEPS.forEach(function (s, i) { v[b + "-" + s] = P.light[i]; });
    });
    v["--cy-hot"] = P.hotLight;
    if (theme === "dark") {
      var d = P.dark;
      v["--color-bg"] = d.bg; v["--color-surface"] = d.surface; v["--color-text"] = d.text;
      v["--color-divider"] = "color-mix(in srgb, " + d.accent + " 30%, transparent)";
      ["--color-accent", "--color-accent-2"].forEach(function (b) {
        v[b] = d.accent; v[b + "-400"] = d.accent;
        v[b + "-500"] = v[b + "-600"] = v[b + "-700"] = d.mid;
        v[b + "-800"] = d.hi; v[b + "-900"] = d.top;
      });
      v["--shadow-sm"] = "0 0 0 1px color-mix(in srgb, " + d.accent + " 20%, transparent)";
      v["--shadow-md"] = "0 0 26px color-mix(in srgb, " + d.accent + " 24%, transparent)";
      v["--shadow-lg"] = "0 0 52px color-mix(in srgb, " + d.accent + " 30%, transparent)";
      v["--cy-hot"] = P.hotDark;
    }
    return v;
  }
  var applied = [];
  function paint() {
    var theme = root.getAttribute("data-theme"), pal = root.getAttribute("data-palette");
    applied.forEach(function (k) { root.style.removeProperty(k); });
    var v = vars(theme, pal);
    applied = Object.keys(v);
    applied.forEach(function (k) { root.style.setProperty(k, v[k]); });
    root.style.colorScheme = theme;
  }
  function apply(theme) { root.setAttribute("data-theme", theme); paint(); }
  function applyPalette(p) { root.setAttribute("data-palette", PALETTES[p] ? p : "green"); paint(); }

  var stored = null, storedPal = null;
  try { stored = localStorage.getItem(KEY); storedPal = localStorage.getItem(PKEY); } catch (e) {}
  var forced = root.hasAttribute("data-force-light");
  var mq = window.matchMedia ? window.matchMedia("(prefers-color-scheme: dark)") : null;
  var theme = forced ? "light" : (stored === "dark" || stored === "light") ? stored : (mq && mq.matches ? "dark" : "light");
  root.setAttribute("data-palette", PALETTES[storedPal] ? storedPal : "green");
  apply(theme);
  window.Theme = {
    get: function () { return root.getAttribute("data-theme"); },
    set: function (t) { try { localStorage.setItem(KEY, t); } catch (e) {} apply(t); },
    followSystem: !stored && !forced && mq ? mq : null,
    apply: apply,
    palettes: PALETTES,
    getPalette: function () { return root.getAttribute("data-palette"); },
    setPalette: function (p) { try { localStorage.setItem(PKEY, p); } catch (e) {} applyPalette(p); }
  };
})();
