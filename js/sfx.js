// Synthesized UI sfx (Web Audio, no files) + mute toggle. index.html only.
(function () {
  var KEY = "abhinav-portfolio-muted";
  var muted = false;
  try { muted = localStorage.getItem(KEY) === "1"; } catch (e) {}
  var ctx = null, master = null, bus = null;
  function ac() {
    if (!ctx) {
      var A = window.AudioContext || window.webkitAudioContext; if (!A) return null;
      ctx = new A(); master = ctx.createGain(); master.gain.value = 0.12;
      var crush = ctx.createWaveShaper(), curve = new Float32Array(4096), lv = 48;
      for (var i = 0; i < 4096; i++) { var x = i / 2048 - 1; curve[i] = Math.round(x * lv) / lv; }
      crush.curve = curve; var lp = ctx.createBiquadFilter(); lp.type = "lowpass"; lp.frequency.value = 5200;
      bus = ctx.createGain(); bus.connect(crush); crush.connect(lp); lp.connect(master); master.connect(ctx.destination);
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }
  // Soft-edged digital beeps: sine/triangle, gentle attack + release, no noise.
  function tone(type, f0, f1, dur, vol, delay) {
    var c = ac(); if (!c || c.state !== "running") return;
    var t = c.currentTime + (delay || 0), o = c.createOscillator(), g = c.createGain();
    var atk = Math.min(0.012, dur * 0.3), rel = Math.min(0.03, dur * 0.4);
    o.type = type; o.frequency.setValueAtTime(f0, t);
    if (f1) o.frequency.linearRampToValueAtTime(f1, t + dur);
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(vol, t + atk);
    g.gain.setValueAtTime(vol, t + dur - rel);
    g.gain.linearRampToValueAtTime(0, t + dur);
    o.connect(g); g.connect(bus); o.start(t); o.stop(t + dur + 0.02);
  }
  // quantized pitch steps — reads as "data", not a drum
  function steps(freqs, len, vol, d0, type) {
    freqs.forEach(function (f, i) { tone(type || "sine", f, 0, len, vol, (d0 || 0) + i * len); });
  }
  // Paper flap: short filtered noise burst with a fast swept bandpass (bypasses the bitcrush bus).
  function flap() {
    var c = ac(); if (!c || c.state !== "running") return;
    var t = c.currentTime, dur = 0.09, n = Math.floor(c.sampleRate * dur);
    var buf = c.createBuffer(1, n, c.sampleRate), d = buf.getChannelData(0);
    for (var i = 0; i < n; i++) {
      var p = i / n, env = p < 0.15 ? p / 0.15 : Math.pow(1 - (p - 0.15) / 0.85, 2.2);
      d[i] = (Math.random() * 2 - 1) * env * (0.6 + 0.4 * Math.sin(p * 38));
    }
    var src = c.createBufferSource(), bp = c.createBiquadFilter(), hp = c.createBiquadFilter(), g = c.createGain();
    src.buffer = buf; src.playbackRate.value = 0.9 + Math.random() * 0.25;
    bp.type = "bandpass"; bp.Q.value = 0.9;
    bp.frequency.setValueAtTime(1400 + Math.random() * 300, t);
    bp.frequency.exponentialRampToValueAtTime(3600, t + dur * 0.6);
    hp.type = "highpass"; hp.frequency.value = 500;
    g.gain.value = 0.32;
    src.connect(bp); bp.connect(hp); hp.connect(g); g.connect(master); src.start(t);
  }
  var SOUNDS = {
    hover: function () { tone("sine", 2093, 0, 0.03, 0.05); },
    hoverCard: function () { flap(); },
    click: function () { steps([1760, 2637], 0.034, 0.07, 0, "triangle"); },
    open: function () { steps([1047, 1319, 1568, 2093], 0.032, 0.06, 0, "triangle"); tone("sine", 2093, 2093, 0.12, 0.03, 0.13); },
    close: function () { steps([2093, 1568, 1047], 0.03, 0.055, 0, "triangle"); },
    sweep: function () { tone("sine", 440, 1760, 0.26, 0.04); steps([1760, 0, 2349, 2637], 0.04, 0.05, 0.26, "triangle"); }
  };
  var lastHover = 0;
  window.Sfx = {
    play: function (name) {
      if (muted || !SOUNDS[name]) return;
      if (name.indexOf("hover") === 0) { var now = performance.now(); if (now - lastHover < 45) return; lastHover = now; }
      try { SOUNDS[name](); } catch (e) {}
    },
    isMuted: function () { return muted; }
  };

  // Unlock on first gesture (browsers block audio before it)
  ["pointerdown", "keydown"].forEach(function (ev) { window.addEventListener(ev, function () { if (!muted) ac(); }, { once: true, capture: true }); });

  var CARD = "[data-open]", BTN = ".btn, .nav-link, .pal-opt, #theme-toggle, [data-close], #sfx-toggle, footer a";
  document.addEventListener("pointerover", function (e) {
    if (e.pointerType === "touch") return;
    var el = e.target.closest(CARD + ", " + BTN);
    if (!el || (e.relatedTarget && el.contains(e.relatedTarget))) return;
    window.Sfx.play(el.matches(CARD) ? "hoverCard" : "hover");
  });
  document.addEventListener("click", function (e) {
    var el = e.target.closest(CARD + ", " + BTN); if (!el) return;
    if (el.id === "sfx-toggle" || el.matches(".pal-opt, #theme-toggle")) return; // toggle has its own / theme plays sweep
    window.Sfx.play(el.matches(CARD) ? "open" : el.matches("[data-close]") ? "close" : "click");
  });
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && !document.getElementById("sheet").hidden) window.Sfx.play("close");
  }, true);

  // Mute button
  var b = document.createElement("button");
  b.type = "button"; b.id = "sfx-toggle"; b.className = "blueprint cy-sfx";
  b.innerHTML = '<i class="corner tl"></i><i class="corner tr"></i><i class="corner bl"></i><i class="corner br"></i>' +
    '<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H2v6h4l5 4V5z"></path>' +
    '<path data-on d="M15.5 8.5a5 5 0 0 1 0 7M19 5a10 10 0 0 1 0 14"></path><path data-off d="m22 9-6 6M16 9l6 6"></path></svg>' +
    '<span data-lbl></span>';
  document.body.appendChild(b);
  function sync() {
    b.querySelector("[data-on]").style.display = muted ? "none" : "";
    b.querySelector("[data-off]").style.display = muted ? "" : "none";
    b.querySelector("[data-lbl]").textContent = muted ? "Sfx off" : "Sfx on";
    b.setAttribute("aria-pressed", muted ? "true" : "false");
    b.setAttribute("aria-label", muted ? "Unmute sound effects" : "Mute sound effects");
  }
  sync();
  b.addEventListener("click", function () {
    muted = !muted;
    try { localStorage.setItem(KEY, muted ? "1" : "0"); } catch (e) {}
    sync();
    if (!muted) { ac(); setTimeout(function () { window.Sfx.play("click"); }, 30); }
  });
})();
