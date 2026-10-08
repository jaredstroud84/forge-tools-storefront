/* Triple Match — pick three specific tiles. */
(function () {
  "use strict";
  var ID = "triplematch";
  if (window.TableKit) TableKit.catalog(ID, "Triple Match", "arcade", "Three of a kind clear.");
  var TILES = ["sun", "moon", "star", "leaf"];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Triple Match");
    var board, score, over, picked;
    function deal() {
      board = TK.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11].map(function (i) { return TILES[i % 4]; }));
      score = 0; over = false; picked = [];
      paint();
      ui.say("Tap three of a kind. They clear.");
    }
    function tap(i) {
      if (over) return;
      var at = picked.indexOf(i);
      if (at >= 0) { picked.splice(at, 1); paint(); return; }
      picked.push(i);
      if (picked.length < 3) { paint(); return; }
      var kinds = picked.map(function (k) { return board[k]; });
      if (kinds[0] === kinds[1] && kinds[1] === kinds[2]) {
        picked.sort(function (a, b) { return b - a; }).forEach(function (k) { board.splice(k, 1); });
        score += 30; TK.sfx("clear"); picked = [];
        if (!board.length) { over = true; TK.win(ID, { xp: 12, text: score + "" }); ui.say("All clear."); }
      } else { ui.say("Not three of a kind."); picked = []; }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><b>" + score + "</b><div class='tk-row'>" + board.map(function (x, i) {
        return "<button type='button' class='tk-btn" + (picked.indexOf(i) >= 0 ? " pri" : "") + "' data-i='" + i + "'>" + x + "</button>";
      }).join("") + "</div></div>";
      ui.meta.textContent = score;
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { tap(+b.dataset.i); }; });
    }
    ui.tool("New board", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Triple Match", blurb: "Three of a kind.", mini: "Triple", cat: "arcade", boot: boot });
})();
