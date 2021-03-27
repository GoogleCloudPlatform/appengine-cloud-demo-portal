import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { event } from "../../src/gtag";
import {
  getLanguages,
  SupportedLanguage,
  translateSpeech,
} from "../../src/api/simultaneousInterpreter";

type ErrorMessage = {
  open: boolean;
  message: string;
};

const useError = (): {
  error: ErrorMessage;
  setError: Dispatch<SetStateAction<ErrorMessage>>;
  onCloseError: () => void;
} => {
  const [error, setError] = useState<ErrorMessage>({
    open: false,
    message: "",
  });
  const onCloseError = () => setError({ open: false, message: "" });

  return { error, setError, onCloseError };
};

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
  setError: Dispatch<SetStateAction<ErrorMessage>>
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
        setError({ open: true, message: `failed to translate: ${e.message}` });
      } else {
        setError({ open: true, message: `failed to translate` });
      }
    }
  };

  return { onStart, onStop };
};

const useLanguages = (
  setError: Dispatch<SetStateAction<ErrorMessage>>
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
          setError({
            open: true,
            message: `failed to get languages: ${e.message}.`,
          });
        } else {
          setError({ open: true, message: "something went wrong." });
        }
      }
    };
    void f();
  }, [setError]);

  return { languages, defaultLanguage };
};

export { useError, useTranslations, useRecorder, useLanguages };
