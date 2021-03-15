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

/*
export type Sentence = {
  text: TextSpan;
  sentiment: Sentiment;
};
*/

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

const analyze = async (lang: string, blob: Blob): Promise<Response> => {
  const res: Response = {
    document: {
      type: "PLAIN_TEXT",
      language: "en",
      content:
        "President Trump will speak from the White House, located at 1600 Pennsylvania Ave NW, Washington, DC, on October 7.",
    },
    entities: [
      {
        name: "Trump",
        type: "PERSON",
        metadata: {
          mid: "/m/0cqt90",
          wikipedia_url: "https://en.wikipedia.org/wiki/Donald_Trump",
        },
        salience: 0.7936003,
        mentions: [
          {
            text: {
              content: "Trump",
              beginOffset: 10,
            },
            type: "PROPER",
          },
          {
            text: {
              content: "President",
              beginOffset: 0,
            },
            type: "COMMON",
          },
        ],
      },
      {
        name: "White House",
        type: "LOCATION",
        metadata: {
          mid: "/m/081sq",
          wikipedia_url: "https://en.wikipedia.org/wiki/White_House",
        },
        salience: 0.09172433,
        mentions: [
          {
            text: {
              content: "White House",
              beginOffset: 36,
            },
            type: "PROPER",
          },
        ],
      },
      {
        name: "Pennsylvania Ave NW",
        type: "LOCATION",
        metadata: {
          mid: "/g/1tgb87cq",
        },
        salience: 0.085507184,
        mentions: [
          {
            text: {
              content: "Pennsylvania Ave NW",
              beginOffset: 65,
            },
            type: "PROPER",
          },
        ],
      },
      {
        name: "Washington, DC",
        type: "LOCATION",
        metadata: {
          mid: "/m/0rh6k",
          wikipedia_url: "https://en.wikipedia.org/wiki/Washington,_D.C.",
        },
        salience: 0.029168168,
        mentions: [
          {
            text: {
              content: "Washington, DC",
              beginOffset: 86,
            },
            type: "PROPER",
          },
        ],
      },
      {
        name: "1600 Pennsylvania Ave NW, Washington, DC",
        type: "ADDRESS",
        metadata: {
          country: "US",
          sublocality: "Fort Lesley J. McNair",
          locality: "Washington",
          street_name: "Pennsylvania Avenue Northwest",
          broad_region: "District of Columbia",
          narrow_region: "District of Columbia",
          street_number: "1600",
        },
        salience: 0,
        mentions: [
          {
            text: {
              content: "1600 Pennsylvania Ave NW, Washington, DC",
              beginOffset: 60,
            },
            type: "TYPE_UNKNOWN",
          },
        ],
      },
      {
        name: "1600",
        type: "NUMBER",
        metadata: {
          value: "1600",
        },
        salience: 0,
        mentions: [
          {
            text: {
              content: "1600",
              beginOffset: 60,
            },
            type: "TYPE_UNKNOWN",
          },
        ],
      },
      {
        name: "October 7",
        type: "DATE",
        metadata: {
          day: "7",
          month: "10",
        },
        salience: 0,
        mentions: [
          {
            text: {
              content: "October 7",
              beginOffset: 105,
            },
            type: "TYPE_UNKNOWN",
          },
        ],
      },
      {
        name: "7",
        type: "NUMBER",
        metadata: {
          value: "7",
        },
        salience: 0,
        mentions: [
          {
            text: {
              content: "7",
              beginOffset: 113,
            },
            type: "TYPE_UNKNOWN",
          },
        ],
      },
    ],
    documentSentiment: {
      magnitude: 4,
      score: Math.random() - 0.5,
    },
    language: "en",
    categories: [
      {
        name: "/News/Politics",
        confidence: 0.99,
      },
    ],
  };
  return new Promise((resolve, reject) => resolve(res));
};

export { analyze };
