/* Pipe Run — side course, coins, pits, flag. Three lives. */
(function () {
  "use strict";
  var ID = "piperun";
  if (window.TableKit) TableKit.catalog(ID, "Pipe Run", "arcade", "Mario style");
  function youName() { return (window.Stacked && Stacked.avatarName) ? Stacked.avatarName() : "You"; }
  var ICONS = { run: "🏃", jump: "⬆", pipe: "🟢", flag: "🚩", coin: "🪙", pit: "🕳" };
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Pipe Run");
    var stage, lives, coins, over, stages;
    function deal() {
      stages = ["run", "coin", "jump", "pit", "pipe", "jump", "coin", "run", "flag"];
      stage = 0; lives = 3; coins = 0; over = false;
      paint();
      ui.say(youName() + " runs it. Run the ground, jump the pit, enter the pipe. Coins are a run.");
    }
    function needOf(s) {
      if (s === "coin") return "run";
      if (s === "pit") return "jump";
      return s;
    }
    function paint() {
      var av = (window.Stacked && Stacked.avatarHTML) ? Stacked.avatarHTML(48) : "";
      var track = stages.map(function (s, i) {
        var mark = i < stage ? "·" : (ICONS[s] || s);
        return "<span class='tk-die" + (i === stage ? " pri" : "") + "'>" + mark + "</span>";
      }).join("");
      ui.board.innerHTML = "<div class='tk-paper'>" + av + "<p><b>" + youName() + "</b> · coins " + coins + " · lives " + lives + "</p><div class='tk-row'>" + track + "</div><p>Now: " + (stages[stage] || "flag") + "</p></div>";
      ui.meta.textContent = (stage + 1) + "/" + stages.length;
    }
    function go(kind) {
      if (over) return;
      var need = needOf(stages[stage]);
      if (need !== kind && !(kind === "run" && stages[stage] === "flag")) {
        lives--;
        TK.sfx("err");
        ui.say("Miss. " + lives + " lives.");
        if (lives <= 0) { over = true; TK.lose(ID, { text: stage + "" }); ui.say("Course failed at " + stages[stage] + "."); }
        paint();
        return;
      }
      if (stages[stage] === "coin") coins++;
      stage++;
      TK.sfx("place");
      if (stage >= stages.length) {
        over = true;
        TK.win(ID, { xp: 14, text: coins + "" });
        ui.say(youName() + " hits the flag. " + coins + " coins.");
      }
      paint();
    }
    ui.btn("Run", function () { go("run"); });
    ui.btn("Jump", function () { go("jump"); }, true);
    ui.btn("Pipe", function () { go("pipe"); });
    ui.tool("New run", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Pipe Run", blurb: "Match the move.", mini: "Pipe", cat: "arcade", boot: boot });
})();
