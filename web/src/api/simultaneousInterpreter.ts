import { blobToBase64, request } from "./api";

export type SupportedLanguage = {
  name: string;
  code: string;
};

type GetLanguagesResponse = {
  languages: SupportedLanguage[];
};

const getLanguages = async (): Promise<GetLanguagesResponse> =>
  await request<GetLanguagesResponse>(
    "/simultaneousInterpreter/languages",
    "GET"
  );

type TranslateSpeechResponse = {
  languageCode: string;
  translations: { [key: string]: string };
};

const translateSpeech = async (
  lang: string,
  blob: Blob
): Promise<TranslateSpeechResponse> => {
  const data = {
    audio: {
      content: await blobToBase64(blob),
    },
    config: {
      languageCode: lang,
    },
  };

  return await request<TranslateSpeechResponse>(
    "/simultaneousInterpreter/speech:translate",
    "POST",
    data
  );
};

export { getLanguages, translateSpeech };
