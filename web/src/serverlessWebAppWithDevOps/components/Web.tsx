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

import {
  Box,
  createStyles,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";

import { useTranslation } from "../../../hooks/useTranslation";
import Code from "../../../components/Code";
import ExternalLink from "./ExternalLink";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      "& li": theme.typography.body1,
    },
    heading: {
      marginTop: theme.spacing(4),
      marginBottom: theme.spacing(2),
    },
  })
);

type Props = {
  hidden: boolean;
};

const appYaml = `runtime: nodejs14
instance_class: F1

handlers:
  - url: /.*
    secure: always
    script: auto

automatic_scaling:
  min_instances: 1`;

const cloudbuildYaml = `substitutions:
  _NODE_VERSION: "14.16.0"

steps:
  - name: "node:\${_NODE_VERSION}-buster-slim"
    dir: "web"
    entrypoint: "npm"
    args: ["install"]
  - name: "node:\${_NODE_VERSION}-buster-slim"
    dir: "web"
    entrypoint: "npm"
    args: ["run", "build"]
    env:
      - "NEXT_PUBLIC_GA_MEASUREMENT_ID=\${_NEXT_PUBLIC_GA_MEASUREMENT_ID}"
      - "NEXT_PUBLIC_README_URL=\${_NEXT_PUBLIC_README_URL}"
  - name: "gcr.io/google.com/cloudsdktool/cloud-sdk:slim"
    dir: "web"
    args:
      - gcloud
      - app
      - deploy
      - --project
      - $PROJECT_ID
      - --quiet`;

const Web: React.FC<Props> = ({ hidden }) => {
  const classes = useStyles();
  const { t } = useTranslation();
  const tp = t.serverlessWebAppWithDevOps.gettingStarted;
  const tt = t.serverlessWebAppWithDevOps.gettingStarted.web;

  return (
    <Box hidden={hidden} className={classes.root}>
      <Typography variant="h4" component="h3" className={classes.heading}>
        {tp.overview}
      </Typography>
      <Typography variant="body1" component="p">
        {tt.overview}
      </Typography>
      <ul>
        <li>
          <ExternalLink href="https://github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/tree/main/web">
            web source code on GitHub
          </ExternalLink>
        </li>
      </ul>

      <Typography variant="h4" component="h3" className={classes.heading}>
        {tp.appConfiguration}
      </Typography>
      <Typography variant="body1" component="p">
        {tt.appConfiguration}
      </Typography>
      <ul>
        <li>
          <ExternalLink href="https://github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/tree/main/web/app.yaml">
            web/app.yaml on GitHub
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://cloud.google.com/appengine/docs/standard/nodejs/config/appref">
            app.yaml reference
          </ExternalLink>
        </li>
      </ul>
      <Code language="yaml">{appYaml}</Code>

      <Typography variant="h4" component="h3" className={classes.heading}>
        {tp.buildConfiguration}
      </Typography>
      <Typography variant="body1" component="p">
        {tt.buildConfiguration}
      </Typography>
      <ul>
        <li>
          <ExternalLink href="https://github.com/GoogleCloudPlatform/appengine-cloud-demo-portal/blob/main/web/cloudbuild.yaml">
            web/cloudbuild.yaml on GitHub
          </ExternalLink>
        </li>
        <li>
          <ExternalLink href="https://cloud.google.com/build/docs/build-config">
            cloudbuild.yaml reference
          </ExternalLink>
        </li>
      </ul>
      <Code language="yaml">{cloudbuildYaml}</Code>
    </Box>
  );
};

export default Web;
