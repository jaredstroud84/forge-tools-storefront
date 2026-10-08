/* Color Sort — pour matching tops. Four tubes. */
(function () {
  "use strict";
  var ID = "sort";
  if (window.TableKit) TableKit.catalog(ID, "Color Sort", "logic", "Pour a color.");
  var COL = { r: "#e57373", b: "#64b5f6", g: "#81c784", y: "#ffd54f" };
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Color Sort");
    var tubes, pick, over;
    function deal() {
      tubes = [["r", "b", "g"], ["b", "r", "y"], ["g", "y"], [], []];
      pick = null; over = false; paint();
      ui.say("Pour the top color into a match or an empty tube.");
    }
    function tap(i) {
      if (over) return;
      if (pick == null) { if (tubes[i].length) pick = i; paint(); return; }
      if (pick === i) { pick = null; paint(); return; }
      var from = tubes[pick], to = tubes[i];
      if (!from.length || to.length >= 4) { pick = null; paint(); return; }
      var color = from[from.length - 1];
      if (to.length && to[to.length - 1] !== color) { ui.say("No match."); pick = null; paint(); return; }
      to.push(from.pop());
      TK.sfx("place"); pick = null;
      if (tubes.every(function (t) { return !t.length || (t.length >= 2 && t.every(function (c) { return c === t[0]; })); })) {
        over = true; TK.win(ID, { xp: 12 }); ui.say("Sorted.");
      }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-row'>" + tubes.map(function (t, i) {
        return "<button type='button' class='tk-btn" + (pick === i ? " pri" : "") + "' data-i='" + i + "'>" +
          (t.length ? t.map(function (c) { return "<span class='tk-die' style='background:" + COL[c] + ";width:18px;height:18px'></span>"; }).join("") : "—") + "</button>";
      }).join("") + "</div>";
      ui.meta.textContent = pick != null ? "Pour" : "Pick";
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { tap(+b.dataset.i); }; });
    }
    ui.tool("New tubes", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Color Sort", blurb: "Pour a color.", mini: "Sort", cat: "logic", boot: boot });
})();
