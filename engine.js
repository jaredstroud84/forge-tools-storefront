(function (w) {
  function lines(s) {
    return String(s || "").trim() || "the facts you typed";
  }
  function clip(s, n) {
    s = String(s || "").replace(/\s+/g, " ").trim();
    return s.length > n ? s.slice(0, n - 1) + "\u2026" : s;
  }
  function today() {
    return new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
  }
  function head(title, dump) {
    return title.toUpperCase() + "\n" + today() + "\n\nFROM YOUR FACTS\n" + clip(lines(dump), 280) + "\n";
  }
  function lockNote() {
    return "\n\u2014 PREVIEW \u2014\nPay $4.99 once to unlock the full page you can send, plus reruns and the teach-yourself steps.\nThis preview is built from what you typed. ChatGPT gives a chat. This is the start of the file.";
  }
  const builders = {
    ask: function (dump, full) {
      var t = head("Message they answer in the room", dump);
      t += "\nSEND THIS\nI keep thinking about what you said. I am not asking you to explain it again. I am asking for the decision.\n\nYes, no, or not now \u2014 and if not now, the date you can give a real answer.\n\nI can work with any of those. I cannot work with silence.\n";
      if (full) t += "\nIF THEY STALL\nThat still is not a decision. I need yes, no, or a date. Which one is it?\n\nIF THEY SAY LATER\nGood. What day this week do I check back so neither of us is guessing?\n\nKEEP\nOne ask. No speech. No extra paragraph.";
      return full ? t : t + lockNote();
    },
    future: function (dump, full) {
      var t = head("Both paths, five years out", dump);
      t += "\nPATH A \u2014 you do the hard thing now\nYou will hate the first two weeks. You will not still be explaining this to yourself in 2031.\n\nPATH B \u2014 you wait\nThe problem gets quieter, then more expensive. Future-you does not thank present-you for comfort.\n";
      if (full) t += "\nTHE TELL\nIf you already know which one you hope I pick, that is the answer.\n\nDO THIS IN 20 MINUTES\nWrite one sentence for Path A and one for Path B. Circle the sentence you can live with if it is wrong.";
      return full ? t : t + lockNote();
    },
    symptom: function (dump, full) {
      var t = head("Check this before you call a truck", dump);
      t += "\nLIKELY ORDER\n1. Power / thermostat / breaker \u2014 2 minutes, $0.\n2. Filter, drain, cap, loose wire \u2014 10 minutes, under $20.\n3. Part that actually needs a tech.\n\nDo 1 and 2 before you spend $100 for someone to tell you the filter is packed.\n";
      if (full) t += "\nIF IT IS HVAC\nThermostat batteries. Filter date. Condensate drain. Outdoor unit clear. Then call.\n\nWHAT TO SAY WHEN YOU CALL\nI already checked power, filter, and drain. Here is what it is doing: " + clip(lines(dump), 160) + "\n\nThat sentence is how you stop paying for a diagnostic they would have done anyway.";
      return full ? t : t + lockNote();
    },
    grocery: function (dump, full) {
      var t = head("Cheapest cart", dump);
      t += "\nRULES\nStore brand first. Name brand only if it is on a real sale or you can taste the difference.\nShop the list, not the aisle.\n";
      if (full) t += "\nLIST TO TAKE\n" + lines(dump) + "\n\nSWAPS\nMilk, bread, cheese, cereal, trash bags, cleaner \u2014 store brand.\nMeat \u2014 family pack, freeze half.\n\nNEXT TRIP\nReuse this list. Cross off what you still have.";
      return full ? t : t + lockNote();
    },
    fineprint: function (dump, full) {
      var t = head("The line that can cost you", dump);
      t += "\nLOOK FOR THESE FIRST\nAuto-renew. Early termination. 'Reasonable' fees they never list. Arbitration. 'As-is'. Who pays if they are late.\n\nTHE SENTENCE TO SEND\nPlease point me to the clause that covers this, in writing, before I sign / pay / agree.\n";
      if (full) t += "\nWHAT YOU PASTED\n" + lines(dump) + "\n\nMARK THESE\n- Anything that renews without a new signature\n- Anything that lets them change price with notice only\n- Anything that makes you pay their lawyer\n\nDO NOT SIGN until those three are in plain English or struck.";
      return full ? t : t + lockNote();
    },
    rent: function (dump, full) {
      var t = head("Money map so Tuesday does not wreck you", dump);
      t += "\nORDER OF PAY\n1. Roof and lights (rent / mortgage, power).\n2. The bill that shuts something off.\n3. Food.\n4. Everything that can wait a week.\n";
      if (full) t += "\nYOUR FACTS\n" + lines(dump) + "\n\nDAILY NUMBER\nTake what is left after 1-3. Divide by days until next pay. That is the number you can spend without lying to yourself.\n\nIF IT DOES NOT CLOSE\nCall the one that charges late fees first. Ask for a date, not a speech.";
      return full ? t : t + lockNote();
    },
    resume: function (dump, full) {
      var t = head("Resume that matches the job", dump);
      t += "\nRULE\nMirror their verbs. Do not invent jobs. Cut hobbies. Lead with what you actually did.\n";
      if (full) t += "\nFROM YOUR PASTE\n" + lines(dump) + "\n\nTOP OF PAGE\nOne line: the job you want + the proof you already did it.\n\nBULLETS\nDid X, for Y, result Z. Numbers if you have them. No 'responsible for'.\n\nAPPLY\nSame resume, swap the top line and the first three bullets for each posting.";
      return full ? t : t + lockNote();
    },
    income: function (dump, full) {
      var t = head("First dollar this week", dump);
      t += "\nNOT A COURSE. A SHIFT.\nPick work you can explain in one sentence to a stranger today.\n";
      if (full) t += "\nYOUR SITUATION\n" + lines(dump) + "\n\nFIRST HOUR\n1. Write the sentence: I do X for people who have Y.\n2. Message 10 people who already know you. Not the internet. People.\n3. Price one job you can finish in 48 hours.\n\nDO NOT buy tools, ads, or another subscription until someone has paid you once.";
      return full ? t : t + lockNote();
    },
    invoice: function (dump, full) {
      var t = head("Invoice + collect pack", dump);
      t += "\nEMAIL 1 \u2014 same day\nSubject: Invoice for the work on [job]\n\nAttached is the invoice for what we finished. Due date is on the page. Reply here if anything looks off.\n";
      if (full) t += "\nEMAIL 2 \u2014 day 7\nSubject: Checking in on invoice [number]\n\nThis is still open. Need a date it will be paid so I can plan the week.\n\nEMAIL 3 \u2014 day 14\nSubject: Past due \u2014 [job]\n\nThis is now past due. I pause new work until this is current. Send the date today.\n\nYOUR FACTS\n" + lines(dump) + "\n\nFill the brackets. Send. Do not write a novel.";
      return full ? t : t + lockNote();
    },
    bid: function (dump, full) {
      var t = head("Bid guard \u2014 does this job lose money", dump);
      t += "\nMATH BEFORE PRIDE\nMaterials + hours x your real hour + dump fees + callbacks + tax. Then add the margin you actually need.\nIf the customer number is under that, it is not a job. It is a donation.\n";
      if (full) t += "\nYOUR FACTS\n" + lines(dump) + "\n\nWALK-AWAY LINE\nI can do this right at $____. Under that I would have to skip steps, and I will not.\n\nSAY THAT. Do not 'see if you can make it work'.\n\nRED FLAGS\nScope in their head, not on paper. They want you tomorrow. They already burned the last guy.";
      return full ? t : t + lockNote();
    },
    quiet: function (dump, full) {
      var t = head("They went quiet \u2014 one message", dump);
      t += "\nSEND THIS\nI left the estimate with you. I am holding that window until [day]. After that I release it to the next job. Want me to keep it or close it out?\n";
      if (full) t += "\nWHY THIS WORKS\nYou gave them a decision and a clock. You did not beg.\n\nIF NO REPLY\nClose the file. Do not send a third 'just checking in'.\n\nYOUR FACTS\n" + lines(dump);
      return full ? t : t + lockNote();
    },
    vendor: function (dump, full) {
      var t = head("The vendor line that hurts you", dump);
      t += "\nHUNT\nPrice change with notice only. Auto-renew. Minimums. Who owns the data. Who pays when they miss a date.\n";
      if (full) t += "\nPASTE\n" + lines(dump) + "\n\nREPLY\nStrike auto-renew. Cap price changes at 30 days written notice and a walk-away. Dates in writing or the invoice pauses.\n\nDo not accept 'industry standard' as an answer.";
      return full ? t : t + lockNote();
    },
    scope: function (dump, full) {
      var t = head("Extra work \u2014 what you say and charge", dump);
      t += "\nSAY THIS IN THE ROOM\nThat is outside what we priced. I can add it. Here is the number and the extra days. Want it on this visit or later?\n";
      if (full) t += "\nWRITE THIS BEFORE YOU TOUCH THE EXTRA\nChange: \nPrice: $\nDays added: \nSigned: \n\nYOUR FACTS\n" + lines(dump) + "\n\nIf they will not sign, it is not a change. It is a favor. Favors do not pay the truck.";
      return full ? t : t + lockNote();
    },
    review: function (dump, full) {
      var t = head("Review reply that does not pour gas", dump);
      t += "\nPUBLIC REPLY\nThank you for saying it here. I am sorry that part missed. I want to make it right \u2014 email or the number on our listing and I will handle it direct.\n";
      if (full) t += "\nDO NOT\nArgue the story in public. Call them a liar. Write a paragraph about your crew.\n\nPRIVATE\nAsk what would make it right. Do that or say no. Then stop.\n\nYOUR FACTS\n" + lines(dump);
      return full ? t : t + lockNote();
    },
    pricer: function (dump, full) {
      var t = head("Same job, this time's number", dump);
      t += "\nYOU ALREADY DID THIS\nLast time's number is a floor, not a memory. Fuel, parts, and your hour moved.\n";
      if (full) t += "\nYOUR FACTS\n" + lines(dump) + "\n\nFORMULA\nLast job total x 1.08 if it has been a year, plus any part that went up, plus travel if this one is farther.\n\nSAY\nLast time this ran $____. Same work today is $____ because parts and time moved.";
      return full ? t : t + lockNote();
    },
    tax: function (dump, full) {
      var t = head("Tax pile that a human can file from", dump);
      t += "\nTHREE FOLDERS\nIn: what they paid you.\nOut: parts, fuel, software, tools under the limit.\nMaybe: anything you would argue about.\n";
      if (full) t += "\nDUMP\n" + lines(dump) + "\n\nWEEKLY 12 MINUTES\nPhoto the receipt the day you spend it. Name the file job-date. Do not build this in April.\n\nHAND THE PILE TO WHOEVER FILES. That is the product.";
      return full ? t : t + lockNote();
    },
    cash: function (dump, full) {
      var t = head("Tight week \u2014 what can wait", dump);
      t += "\nPAY FIRST\nPeople. Power. The truck that makes the next dollar.\n";
      if (full) t += "\nYOUR FACTS\n" + lines(dump) + "\n\nWAIT\nNice-to-have parts. Ads. Anything with no late fee this week.\n\nCALL\nThe vendor who will freeze you. Ask for 10 days. Get it in writing.";
      return full ? t : t + lockNote();
    },
    hire: function (dump, full) {
      var t = head("Hire post that pulls the right people", dump);
      t += "\nPOST\nWe need [role] in [town]. Pay is [range]. Days are [days]. You need [one real skill], not a perfect resume.\nShow up able to do [the actual work]. Text [number] with a photo of a job you finished.\n";
      if (full) t += "\nYOUR FACTS\n" + lines(dump) + "\n\nCUT\n'Competitive pay'. 'Family atmosphere'. 'Must have 10 years'.\n\nKEEP\nThe number, the days, the work, the town.";
      return full ? t : t + lockNote();
    },
    custom: function (dump, full) {
      var t = head("Custom solution", dump);
      t += "\nWHAT YOU GET\nA page built around the problem you typed \u2014 not a chat, the thing you send or follow.\n\nFIRST CUT\nName the outcome in one line. Name the person who has to see it. Write the next action they can take today.\n";
      if (full) t += "\nYOUR PROBLEM\n" + lines(dump) + "\n\nTHE PAGE\n1. Outcome: \n2. Who it is for: \n3. What you send / do in the next hour: \n4. What 'done' looks like: \n\nFill those four. That is the solution. Rerun when the facts change.";
      return full ? t : t + lockNote();
    }
  };
  var samples = {
    bid: "Kitchen remodel. Customer wants $8,200. Cabinets $3,400. Counter $1,100. Two men, four days. I pay $28/hr. Dump $180. They already changed the sink once.",
    fineprint: "Lease auto-renews unless I give 60 days notice. They can raise rent with 30 days notice. I pay their lawyer if we fight.",
    quiet: "Sent a $4,600 HVAC estimate Tuesday. They said they would talk to their spouse. Nothing since.",
    invoice: "Finished deck repair Friday. $2,150 labor and materials. Customer John H. on Oak Street. No invoice sent yet.",
    symptom: "AC runs but house stays at 78. Filter looks gray. Outside unit is rattling. Thermostat is 3 years old.",
    custom: "My landlord will not fix the heat and it has been 4 days."
  };
  var teach = [
    "Name the finished page, not the vibe.",
    "Put their facts at the top so the page is theirs.",
    "Give them one thing to send or do today.",
    "Cut the speech. Leave the file."
  ];
  w.ForgeEngine = {
    build: function (id, dump, full) {
      var fn = builders[id] || builders.custom;
      return fn(dump, !!full);
    },
    sample: function (id) {
      return samples[id] || samples.custom;
    },
    teach: teach
  };
})(window);
