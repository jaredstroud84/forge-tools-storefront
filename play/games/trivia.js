/* Trivia Night — ten questions, shuffled, seven to win. */
(function () {
  "use strict";
  var ID = "trivia";
  if (window.TableKit) TableKit.catalog(ID, "Trivia Night", "words", "Ten questions. Seven to win.");
  var BANK = [
    { q: "A dozen is", a: ["12", "10", "14"], ok: 0 },
    { q: "Frozen water", a: ["ice", "sand", "steam"], ok: 0 },
    { q: "A baby cat", a: ["kitten", "calf", "foal"], ok: 0 },
    { q: "Opposite of hot", a: ["cold", "warm", "dry"], ok: 0 },
    { q: "First month", a: ["January", "March", "July"], ok: 0 },
    { q: "A three sided shape", a: ["triangle", "square", "circle"], ok: 0 },
    { q: "Largest ocean", a: ["Pacific", "Atlantic", "Indian"], ok: 0 },
    { q: "Planet we live on", a: ["Earth", "Mars", "Venus"], ok: 0 },
    { q: "Seven days make", a: ["a week", "a month", "a year"], ok: 0 },
    { q: "Red and blue make", a: ["purple", "green", "orange"], ok: 0 },
    { q: "Capital of France", a: ["Paris", "Lyon", "Nice"], ok: 0 },
    { q: "Legs on a spider", a: ["8", "6", "10"], ok: 0 }
  ];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Trivia Night");
    var Q, i, score, over;
    function deal() {
      Q = TK.shuffle(BANK).slice(0, 10).map(function (item) {
        var order = TK.shuffle(item.a.map(function (ans, n) { return { ans: ans, ok: n === item.ok }; }));
        return { q: item.q, a: order.map(function (o) { return o.ans; }), ok: order.findIndex(function (o) { return o.ok; }) };
      });
      i = 0; score = 0; over = false; paint();
      ui.say("Ten questions. Seven to win.");
    }
    function pick(n) {
      if (over) return;
      if (n === Q[i].ok) { score++; TK.sfx("clear"); } else TK.sfx("err");
      i++;
      if (i >= Q.length) {
        over = true;
        if (score >= 7) TK.win(ID, { xp: 14, text: score + "" });
        else TK.lose(ID, { text: score + "" });
        ui.say(score + "/10. " + (score >= 7 ? "You win." : "Need 7."));
      }
      paint();
    }
    function paint() {
      if (over) { ui.board.innerHTML = "<div class='tk-paper'><b style='font-size:1.6em'>" + score + "/10</b></div>"; ui.meta.textContent = score + "/10"; return; }
      var q = Q[i];
      ui.board.innerHTML = "<div class='tk-paper'><b>" + q.q + "</b><p>" + (i + 1) + "/10</p><div class='tk-row' style='flex-direction:column'>" +
        q.a.map(function (a, n) { return "<button type='button' class='tk-btn' data-n='" + n + "'>" + a + "</button>"; }).join("") + "</div></div>";
      ui.meta.textContent = score + " · " + (i + 1) + "/10";
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { pick(+b.dataset.n); }; });
    }
    ui.tool("New night", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Trivia Night", blurb: "Seven of ten.", mini: "Quiz", cat: "words", boot: boot });
})();
