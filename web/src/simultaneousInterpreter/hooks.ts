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

import { useEffect, useState } from "react";

import { SetErrorMessage } from "../../hooks/useError";
import { getLanguages, SupportedLanguage, translateSpeech } from "./api";
import { onStartEvent, onStopEvent } from "./gtag";

type AddTranslationsFn = (translations: { [key: string]: string }) => void;

const useTranslations = (): {
  translations: { [key: string]: string[] };
  addTranslations: AddTranslationsFn;
} => {
  const [translations, setTranslations] = useState<{ [key: string]: string[] }>(
    {}
  );

  const addTranslations: AddTranslationsFn = (translations) => {
    setTranslations((state) => {
      const nextState: { [key: string]: string[] } = {};
      for (const [lang, translation] of Object.entries(translations)) {
        if (lang in state) {
          nextState[lang] = [...state[lang], translation];
        } else {
          nextState[lang] = [translation];
        }
      }
      return nextState;
    });
  };

  return { translations, addTranslations };
};

const useRecorder = (
  addTranslations: AddTranslationsFn,
  setErrorMessage: SetErrorMessage
): {
  onStart: (lang: string) => void;
  onStop: (lang: string, duration: number | null, blob: Blob) => Promise<void>;
} => {
  const onStart = (lang: string): void => onStartEvent(lang);

  const onStop = async (
    lang: string,
    duration: number | null,
    blob: Blob
  ): Promise<void> => {
    onStopEvent(lang, duration);

    const res = await translateSpeech(lang, blob);
    if (res.success) {
      addTranslations(res.data.translations);
    } else {
      setErrorMessage(`failed to translate: ${res.error.message}`);
    }
  };

  return { onStart, onStop };
};

const useLanguages = (
  setErrorMessage: SetErrorMessage
): {
  languages: SupportedLanguage[];
  defaultLanguage: string;
} => {
  const [languages, setLanguages] = useState<SupportedLanguage[]>([]);
  const [defaultLanguage, setDefaultLanguage] = useState("");

  useEffect(() => {
    const f = async () => {
      const res = await getLanguages();
      if (res.success) {
        setLanguages(res.data.languages);
        setDefaultLanguage(res.data.languages[0].code);
      } else {
        setErrorMessage(`failed to get languages: ${res.error.message}.`);
      }
    };
    void f();
  }, [setErrorMessage]);

  return { languages, defaultLanguage };
};

export { useTranslations, useRecorder, useLanguages };
