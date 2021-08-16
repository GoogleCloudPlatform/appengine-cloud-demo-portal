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

const README_URL =
  process.env.NEXT_PUBLIC_README_URL ||
  "https://github.com/GoogleCloudPlatform/appengine-cloud-demo-portal";

type Demo = {
  path: string;
  products: string[];
  icon: string;
  link?: string;
};

const demos: { [key: string]: Demo } = {
  readme: {
    path: "",
    products: [],
    icon: "/static/readme.jpg",
    link: README_URL,
  },
  contactCenterAnalysis: {
    path: "/contactCenterAnalysis",
    products: ["speech-to-text", "natural-language-api"],
    icon: "/static/contactCenterAnalysis/icon.jpg",
  },
  serverlessWebAppWithDevOps: {
    path: "/serverlessWebAppWithDevOps",
    products: ["app-engine", "build"],
    icon: "/static/serverlessWebAppWithDevOps/icon.jpg",
  },
  simultaneousInterpreter: {
    path: "/simultaneousInterpreter",
    products: ["speech-to-text", "translation-api"],
    icon: "/static/simultaneousInterpreter/icon.jpg",
  },
  wikipediaPageview: {
    path: "/wikipediaPageview",
    products: ["bigquery"],
    icon: "/static/wikipediaPageview/icon.jpg",
  },
};

const demoIds = Object.keys(demos);

export { demos, demoIds };
