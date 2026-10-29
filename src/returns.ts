/* The returns and exchanges policy from the brand document, word for word.
   Generated from For_website_ZC.docx rather than retyped, so the wording
   cannot drift. The document's closing sign-off (the wordmark and the old
   tagline) is left out: it is document furniture, and that tagline is no
   longer the one the site uses. */

import type { PolicySection } from "./privacy";

export const RETURNS_INTRO: string[] = [
  "At ZIYA & CO, we want you to love every piece you receive.",
  "We understand that sometimes a piece may not be quite what you expected, so we offer a 7-day return and exchange period for eligible purchases.",
];

export const RETURNS_SECTIONS: PolicySection[] = [
  {
    id: "rt-change-of-mind-returns-exchanges",
    n: "1",
    title: "CHANGE-OF-MIND RETURNS & EXCHANGES",
    blocks: [
      { kind: "p", text: "If you change your mind about your purchase, you may request a return or exchange within 7 days of receiving your order or collecting it." },
      { kind: "p", text: "To be eligible, the item must:" },
      {
        kind: "ul",
        items: [
          "Be unused and unworn",
          "Be in its original condition",
          "Be returned with its original packaging",
          "Not show any signs of damage, alteration or wear",
          "Be accompanied by your order number or proof of purchase",
        ],
      },
      { kind: "p", text: "Please contact us within the 7-day period before sending any item back. We will provide you with the relevant return or exchange instructions." },
      { kind: "p", text: "For change-of-mind returns, return delivery costs may be for the customer's account, unless otherwise required by applicable law." },
    ],
  },
  {
    id: "rt-exchanges",
    n: "2",
    title: "EXCHANGES",
    blocks: [
      { kind: "p", text: "We are happy to assist with an exchange where the requested replacement item is available." },
      { kind: "p", text: "If the replacement item has a different price, we will advise you of any applicable difference before processing the exchange." },
      { kind: "p", text: "Items purchased during a sale or promotional period may be subject to specific exchange conditions, which will be communicated at the time of purchase." },
    ],
  },
  {
    id: "rt-damaged-defective-or-incorrect-items",
    n: "3",
    title: "DAMAGED, DEFECTIVE OR INCORRECT ITEMS",
    blocks: [
      { kind: "p", text: "If your order arrives damaged, defective, or you receive an item different from what you ordered, please contact us as soon as possible." },
      { kind: "p", text: "Please send us:" },
      {
        kind: "ul",
        items: [
          "Your order number",
          "A description of the issue",
          "Clear photographs of the item and its packaging",
        ],
      },
      { kind: "p", text: "We will assess the issue and work with you to resolve it." },
      { kind: "p", text: "Nothing in this policy limits or excludes any rights you may have under applicable South African consumer-protection legislation. Where an item is defective or does not comply with applicable legal requirements, your statutory rights will apply." },
    ],
  },
  {
    id: "rt-online-purchases",
    n: "4",
    title: "ONLINE PURCHASES",
    blocks: [
      { kind: "p", text: "For purchases made through our online store, statutory cancellation and cooling-off rights that apply to electronic transactions will remain unaffected by this policy." },
      { kind: "p", text: "Where a statutory cooling-off right applies, ZIYA & CO will process the cancellation and refund in accordance with applicable law." },
    ],
  },
  {
    id: "rt-items-that-cannot-be-returned",
    n: "5",
    title: "ITEMS THAT CANNOT BE RETURNED",
    blocks: [
      { kind: "p", text: "Items that have been worn, damaged after delivery, altered, or returned outside the applicable return period may not qualify for a change-of-mind return or exchange." },
      { kind: "p", text: "For hygiene reasons, worn earrings may not be eligible for return or exchange, subject always to any rights that cannot legally be excluded." },
    ],
  },
  {
    id: "rt-refunds",
    n: "6",
    title: "REFUNDS",
    blocks: [
      { kind: "p", text: "Once an eligible return has been received and inspected, we will confirm whether the return has been approved." },
      { kind: "p", text: "Approved refunds will be processed using the applicable original payment method, subject to the requirements of the relevant payment provider and applicable law." },
      { kind: "p", text: "Please allow the required processing time for the funds to reflect in your account." },
    ],
  },
  {
    id: "rt-need-help",
    n: "7",
    title: "NEED HELP?",
    blocks: [
      { kind: "p", text: "If you have any questions about a return or exchange, please contact us:" },
      {
        kind: "ul",
        items: [
          "Email: info@ziyaco.co.za",
        ],
      },
      { kind: "p", text: "We're here to help make your ZIYA & CO experience as beautiful as possible." },
    ],
  },
];
