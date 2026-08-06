// Site-wide configuration for Cruise Aboard
// Edit these values to update contact details across the site.

export const SITE_CONFIG = {
  name: "Cruise Aboard",
  domain: "cruiseaboard.co.uk",
  email: "admin@cruiseaboard.co.uk",
  // TODO(Connor): add your WhatsApp number in international format, e.g. "+447700900123"
  whatsapp: "447356052353", // wa.me link (Connor, provided 2026-08-06)
  // Facebook page name for Messenger deep links
  facebookPage: "cruiseaboard", // used for m.me/ links (Connor, provided 2026-08-06)
  facebookGroup: "https://facebook.com/groups/1254195928625211/", // MSC Cruises UK Forum (Connor, provided 2026-08-06)
  // Trust signals (from questionnaire, 2026-08-03; member count live 2026-08-05)
  groupMembers: "49,292",
  emailList: "1,930",
  bookingsThisYear: "75+",
  tagline: "Your cruise, handled by Charlie.",
  heroSubtitle:
    "No call centres. No faceless booking sites. Just Charlie, a real person who finds you the right cruise, answers every question and handles the details so you don't have to.",
};

export const CONTACT_LINKS = {
  emailHref: `mailto:${SITE_CONFIG.email}`,
  whatsappHref: SITE_CONFIG.whatsapp
    ? `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`
    : null,
  // Full messenger.com/t/ URL rather than m.me short links: m.me is notorious
  // for forcing the "Get Messenger" app-store page even when the app is
  // installed. The full URL opens the app when present and falls back to web.
  messengerHref: `https://www.messenger.com/t/${SITE_CONFIG.facebookPage}`,
};
