const en = {
  title: "Google Cloud Demo Portal (preview)",
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
};

export default en;
