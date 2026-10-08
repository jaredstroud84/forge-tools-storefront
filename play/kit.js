/* Stacked kit — mount, catalog, deck, sfx, scores. */
(function () {
  "use strict";
  var catalog = [];
  var scores = {};
  try { scores = JSON.parse(localStorage.getItem("s4.scores") || "{}") || {}; } catch (e) { scores = {}; }

  function persist() {
    try { localStorage.setItem("s4.scores", JSON.stringify(scores)); } catch (e) {}
  }

  function sfx(kind) {
    try {
      var ctx = window._stkAudio || (window._stkAudio = new (window.AudioContext || window.webkitAudioContext)());
      if (ctx.state === "suspended") ctx.resume();
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      var map = { clear: 660, place: 440, tap: 320, err: 180, win: 880 };
      o.frequency.value = map[kind] || 400;
      o.type = kind === "err" ? "sawtooth" : "square";
      g.gain.setValueAtTime(0.04, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
      o.start(); o.stop(ctx.currentTime + 0.13);
      if (navigator.vibrate && kind === "err") navigator.vibrate(12);
    } catch (e) {}
  }

  function toast(text) {
    var n = document.querySelector(".stk-toast");
    if (!n) {
      n = document.createElement("div");
      n.className = "stk-toast";
      n.style.cssText = "position:fixed;bottom:22px;left:50%;transform:translateX(-50%);background:#1c140c;color:#f6efe4;padding:10px 18px;border-radius:999px;font:600 14px/1.2 system-ui;z-index:99;opacity:0;transition:opacity .25s;pointer-events:none;border:1px solid #e7c56a";
      document.body.appendChild(n);
    }
    n.textContent = text;
    n.style.opacity = "1";
    clearTimeout(n._t);
    n._t = setTimeout(function () { n.style.opacity = "0"; }, 1400);
  }

  function mount(title) {
    var root = document.getElementById("stage");
    root.innerHTML = "";
    var head = document.createElement("div");
    head.className = "stage-head";
    head.innerHTML = "<button type='button' class='back' id='stkBack'>←</button><h2>" + title + "</h2><span class='meta' id='stkMeta'></span>";
    var say = document.createElement("p");
    say.className = "say";
    say.id = "stkSay";
    var board = document.createElement("div");
    board.className = "board";
    board.id = "stkBoard";
    var tools = document.createElement("div");
    tools.className = "tools";
    var actions = document.createElement("div");
    actions.className = "actions";
    root.appendChild(head);
    root.appendChild(say);
    root.appendChild(board);
    root.appendChild(actions);
    root.appendChild(tools);
    document.getElementById("stkBack").onclick = function () {
      if (window.Stacked && Stacked.home) Stacked.home();
    };
    return {
      board: board,
      meta: head.querySelector(".meta"),
      say: function (t) { say.textContent = t; },
      btn: function (label, fn, pri) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "tk-btn" + (pri ? " pri" : "");
        b.textContent = label;
        b.onclick = fn;
        actions.appendChild(b);
        return b;
      },
      tool: function (label, fn) {
        var b = document.createElement("button");
        b.type = "button";
        b.className = "tk-btn ghost";
        b.textContent = label;
        b.onclick = fn;
        tools.appendChild(b);
        return b;
      }
    };
  }

  function deck() {
    var suits = ["♠", "♥", "♦", "♣"];
    var ranks = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];
    var d = [];
    suits.forEach(function (s) {
      ranks.forEach(function (r) { d.push({ s: s, r: r, red: s === "♥" || s === "♦" }); });
    });
    return d;
  }
  function shuffle(a) {
    var arr = a.slice();
    for (var i = arr.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = arr[i]; arr[i] = arr[j]; arr[j] = t;
    }
    return arr;
  }
  function rankVal(r) {
    if (r === "A") return 1;
    if (r === "J" || r === "Q" || r === "K") return 10;
    return +r || 0;
  }
  function cardHTML(c) {
    if (!c) return "";
    return "<span class='card" + (c.red ? " red" : "") + "'>" + c.r + c.s + "</span>";
  }

  window.TableKit = {
    catalog: function (id, title, cat, blurb) {
      catalog.push({ id: id, title: title, cat: cat, blurb: blurb });
    },
    list: function () { return catalog.slice(); },
    mount: mount,
    sfx: sfx,
    toast: toast,
    deck: deck,
    shuffle: shuffle,
    rankVal: rankVal,
    cardHTML: cardHTML,
    best: function (id) { return (scores[id] && scores[id].best) || 0; },
    win: function (id, meta) {
      scores[id] = scores[id] || { wins: 0, best: 0 };
      scores[id].wins++;
      var n = meta && meta.text ? parseInt(meta.text, 10) : 0;
      if (!isNaN(n) && n > scores[id].best) scores[id].best = n;
      persist();
      sfx("win");
      toast((meta && meta.text) ? "Won · " + meta.text : "Won");
      if (navigator.vibrate) navigator.vibrate(18);
      return scores[id];
    },
    lose: function (id, meta) {
      scores[id] = scores[id] || { wins: 0, best: 0 };
      scores[id].losses = (scores[id].losses || 0) + 1;
      persist();
      sfx("err");
      toast((meta && meta.text) ? "Lost · " + meta.text : "Lost");
      return scores[id];
    }
  };
})();
