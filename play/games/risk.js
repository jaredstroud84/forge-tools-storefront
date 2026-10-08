/* World Conquest — territories, attack dice, defend. */
(function () {
  "use strict";
  var ID = "risk";
  if (window.TableKit) TableKit.catalog(ID, "World Conquest", "logic", "Territories. Attack rolls.");
  var LANDS = ["North", "East", "South", "West", "Isle"];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("World Conquest");
    var you, house, over, focus;
    function deal() {
      you = [2, 2, 2, 1, 1];
      house = [2, 2, 1, 2, 1];
      focus = 0; over = false;
      paint();
      ui.say("Pick a land, then attack. Higher die takes a troop.");
    }
    function attack() {
      if (over) return;
      if (you[focus] < 1) { ui.say("No troops there."); return; }
      var target = house.indexOf(Math.max.apply(null, house));
      var a = 1 + Math.floor(Math.random() * 6);
      var b = 1 + Math.floor(Math.random() * 6);
      if (a >= b) house[target] = Math.max(0, house[target] - 1);
      else you[focus] = Math.max(0, you[focus] - 1);
      ui.say("You " + a + " vs house " + b + " on " + LANDS[target] + ".");
      var ys = you.reduce(function (s, n) { return s + n; }, 0);
      var hs = house.reduce(function (s, n) { return s + n; }, 0);
      if (hs <= 0) { over = true; TK.win(ID, { xp: 14, text: ys + "" }); ui.say("Map held."); }
      else if (ys <= 0) { over = true; TK.lose(ID, { text: "House" }); ui.say("House holds the map."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><div class='tk-row'>" + LANDS.map(function (n, i) {
        return "<button type='button' class='tk-btn" + (i === focus ? " pri" : "") + "' data-i='" + i + "'>" + n + "<br>Y" + you[i] + " H" + house[i] + "</button>";
      }).join("") + "</div></div>";
      ui.meta.textContent = you.reduce(function (s, n) { return s + n; }, 0) + " vs " + house.reduce(function (s, n) { return s + n; }, 0);
      ui.board.querySelectorAll("button").forEach(function (b) {
        b.onclick = function () { focus = +b.dataset.i; paint(); };
      });
    }
    ui.btn("Attack", attack, true);
    ui.tool("New map", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "World Conquest", blurb: "Attack rolls.", mini: "Risk", cat: "logic", boot: boot });
})();
