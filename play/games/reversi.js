/* Reversi — 8x8, legal moves only, house plays best flip. */
(function () {
  "use strict";
  var ID = "reversi";
  if (window.TableKit) TableKit.catalog(ID, "Reversi", "logic", "Flip a line.");
  var DIRS = [[0, 1], [0, -1], [1, 0], [-1, 0], [1, 1], [1, -1], [-1, 1], [-1, -1]];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Reversi");
    var g, over;
    function deal() {
      g = [];
      for (var i = 0; i < 64; i++) g.push(0);
      g[27] = g[36] = 2; g[28] = g[35] = 1;
      over = false;
      paint();
      ui.say("You are black. Place to flip a line. Most stones wins.");
    }
    function flips(i, me, opp) {
      if (g[i]) return [];
      var r = i / 8 | 0, c = i % 8, all = [];
      DIRS.forEach(function (d) {
        var rr = r + d[0], cc = c + d[1], line = [];
        while (rr >= 0 && cc >= 0 && rr < 8 && cc < 8 && g[rr * 8 + cc] === opp) {
          line.push(rr * 8 + cc); rr += d[0]; cc += d[1];
        }
        if (line.length && rr >= 0 && cc >= 0 && rr < 8 && cc < 8 && g[rr * 8 + cc] === me) all = all.concat(line);
      });
      return all;
    }
    function moves(me) {
      var opp = me === 1 ? 2 : 1, out = [];
      for (var i = 0; i < 64; i++) if (flips(i, me, opp).length) out.push(i);
      return out;
    }
    function apply(i, me) {
      var opp = me === 1 ? 2 : 1;
      var line = flips(i, me, opp);
      if (!line.length) return 0;
      g[i] = me;
      line.forEach(function (k) { g[k] = me; });
      return line.length;
    }
    function count(me) { return g.filter(function (v) { return v === me; }).length; }
    function finish() {
      over = true;
      var y = count(1), h = count(2);
      if (y > h) { TK.win(ID, { xp: 14, text: y + "" }); ui.say("Board held. " + y + "–" + h + "."); }
      else if (y < h) { TK.lose(ID, { text: y + "" }); ui.say("House holds it. " + y + "–" + h + "."); }
      else { TK.lose(ID, { text: "Draw" }); ui.say("Draw. " + y + "–" + h + "."); }
    }
    function tap(i) {
      if (over) return;
      if (!apply(i, 1)) { ui.say("No flip there."); return; }
      TK.sfx("place");
      var hm = moves(2);
      if (!hm.length && !moves(1).length) return finish();
      if (hm.length) {
        var best = hm[0], bestF = -1;
        hm.forEach(function (m) {
          var n = flips(m, 2, 1).length;
          if (n > bestF) { bestF = n; best = m; }
        });
        apply(best, 2);
      }
      if (!moves(1).length && !moves(2).length) return finish();
      if (!moves(1).length) ui.say("No move. House plays again.");
      paint();
    }
    function paint() {
      var legal = {};
      moves(1).forEach(function (i) { legal[i] = 1; });
      ui.board.innerHTML = "<div class='tk-grid' style='grid-template-columns:repeat(8,1fr)'>" +
        g.map(function (v, i) {
          return "<button type='button' class='tk-btn" + (legal[i] ? " pri" : "") + "' data-i='" + i + "'>" + (v === 1 ? "●" : v === 2 ? "○" : "") + "</button>";
        }).join("") + "</div>";
      ui.meta.textContent = count(1) + "–" + count(2);
      ui.board.querySelectorAll("button").forEach(function (b) { b.onclick = function () { tap(+b.dataset.i); }; });
    }
    ui.tool("New board", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Reversi", blurb: "Flip a line.", mini: "Reversi", cat: "logic", boot: boot });
})();
