/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { useRouter } from "next/router";

import { Locale, Translations } from "../locales/type";
import locales, { locale } from "../locales";

const defaultLocale = "en";

const useTranslation = (): { t: Locale; locale: locale } => {
  const routerLocale = useRouter().locale;
  const locale = routerLocale || defaultLocale;

  let t: Locale;
  if (locale === "en") {
    t = locales.en;
  } else if (locale === "ja") {
    t = locales.ja;
  } else {
    throw `Undefined locale: ${locale || "undefined"}.`;
  }

  return { t, locale };
};

type TFn = (key: string) => string;

const useTranslationFn = (): { t: TFn; locale: locale } => {
  const routerLocale = useRouter().locale;
  const locale = routerLocale || defaultLocale;

  let translations: Translations;
  if (locale === "en") {
    translations = locales.en;
  } else if (locale === "ja") {
    translations = locales.ja;
  } else {
    throw `Undefined locale: ${locale || "undefined"}.`;
  }

  const t = (key: string): string => {
    const keys = key.split(".");

    let nextT: string | string[] | Translations = translations;
    let result: string | string[] = "";

    keys.forEach((k, i) => {
      if (typeof nextT === "string" || Array.isArray(nextT)) {
        throw "invalid translation key";
      }

      if (i === keys.length - 1) {
        const last = nextT[k];
        if (typeof last === "string" || Array.isArray(last)) {
          result = last;
          return;
        } else {
          throw "invalid translation key";
        }
      }

      nextT = nextT[k];
    });

    return result;
  };

  return { t, locale };
};

export { useTranslation, useTranslationFn };
