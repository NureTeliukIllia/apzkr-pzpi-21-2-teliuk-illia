import i18n from "i18next";
import { initReactI18next } from "react-i18next";

import translationUA from "../assets/locales/ua/translation.json";
import translationEN from "../assets/locales/en/translation.json";
import translationDE from "../assets/locales/de/translation.json";

export const resources = {
    en: {
        translation: translationEN,
    },
    ua: {
        translation: translationUA,
    },
    de: {
        translation: translationDE,
    },
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
