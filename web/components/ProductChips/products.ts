type Product = {
  name: string;
  icon: string;
  url: string;
};

const products: { [key: string]: Product } = {
  "app-engine": {
    name: "App Engine",
    icon: "/static/cloud-icons/AppEngine-512-color.svg",
    url: "https://cloud.google.com/appengine",
  },
  bigquery: {
    name: "BigQuery",
    icon: "/static/cloud-icons/bigquery-512-color.svg",
    url: "https://cloud.google.com/bigquery",
  },
  build: {
    name: "Cloud Build",
    icon: "/static/cloud-icons/cloud-build-512-color.svg",
    url: "https://cloud.google.com/build",
  },
  "speech-to-text": {
    name: "Cloud Speech-to-Text",
    icon: "/static/cloud-icons/speech-to-text-512-color.svg",
    url: "https://cloud.google.com/speech-to-text",
  },
  "natural-language-api": {
    name: "Cloud Natural Language API",
    icon: "/static/cloud-icons/cloud-natural-language-api-512-color.svg",
    url: "https://cloud.google.com/natural-language",
  },
  "translation-api": {
    name: "Cloud Translation API",
    icon: "/static/cloud-icons/cloud-translation-api-512-color.svg",
    url: "https://cloud.google.com/translate",
  },
};

export default products;
