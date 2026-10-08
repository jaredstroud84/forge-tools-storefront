/* Sliding Puzzle — 3x3, solvable shuffle, move count. */
(function () {
  "use strict";
  var ID = "slide";
  if (window.TableKit) TableKit.catalog(ID, "Sliding Puzzle", "logic", "Slide into the gap.");
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Sliding Puzzle");
    var g, moves, over;
    function deal() {
      g = [1, 2, 3, 4, 5, 6, 7, 8, 0];
      for (var i = 0; i < 40; i++) {
        var gap = g.indexOf(0), nbs = [];
        if (gap % 3 > 0) nbs.push(gap - 1);
        if (gap % 3 < 2) nbs.push(gap + 1);
        if (gap >= 3) nbs.push(gap - 3);
        if (gap < 6) nbs.push(gap + 3);
        var pick = nbs[Math.floor(Math.random() * nbs.length)];
        g[gap] = g[pick]; g[pick] = 0;
      }
      moves = 0; over = false; paint();
      ui.say("Slide a neighbor into the gap. Order 1 to 8.");
    }
    function tap(i) {
      if (over) return;
      var gap = g.indexOf(0), valid = false;
      if (i === gap - 1 && gap % 3 > 0) valid = true;
      if (i === gap + 1 && gap % 3 < 2) valid = true;
      if (i === gap - 3 && gap >= 3) valid = true;
      if (i === gap + 3 && gap < 6) valid = true;
      if (!valid) return;
      g[gap] = g[i]; g[i] = 0; moves++; TK.sfx("place");
      if (g.slice(0, 8).every(function (v, k) { return v === k + 1; })) {
        over = true; TK.win(ID, { xp: 12, text: moves + "" }); ui.say("Solved in " + moves + ".");
      }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-grid' style='grid-template-columns:repeat(3,1fr)'>" + g.map(function (v, i) {
        if (!v) return "<span class='tk-die'></span>";
        return "<button type='button' class='tk-btn' data-i='" + i + "'>" + v + "</button>";
      }).join("") + "</div>";
      ui.meta.textContent = moves + " moves";
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { tap(+b.dataset.i); }; });
    }
    ui.tool("New puzzle", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Sliding Puzzle", blurb: "Slide into the gap.", mini: "Slide", cat: "logic", boot: boot });
})();
