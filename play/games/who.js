/* Who Is It — traits, then name the face. */
(function () {
  "use strict";
  var ID = "who";
  if (window.TableKit) TableKit.catalog(ID, "Who Is It", "logic", "Ask a question.");
  var FACES = [
    { n: "Ann", hat: 1, glasses: 0, smile: 1 },
    { n: "Ben", hat: 0, glasses: 1, smile: 0 },
    { n: "Cid", hat: 1, glasses: 1, smile: 1 },
    { n: "Dot", hat: 0, glasses: 0, smile: 0 },
    { n: "Eve", hat: 1, glasses: 0, smile: 0 },
    { n: "Finn", hat: 0, glasses: 1, smile: 1 }
  ];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Who Is It");
    var secret, left, over, asks;
    function deal() {
      secret = FACES[Math.floor(Math.random() * FACES.length)];
      left = FACES.slice(); over = false; asks = 0;
      paint();
      ui.say("Ask hat, glasses, or smile. Then name the face.");
    }
    function ask(key) {
      if (over) return;
      asks++;
      var yes = secret[key];
      left = left.filter(function (f) { return f[key] === yes; });
      TK.sfx("tap");
      ui.say((yes ? "Yes" : "No") + " on " + key + ". " + left.length + " left.");
      paint();
    }
    function guess(n) {
      if (over) return;
      over = true;
      if (n === secret.n) { TK.win(ID, { xp: 12, text: asks + "" }); ui.say(n + ". That is the face."); }
      else { TK.lose(ID, { text: secret.n }); ui.say("It was " + secret.n + "."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><p>Who is it?</p><div class='tk-row'>" + left.map(function (f) {
        return "<button type='button' class='tk-btn' data-n='" + f.n + "'>" + f.n + "</button>";
      }).join("") + "</div></div>";
      ui.meta.textContent = left.length + " left";
      ui.board.querySelectorAll("[data-n]").forEach(function (b) { b.onclick = function () { guess(b.dataset.n); }; });
    }
    ui.btn("Hat?", function () { ask("hat"); });
    ui.btn("Glasses?", function () { ask("glasses"); }, true);
    ui.btn("Smile?", function () { ask("smile"); });
    ui.tool("New faces", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Who Is It", blurb: "Ask, then name.", mini: "Who", cat: "logic", boot: boot });
})();
