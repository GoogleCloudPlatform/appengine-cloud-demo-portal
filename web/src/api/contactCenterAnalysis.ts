import { request } from "./api";

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
  metadata: { [key: string]: string };
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

export type Response = {
  document: Document;
  entities: Entity[];
  documentSentiment: Sentiment;
  language: string;
  categories: ClassificationCategory[];
};

const blobToBase64 = (blob: Blob): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        resolve(event.target.result.split(",")[1]);
      } else {
        reject("invalid result");
      }
    };
    reader.readAsDataURL(blob);
  });
};

const analyze = async (lang: string, blob: Blob): Promise<Response> => {
  const data = {
    audio: {
      content: await blobToBase64(blob),
    },
    config: {
      languageCode: lang,
    },
  };

  return await request<Response>(
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

const getLanguages = async (): Promise<GetLanguagesResponse> =>
  await request<GetLanguagesResponse>(
    "/contactCenterAnalysis/languages",
    "GET"
  );

export { analyze, getLanguages };
