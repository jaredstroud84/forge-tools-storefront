/* Everything the dumped games call that the pack did not ship.
   Drop this after kit.js. It patches TableKit and Stacked. */
(function () {
  "use strict";
  window._sn = 0;
  window.J2 = function () {};
  window.MAP = function (id, lane) {
    window._stkMap = window._stkMap || {};
    window._stkMap[id] = lane;
  };

  var KEY = "s4.profile";
  function load() {
    try { return JSON.parse(localStorage.getItem(KEY) || "") || {}; }
    catch (e) { return {}; }
  }
  function save(p) {
    try { localStorage.setItem(KEY, JSON.stringify(p)); } catch (e) {}
  }
  var profile = load();
  profile.xp = profile.xp || 0;
  profile.name = profile.name || localStorage.getItem("s4.name") || "You";
  profile.mute = !!profile.mute;
  profile.streak = profile.streak || 0;
  profile.day = profile.day || "";
  profile.plays = profile.plays || 0;

  function today() {
    var d = new Date();
    return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
  }
  function touchDay() {
    var t = today();
    if (profile.day === t) return;
    var prev = new Date(profile.day || 0);
    var now = new Date();
    var gap = (now - prev) / 86400000;
    profile.streak = gap < 2 && profile.day ? profile.streak + 1 : 1;
    profile.day = t;
    save(profile);
  }
  touchDay();

  function level() { return 1 + Math.floor(profile.xp / 40); }

  if (window.Stacked) {
    var baseName = Stacked.avatarName;
    Stacked.avatarName = function () { return profile.name || (baseName ? baseName() : "You"); };
    Stacked.setName = function (n) {
      profile.name = (n || "You").slice(0, 16);
      localStorage.setItem("s4.name", profile.name);
      save(profile);
    };
  }

  if (window.TableKit && !TableKit.win.__miss) {
    var win = TableKit.win;
    var lose = TableKit.lose;
    var sfx = TableKit.sfx;
    TableKit.sfx = function (kind) {
      if (profile.mute) return;
      return sfx(kind);
    };
    TableKit.win = function (id, meta) {
      var xp = (meta && meta.xp) || 8;
      profile.xp += xp;
      profile.plays++;
      touchDay();
      save(profile);
      paintBar();
      return win.call(this, id, meta);
    };
    TableKit.lose = function (id, meta) {
      profile.plays++;
      save(profile);
      return lose.call(this, id, meta);
    };
    TableKit.win.__miss = true;
    TableKit.xp = function () { return profile.xp; };
    TableKit.level = level;
    TableKit.profile = function () { return profile; };
  }

  var css = document.createElement("style");
  css.textContent = ".tk-hand{display:flex;flex-wrap:wrap;gap:4px}.profile{display:flex;gap:8px;align-items:center;margin:8px 0 4px}.profile input{flex:1;padding:8px 10px;border-radius:10px;border:1px solid #3a2a1c;background:#1c140c;color:#f6efe4}.profile button{border:1px solid #3a2a1c;background:#1c140c;color:#f6efe4;border-radius:10px;padding:8px 10px}";
  document.head.appendChild(css);

  function paintBar() {
    var home = document.getElementById("home");
    if (!home) return;
    var bar = document.getElementById("stkProfile");
    if (!bar) {
      bar = document.createElement("div");
      bar.id = "stkProfile";
      bar.className = "profile";
      bar.innerHTML = "<input id='stkName' maxlength='16' placeholder='Your name'><button type='button' id='stkMute'>Sound</button><span id='stkXp'></span>";
      var search = document.getElementById("homeSearch");
      home.insertBefore(bar, search || home.firstChild);
      document.getElementById("stkName").addEventListener("change", function (e) {
        if (window.Stacked && Stacked.setName) Stacked.setName(e.target.value);
      });
      document.getElementById("stkMute").onclick = function () {
        profile.mute = !profile.mute;
        save(profile);
        paintBar();
      };
    }
    var name = document.getElementById("stkName");
    if (name && document.activeElement !== name) name.value = profile.name;
    document.getElementById("stkMute").textContent = profile.mute ? "Sound off" : "Sound on";
    document.getElementById("stkXp").textContent = "Lv " + level() + " · " + profile.xp + " xp · streak " + profile.streak;
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", paintBar);
  else paintBar();
  setTimeout(paintBar, 300);
})();
