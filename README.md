# Ziya & Co. — Coming Soon

A single-page coming-soon site for Ziya & Co., launching **9 December 2026**.
React + TypeScript + Vite, with a live countdown and an email-capture form.

Built to the Ziya & Co. brand guidelines, Volume 01: Warm Ivory ground,
Bodoni Moda for the voice, Montserrat for the facts, and Muted Gold used only
as a graphic accent. Nothing is rounded and nothing casts a shadow.

The dark is taupe rather than the guidelines' Deep Chocolate. See **The
palette** below for what that changed and why.

---

## Quick start

```bash
npm install          # install dependencies
npm run dev          # development server, http://localhost:5173
npm run build        # typecheck, then production build into dist/
npm run preview      # serve the production build locally
npm run typecheck    # tsc --noEmit on its own
```

Node 18 or newer.

---

## The email form

The form is always on the page. Where it sends depends on one setting.

**Until an endpoint is set**, it still works rather than pretending: it
validates the address, then opens a pre-addressed email to
`info@ziyaco.co.za` so the name can be added by hand. Nothing is ever
collected and quietly dropped. The notice about what needs configuring goes
to the browser console, not onto the page.

### Wiring up Google Apps Script

1. Make a Google Sheet with a tab named `Subscribers`. Copy its ID out of the
   URL: `docs.google.com/spreadsheets/d/`**`THIS_PART`**`/edit`.
2. In that sheet, **Extensions → Apps Script**, and replace the file with:

```js
const SHEET_ID   = 'PASTE_THE_SHEET_ID_HERE';
const SHEET_NAME = 'Subscribers';

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);

    // the page never sends this field; a robot that posts straight to the
    // endpoint will. Answer it like anyone else and write nothing.
    if (String(data.company || '').trim()) return json({ ok: true });

    const email = String(data.email || '').trim().toLowerCase();

    // validated again here: the browser check is a courtesy, not a guard
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) {
      return json({ ok: false, error: 'invalid email' });
    }

    const sheet = SpreadsheetApp.openById(SHEET_ID).getSheetByName(SHEET_NAME);
    const rows  = sheet.getLastRow();
    const seen  = rows > 0
      ? sheet.getRange(1, 1, rows, 1).getValues().map(r => String(r[0]).trim().toLowerCase())
      : [];

    // a second submission of the same address is a success, not a duplicate row
    if (seen.indexOf(email) === -1) sheet.appendRow([email, new Date()]);

    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  }
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. **Deploy → New deployment → Web app**, with **Execute as: Me** and
   **Who has access: Anyone**. Both matter: "Anyone with Google account" will
   reject visitors.
4. Copy the `/exec` URL and paste it into `ENDPOINT_HERE` in `src/config.ts`,
   or put it in `.env` as `VITE_SIGNUP_ENDPOINT` to keep it out of the
   repository. For the standalone preview, paste it into `ENDPOINT_HERE` at
   the top of `preview/app.js`.
5. Re-deploy after any edit to the script. Apps Script serves the last
   deployed version, not the last saved one, which is the usual reason a
   change appears to do nothing.

### Why the request is sent as text/plain

Apps Script does not answer a CORS preflight. A `Content-Type:
application/json` body triggers one, so the browser blocks the request before
it is ever sent. Sending the same JSON as `text/plain;charset=utf-8` keeps it
a "simple request", which needs no preflight, and the script still reads it
with `e.postData.contents`.

Avoid the `mode: "no-cors"` workaround found in a lot of tutorials. It makes
the request succeed silently but the response unreadable, so the page cannot
tell a saved address from a failed one, which is exactly the silent discard
this form is built to avoid.

### Any other provider

The same endpoint setting takes a Mailchimp, Klaviyo, Buttondown, Formspree
or Netlify form URL. Those accept the `text/plain` body as well; if one
insists on `application/json`, change the single `Content-Type` header in
`src/components/Notify.tsx` and `preview/app.js`.

---

## Project layout

```
index.html                 document shell, metadata, font links
src/
  main.tsx                 entry point
  App.tsx                  page composition
  config.ts                launch date, contact address, signup endpoint
  components/
    SiteHeader.tsx         sticky header, anchor nav, mobile sheet
    Hero.tsx               headline, lede, actions, hero image
    Story.tsx              the brand copy, plus the statement band
    Audience.tsx           who it is for, three columns
    Countdown.tsx          live countdown to launch
    Notify.tsx             email capture
    SiteFooter.tsx         wordmark, tagline, contact
    Wordmark.tsx           ZIYA & CO, with the italic swash ampersand
    Reveal.tsx             fade-up on first sight
  hooks/
    useCountdown.ts        ticks once a second, stops at zero
    useReveal.ts           IntersectionObserver, honours reduced motion
  styles/global.css        all styling: tokens, scale, components
public/
  img/                     hero (native size, webp + jpg), monogram, favicons
  favicon.ico
Ziya-and-Co-Coming-Soon-preview.html    self-contained preview, no build needed
```

---

## The palette

Built from the two brand colours, Taffet and Bram.

```
--taffet     #f0d4c3   the brand blush, as a supporting band
--bram       #6c7b7b   the brand sage: large display type and rules
--shell      #faf1ea   Taffet lightened, the page ground
--sage-deep  #4e5a5a   Bram deepened, the dark sections
--ink        #3a4444   Bram at its deepest, for body copy
```

The two supplied colours cannot carry the site on their own, and the
measurements say why:

| | |
|---|---|
| Bram on Taffet | **3.13:1** — large display type only |
| Bram as a background, with Taffet on it | **3.13:1** — same |
| Bram as a background, with pure white on it | **4.41:1** — still short of AA |

So Bram appears at full strength wherever it is large or decorative: the hero
and section headings, the rules, the hairlines. It is lightened into the page
ground and deepened for the dark sections and for body copy. Both brand
colours are present untouched, as the blush band and as the headings.

Two consequences worth knowing if the palette is edited:

1. **Nothing under 24px is ever set in Bram.** On the ground it measures
   3.96:1, which carries large text and nothing else. The profile headings
   clamp to 25px on a phone, so they are set in the ink rather than Bram.
2. **Small text on the blush band takes the ink at full strength.** Held back
   even to 78% it drops to 4.26:1 there.

---|---|---|
| warm taupe `#81766a` | 4.01:1 | below AA for small text |
| muted gold `#b49a72` | 2.43:1 | below AA for any text |
| soft champagne `#e8ded0` | 1.20:1 | too close to stand alone as a plane |

So **taupe and gold set rules rather than words** on the light ground, the
**champagne band is edged top and bottom** with a hairline so it reads as a
deliberate plane rather than a misprint, and **secondary copy is the ink held
back to 72%**, which measures 5.86:1.

Gold does set type in one place: on espresso it reads 5.76:1, so the small
labels inside the dark sections are gold. On espresso, body copy is champagne
at 11.66:1 and headings are ivory at 14.03:1.

---

## Changing the launch date

`src/config.ts` holds `LAUNCH_ISO` (South African Standard Time, UTC+2) and
`LAUNCH_LABEL`. Change both and every mention on the page follows.

---

## Saving the page as a PDF

`global.css` carries a print stylesheet, so **File → Print → Save as PDF**
from any browser produces a clean export: the sticky header is released, the
entrance animation is skipped, the backgrounds are laid down, the desktop
composition is held whatever the paper width, and nothing that reads as a
unit is split across a sheet. Choose landscape and switch background graphics
on.

`Ziya-and-Co-Coming-Soon.pdf` in this folder was produced that way, at
1440 x 900 so each sheet is one screen of the site.

**Its headline face is a stand-in.** The machine that produced it cannot
reach Google Fonts, so Bodoni Moda and Montserrat fell back to Latin Modern
Roman and Poppins. Printing the page yourself, on a machine that can load the
fonts, gives the true typography. See **Typefaces** below.

---

## Typefaces

**Cormorant Garamond** for display, **DM Sans** for everything else, both from
Google Fonts in `index.html`, both free under the Open Font Licence. Fallbacks
are declared in `--display` and `--sans`.

Two things to know. First, the brand guidelines specify **Bodoni Moda** and
**Montserrat**; this build uses the pair named in the refinement brief
instead. Second, Cormorant Garamond is a Garamond revival, not a Didone, so it
is lower in stroke contrast than the guidelines describe. Swapping back is a
two-line change: the `<link>` in `index.html` and `preview/index.html`, and
the two font tokens in `global.css`.

Cormorant has a small x-height, so it is set larger than a Didone would be:
the headline runs to 108px at full width.

## Imagery

There is none. The brief asked for this iteration to stand on type, space,
rule and colour alone, so every photograph was removed, along with the hero's
image panel and the header monogram.

`public/img/` still holds `hero.jpg`, `hero.webp` and the monogram files. They
are unreferenced but kept deliberately: the layout has room for photography
to return without restructuring. The hero's `.hero__foot` is already a two
column grid, and a picture can take the right column.

## Page structure

Hero, our story, the philosophy, good to know, the countdown, early access,
footer.

The page alternates ground: shell, shell, **sage**, shell, **blush**, shell,
**sage**.

All copy comes from the brand document, recast out of first person into a
biography of the business that speaks to the reader. The "good to know"
section is drawn from the FAQ and care notes, with the hedging left exactly
as written ("made to be resistant to tarnishing", not "will not tarnish").

The document also contains full shipping, returns, privacy and terms copy.
None of it is on this page: those are store pages for when the shop opens,
and a coming-soon page is the wrong place for a returns policy. The privacy
note beside the signup form is the one exception, and it summarises the real
policy rather than inventing terms.

## Motion

Two lines type themselves: the hero headline on load (about 4.6 seconds) and
the philosophy statement when it is scrolled to (about 3 seconds). The pace
varies per character and rests longer at punctuation.

Everything else is quiet: sections fade up as they arrive, the countdown
units settle one after another, the wordmark opens its tracking on load, the
rule under the headline draws itself once the line lands, and hover
transitions run at 0.45s.

**None of it can hide content.** The entrance rules only apply once the
script has set `data-js` on the document, and a line only hands over to its
typed copy at the moment it actually starts typing. With JavaScript off, a
broken script, no `IntersectionObserver`, or reduced motion, the page reads
in full. All four cases are tested.
