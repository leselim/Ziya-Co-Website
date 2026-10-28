/* The privacy policy from the brand document, word for word.
   Generated from For_website_ZC.docx rather than retyped, so the wording
   cannot drift. It keeps the document's own plural voice: the rest of the
   site speaks as Ziyanda, but this is a legal instrument and its pronouns
   are not ours to restyle. */

export interface PolicyBlock {
  kind: "p" | "ul";
  text?: string;
  items?: string[];
}

export interface PolicySection {
  id: string;
  n: string;
  title: string;
  blocks: PolicyBlock[];
}

export const PRIVACY_UPDATED = "September 2026";

export const PRIVACY_INTRO: string[] = [
  "At ZIYA & CO, your privacy matters to us.",
  "This Privacy Policy explains how ZIYA & CO collects, uses, stores and protects your personal information when you visit our website, place an order, contact us or otherwise interact with us.",
  "ZIYA & CO respects your right to privacy and is committed to handling your personal information responsibly and in accordance with applicable South African privacy laws, including the Protection of Personal Information Act 4 of 2013 (POPIA).",
];

export const PRIVACY_SECTIONS: PolicySection[] = [
  {
    id: "pp-who-we-are",
    n: "1",
    title: "WHO WE ARE",
    blocks: [
      { kind: "p", text: "ZIYA & CO is an online jewellery business operating in South Africa." },
      { kind: "p", text: "For any privacy-related questions, you can contact us at:" },
      {
        kind: "ul",
        items: [
          "Email: info@ziyaco.co.za",
        ],
      },
    ],
  },
  {
    id: "pp-information-we-collect",
    n: "2",
    title: "INFORMATION WE COLLECT",
    blocks: [
      { kind: "p", text: "When you interact with ZIYA & CO, we may collect information such as:" },
      {
        kind: "ul",
        items: [
          "Your name and surname",
          "Email address",
          "Telephone or mobile number",
          "Billing and delivery address",
          "Order and purchase information",
          "Payment-related information necessary to process your transaction",
          "Communications you have with us",
          "Information you provide when contacting us regarding an order, return or exchange",
          "Technical information relating to your use of our website, such as IP address, browser type and device information, where applicable",
        ],
      },
      { kind: "p", text: "We only request information that is reasonably necessary for the purposes described in this Privacy Policy." },
    ],
  },
  {
    id: "pp-how-we-use-your-information",
    n: "3",
    title: "HOW WE USE YOUR INFORMATION",
    blocks: [
      { kind: "p", text: "We may use your personal information to:" },
      {
        kind: "ul",
        items: [
          "Process and fulfil your orders",
          "Process payments",
          "Arrange delivery or collection",
          "Communicate with you regarding your order",
          "Provide customer support",
          "Process returns, refunds and exchanges",
          "Respond to enquiries",
          "Improve our website, products and customer experience",
          "Detect and prevent fraud, abuse or other unlawful activity",
          "Meet our legal, accounting and regulatory obligations",
          "Send marketing communications where permitted by law and where you have provided the required consent",
        ],
      },
    ],
  },
  {
    id: "pp-payment-information",
    n: "4",
    title: "PAYMENT INFORMATION",
    blocks: [
      { kind: "p", text: "Payments made through our website may be processed by a third-party payment service provider." },
      { kind: "p", text: "ZIYA & CO does not intentionally store your full payment card details." },
      { kind: "p", text: "Payment information is handled by the relevant payment provider in accordance with its own security and privacy practices." },
    ],
  },
  {
    id: "pp-delivery-partners-and-service-providers",
    n: "5",
    title: "DELIVERY PARTNERS AND SERVICE PROVIDERS",
    blocks: [
      { kind: "p", text: "To fulfil your order, we may need to share certain information with trusted third-party service providers." },
      { kind: "p", text: "For example, your name, contact details and delivery address may be provided to a courier responsible for delivering your order." },
      { kind: "p", text: "We only share information that is reasonably necessary for the relevant service to be performed." },
    ],
  },
  {
    id: "pp-marketing",
    n: "6",
    title: "MARKETING",
    blocks: [
      { kind: "p", text: "If you choose to subscribe to our marketing communications, we may use your contact details to send you information about:" },
      {
        kind: "ul",
        items: [
          "New collections",
          "Product launches",
          "Special offers",
          "Promotions",
          "ZIYA & CO news and updates",
        ],
      },
      { kind: "p", text: "You may unsubscribe from marketing communications at any time by using the unsubscribe option provided in the communication or by contacting us." },
      { kind: "p", text: "Transactional communications, such as order confirmations and delivery updates, are not marketing communications and may still be sent when necessary to fulfil your order." },
    ],
  },
  {
    id: "pp-cookies",
    n: "7",
    title: "COOKIES",
    blocks: [
      { kind: "p", text: "Our website may use cookies and similar technologies to help the website function properly, remember preferences, understand website usage and improve your experience." },
      { kind: "p", text: "Some cookies may also be placed by third-party services used on our website, such as payment, analytics or marketing providers." },
      { kind: "p", text: "You can manage or disable cookies through your browser settings. Please note that disabling certain cookies may affect the functionality of the website." },
    ],
  },
  {
    id: "pp-how-we-protect-your-information",
    n: "8",
    title: "HOW WE PROTECT YOUR INFORMATION",
    blocks: [
      { kind: "p", text: "We take reasonable and appropriate measures to protect personal information against loss, misuse, unauthorised access, disclosure, alteration or destruction." },
      { kind: "p", text: "However, no online transmission or electronic storage system can be guaranteed to be completely secure." },
      { kind: "p", text: "If we become aware of a security compromise involving your personal information, we will take appropriate steps in accordance with applicable law." },
    ],
  },
  {
    id: "pp-how-long-we-keep-your-information",
    n: "9",
    title: "HOW LONG WE KEEP YOUR INFORMATION",
    blocks: [
      { kind: "p", text: "We retain personal information only for as long as reasonably necessary for the purposes for which it was collected, or where retention is required or permitted by law." },
      { kind: "p", text: "Certain information relating to transactions may need to be retained for accounting, tax, legal or regulatory purposes." },
    ],
  },
  {
    id: "pp-your-privacy-rights",
    n: "10",
    title: "YOUR PRIVACY RIGHTS",
    blocks: [
      { kind: "p", text: "Subject to applicable law, you may have the right to:" },
      {
        kind: "ul",
        items: [
          "Request access to personal information we hold about you",
          "Request correction or updating of inaccurate information",
          "Request deletion of information where there is no lawful reason for us to continue retaining it",
          "Object to certain forms of processing",
          "Withdraw consent where processing is based on consent",
          "Ask questions about how your personal information is being used",
        ],
      },
      { kind: "p", text: "Requests can be submitted to:" },
      {
        kind: "ul",
        items: [
          "info@ziyaco.co.za",
        ],
      },
      { kind: "p", text: "We may need to verify your identity before processing certain requests." },
    ],
  },
  {
    id: "pp-third-party-websites",
    n: "11",
    title: "THIRD-PARTY WEBSITES",
    blocks: [
      { kind: "p", text: "Our website may contain links to third-party websites or services." },
      { kind: "p", text: "ZIYA & CO is not responsible for the privacy practices, security or content of third-party websites. We recommend reviewing the privacy policies of those websites before providing them with personal information." },
    ],
  },
  {
    id: "pp-children-s-information",
    n: "12",
    title: "CHILDREN'S INFORMATION",
    blocks: [
      { kind: "p", text: "Our website is not intended to knowingly collect personal information from children without the appropriate consent required by law." },
      { kind: "p", text: "If you believe that a child has provided personal information to us without the required consent, please contact us so that we can investigate and take appropriate action." },
    ],
  },
  {
    id: "pp-changes-to-this-privacy-policy",
    n: "13",
    title: "CHANGES TO THIS PRIVACY POLICY",
    blocks: [
      { kind: "p", text: "We may update this Privacy Policy from time to time to reflect changes to our business, website, technology or legal requirements." },
      { kind: "p", text: "The latest version will always be made available on our website." },
    ],
  },
  {
    id: "pp-contact-us",
    n: "14",
    title: "CONTACT US",
    blocks: [
      { kind: "p", text: "If you have any questions, concerns or requests regarding your personal information or this Privacy Policy, please contact us:" },
      {
        kind: "ul",
        items: [
          "ZIYA & CO",
          "Email: info@ziyaco.co.za",
        ],
      },
      { kind: "p", text: "We value your trust and are committed to protecting your information while providing you with a beautiful ZIYA & CO experience. 🤍" },
    ],
  },
];
