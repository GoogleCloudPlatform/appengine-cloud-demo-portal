import { useRouter } from "next/router";

import { localeType } from "../locales/type";
import locales from "../locales";

const defaultLocale = "en";

const useTranslation = (): { t: localeType; locale: string } => {
  const routerLocale = useRouter().locale;
  const locale = routerLocale || defaultLocale;

  let t: localeType;
  if (locale === "en") {
    t = locales.en;
  } else if (locale === "ja") {
    t = locales.ja;
  } else {
    throw `Undefined locale: ${locale || "undefined"}.`;
  }

  return { t, locale };
};

export { useTranslation };
