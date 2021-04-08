type Product = {
  name: string;
  icon: string;
  url: string;
};

const products: { [key: string]: Product } = {
  "app-engine": {
    name: "App Engine",
    icon: "/images/AppEngine-512-color.svg",
    url: "https://cloud.google.com/appengine",
  },
  bigquery: {
    name: "BigQuery",
    icon: "/cloud-icons/bigquery-512-color.svg",
    url: "https://cloud.google.com/bigquery",
  },
  build: {
    name: "Cloud Build",
    icon: "/images/cloud-build-512-color.svg",
    url: "https://cloud.google.com/build",
  },
  "speech-to-text": {
    name: "Cloud Speech-to-Text",
    icon: "/images/speech-to-text-512-color.svg",
    url: "https://cloud.google.com/speech-to-text",
  },
  "natural-language-api": {
    name: "Cloud Natural Language API",
    icon: "/images/cloud-natural-language-api-512-color.svg",
    url: "https://cloud.google.com/natural-language",
  },
  "translation-api": {
    name: "Cloud Translation API",
    icon: "/images/cloud-translation-api-512-color.svg",
    url: "https://cloud.google.com/translate",
  },
};

export default products;
