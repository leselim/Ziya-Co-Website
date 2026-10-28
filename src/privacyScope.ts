/**
 * What of the privacy policy applies before the shop opens.
 *
 * `privacy.ts` is the whole document, generated and never edited. This file
 * is the editorial decision sitting on top of it: which parts describe things
 * Ziya & Co is not doing yet. Nothing is deleted, only withheld, so opening
 * day is one boolean rather than a retyping job.
 *
 * Right now the site takes an email address for the launch note. No payment
 * is taken, nothing is shipped, no cookie is set and there is no outbound
 * link, so the clauses covering those would describe processing that is not
 * happening.
 *
 * ON 9 DECEMBER: set SHOP_OPEN to true. Everything below returns, the note
 * at the top of the panel disappears, and the policy reads whole again.
 */
export const SHOP_OPEN = false;

/** Whole sections that only make sense once there are orders. */
export const LAUNCH_ONLY_SECTIONS = [
  "4", // Payment information
  "5", // Delivery partners and service providers
  "7", // Cookies — the site sets none. Add analytics and this must come back.
  "11", // Third-party websites — the page links out to nothing
];

/**
 * Paragraphs withheld whole. Two of these sit inside sections that are
 * otherwise still true; the third is one of the opening paragraphs.
 *
 * That opening one is withheld rather than trimmed because the phrase that
 * does not apply ("place an order") sits mid-sentence, and editing inside
 * her sentences is not something this file does. The two paragraphs either
 * side of it still frame the policy perfectly well on their own.
 */
export const LAUNCH_ONLY_LINES = [
  "Transactional communications, such as order confirmations and delivery updates, are not marketing communications and may still be sent when necessary to fulfil your order.",
  "This Privacy Policy explains how ZIYA & CO collects, uses, stores and protects your personal information when you visit our website, place an order, contact us or otherwise interact with us.",
];

/** List items inside lists that are otherwise still true. */
export const LAUNCH_ONLY_ITEMS = [
  // 2. Information we collect — an email address is the only one of these
  "Your name and surname",
  "Telephone or mobile number",
  "Billing and delivery address",
  "Order and purchase information",
  "Payment-related information necessary to process your transaction",
  "Information you provide when contacting us regarding an order, return or exchange",
  // 3. How we use your information
  "Process and fulfil your orders",
  "Process payments",
  "Arrange delivery or collection",
  "Communicate with you regarding your order",
  "Process returns, refunds and exchanges",
];

/** The note at the top, while the policy is narrower than the document. */
export const SCOPE_NOTE =
  "Ziya & Co is not open yet. The only thing this site collects today is " +
  "the email address you leave for the launch note, and this policy covers " +
  "only that. The parts about orders, payments and delivery are added when " +
  "the shop opens on 9 December.";
