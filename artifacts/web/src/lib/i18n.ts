export type Language = "en" | "hi";

const messages: Record<Language, Record<string, string>> = {
  en: {
    "nav.home": "Home",
    "nav.apps": "Apps & Services",
    "nav.explore": "Explore",
    "nav.about": "About",
    "nav.login": "Log in",
    "nav.account": "My Account",
    "nav.menu": "Menu",
    "nav.gita": "Bhagavad Gita",
    "nav.safety": "Women Safety",
    "nav.community": "Community",
    "nav.posts": "Posts",
    "nav.tools": "Tools",
    "nav.team": "Join the Team",
    "nav.contact": "Contact",
    "common.loading": "Loading…",
    "common.tryAgain": "Please refresh or try again in a moment.",
    "common.save": "Save",
    "common.cancel": "Cancel",
    "common.signIn": "Log in",
    "common.signOut": "Sign out",
  },
  hi: {
    "nav.home": "होम",
    "nav.apps": "ऐप्स और सेवाएँ",
    "nav.explore": "एक्सप्लोर",
    "nav.about": "हमारे बारे में",
    "nav.login": "लॉग इन",
    "nav.account": "मेरा अकाउंट",
    "nav.menu": "मेन्यू",
    "nav.gita": "श्रीमद्भगवद्गीता",
    "nav.safety": "महिला सुरक्षा",
    "nav.community": "कम्युनिटी",
    "nav.posts": "पोस्ट्स",
    "nav.tools": "टूल्स",
    "nav.team": "टीम से जुड़ें",
    "nav.contact": "संपर्क",
    "common.loading": "लोड हो रहा है…",
    "common.tryAgain": "पेज लोड नहीं हो सका। कृपया रिफ्रेश करें या थोड़ी देर बाद फिर कोशिश करें।",
    "common.save": "सेव करें",
    "common.cancel": "रद्द करें",
    "common.signIn": "लॉग इन",
    "common.signOut": "लॉग आउट",
  },
};

export function detectLanguage(): Language {
  if (typeof navigator === "undefined") return "en";
  return navigator.language?.toLowerCase().startsWith("hi") ? "hi" : "en";
}

export function translate(key: string, language: Language = detectLanguage()) {
  return messages[language][key] ?? messages.en[key] ?? key;
}

export function applyTranslations(root: ParentNode = document) {
  const language = detectLanguage();
  document.documentElement.lang = language;
  root.querySelectorAll<HTMLElement>("[data-i18n]").forEach((element) => {
    const key = element.dataset.i18n;
    if (key) element.textContent = translate(key, language);
  });
  root.querySelectorAll<HTMLElement>("[data-i18n-aria-label]").forEach((element) => {
    const key = element.dataset.i18nAriaLabel;
    if (key) element.setAttribute("aria-label", translate(key, language));
  });
}
