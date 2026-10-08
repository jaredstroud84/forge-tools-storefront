/* Paper Route — deliver papers, dodge obstacles, keep the bike. */
(function () {
  "use strict";
  var ID = "paper";
  if (window.TableKit) TableKit.catalog(ID, "Paper Route", "arcade", "Paperboy — deliver the route.");
  var KEY = "s4.paper";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "") || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Paper Route");
    var state = load();
    state.delivered = state.delivered || 0;
    state.high = state.high || 0;
    var houses, bike, tosses, crashes, over, timer, combo, laneObs;
    function deal() {
      houses = [1, 1, 1, 1, 1, 1, 1];
      laneObs = [0, 0, 0, 0, 0, 0, 0];
      bike = 3; tosses = 8; crashes = 0; combo = 0; over = false;
      clearInterval(timer);
      timer = setInterval(tick, 800);
      paint();
      ui.say("Steer. Toss at a lit house. Avoid the cracks.");
    }
    function tick() {
      if (over) return;
      laneObs = laneObs.map(function () { return Math.random() < 0.18 ? 1 : 0; });
      if (laneObs[bike]) {
        crashes++;
        combo = 0;
        TK.sfx("err");
        ui.say("Crack! Crash " + crashes + "/3.");
        if (crashes >= 3) return end(false);
      }
      var open = houses.map(function (h, i) { return h ? i : -1; }).filter(function (i) { return i >= 0; });
      if (open.length && Math.random() < 0.25) houses[open[0]] = 0;
      paint();
    }
    function end(won) {
      over = true;
      clearInterval(timer);
      if (state.delivered > state.high) state.high = state.delivered;
      save(state);
      if (won) TK.win(ID, { xp: 14, text: state.delivered + "" });
      else TK.lose(ID, { text: state.delivered + "" });
      ui.say(won ? "Route done. " + state.delivered + " papers." : "Wrecked. " + state.delivered + " papers.");
      paint();
    }
    function toss() {
      if (over || !tosses) return;
      tosses--;
      if (houses[bike]) {
        houses[bike] = 0;
        combo++;
        var pts = 1 + Math.floor(combo / 3);
        state.delivered += pts;
        TK.sfx("clear");
        ui.say("Porch! Combo " + combo + ".");
      } else {
        combo = 0;
        crashes++;
        TK.sfx("err");
        ui.say("Missed the porch.");
        if (crashes >= 3) return end(false);
      }
      if (!houses.some(function (h) { return h; })) return end(true);
      save(state);
      paint();
    }
    function steer(d) {
      if (over) return;
      bike = Math.max(0, Math.min(6, bike + d));
      paint();
    }
    function paint() {
      var row = "<div class='tk-row'>";
      for (var i = 0; i < 7; i++) {
        var mark = i === bike ? "🚲" : (houses[i] ? "📰" : (laneObs[i] ? "⚠" : "·"));
        row += "<span class='tk-die" + (i === bike ? " pri" : "") + "'" + (houses[i] ? " style='background:#3d5c3a'" : "") + ">" + mark + "</span>";
      }
      ui.board.innerHTML = "<div class='tk-paper'>" + row + "</div><p>Delivered " + state.delivered + " · tosses " + tosses + " · crashes " + crashes + "/3 · combo " + combo + "</p><p>Best " + state.high + "</p></div>";
      ui.meta.textContent = state.delivered + " papers";
    }
    ui.btn("◀", function () { steer(-1); });
    ui.btn("Toss", toss, true);
    ui.btn("▶", function () { steer(1); });
    ui.tool("New route", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Paper Route", blurb: "Deliver the route.", mini: "Paper", cat: "arcade", boot: boot });
})();
