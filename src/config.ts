/** Launch, in South African Standard Time. */
export const LAUNCH_ISO = "2026-12-09T00:00:00+02:00";
export const LAUNCH_DATE = new Date(LAUNCH_ISO);
export const LAUNCH_LABEL = "9 December 2026";

export const CONTACT_EMAIL = "info@ziyaco.co.za";
export const CONTACT_CELL = "063 123 3361";

/**
 * Where subscriptions go.
 *
 * Paste the Google Apps Script Web App URL between the quotes below. It looks
 * like https://script.google.com/macros/s/AKfycb..../exec — the README, under
 * "The email form", has the script to deploy and the two settings it needs.
 *
 * VITE_SIGNUP_ENDPOINT in a .env file overrides this, which is the better
 * route if the URL should stay out of the repository.
 *
 * Until one of the two is set, the form still works: it validates the address
 * and hands it to the mailbox below instead, so nothing is ever collected and
 * quietly dropped.
 */
const ENDPOINT_HERE = "";

const fromEnv = import.meta.env.VITE_SIGNUP_ENDPOINT;
const raw = typeof fromEnv === "string" && fromEnv.trim() ? fromEnv : ENDPOINT_HERE;

export const SIGNUP_ENDPOINT: string | null =
  typeof raw === "string" && raw.trim().length > 0 ? raw.trim() : null;
