/* Shelf Match — tap three of a kind. Shelf pushes. */
(function () {
  "use strict";
  var ID = "shelfmatch";
  if (window.TableKit) TableKit.catalog(ID, "Shelf Match", "arcade", "Match three. The shelf pushes.");
  var ITEMS = ["can", "jar", "box", "bag", "tin"];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Shelf Match");
    var shelf, score, over, picked;
    function push() { shelf.push(ITEMS[Math.floor(Math.random() * ITEMS.length)]); }
    function deal() {
      shelf = []; score = 0; over = false; picked = [];
      for (var i = 0; i < 9; i++) push();
      paint();
      ui.say("Tap three matching items. They clear. Two more push in.");
    }
    function tap(i) {
      if (over) return;
      var at = picked.indexOf(i);
      if (at >= 0) { picked.splice(at, 1); paint(); return; }
      picked.push(i);
      if (picked.length < 3) { paint(); return; }
      var kinds = picked.map(function (k) { return shelf[k]; });
      if (kinds[0] === kinds[1] && kinds[1] === kinds[2]) {
        picked.sort(function (a, b) { return b - a; }).forEach(function (k) { shelf.splice(k, 1); });
        score += 30; push(); push();
        TK.sfx("clear");
        picked = [];
        if (score >= 180) { over = true; TK.win(ID, { xp: 12, text: score + "" }); ui.say("Shelf clear enough."); }
        else if (shelf.length > 16) { over = true; TK.lose(ID, { text: "Stuck" }); ui.say("No room."); }
      } else {
        ui.say("Not a match.");
        picked = [];
      }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><b>" + score + "</b><div class='tk-row'>" + shelf.map(function (x, i) {
        return "<button type='button' class='tk-btn" + (picked.indexOf(i) >= 0 ? " pri" : "") + "' data-i='" + i + "'>" + x + "</button>";
      }).join("") + "</div></div>";
      ui.meta.textContent = score;
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { tap(+b.dataset.i); }; });
    }
    ui.tool("New shelf", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Shelf Match", blurb: "Match three.", mini: "Shelf", cat: "arcade", boot: boot });
})();
