/* The returns policy, with Ziyanda speaking.
 *
 * Same bargain as privacyVoice.ts: returns.ts is the brand document and is
 * never edited, and this is the voice on top of it. A map rather than a
 * find-and-replace, so every altered line reads beside its original.
 *
 * THIS IS A LEGAL DOCUMENT. These are wording changes to one, made at
 * Ziyanda's request. Whoever drafted the policy should read this file.
 */

export const RETURNS_VOICE_LINES: Record<string, string> = {
  "At ZIYA & CO, we want you to love every piece you receive.":
    "At Ziya & Co, I want you to love every piece you receive.",
  "We understand that sometimes a piece may not be quite what you expected, so we offer a 7-day return and exchange period for eligible purchases.":
    "I understand that sometimes a piece may not be quite what you expected, so I offer a 7-day return and exchange period for eligible purchases.",
  "Please contact us within the 7-day period before sending any item back. We will provide you with the relevant return or exchange instructions.":
    "Please contact me within the 7-day period before sending any item back. I will provide you with the relevant return or exchange instructions.",
  "We are happy to assist with an exchange where the requested replacement item is available.":
    "I am happy to assist with an exchange where the requested replacement item is available.",
  "If the replacement item has a different price, we will advise you of any applicable difference before processing the exchange.":
    "If the replacement item has a different price, I will advise you of any applicable difference before processing the exchange.",
  "If your order arrives damaged, defective, or you receive an item different from what you ordered, please contact us as soon as possible.":
    "If your order arrives damaged, defective, or you receive an item different from what you ordered, please contact me as soon as possible.",
  "Please send us:":
    "Please send me:",
  "We will assess the issue and work with you to resolve it.":
    "I will assess the issue and work with you to resolve it.",
  "For purchases made through our online store, statutory cancellation and cooling-off rights that apply to electronic transactions will remain unaffected by this policy.":
    "For purchases made through my online store, statutory cancellation and cooling-off rights that apply to electronic transactions will remain unaffected by this policy.",
  "Where a statutory cooling-off right applies, ZIYA & CO will process the cancellation and refund in accordance with applicable law.":
    "Where a statutory cooling-off right applies, Ziya & Co will process the cancellation and refund in accordance with applicable law.",
  "Once an eligible return has been received and inspected, we will confirm whether the return has been approved.":
    "Once an eligible return has been received and inspected, I will confirm whether the return has been approved.",
  "If you have any questions about a return or exchange, please contact us:":
    "If you have any questions about a return or exchange, please contact me:",
  "We're here to help make your ZIYA & CO experience as beautiful as possible.":
    "I’m here to help make your Ziya & Co experience as beautiful as possible.",
};

/** The seven headings need no override; sentence case handles them. */
export const RETURNS_VOICE_TITLES: Record<string, string> = {};

/** Nothing here applies until the shop opens, so the note says so. */
export const RETURNS_NOTE = "Ziya & Co isn’t open yet, so there is nothing to return yet. This is the policy that applies to every order from 9 December, when I open.";
