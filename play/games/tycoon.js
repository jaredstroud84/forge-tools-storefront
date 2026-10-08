/* Capitalist — roll, buy, rent, pass go. */
(function () {
  "use strict";
  var ID = "tycoon";
  if (window.TableKit) TableKit.catalog(ID, "Capitalist", "numbers", "Buy streets. Pass go.");
  var STREETS = ["Oak", "Elm", "Pine", "Maple", "Cedar", "Birch", "Willow", "Ash"];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Capitalist");
    var pos, cash, owned, over;
    function deal() { pos = 0; cash = 200; owned = {}; over = false; paint(); ui.say("Roll. Buy for $80. Own four streets. Rent is $25."); }
    function roll() {
      if (over) return;
      var d = 1 + Math.floor(Math.random() * 6);
      pos = (pos + d) % STREETS.length;
      if (pos === 0) cash += 50;
      var street = STREETS[pos];
      if (owned[street]) ui.say("Your " + street + ". Rolled " + d + ".");
      else { cash -= 25; ui.say("Rent on " + street + ". Rolled " + d + "."); }
      var n = Object.keys(owned).length;
      if (n >= 4) { over = true; TK.win(ID, { xp: 16, text: cash + "" }); ui.say("Four streets."); }
      else if (cash < 0) { over = true; TK.lose(ID, { text: n + "" }); ui.say("Broke."); }
      TK.sfx("tap"); paint();
    }
    function buy() {
      if (over) return;
      var street = STREETS[pos];
      if (owned[street]) { ui.say("Already yours."); return; }
      if (cash < 80) { ui.say("Need $80."); return; }
      cash -= 80; owned[street] = 1; TK.sfx("place");
      if (Object.keys(owned).length >= 4) { over = true; TK.win(ID, { xp: 16, text: cash + "" }); ui.say("Four streets."); }
      paint();
    }
    function paint() {
      var track = STREETS.map(function (s, i) {
        return "<span class='tk-die" + (i === pos ? " pri" : "") + "'>" + (owned[s] ? "🏠" : "") + s + "</span>";
      }).join("");
      ui.board.innerHTML = "<div class='tk-paper'><b>$" + cash + "</b><div class='tk-row'>" + track + "</div><p>Own " + (Object.keys(owned).join(", ") || "none") + "</p></div>";
      ui.meta.textContent = Object.keys(owned).length + "/4";
    }
    ui.btn("Roll", roll);
    ui.btn("Buy $80", buy, true);
    ui.tool("New game", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Capitalist", blurb: "Buy streets.", mini: "Cap", cat: "numbers", boot: boot });
})();
