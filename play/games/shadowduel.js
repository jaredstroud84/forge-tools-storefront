/* Shadow Duel — strike, block, special. Original cast. */
(function () {
  "use strict";
  var ID = "shadowduel";
  if (window.TableKit) TableKit.catalog(ID, "Shadow Duel", "arcade", "Mortal Kombat style");
  var CAST = ["Ash Kade", "Nyx Vale", "Rook Marsh", "Vesper Quinn", "Quill Dane", "Holt Grey", "Sera Flint", "Bram Cole"];
  function youName() { return (window.Stacked && Stacked.avatarName) ? Stacked.avatarName() : "You"; }
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Shadow Duel");
    var you, foe, pick, opp, over, meter, guard;
    function roster() { return [youName()].concat(CAST); }
    function deal() {
      you = 100; foe = 100; meter = 0; guard = false; over = false;
      pick = youName(); opp = CAST[0];
      paint();
      ui.say("Strike, block, or special. Meter builds the special.");
    }
    function paint() {
      var av = (window.Stacked && Stacked.avatarHTML) ? Stacked.avatarHTML(40) : "";
      ui.board.innerHTML = "<div class='tk-paper'><div class='tk-row'>" + av + "<div><b>" + pick + " vs " + opp + "</b><p>You " + you + " · foe " + foe + " · meter " + meter + "</p></div></div><div class='tk-row'>" +
        roster().map(function (n) { return "<button class='tk-btn" + (n === pick ? " pri" : "") + "' data-n='" + n + "'>" + (n === youName() ? "You" : n.split(" ")[0]) + "</button>"; }).join("") + "</div></div>";
      ui.meta.textContent = you + " vs " + foe;
      ui.board.querySelectorAll("button[data-n]").forEach(function (b) {
        b.onclick = function () {
          if (over) return;
          pick = b.dataset.n;
          opp = pick === youName() ? CAST[0] : CAST[(CAST.indexOf(pick) + 1) % CAST.length];
          paint();
        };
      });
    }
    function hit(kind) {
      if (over) return;
      if (kind === "block") { guard = true; meter = Math.min(100, meter + 8); ui.say("Guard up."); paint(); return; }
      var dmg = kind === "special" ? (meter >= 40 ? 28 : 10) : 14;
      if (kind === "special" && meter >= 40) meter -= 40; else meter = Math.min(100, meter + 12);
      foe -= dmg;
      var back = guard ? 4 : 10 + Math.floor(Math.random() * 6);
      guard = false;
      you -= back;
      TK.sfx("clear");
      if (foe <= 0) { over = true; TK.win(ID, { xp: 16, text: pick }); ui.say(pick + " takes the round."); }
      else if (you <= 0) { over = true; TK.lose(ID, { text: opp }); ui.say(opp + " takes it."); }
      paint();
    }
    ui.btn("Strike", function () { hit("strike"); });
    ui.btn("Block", function () { hit("block"); });
    ui.btn("Special", function () { hit("special"); }, true);
    ui.tool("New round", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Shadow Duel", blurb: "You or an original fighter.", mini: "Duel", cat: "arcade", boot: boot });
})();
