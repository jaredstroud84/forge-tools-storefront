/* Spot the Difference — right row is tappable, diffs hidden. */
(function () {
  "use strict";
  var ID = "spot";
  if (window.TableKit) TableKit.catalog(ID, "Spot the Difference", "logic", "Find the changes.");
  var COLS = ["#d06a2a", "#4a7c59", "#6b4c8a", "#e7c56a"];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Spot the Difference");
    var a, b, diffs, found, over, misses;
    function deal() {
      a = []; b = []; diffs = {}; found = 0; misses = 0; over = false;
      for (var i = 0; i < 12; i++) { var n = Math.floor(Math.random() * 4); a.push(n); b.push(n); }
      TK.shuffle([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]).slice(0, 3).forEach(function (i) { b[i] = (a[i] + 1) % 4; diffs[i] = 1; });
      paint();
      ui.say("Three squares differ. Tap them on the bottom row. Two wrong taps lose.");
    }
    function tap(i) {
      if (over) return;
      if (diffs[i] && !diffs["f" + i]) {
        diffs["f" + i] = 1; found++; TK.sfx("clear");
        if (found >= 3) { over = true; TK.win(ID, { xp: 12 }); ui.say("All three."); }
      } else {
        misses++;
        if (misses >= 2) { over = true; TK.lose(ID, { text: found + "" }); ui.say("That one matches. Found " + found + "."); }
        else ui.say("Match. One miss left.");
      }
      paint();
    }
    function paint() {
      function row(list, live) {
        return "<div class='tk-row'>" + list.map(function (n, i) {
          var style = "width:40px;height:36px;border-radius:6px;background:" + COLS[n];
          var mark = diffs["f" + i] ? "✓" : "";
          if (live) return "<button type='button' class='tk-btn' data-i='" + i + "' style='" + style + "'>" + mark + "</button>";
          return "<span class='tk-die' style='" + style + "'></span>";
        }).join("") + "</div>";
      }
      ui.board.innerHTML = "<div class='tk-paper'>" + row(a, false) + row(b, true) + "</div>";
      ui.meta.textContent = found + "/3";
      ui.board.querySelectorAll("button").forEach(function (btn) { btn.onclick = function () { tap(+btn.dataset.i); }; });
    }
    ui.tool("New pair", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Spot the Difference", blurb: "Find the changes.", mini: "Spot", cat: "logic", boot: boot });
})();
