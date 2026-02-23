import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import en from "@/i18n/en.json";
import es from "@/i18n/es.json";
import de from "@/i18n/de.json";
import fr from "@/i18n/fr.json";
import it from "@/i18n/it.json";
import pt from "@/i18n/pt.json";
import zh from "@/i18n/zh.json";

const resources = {
  en: { translation: en },
  es: { translation: es },
  de: { translation: de },
  fr: { translation: fr },
  it: { translation: it },
  pt: { translation: pt },
  zh: { translation: zh },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "en",
  fallbackLng: "en",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
