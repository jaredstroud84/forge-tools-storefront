/* City Plot — road, homes, shops, tax. Saves. */
(function () {
  "use strict";
  var ID = "secret";
  if (window.TableKit) TableKit.catalog(ID, "City Plot", "logic", "Build the city.");
  var KEY = "s4.city";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "") || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("City Plot");
    var c = load();
    c.cash = c.cash == null ? 200 : c.cash;
    c.roads = c.roads || 0; c.homes = c.homes || 0; c.shops = c.shops || 0; c.pop = c.pop || 0; c.happy = c.happy || 50;
    var over = false;
    function paint() {
      var blocks = "";
      for (var i = 0; i < 12; i++) {
        var g = i < c.roads ? "🛣" : i < c.roads + c.homes ? "🏠" : i < c.roads + c.homes + c.shops ? "🏪" : "·";
        blocks += "<span class='tk-die'>" + g + "</span>";
      }
      ui.board.innerHTML = "<div class='tk-paper'><b>$" + c.cash + "</b><p>People " + c.pop + " · mood " + c.happy + "</p><div class='tk-row'>" + blocks + "</div></div>";
      ui.meta.textContent = c.pop + " people";
    }
    function check() {
      c.pop = c.homes * 4 + c.shops * 2;
      if (c.pop >= 40 && c.happy >= 40) {
        over = true;
        TK.win(ID, { xp: 16, text: c.pop + "" });
        ui.say("Town thrives. " + c.pop + " people.");
      }
    }
    function tax() {
      if (over) return;
      var gain = c.homes * 12 + c.shops * 22;
      c.cash += gain;
      c.happy = Math.max(0, Math.min(100, c.happy + (c.shops ? 4 : -3)));
      save(c); check();
      ui.say("Tax $" + gain + ".");
      paint();
    }
    function buy(kind, cost) {
      if (over) return;
      if (c.cash < cost) { ui.say("Need $" + cost + "."); return; }
      if (kind === "home" && c.roads < 1) { ui.say("Lay a road first."); return; }
      if (kind === "shop" && c.homes < 2) { ui.say("Need two homes first."); return; }
      c.cash -= cost;
      if (kind === "road") c.roads++;
      else if (kind === "home") c.homes++;
      else c.shops++;
      c.happy = Math.min(100, c.happy + 2);
      save(c); TK.sfx("place"); check(); paint();
    }
    ui.btn("Road $40", function () { buy("road", 40); });
    ui.btn("Home $80", function () { buy("home", 80); });
    ui.btn("Shop $120", function () { buy("shop", 120); });
    ui.btn("Collect tax", tax, true);
    ui.tool("New city", function () {
      c = { cash: 200, roads: 0, homes: 0, shops: 0, pop: 0, happy: 50 };
      over = false; save(c); paint();
      ui.say("Empty plot. Road, homes, shop. 40 people and mood 40 wins.");
    });
    paint();
    ui.say("Empty plot. Road, then homes, then a shop.");
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "City Plot", blurb: "Build the city.", mini: "City", cat: "logic", boot: boot });
})();
