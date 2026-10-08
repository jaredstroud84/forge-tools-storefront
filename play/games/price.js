/* Price Bell — closest without going over. */
(function () {
  "use strict";
  var ID = "price";
  if (window.TableKit) TableKit.catalog(ID, "Price Bell", "numbers", "Closest price, without going over.");
  var ITEMS = [
    { n: "Toaster", p: 24 }, { n: "Lamp", p: 18 }, { n: "Kettle", p: 32 }, { n: "Radio", p: 45 },
    { n: "Chair", p: 55 }, { n: "Vase", p: 38 }, { n: "Fan", p: 27 }, { n: "Clock", p: 41 },
    { n: "Blender", p: 49 }, { n: "Rug", p: 62 }
  ];
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Price Bell");
    var item, bid, over, streak;
    streak = 0;
    function deal() {
      item = ITEMS[Math.floor(Math.random() * ITEMS.length)];
      bid = 8; over = false;
      paint();
      ui.say("Raise the bid. Stay under the price. Streak " + streak + ".");
    }
    function raise(n) { if (over) return; bid += n; paint(); }
    function bell() {
      if (over) return;
      over = true;
      var gap = item.p - bid;
      if (gap >= 0) {
        streak++;
        var bonus = gap <= 3 ? " Tight!" : "";
        TK.win(ID, { xp: 12, text: bid + "" });
        ui.say("Under by $" + gap + ". The " + item.n + " was $" + item.p + "." + bonus);
      } else {
        streak = 0;
        TK.lose(ID, { text: "Over" });
        ui.say("Over by $" + (-gap) + ". The " + item.n + " was $" + item.p + ".");
      }
      paint();
    }
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><b>" + item.n + "</b><p style='font-size:1.6em'>Bid $" + bid + "</p><p>Streak " + streak + "</p></div>";
      ui.meta.textContent = "$" + bid;
    }
    ui.btn("+1", function () { raise(1); });
    ui.btn("+5", function () { raise(5); });
    ui.btn("Bell", bell, true);
    ui.tool("New item", deal);
    deal();
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Price Bell", blurb: "Closest without going over.", mini: "Price", cat: "numbers", boot: boot });
})();
