/* Stacked polish: time-of-day grade, press flash, win confetti, reduced motion. */
(function () {
  "use strict";
  function hourGrade() {
    var h = new Date().getHours();
    var warm = h < 7 || h >= 18;
    document.documentElement.style.setProperty("--grade", warm ? "sepia(.12) saturate(1.08)" : "saturate(1.04)");
    document.body.style.filter = getComputedStyle(document.documentElement).getPropertyValue("--grade") || (warm ? "sepia(.08)" : "none");
  }
  function confetti() {
    if (window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    var c = document.createElement("canvas");
    c.style.cssText = "position:fixed;inset:0;z-index:998;pointer-events:none";
    document.body.appendChild(c);
    var x = c.getContext("2d");
    var w = c.width = innerWidth;
    var h = c.height = innerHeight;
    var bits = [];
    for (var i = 0; i < 48; i++) {
      bits.push({ x: Math.random() * w, y: -10, v: 2 + Math.random() * 3, s: 4 + Math.random() * 4, c: ["#e7c56a", "#d06a2a", "#f6efe4", "#6b4c8a"][i % 4] });
    }
    var n = 0;
    (function tick() {
      x.clearRect(0, 0, w, h);
      bits.forEach(function (b) { b.y += b.v; x.fillStyle = b.c; x.fillRect(b.x, b.y, b.s, b.s); });
      if (++n < 55) requestAnimationFrame(tick);
      else c.remove();
    })();
  }
  function wrapWin() {
    if (!window.TableKit || TableKit.win.__pol) return;
    var w = TableKit.win;
    TableKit.win = function (id, meta) {
      var r = w.apply(this, arguments);
      confetti();
      return r;
    };
    TableKit.win.__pol = true;
  }
  document.addEventListener("pointerdown", function (e) {
    var t = e.target;
    if (!t || !t.classList || !t.classList.contains("tk-btn")) return;
    t.style.transform = "scale(.97)";
    setTimeout(function () { t.style.transform = ""; }, 90);
  }, true);
  hourGrade();
  setTimeout(wrapWin, 400);
  setInterval(hourGrade, 60000);
})();
