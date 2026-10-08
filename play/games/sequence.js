/* Deer Stand — deer shift cover between shots. */
(function () {
  "use strict";
  var ID = "sequence";
  if (window.TableKit) TableKit.catalog(ID, "Deer Stand", "arcade", "Hold the stand.");
  var LABELS = { tree: "🌲", deer: "🦌", brush: "🌿", trail: "〰", down: "✓" };
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Deer Stand");
    var spots, score, shots, over, wind;
    function deal() {
      spots = ["tree", "deer", "brush", "deer", "trail", "brush"];
      score = 0; shots = 5; wind = 0; over = false;
      paint();
      ui.say("Five shots. Deer is 10, a moving one is 15. Wind shifts cover.");
    }
    function shift() {
      var deerAt = spots.indexOf("deer");
      if (deerAt < 0) return;
      var nxt = Math.max(0, Math.min(spots.length - 1, deerAt + (Math.random() < 0.5 ? -1 : 1)));
      if (spots[nxt] !== "down" && spots[nxt] !== "deer") {
        spots[nxt] = "deer";
        spots[deerAt] = "brush";
      }
    }
    function fire(i) {
      if (over || shots <= 0) return;
      shots--;
      wind = Math.random() < 0.3 ? 1 : 0;
      var aim = wind && i > 0 ? i - 1 : i;
      if (spots[aim] === "deer") {
        var pts = wind ? 15 : 10;
        score += pts;
        spots[aim] = "down";
        TK.sfx("clear");
        ui.say((wind ? "Wind helped. " : "Hit. ") + "+" + pts + ".");
      } else ui.say(wind ? "Wind pulled the shot." : "Just " + spots[aim] + ".");
      shift();
      if (score >= 25) { over = true; TK.win(ID, { xp: 12, text: score + "" }); ui.say("Limit reached."); }
      else if (!shots) { over = true; TK.lose(ID, { text: score + "" }); ui.say("Out of shots. " + score + "."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><b>" + score + "</b><p>Shots " + shots + (wind ? " · wind" : "") + "</p><div class='tk-row'>" +
        spots.map(function (s, i) { return "<button type='button' class='tk-btn' data-i='" + i + "'>" + (LABELS[s] || s) + "</button>"; }).join("") + "</div></div>";
      ui.meta.textContent = score + " pts";
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { fire(+b.dataset.i); }; });
    }
    ui.tool("New stand", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Deer Stand", blurb: "Hold the stand.", mini: "Stand", cat: "arcade", boot: boot });
})();
