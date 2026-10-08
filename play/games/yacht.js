/* Yacht Dice — hold, roll twice, score three lines. */
(function () {
  "use strict";
  var ID = "yacht";
  if (window.TableKit) TableKit.catalog(ID, "Yacht Dice", "numbers", "Five dice. Fill the card.");
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Yacht Dice");
    var dice, held, card, rolls, over;
    function deal() {
      dice = [1, 1, 1, 1, 1]; held = {}; card = {}; rolls = 2; over = false;
      roll();
      ui.say("Hold dice. Two rolls, then score a line. 50 wins.");
    }
    function roll() {
      if (over || rolls <= 0) return;
      dice = dice.map(function (d, i) { return held[i] ? d : 1 + Math.floor(Math.random() * 6); });
      rolls--; TK.sfx("tap"); paint();
    }
    function score(kind) {
      if (over || card[kind] != null) return;
      var c = {};
      dice.forEach(function (d) { c[d] = (c[d] || 0) + 1; });
      var pts = 0;
      if (kind === "sum") pts = dice.reduce(function (s, d) { return s + d; }, 0);
      else if (kind === "pair" && Object.keys(c).some(function (k) { return c[k] >= 2; })) pts = 12;
      else if (kind === "kind" && Object.keys(c).some(function (k) { return c[k] >= 3; })) pts = 20;
      else if (kind === "yacht" && Object.keys(c).length === 1) pts = 40;
      card[kind] = pts; held = {}; rolls = 2; TK.sfx("place");
      var total = Object.keys(card).reduce(function (s, k) { return s + card[k]; }, 0);
      if (Object.keys(card).length >= 3) {
        over = true;
        if (total >= 50) TK.win(ID, { xp: 12, text: total + "" });
        else TK.lose(ID, { text: total + "" });
        ui.say(total + ". " + (total >= 50 ? "Card wins." : "Short."));
      } else { ui.say(kind + " scored " + pts + "."); roll(); }
      paint();
    }
    function paint() {
      var total = Object.keys(card).reduce(function (s, k) { return s + card[k]; }, 0);
      ui.board.innerHTML = "<div class='tk-paper'><div class='tk-row'>" + dice.map(function (d, i) {
        return "<button type='button' class='tk-btn" + (held[i] ? " pri" : "") + "' data-i='" + i + "'>" + d + "</button>";
      }).join("") + "</div><p>Rolls " + rolls + "</p><p>Sum " + (card.sum == null ? "—" : card.sum) + " · pair " + (card.pair == null ? "—" : card.pair) + " · three " + (card.kind == null ? "—" : card.kind) + " · yacht " + (card.yacht == null ? "—" : card.yacht) + "</p><p>Total " + total + "</p></div>";
      ui.meta.textContent = total + " pts";
      ui.board.querySelectorAll("[data-i]").forEach(function (b) {
        b.onclick = function () { held[b.dataset.i] = !held[b.dataset.i]; paint(); };
      });
    }
    ui.btn("Roll", roll);
    ui.btn("Sum", function () { score("sum"); });
    ui.btn("Pair", function () { score("pair"); });
    ui.btn("Three", function () { score("kind"); });
    ui.btn("Yacht", function () { score("yacht"); }, true);
    ui.tool("New card", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Yacht Dice", blurb: "Fill the card.", mini: "Yacht", cat: "numbers", boot: boot });
})();
