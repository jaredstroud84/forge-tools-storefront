/* Shelf Search — targets are not highlighted. */
(function () {
  "use strict";
  var ID = "shelfsearch";
  if (window.TableKit) TableKit.catalog(ID, "Shelf Search", "logic", "Find the hidden item.");
  var ITEMS = ["can", "jar", "box", "bag", "tin", "cup"];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Shelf Search");
    var shelf, target, found, taps, over, total;
    function deal() {
      shelf = [];
      for (var i = 0; i < 16; i++) shelf.push(ITEMS[Math.floor(Math.random() * ITEMS.length)]);
      target = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      total = shelf.filter(function (x) { return x === target; }).length;
      if (!total) { shelf[0] = target; total = 1; }
      found = 0; taps = 0; over = false;
      paint();
      ui.say("Find every " + target + ". Misses end the search at 8.");
    }
    function tap(i) {
      if (over || !shelf[i]) return;
      taps++;
      if (shelf[i] !== target) {
        TK.sfx("err");
        if (taps >= 8) { over = true; TK.lose(ID, { text: found + "" }); ui.say("Too many misses. Found " + found + "."); }
        paint();
        return;
      }
      shelf[i] = "";
      found++;
      TK.sfx("clear");
      if (!shelf.some(function (x) { return x === target; })) {
        over = true; TK.win(ID, { xp: 12, text: found + "" }); ui.say("All " + target + "s found.");
      }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><b>Find every " + target + "</b><p>Found " + found + "/" + total + " · misses " + taps + "/8</p></div><div class='tk-grid' style='grid-template-columns:repeat(4,1fr)'>" +
        shelf.map(function (x, i) { return "<button type='button' class='tk-btn' data-i='" + i + "'>" + (x || "✓") + "</button>"; }).join("") + "</div>";
      ui.meta.textContent = found + " found";
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { tap(+b.dataset.i); }; });
    }
    ui.tool("New shelf", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Shelf Search", blurb: "Find the hidden item.", mini: "Search", cat: "logic", boot: boot });
})();
