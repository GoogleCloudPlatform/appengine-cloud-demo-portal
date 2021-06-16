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

export type EntityType =
  | "UNKNOWN"
  | "PERSON"
  | "LOCATION"
  | "ORGANIZATION"
  | "EVENT"
  | "WORK_OF_ART"
  | "CONSUMER_GOOD"
  | "OTHER"
  | "PHONE_NUMBER"
  | "ADDRESS"
  | "DATE"
  | "NUMBER"
  | "PRICE";

type TextSpan = {
  content: string;
  beginOffset: number;
};

type Sentiment = {
  magnitude: number;
  score: number;
};

export type EntityMention = {
  text: TextSpan;
  type: "TYPE_UNKNOWN" | "PROPER" | "COMMON";
  sentiment?: Sentiment;
};

export type Entity = {
  name: string;
  type: EntityType;
  metadata?: { [key: string]: string };
  salience: number;
  mentions: EntityMention[];
  sentiment?: Sentiment;
};

export type ClassificationCategory = {
  name: string;
  confidence: number;
};

export type Document = {
  type: "PLAIN_TEXT";
  language: string;
  content: string;
};

export type AnalyzeResponse = {
  document: Document;
  entities?: Entity[];
  documentSentiment: Sentiment;
  language: string;
  categories?: ClassificationCategory[];
};

const analyze = async (
  lang: string,
  blob: Blob
): Promise<Response<AnalyzeResponse>> => {
  const data = {
    audio: {
      content: await blobToBase64(blob),
    },
    config: {
      languageCode: lang,
    },
  };

  return await request<AnalyzeResponse>(
    "/contactCenterAnalysis/speech:analyze",
    "POST",
    data
  );
};

type LanguageSupport = {
  name: string;
  code: string;
};

type GetLanguagesResponse = {
  languages: LanguageSupport[];
};

const getLanguages = async (): Promise<Response<GetLanguagesResponse>> =>
  await request<GetLanguagesResponse>(
    "/contactCenterAnalysis/languages",
    "GET"
  );

export { analyze, getLanguages };
