/* Stacked 2D engine — completed from the cut paste. */
(function () {
  "use strict";
  var reducedMotion = !!(window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches);
  var C = { ink: "#f6efe4", gold: "#e7c56a", ok: "#8fbf7a", ember: "#d06a2a" };
  var S = { id: "", board: null, canvas: null, ctx: null, dpr: 1, w: 0, h: 0, view: { text: "", lower: "", numbers: [], buttons: [] }, particles: [], flashes: [], sceneTimer: 0 };
  var ALIAS = { paperroute:"paper", piperun:"piperun", pricebell:"price", reversi:"reversi", worldconquest:"risk", cuppong:"route", numbertiles:"rummikub", rummy500:"rummy", cityplot:"secret", deerstand:"sequence", islandsettlers:"settlers", shadowduel:"shadowduel", shelfmatch:"shelfmatch", shelfsearch:"shelfsearch", darts:"skiprun", slidingpuzzle:"slide", colorsort:"sort", spotthedifference:"spot", nightcircuit:"squares", tictactoe:"tictac", paddlerally:"train", triplematch:"triplematch", trivianight:"trivia", capitalist:"tycoon", spinandsolve:"wheel", whoisit:"who", wordtiles:"wordtiles", yachtdice:"yacht", zoolots:"zoo" };

  function css() {
    if (document.getElementById("stk-engine-css")) return;
    var s = document.createElement("style");
    s.id = "stk-engine-css";
    s.textContent = "#stkBoard.stk-canvas-mode{position:relative;min-height:260px}#stkBoard.stk-canvas-mode canvas.stk-stage{position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:2}#stkBoard.stk-canvas-mode button,#stkBoard.stk-canvas-mode input{position:relative;z-index:4;background:transparent;color:transparent;border-color:transparent}";
    document.head.appendChild(s);
  }
  function roundRect(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r || 0, w / 2, h / 2));
    ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r); ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
  }
  function drawDropShadow(ctx, x, y, w, h) { ctx.save(); ctx.globalAlpha = 0.28; ctx.fillStyle = "#0a0604"; ctx.fillRect(x + 3, y + 4, w, h); ctx.restore(); }
  function drawBeveledRect(ctx, x, y, w, h, r, color) { ctx.fillStyle = color; roundRect(ctx, x, y, w, h, r); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,.16)"; roundRect(ctx, x + 1, y + 1, Math.max(1, w - 2), Math.max(1, h * 0.35), r); ctx.fill(); }
  function drawMetal(ctx, x, y, w, h, kind) {
    var g = ctx.createLinearGradient(x, y, x, y + h);
    g.addColorStop(0, kind === "steel" ? "#d0d0d0" : "#d4b04a");
    g.addColorStop(1, kind === "steel" ? "#6a6a6a" : "#8c6d20");
    ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  }
  function drawCardFace(ctx, x, y, w, h, rank, suit) {
    ctx.fillStyle = "#fefefe"; roundRect(ctx, x, y, w, h, 8); ctx.fill(); ctx.strokeStyle = "#ccc"; ctx.stroke();
    ctx.fillStyle = (suit === "♥" || suit === "♦") ? "#c41e3a" : "#1a1a2e";
    ctx.font = "700 16px system-ui"; ctx.textAlign = "left"; ctx.fillText(String(rank) + String(suit), x + 6, y + 22);
  }
  function drawBase(ctx, w, h, material) {
    var g = ctx.createLinearGradient(0, 0, w, h);
    var map = { felt: ["#3e6142", "#1d3823"], wood: ["#8c5c35", "#4a2f18"], darkWood: ["#6d4a2b", "#2a180c"], paper: ["#d9cdb8", "#c4b49a"], glass: ["#2a2a35", "#14141c"], asphalt: ["#24262b", "#140e0a"], stone: ["#9a9a9a", "#5c5c5c"], metal: ["#bcbcbc", "#5a5a5a"] };
    var pair = map[material] || map.wood;
    g.addColorStop(0, pair[0]); g.addColorStop(1, pair[1]);
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
  }
  function spawnParticles(type, x, y, n) {
    if (reducedMotion) return;
    for (var i = 0; i < (n || 8) && S.particles.length < 140; i++) S.particles.push({ x: x, y: y, vx: (Math.random() - 0.5) * 180, vy: -50 - Math.random() * 140, life: 0, ttl: 0.8, c: type === "spark" ? "#fff" : C.gold });
  }
  function addFlash(x, y) { S.flashes.push({ x: x, y: y, t: 0 }); }
  function parseView(board) {
    var text = board.innerText || "";
    return { text: text, lower: text.toLowerCase(), numbers: (text.match(/-?\d+/g) || []).map(Number), buttons: Array.prototype.map.call(board.querySelectorAll("button"), function (b) { return { text: (b.innerText || "").trim(), pri: b.className.indexOf("pri") >= 0 }; }) };
  }
  function slug(title) {
    var raw = String(title || "").replace(/[^a-zA-Z0-9]+/g, "").toLowerCase();
    if (ALIAS[raw]) return ALIAS[raw];
    var ids = Object.keys(SCENES);
    for (var i = 0; i < ids.length; i++) if (raw.indexOf(ids[i]) >= 0) return ids[i];
    return "";
  }

  function drawPaperScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "paper");
    ctx.fillStyle = "#7eb8da"; ctx.fillRect(0, 0, w, h * 0.42);
    ctx.fillStyle = "#4c5548"; ctx.fillRect(0, h * 0.62, w, h * 0.38);
    for (var i = 0; i < 7; i++) {
      var x = 8 + i * ((w - 16) / 7);
      ctx.fillStyle = V.buttons[i] && V.buttons[i].pri ? "#e7c56a" : "#7a5c48";
      ctx.fillRect(x, h * 0.32, 26, 36);
      ctx.fillStyle = "#4a2f18"; ctx.beginPath(); ctx.moveTo(x - 3, h * 0.32); ctx.lineTo(x + 13, h * 0.24); ctx.lineTo(x + 29, h * 0.32); ctx.fill();
    }
    ctx.fillStyle = C.ember; ctx.beginPath(); ctx.arc(24 + (V.numbers[0] || 3) * 28, h * 0.72, 8, 0, 6.28); ctx.fill();
  }
  function drawPiperunScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "paper");
    var sky = ctx.createLinearGradient(0, 0, 0, h * 0.5); sky.addColorStop(0, "#87ceeb"); sky.addColorStop(1, "#c8e8f8");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.5);
    ctx.fillStyle = "#8fbf7a"; ctx.beginPath(); ctx.moveTo(0, h * 0.45);
    for (var i = 0; i < 6; i++) ctx.lineTo(w * i / 5, h * (0.35 + Math.sin(i * 1.2) * 0.08));
    ctx.lineTo(w, h * 0.5); ctx.fill();
    ctx.fillStyle = "#6d4a2b"; ctx.fillRect(0, h * 0.6, w, h * 0.4);
    var pipeX = w * 0.5, pipeW = 34, pipeH = h * 0.22;
    ctx.fillStyle = "#4a8c3f"; roundRect(ctx, pipeX, h * 0.36, pipeW, pipeH, 6); ctx.fill();
    var coinPulse = 1 + Math.sin(S.sceneTimer * 3) * 0.08;
    ctx.fillStyle = "#e7c56a"; ctx.beginPath(); ctx.arc(pipeX + 60, h * 0.4, 12 * coinPulse, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#c9a040"; ctx.beginPath(); ctx.arc(pipeX + 58, h * 0.38, 3, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#d9cdb8"; ctx.fillRect(w * 0.82, h * 0.25, 4, h * 0.35);
    var flagWave = Math.sin(S.sceneTimer * 4) * 4;
    ctx.fillStyle = "#d06a2a"; ctx.beginPath(); ctx.moveTo(w * 0.82 + 4, h * 0.25); ctx.lineTo(w * 0.82 + 35 + flagWave, h * 0.32); ctx.lineTo(w * 0.82 + 4, h * 0.38); ctx.fill();
    var ax = w * 0.25, ay = h * 0.62, runBounce = Math.abs(Math.sin(S.sceneTimer * 8)) * 5, legPhase = S.sceneTimer * 10;
    ctx.fillStyle = "rgba(0,0,0,.3)"; ctx.beginPath(); ctx.ellipse(ax, ay + 12, 12, 3, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = C.ok; ctx.beginPath(); ctx.arc(ax, ay - 15 - runBounce, 14, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#3a6b8c"; ctx.fillRect(ax - 8, ay - 8 - runBounce, 16, 18);
    ctx.fillStyle = "#2a4a6c";
    ctx.fillRect(ax - 6, ay + 8 - runBounce, 5, 10 + Math.sin(legPhase) * 4);
    ctx.fillRect(ax + 1, ay + 8 - runBounce, 5, 10 + Math.sin(legPhase + Math.PI) * 4);
    if (!reducedMotion && V.lower.indexOf("stage") >= 0) {
      ctx.strokeStyle = "rgba(231,197,106," + (0.3 + Math.sin(S.sceneTimer * 4) * 0.2) + ")";
      ctx.lineWidth = 3; ctx.setLineDash([6, 4]); ctx.strokeRect(pipeX - 6, h * 0.32, pipeW + 12, pipeH + 10); ctx.setLineDash([]);
    }
  }
  function drawPriceScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "wood");
    var spot = ctx.createRadialGradient(w * 0.5, h * 0.2, 10, w * 0.5, h * 0.5, w * 0.6);
    spot.addColorStop(0, "rgba(255,240,210,.2)"); spot.addColorStop(1, "rgba(0,0,0,.55)");
    ctx.fillStyle = spot; ctx.fillRect(0, 0, w, h);
    var plinthX = w * 0.2, plinthY = h * 0.5, plinthW = w * 0.25, plinthH = h * 0.2;
    drawBeveledRect(ctx, plinthX, plinthY, plinthW, plinthH, 4, "#8c5c35");
    ctx.fillStyle = "#6b4c8a"; ctx.beginPath(); ctx.ellipse(w * 0.32, plinthY - 2, plinthW * 0.45, 8, 0, Math.PI, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#e8d8b0"; ctx.beginPath(); ctx.moveTo(w * 0.28, plinthY - 5); ctx.lineTo(w * 0.36, plinthY - 60); ctx.lineTo(w * 0.32, plinthY - 70); ctx.lineTo(w * 0.3, plinthY - 55); ctx.closePath(); ctx.fill();
    var plateX = w * 0.55, plateY = h * 0.45, plateW = w * 0.35, plateH = 42;
    drawMetal(ctx, plateX, plateY, plateW, plateH, "brass");
    ctx.fillStyle = "#140e0a"; ctx.font = "700 22px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle";
    ctx.fillText(V.numbers[0] != null ? "$" + V.numbers[0] : "???", plateX + plateW / 2, plateY + plateH / 2);
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  function drawReversiScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "wood");
    var size = Math.min(w, h) * 0.78, x0 = (w - size) / 2, y0 = (h - size) / 2, cell = size / 8;
    drawBeveledRect(ctx, x0, y0, size, size, 8, "#6d4a2b");
    ctx.strokeStyle = "rgba(0,0,0,.3)";
    for (var i = 0; i <= 8; i++) { ctx.beginPath(); ctx.moveTo(x0 + i * cell, y0); ctx.lineTo(x0 + i * cell, y0 + size); ctx.moveTo(x0, y0 + i * cell); ctx.lineTo(x0 + size, y0 + i * cell); ctx.stroke(); }
    var discs = V.buttons.filter(function (b) { return b.text === "●" || b.text === "○"; });
    (discs.length ? discs : [{ text: "●" }, { text: "○" }, { text: "●" }, { text: "○" }]).slice(0, 16).forEach(function (b, i) {
      var dx = x0 + (i % 4) * cell * 2 + cell * 0.5, dy = y0 + ((i / 4) | 0) * cell * 2 + cell * 0.5;
      ctx.beginPath(); ctx.arc(dx, dy, cell * 0.32, 0, 6.28); ctx.fillStyle = b.text === "○" ? "#f4f4f4" : "#111"; ctx.fill();
    });
  }
  function drawRiskScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "paper");
    [{ x: 0.18, y: 0.25, rw: 0.22, rh: 0.18, color: "#8fbf7a", name: "Plains" }, { x: 0.55, y: 0.18, rw: 0.2, rh: 0.16, color: "#d06a2a", name: "Hills" }, { x: 0.38, y: 0.5, rw: 0.24, rh: 0.2, color: "#6b4c8a", name: "Marsh" }, { x: 0.7, y: 0.55, rw: 0.22, rh: 0.18, color: "#e7c56a", name: "Forest" }, { x: 0.15, y: 0.7, rw: 0.25, rh: 0.2, color: "#3a6b8c", name: "Tundra" }].forEach(function (t, i) {
      var tx = w * t.x, ty = h * t.y, tw = w * t.rw, th = h * t.rh;
      ctx.fillStyle = t.color; ctx.beginPath(); ctx.ellipse(tx + tw / 2, ty + th / 2, tw / 2, th / 2, 0, 0, 6.28); ctx.fill();
      ctx.fillStyle = "#140e0a"; ctx.font = "700 11px system-ui"; ctx.textAlign = "center"; ctx.fillText(t.name, tx + tw / 2, ty + th / 2);
      ctx.fillStyle = "#f6efe4"; ctx.beginPath(); ctx.arc(tx + tw * 0.4, ty + th * 0.65, 3.5, 0, 6.28); ctx.fill();
    });
    ctx.textAlign = "left";
  }
  function drawRouteScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "wood");
    var positions = [], cupW = 34, cupH = 30, startX = w / 2 - cupW, startY = h * 0.65;
    for (var row = 0; row < 3; row++) for (var c = 0; c <= row; c++) positions.push({ x: startX + c * cupW - row * cupW / 2, y: startY - row * cupH });
    positions.forEach(function (p) {
      ctx.fillStyle = "#e74c3c"; ctx.beginPath(); ctx.moveTo(p.x + 3, p.y); ctx.lineTo(p.x + cupW - 9, p.y); ctx.lineTo(p.x + cupW - 12, p.y + cupH); ctx.lineTo(p.x, p.y + cupH); ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(231,197,106,.85)"; ctx.fillRect(p.x + 1, p.y + cupH * 0.6, cupW - 8, cupH * 0.3);
    });
    if (V.lower.indexOf("make") >= 0 || V.lower.indexOf("hit") >= 0) spawnParticles("sparkle", positions[0].x, positions[0].y, 12);
    if (V.lower.indexOf("miss") >= 0) spawnParticles("debris", positions[0].x, positions[0].y, 6);
  }
  function drawRummikubScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "darkWood");
    ctx.strokeStyle = "#5c3a1e"; ctx.lineWidth = 6; ctx.strokeRect(8, 8, w - 16, h - 16);
    var count = Math.min((V.numbers.length * 2) || 10, 16);
    for (var i = 0; i < count; i++) {
      var x = 16 + (i % 4) * 48, y = 20 + ((i / 4) | 0) * 44, val = V.numbers[i] || (i + 1);
      ctx.fillStyle = "#f8f0e0"; roundRect(ctx, x, y, 42, 38, 4); ctx.fill();
      ctx.fillStyle = val > 7 ? "#c41e3a" : "#1a1a2e"; ctx.font = "700 18px system-ui"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(val, x + 21, y + 19);
    }
    ctx.textAlign = "left"; ctx.textBaseline = "alphabetic";
  }
  function drawRummyScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "felt");
    var cards = [{ rank: "A", suit: "♥" }, { rank: "K", suit: "♠" }, { rank: "7", suit: "♦" }, { rank: "3", suit: "♣" }];
    cards.forEach(function (card, i) { drawCardFace(ctx, 24 + i * 34, h * 0.28, 56, 78, card.rank, card.suit); });
    ctx.fillStyle = C.ink; ctx.fillText("Score " + (V.numbers[0] || 0), 16, h * 0.85);
  }
  function drawSecretScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "paper");
    var sky = ctx.createLinearGradient(0, 0, 0, h * 0.55); sky.addColorStop(0, "#2a1840"); sky.addColorStop(1, "#d06a2a");
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h * 0.55);
    ctx.fillStyle = "#4a4a4a"; ctx.fillRect(0, h * 0.55, w, h * 0.45);
    for (var i = 0; i < 5; i++) { var hx = 15 + i * (w / 5); ctx.fillStyle = "#5c4a3a"; ctx.fillRect(hx, h * 0.4, 35, 45); ctx.fillStyle = "#ffe8a0"; ctx.fillRect(hx + 12, h * 0.44, 8, 8); }
  }
  function drawSequenceScene(ctx, w, h) {
    drawBase(ctx, w, h, "felt");
    ctx.fillStyle = "#1a301a"; ctx.fillRect(0, 0, w, h * 0.5);
    ctx.fillStyle = "#2d4a30"; ctx.fillRect(0, h * 0.55, w, h * 0.45);
    ctx.fillStyle = "#1a2018"; ctx.beginPath(); ctx.ellipse(w * 0.64, h * 0.5, 24, 10, 0, 0, 6.28); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,.35)"; ctx.beginPath(); ctx.moveTo(w * 0.5, h * 0.2); ctx.lineTo(w * 0.5, h * 0.62); ctx.moveTo(w * 0.3, h * 0.4); ctx.lineTo(w * 0.7, h * 0.4); ctx.stroke();
  }
  function drawSettlersScene(ctx, w, h) {
    drawBase(ctx, w, h, "wood");
    ctx.fillStyle = "#2a5a8c"; ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "#e7c56a"; ctx.beginPath(); ctx.ellipse(w / 2, h * 0.5, w * 0.3, h * 0.26, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#8fbf7a"; ctx.beginPath(); ctx.arc(w * 0.42, h * 0.46, 14, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#4a2f18"; ctx.fillRect(w * 0.55, h * 0.42, 16, 12);
  }
  function drawShadowduelScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "asphalt");
    ctx.fillStyle = "#1a1a2e"; ctx.beginPath(); ctx.ellipse(w * 0.22, h * 0.52, 22, 34, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#3a1a1a"; ctx.beginPath(); ctx.ellipse(w * 0.78, h * 0.52, 22, 34, 0, 0, 6.28); ctx.fill();
    ctx.fillStyle = "#8fbf7a"; ctx.fillRect(16, 22, Math.min(120, V.numbers[0] || 50), 10); ctx.fillRect(w - 136, 22, Math.min(120, V.numbers[1] || 50), 10);
    if (V.lower.indexOf("hit") >= 0) { addFlash(w / 2, h / 2); spawnParticles("spark", w / 2, h / 2, 16); }
  }
  function drawShelfScene(ctx, w, h) {
    drawBase(ctx, w, h, "wood");
    var colors = ["#d06a2a", "#6b4c8a", "#8fbf7a", "#e7c56a", "#c41e3a", "#3a6b8c"];
    for (var row = 0; row < 3; row++) {
      ctx.fillStyle = "#6d4a2b"; ctx.fillRect(0, 36 + row * 72, w, 10);
      for (var col = 0; col < 5; col++) { ctx.fillStyle = colors[(row + col) % 6]; roundRect(ctx, 12 + col * 62, 46 + row * 72, 40, 34, 4); ctx.fill(); }
    }
    if (S.id === "shelfsearch") { ctx.fillStyle = C.ink; ctx.font = "700 14px system-ui"; ctx.textAlign = "center"; ctx.fillText("Find the item", w / 2, 22); ctx.textAlign = "left"; }
  }
  function drawSkiprunScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "wood");
    var cx = w / 2, cy = h * 0.42, r = Math.min(w, h) * 0.3;
    for (var i = 0; i < 20; i++) { ctx.beginPath(); ctx.moveTo(cx, cy); ctx.arc(cx, cy, r, i * Math.PI / 10, (i + 1) * Math.PI / 10); ctx.closePath(); ctx.fillStyle = i % 2 ? "#f6efe4" : "#1a1a1a"; ctx.fill(); }
    ctx.fillStyle = "#c41e3a"; ctx.beginPath(); ctx.arc(cx, cy, r * 0.12, 0, 6.28); ctx.fill();
    var dartX = cx + ((V.numbers[0] || 12) - 10) * 3, dartY = cy - 20;
    ctx.strokeStyle = "#c0c0c0"; ctx.beginPath(); ctx.moveTo(dartX, dartY); ctx.lineTo(dartX - 16, dartY - 22); ctx.stroke();
    ctx.fillStyle = "#c41e3a"; ctx.beginPath(); ctx.moveTo(dartX - 16, dartY - 22); ctx.lineTo(dartX - 24, dartY - 32); ctx.lineTo(dartX - 8, dartY - 34); ctx.fill();
  }
  function drawSlideScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "darkWood");
    var labels = V.buttons.map(function (b) { return b.text; });
    for (var i = 0; i < 9; i++) {
      var x = 18 + (i % 3) * 74, y = 28 + ((i / 3) | 0) * 74;
      if (!labels[i]) { ctx.fillStyle = "rgba(0,0,0,.5)"; roundRect(ctx, x, y, 66, 66, 6); ctx.fill(); continue; }
      drawBeveledRect(ctx, x, y, 66, 66, 6, "#e8dcc8");
      ctx.fillStyle = "#1a1a2e"; ctx.font = "700 20px system-ui"; ctx.textAlign = "center"; ctx.fillText(labels[i], x + 33, y + 40);
    }
    ctx.textAlign = "left";
  }
  function drawSortScene(ctx, w, h) {
    drawBase(ctx, w, h, "glass");
    ["#d06a2a", "#3a6b8c", "#8fbf7a", "#e7c56a"].forEach(function (c, i) {
      var x = 28 + i * 70; ctx.strokeStyle = "rgba(255,255,255,.4)"; roundRect(ctx, x, 36, 42, 140, 10); ctx.stroke();
      ctx.fillStyle = c; ctx.fillRect(x + 4, 96, 34, 74);
    });
  }
  function drawSpotScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "paper");
    var fw = w * 0.4, fh = h * 0.46, fy = h * 0.2, leftX = w / 2 - fw - 10, rightX = w / 2 + 10;
    [leftX, rightX].forEach(function (x) {
      drawDropShadow(ctx, x, fy, fw, fh);
      ctx.fillStyle = "#fefefe"; roundRect(ctx, x, fy, fw, fh, 8); ctx.fill();
      ctx.strokeStyle = "#3a2a1c"; ctx.stroke();
      ctx.fillStyle = "#87ceeb"; ctx.fillRect(x + 6, fy + 6, fw - 12, fh * 0.35);
      ctx.fillStyle = "#8fbf7a"; ctx.fillRect(x + 6, fy + fh * 0.42, fw - 12, fh * 0.4);
      ctx.fillStyle = "#d9cdb8"; ctx.fillRect(x + fw * 0.3, fy + fh * 0.25, fw * 0.15, fh * 0.2);
    });
    ctx.fillStyle = "#c41e3a"; ctx.fillRect(rightX + fw * 0.4, fy + fh * 0.5, 5, 5);
    if (V.lower.indexOf("check") >= 0 || V.lower.indexOf("found") >= 0 || V.lower.indexOf("✓") >= 0) {
      ctx.strokeStyle = C.gold; ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(rightX + fw * 0.42, fy + fh * 0.52, 8, 0, 6.28); ctx.stroke();
      spawnParticles("sparkle", rightX + fw * 0.42, fy + fh * 0.52, 10);
    }
  }
  function drawSquaresScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "asphalt");
    ctx.fillStyle = "#3a6b8c"; roundRect(ctx, w * 0.28, h * 0.46, 130, 42, 8); ctx.fill();
    ctx.fillStyle = "#e7c56a"; ctx.fillRect(w * 0.34, h * 0.38, 64, 18);
    ctx.fillStyle = C.ink; ctx.font = "700 16px system-ui"; ctx.fillText("$" + (V.numbers[0] || 0), 16, 28);
  }
  function drawTictacScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "stone");
    var size = Math.min(w, h) * 0.7, x0 = (w - size) / 2, y0 = (h - size) / 2;
    ctx.strokeStyle = "#3a2a1c"; ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(x0 + size / 3, y0); ctx.lineTo(x0 + size / 3, y0 + size);
    ctx.moveTo(x0 + 2 * size / 3, y0); ctx.lineTo(x0 + 2 * size / 3, y0 + size);
    ctx.moveTo(x0, y0 + size / 3); ctx.lineTo(x0 + size, y0 + size / 3);
    ctx.moveTo(x0, y0 + 2 * size / 3); ctx.lineTo(x0 + size, y0 + 2 * size / 3); ctx.stroke();
    V.buttons.slice(0, 9).forEach(function (b, i) {
      ctx.fillStyle = "#140e0a"; ctx.font = "700 28px system-ui"; ctx.textAlign = "center";
      ctx.fillText(b.text, x0 + (i % 3) * size / 3 + size / 6, y0 + ((i / 3) | 0) * size / 3 + size / 5);
    });
    ctx.textAlign = "left";
  }
  function drawTrainScene(ctx, w, h) {
    drawBase(ctx, w, h, "felt");
    ctx.strokeStyle = C.ink; ctx.strokeRect(w * 0.1, h * 0.2, w * 0.8, h * 0.55);
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.45, 8, 0, 6.28); ctx.fill();
    ctx.fillStyle = C.ink; ctx.fillRect(w * 0.18, h * 0.55, 8, 40); ctx.fillRect(w * 0.78, h * 0.4, 8, 40);
  }
  function drawTripleScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "felt");
    V.buttons.forEach(function (b, i) { ctx.fillStyle = b.pri ? C.gold : C.ok; ctx.beginPath(); ctx.arc(40 + (i % 4) * 74, 50 + ((i / 4) | 0) * 54, 18, 0, 6.28); ctx.fill(); });
  }
  function drawTriviaScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "paper");
    ctx.fillStyle = "#f6efe4"; roundRect(ctx, 12, 16, w - 24, 64, 8); ctx.fill();
    ctx.fillStyle = "#140e0a"; ctx.font = "700 14px system-ui"; ctx.fillText((V.text || "Question").slice(0, 34), 24, 52);
    V.buttons.slice(0, 3).forEach(function (b, i) { ctx.fillStyle = C.gold; roundRect(ctx, 16, h * 0.48 + i * 42, w - 32, 34, 6); ctx.fill(); ctx.fillStyle = "#140e0a"; ctx.fillText(b.text.slice(0, 22), 28, h * 0.48 + i * 42 + 22); });
  }
  function drawTycoonScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "asphalt");
    ctx.fillStyle = "#3a2a1c"; ctx.fillRect(0, h * 0.48, w, 28);
    for (var i = 0; i < 5; i++) { ctx.fillStyle = C.ok; ctx.fillRect(24 + i * 58, h * 0.34, 22, 18); }
    ctx.fillStyle = C.ember; ctx.beginPath(); ctx.arc(w * 0.5, h * 0.58, 10, 0, 6.28); ctx.fill();
    ctx.fillStyle = C.ink; ctx.fillText("$" + (V.numbers[0] || 0), 16, 28);
  }
  function drawWheelScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "metal");
    (V.text.split("\n")[0] || "WHEEL").slice(0, 12).split("").forEach(function (ch, i) { ctx.fillStyle = "#f6efe4"; ctx.fillRect(16 + i * 24, h * 0.28, 20, 22); ctx.fillStyle = "#140e0a"; ctx.fillText(ch, 20 + i * 24, h * 0.28 + 16); });
    ctx.fillStyle = C.gold; ctx.beginPath(); ctx.arc(w / 2, h * 0.64, 48, 0, 6.28); ctx.fill();
  }
  function drawWhoScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "paper");
    V.buttons.slice(0, 6).forEach(function (b, i) { ctx.fillStyle = "#e7c9a8"; ctx.beginPath(); ctx.arc(36 + i * 52, h * 0.42, 18, 0, 6.28); ctx.fill(); });
  }
  function drawWordScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "wood");
    ctx.fillStyle = "#8c5c35"; ctx.fillRect(10, h * 0.46, w - 20, 46);
    V.text.replace(/[^a-zA-Z]/g, "").slice(0, 7).split("").forEach(function (ch, i) { ctx.fillStyle = "#f6efe4"; ctx.fillRect(18 + i * 36, h * 0.4, 30, 34); ctx.fillStyle = "#140e0a"; ctx.fillText(ch, 26 + i * 36, h * 0.4 + 22); });
  }
  function drawYachtScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "felt");
    V.buttons.slice(0, 5).forEach(function (b, i) { ctx.fillStyle = b.pri ? C.gold : "#f6efe4"; roundRect(ctx, 14 + i * 56, h * 0.36, 46, 46, 6); ctx.fill(); ctx.fillStyle = "#140e0a"; ctx.font = "700 18px system-ui"; ctx.textAlign = "center"; ctx.fillText(b.text, 37 + i * 56, h * 0.36 + 28); });
    ctx.textAlign = "left";
  }
  function drawZooScene(ctx, w, h, V) {
    drawBase(ctx, w, h, "paper");
    ctx.fillStyle = "#87ceeb"; ctx.fillRect(0, 0, w, h * 0.4);
    ctx.fillStyle = "#8fbf7a"; ctx.fillRect(0, h * 0.4, w, h * 0.6);
    ctx.strokeStyle = "#3a2a1c"; ctx.strokeRect(16, h * 0.5, 80, 50); ctx.strokeRect(120, h * 0.5, 80, 50);
    ctx.fillStyle = C.ember; ctx.beginPath(); ctx.arc(50, h * 0.68, 12, 0, 6.28); ctx.fill();
    ctx.fillStyle = C.ink; ctx.fillText((V.numbers[V.numbers.length - 1] || 0) + " guests", 16, 28);
  }

  var SCENES = {
    paper: drawPaperScene, piperun: drawPiperunScene, price: drawPriceScene, reversi: drawReversiScene, risk: drawRiskScene,
    route: drawRouteScene, rummikub: drawRummikubScene, rummy: drawRummyScene, secret: drawSecretScene, sequence: drawSequenceScene,
    settlers: drawSettlersScene, shadowduel: drawShadowduelScene, shelfmatch: drawShelfScene, shelfsearch: drawShelfScene,
    skiprun: drawSkiprunScene, slide: drawSlideScene, sort: drawSortScene, spot: drawSpotScene, squares: drawSquaresScene,
    tictac: drawTictacScene, train: drawTrainScene, triplematch: drawTripleScene, trivia: drawTriviaScene, tycoon: drawTycoonScene,
    wheel: drawWheelScene, who: drawWhoScene, wordtiles: drawWordScene, yacht: drawYachtScene, zoo: drawZooScene
  };

  function resize() {
    if (!S.board || !S.canvas) return;
    var r = S.board.getBoundingClientRect();
    if (r.width < 2) return;
    S.dpr = Math.min(2, window.devicePixelRatio || 1); S.w = r.width; S.h = Math.max(240, r.height);
    S.canvas.width = Math.round(S.w * S.dpr); S.canvas.height = Math.round(S.h * S.dpr);
  }
  function attach(board, title) {
    var id = slug(title);
    if (S.board && S.board !== board) S.board.classList.remove("stk-canvas-mode");
    S.board = board; S.id = id;
    if (!SCENES[id]) return;
    board.classList.add("stk-canvas-mode");
    if (!S.canvas) { S.canvas = document.createElement("canvas"); S.canvas.className = "stk-stage"; S.ctx = S.canvas.getContext("2d"); }
    if (S.canvas.parentNode !== board) board.insertBefore(S.canvas, board.firstChild);
    resize(); S.view = parseView(board);
    if (S.mo) S.mo.disconnect();
    S.mo = new MutationObserver(function () { S.view = parseView(board); });
    S.mo.observe(board, { subtree: true, childList: true, characterData: true });
  }
  function frame() {
    requestAnimationFrame(frame);
    if (document.hidden || !S.ctx || !S.board || !SCENES[S.id]) return;
    S.sceneTimer += 0.016; resize();
    var ctx = S.ctx; ctx.setTransform(S.dpr, 0, 0, S.dpr, 0, 0); ctx.clearRect(0, 0, S.w, S.h);
    SCENES[S.id](ctx, S.w, S.h, S.view);
    S.particles = S.particles.filter(function (p) { return p.life < p.ttl; });
    S.particles.forEach(function (p) { p.life += 0.016; p.x += p.vx * 0.016; p.y += p.vy * 0.016; p.vy += 200 * 0.016; ctx.globalAlpha = 1 - p.life / p.ttl; ctx.fillStyle = p.c; ctx.fillRect(p.x, p.y, 3, 3); ctx.globalAlpha = 1; });
    S.flashes = S.flashes.filter(function (f) { return f.t < 0.25; });
    S.flashes.forEach(function (f) { f.t += 0.016; ctx.globalAlpha = 1 - f.t / 0.25; ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(f.x, f.y, 28, 0, 6.28); ctx.fill(); ctx.globalAlpha = 1; });
  }
  function boot() {
    css();
    if (!window.TableKit || TableKit.mount.__d2) return;
    var mount = TableKit.mount;
    TableKit.mount = function (title) { var res = mount.apply(this, arguments); if (res && res.board) attach(res.board, title); return res; };
    TableKit.mount.__d2 = true;
    var win = TableKit.win;
    TableKit.win = function () { spawnParticles("confetti", (S.w || 180) / 2, (S.h || 90) / 2, 24); return win.apply(this, arguments); };
    requestAnimationFrame(frame);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", boot); else boot();
  setTimeout(boot, 200);
})();
