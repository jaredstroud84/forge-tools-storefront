/* Rummy 500 — sets from a real hand. First to 100. */
(function () {
  "use strict";
  var ID = "rummy";
  if (window.TableKit) TableKit.catalog(ID, "Rummy 500", "cards", "Lay sets. First to 100.");
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Rummy 500");
    var hand, pile, laid, score, over;
    function deal() {
      pile = TK.shuffle(TK.deck());
      hand = pile.splice(0, 7);
      laid = []; score = 0; over = false;
      paint();
      ui.say("Lay a set of three. Ranks score. First to 100.");
    }
    function lay() {
      if (over) return;
      var c = {};
      hand.forEach(function (card) { c[card.r] = (c[card.r] || 0) + 1; });
      var set = Object.keys(c).filter(function (r) { return c[r] >= 3; })[0];
      if (!set) {
        if (pile.length) hand.push(pile.pop());
        ui.say("No set. Drew.");
      } else {
        var left = 3, pts = 0;
        hand = hand.filter(function (card) {
          if (card.r === set && left) { left--; pts += Math.min(10, TK.rankVal(card.r)); laid.push(card); return false; }
          return true;
        });
        score += pts;
        TK.sfx("clear");
        ui.say("Laid three " + set + "s for " + pts + ".");
      }
      if (score >= 100) { over = true; TK.win(ID, { xp: 14, text: score + "" }); ui.say("100."); }
      else if (!hand.length) { over = true; TK.lose(ID, { text: score + "" }); ui.say("Hand empty. " + score + "."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-felt'><p>Score <b>" + score + "</b>/100 · deck " + pile.length + "</p><p>Laid " + laid.map(function (c) { return TK.cardHTML(c); }).join(" ") + "</p><div class='tk-row'>" +
        hand.map(function (c) { return TK.cardHTML(c); }).join("") + "</div></div>";
      ui.meta.textContent = score + "/100";
    }
    ui.btn("Lay or draw", lay, true);
    ui.tool("New hand", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Rummy 500", blurb: "Lay sets. First to 100.", mini: "Rummy", cat: "cards", boot: boot });
})();
