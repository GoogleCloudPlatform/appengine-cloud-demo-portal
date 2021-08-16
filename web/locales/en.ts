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

const en = {
  title: "Google Cloud Demo Portal",
  changeLanguage: "Change language",
  howToUse: "How to use",
  home: {},
  readme: {
    title: "README",
    description: "Read me before using this site.",
  },
  contactCenterAnalysis: {
    title: "Contact Center Analysis",
    description:
      "Identify entities and understand sentiments from customer voices at contact centers.",
    instructions: [
      "Select a language which you speak.",
      "Click mic button and speak something in the language you selected.",
      "CLICK STOP BUTTON.",
      "Wait a moment. Then results are displayed.",
      "You can run it continuously and new results are displayed on the top.",
    ],
  },
  serverlessWebAppWithDevOps: {
    title: "Serverless Web App with DevOps",
    description:
      "This demo site is deployed from serverless CI/CD platform and is running on a serverless application platform.",
    instructions: [
      "No interactions.",
      "See the architecture and the source code.",
    ],
    gettingStarted: {
      overview: "Overview",
      appConfiguration: "App Engine Configuration",
      buildConfiguration: "Cloud Build Configuration",
      web: {
        overview:
          "Web frontend is developed with Next.js and written in TypeScript. " +
          "When a developer pushes the code to the main branch on GitHub, Cloud Build is triggered by a webhook from GitHub. " +
          "Cloud Build builds a production deployment, and deploys it to App Engine as the default service.",
        appConfiguration:
          "The following YAML is the app.yaml of this web frontend app, configuration file for App Engine. " +
          "If you want to host your Next.js or other Node.js app on App Engine, you can deploy it to App Engine just by preparing your app.yaml.",
        buildConfiguration:
          "The following YAML is the cloudbuild.yaml of this web frontend app, configuration file for Cloud Build. " +
          "There are three steps to build and deploy the web app. " +
          "You can also build and deploy your web app automatically with your configuration like this.",
      },
      api: {
        overview:
          "API is written in Go and running on App Engine as api service. " +
          "When a developer pushes the code to the main branch on GitHub, " +
          "Cloud Build is triggerd by a webhook from GitHub, " +
          "and then Cloud Build deploys it to App Engine as the api service.",
        appConfiguration:
          "The following YAML is the app.yaml, the configuration file for App Engine.",
        buildConfiguration:
          "The following YAML is cloudbuild.yaml, the configuration for Cloud Build." +
          "There is just one step to deploy the Go app to App Engine.",
      },
      dispatch: {
        description:
          "dispatch.yaml allows developers to overrice routing rules. " +
          "This demo app uses dispatch.yaml to route requests to /api to the api service and other requests to default (web) service." +
          "The following YAML is the dispatch.yaml for this demo app.",
      },
    },
  },
  simultaneousInterpreter: {
    title: "Simultaneous Interpreter",
    description:
      "Translate your speech into multiple languages simultaneously.",
    instructions: [
      "Select a language which you speak.",
      "Click mic button and speak something in the language you selected.",
      "CLICK STOP BUTTON.",
      "Wait a moment. Then translations are displayed.",
      "You can run it continuously and the results follow previous ones.",
      "If you want to filter languages to display, click [SELECT LANGUAGES] and choose langauges you want.",
    ],
    selectLanguages: "Select languages",
    selectLanguagesTitle: "Select languages to display",
    unselectAll: "Unselect all",
  },
  wikipediaPageview: {
    title: "Wikipedia Pageview",
    description:
      "Analyze and visualize pageviews of Wikipedia using BigQuery and BigQuery public datasets.",
    instructions: [
      "First of all, click 'RUN QUERY' with default settings.",
      "See the results: visualization, results table, SQL and job information.",
      "Next, change 'Group by' to 'Date' and run query.",
      "See the time series chart.",
      "After that, run query again as you like. For example,",
      "Look up in your own language with 'Wiki' field filled with 'en' or 'ja'.",
      "Analyze a specific topic using 'Title includes' field.",
      "Change the range of dates.",
    ],
    tableInformation: "Table information",
    tableInformationContent:
      "The wikipedia.pageviews table contains daily pageviews of articles for each language. " +
      "In this demo, we use the pageviews_2020 table that records pageviews in 2020. " +
      "It has 55 billions lines which size is 2.25TB.",
    controller: {
      titleIncludes: "Title includes",
      startDate: "Start date",
      endDate: "End date",
      orderBy: "Order by",
      descending: "Descending",
      ascending: "Ascending",
      groupBy: "Group by",
      title: "Title",
      date: "Date",
      queryCache: "Query cache",
      runQuery: "Run query",
    },
    result: {
      visualization: "Visualization",
      results: "Results",
      jobInformation: "Job information",
      parameters: "Parameters",
      startTime: "Start time",
      endTime: "End time",
      duration: "Duration",
      bytesProcessed: "Bytes processed",
      inputRows: "Input rows",
      cacheHit: "Cache hit",
      lineUnit: " lines",
    },
  },
};

export default en;
