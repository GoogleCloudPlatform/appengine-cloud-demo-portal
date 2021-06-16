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

import { blobToBase64, request, Response } from "../api";

export type SupportedLanguage = {
  name: string;
  code: string;
};

type GetLanguagesResponse = {
  languages: SupportedLanguage[];
};

const getLanguages = async (): Promise<Response<GetLanguagesResponse>> =>
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
): Promise<Response<TranslateSpeechResponse>> => {
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
