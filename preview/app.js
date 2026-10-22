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

  var LAUNCH = new Date("2026-12-09T00:00:00+02:00"); // SAST
  /* Paste the Apps Script Web App URL between the quotes, e.g.
     "https://script.google.com/macros/s/AKfycb..../exec" */
  var ENDPOINT_HERE = "";

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

    var speed = parseInt(el.getAttribute("data-speed"), 10) || 36;
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
      var rest = /[,.]/.test(just) ? 160 : /\s/.test(just) ? 40 : 0;
      window.setTimeout(step, speed + rest + Math.random() * 18);
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
      /* only now does the finished line hand over to the typed one */
      el.setAttribute("data-typing", "true");
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
          " minutes until Ziya and Co. opens on 9 December 2026.";
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

    form.addEventListener("submit", function (e) {
      e.preventDefault();
      if (busy) return; // no double submissions while one is in flight

      if (trap && trap.value) {
        setStatus("Thank you. We will write to you on 9 December.");
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
          "Almost there. We have opened an email for you, ready to send. " +
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
          setStatus("Thank you. We will write to you on 9 December.");
        })
        .catch(function () {
          setStatus(
            "Something went wrong on our side. Please try again, or write " +
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
})();
