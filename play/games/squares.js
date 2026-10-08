/* Night Circuit — cash, upgrades, scaling house. */
(function () {
  "use strict";
  var ID = "squares";
  if (window.TableKit) TableKit.catalog(ID, "Night Circuit", "arcade", "Win cash. Upgrade the car.");
  var KEY = "s4.circuit";
  var COSTS = [0, 50, 120, 220, 360];
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "") || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Night Circuit");
    var car = load();
    car.cash = car.cash || 0; car.engine = car.engine || 1; car.tires = car.tires || 1; car.wins = car.wins || 0;
    var over = false;
    function power() { return car.engine + car.tires; }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><b>$" + car.cash + "</b><p>Wins " + car.wins + " · power " + power() + "</p><p>Engine " + car.engine + "/5 · tires " + car.tires + "/5</p><p>Next engine $" + (COSTS[car.engine] || "—") + " · tires $" + (COSTS[car.tires] || "—") + "</p></div>";
      ui.meta.textContent = "$" + car.cash;
    }
    function race() {
      if (over) return;
      var you = power() + Math.floor(Math.random() * 4);
      var house = 2 + Math.floor(car.wins / 2) + Math.floor(Math.random() * 5);
      var pay = 30 + power() * 15;
      if (you >= house) { car.cash += pay; car.wins++; TK.sfx("clear"); ui.say("Won $" + pay + ". You " + you + ", house " + house + "."); }
      else { TK.sfx("err"); ui.say("House " + house + ". You " + you + "."); }
      save(car);
      if (car.wins >= 8 && car.engine >= 4) { over = true; TK.win(ID, { xp: 16, text: car.cash + "" }); ui.say("Career complete."); }
      paint();
    }
    function buy(part) {
      if (over) return;
      var lv = car[part];
      if (lv >= 5) { ui.say("Maxed."); return; }
      var cost = COSTS[lv];
      if (car.cash < cost) { ui.say("Need $" + cost + "."); return; }
      car.cash -= cost; car[part] = lv + 1; save(car); TK.sfx("place");
      ui.say(part + " is level " + car[part] + ".");
      paint();
    }
    ui.btn("Race", race, true);
    ui.btn("Engine", function () { buy("engine"); });
    ui.btn("Tires", function () { buy("tires"); });
    ui.tool("New career", function () {
      car = { cash: 0, engine: 1, tires: 1, wins: 0 }; over = false; save(car); paint();
      ui.say("Win races. Bank cash. Upgrades cost more each level.");
    });
    paint();
    ui.say("Win the race. Bank the cash.");
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Night Circuit", blurb: "Upgrade the car.", mini: "Race", cat: "arcade", boot: boot });
})();
