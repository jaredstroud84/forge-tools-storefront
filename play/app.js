(function () {
  "use strict";
  var games = [];
  var cat = "all";
  var SAVED = { paper: "s4.paper", secret: "s4.secret", squares: "s4.squares", zoo: "s4.zoo" };
  var SWATCH = { arcade: "#d06a2a", logic: "#6b4c8a", numbers: "#e7c56a", words: "#8fbf7a" };
  window.Stacked = {
    avatarName: function () { return localStorage.getItem("s4.name") || "You"; },
    avatarHTML: function (size) {
      var n = (localStorage.getItem("s4.name") || "Y").slice(0, 1).toUpperCase();
      return "<span class='tk-die pri' style='width:" + size + "px;height:" + size + "px;border-radius:50%;font-size:" + Math.round(size / 2) + "px'>" + n + "</span>";
    },
    registerGame: function (g) { games.push(g); },
    home: function () {
      document.getElementById("stage").hidden = true;
      document.getElementById("home").hidden = false;
      render();
    }
  };
  function level() {
    try {
      var p = JSON.parse(localStorage.getItem("s4.profile") || "") || {};
      return 1 + Math.floor((p.xp || 0) / 40);
    } catch (e) { return 1; }
  }
  function saved(id) {
    var key = SAVED[id];
    if (!key) return false;
    try { return !!localStorage.getItem(key); } catch (e) { return false; }
  }
  function cats() {
    var set = { all: 1 };
    games.forEach(function (g) { set[g.cat || "arcade"] = 1; });
    return Object.keys(set);
  }
  function swatch(g) {
    var c = document.createElement("canvas");
    c.width = 160; c.height = 72; c.className = "thumb";
    var ctx = c.getContext("2d");
    var color = SWATCH[g.cat] || "#8c5c35";
    var grd = ctx.createLinearGradient(0, 0, 160, 72);
    grd.addColorStop(0, "#2c1e14"); grd.addColorStop(1, color);
    ctx.fillStyle = grd; ctx.fillRect(0, 0, 160, 72);
    ctx.fillStyle = "#f6efe4"; ctx.font = "700 13px system-ui";
    ctx.fillText(g.mini || g.title, 10, 42);
    return c;
  }
  function render() {
    var q = (document.getElementById("homeSearch").value || "").toLowerCase();
    var filters = document.getElementById("filters");
    filters.innerHTML = cats().map(function (c) {
      return "<button type='button' data-c='" + c + "' class='" + (c === cat ? "on" : "") + "'>" + c + "</button>";
    }).join("");
    filters.querySelectorAll("button").forEach(function (b) {
      b.onclick = function () { cat = b.dataset.c; render(); };
    });
    var grid = document.getElementById("grid");
    grid.innerHTML = "";
    var shown = games.filter(function (g) {
      if (cat !== "all" && g.cat !== cat) return false;
      return !q || (g.title + " " + g.blurb + " " + (g.mini || "")).toLowerCase().indexOf(q) >= 0;
    });
    var count = document.getElementById("shelfCount");
    if (count) count.textContent = shown.length + " games · Lv " + level();
    shown.forEach(function (g) {
      var b = document.createElement("button");
      b.className = "card-g";
      b.type = "button";
      var best = window.TableKit ? TableKit.best(g.id) : 0;
      b.appendChild(swatch(g));
      var title = document.createElement("b");
      title.textContent = g.title;
      var meta = document.createElement("span");
      meta.textContent = g.blurb + (best ? " · best " + best : "") + (saved(g.id) ? " · saved" : "");
      b.appendChild(title);
      b.appendChild(meta);
      b.onclick = function () {
        document.getElementById("home").hidden = true;
        document.getElementById("stage").hidden = false;
        g.boot();
      };
      grid.appendChild(b);
    });
  }
  var PAY = "https://buy.stripe.com/00w14p7JK1XDa4CbNEbsc02?client_reference_id=games";
  var VERIFY = "https://forge-tools-two-three.vercel.app/api/verify";
  function paid() { try { return localStorage.getItem("s4.paid") === "1"; } catch (e) { return false; } }
  function markPaid() { try { localStorage.setItem("s4.paid", "1"); } catch (e) {} }
  function paintPay() {
    var b = document.getElementById("stkPay");
    if (!b) return;
    if (paid()) { b.textContent = "Yours"; b.disabled = true; return; }
    b.textContent = "Pay $4.99";
    b.onclick = function () {
      try { sessionStorage.setItem("s4.pending", "games"); } catch (e) {}
      fetch("/api/checkout?toolId=games").then(function (r) { return r.json(); }).then(function (j) {
        location.assign((j && j.url) || PAY);
      }).catch(function () { location.assign(PAY); });
    };
  }
  function confirmReturn() {
    var p = new URLSearchParams(location.search);
    var sid = p.get("session_id");
    if (!sid) return paintPay();
    fetch(VERIFY + "?session_id=" + encodeURIComponent(sid) + "&tool=games").then(function (r) { return r.json(); }).then(function (j) {
      if (j && j.paid) markPaid();
      paintPay();
      if (window.TableKit && TableKit.toast) TableKit.toast(j && j.paid ? "Paid. Yours." : "Not confirmed.");
    }).catch(function () { paintPay(); });
  }
  function boot() {
    games.forEach(function (g) { g.cat = g.cat || "arcade"; });
    var search = document.getElementById("homeSearch");
    if (search && !search.dataset.bound) { search.dataset.bound = "1"; search.addEventListener("input", render); }
    var home = document.getElementById("home");
    if (home && !document.getElementById("shelfCount")) {
      var n = document.createElement("p");
      n.id = "shelfCount";
      n.className = "meta";
      home.insertBefore(n, document.getElementById("grid"));
    }
    render();
    paintPay();
    confirmReturn();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot);
  else boot();
})();
