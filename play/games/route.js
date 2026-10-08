/* Cup Pong — clear your rack before the house. */
(function () {
  "use strict";
  var ID = "route";
  if (window.TableKit) TableKit.catalog(ID, "Cup Pong", "arcade", "Clear the cups.");
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Cup Pong");
    var cups, you, house, over, aim;
    function deal() {
      cups = [1, 1, 1, 1, 1, 1];
      you = 0; house = 0; over = false; aim = 0.62;
      paint();
      ui.say("Toss at a cup. Aim rises after a make, falls after a miss.");
    }
    function toss(i) {
      if (over || !cups[i]) return;
      var hit = Math.random() < aim;
      if (hit) {
        cups[i] = 0; you++; aim = Math.min(0.8, aim + 0.04);
        TK.sfx("clear");
        ui.say("Bottom of the cup!");
      } else {
        aim = Math.max(0.35, aim - 0.05);
        ui.say("Rim.");
      }
      if (!over && Math.random() < 0.38) { house++; ui.say("House made a cup."); }
      if (you >= 6) { over = true; TK.win(ID, { xp: 12 }); ui.say("Rack clear."); }
      else if (house >= 6) { over = true; TK.lose(ID, { text: "House" }); ui.say("House cleared their rack."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><div class='tk-row'>" + cups.map(function (c, i) {
        return "<button type='button' class='tk-btn" + (c ? "" : " pri") + "' data-i='" + i + "'>" + (c ? "🥤" : "🏆") + "</button>";
      }).join("") + "</div><p>You " + you + "/6 · House " + house + "/6 · aim " + Math.round(aim * 100) + "%</p></div>";
      ui.meta.textContent = you + "/6";
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { toss(+b.dataset.i); }; });
    }
    ui.tool("New rack", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Cup Pong", blurb: "Clear the cups.", mini: "Cups", cat: "arcade", boot: boot });
})();
