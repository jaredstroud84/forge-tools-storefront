const STRIPE="https://buy.stripe.com/00w14p7JK1XDa4CbNEbsc02";
const PRICE=4.99;
const FEATURED=[
{id:"ask",n:"Ask Them Again",e:"ask",d:"Write how they talked. They answer the decision in front of you."},
{id:"future",n:"Future You on the Hard Call",e:"future",d:"Two paths. Years-out you tells you how that call aged."},
{id:"symptom",n:"Symptom Fixer",e:"symptom",d:"House, car, HVAC, appliance. Likely cause + the check before a $100 truck roll."},
{id:"grocery",n:"Grocery List → Cheapest Cart",e:"grocery",d:"Paste the list. Store-brand swaps. Reusable every trip."},
{id:"fineprint",n:"The Fine Print Finder",e:"fineprint",d:"Bills, quotes, insurance, leases. Flags the buried line and what to say."},
{id:"rent",n:"Rent / Bill Panic Map",e:"rent",d:"Rent, bills, income. Daily number so you are not broke on Tuesday."},
{id:"resume",n:"Resume Improver + Auto-Apply",e:"resume",d:"Load resume. Pick jobs. Tailor without lying."},
{id:"income",n:"AI Income Forge",e:"income",d:"Zero-cost income ideas and the exact first hour."},
{id:"invoice",n:"Invoice + Collect Pack",e:"invoice",d:"What you did + who owes you. Three emails. You send."},
{id:"bid",n:"Bid Guard",e:"bid",d:"The job and your costs. Tells you if the number loses money."},
{id:"quiet",n:"Quiet Estimate Follow-Up",e:"quiet",d:"They went silent. One message that reopens it."},
{id:"vendor",n:"Vendor Trap Line",e:"fineprint",d:"Paste the paragraph. The line that hurts you."},
{id:"scope",n:"Scope Creep Stop",e:"scope",d:"They asked for extra. What you say and what to charge."},
{id:"review",n:"Review Reply",e:"review",d:"The reply that does not make a bad review worse."},
{id:"pricer",n:"Same-Job Pricer",e:"pricer",d:"You've done this job. What it should cost this time."},
{id:"tax",n:"Job-to-Tax Pile",e:"tax",d:"Jobs and receipts in. A pile that makes sense at tax time."},
{id:"cash",n:"Tight-Week Cash Map",e:"cash",d:"Payroll Friday. What can wait."},
{id:"hire",n:"Hire Post That Pulls",e:"hire",d:"The role, the pay, the town. A listing that gets the right people."}
];
function catalog(){return FEATURED;}
function match(t,q){if(!q) return true;const blob=(t.n+" "+(t.d||"")).toLowerCase();return q.toLowerCase().split(/\s+/).every(w=>blob.includes(w));}
function owned(){try{return new Set(JSON.parse(localStorage.getItem("forgeOwnedPaid")||"[]"))}catch(e){return new Set()}}
function own(id){const s=owned();s.add(id||"custom");localStorage.setItem("forgeOwnedPaid",JSON.stringify([...s]));paint()}
function setPending(id){try{sessionStorage.setItem("forgePending",JSON.stringify({id:id,ts:Date.now()}))}catch(e){}}
function readPending(){try{const p=JSON.parse(sessionStorage.getItem("forgePending")||"null");if(!p||!p.id)return null;if(Date.now()-p.ts>7200000){sessionStorage.removeItem("forgePending");return null}return p.id}catch(e){return null}}
function clearPending(){try{sessionStorage.removeItem("forgePending")}catch(e){}}
function showPay(kind,msg){const el=document.getElementById("payNote");if(!el)return;el.style.display="block";el.textContent=msg;el.style.border="1px solid "+(kind==="ok"?"#e85d04":"#2a2a2a");el.style.color=kind==="ok"?"#e85d04":"#9a958c"}
function cleanPayUrl(){const u=new URL(location.href);["checkout","tool","session_id"].forEach(k=>u.searchParams.delete(k));history.replaceState({},"",u.pathname+u.search)}
function paint(){document.getElementById("ownedBar").style.display=owned().size?"block":"none"}
function card(t){return `<button class="card" onclick="openTool('${t.id}')"><em>$${PRICE.toFixed(2)}${owned().has(t.id)?" · Yours":""}</em><b>${t.n}</b><p>${t.d}</p></button>`}
function render(){const all=catalog();document.getElementById("count").textContent=all.length+" solutions. $4.99 once each.";document.getElementById("grid").innerHTML=all.map(card).join("");paint();}
const qEl=document.getElementById("q");
qEl.addEventListener("keydown",e=>{if(e.key!=="Enter") return;const v=qEl.value.trim();const hit=catalog().find(t=>match(t,v))||FEATURED[0];openTool(hit.id);});
let cur=null;
function val(id){const el=document.getElementById("f_"+id);return el?el.value.trim():""}
function artifact(){return cur.n.toUpperCase()+"\n"+(val("mess")||"Add the facts, then run.")+"\n\nThis solution is yours. Run it again anytime."}
function openTool(id){cur=FEATURED.find(t=>t.id===id);if(!cur) return;const mine=owned().has(cur.id);document.getElementById("mName").textContent=cur.n;document.getElementById("mPrice").textContent="$"+PRICE.toFixed(2)+(mine?" · Yours — run anytime":" · locked until Stripe confirms");document.getElementById("mDesc").textContent=cur.d;document.getElementById("mOut").textContent=mine?"Run this to generate your solution.":"Pay first. Preview is locked. Closing checkout does not unlock it.";document.getElementById("fields").innerHTML=`<label>Dump the problem<textarea id="f_mess"></textarea></label>`;document.getElementById("keepBtn").style.display=mine?"none":"inline-block";document.getElementById("keepBtn").textContent="Pay $"+PRICE.toFixed(2)+" — then it is yours";document.getElementById("runBtn").textContent=mine?"Run this solution":"Pay to unlock this solution";document.getElementById("copyBtn").style.display=mine?"inline-block":"none";document.getElementById("followBox").style.display=mine?"block":"none";document.getElementById("modal").classList.add("show");}
function closeModal(){document.getElementById("modal").classList.remove("show")}
document.getElementById("runBtn").onclick=()=>{if(!cur) return;if(!owned().has(cur.id)){document.getElementById("mOut").textContent="LOCKED\nThis run is not free.\nPay $"+PRICE.toFixed(2)+" once. Stripe has to confirm. Then this solution stays yours.";document.getElementById("keepBtn").click();return;}document.getElementById("mOut").textContent=artifact();};
document.getElementById("copyBtn").onclick=()=>{if(!cur||!owned().has(cur.id)) return;navigator.clipboard.writeText(document.getElementById("mOut").textContent);};
document.getElementById("keepBtn").onclick=async()=>{if(!cur) return;setPending(cur.id);document.getElementById("keepBtn").textContent="Sending to Stripe…";location.assign(STRIPE+"?client_reference_id="+encodeURIComponent(cur.id));};
document.getElementById("followBtn").onclick=()=>{if(!cur||!owned().has(cur.id)) return;const x=document.getElementById("followQ").value;document.getElementById("mOut").textContent=artifact()+"\n\nFOLLOW-UP\n"+x+"\nStay on this solution. Already paid.";};
document.getElementById("closeBtn").onclick=closeModal;
document.getElementById("modal").onclick=e=>{if(e.target.id==="modal")closeModal()};
(async function handleReturn(){const p=new URLSearchParams(location.search);const checkout=p.get("checkout");const sessionId=p.get("session_id");const tool=p.get("tool")||readPending()||"";if(checkout==="cancel"){clearPending();showPay("no","Checkout closed. Nothing was charged. Not yours until you pay.");cleanPayUrl();if(tool) openTool(tool);return;}if(sessionId){try{const r=await fetch("/api/verify?session_id="+encodeURIComponent(sessionId)+(tool?"&tool="+encodeURIComponent(tool):""));const j=await r.json();if(j&&j.paid&&j.toolId){own(j.toolId);clearPending();showPay("ok","Payment confirmed. This solution is yours.");openTool(j.toolId);}else{showPay("no","Payment was not confirmed. Not unlocked.");}}catch(e){showPay("no","Could not confirm payment. If you were charged, come back on this same phone.");}cleanPayUrl();}})();
render();
