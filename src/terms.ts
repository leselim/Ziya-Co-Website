/* The terms and conditions from the brand's terms_and_conditions.docx,
   word for word. Generated rather than retyped, so the wording cannot
   drift. The document's closing sign-off is left out: it is furniture.

   The "Last updated: 29 October 2026" line is kept here as part of the
   record but is not rendered, the same as the privacy policy's. */

import type { PolicySection } from "./privacy";

export const TERMS_UPDATED = "29 October 2026";

/** The document opens straight into section 1. */
export const TERMS_INTRO: string[] = [];

export const TERMS_SECTIONS: PolicySection[] = [
  {
    id: "tc-introduction",
    n: "1",
    title: "Introduction",
    blocks: [
      { kind: "p", text: "Welcome to ZIYA & CO." },
      { kind: "p", text: "These Terms & Conditions govern your use of our website, www.ziyaco.co.za, and purchases made through our online store." },
      { kind: "p", text: "ZIYA & CO is the trading name of ZIYA M HOLDINGS, a business registered in the Republic of South Africa." },
      { kind: "p", text: "By using our website or placing an order, you agree to these Terms & Conditions, subject to your rights under applicable law. Please read them carefully before completing your purchase." },
    ],
  },
  {
    id: "tc-business-information",
    n: "2",
    title: "Business Information",
    blocks: [
      {
        kind: "ul",
        items: [
          "Registered legal name: ZIYA M HOLDINGS",
          "Registration number: 2026/677758/07",
          "Trading name: ZIYA & CO",
          "Business location: Pinelands, Cape Town, South Africa",
          "Website: www.ziyaco.co.za",
          "Email: info@ziyaco.co.za",
          "Telephone/WhatsApp: 063 123 3361",
        ],
      },
      { kind: "p", text: "ZIYA & CO operates primarily as an online jewellery store. Free collection is available by appointment only in Pinelands, Cape Town." },
    ],
  },
  {
    id: "tc-products-and-product-information",
    n: "3",
    title: "Products and Product Information",
    blocks: [
      { kind: "p", text: "We make reasonable efforts to ensure that product descriptions, photographs, prices and material information displayed on our website are accurate and up to date." },
      { kind: "p", text: "Our jewellery may be made from different materials, depending on the product. Please refer to the individual product description for the relevant material information." },
      { kind: "p", text: "Colours and appearance may vary slightly due to lighting, photography and individual screen settings. Such variations do not affect any rights you may have under applicable consumer-protection law." },
      { kind: "p", text: "Product availability is subject to stock. If an item you have ordered becomes unavailable, we will contact you to discuss the appropriate next steps." },
    ],
  },
  {
    id: "tc-prices-and-promotions",
    n: "4",
    title: "Prices and Promotions",
    blocks: [
      { kind: "p", text: "All prices are displayed in South African Rand (ZAR), unless otherwise stated." },
      { kind: "p", text: "The applicable product price, delivery fee and any other charges will be displayed before you complete your purchase." },
      { kind: "p", text: "We may update prices, product descriptions and promotional offers from time to time. Changes will not retrospectively alter an order already concluded." },
      { kind: "p", text: "Promotional offers are subject to their stated conditions and applicable law." },
    ],
  },
  {
    id: "tc-orders-and-order-confirmation",
    n: "5",
    title: "Orders and Order Confirmation",
    blocks: [
      { kind: "p", text: "When you place an order through our website, you submit a request to purchase the selected products." },
      { kind: "p", text: "An order confirmation will be sent once your order has been received. An automated confirmation does not necessarily mean that payment has cleared or that your order has been dispatched." },
      { kind: "p", text: "Orders are subject to successful payment, stock availability and any necessary verification." },
      { kind: "p", text: "If we cannot fulfil an order, we will notify you and arrange an appropriate refund where payment has already been received, in accordance with applicable law." },
      { kind: "p", text: "We may contact you to clarify order details or resolve a suspected payment or delivery issue." },
    ],
  },
  {
    id: "tc-payment",
    n: "6",
    title: "Payment",
    blocks: [
      { kind: "p", text: "Payment must be successfully completed before an order is processed and dispatched, unless another arrangement has been expressly agreed." },
      { kind: "p", text: "ZIYA & CO intends to use PayFast as its online payment provider, subject to merchant approval and activation." },
      { kind: "p", text: "Once activated, payments will be processed using the payment methods available at checkout. Transactions may be subject to the payment provider’s applicable terms and security procedures." },
      { kind: "p", text: "ZIYA & CO does not intentionally store customers’ full payment card details. Payment information is handled through the applicable payment service provider." },
      { kind: "p", text: "If a payment fails or cannot be verified, we may contact you before proceeding with the order." },
    ],
  },
  {
    id: "tc-order-processing",
    n: "7",
    title: "Order Processing",
    blocks: [
      { kind: "p", text: "Order processing begins on the business day after purchase." },
      { kind: "p", text: "Please allow 1–2 business days for us to process, pack and dispatch your order." },
      { kind: "p", text: "Business days exclude weekends and South African public holidays." },
      { kind: "p", text: "Processing may take longer during product launches, promotions, public holidays or periods of unusually high order volume. Where a material delay is anticipated, we will endeavour to communicate it to you." },
    ],
  },
  {
    id: "tc-shipping-and-delivery",
    n: "8",
    title: "Shipping and Delivery",
    blocks: [
      { kind: "p", text: "We offer delivery nationwide within South Africa through The Courier Guy, subject to service availability at the delivery address." },
      { kind: "p", text: "Our delivery charges are as follows:" },
      {
        kind: "ul",
        items: [
          "Standard delivery: R110 nationwide.",
          "Free delivery: All orders over R800.",
          "Collection: Free, by appointment only in Pinelands, Cape Town.",
        ],
      },
      { kind: "p", text: "Once your order has been dispatched, delivery generally takes 1–4 business days, depending on your location and the courier service." },
      { kind: "p", text: "Delivery times are estimates and are not guaranteed. Delays may occur due to weather, public holidays, courier operational disruptions or other circumstances outside our reasonable control." },
      { kind: "p", text: "The delivery period begins after dispatch, not when the order is placed." },
      { kind: "p", text: "Tracking information will be provided where available." },
      { kind: "p", text: "If a parcel is delayed, lost or delivered incorrectly, please contact us so that we can assist. Nothing in these Terms & Conditions removes any responsibility or consumer remedy that applicable law places on us." },
    ],
  },
  {
    id: "tc-free-collection",
    n: "9",
    title: "Free Collection",
    blocks: [
      { kind: "p", text: "Free collection is available from our collection point in Pinelands, Cape Town, by appointment only." },
      { kind: "p", text: "Once your order is ready, we will contact you via SMS or WhatsApp to arrange a convenient collection time." },
      { kind: "p", text: "Please wait for confirmation before arriving. Customers may be asked to provide their order confirmation or other reasonable proof of purchase." },
      { kind: "p", text: "The exact collection arrangements will be communicated directly to the customer." },
    ],
  },
  {
    id: "tc-delivery-information-and-failed-deliveries",
    n: "10",
    title: "Delivery Information and Failed Deliveries",
    blocks: [
      { kind: "p", text: "Customers are responsible for checking that their delivery address, email address and telephone number are correct before completing an order." },
      { kind: "p", text: "If you notice an error, please contact us as soon as possible at info@ziyaco.co.za or 063 123 3361." },
      { kind: "p", text: "We will make reasonable efforts to assist if your order has not yet been dispatched. Changes cannot be guaranteed once the parcel has been handed to the courier." },
      { kind: "p", text: "If delivery fails because of incorrect or incomplete information provided by the customer, we will work with the customer and courier to determine the next steps. Any additional delivery charge will be communicated before it is incurred where reasonably practicable and will only be charged where lawful." },
    ],
  },
  {
    id: "tc-returns-refunds-and-exchanges",
    n: "11",
    title: "Returns, Refunds and Exchanges",
    blocks: [
      { kind: "p", text: "We want you to enjoy your ZIYA & CO jewellery." },
      { kind: "p", text: "For eligible change-of-mind requests, our standard policy allows customers to request a return or exchange within 7 days of receiving or collecting their order." },
      { kind: "p", text: "For change-of-mind requests, items should be unused, unworn, unaltered and in their original condition and packaging, with proof of purchase." },
      { kind: "p", text: "Please contact us before sending an item back so that we can provide the relevant return instructions." },
      { kind: "p", text: "Return delivery costs for change-of-mind returns may be payable by the customer, subject to applicable law." },
      { kind: "p", text: "Exchanges are subject to product availability. If the replacement item has a different price, we will explain the price difference before proceeding." },
      { kind: "p", text: "Where a refund is due, it will be processed in accordance with applicable law and, where practicable, through the original payment method." },
      { kind: "p", text: "These conditions do not limit statutory rights. They do not remove any applicable electronic-transaction cooling-off right, consumer remedy for defective goods or other right that cannot legally be excluded." },
      { kind: "p", text: "Please refer to our separate Returns, Refunds & Exchanges Policy for the full procedure." },
    ],
  },
  {
    id: "tc-defective-damaged-or-incorrect-products",
    n: "12",
    title: "Defective, Damaged or Incorrect Products",
    blocks: [
      { kind: "p", text: "If your order arrives damaged, defective or different from what you ordered, please contact us as soon as reasonably possible." },
      { kind: "p", text: "Please provide your order number, a description of the issue and photographs where appropriate." },
      { kind: "p", text: "We will assess the matter and arrange an appropriate remedy in accordance with applicable South African consumer-protection law." },
      { kind: "p", text: "Our change-of-mind conditions do not override statutory remedies for defective or non-compliant goods." },
    ],
  },
  {
    id: "tc-intellectual-property",
    n: "13",
    title: "Intellectual Property",
    blocks: [
      { kind: "p", text: "Unless otherwise stated, the ZIYA & CO brand, logos, original written content, website graphics and other original brand materials are owned by or used with permission by the relevant rights holder." },
      { kind: "p", text: "You may not copy, reproduce, distribute or commercially exploit these materials without appropriate permission, except where permitted by law." },
    ],
  },
  {
    id: "tc-website-use-and-security",
    n: "14",
    title: "Website Use and Security",
    blocks: [
      { kind: "p", text: "You agree not to use our website for unlawful activity, fraud, unauthorised access or activities that interfere with the website’s operation or security." },
      { kind: "p", text: "We make reasonable efforts to maintain website availability and accuracy but cannot guarantee uninterrupted or error-free operation." },
      { kind: "p", text: "Where maintenance or technical issues affect an order, we will take reasonable steps to assist affected customers." },
    ],
  },
  {
    id: "tc-third-party-services",
    n: "15",
    title: "Third-Party Services",
    blocks: [
      { kind: "p", text: "Our online store may use third-party services for payment processing, delivery, website hosting, communications and website analytics." },
      { kind: "p", text: "These providers may operate under their own terms and privacy policies." },
      { kind: "p", text: "This clause does not exclude our own legal obligations or any rights you may have against us or a service provider under applicable law." },
    ],
  },
  {
    id: "tc-privacy-and-personal-information",
    n: "16",
    title: "Privacy and Personal Information",
    blocks: [
      { kind: "p", text: "We handle personal information in accordance with our Privacy Policy and applicable South African data-protection law, including the Protection of Personal Information Act 4 of 2013 (POPIA)." },
      { kind: "p", text: "Our Privacy Policy explains what information we collect, why we collect it, how it is used and how you may contact us about your information." },
    ],
  },
  {
    id: "tc-limitation-of-liability",
    n: "17",
    title: "Limitation of Liability",
    blocks: [
      { kind: "p", text: "Nothing in these Terms & Conditions excludes or limits liability where such exclusion or limitation is prohibited by law." },
      { kind: "p", text: "Subject to applicable law, we are not responsible for losses arising solely from events beyond our reasonable control. This does not remove any statutory consumer rights or obligations that continue to apply." },
    ],
  },
  {
    id: "tc-changes-to-these-terms",
    n: "18",
    title: "Changes to These Terms",
    blocks: [
      { kind: "p", text: "We may update these Terms & Conditions to reflect changes to our business, website or legal requirements." },
      { kind: "p", text: "The latest version will be made available on our website. Changes will not retrospectively remove rights relating to an order already concluded." },
    ],
  },
  {
    id: "tc-governing-law-and-disputes",
    n: "19",
    title: "Governing Law and Disputes",
    blocks: [
      { kind: "p", text: "These Terms & Conditions are governed by the laws of the Republic of South Africa." },
      { kind: "p", text: "If you have a concern about an order, please contact us first so that we can attempt to resolve it fairly." },
      { kind: "p", text: "Nothing in this section prevents you from exercising applicable statutory rights or using a lawful dispute-resolution process." },
    ],
  },
  {
    id: "tc-contact-us",
    n: "20",
    title: "Contact Us",
    blocks: [
      { kind: "p", text: "For questions about these Terms & Conditions, orders, delivery, returns or refunds, please contact:" },
      {
        kind: "ul",
        items: [
          "ZIYA & CO",
          "Trading as ZIYA M HOLDINGS",
          "Email: info@ziyaco.co.za",
          "Telephone/WhatsApp: 063 123 3361",
          "Business location: Pinelands, Cape Town, South Africa",
          "Website: www.ziyaco.co.za",
        ],
      },
    ],
  },
];
