/* Darts — 301, double out, fixed board. */
(function () {
  "use strict";
  var ID = "skiprun";
  if (window.TableKit) TableKit.catalog(ID, "Darts", "arcade", "301, double out.");
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Darts");
    var left, darts, over, visit;
    var zones = [[20, 0], [19, 0], [18, 0], [25, 0], [20, 1], [16, 1]];
    function deal() { left = 301; darts = 3; visit = 1; over = false; paint(); ui.say("301. Checkout must be a double."); }
    function throwAt(score, dbl) {
      if (over) return;
      var hit = dbl ? score * 2 : score;
      if (hit === left && !dbl) { ui.say("Must double out. " + left + " left."); darts--; paint(); return; }
      if (hit <= left) { left -= hit; TK.sfx("place"); ui.say((dbl ? "Double " : "") + score + ". " + left + " left."); }
      else ui.say("Too high.");
      darts--;
      if (left === 0) { over = true; TK.win(ID, { xp: 14, text: visit + "" }); ui.say("Checkout."); }
      else if (!darts) { darts = 3; visit++; ui.say("Next visit. " + left + " left."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><b style='font-size:1.6em'>" + left + "</b><p>Darts " + darts + " · visit " + visit + "</p><div class='tk-row'>" +
        zones.map(function (z, i) { return "<button type='button' class='tk-btn' data-i='" + i + "'>" + (z[0] === 25 ? "Bull" : z[0]) + (z[1] ? " D" : "") + "</button>"; }).join("") + "</div></div>";
      ui.meta.textContent = left;
      ui.board.querySelectorAll("button").forEach(function (b) {
        b.onclick = function () { var z = zones[+b.dataset.i]; throwAt(z[0], !!z[1]); };
      });
    }
    ui.tool("New 301", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Darts", blurb: "301, double out.", mini: "Darts", cat: "arcade", boot: boot });
})();
