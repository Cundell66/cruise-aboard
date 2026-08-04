// Site-wide configuration for Cruise Aboard
// Edit these values to update contact details across the site.

export const SITE_CONFIG = {
  name: "Cruise Aboard",
  domain: "cruiseaboard.co.uk",
  email: "admin@cruiseaboard.co.uk",
  // TODO(Connor): add your WhatsApp number in international format, e.g. "+447700900123"
  whatsapp: "", // wa.me link will be hidden until set
  // TODO(Connor): add your Facebook page name for Messenger deep links
  facebookPage: "CharlieatCruiseAboard", // used for m.me/ links
  facebookGroup: "", // URL to the MSC Cruises UK Forum group
  // Trust signals (from questionnaire, 2026-08-03)
  groupMembers: "49,300",
  emailList: "1,930",
  bookingsThisYear: "75+",
  tagline: "MSC cruises from Southampton, sorted properly.",
  heroSubtitle:
    "I'm Charlie — I'll find you the right cruise, the right cabin and the right price, then handle the rest. No jargon, no call centres, just a straight answer.",
};

export const CONTACT_LINKS = {
  emailHref: `mailto:${SITE_CONFIG.email}`,
  whatsappHref: SITE_CONFIG.whatsapp
    ? `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, "")}`
    : null,
  messengerHref: `https://m.me/${SITE_CONFIG.facebookPage}`,
};
