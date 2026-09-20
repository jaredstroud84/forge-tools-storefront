const STRIPE = "https://buy.stripe.com/00w14p7JK1XDa4CbNEbsc02";
const PRICE = 4.99;
const HINTS = [
  "they went quiet after my estimate",
  "this bid looks like it will lose money",
  "landlord will not fix the heat",
  "customer asked for extra work mid job",
  "I need to collect on an invoice",
  "hidden fee in this lease",
  "AC is running but the house stays hot",
  "write a review reply that does not make it worse",
  "rent and bills hit before payday",
  "I need a hire post that actually gets people"
];
const FEATURED = [
  {id:"ask",n:"Ask Them Again",d:"The message that makes them answer in the room."},
  {id:"future",n:"Future You on the Hard Call",d:"Both paths. Which one still works in five years."},
  {id:"symptom",n:"Symptom Fixer",d:"Check this before you pay for a truck roll."},
  {id:"grocery",n:"Cheapest Cart",d:"The list, with the swaps that cut the ticket."},
  {id:"fineprint",n:"Fine Print Finder",d:"The buried line, and the sentence you send."},
  {id:"rent",n:"Rent / Bill Panic Map",d:"What gets paid so Tuesday does not wreck you."},
  {id:"resume",n:"Resume That Matches the Job",d:"Same history. Top line rebuilt for this posting."},
  {id:"income",n:"First Dollar This Week",d:"Not a course. The first hour that can get paid."},
  {id:"invoice",n:"Invoice + Collect Pack",d:"Three emails. You send. They pay or you pause."},
  {id:"bid",n:"Bid Guard",d:"The number that tells you to take it or walk."},
  {id:"quiet",n:"Quiet Follow-Up",d:"One message after they go silent."},
  {id:"vendor",n:"Vendor Trap Line",d:"The clause that will hurt you later."},
  {id:"scope",n:"Scope Creep Stop",d:"What you say, and what you charge, in the room."},
  {id:"review",n:"Review Reply",d:"Public reply that does not pour gas."},
  {id:"pricer",n:"Same-Job Pricer",d:"Last time vs this time. The new number."},
  {id:"tax",n:"Job-to-Tax Pile",d:"A pile a human can file from."},
  {id:"cash",n:"Tight-Week Cash Map",d:"What must move Friday. What can wait."},
  {id:"hire",n:"Hire Post That Pulls",d:"Role, pay, town, the work. No fluff."}
];
function catalog(){ return FEATURED.concat(customList()); }
function customList(){ try { return JSON.parse(localStorage.getItem("forgeCustom") || "[]"); } catch(e){ return []; } }
function saveCustom(t){ const list = customList().filter(x => x.id !== t.id); list.unshift(t); localStorage.setItem("forgeCustom", JSON.stringify(list.slice(0, 20))); }
function owned(){ try { return new Set(JSON.parse(localStorage.getItem("forgeOwnedPaid")||"[]")); } catch(e){ return new Set(); } }
function own(id){ const s = owned(); s.add(id || "custom"); localStorage.setItem("forgeOwnedPaid", JSON.stringify([...s])); paint(); }
function setPending(id){ try { sessionStorage.setItem("forgePending", JSON.stringify({id:id, ts:Date.now()})); } catch(e){} }
function readPending(){ try { const p = JSON.parse(sessionStorage.getItem("forgePending")||"null"); if(!p || !p.id) return null; if(Date.now()-p.ts > 7200000){ sessionStorage.removeItem("forgePending"); return null; } return p.id; } catch(e){ return null; } }
function clearPending(){ try { sessionStorage.removeItem("forgePending"); } catch(e){} }
function showPay(kind,msg){ const el = document.getElementById("payNote"); if(!el) return; el.style.display = "block"; el.textContent = msg; el.style.border = "1px solid " + (kind==="ok" ? "#e85d04" : "#2a2a2a"); el.style.color = kind==="ok" ? "#e85d04" : "#9a958c"; }
function cleanPayUrl(){ const u = new URL(location.href); ["checkout","tool","session_id"].forEach(k => u.searchParams.delete(k)); history.replaceState({}, "", u.pathname + u.search + u.hash); }
function paint(){ document.getElementById("ownedBar").style.display = owned().size ? "block" : "none"; }
function score(t, q){ if(!q) return 0; const blob = (t.n + " " + t.d).toLowerCase(); const words = q.toLowerCase().split(/\s+/).filter(Boolean); let n = 0; words.forEach(w => { if(blob.includes(w)) n++; }); return n; }
function route(q){ const v = (q||"").trim(); if(!v) return FEATURED[0]; let best = null, s = 0; catalog().forEach(t => { const sc = score(t, v); if(sc > s){ s = sc; best = t; } }); if(s >= 1 && best) return best; const id = "c_" + Date.now().toString(36); const t = {id, n: "Custom: " + v.slice(0, 42), d: "Built from what you typed. Full page after $4.99.", custom: true, seed: v}; saveCustom(t); return t; }
function card(t){ const mine = owned().has(t.id); return `<button class="card" onclick="openTool('${t.id}')"><em>$${PRICE.toFixed(2)}${mine?" \u00b7 Yours":""}</em><b>${t.n}</b><p>${t.d}</p></button>`; }
function render(){ const all = catalog(); document.getElementById("count").textContent = all.length + " solutions. Preview free. $4.99 keeps the page."; document.getElementById("grid").innerHTML = all.map(card).join(""); const demoDump = ForgeEngine.sample("bid"); document.getElementById("liveDemo").innerHTML = "<b>Bid Guard \u2014 sample, no pay.</b><pre style='white-space:pre-wrap;margin-top:8px;color:#f4f1ea;font:inherit'>" + ForgeEngine.build("bid", demoDump, false).replace(/</g,"<") + "</pre>"; paint(); }
const qEl = document.getElementById("q");
const hints = document.getElementById("hints");
function showHints(val){ const v = (val||"").toLowerCase(); const list = HINTS.filter(h => !v || h.includes(v) || v.split(/\s+/).some(w => w.length>2 && h.includes(w))).slice(0,6); if(!list.length){ hints.style.display="none"; return; } hints.innerHTML = list.map(h => `<button type="button" data-h="${h.replace(/"/g,""")}">${h}</button>`).join(""); hints.style.display = "block"; }
qEl.addEventListener("input", () => showHints(qEl.value));
qEl.addEventListener("focus", () => showHints(qEl.value));
hints.addEventListener("click", e => { const b = e.target.closest("button"); if(!b) return; qEl.value = b.getAttribute("data-h"); hints.style.display = "none"; openTool(route(qEl.value).id); });
qEl.addEventListener("keydown", e => { if(e.key !== "Enter") return; hints.style.display = "none"; openTool(route(qEl.value).id); });
document.addEventListener("click", e => { if(!e.target.closest(".search")) hints.style.display="none"; });
let cur = null;
function findTool(id){ return catalog().find(t => t.id === id); }
function engineId(t){ return t.custom ? "custom" : t.id; }
function dumpVal(){ const el = document.getElementById("f_mess"); return el ? el.value.trim() : ""; }
function setOut(text){ document.getElementById("mOut").textContent = text; }
function openTool(id){
  cur = findTool(id); if(!cur) return;
  const mine = owned().has(cur.id);
  document.getElementById("mName").textContent = cur.n;
  document.getElementById("mPrice").textContent = "$" + PRICE.toFixed(2) + (mine ? " \u00b7 Yours \u2014 full page anytime" : " \u00b7 preview free \u00b7 full page after pay");
  document.getElementById("mDesc").textContent = cur.d;
  document.getElementById("fields").innerHTML = `<label>Dump the facts<textarea id="f_mess">${cur.seed ? cur.seed.replace(/</g,"") : ""}</textarea></label><label>Or drop a .txt / .md file<input id="f_file" type="file" accept=".txt,.md,.csv,.html" style="display:block;margin-top:6px;color:#9a958c"></label>`;
  const file = document.getElementById("f_file");
  if(file) file.onchange = () => { const f = file.files && file.files[0]; if(!f) return; const r = new FileReader(); r.onload = () => { document.getElementById("f_mess").value = String(r.result||"").slice(0,8000); }; r.readAsText(f); };
  setOut(mine ? "Already yours. Preview or run the full page." : "Type the facts. Preview is the first cut of YOUR page. Pay to keep the rest.");
  document.getElementById("keepBtn").style.display = mine ? "none" : "inline-block";
  document.getElementById("runBtn").style.display = mine ? "none" : "inline-block";
  document.getElementById("copyBtn").style.display = mine ? "inline-block" : "none";
  document.getElementById("dlBtn").style.display = mine ? "inline-block" : "none";
  document.getElementById("printBtn").style.display = mine ? "inline-block" : "none";
  document.getElementById("followBox").style.display = mine ? "block" : "none";
  document.getElementById("vaultBox").style.display = mine ? "block" : "none";
  const teach = document.getElementById("teachBox");
  if(mine){ teach.style.display = "block"; teach.innerHTML = "<b style='color:#f4f1ea'>How this was forged</b><br>" + ForgeEngine.teach.map((s,i)=> (i+1)+". "+s).join("<br>"); }
  else teach.style.display = "none";
  const ve = document.getElementById("vaultEmail"); if(ve) ve.value = localStorage.getItem("forgeEmail") || "";
  document.getElementById("modal").classList.add("show");
}
function closeModal(){ document.getElementById("modal").classList.remove("show"); }
document.getElementById("previewBtn").onclick = () => { if(!cur) return; setOut(ForgeEngine.build(engineId(cur), dumpVal() || ForgeEngine.sample(engineId(cur)), false)); };
document.getElementById("sampleBtn").onclick = () => { if(!cur) return; document.getElementById("f_mess").value = ForgeEngine.sample(engineId(cur)); setOut(ForgeEngine.build(engineId(cur), document.getElementById("f_mess").value, false)); };
document.getElementById("runBtn").onclick = () => { if(!cur) return; if(!owned().has(cur.id)){ document.getElementById("keepBtn").click(); return; } setOut(ForgeEngine.build(engineId(cur), dumpVal() || ForgeEngine.sample(engineId(cur)), true)); };
document.getElementById("copyBtn").onclick = () => { if(!cur || !owned().has(cur.id)) return; navigator.clipboard.writeText(document.getElementById("mOut").textContent); };
document.getElementById("dlBtn").onclick = () => { if(!cur || !owned().has(cur.id)) return; const blob = new Blob([document.getElementById("mOut").textContent], {type:"text/plain"}); const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = (cur.n.replace(/[^\w]+/g,"-") || "forge") + ".txt"; a.click(); };
document.getElementById("printBtn").onclick = () => { if(!cur || !owned().has(cur.id)) return; const w = window.open("", "_blank"); w.document.write("<pre style='font:16px/1.4 Georgia,serif;white-space:pre-wrap;padding:24px'>" + document.getElementById("mOut").textContent.replace(/</g,"<") + "</pre>"); w.document.close(); w.focus(); w.print(); };
document.getElementById("keepBtn").onclick = () => { if(!cur) return; setPending(cur.id); document.getElementById("keepBtn").textContent = "Sending to Stripe\u2026"; location.assign(STRIPE + "?client_reference_id=" + encodeURIComponent(cur.id)); };
document.getElementById("followBtn").onclick = () => { if(!cur || !owned().has(cur.id)) return; const x = document.getElementById("followQ").value; setOut(ForgeEngine.build(engineId(cur), dumpVal() + "\n\nFOLLOW-UP: " + x, true)); };
document.getElementById("vaultBox").addEventListener("change", () => { const v = document.getElementById("vaultEmail"); if(v) localStorage.setItem("forgeEmail", v.value.trim()); });
document.getElementById("closeBtn").onclick = closeModal;
document.getElementById("modal").onclick = e => { if(e.target.id==="modal") closeModal(); };
document.getElementById("mineLink").onclick = e => { e.preventDefault(); const mine = catalog().filter(t => owned().has(t.id)); if(!mine.length){ showPay("no","No unlocked solutions on this phone yet."); return; } document.getElementById("grid").innerHTML = mine.map(card).join(""); document.getElementById("count").textContent = mine.length + " unlocked on this phone."; document.getElementById("mine").scrollIntoView({behavior:"smooth"}); };
(async function handleReturn(){ const p = new URLSearchParams(location.search); const checkout = p.get("checkout"); const sessionId = p.get("session_id"); const tool = p.get("tool") || readPending() || ""; if(checkout === "cancel"){ clearPending(); showPay("no","Checkout closed. Nothing charged. Preview still free."); cleanPayUrl(); if(tool) openTool(tool); return; } if(sessionId){ try { const r = await fetch("/api/verify?session_id="+encodeURIComponent(sessionId)+(tool?"&tool="+encodeURIComponent(tool):"")); const j = await r.json(); if(j && j.paid && j.toolId){ own(j.toolId); clearPending(); showPay("ok","Payment confirmed. Full page is yours."); openTool(j.toolId); const t = findTool(j.toolId); if(t) setOut(ForgeEngine.build(engineId(t), dumpVal() || ForgeEngine.sample(engineId(t)), true)); } else showPay("no","Payment was not confirmed."); } catch(e){ showPay("no","Could not confirm payment. Come back on this same phone if you were charged."); } cleanPayUrl(); } })();
render();
