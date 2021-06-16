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
