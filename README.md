# Ziya & Co. — Coming Soon

A single-page coming-soon site for Ziya & Co., launching **9 December 2026**.
React + TypeScript + Vite, with a live countdown and an email-capture form.

A warm ivory ground, blush bands, espresso for the dark sections, and a
single gold accent carried through in three strengths. Nothing is rounded and
nothing casts a shadow. See **The palette** below.

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
  privacy.ts               the policy text, generated from the brand document
  components/
    SiteHeader.tsx         sticky header, anchor nav, mobile sheet
    Hero.tsx               headline, rule, actions
    Story.tsx              the brand copy, plus the statement band
    Faq.tsx                good to know, as an accordion
    Countdown.tsx          live countdown to launch
    Notify.tsx             email capture
    Privacy.tsx            the privacy policy, as a full-screen panel
    SignupDone.tsx         the full-screen note, after an address is stored
    SiteFooter.tsx         wordmark, tagline, contact
    Wordmark.tsx           ZIYA & CO, ampersand upright in the display face
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

```
--ivory      #f8f7f3   the page ground
--cream      #fcfbf7   type on the espresso bands and on the buttons
--blush      #f2e2d5   the warm band
--clay       #d6ccc0   hairlines on the light ground
--gold-lift  #b89a68   the gold lifted, for labels on espresso
--gold       #a88752   the accent: fills, rules and marks
--bronze     #7d5f3d   the gold deepened, for labels on light
--espresso   #332a22   the dark sections
--ink        #2a2420   headings and body copy on the light ground
--ink-soft   #70635a   secondary copy on the light ground
```

One accent runs through the page at three strengths, because the flat gold
cannot carry text on either ground:

| | |
|---|---|
| gold on ivory | **3.13:1** — rules, fills and marks, never words |
| gold on espresso | **4.18:1** — short of AA, so labels there lift |
| bronze on ivory | **5.48:1** — the gold deepened, so labels can be set in it |
| gold-lift on espresso | **5.26:1** — the gold lifted, for labels on the dark bands |

So the gold sets the hairlines, the accordion marks and the caret; **bronze
sets the small labels and the button fills** on the light ground; and
**gold-lift sets the labels** inside the espresso sections.

Three consequences worth knowing if the palette is edited:

1. **Headings are the ink, not the accent.** At 14.28:1 they carry the page;
   the gold stays decorative throughout.
2. **Buttons are bronze, not gold.** Cream on the flat gold is 3.24:1 and
   fails; on the bronze it is 5.67:1.
3. **The blush band is edged top and bottom** with a hairline. It sits only
   1.18:1 from the ivory, so without the rules it reads as a misprint rather
   than a deliberate plane. Labels there stay bronze, at 4.65:1.

On espresso, body copy is blush at 11.11:1 and headings are cream at 13.57:1.

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

Print at 1440 x 900 so each sheet comes out as one screen of the site.

**Beware the headline face if you export from a machine without the fonts.**
A machine that cannot reach Google Fonts falls back to Latin Modern
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
to return without restructuring. The hero carries only its headline, rule and
actions, so the space beside them is free for a picture.

## Page structure

Hero, our story, the philosophy, good to know, the countdown, early access,
footer.

**Good to know** is an accordion of seven questions, built on native
`<details>` and `<summary>`. That buys keyboard operation and correct
screen-reader announcement with no script at all, and the questions still
open with JavaScript disabled. The shared `name` attribute closes one answer
as the next opens, in browsers that support it, and is ignored elsewhere.
Opening animates from `0fr` to `1fr` on a grid row, so no maximum height has
to be guessed at and nothing is clipped if the copy grows. In print every
answer is forced open, since a collapsed accordion prints blank.

The page alternates ground: ivory, ivory, **espresso**, ivory, **blush**,
ivory, **espresso**.

All copy comes from the brand document. **The voice is Ziyanda speaking, first
person singular, on every page and in every string** — one woman talking to
another, never a company. Anything new written for this site has to hold that
line, including button labels, form notices and error messages.

The document itself switches to "we" partway through ("We believe jewellery is
meant to be lived in", "Our hope is", "we recommend"). Every one of those is
singular here: "I believe", "My hope is", "I recommend". The nav and section
label read "My story" for the same reason.

**The em dashes stay.** An earlier pass resolved them into sentences; that
was reversed on 28 October at Ziyanda's request. "every day — not just when
there's somewhere special to go" is how the document reads and how the page
reads. Do not tidy them away again.

Beyond the singular pronouns, the document text is word for word, dashes
included. The hedging is exactly as written ("made to be resistant to
tarnishing", never "will not tarnish"), and the "good to know" accordion
carries the FAQ and care notes in full.

Inside the FAQ the brand is set as **"Ziya & Co"** rather than in full caps,
which is how Ziyanda wants it read in the questions. Elsewhere on the page it
stays "ZIYA & CO", as the document has it.

The tagline is **"Jewellery for every version of you"**. The document's longer
"jewellery for every day, and every version of you" was cut back to it, and
the footer no longer carries an "Est. 2026".

The document also contains full shipping, returns and terms copy. None of it
is on this page: those are store pages for when the shop opens, and a
coming-soon page is the wrong place for a returns policy.

## The legal documents

Three of them, each a full-screen reading panel rather than a second page:
this build has no router, and a policy is something you glance at and leave.

| | | |
|---|---|---|
| `#privacy` | Privacy policy | 14 sections, 10 shown before launch |
| `#returns` | Returns & exchanges | 7 sections, all shown |
| `#terms` | Terms & conditions | 20 sections, all shown |

`src/legalDocs.ts` is the registry and `src/components/LegalPanel.tsx` renders
any entry in it. The footer links, the hash routing and the standalone build
all read from that list, so nothing is per-document except the data. Each
document's section ids carry their own prefix, `pp-`, `rt-`, `tc-`, so two
documents can never collide on an anchor.

### Each document

All three are generated from their source `.docx` rather than retyped, so the
wording cannot drift, and each is tested line by line against its document,
with nothing invented:

| | |
|---|---|
| Privacy policy | 85 lines whole |
| Returns & exchanges | 31 body lines, 7 headings |
| Terms & conditions | 89 body lines, 20 headings |

Two of them drop their document's closing sign-off, which is furniture: the
returns policy's carries the old "jewellery for every day, and every version
of you" tagline, which is no longer the site's.

Neither the privacy policy's "Last updated: September 2026" nor the terms'
"Last updated: 29 October 2026" is rendered, at Ziyanda's request. Both dates
stay in the generated files as part of the record. **Worth revisiting for the
terms**: a contract's version date is the thing that says which version you
agreed to, and it is the one place where showing it earns its keep.

### The terms are a contract

They name a registered company: "Ziya & Co is the trading name of ZIYA M
HOLDINGS". The voice map in `src/termsVoice.ts` puts them in the first person
singular with the other two, which is what Ziyanda asked for across the site.

**If anyone would rather the contract read in the company's plural voice**
while the brand pages stay singular, that is the conventional choice and it
is one line: drop `voiceLines` from the terms entry in `legalDocs.ts` and the
document's own wording returns. The registered name ZIYA M HOLDINGS is left
exactly as registered either way.

## The privacy policy

The policy **is** on the page, because the signup form collects an address and
POPIA expects the notice to be reachable at the point of collection. It opens
as a full-screen reading panel rather than a second page: this build has no
router, and a policy is something you glance at and leave.

**`src/privacy.ts` is generated, not written.** It was produced from
`For_website_ZC.docx` so the wording cannot drift, and a test confirms every
one of the document's 85 lines appears on the rendered page with nothing
added. If the policy changes, change the document and regenerate; do not
retype it here.

**It speaks as Ziyanda, like the rest of the site.** The document is drafted
in the plural ("we may collect", "our website"); every plural line is given in
the singular, and the headings with it, so "Who we are" reads "Who I am" and
"Contact us" reads "Contact me".

That lives in **`src/privacyVoice.ts`**, as a map of the document's line to
hers, with the same map in `preview/app.js`. It is a map rather than a
find-and-replace on purpose. Swapping "we" for "I" blindly leaves broken verbs
— "ZIYA & CO respects your right to privacy and is committed" has to become
"I respect your right to privacy and I am committed" — and in a legal notice
every altered line should be readable beside its original, which is what a map
gives you and a regex does not.

**This is a legal document and these are wording changes to one.** They were
made at Ziyanda's request. Whoever drafted the policy should read that file;
it exists so the changes can be checked at a glance. Deleting the map restores
the document's own wording exactly.

Three presentation choices, none of which touch the wording:

- The fourteen section headings are set in sentence case rather than the
  document's full caps.
- The "Last updated: September 2026" line is not rendered. The date stays in
  `privacy.ts` as part of the record.
- The heart after the closing sentence is dropped. Any trailing pictograph is
  stripped at render, so the sentence itself is untouched and the document's
  own copy in `privacy.ts` still carries it.

## What the policy shows before launch

The document is written for the open store. Until 9 December the site takes
an email address and nothing else: no payment, no delivery, no cookie, no
outbound link. Showing clauses about all four would describe processing that
is not happening.

**`src/privacyScope.ts` holds that decision**, separately from the generated
text, and `preview/app.js` carries the same list for the standalone build.
Nothing is deleted, only withheld:

| | |
|---|---|
| Sections withheld | 4 Payment information, 5 Delivery partners, 7 Cookies, 11 Third-party websites |
| Paragraphs withheld | the opening "…place an order…" paragraph, and Marketing's closing line about order confirmations |
| List items withheld | everything in "Information we collect" except the email address and two others; the order, payment and delivery lines in "How we use your information" |

Ten sections remain, **numbered 1 to 10 as they appear**, so a reader never
sees a gap where a withheld section used to be.

Two rules this file keeps to. It withholds whole units and never edits inside
her sentences, which is why the opening paragraph goes entirely rather than
losing three words. And everything still shown is the document verbatim: a
test confirms all 47 remaining paragraphs and items, and all 10 headings,
appear in the document exactly as written.

**ON 9 DECEMBER: set `SHOP_OPEN` to true** in `src/privacyScope.ts`, and the
same in `preview/app.js`. All fourteen sections return, all 85 lines of the
document are back, and the note below disappears. That is tested too.

A short note sits under the heading while the policy is narrowed:

> Ziya & Co is not open yet. The only thing this site collects today is the
> email address you leave for the launch note, and this policy covers only
> that. The parts about orders, payments and delivery are added when the shop
> opens on 9 December.

It is fact rather than legal wording, the only thing on the panel that is not
hers, and it is set in its own band so it is never mistaken for the policy's
voice. It disappears with the same boolean.

**Still missing, and it needs her words, not mine.** Addresses from the form
are stored in a Google spreadsheet, which makes Google a third party handling
personal information. The document's section 5 covers service providers only
in the context of fulfilling an order, so nothing on the page currently says
this. Drafting that clause is not a job for whoever builds the site.

**Links to it are ordinary anchors.** The panel opens off the `#privacy`
hash, not a click handler, so a link to it can be copied, shared and opened
in a new tab, and the address bar says where you are. Two places link to it:
the footer, and the note under the signup form. Closing it clears the hash
with `replaceState`, so Back does not walk you through every reopening.

A contents list tracks the reader down the page. Focus moves into the panel,
Tab cycles inside it, Escape closes it, and the page behind cannot scroll.

## Motion

Three places type themselves. The hero headline on load (about 3.5 seconds),
the philosophy statement when it is scrolled to (about 3 seconds), and the
full-screen note after a successful signup (about 8 seconds across three
lines). The pace varies per character and rests longer at punctuation.

Section heads arrive in three beats rather than one: label, then heading,
then the paragraph beside it. The two story columns come from slightly
different distances, the closing line settles last and from further away, the
countdown units land one after another, both wordmarks open their tracking,
the rule under the headline draws itself once the line lands, an accordion
row warms and shifts a hair under the cursor, and hover transitions run at
0.45s.

**The signup note is a real dialog.** Focus moves into it, Escape closes it,
Tab cannot wander out, the page behind cannot scroll, and focus returns to
the email field on close. The Close button is visible from the first frame,
never gated behind the typing: a full-screen takeover with no obvious way out
is a trap. It opens only when an address is actually stored — the mailto
fallback and every failure path deliberately do not reach it.

**A warning about the staggered heads.** The rules that hide them carry an
`html[data-js="true"]` prefix, so the rules that reveal them need the same
prefix or they lose on specificity and the heads stay invisible for good.
That bug shipped into a screenshot once. `scripts`-free check: scroll the
whole page and confirm no laid-out text node ends below 0.9 opacity.

**None of it can hide content.** The entrance rules only apply once the
script has set `data-js` on the document, and a line only hands over to its
typed copy at the moment it actually starts typing. With JavaScript off, a
broken script, no `IntersectionObserver`, or reduced motion, the page reads
in full. All four cases are tested.
