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
     The privacy policy, as a full-screen reading panel.

     Same bargain as the React build: the panel is opened by the #privacy
     hash, so every link to it is an ordinary anchor that can be copied and
     shared, and the address bar says where you are. The policy text below
     is generated from the brand document rather than retyped, and keeps the
     document's own plural voice: the rest of the site speaks as Ziyanda,
     but this is a legal instrument and its pronouns are not ours to
     restyle.
     ------------------------------------------------------------------ */
  var PRIVACY_DATA = {"updated":"September 2026","intro":["At ZIYA & CO, your privacy matters to us.","This Privacy Policy explains how ZIYA & CO collects, uses, stores and protects your personal information when you visit our website, place an order, contact us or otherwise interact with us.","ZIYA & CO respects your right to privacy and is committed to handling your personal information responsibly and in accordance with applicable South African privacy laws, including the Protection of Personal Information Act 4 of 2013 (POPIA)."],"sections":[{"n":"1","title":"WHO WE ARE","blocks":[{"kind":"p","text":"ZIYA & CO is an online jewellery business operating in South Africa."},{"kind":"p","text":"For any privacy-related questions, you can contact us at:"},{"kind":"ul","items":["Email: info@ziyaco.co.za"]}],"id":"pp-who-we-are"},{"n":"2","title":"INFORMATION WE COLLECT","blocks":[{"kind":"p","text":"When you interact with ZIYA & CO, we may collect information such as:"},{"kind":"ul","items":["Your name and surname","Email address","Telephone or mobile number","Billing and delivery address","Order and purchase information","Payment-related information necessary to process your transaction","Communications you have with us","Information you provide when contacting us regarding an order, return or exchange","Technical information relating to your use of our website, such as IP address, browser type and device information, where applicable"]},{"kind":"p","text":"We only request information that is reasonably necessary for the purposes described in this Privacy Policy."}],"id":"pp-information-we-collect"},{"n":"3","title":"HOW WE USE YOUR INFORMATION","blocks":[{"kind":"p","text":"We may use your personal information to:"},{"kind":"ul","items":["Process and fulfil your orders","Process payments","Arrange delivery or collection","Communicate with you regarding your order","Provide customer support","Process returns, refunds and exchanges","Respond to enquiries","Improve our website, products and customer experience","Detect and prevent fraud, abuse or other unlawful activity","Meet our legal, accounting and regulatory obligations","Send marketing communications where permitted by law and where you have provided the required consent"]}],"id":"pp-how-we-use-your-information"},{"n":"4","title":"PAYMENT INFORMATION","blocks":[{"kind":"p","text":"Payments made through our website may be processed by a third-party payment service provider."},{"kind":"p","text":"ZIYA & CO does not intentionally store your full payment card details."},{"kind":"p","text":"Payment information is handled by the relevant payment provider in accordance with its own security and privacy practices."}],"id":"pp-payment-information"},{"n":"5","title":"DELIVERY PARTNERS AND SERVICE PROVIDERS","blocks":[{"kind":"p","text":"To fulfil your order, we may need to share certain information with trusted third-party service providers."},{"kind":"p","text":"For example, your name, contact details and delivery address may be provided to a courier responsible for delivering your order."},{"kind":"p","text":"We only share information that is reasonably necessary for the relevant service to be performed."}],"id":"pp-delivery-partners-and-service-providers"},{"n":"6","title":"MARKETING","blocks":[{"kind":"p","text":"If you choose to subscribe to our marketing communications, we may use your contact details to send you information about:"},{"kind":"ul","items":["New collections","Product launches","Special offers","Promotions","ZIYA & CO news and updates"]},{"kind":"p","text":"You may unsubscribe from marketing communications at any time by using the unsubscribe option provided in the communication or by contacting us."},{"kind":"p","text":"Transactional communications, such as order confirmations and delivery updates, are not marketing communications and may still be sent when necessary to fulfil your order."}],"id":"pp-marketing"},{"n":"7","title":"COOKIES","blocks":[{"kind":"p","text":"Our website may use cookies and similar technologies to help the website function properly, remember preferences, understand website usage and improve your experience."},{"kind":"p","text":"Some cookies may also be placed by third-party services used on our website, such as payment, analytics or marketing providers."},{"kind":"p","text":"You can manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the website."}],"id":"pp-cookies"},{"n":"8","title":"HOW WE PROTECT YOUR INFORMATION","blocks":[{"kind":"p","text":"We take reasonable and appropriate measures to protect personal information against loss, misuse, unauthorised access, disclosure, alteration or destruction."},{"kind":"p","text":"However, no online transmission or electronic storage system can be guaranteed to be completely secure."},{"kind":"p","text":"If we become aware of a security compromise involving your personal information, we will take appropriate steps in accordance with applicable law."}],"id":"pp-how-we-protect-your-information"},{"n":"9","title":"HOW LONG WE KEEP YOUR INFORMATION","blocks":[{"kind":"p","text":"We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, or where retention is required or permitted by law."},{"kind":"p","text":"Certain information relating to transactions may need to be retained for accounting, tax, legal or regulatory purposes."}],"id":"pp-how-long-we-keep-your-information"},{"n":"10","title":"YOUR PRIVACY RIGHTS","blocks":[{"kind":"p","text":"Subject to applicable law, you may have the right to:"},{"kind":"ul","items":["Request access to personal information we hold about you","Request correction or updating of inaccurate information","Request deletion of information where there is no lawful reason for us to continue retaining it","Object to certain forms of processing","Withdraw consent where processing is based on consent","Ask questions about how your personal information is being used"]},{"kind":"p","text":"Requests can be submitted to:"},{"kind":"ul","items":["info@ziyaco.co.za"]},{"kind":"p","text":"We may need to verify your identity before processing certain requests."}],"id":"pp-your-privacy-rights"},{"n":"11","title":"THIRD-PARTY WEBSITES","blocks":[{"kind":"p","text":"Our website may contain links to third-party websites or services."},{"kind":"p","text":"ZIYA & CO is not responsible for the privacy practices, security or content of third-party websites. We recommend reviewing the privacy policies of those websites before providing them with personal information."}],"id":"pp-third-party-websites"},{"n":"12","title":"CHILDREN'S INFORMATION","blocks":[{"kind":"p","text":"Our website is not intended to knowingly collect personal information from children without the appropriate consent required by law."},{"kind":"p","text":"If you believe that a child has provided personal information to us without the required consent, please contact us so that we can investigate and take appropriate action."}],"id":"pp-children-s-information"},{"n":"13","title":"CHANGES TO THIS PRIVACY POLICY","blocks":[{"kind":"p","text":"We may update this Privacy Policy from time to time to reflect changes to our business, website, technology or legal requirements."},{"kind":"p","text":"The latest version will always be made available on our website."}],"id":"pp-changes-to-this-privacy-policy"},{"n":"14","title":"CONTACT US","blocks":[{"kind":"p","text":"If you have any questions, concerns or requests regarding your personal information or this Privacy Policy, please contact us:"},{"kind":"ul","items":["ZIYA & CO","Email: info@ziyaco.co.za"]},{"kind":"p","text":"We value your trust and are committed to protecting your information while providing you with a beautiful ZIYA & CO experience. 🤍"}],"id":"pp-contact-us"}]};

  function sentenceCase(s) {
    var lower = s.toLocaleLowerCase();
    return lower.charAt(0).toLocaleUpperCase() + lower.slice(1);
  }

  function slugOf(title) {
    return "pp-" + title.toLowerCase().replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  function buildPrivacy() {
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
    label.textContent = "Privacy";
    var h2 = el("h2", "display");
    h2.id = "pp-title";
    h2.textContent = "Privacy policy";
    var meta = el("p", "pp__meta");
    meta.textContent = "Last updated " + PRIVACY_DATA.updated;
    head.appendChild(label);
    head.appendChild(h2);
    head.appendChild(meta);
    PRIVACY_DATA.intro.forEach(function (t) {
      var p = el("p", "pp__lede");
      p.textContent = t;
      head.appendChild(p);
    });
    inner.appendChild(head);

    var body = el("div", "pp__body");

    var nav = el("nav", "pp__toc");
    nav.setAttribute("aria-label", "Privacy policy sections");
    var ol = document.createElement("ol");
    var links = {};
    PRIVACY_DATA.sections.forEach(function (s) {
      var id = slugOf(s.title);
      var li = document.createElement("li");
      var a = document.createElement("a");
      a.href = "#" + id;
      var num = el("span", "pp__toc-n");
      num.textContent = s.n;
      a.appendChild(num);
      a.appendChild(document.createTextNode(sentenceCase(s.title)));
      a.addEventListener("click", function (e) {
        e.preventDefault();
        var target = scroll.querySelector("#" + id);
        if (!target) return;
        target.scrollIntoView({
          behavior: reduced ? "auto" : "smooth",
          block: "start"
        });
        mark_current(id);
      });
      links[id] = a;
      li.appendChild(a);
      ol.appendChild(li);
    });
    nav.appendChild(ol);
    body.appendChild(nav);

    function mark_current(id) {
      Object.keys(links).forEach(function (k) {
        if (k === id) links[k].setAttribute("aria-current", "true");
        else links[k].removeAttribute("aria-current");
      });
    }

    var doc = el("div", "pp__doc");
    PRIVACY_DATA.sections.forEach(function (s) {
      var sec = document.createElement("section");
      sec.id = slugOf(s.title);
      var h3 = document.createElement("h3");
      var n = el("span", "pp__n");
      n.setAttribute("aria-hidden", "true");
      n.textContent = s.n;
      h3.appendChild(n);
      h3.appendChild(document.createTextNode(sentenceCase(s.title)));
      sec.appendChild(h3);
      s.blocks.forEach(function (b) {
        if (b.kind === "ul") {
          var ul = el("ul", "pp__list");
          b.items.forEach(function (it) {
            var li = document.createElement("li");
            li.textContent = it;
            ul.appendChild(li);
          });
          sec.appendChild(ul);
        } else {
          var p = document.createElement("p");
          p.textContent = b.text;
          sec.appendChild(p);
        }
      });
      doc.appendChild(sec);
    });
    body.appendChild(doc);

    inner.appendChild(body);
    scroll.appendChild(inner);
    pp.appendChild(scroll);

    mark_current(slugOf(PRIVACY_DATA.sections[0].title));

    /* which section the reader is in, for the contents list beside it */
    if (typeof IntersectionObserver !== "undefined") {
      var io = new IntersectionObserver(
        function (entries) {
          var seen = entries
            .filter(function (e) { return e.isIntersecting; })
            .sort(function (a, b) {
              return a.boundingClientRect.top - b.boundingClientRect.top;
            })[0];
          if (seen && seen.target.id) mark_current(seen.target.id);
        },
        { root: scroll, rootMargin: "-10% 0px -70% 0px", threshold: 0 }
      );
      doc.querySelectorAll("section[id]").forEach(function (s) {
        io.observe(s);
      });
    }

    return { node: pp, close: close };
  }

  /* one panel at a time, opened and closed by the hash */
  var ppOpen = null;

  function showPrivacy() {
    if (ppOpen) return;
    var built = buildPrivacy();
    document.body.appendChild(built.node);
    var prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    built.node.focus();

    function shut() {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
      if (built.node.parentNode) built.node.parentNode.removeChild(built.node);
      ppOpen = null;
      if (window.location.hash === "#privacy") {
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
    built.close.addEventListener("click", shut);
    ppOpen = { shut: shut };
  }

  safely(function () {
    var byHash = function () {
      if (window.location.hash === "#privacy") showPrivacy();
      else if (ppOpen) ppOpen.shut();
    };
    window.addEventListener("hashchange", byHash);
    byHash();
  });

})();
