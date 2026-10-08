/* Spin and Solve — wheel, letters, bankrupt. */
(function () {
  "use strict";
  var ID = "wheel";
  if (window.TableKit) TableKit.catalog(ID, "Spin and Solve", "words", "Spin. Fill the word.");
  var WORDS = ["lantern", "harbor", "meadow", "cinder", "pocket", "silver"];
  var WHEEL = [100, 200, 0, 500, 150, 250];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Spin and Solve");
    var word, shown, score, spin, over, used;
    function deal() {
      word = WORDS[Math.floor(Math.random() * WORDS.length)];
      shown = {}; score = 0; spin = 0; over = false; used = {};
      paint();
      ui.say("Spin, then guess a letter.");
    }
    function doSpin() {
      if (over) return;
      spin = WHEEL[Math.floor(Math.random() * WHEEL.length)];
      ui.say(spin ? "Spin $" + spin : "Bankrupt.");
      if (!spin) score = 0;
      paint();
    }
    function guess(ch) {
      if (over || !spin || used[ch]) return;
      used[ch] = 1;
      if (word.indexOf(ch) < 0) { ui.say("No " + ch); spin = 0; paint(); return; }
      var n = word.split("").filter(function (c) { return c === ch; }).length;
      shown[ch] = 1; score += spin * n; TK.sfx("clear"); spin = 0;
      if (word.split("").every(function (c) { return shown[c]; })) {
        over = true; TK.win(ID, { xp: 14, text: score + "" }); ui.say(word);
      }
      paint();
    }
    function paint() {
      var shownWord = word.split("").map(function (c) { return shown[c] ? c : "_"; }).join(" ");
      ui.board.innerHTML = "<div class='tk-paper'><b style='font-size:1.4em;letter-spacing:2px'>" + shownWord + "</b><p>Spin $" + spin + " · $" + score + "</p><div class='tk-row'>" +
        "aeiourstln".split("").map(function (ch) {
          return "<button type='button' class='tk-btn" + (used[ch] ? " pri" : "") + "' data-c='" + ch + "'>" + ch + "</button>";
        }).join("") + "</div></div>";
      ui.meta.textContent = "$" + score;
      ui.board.querySelectorAll("[data-c]").forEach(function (b) { b.onclick = function () { guess(b.dataset.c); }; });
    }
    ui.btn("Spin", doSpin, true);
    ui.tool("New word", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Spin and Solve", blurb: "Fill the word.", mini: "Spin", cat: "words", boot: boot });
})();
