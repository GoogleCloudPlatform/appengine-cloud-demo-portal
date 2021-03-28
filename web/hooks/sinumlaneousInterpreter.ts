import { useEffect, useState } from "react";

import { event } from "../src/gtag";
import {
  getLanguages,
  SupportedLanguage,
  translateSpeech,
} from "../src/api/simultaneousInterpreter";
import { SetErrorMessage } from "./useError";

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
  const onStart = (lang: string): void => {
    event({
      category: "simultaneousInterpreter",
      action: "start_recording",
      label: lang,
    });
  };

  const onStop = async (
    lang: string,
    duration: number | null,
    blob: Blob
  ): Promise<void> => {
    event({
      category: "simultaneousInterpreter",
      action: "stop_recording",
      label: lang,
      value: duration,
    });
    try {
      const res = await translateSpeech(lang, blob);
      addTranslations(res.translations);
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        setErrorMessage(`failed to translate: ${e.message}`);
      } else {
        setErrorMessage(`failed to translate`);
      }
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
      try {
        const res = await getLanguages();
        setLanguages(res.languages);
        setDefaultLanguage(res.languages[0].code);
      } catch (e) {
        console.error(e);
        if (e instanceof Error) {
          setErrorMessage(`failed to get languages: ${e.message}.`);
        } else {
          setErrorMessage("something went wrong.");
        }
      }
    };
    void f();
  }, [setErrorMessage]);

  return { languages, defaultLanguage };
};

export { useTranslations, useRecorder, useLanguages };
