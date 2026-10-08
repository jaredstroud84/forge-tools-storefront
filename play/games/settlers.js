/* Island Settlers — wood, brick, wheat. Roads and towns. */
(function () {
  "use strict";
  var ID = "settlers";
  if (window.TableKit) TableKit.catalog(ID, "Island Settlers", "logic", "Build roads and towns.");
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Island Settlers");
    var wood, brick, wheat, roads, towns, over;
    function deal() {
      wood = brick = wheat = roads = towns = 0; over = false;
      paint();
      ui.say("Roll a resource. Road is 1 wood + 1 brick. Town is 2 roads + 1 wheat.");
    }
    function roll() {
      if (over) return;
      var r = Math.random();
      if (r < 0.4) wood++;
      else if (r < 0.75) brick++;
      else wheat++;
      TK.sfx("tap");
      paint();
    }
    function buildRoad() {
      if (over || wood < 1 || brick < 1) { ui.say("Need wood and brick."); return; }
      wood--; brick--; roads++; TK.sfx("place"); paint();
    }
    function buildTown() {
      if (over || roads < 2 || wheat < 1) { ui.say("Need 2 roads and wheat."); return; }
      roads -= 2; wheat--; towns++; TK.sfx("clear");
      if (towns >= 3) { over = true; TK.win(ID, { xp: 12, text: "3" }); ui.say("Three towns. Island settled."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><p>Wood " + wood + " · brick " + brick + " · wheat " + wheat + "</p><p>Roads " + roads + " · towns " + towns + "/3</p></div>";
      ui.meta.textContent = towns + "/3";
    }
    ui.btn("Roll", roll);
    ui.btn("Road", buildRoad);
    ui.btn("Town", buildTown, true);
    ui.tool("New island", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Island Settlers", blurb: "Roads and towns.", mini: "Island", cat: "logic", boot: boot });
})();
