/* Number Tiles — runs and groups. First to 30. */
(function () {
  "use strict";
  var ID = "rummikub";
  if (window.TableKit) TableKit.catalog(ID, "Number Tiles", "logic", "Lay a run. First to 30.");
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Number Tiles");
    var hand, table, score, over;
    function deal() {
      hand = [];
      for (var i = 0; i < 10; i++) hand.push(1 + Math.floor(Math.random() * 13));
      table = []; score = 0; over = false;
      paint();
      ui.say("Lay a run of three or a group of three. First to 30.");
    }
    function lay() {
      if (over) return;
      hand.sort(function (a, b) { return a - b; });
      var run = null, i;
      for (i = 0; i < hand.length - 2; i++) {
        if (hand[i + 1] === hand[i] + 1 && hand[i + 2] === hand[i] + 2) { run = [hand[i], hand[i + 1], hand[i + 2]]; break; }
      }
      if (!run) {
        var c = {};
        hand.forEach(function (n) { c[n] = (c[n] || 0) + 1; });
        Object.keys(c).forEach(function (k) { if (!run && c[k] >= 3) run = [+k, +k, +k]; });
      }
      if (!run) {
        hand.push(1 + Math.floor(Math.random() * 13));
        ui.say("No meld. Drew a tile.");
      } else {
        run.forEach(function (n) { hand.splice(hand.indexOf(n), 1); table.push(n); score += n; });
        TK.sfx("clear");
        ui.say("Laid " + run.join(" ") + ".");
      }
      if (score >= 30) { over = true; TK.win(ID, { xp: 12, text: score + "" }); ui.say("30. Rack clear."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><p>Score <b>" + score + "</b>/30</p><p>Table " + (table.join(" ") || "—") + "</p><div class='tk-row'>" +
        hand.map(function (n) { return "<span class='tk-die'>" + n + "</span>"; }).join("") + "</div></div>";
      ui.meta.textContent = score + "/30";
    }
    ui.btn("Lay or draw", lay, true);
    ui.tool("New rack", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Number Tiles", blurb: "Lay a run. First to 30.", mini: "Tiles", cat: "logic", boot: boot });
})();
