/* Ziya & Co. — Coming Soon
   Behaviour for the standalone preview. The React build in /src mirrors this.
   -------------------------------------------------------------------------
   Signup endpoint: paste the Google Apps Script Web App URL into ENDPOINT
   below, or set window.ZIYA_SIGNUP_ENDPOINT before this file loads. Until one
   is set the form still works: it validates the address and hands it to the
   mailbox instead, so nothing is collected and quietly dropped.

   Every block below runs inside safely(): this file must never be able to
   take the page down with it. Embedded previews and older browsers do not
   all ship a complete console or IntersectionObserver, and a page whose copy
   is hidden behind a failed script is worse than a page with no script. */
(function () {
  "use strict";

  /* Mark the document first, before anything that could throw. The CSS only
     hides a section for its entrance once this is set, so if this file never
     loads or dies later, the page still reads in full. */
  try {
    document.documentElement.setAttribute("data-js", "true");
  } catch (ignored) {}

  var LAUNCH = new Date("2026-12-09T00:00:00+02:00"); // SAST
  /* Paste the Apps Script Web App URL between the quotes, e.g.
     "https://script.google.com/macros/s/AKfycb..../exec" */
  var ENDPOINT_HERE =
    "https://script.google.com/macros/s/AKfycbzLDkeFXDqOkJlnr7vQjVJuclG44gr9xeIUGJEzEYYLvP234rYrIw56A-ZiUJWkQN7d/exec";

  var CONTACT = "info@ziyaco.co.za";
  var ENDPOINT =
    typeof window.ZIYA_SIGNUP_ENDPOINT === "string" &&
    window.ZIYA_SIGNUP_ENDPOINT.length > 0
      ? window.ZIYA_SIGNUP_ENDPOINT
      : ENDPOINT_HERE.length > 0
      ? ENDPOINT_HERE
      : null;

  function mailtoFor(email) {
    return (
      "mailto:" + CONTACT +
      "?subject=" + encodeURIComponent("First access") +
      "&body=" + encodeURIComponent(
        "Please add this address to the Ziya & Co. list: " + email)
    );
  }

  /* Run a block, and if it throws, let the rest of the page carry on. */
  function safely(fn, onFail) {
    try {
      fn();
    } catch (err) {
      devNote("[Ziya & Co.] a block failed and was skipped: " + err);
      if (typeof onFail === "function") {
        try {
          onFail();
        } catch (ignored) {
          /* the fallback is the last resort; there is nothing after it */
        }
      }
    }
  }

  /* A note for whoever is building the site. Not every host gives us a full
     console (console.info is missing in some embedded previews), so this
     feature-detects and never throws. */
  function devNote(message) {
    try {
      var c = window.console;
      if (!c) return;
      var write = typeof c.log === "function" ? c.log : c.info;
      if (typeof write === "function") write.call(c, message);
    } catch (ignored) {
      /* a console we cannot write to is not a reason to break anything */
    }
  }

  /* ---------- lines that type themselves ----------
     The finished line is already in each element's aria-label and in the
     invisible ghost that holds its height, so nothing here changes what the
     page says or where anything sits. Segments marked |amp:&| carry a class,
     which is how the swash ampersand survives being typed. */
  function parseSegments(spec) {
    var out = [];
    spec.split(/\|([a-z]+):([^|]*)\|/).forEach(function (part, i) {
      if (part === "") return;
      if (i % 3 === 1) out.push({ cls: part, pending: true });
      else if (i % 3 === 2) out[out.length - 1].t = part;
      else out.push({ t: part });
    });
    return out.filter(function (x) { return x.t; });
  }

  function typeLine(el) {
    var segs = parseSegments(el.getAttribute("data-type") || "");
    var out = el.querySelector(".typed__out");
    if (!segs.length || !out) return;

    /* only now does the finished line hand over to the one being typed, so a
       line that is never reached simply stays readable */
    el.setAttribute("data-typing", "true");

    var speed = parseInt(el.getAttribute("data-speed"), 10) || 62;
    var delay = parseInt(el.getAttribute("data-delay"), 10) || 0;
    var text = segs.map(function (s) { return s.t; }).join("");
    var total = text.length;
    var n = 0;

    function paint() {
      var left = n;
      out.textContent = "";
      segs.forEach(function (seg) {
        var take = Math.max(0, Math.min(seg.t.length, left));
        left -= seg.t.length;
        if (!take) return;
        var slice = seg.t.slice(0, take);
        if (seg.cls) {
          var sp = document.createElement("span");
          sp.className = seg.cls;
          sp.textContent = slice;
          out.appendChild(sp);
        } else {
          out.appendChild(document.createTextNode(slice));
        }
      });
    }

    function step() {
      n += 1;
      paint();
      if (n >= total) {
        el.setAttribute("data-done", "true");
        return;
      }
      var just = text.charAt(n - 1);
      var rest = /[,.?]/.test(just) ? 420 : /\s/.test(just) ? 110 : 0;
      window.setTimeout(step, speed + rest + Math.random() * 30);
    }
    window.setTimeout(step, delay);
  }

  safely(function () {
    var lines = Array.prototype.slice.call(document.querySelectorAll(".typed"));
    if (!lines.length) return;

    var reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* reduced motion: leave the markup exactly as it is, finished */
    if (reduce) return;

    lines.forEach(function (el) {
      if (el.getAttribute("data-on-view") !== "true") {
        typeLine(el);
        return;
      }
      if (!("IntersectionObserver" in window)) {
        typeLine(el);
        return;
      }
      var io = new IntersectionObserver(
        function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              io.disconnect();
              typeLine(entry.target);
            }
          });
        },
        { threshold: 0.3 }
      );
      io.observe(el);
    });
  }, function () {
    /* if any of that fails, hand back to the finished lines in the markup */
    var all = document.querySelectorAll(".typed");
    for (var i = 0; i < all.length; i++) all[i].removeAttribute("data-typing");
  });

  /* ---------- quiet entrance ----------
     First, so the copy is on screen before anything else can go wrong. */
  function showAll() {
    var all = document.querySelectorAll(".reveal");
    for (var i = 0; i < all.length; i++) {
      all[i].setAttribute("data-shown", "true");
    }
  }

  safely(function () {
    var reveals = Array.prototype.slice.call(
      document.querySelectorAll(".reveal")
    );
    var reduce =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduce || !("IntersectionObserver" in window)) {
      showAll();
      return;
    }
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.setAttribute("data-shown", "true");
            io.unobserve(entry.target);
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.12 }
    );
    reveals.forEach(function (el, i) {
      el.style.transitionDelay =
        i % 3 === 0 ? "0ms" : i % 3 === 1 ? "70ms" : "140ms";
      io.observe(el);
    });
  }, showAll);

  /* ---------- mobile navigation ---------- */
  safely(function () {
    var toggle = document.querySelector(".nav-toggle");
    var nav = document.getElementById("primary-nav");
    if (!toggle || !nav) return;

    function setNav(open) {
      toggle.setAttribute("aria-expanded", String(open));
      nav.setAttribute("data-open", String(open));
    }
    setNav(false);
    toggle.addEventListener("click", function () {
      setNav(toggle.getAttribute("aria-expanded") !== "true");
    });
    nav.addEventListener("click", function (e) {
      if (e.target.closest("a")) setNav(false);
    });
    document.addEventListener("keydown", function (e) {
      if (
        e.key === "Escape" &&
        toggle.getAttribute("aria-expanded") === "true"
      ) {
        setNav(false);
        toggle.focus();
      }
    });
  });

  /* ---------- countdown ---------- */
  safely(function () {
    var counter = document.getElementById("counter");
    var launched = document.getElementById("launched");
    var srOut = document.getElementById("counter-sr");
    if (!counter) return;

    var fields = {};
    ["days", "hours", "minutes", "seconds"].forEach(function (u) {
      fields[u] = counter.querySelector('[data-unit="' + u + '"]');
    });

    function pad(n, len) {
      var s = String(n);
      while (s.length < len) s = "0" + s;
      return s;
    }

    var lastSrMinute = null;

    function tick() {
      var ms = LAUNCH.getTime() - Date.now();
      if (ms <= 0) {
        counter.hidden = true;
        if (launched) launched.hidden = false;
        if (srOut) srOut.textContent = "The collection is open.";
        return false;
      }
      var total = Math.floor(ms / 1000);
      var days = Math.floor(total / 86400);
      var hours = Math.floor((total % 86400) / 3600);
      var minutes = Math.floor((total % 3600) / 60);
      var seconds = total % 60;

      if (fields.days) {
        fields.days.textContent = String(days);
        fields.hours.textContent = pad(hours, 2);
        fields.minutes.textContent = pad(minutes, 2);
        fields.seconds.textContent = pad(seconds, 2);
      }
      /* announce once a minute, not once a second */
      if (srOut && lastSrMinute !== minutes) {
        lastSrMinute = minutes;
        srOut.textContent =
          days +
          " days, " +
          hours +
          " hours and " +
          minutes +
          " minutes until Ziya and Co opens on 9 December 2026.";
      }
      return true;
    }

    if (tick()) {
      var timer = window.setInterval(function () {
        if (!tick()) window.clearInterval(timer);
      }, 1000);
    }
  });

  /* ---------- signup ---------- */
  safely(function () {
    var form = document.getElementById("signup");
    var input = document.getElementById("email");
    var status = document.getElementById("signup-status");
    /* the note under the field is the same sentence in both states, so it
       lives in the markup and nothing here rewrites it */
    if (!form || !input) return;

    function setStatus(message, tone) {
      if (!status) return;
      status.textContent = message;
      if (tone) status.setAttribute("data-tone", tone);
      else status.removeAttribute("data-tone");
    }

    if (!ENDPOINT) {
      /* What needs configuring is a developer's problem, so it goes to the
         console and the README, not onto the page. */
      devNote(
        "[Ziya & Co.] No signup endpoint set. Paste the Apps Script Web App " +
          "URL into ENDPOINT_HERE in app.js, or set " +
          "window.ZIYA_SIGNUP_ENDPOINT. Until then the form hands addresses " +
          "to " + CONTACT + ". See README, \u201CThe email form\u201D."
      );
    }

    /* Robots fill in every field they find. A human never sees the trap, so
       anything in it means the submission is not a person: it is answered
       exactly as a person would be, and nothing is sent. */
    var trap = document.getElementById("company");
    var busy = false;


  /* ------------------------------------------------------------------
     The note she types back, once an address is safely stored.

     A full-screen dialog, built here rather than sitting in the markup:
     it only ever exists after a successful signup, so there is nothing to
     hide and nothing that can be left stranded if this script fails. The
     Close button is present from the first frame, because a takeover with
     no obvious way out is a trap. Reduced motion is given the whole
     message at once.
     ------------------------------------------------------------------ */
  var DONE_LINES = [
    "Thank you.",
    "Ziya & Co has your email.",
    "I’ll write to you on 9 December — the day the doors open."
  ];

  function openDone(returnTo) {
    var reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var wrap = document.createElement("div");
    wrap.className = "done";
    wrap.setAttribute("role", "dialog");
    wrap.setAttribute("aria-modal", "true");
    wrap.setAttribute("aria-labelledby", "done-said");
    wrap.tabIndex = -1;

    /* the whole message, read at once rather than letter by letter */
    var said = document.createElement("p");
    said.id = "done-said";
    said.className = "sr-only";
    said.textContent = DONE_LINES.join(" ");
    wrap.appendChild(said);

    var inner = document.createElement("div");
    inner.className = "done__inner";

    var mark = document.createElement("span");
    mark.className = "wordmark done__mark";
    mark.innerHTML = 'ZIYA <span class="amp">&amp;</span> CO';
    inner.appendChild(mark);

    var rule = document.createElement("div");
    rule.className = "done__rule";
    rule.setAttribute("aria-hidden", "true");
    inner.appendChild(rule);

    var lines = document.createElement("div");
    lines.className = "done__lines";
    var outs = [];
    DONE_LINES.forEach(function (text) {
      var p = document.createElement("p");
      p.className = "done__line";
      p.setAttribute("aria-hidden", "true");
      var ghost = document.createElement("span");
      ghost.className = "done__ghost";
      ghost.textContent = text;
      var out = document.createElement("span");
      out.className = "done__out";
      p.appendChild(ghost);
      p.appendChild(out);
      if (!reduced) p.setAttribute("data-typing", "true");
      lines.appendChild(p);
      outs.push({ host: p, out: out, text: text });
    });
    inner.appendChild(lines);

    var close = document.createElement("button");
    close.type = "button";
    close.className = "btn btn--line done__close";
    close.textContent = "Close";
    inner.appendChild(close);

    wrap.appendChild(inner);
    document.body.appendChild(wrap);

    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    wrap.focus();

    function shut() {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (wrap.parentNode) wrap.parentNode.removeChild(wrap);
      /* back where they were, not at the top of the document */
      if (returnTo && typeof returnTo.focus === "function") returnTo.focus();
    }

    function onKey(e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        shut();
        return;
      }
      /* only one thing in here is focusable, so the trap is simply this */
      if (e.key === "Tab" || e.keyCode === 9) {
        e.preventDefault();
        close.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    close.addEventListener("click", shut);

    if (reduced) return;

    /* one line at a time, each starting as the one before it lands */
    var li = 0;
    function typeOne() {
      if (li >= outs.length) {
        close.setAttribute("data-ready", "true");
        return;
      }
      var item = outs[li];
      var i = 0;
      item.host.setAttribute("data-caret", "true");
      (function step() {
        item.out.textContent = item.text.slice(0, i);
        if (i >= item.text.length) {
          item.host.removeAttribute("data-caret");
          li += 1;
          window.setTimeout(typeOne, 260);
          return;
        }
        var just = item.text.charAt(i - 1);
        var rest = /[,.?]/.test(just) ? 420 : /\s/.test(just) ? 110 : 0;
        i += 1;
        window.setTimeout(step, 62 + rest + Math.random() * 30);
      })();
    }
    typeOne();
  }

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return; // no double submissions while one is in flight

      if (trap && trap.value) {
        setStatus("Thank you. I’ll write to you on 9 December.");
        openDone(input);
        form.reset();
        return;
      }

      var value = input.value.trim();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value)) {
        setStatus("Please check that email address.", "error");
        input.focus();
        return;
      }

      /* No endpoint yet: the address is handed to the mailbox rather than
         accepted and dropped. The visitor is told exactly what happened. */
      if (!ENDPOINT) {
        window.location.href = mailtoFor(value);
        setStatus(
          "Almost there. I’ve opened an email for you, ready to send. " +
            "If nothing appeared, write to " + CONTACT + "."
        );
        return;
      }

      var button = form.querySelector("button[type=submit]");
      busy = true;
      button.disabled = true;
      input.disabled = true;
      button.textContent = "Sending";
      setStatus("Sending\u2026");
      window
        .fetch(ENDPOINT, {
          method: "POST",
          /* text/plain keeps this a "simple request". Apps Script does not
             answer a CORS preflight, so an application/json body would be
             blocked before it was ever sent. The script reads the JSON out
             of e.postData.contents. */
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify({ email: value }),
          redirect: "follow"
        })
        .then(function (res) {
          if (!res.ok) throw new Error(String(res.status));
          return res.text();
        })
        .then(function (text) {
          /* Apps Script answers 200 even when it refused the row, so the
             body is checked rather than thanking someone who was not added */
          var payload = null;
          try {
            payload = JSON.parse(text);
          } catch (ignored) {
            /* not JSON: the 200 is taken at face value */
          }
          if (payload && payload.ok === false) {
            throw new Error(String(payload.error || "rejected"));
          }
          form.reset();
          setStatus("Thank you. I’ll write to you on 9 December.");
          /* only once the address is actually stored: the mailto fallback
             and every failure path deliberately do not reach this */
          openDone(input);
        })
        .catch(function () {
          setStatus(
            "Something went wrong on my side. Please try again, or write " +
              "to " + CONTACT + ".",
            "error"
          );
        })
        .then(function () {
          busy = false;
          button.disabled = false;
          input.disabled = false;
          button.textContent = "Notify me";
        });
    });
  });

  /* ------------------------------------------------------------------
     The legal documents, each as a full-screen reading panel.

     Generic on purpose: the privacy policy and the returns policy are the
     same kind of thing, and the terms and conditions will be a third once
     they are written. Everything particular to a document sits in the DOCS
     list at the bottom of this block. Keep it in step with src/legalDocs.ts.

     Each panel is opened by its own hash, so every link to one is an
     ordinary anchor that can be copied and shared, and the address bar says
     where you are. The text is generated from the brand document rather
     than retyped. The voice maps give each plural line in the singular,
     because the site speaks as one woman; a map rather than a
     find-and-replace, so every altered line reads beside its original.

     THESE ARE LEGAL DOCUMENTS. The voice maps are wording changes to them,
     made at Ziyanda's request. Whoever drafted them should read those maps.

     ON 9 DECEMBER: set SHOP_OPEN to true, here and in src/privacyScope.ts.
     ------------------------------------------------------------------ */
  var SHOP_OPEN = false;

  var PRIVACY_DATA = {"updated":"September 2026","intro":["At ZIYA & CO, your privacy matters to us.","This Privacy Policy explains how ZIYA & CO collects, uses, stores and protects your personal information when you visit our website, place an order, contact us or otherwise interact with us.","ZIYA & CO respects your right to privacy and is committed to handling your personal information responsibly and in accordance with applicable South African privacy laws, including the Protection of Personal Information Act 4 of 2013 (POPIA)."],"sections":[{"n":"1","title":"WHO WE ARE","blocks":[{"kind":"p","text":"ZIYA & CO is an online jewellery business operating in South Africa."},{"kind":"p","text":"For any privacy-related questions, you can contact us at:"},{"kind":"ul","items":["Email: info@ziyaco.co.za"]}],"id":"pp-who-we-are"},{"n":"2","title":"INFORMATION WE COLLECT","blocks":[{"kind":"p","text":"When you interact with ZIYA & CO, we may collect information such as:"},{"kind":"ul","items":["Your name and surname","Email address","Telephone or mobile number","Billing and delivery address","Order and purchase information","Payment-related information necessary to process your transaction","Communications you have with us","Information you provide when contacting us regarding an order, return or exchange","Technical information relating to your use of our website, such as IP address, browser type and device information, where applicable"]},{"kind":"p","text":"We only request information that is reasonably necessary for the purposes described in this Privacy Policy."}],"id":"pp-information-we-collect"},{"n":"3","title":"HOW WE USE YOUR INFORMATION","blocks":[{"kind":"p","text":"We may use your personal information to:"},{"kind":"ul","items":["Process and fulfil your orders","Process payments","Arrange delivery or collection","Communicate with you regarding your order","Provide customer support","Process returns, refunds and exchanges","Respond to enquiries","Improve our website, products and customer experience","Detect and prevent fraud, abuse or other unlawful activity","Meet our legal, accounting and regulatory obligations","Send marketing communications where permitted by law and where you have provided the required consent"]}],"id":"pp-how-we-use-your-information"},{"n":"4","title":"PAYMENT INFORMATION","blocks":[{"kind":"p","text":"Payments made through our website may be processed by a third-party payment service provider."},{"kind":"p","text":"ZIYA & CO does not intentionally store your full payment card details."},{"kind":"p","text":"Payment information is handled by the relevant payment provider in accordance with its own security and privacy practices."}],"id":"pp-payment-information"},{"n":"5","title":"DELIVERY PARTNERS AND SERVICE PROVIDERS","blocks":[{"kind":"p","text":"To fulfil your order, we may need to share certain information with trusted third-party service providers."},{"kind":"p","text":"For example, your name, contact details and delivery address may be provided to a courier responsible for delivering your order."},{"kind":"p","text":"We only share information that is reasonably necessary for the relevant service to be performed."}],"id":"pp-delivery-partners-and-service-providers"},{"n":"6","title":"MARKETING","blocks":[{"kind":"p","text":"If you choose to subscribe to our marketing communications, we may use your contact details to send you information about:"},{"kind":"ul","items":["New collections","Product launches","Special offers","Promotions","ZIYA & CO news and updates"]},{"kind":"p","text":"You may unsubscribe from marketing communications at any time by using the unsubscribe option provided in the communication or by contacting us."},{"kind":"p","text":"Transactional communications, such as order confirmations and delivery updates, are not marketing communications and may still be sent when necessary to fulfil your order."}],"id":"pp-marketing"},{"n":"7","title":"COOKIES","blocks":[{"kind":"p","text":"Our website may use cookies and similar technologies to help the website function properly, remember preferences, understand website usage and improve your experience."},{"kind":"p","text":"Some cookies may also be placed by third-party services used on our website, such as payment, analytics or marketing providers."},{"kind":"p","text":"You can manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the website."}],"id":"pp-cookies"},{"n":"8","title":"HOW WE PROTECT YOUR INFORMATION","blocks":[{"kind":"p","text":"We take reasonable and appropriate measures to protect personal information against loss, misuse, unauthorised access, disclosure, alteration or destruction."},{"kind":"p","text":"However, no online transmission or electronic storage system can be guaranteed to be completely secure."},{"kind":"p","text":"If we become aware of a security compromise involving your personal information, we will take appropriate steps in accordance with applicable law."}],"id":"pp-how-we-protect-your-information"},{"n":"9","title":"HOW LONG WE KEEP YOUR INFORMATION","blocks":[{"kind":"p","text":"We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, or where retention is required or permitted by law."},{"kind":"p","text":"Certain information relating to transactions may need to be retained for accounting, tax, legal or regulatory purposes."}],"id":"pp-how-long-we-keep-your-information"},{"n":"10","title":"YOUR PRIVACY RIGHTS","blocks":[{"kind":"p","text":"Subject to applicable law, you may have the right to:"},{"kind":"ul","items":["Request access to personal information we hold about you","Request correction or updating of inaccurate information","Request deletion of information where there is no lawful reason for us to continue retaining it","Object to certain forms of processing","Withdraw consent where processing is based on consent","Ask questions about how your personal information is being used"]},{"kind":"p","text":"Requests can be submitted to:"},{"kind":"ul","items":["info@ziyaco.co.za"]},{"kind":"p","text":"We may need to verify your identity before processing certain requests."}],"id":"pp-your-privacy-rights"},{"n":"11","title":"THIRD-PARTY WEBSITES","blocks":[{"kind":"p","text":"Our website may contain links to third-party websites or services."},{"kind":"p","text":"ZIYA & CO is not responsible for the privacy practices, security or content of third-party websites. We recommend reviewing the privacy policies of those websites before providing them with personal information."}],"id":"pp-third-party-websites"},{"n":"12","title":"CHILDREN'S INFORMATION","blocks":[{"kind":"p","text":"Our website is not intended to knowingly collect personal information from children without the appropriate consent required by law."},{"kind":"p","text":"If you believe that a child has provided personal information to us without the required consent, please contact us so that we can investigate and take appropriate action."}],"id":"pp-children-s-information"},{"n":"13","title":"CHANGES TO THIS PRIVACY POLICY","blocks":[{"kind":"p","text":"We may update this Privacy Policy from time to time to reflect changes to our business, website, technology or legal requirements."},{"kind":"p","text":"The latest version will always be made available on our website."}],"id":"pp-changes-to-this-privacy-policy"},{"n":"14","title":"CONTACT US","blocks":[{"kind":"p","text":"If you have any questions, concerns or requests regarding your personal information or this Privacy Policy, please contact us:"},{"kind":"ul","items":["ZIYA & CO","Email: info@ziyaco.co.za"]},{"kind":"p","text":"We value your trust and are committed to protecting your information while providing you with a beautiful ZIYA & CO experience. 🤍"}],"id":"pp-contact-us"}]};
  var RETURNS_DATA = {"intro":["At ZIYA & CO, we want you to love every piece you receive.","We understand that sometimes a piece may not be quite what you expected, so we offer a 7-day return and exchange period for eligible purchases."],"sections":[{"n":"1","title":"CHANGE-OF-MIND RETURNS & EXCHANGES","blocks":[{"kind":"p","text":"If you change your mind about your purchase, you may request a return or exchange within 7 days of receiving your order or collecting it."},{"kind":"p","text":"To be eligible, the item must:"},{"kind":"ul","items":["Be unused and unworn","Be in its original condition","Be returned with its original packaging","Not show any signs of damage, alteration or wear","Be accompanied by your order number or proof of purchase"]},{"kind":"p","text":"Please contact us within the 7-day period before sending any item back. We will provide you with the relevant return or exchange instructions."},{"kind":"p","text":"For change-of-mind returns, return delivery costs may be for the customer's account, unless otherwise required by applicable law."}],"id":"rt-change-of-mind-returns-exchanges"},{"n":"2","title":"EXCHANGES","blocks":[{"kind":"p","text":"We are happy to assist with an exchange where the requested replacement item is available."},{"kind":"p","text":"If the replacement item has a different price, we will advise you of any applicable difference before processing the exchange."},{"kind":"p","text":"Items purchased during a sale or promotional period may be subject to specific exchange conditions, which will be communicated at the time of purchase."}],"id":"rt-exchanges"},{"n":"3","title":"DAMAGED, DEFECTIVE OR INCORRECT ITEMS","blocks":[{"kind":"p","text":"If your order arrives damaged, defective, or you receive an item different from what you ordered, please contact us as soon as possible."},{"kind":"p","text":"Please send us:"},{"kind":"ul","items":["Your order number","A description of the issue","Clear photographs of the item and its packaging"]},{"kind":"p","text":"We will assess the issue and work with you to resolve it."},{"kind":"p","text":"Nothing in this policy limits or excludes any rights you may have under applicable South African consumer-protection legislation. Where an item is defective or does not comply with applicable legal requirements, your statutory rights will apply."}],"id":"rt-damaged-defective-or-incorrect-items"},{"n":"4","title":"ONLINE PURCHASES","blocks":[{"kind":"p","text":"For purchases made through our online store, statutory cancellation and cooling-off rights that apply to electronic transactions will remain unaffected by this policy."},{"kind":"p","text":"Where a statutory cooling-off right applies, ZIYA & CO will process the cancellation and refund in accordance with applicable law."}],"id":"rt-online-purchases"},{"n":"5","title":"ITEMS THAT CANNOT BE RETURNED","blocks":[{"kind":"p","text":"Items that have been worn, damaged after delivery, altered, or returned outside the applicable return period may not qualify for a change-of-mind return or exchange."},{"kind":"p","text":"For hygiene reasons, worn earrings may not be eligible for return or exchange, subject always to any rights that cannot legally be excluded."}],"id":"rt-items-that-cannot-be-returned"},{"n":"6","title":"REFUNDS","blocks":[{"kind":"p","text":"Once an eligible return has been received and inspected, we will confirm whether the return has been approved."},{"kind":"p","text":"Approved refunds will be processed using the applicable original payment method, subject to the requirements of the relevant payment provider and applicable law."},{"kind":"p","text":"Please allow the required processing time for the funds to reflect in your account."}],"id":"rt-refunds"},{"n":"7","title":"NEED HELP?","blocks":[{"kind":"p","text":"If you have any questions about a return or exchange, please contact us:"},{"kind":"ul","items":["Email: info@ziyaco.co.za"]},{"kind":"p","text":"We're here to help make your ZIYA & CO experience as beautiful as possible."}],"id":"rt-need-help"}]};

  var TERMS_DATA = {"updated":"29 October 2026","intro":[],"sections":[{"n":"1","title":"Introduction","blocks":[{"kind":"p","text":"Welcome to ZIYA & CO."},{"kind":"p","text":"These Terms & Conditions govern your use of our website, www.ziyaco.co.za, and purchases made through our online store."},{"kind":"p","text":"ZIYA & CO is the trading name of ZIYA M HOLDINGS, a business registered in the Republic of South Africa."},{"kind":"p","text":"By using our website or placing an order, you agree to these Terms & Conditions, subject to your rights under applicable law. Please read them carefully before completing your purchase."}],"id":"tc-introduction"},{"n":"2","title":"Business Information","blocks":[{"kind":"ul","items":["Registered legal name: ZIYA M HOLDINGS","Registration number: 2026/677758/07","Trading name: ZIYA & CO","Business location: Pinelands, Cape Town, South Africa","Website: www.ziyaco.co.za","Email: info@ziyaco.co.za","Telephone/WhatsApp: 063 123 3361"]},{"kind":"p","text":"ZIYA & CO operates primarily as an online jewellery store. Free collection is available by appointment only in Pinelands, Cape Town."}],"id":"tc-business-information"},{"n":"3","title":"Products and Product Information","blocks":[{"kind":"p","text":"We make reasonable efforts to ensure that product descriptions, photographs, prices and material information displayed on our website are accurate and up to date."},{"kind":"p","text":"Our jewellery may be made from different materials, depending on the product. Please refer to the individual product description for the relevant material information."},{"kind":"p","text":"Colours and appearance may vary slightly due to lighting, photography and individual screen settings. Such variations do not affect any rights you may have under applicable consumer-protection law."},{"kind":"p","text":"Product availability is subject to stock. If an item you have ordered becomes unavailable, we will contact you to discuss the appropriate next steps."}],"id":"tc-products-and-product-information"},{"n":"4","title":"Prices and Promotions","blocks":[{"kind":"p","text":"All prices are displayed in South African Rand (ZAR), unless otherwise stated."},{"kind":"p","text":"The applicable product price, delivery fee and any other charges will be displayed before you complete your purchase."},{"kind":"p","text":"We may update prices, product descriptions and promotional offers from time to time. Changes will not retrospectively alter an order already concluded."},{"kind":"p","text":"Promotional offers are subject to their stated conditions and applicable law."}],"id":"tc-prices-and-promotions"},{"n":"5","title":"Orders and Order Confirmation","blocks":[{"kind":"p","text":"When you place an order through our website, you submit a request to purchase the selected products."},{"kind":"p","text":"An order confirmation will be sent once your order has been received. An automated confirmation does not necessarily mean that payment has cleared or that your order has been dispatched."},{"kind":"p","text":"Orders are subject to successful payment, stock availability and any necessary verification."},{"kind":"p","text":"If we cannot fulfil an order, we will notify you and arrange an appropriate refund where payment has already been received, in accordance with applicable law."},{"kind":"p","text":"We may contact you to clarify order details or resolve a suspected payment or delivery issue."}],"id":"tc-orders-and-order-confirmation"},{"n":"6","title":"Payment","blocks":[{"kind":"p","text":"Payment must be successfully completed before an order is processed and dispatched, unless another arrangement has been expressly agreed."},{"kind":"p","text":"ZIYA & CO intends to use PayFast as its online payment provider, subject to merchant approval and activation."},{"kind":"p","text":"Once activated, payments will be processed using the payment methods available at checkout. Transactions may be subject to the payment provider’s applicable terms and security procedures."},{"kind":"p","text":"ZIYA & CO does not intentionally store customers’ full payment card details. Payment information is handled through the applicable payment service provider."},{"kind":"p","text":"If a payment fails or cannot be verified, we may contact you before proceeding with the order."}],"id":"tc-payment"},{"n":"7","title":"Order Processing","blocks":[{"kind":"p","text":"Order processing begins on the business day after purchase."},{"kind":"p","text":"Please allow 1–2 business days for us to process, pack and dispatch your order."},{"kind":"p","text":"Business days exclude weekends and South African public holidays."},{"kind":"p","text":"Processing may take longer during product launches, promotions, public holidays or periods of unusually high order volume. Where a material delay is anticipated, we will endeavour to communicate it to you."}],"id":"tc-order-processing"},{"n":"8","title":"Shipping and Delivery","blocks":[{"kind":"p","text":"We offer delivery nationwide within South Africa through The Courier Guy, subject to service availability at the delivery address."},{"kind":"p","text":"Our delivery charges are as follows:"},{"kind":"ul","items":["Standard delivery: R110 nationwide.","Free delivery: All orders over R800.","Collection: Free, by appointment only in Pinelands, Cape Town."]},{"kind":"p","text":"Once your order has been dispatched, delivery generally takes 1–4 business days, depending on your location and the courier service."},{"kind":"p","text":"Delivery times are estimates and are not guaranteed. Delays may occur due to weather, public holidays, courier operational disruptions or other circumstances outside our reasonable control."},{"kind":"p","text":"The delivery period begins after dispatch, not when the order is placed."},{"kind":"p","text":"Tracking information will be provided where available."},{"kind":"p","text":"If a parcel is delayed, lost or delivered incorrectly, please contact us so that we can assist. Nothing in these Terms & Conditions removes any responsibility or consumer remedy that applicable law places on us."}],"id":"tc-shipping-and-delivery"},{"n":"9","title":"Free Collection","blocks":[{"kind":"p","text":"Free collection is available from our collection point in Pinelands, Cape Town, by appointment only."},{"kind":"p","text":"Once your order is ready, we will contact you via SMS or WhatsApp to arrange a convenient collection time."},{"kind":"p","text":"Please wait for confirmation before arriving. Customers may be asked to provide their order confirmation or other reasonable proof of purchase."},{"kind":"p","text":"The exact collection arrangements will be communicated directly to the customer."}],"id":"tc-free-collection"},{"n":"10","title":"Delivery Information and Failed Deliveries","blocks":[{"kind":"p","text":"Customers are responsible for checking that their delivery address, email address and telephone number are correct before completing an order."},{"kind":"p","text":"If you notice an error, please contact us as soon as possible at info@ziyaco.co.za or 063 123 3361."},{"kind":"p","text":"We will make reasonable efforts to assist if your order has not yet been dispatched. Changes cannot be guaranteed once the parcel has been handed to the courier."},{"kind":"p","text":"If delivery fails because of incorrect or incomplete information provided by the customer, we will work with the customer and courier to determine the next steps. Any additional delivery charge will be communicated before it is incurred where reasonably practicable and will only be charged where lawful."}],"id":"tc-delivery-information-and-failed-deliveries"},{"n":"11","title":"Returns, Refunds and Exchanges","blocks":[{"kind":"p","text":"We want you to enjoy your ZIYA & CO jewellery."},{"kind":"p","text":"For eligible change-of-mind requests, our standard policy allows customers to request a return or exchange within 7 days of receiving or collecting their order."},{"kind":"p","text":"For change-of-mind requests, items should be unused, unworn, unaltered and in their original condition and packaging, with proof of purchase."},{"kind":"p","text":"Please contact us before sending an item back so that we can provide the relevant return instructions."},{"kind":"p","text":"Return delivery costs for change-of-mind returns may be payable by the customer, subject to applicable law."},{"kind":"p","text":"Exchanges are subject to product availability. If the replacement item has a different price, we will explain the price difference before proceeding."},{"kind":"p","text":"Where a refund is due, it will be processed in accordance with applicable law and, where practicable, through the original payment method."},{"kind":"p","text":"These conditions do not limit statutory rights. They do not remove any applicable electronic-transaction cooling-off right, consumer remedy for defective goods or other right that cannot legally be excluded."},{"kind":"p","text":"Please refer to our separate Returns, Refunds & Exchanges Policy for the full procedure."}],"id":"tc-returns-refunds-and-exchanges"},{"n":"12","title":"Defective, Damaged or Incorrect Products","blocks":[{"kind":"p","text":"If your order arrives damaged, defective or different from what you ordered, please contact us as soon as reasonably possible."},{"kind":"p","text":"Please provide your order number, a description of the issue and photographs where appropriate."},{"kind":"p","text":"We will assess the matter and arrange an appropriate remedy in accordance with applicable South African consumer-protection law."},{"kind":"p","text":"Our change-of-mind conditions do not override statutory remedies for defective or non-compliant goods."}],"id":"tc-defective-damaged-or-incorrect-products"},{"n":"13","title":"Intellectual Property","blocks":[{"kind":"p","text":"Unless otherwise stated, the ZIYA & CO brand, logos, original written content, website graphics and other original brand materials are owned by or used with permission by the relevant rights holder."},{"kind":"p","text":"You may not copy, reproduce, distribute or commercially exploit these materials without appropriate permission, except where permitted by law."}],"id":"tc-intellectual-property"},{"n":"14","title":"Website Use and Security","blocks":[{"kind":"p","text":"You agree not to use our website for unlawful activity, fraud, unauthorised access or activities that interfere with the website’s operation or security."},{"kind":"p","text":"We make reasonable efforts to maintain website availability and accuracy but cannot guarantee uninterrupted or error-free operation."},{"kind":"p","text":"Where maintenance or technical issues affect an order, we will take reasonable steps to assist affected customers."}],"id":"tc-website-use-and-security"},{"n":"15","title":"Third-Party Services","blocks":[{"kind":"p","text":"Our online store may use third-party services for payment processing, delivery, website hosting, communications and website analytics."},{"kind":"p","text":"These providers may operate under their own terms and privacy policies."},{"kind":"p","text":"This clause does not exclude our own legal obligations or any rights you may have against us or a service provider under applicable law."}],"id":"tc-third-party-services"},{"n":"16","title":"Privacy and Personal Information","blocks":[{"kind":"p","text":"We handle personal information in accordance with our Privacy Policy and applicable South African data-protection law, including the Protection of Personal Information Act 4 of 2013 (POPIA)."},{"kind":"p","text":"Our Privacy Policy explains what information we collect, why we collect it, how it is used and how you may contact us about your information."}],"id":"tc-privacy-and-personal-information"},{"n":"17","title":"Limitation of Liability","blocks":[{"kind":"p","text":"Nothing in these Terms & Conditions excludes or limits liability where such exclusion or limitation is prohibited by law."},{"kind":"p","text":"Subject to applicable law, we are not responsible for losses arising solely from events beyond our reasonable control. This does not remove any statutory consumer rights or obligations that continue to apply."}],"id":"tc-limitation-of-liability"},{"n":"18","title":"Changes to These Terms","blocks":[{"kind":"p","text":"We may update these Terms & Conditions to reflect changes to our business, website or legal requirements."},{"kind":"p","text":"The latest version will be made available on our website. Changes will not retrospectively remove rights relating to an order already concluded."}],"id":"tc-changes-to-these-terms"},{"n":"19","title":"Governing Law and Disputes","blocks":[{"kind":"p","text":"These Terms & Conditions are governed by the laws of the Republic of South Africa."},{"kind":"p","text":"If you have a concern about an order, please contact us first so that we can attempt to resolve it fairly."},{"kind":"p","text":"Nothing in this section prevents you from exercising applicable statutory rights or using a lawful dispute-resolution process."}],"id":"tc-governing-law-and-disputes"},{"n":"20","title":"Contact Us","blocks":[{"kind":"p","text":"For questions about these Terms & Conditions, orders, delivery, returns or refunds, please contact:"},{"kind":"ul","items":["ZIYA & CO","Trading as ZIYA M HOLDINGS","Email: info@ziyaco.co.za","Telephone/WhatsApp: 063 123 3361","Business location: Pinelands, Cape Town, South Africa","Website: www.ziyaco.co.za"]}],"id":"tc-contact-us"}]};
  var TERMS_VOICE_LINES = {
    "Welcome to ZIYA & CO.": "Welcome to Ziya & Co.",
    "These Terms & Conditions govern your use of our website, www.ziyaco.co.za, and purchases made through our online store.": "These Terms & Conditions govern your use of my website, www.ziyaco.co.za, and purchases made through my online store.",
    "ZIYA & CO is the trading name of ZIYA M HOLDINGS, a business registered in the Republic of South Africa.": "Ziya & Co is the trading name of ZIYA M HOLDINGS, a business registered in the Republic of South Africa.",
    "By using our website or placing an order, you agree to these Terms & Conditions, subject to your rights under applicable law. Please read them carefully before completing your purchase.": "By using my website or placing an order, you agree to these Terms & Conditions, subject to your rights under applicable law. Please read them carefully before completing your purchase.",
    "Trading name: ZIYA & CO": "Trading name: Ziya & Co",
    "ZIYA & CO operates primarily as an online jewellery store. Free collection is available by appointment only in Pinelands, Cape Town.": "Ziya & Co operates primarily as an online jewellery store. Free collection is available by appointment only in Pinelands, Cape Town.",
    "We make reasonable efforts to ensure that product descriptions, photographs, prices and material information displayed on our website are accurate and up to date.": "I make reasonable efforts to ensure that product descriptions, photographs, prices and material information displayed on my website are accurate and up to date.",
    "Our jewellery may be made from different materials, depending on the product. Please refer to the individual product description for the relevant material information.": "My jewellery may be made from different materials, depending on the product. Please refer to the individual product description for the relevant material information.",
    "Product availability is subject to stock. If an item you have ordered becomes unavailable, we will contact you to discuss the appropriate next steps.": "Product availability is subject to stock. If an item you have ordered becomes unavailable, I will contact you to discuss the appropriate next steps.",
    "We may update prices, product descriptions and promotional offers from time to time. Changes will not retrospectively alter an order already concluded.": "I may update prices, product descriptions and promotional offers from time to time. Changes will not retrospectively alter an order already concluded.",
    "When you place an order through our website, you submit a request to purchase the selected products.": "When you place an order through my website, you submit a request to purchase the selected products.",
    "If we cannot fulfil an order, we will notify you and arrange an appropriate refund where payment has already been received, in accordance with applicable law.": "If I cannot fulfil an order, I will notify you and arrange an appropriate refund where payment has already been received, in accordance with applicable law.",
    "We may contact you to clarify order details or resolve a suspected payment or delivery issue.": "I may contact you to clarify order details or resolve a suspected payment or delivery issue.",
    "ZIYA & CO intends to use PayFast as its online payment provider, subject to merchant approval and activation.": "Ziya & Co intends to use PayFast as its online payment provider, subject to merchant approval and activation.",
    "ZIYA & CO does not intentionally store customers’ full payment card details. Payment information is handled through the applicable payment service provider.": "Ziya & Co does not intentionally store customers’ full payment card details. Payment information is handled through the applicable payment service provider.",
    "If a payment fails or cannot be verified, we may contact you before proceeding with the order.": "If a payment fails or cannot be verified, I may contact you before proceeding with the order.",
    "Please allow 1–2 business days for us to process, pack and dispatch your order.": "Please allow 1–2 business days for me to process, pack and dispatch your order.",
    "Processing may take longer during product launches, promotions, public holidays or periods of unusually high order volume. Where a material delay is anticipated, we will endeavour to communicate it to you.": "Processing may take longer during product launches, promotions, public holidays or periods of unusually high order volume. Where a material delay is anticipated, I will endeavour to communicate it to you.",
    "We offer delivery nationwide within South Africa through The Courier Guy, subject to service availability at the delivery address.": "I offer delivery nationwide within South Africa through The Courier Guy, subject to service availability at the delivery address.",
    "Our delivery charges are as follows:": "My delivery charges are as follows:",
    "Delivery times are estimates and are not guaranteed. Delays may occur due to weather, public holidays, courier operational disruptions or other circumstances outside our reasonable control.": "Delivery times are estimates and are not guaranteed. Delays may occur due to weather, public holidays, courier operational disruptions or other circumstances outside my reasonable control.",
    "If a parcel is delayed, lost or delivered incorrectly, please contact us so that we can assist. Nothing in these Terms & Conditions removes any responsibility or consumer remedy that applicable law places on us.": "If a parcel is delayed, lost or delivered incorrectly, please contact me so that I can assist. Nothing in these Terms & Conditions removes any responsibility or consumer remedy that applicable law places on me.",
    "Free collection is available from our collection point in Pinelands, Cape Town, by appointment only.": "Free collection is available from my collection point in Pinelands, Cape Town, by appointment only.",
    "Once your order is ready, we will contact you via SMS or WhatsApp to arrange a convenient collection time.": "Once your order is ready, I will contact you via SMS or WhatsApp to arrange a convenient collection time.",
    "If you notice an error, please contact us as soon as possible at info@ziyaco.co.za or 063 123 3361.": "If you notice an error, please contact me as soon as possible at info@ziyaco.co.za or 063 123 3361.",
    "We will make reasonable efforts to assist if your order has not yet been dispatched. Changes cannot be guaranteed once the parcel has been handed to the courier.": "I will make reasonable efforts to assist if your order has not yet been dispatched. Changes cannot be guaranteed once the parcel has been handed to the courier.",
    "If delivery fails because of incorrect or incomplete information provided by the customer, we will work with the customer and courier to determine the next steps. Any additional delivery charge will be communicated before it is incurred where reasonably practicable and will only be charged where lawful.": "If delivery fails because of incorrect or incomplete information provided by the customer, I will work with the customer and courier to determine the next steps. Any additional delivery charge will be communicated before it is incurred where reasonably practicable and will only be charged where lawful.",
    "We want you to enjoy your ZIYA & CO jewellery.": "I want you to enjoy your Ziya & Co jewellery.",
    "For eligible change-of-mind requests, our standard policy allows customers to request a return or exchange within 7 days of receiving or collecting their order.": "For eligible change-of-mind requests, my standard policy allows customers to request a return or exchange within 7 days of receiving or collecting their order.",
    "Please contact us before sending an item back so that we can provide the relevant return instructions.": "Please contact me before sending an item back so that I can provide the relevant return instructions.",
    "Exchanges are subject to product availability. If the replacement item has a different price, we will explain the price difference before proceeding.": "Exchanges are subject to product availability. If the replacement item has a different price, I will explain the price difference before proceeding.",
    "Please refer to our separate Returns, Refunds & Exchanges Policy for the full procedure.": "Please refer to my separate Returns, Refunds & Exchanges Policy for the full procedure.",
    "If your order arrives damaged, defective or different from what you ordered, please contact us as soon as reasonably possible.": "If your order arrives damaged, defective or different from what you ordered, please contact me as soon as reasonably possible.",
    "We will assess the matter and arrange an appropriate remedy in accordance with applicable South African consumer-protection law.": "I will assess the matter and arrange an appropriate remedy in accordance with applicable South African consumer-protection law.",
    "Our change-of-mind conditions do not override statutory remedies for defective or non-compliant goods.": "My change-of-mind conditions do not override statutory remedies for defective or non-compliant goods.",
    "Unless otherwise stated, the ZIYA & CO brand, logos, original written content, website graphics and other original brand materials are owned by or used with permission by the relevant rights holder.": "Unless otherwise stated, the Ziya & Co brand, logos, original written content, website graphics and other original brand materials are owned by or used with permission by the relevant rights holder.",
    "You agree not to use our website for unlawful activity, fraud, unauthorised access or activities that interfere with the website’s operation or security.": "You agree not to use my website for unlawful activity, fraud, unauthorised access or activities that interfere with the website’s operation or security.",
    "We make reasonable efforts to maintain website availability and accuracy but cannot guarantee uninterrupted or error-free operation.": "I make reasonable efforts to maintain website availability and accuracy but cannot guarantee uninterrupted or error-free operation.",
    "Where maintenance or technical issues affect an order, we will take reasonable steps to assist affected customers.": "Where maintenance or technical issues affect an order, I will take reasonable steps to assist affected customers.",
    "Our online store may use third-party services for payment processing, delivery, website hosting, communications and website analytics.": "My online store may use third-party services for payment processing, delivery, website hosting, communications and website analytics.",
    "This clause does not exclude our own legal obligations or any rights you may have against us or a service provider under applicable law.": "This clause does not exclude my own legal obligations or any rights you may have against me or a service provider under applicable law.",
    "We handle personal information in accordance with our Privacy Policy and applicable South African data-protection law, including the Protection of Personal Information Act 4 of 2013 (POPIA).": "I handle personal information in accordance with my Privacy Policy and applicable South African data-protection law, including the Protection of Personal Information Act 4 of 2013 (POPIA).",
    "Our Privacy Policy explains what information we collect, why we collect it, how it is used and how you may contact us about your information.": "My Privacy Policy explains what information I collect, why I collect it, how it is used and how you may contact me about your information.",
    "Subject to applicable law, we are not responsible for losses arising solely from events beyond our reasonable control. This does not remove any statutory consumer rights or obligations that continue to apply.": "Subject to applicable law, I am not responsible for losses arising solely from events beyond my reasonable control. This does not remove any statutory consumer rights or obligations that continue to apply.",
    "We may update these Terms & Conditions to reflect changes to our business, website or legal requirements.": "I may update these Terms & Conditions to reflect changes to my business, website or legal requirements.",
    "The latest version will be made available on our website. Changes will not retrospectively remove rights relating to an order already concluded.": "The latest version will be made available on my website. Changes will not retrospectively remove rights relating to an order already concluded.",
    "If you have a concern about an order, please contact us first so that we can attempt to resolve it fairly.": "If you have a concern about an order, please contact me first so that I can attempt to resolve it fairly.",
    "ZIYA & CO": "Ziya & Co"
  };
  var TERMS_VOICE_TITLES = {"Contact Us": "Contact me"};
  var TERMS_NOTE = "Ziya & Co isn’t open yet. The sections about orders, payment and delivery apply from 9 December, when I open. The rest, including how you may use this site and what I do with your information, applies today.";

  var PRIVACY_VOICE_LINES = {
    "At ZIYA & CO, your privacy matters to us.": "At Ziya & Co, your privacy matters to me.",
    "This Privacy Policy explains how ZIYA & CO collects, uses, stores and protects your personal information when you visit our website, place an order, contact us or otherwise interact with us.": "This Privacy Policy explains how Ziya & Co collects, uses, stores and protects your personal information when you visit my website, place an order, contact me or otherwise interact with me.",
    "ZIYA & CO respects your right to privacy and is committed to handling your personal information responsibly and in accordance with applicable South African privacy laws, including the Protection of Personal Information Act 4 of 2013 (POPIA).": "I respect your right to privacy and I am committed to handling your personal information responsibly and in accordance with applicable South African privacy laws, including the Protection of Personal Information Act 4 of 2013 (POPIA).",
    "ZIYA & CO is an online jewellery business operating in South Africa.": "Ziya & Co is an online jewellery business operating in South Africa.",
    "For any privacy-related questions, you can contact us at:": "For any privacy-related questions, you can contact me at:",
    "When you interact with ZIYA & CO, we may collect information such as:": "When you interact with Ziya & Co, I may collect information such as:",
    "Communications you have with us": "Communications you have with me",
    "Information you provide when contacting us regarding an order, return or exchange": "Information you provide when contacting me regarding an order, return or exchange",
    "Technical information relating to your use of our website, such as IP address, browser type and device information, where applicable": "Technical information relating to your use of my website, such as IP address, browser type and device information, where applicable",
    "We only request information that is reasonably necessary for the purposes described in this Privacy Policy.": "I only request information that is reasonably necessary for the purposes described in this Privacy Policy.",
    "We may use your personal information to:": "I may use your personal information to:",
    "Improve our website, products and customer experience": "Improve my website, products and customer experience",
    "Meet our legal, accounting and regulatory obligations": "Meet my legal, accounting and regulatory obligations",
    "Payments made through our website may be processed by a third-party payment service provider.": "Payments made through my website may be processed by a third-party payment service provider.",
    "ZIYA & CO does not intentionally store your full payment card details.": "Ziya & Co does not intentionally store your full payment card details.",
    "To fulfil your order, we may need to share certain information with trusted third-party service providers.": "To fulfil your order, I may need to share certain information with trusted third-party service providers.",
    "We only share information that is reasonably necessary for the relevant service to be performed.": "I only share information that is reasonably necessary for the relevant service to be performed.",
    "If you choose to subscribe to our marketing communications, we may use your contact details to send you information about:": "If you choose to subscribe to my marketing communications, I may use your contact details to send you information about:",
    "ZIYA & CO news and updates": "Ziya & Co news and updates",
    "You may unsubscribe from marketing communications at any time by using the unsubscribe option provided in the communication or by contacting us.": "You may unsubscribe from marketing communications at any time by using the unsubscribe option provided in the communication or by contacting me.",
    "Our website may use cookies and similar technologies to help the website function properly, remember preferences, understand website usage and improve your experience.": "My website may use cookies and similar technologies to help the website function properly, remember preferences, understand website usage and improve your experience.",
    "Some cookies may also be placed by third-party services used on our website, such as payment, analytics or marketing providers.": "Some cookies may also be placed by third-party services used on my website, such as payment, analytics or marketing providers.",
    "We take reasonable and appropriate measures to protect personal information against loss, misuse, unauthorised access, disclosure, alteration or destruction.": "I take reasonable and appropriate measures to protect personal information against loss, misuse, unauthorised access, disclosure, alteration or destruction.",
    "If we become aware of a security compromise involving your personal information, we will take appropriate steps in accordance with applicable law.": "If I become aware of a security compromise involving your personal information, I will take appropriate steps in accordance with applicable law.",
    "We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, or where retention is required or permitted by law.": "I retain personal information only for as long as reasonably necessary for the purposes for which it was collected, or where retention is required or permitted by law.",
    "Request access to personal information we hold about you": "Request access to personal information I hold about you",
    "Request deletion of information where there is no lawful reason for us to continue retaining it": "Request deletion of information where there is no lawful reason for me to continue retaining it",
    "We may need to verify your identity before processing certain requests.": "I may need to verify your identity before processing certain requests.",
    "Our website may contain links to third-party websites or services.": "My website may contain links to third-party websites or services.",
    "ZIYA & CO is not responsible for the privacy practices, security or content of third-party websites. We recommend reviewing the privacy policies of those websites before providing them with personal information.": "Ziya & Co is not responsible for the privacy practices, security or content of third-party websites. I recommend reviewing the privacy policies of those websites before providing them with personal information.",
    "Our website is not intended to knowingly collect personal information from children without the appropriate consent required by law.": "My website is not intended to knowingly collect personal information from children without the appropriate consent required by law.",
    "If you believe that a child has provided personal information to us without the required consent, please contact us so that we can investigate and take appropriate action.": "If you believe that a child has provided personal information to me without the required consent, please contact me so that I can investigate and take appropriate action.",
    "We may update this Privacy Policy from time to time to reflect changes to our business, website, technology or legal requirements.": "I may update this Privacy Policy from time to time to reflect changes to my business, website, technology or legal requirements.",
    "The latest version will always be made available on our website.": "The latest version will always be made available on my website.",
    "If you have any questions, concerns or requests regarding your personal information or this Privacy Policy, please contact us:": "If you have any questions, concerns or requests regarding your personal information or this Privacy Policy, please contact me:",
    "ZIYA & CO": "Ziya & Co",
    "We value your trust and are committed to protecting your information while providing you with a beautiful ZIYA & CO experience.": "I value your trust and I am committed to protecting your information while providing you with a beautiful Ziya & Co experience."
  };
  var PRIVACY_VOICE_TITLES = {
    "WHO WE ARE": "Who I am",
    "INFORMATION WE COLLECT": "Information I collect",
    "HOW WE USE YOUR INFORMATION": "How I use your information",
    "PAYMENT INFORMATION": "Payment information",
    "DELIVERY PARTNERS AND SERVICE PROVIDERS": "Delivery partners and service providers",
    "MARKETING": "Marketing",
    "COOKIES": "Cookies",
    "HOW WE PROTECT YOUR INFORMATION": "How I protect your information",
    "HOW LONG WE KEEP YOUR INFORMATION": "How long I keep your information",
    "YOUR PRIVACY RIGHTS": "Your privacy rights",
    "THIRD-PARTY WEBSITES": "Third-party websites",
    "CHILDREN'S INFORMATION": "Children's information",
    "CHANGES TO THIS PRIVACY POLICY": "Changes to this privacy policy",
    "CONTACT US": "Contact me"
  };
  var RETURNS_VOICE_LINES = {
    "At ZIYA & CO, we want you to love every piece you receive.": "At Ziya & Co, I want you to love every piece you receive.",
    "We understand that sometimes a piece may not be quite what you expected, so we offer a 7-day return and exchange period for eligible purchases.": "I understand that sometimes a piece may not be quite what you expected, so I offer a 7-day return and exchange period for eligible purchases.",
    "Please contact us within the 7-day period before sending any item back. We will provide you with the relevant return or exchange instructions.": "Please contact me within the 7-day period before sending any item back. I will provide you with the relevant return or exchange instructions.",
    "We are happy to assist with an exchange where the requested replacement item is available.": "I am happy to assist with an exchange where the requested replacement item is available.",
    "If the replacement item has a different price, we will advise you of any applicable difference before processing the exchange.": "If the replacement item has a different price, I will advise you of any applicable difference before processing the exchange.",
    "If your order arrives damaged, defective, or you receive an item different from what you ordered, please contact us as soon as possible.": "If your order arrives damaged, defective, or you receive an item different from what you ordered, please contact me as soon as possible.",
    "Please send us:": "Please send me:",
    "We will assess the issue and work with you to resolve it.": "I will assess the issue and work with you to resolve it.",
    "For purchases made through our online store, statutory cancellation and cooling-off rights that apply to electronic transactions will remain unaffected by this policy.": "For purchases made through my online store, statutory cancellation and cooling-off rights that apply to electronic transactions will remain unaffected by this policy.",
    "Where a statutory cooling-off right applies, ZIYA & CO will process the cancellation and refund in accordance with applicable law.": "Where a statutory cooling-off right applies, Ziya & Co will process the cancellation and refund in accordance with applicable law.",
    "Once an eligible return has been received and inspected, we will confirm whether the return has been approved.": "Once an eligible return has been received and inspected, I will confirm whether the return has been approved.",
    "If you have any questions about a return or exchange, please contact us:": "If you have any questions about a return or exchange, please contact me:",
    "We're here to help make your ZIYA & CO experience as beautiful as possible.": "I’m here to help make your Ziya & Co experience as beautiful as possible."
  };

  /* what of the privacy policy applies before the shop opens */
  var PRIVACY_LAUNCH_SECTIONS = ["4", "5", "7", "11"];
  var PRIVACY_LAUNCH_LINES = [
    "Transactional communications, such as order confirmations and delivery updates, are not marketing communications and may still be sent when necessary to fulfil your order.",
    "This Privacy Policy explains how ZIYA & CO collects, uses, stores and protects your personal information when you visit our website, place an order, contact us or otherwise interact with us."
  ];
  var PRIVACY_LAUNCH_ITEMS = [
    "Your name and surname",
    "Telephone or mobile number",
    "Billing and delivery address",
    "Order and purchase information",
    "Payment-related information necessary to process your transaction",
    "Information you provide when contacting us regarding an order, return or exchange",
    "Process and fulfil your orders",
    "Process payments",
    "Arrange delivery or collection",
    "Communicate with you regarding your order",
    "Process returns, refunds and exchanges"
  ];

  var DOCS = [
    {
      hash: "privacy",
      label: "Privacy",
      title: "Privacy policy",
      data: PRIVACY_DATA,
      note: "Ziya & Co isn’t open yet. The only thing I collect today is the email address you leave for the launch note, so that is all this policy covers. The parts about orders, payments and delivery come back when I open on 9 December.",
      voiceLines: PRIVACY_VOICE_LINES,
      voiceTitles: PRIVACY_VOICE_TITLES,
      launchSections: PRIVACY_LAUNCH_SECTIONS,
      launchLines: PRIVACY_LAUNCH_LINES,
      launchItems: PRIVACY_LAUNCH_ITEMS
    },
    {
      hash: "terms",
      label: "Terms",
      title: "Terms & conditions",
      data: TERMS_DATA,
      note: TERMS_NOTE,
      voiceLines: TERMS_VOICE_LINES,
      voiceTitles: TERMS_VOICE_TITLES,
      /* nothing is withheld. Most of it waits for the shop to open, but the
         sections on using the site, intellectual property and privacy apply
         today, so the note explains which is which rather than hiding any */
      launchSections: [],
      launchLines: [],
      launchItems: []
    },
    {
      hash: "returns",
      label: "Returns",
      title: "Returns & exchanges",
      data: RETURNS_DATA,
      note: "Ziya & Co isn’t open yet, so there is nothing to return yet. This is the policy that applies to every order from 9 December, when I open.",
      voiceLines: RETURNS_VOICE_LINES,
      voiceTitles: {},
      /* nothing is withheld: the whole policy is about orders, so the note
         says plainly that it applies from 9 December */
      launchSections: [],
      launchLines: [],
      launchItems: []
    }
  ];

  /* each document's section ids carry their own prefix, so two documents
     can never collide on an anchor */
  var PREFIXES = { privacy: "pp", returns: "rt", terms: "tc" };

  function docForHash(hash) {
    var want = String(hash || "").replace(/^#/, "");
    for (var i = 0; i < DOCS.length; i++) {
      if (DOCS[i].hash === want) return DOCS[i];
    }
    return null;
  }

  function has(obj, k) {
    return Object.prototype.hasOwnProperty.call(obj, k);
  }

  /* trailing pictographs are dropped, then her wording wins where given */
  function plainIn(doc, s) {
    var t = String(s)
      .replace(/[\s\uFE0F\u2600-\u27BF]+$/, "")
      .replace(/(?:[\uD83C-\uDBFF][\uDC00-\uDFFF]|[\s\uFE0F])+$/, "");
    return has(doc.voiceLines, t) ? doc.voiceLines[t] : t;
  }

  function titleIn(doc, s) {
    if (has(doc.voiceTitles, s)) return doc.voiceTitles[s];
    var lower = s.toLocaleLowerCase();
    return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
  }

  function slugOf(prefix, title) {
    return prefix + "-" + title.toLowerCase()
      .replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
  }

  /* sections numbered as they appear, so a reader never sees a gap where a
     withheld section used to be */
  function sectionsInScope(doc) {
    if (SHOP_OPEN) return doc.data.sections;
    return doc.data.sections
      .filter(function (s) { return doc.launchSections.indexOf(s.n) === -1; })
      .map(function (s) {
        var blocks = s.blocks
          .map(function (b) {
            if (b.kind !== "ul") return b;
            return {
              kind: "ul",
              items: b.items.filter(function (it) {
                return doc.launchItems.indexOf(it) === -1;
              })
            };
          })
          .filter(function (b) {
            return b.kind === "ul"
              ? b.items.length > 0
              : doc.launchLines.indexOf(b.text) === -1;
          });
        return { n: s.n, title: s.title, blocks: blocks };
      });
  }

  function buildDoc(doc) {
    var reduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    var el = function (tag, cls) {
      var n = document.createElement(tag);
      if (cls) n.className = cls;
      return n;
    };

    var pp = el("div", "pp");
    pp.setAttribute("role", "dialog");
    pp.setAttribute("aria-modal", "true");
    pp.setAttribute("aria-labelledby", "pp-title");
    pp.tabIndex = -1;

    var bar = el("header", "pp__bar");
    var mark = el("span", "wordmark pp__mark");
    mark.innerHTML = 'ZIYA <span class="amp">&amp;</span> CO';
    var close = el("button", "btn btn--line pp__close");
    close.type = "button";
    close.textContent = "Close";
    bar.appendChild(mark);
    bar.appendChild(close);
    pp.appendChild(bar);

    var scroll = el("div", "pp__scroll");
    var inner = el("div", "pp__inner");

    var head = el("div", "pp__head");
    var label = el("p", "label");
    label.textContent = doc.label;
    var h2 = el("h2", "display");
    h2.id = "pp-title";
    h2.textContent = doc.title;
    head.appendChild(label);
    head.appendChild(h2);
    if (!SHOP_OPEN && doc.note) {
      /* plain fact rather than legal wording, and the only thing on the
         panel that is not the brand document's own text */
      var note = el("p", "pp__note");
      note.textContent = doc.note;
      head.appendChild(note);
    }
    doc.data.intro.filter(function (t) {
      return SHOP_OPEN || doc.launchLines.indexOf(t) === -1;
    }).forEach(function (t) {
      var p = el("p", "pp__lede");
      p.textContent = plainIn(doc, t);
      head.appendChild(p);
    });
    inner.appendChild(head);

    var body = el("div", "pp__body");
    var SECTIONS = sectionsInScope(doc);
    var prefix = PREFIXES[doc.hash] || "doc";

    var nav = el("nav", "pp__toc");
    nav.setAttribute("aria-label", doc.title + " sections");
    var ol = document.createElement("ol");
    var links = {};

    function markCurrent(id) {
      Object.keys(links).forEach(function (k) {
        if (k === id) links[k].setAttribute("aria-current", "true");
        else links[k].removeAttribute("aria-current");
      });
    }

    SECTIONS.forEach(function (s, i) {
      var id = slugOf(prefix, s.title);
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + id;
      var num = el("span", "pp__toc-n");
      num.textContent = String(i + 1);
      a.appendChild(num);
      a.appendChild(document.createTextNode(titleIn(doc, s.title)));
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var target = scroll.querySelector("#" + id);
        if (!target) return;
        target.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start"
        });
        markCurrent(id);
      });
      links[id] = a;
      li.appendChild(a);
      ol.appendChild(li);
    });
    nav.appendChild(ol);
    body.appendChild(nav);

    var docEl = el("div", "pp__doc");
    SECTIONS.forEach(function (s, i) {
      var sec = document.createElement("section");
      sec.id = slugOf(prefix, s.title);
      var h3 = document.createElement("h3");
      var n = el("span", "pp__n");
      n.setAttribute("aria-hidden", "true");
      n.textContent = String(i + 1);
      h3.appendChild(n);
      h3.appendChild(document.createTextNode(titleIn(doc, s.title)));
      sec.appendChild(h3);
      s.blocks.forEach(function (b) {
        if (b.kind === "ul") {
          var ul = el("ul", "pp__list");
          b.items.forEach(function (it) {
            var li2 = document.createElement("li");
            li2.textContent = plainIn(doc, it);
            ul.appendChild(li2);
          });
          sec.appendChild(ul);
        } else {
          var p = document.createElement("p");
          p.textContent = plainIn(doc, b.text);
          sec.appendChild(p);
        }
      });
      docEl.appendChild(sec);
    });
    body.appendChild(docEl);

    inner.appendChild(body);
    scroll.appendChild(inner);
    pp.appendChild(scroll);

    if (SECTIONS.length) markCurrent(slugOf(prefix, SECTIONS[0].title));

    /* which section the reader is in, for the contents list beside it */
    if (typeof IntersectionObserver !== "undefined") {
      var io = new IntersectionObserver(
        function (entries) {
          var seen = entries
            .filter(function (e) { return e.isIntersecting; })
            .sort(function (a, b) {
              return a.boundingClientRect.top - b.boundingClientRect.top;
            })[0];
          if (seen && seen.target.id) markCurrent(seen.target.id);
        },
        { root: scroll, rootMargin: "-10% 0px -70% 0px", threshold: 0 }
      );
      docEl.querySelectorAll("section[id]").forEach(function (s) {
        io.observe(s);
      });
    }

    return { node: pp, close: close };
  }

  /* one panel at a time, opened and closed by the hash */
  var openPanel = null;

  function showDoc(doc) {
    if (openPanel) openPanel.shut(true);
    var built = buildDoc(doc);
    document.body.appendChild(built.node);
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    built.node.focus();

    function shut(keepHash) {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (built.node.parentNode) built.node.parentNode.removeChild(built.node);
      openPanel = null;
      if (!keepHash && docForHash(window.location.hash)) {
        /* replace rather than push, so Back does not walk through reopenings */
        if (window.history && window.history.replaceState) {
          window.history.replaceState(
            null, "", window.location.pathname + window.location.search
          );
        } else {
          window.location.hash = "";
        }
      }
    }

    function onKey(e) {
      if (e.key === "Escape" || e.keyCode === 27) {
        e.preventDefault();
        shut();
        return;
      }
      if (e.key !== "Tab" && e.keyCode !== 9) return;
      var stops = [].slice
        .call(built.node.querySelectorAll("a[href], button:not([disabled])"))
        .filter(function (el2) { return el2.offsetParent !== null; });
      if (!stops.length) return;
      var first = stops[0];
      var last = stops[stops.length - 1];
      if (e.shiftKey && (document.activeElement === first ||
                         document.activeElement === built.node)) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", onKey);
    built.close.addEventListener("click", function () { shut(); });
    openPanel = { shut: shut };
  }

  safely(function () {
    var byHash = function () {
      var doc = docForHash(window.location.hash);
      if (doc) showDoc(doc);
      else if (openPanel) openPanel.shut(true);
    };
    window.addEventListener("hashchange", byHash);
    byHash();
  });

})();
