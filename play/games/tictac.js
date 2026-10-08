/* Tic-Tac-Toe — house blocks and takes wins. */
(function () {
  "use strict";
  var ID = "tictac";
  if (window.TableKit) TableKit.catalog(ID, "Tic-Tac-Toe", "logic", "Three in a row.");
  var LINES = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Tic-Tac-Toe");
    var g, over;
    function deal() { g = [0, 0, 0, 0, 0, 0, 0, 0, 0]; over = false; paint(); ui.say("Three in a row. House answers."); }
    function won(who) { return LINES.some(function (l) { return l.every(function (i) { return g[i] === who; }); }); }
    function find(who) {
      for (var n = 0; n < LINES.length; n++) {
        var l = LINES[n], have = l.filter(function (i) { return g[i] === who; }).length;
        var empty = l.filter(function (i) { return !g[i]; });
        if (have === 2 && empty.length === 1) return empty[0];
      }
      return null;
    }
    function tap(i) {
      if (over || g[i]) return;
      g[i] = 1; TK.sfx("place");
      if (won(1)) { over = true; TK.win(ID, { xp: 10 }); ui.say("Three. You win."); paint(); return; }
      var open = g.map(function (v, k) { return v ? null : k; }).filter(function (k) { return k != null; });
      if (!open.length) { over = true; TK.lose(ID, { text: "Draw" }); ui.say("Draw."); paint(); return; }
      var best = find(2);
      if (best == null) best = find(1);
      if (best == null && open.indexOf(4) >= 0) best = 4;
      if (best == null) best = [0, 2, 6, 8].filter(function (c) { return open.indexOf(c) >= 0; })[0];
      if (best == null) best = open[0];
      g[best] = 2;
      if (won(2)) { over = true; TK.lose(ID, { text: "House" }); ui.say("House has three."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-grid' style='grid-template-columns:repeat(3,1fr)'>" + g.map(function (v, i) {
        return "<button type='button' class='tk-btn' data-i='" + i + "'>" + (v === 1 ? "X" : v === 2 ? "O" : "") + "</button>";
      }).join("") + "</div>";
      ui.meta.textContent = over ? "Over" : "Your turn";
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { tap(+b.dataset.i); }; });
    }
    ui.tool("New board", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Tic-Tac-Toe", blurb: "Three in a row.", mini: "Tac", cat: "logic", boot: boot });
})();
