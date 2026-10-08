/* Zoo Lots — pens, feed, animals, gate. Saves. */
(function () {
  "use strict";
  var ID = "zoo";
  if (window.TableKit) TableKit.catalog(ID, "Zoo Lots", "logic", "Build the zoo.");
  var KEY = "s4.zoo";
  function load() { try { return JSON.parse(localStorage.getItem(KEY) || "") || {}; } catch (e) { return {}; } }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) {} }
  function boot() {
    if (!window.TableKit) return setTimeout(boot, 30);
    var TK = TableKit, ui = TK.mount("Zoo Lots");
    var z = load();
    z.cash = z.cash == null ? 120 : z.cash;
    z.pens = z.pens || 0; z.food = z.food || 0; z.animals = z.animals || 0; z.guests = z.guests || 0;
    var over = false;
    function paint() {
      ui.board.innerHTML = "<div class='tk-paper'><b>$" + z.cash + "</b><p>Pens " + z.pens + " · animals " + z.animals + " · feed " + z.food + "</p><p>Guests " + z.guests + "/40</p></div>";
      ui.meta.textContent = z.guests + " guests";
    }
    function pen() {
      if (over) return;
      if (z.cash < 60) { ui.say("A pen is $60."); return; }
      z.cash -= 60; z.pens++; save(z); TK.sfx("place"); paint();
    }
    function animal() {
      if (over) return;
      if (z.animals >= z.pens) { ui.say("Need another pen."); return; }
      if (z.cash < 40) { ui.say("An animal is $40."); return; }
      z.cash -= 40; z.animals++; save(z); TK.sfx("place"); paint();
    }
    function feed() {
      if (over) return;
      if (z.cash < 15) { ui.say("Feed is $15."); return; }
      z.cash -= 15; z.food++; save(z); paint();
    }
    function open() {
      if (over) return;
      if (!z.animals || z.food < z.animals) { ui.say("Need animals and feed for each."); return; }
      var pay = z.animals * 30;
      z.cash += pay; z.guests += z.animals * 4; z.food -= z.animals; save(z);
      ui.say("Gate $" + pay + ".");
      if (z.guests >= 40) { over = true; TK.win(ID, { xp: 16, text: z.guests + "" }); ui.say("The zoo thrives."); }
      paint();
    }
    ui.btn("Pen $60", pen);
    ui.btn("Animal $40", animal);
    ui.btn("Feed $15", feed);
    ui.btn("Open gate", open, true);
    ui.tool("New zoo", function () {
      z = { cash: 120, pens: 0, food: 0, animals: 0, guests: 0 };
      over = false; save(z); paint();
      ui.say("Pen, animal, feed, open the gate. The zoo saves.");
    });
    paint();
    ui.say("Pen, animal, feed, then open the gate.");
  }
  if (window.Stacked) Stacked.registerGame({ id: ID, title: "Zoo Lots", blurb: "Build the zoo.", mini: "Zoo", cat: "logic", boot: boot });
})();
