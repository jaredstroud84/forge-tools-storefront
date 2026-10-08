/* Word Tiles — rack, known words, score. */
(function () {
  "use strict";
  var ID = "wordtiles";
  if (window.TableKit) TableKit.catalog(ID, "Word Tiles", "words", "Play a word from the rack.");
  var WORDS = ["table", "late", "tale", "stone", "note", "lean", "lane", "able", "one", "tone", "neat", "lent"];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Word Tiles");
    var rack, score, played, over;
    function deal() {
      rack = "tableone".split(""); score = 0; played = []; over = false;
      paint();
      ui.say("Play a word from the rack. 12 points wins.");
    }
    function play(word) {
      if (over) return;
      word = (word || "").trim().toLowerCase();
      if (played.indexOf(word) >= 0) { ui.say("Already played."); return; }
      if (WORDS.indexOf(word) < 0) { ui.say("Not a word here."); return; }
      var left = rack.slice();
      for (var i = 0; i < word.length; i++) {
        var at = left.indexOf(word[i]);
        if (at < 0) { ui.say("Not on the rack."); return; }
        left.splice(at, 1);
      }
      rack = left; played.push(word); score += word.length; TK.sfx("clear");
      if (score >= 12) { over = true; TK.win(ID, { xp: 12, text: score + "" }); ui.say("Rack played. " + score + "."); }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><p>Rack <b>" + rack.join(" ") + "</b></p><p>Played " + (played.join(" · ") || "none") + "</p><div class='tk-row'><input id='wt' class='tk-btn' placeholder='Word' maxlength='8'><button id='wtGo' class='tk-btn pri' type='button'>Play</button></div></div>";
      ui.meta.textContent = score + "/12";
      document.getElementById("wtGo").onclick = function () {
        var inp = document.getElementById("wt"); play(inp.value); inp.value = "";
      };
      document.getElementById("wt").addEventListener("keydown", function (e) { if (e.key === "Enter") document.getElementById("wtGo").click(); });
    }
    ui.tool("New rack", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Word Tiles", blurb: "Play from the rack.", mini: "Tile", cat: "words", boot: boot });
})();
