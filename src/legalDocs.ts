import { PRIVACY_INTRO, PRIVACY_SECTIONS, type PolicySection } from "./privacy";
import {
  LAUNCH_ONLY_ITEMS,
  LAUNCH_ONLY_LINES,
  LAUNCH_ONLY_SECTIONS,
} from "./privacyScope";
import { SCOPE_NOTE, VOICE_LINES, VOICE_TITLES } from "./privacyVoice";
import { RETURNS_INTRO, RETURNS_SECTIONS } from "./returns";
import {
  RETURNS_NOTE,
  RETURNS_VOICE_LINES,
  RETURNS_VOICE_TITLES,
} from "./returnsVoice";
import { TERMS_INTRO, TERMS_SECTIONS } from "./terms";
import { TERMS_NOTE, TERMS_VOICE_LINES, TERMS_VOICE_TITLES } from "./termsVoice";

/**
 * The legal documents the site carries, and everything the panel needs to
 * show one. Each is the brand document's own text, generated rather than
 * retyped, with a voice map on top and a note saying what applies before
 * the shop opens.
 *
 * ADDING ANOTHER: generate its data file from the source document the same
 * way, write its voice map, and add an entry below. The panel, the footer
 * links, the hash routing and the standalone build all pick it up with no
 * further work. Keep `preview/app.js` in step.
 */
export interface LegalDoc {
  /** the URL hash that opens it, without the # */
  hash: string;
  /** small label above the heading */
  label: string;
  /** the heading itself */
  title: string;
  /** how it reads as a link, in the footer */
  linkText: string;
  intro: string[];
  sections: PolicySection[];
  /** shown while SHOP_OPEN is false */
  note?: string;
  voiceLines: Record<string, string>;
  voiceTitles: Record<string, string>;
  /** withheld until the shop opens; matched against the document's own text */
  launchOnlySections: string[];
  launchOnlyLines: string[];
  launchOnlyItems: string[];
}

export const LEGAL_DOCS: LegalDoc[] = [
  {
    hash: "privacy",
    label: "Privacy",
    title: "Privacy policy",
    linkText: "Privacy policy",
    intro: PRIVACY_INTRO,
    sections: PRIVACY_SECTIONS,
    note: SCOPE_NOTE,
    voiceLines: VOICE_LINES,
    voiceTitles: VOICE_TITLES,
    launchOnlySections: LAUNCH_ONLY_SECTIONS,
    launchOnlyLines: LAUNCH_ONLY_LINES,
    launchOnlyItems: LAUNCH_ONLY_ITEMS,
  },
  {
    hash: "returns",
    label: "Returns",
    title: "Returns & exchanges",
    linkText: "Returns & exchanges",
    intro: RETURNS_INTRO,
    sections: RETURNS_SECTIONS,
    note: RETURNS_NOTE,
    voiceLines: RETURNS_VOICE_LINES,
    voiceTitles: RETURNS_VOICE_TITLES,
    /* nothing is withheld: the whole policy is about orders, so rather than
       hiding all of it the note says plainly that it applies from 9 December */
    launchOnlySections: [],
    launchOnlyLines: [],
    launchOnlyItems: [],
  },
  {
    hash: "terms",
    label: "Terms",
    title: "Terms & conditions",
    linkText: "Terms & conditions",
    intro: TERMS_INTRO,
    sections: TERMS_SECTIONS,
    note: TERMS_NOTE,
    voiceLines: TERMS_VOICE_LINES,
    voiceTitles: TERMS_VOICE_TITLES,
    /* nothing is withheld. Most of it waits for the shop to open, but the
       sections on using the site, intellectual property and privacy apply
       today, so the note explains which is which rather than hiding any */
    launchOnlySections: [],
    launchOnlyLines: [],
    launchOnlyItems: [],
  },
];

export function docForHash(hash: string): LegalDoc | null {
  const want = hash.replace(/^#/, "");
  return LEGAL_DOCS.find((d) => d.hash === want) ?? null;
}
