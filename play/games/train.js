/* Paddle Rally — ball steps, paddle tracks, 8 hits. */
(function () {
  "use strict";
  var ID = "train";
  if (window.TableKit) TableKit.catalog(ID, "Paddle Rally", "arcade", "Pong — paddle rally.");
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Paddle Rally");
    var paddle, ball, dir, hits, over, timer;
    function deal() {
      paddle = 2; ball = 0; dir = 1; hits = 0; over = false;
      clearInterval(timer);
      timer = setInterval(tick, 420);
      paint();
      ui.say("Keep the paddle under the ball. 8 hits.");
    }
    function tick() {
      if (over) return;
      ball += dir;
      if (ball <= 0 || ball >= 4) dir *= -1;
      if (ball === paddle) {
        hits++; TK.sfx("clear");
        if (hits >= 8) { over = true; clearInterval(timer); TK.win(ID, { xp: 12, text: "8" }); ui.say("Rally won."); }
      } else if (Math.abs(ball - paddle) > 1 && Math.random() < 0.45) {
        over = true; clearInterval(timer); TK.lose(ID, { text: hits + "" }); ui.say("Miss. " + hits + " hits.");
      }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-row'>" + [0, 1, 2, 3, 4].map(function (i) {
        var mark = i === ball && i === paddle ? "Hit" : i === ball ? "●" : i === paddle ? "▬" : "";
        return "<span class='tk-die" + (i === ball || i === paddle ? " pri" : "") + "'>" + mark + "</span>";
      }).join("") + "</div><p>Hits " + hits + "/8</p>";
      ui.meta.textContent = hits + "/8";
    }
    ui.btn("◀", function () { if (!over) { paddle = Math.max(0, paddle - 1); paint(); } });
    ui.btn("▶", function () { if (!over) { paddle = Math.min(4, paddle + 1); paint(); } }, true);
    ui.tool("New rally", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Paddle Rally", blurb: "Paddle rally.", mini: "Pong", cat: "arcade", boot: boot });
})();
